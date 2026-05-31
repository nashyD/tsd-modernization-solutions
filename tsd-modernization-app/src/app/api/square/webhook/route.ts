import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrderState } from "@/lib/square/checkout";

export const runtime = "nodejs";

function verify(req: NextRequest, rawBody: string): boolean {
  const e = env();
  const key = e.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) return false;
  const sig = req.headers.get("x-square-hmacsha256-signature") ?? "";
  const url = `${e.NEXT_PUBLIC_SITE_URL}/api/square/webhook`;
  const hmac = crypto
    .createHmac("sha256", key)
    .update(url + rawBody)
    .digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verify(req, raw)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    type?: string;
    data?: { object?: { payment?: { order_id?: string; status?: string } } };
  };
  const orderId = event.data?.object?.payment?.order_id;
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
  if (
    state !== "COMPLETED" &&
    event.data?.object?.payment?.status !== "COMPLETED"
  ) {
    return NextResponse.json({ ok: true });
  }

  await sb
    .from("prospect_deposits")
    .update({ status: "paid", square_payment_id: orderId })
    .eq("id", deposit.id);

  // Load the prospect and auto-create the client (carry fields forward).
  const { data: prospect } = await sb
    .from("prospects")
    .select("*")
    .eq("id", deposit.prospect_id)
    .single();
  if (!prospect) return NextResponse.json({ ok: true });

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
      .update({ status: "won", converted_client_id: client?.id ?? null })
      .eq("id", prospect.id);
    if (prospect.source_lead_id && client) {
      await sb
        .from("leads")
        .update({ converted_client_id: client.id })
        .eq("id", prospect.source_lead_id);
    }
  } else {
    await sb.from("prospects").update({ status: "won" }).eq("id", prospect.id);
  }

  return NextResponse.json({ ok: true });
}
