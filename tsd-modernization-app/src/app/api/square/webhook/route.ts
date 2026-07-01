import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrderState } from "@/lib/square/checkout";
import { verifySquareWebhook } from "@/lib/square/webhook";
import { findOrInviteOwner } from "@/lib/clients";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-square-hmacsha256-signature");
  if (!verifySquareWebhook(sig, raw)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    type?: string;
    data?: {
      object?: { payment?: { id?: string; order_id?: string; status?: string } };
    };
  };
  const payment = event.data?.object?.payment;
  const orderId = payment?.order_id;
  if (!orderId) return NextResponse.json({ ok: true }); // not a payment event we track

  const sb = supabaseAdmin();
  const { data: deposit } = await sb
    .from("prospect_deposits")
    .select("id,prospect_id,status")
    .eq("square_order_id", orderId)
    .maybeSingle();
  if (!deposit) return NextResponse.json({ ok: true });
  if (deposit.status === "paid") return NextResponse.json({ ok: true }); // idempotent

  // Defense in depth: confirm with Square the order is actually completed/paid.
  const state = await getOrderState(orderId);
  if (state !== "COMPLETED" && payment?.status !== "COMPLETED") {
    return NextResponse.json({ ok: true });
  }

  // Atomic, conditional paid-transition: only the caller that flips pending->paid
  // proceeds to create the client. A concurrent webhook retry gets zero rows back
  // and bails, so we never double-create the client. Store the real payment id.
  const { data: claimed } = await sb
    .from("prospect_deposits")
    .update({ status: "paid", square_payment_id: payment?.id ?? orderId })
    .eq("id", deposit.id)
    .eq("status", "pending")
    .select("id");
  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ ok: true }); // another retry already handled it
  }

  // Load the prospect and auto-create the client (carry fields forward).
  const { data: prospect } = await sb
    .from("prospects")
    .select("*")
    .eq("id", deposit.prospect_id)
    .single();
  if (!prospect) return NextResponse.json({ ok: true });

  // The deposit IS the stage move: record it in the event log (the funnel's
  // proposal→deposit denominator) before flipping status. Best-effort — a
  // logging hiccup must never bounce a payment webhook.
  const recordWonEvent = async () => {
    const { error } = await sb.from("prospect_stage_events").insert({
      prospect_id: prospect.id,
      from_status: prospect.status,
      to_status: "won",
      disposition: "deposit_paid",
      channel: "square",
      detail: `deposit ${payment?.id ?? orderId}`,
      actor_user_id: null,
      actor_email: "square-webhook@system",
    });
    if (error) console.error("[square/webhook] stage event insert failed", error);
  };

  if (!prospect.converted_client_id) {
    const { data: client } = await sb
      .from("clients")
      .insert({
        name: prospect.business_name,
        website_url: prospect.demo_site_url || prospect.business_url,
        package_tier: prospect.package_tier || "website_ai_bundle",
        vapi_assistant_id: prospect.vapi_assistant_id,
      })
      .select("id")
      .single();
    await sb
      .from("prospects")
      .update({
        status: "won",
        converted_client_id: client?.id ?? null,
        stage_entered_at: new Date().toISOString(),
      })
      .eq("id", prospect.id);
    await recordWonEvent();
    if (prospect.source_lead_id && client) {
      await sb
        .from("leads")
        .update({ converted_client_id: client.id })
        .eq("id", prospect.source_lead_id);
    }
    // Close the funnel's last leg: give the paying client portal access. Without
    // this the conversion created an orphaned clients row with no client_users
    // link, so the new client couldn't log in until an admin noticed. Best-effort
    // — never fail the payment webhook on an invite hiccup.
    if (client && prospect.email) {
      try {
        await findOrInviteOwner({ clientId: client.id, email: prospect.email });
      } catch (err) {
        console.error("[square/webhook] owner invite failed", err);
      }
    }
  } else {
    await sb
      .from("prospects")
      .update({ status: "won", stage_entered_at: new Date().toISOString() })
      .eq("id", prospect.id);
    await recordWonEvent();
  }

  return NextResponse.json({ ok: true });
}
