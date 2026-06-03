import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { centsFromDollars, resolveDepositAmount } from "@/lib/sales/pricing";
import { depositFromSelection, estimate } from "@/lib/sales/estimator";
import { createPaymentLink, squareConfigured } from "@/lib/square/checkout";
import type { Json } from "@/lib/supabase/types";

export const runtime = "nodejs";

const Body = z.object({
  prospect_id: z.string().uuid().optional(),
  token: z.string().optional(),
  code: z.string().optional(),
});

interface ProspectForCheckout {
  id: string;
  business_name: string;
  team_size: string;
  selected_services: string[];
  deposit_pct: number;
}

export async function POST(req: NextRequest) {
  if (!squareConfigured()) {
    return NextResponse.json(
      { error: "Payments aren't enabled yet." },
      { status: 503 },
    );
  }
  const body = Body.parse(await req.json());
  const sb = supabaseAdmin();

  const cols =
    "id,business_name,team_size,selected_services,deposit_pct";
  let prospect: ProspectForCheckout | null = null;
  if (body.prospect_id) {
    const {
      data: { user },
    } = await (await supabaseServer()).auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const { data } = await sb
      .from("prospects")
      .select(cols)
      .eq("id", body.prospect_id)
      .single();
    prospect = data as ProspectForCheckout | null;
  } else if (body.token) {
    const { data } = await sb
      .from("prospects")
      .select(cols)
      .eq("share_token", body.token)
      .eq("share_enabled", true)
      .maybeSingle();
    prospect = data as ProspectForCheckout | null;
  }
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found." }, { status: 404 });
  }

  // Recompute the deposit server-side from the stored selection. The browser
  // never sends a price.
  const services = Array.isArray(prospect.selected_services)
    ? prospect.selected_services
    : [];
  const amount = depositFromSelection(
    prospect.team_size,
    services,
    prospect.deposit_pct,
  );
  if (amount <= 0) {
    return NextResponse.json(
      { error: "Select at least one service before paying a deposit." },
      { status: 400 },
    );
  }
  const est = estimate(prospect.team_size, services);

  // Coupon: the browser sends only the code string; the server looks up its
  // pct in discount_codes and recomputes the amount. No per-prospect floor in
  // the current model, so any active code applies (floor = 100).
  let appliedPct = 0;
  let codeApplied: string | null = null;
  let finalAmount = amount;
  if (body.code && body.code.trim()) {
    const codeNorm = body.code.trim().toLowerCase();
    const { data: dc } = await sb
      .from("discount_codes")
      .select("pct,active")
      .eq("code", codeNorm)
      .maybeSingle();
    const resolved = resolveDepositAmount({
      targetDollars: amount,
      maxDiscountPct: 100,
      code: codeNorm,
      codePct: dc?.active ? dc.pct : null,
    });
    finalAmount = resolved.amountDollars;
    appliedPct = resolved.appliedPct;
    if (resolved.codeAccepted) codeApplied = codeNorm;
  }

  const { data: deposit, error: depErr } = await sb
    .from("prospect_deposits")
    .insert({
      prospect_id: prospect.id,
      amount: finalAmount,
      status: "pending",
      code: codeApplied,
      meta: {
        team_size: prospect.team_size,
        selected_services: services,
        estimate_low: est.low,
        estimate_high: est.high,
        deposit_pct: prospect.deposit_pct,
        applied_pct: appliedPct,
        amount_before_discount: amount,
      } as unknown as Json,
    })
    .select("id")
    .single();
  if (depErr || !deposit) {
    return NextResponse.json(
      { error: "Could not create deposit." },
      { status: 500 },
    );
  }

  const link = await createPaymentLink({
    name: `Deposit — ${prospect.business_name}`,
    amountCents: centsFromDollars(finalAmount),
    idempotencyKey: deposit.id,
    redirectUrl: `${env().NEXT_PUBLIC_SITE_URL}/sales/thanks`,
    referenceId: deposit.id,
  });

  await sb
    .from("prospect_deposits")
    .update({
      square_payment_link_id: link.id,
      square_order_id: link.orderId,
    })
    .eq("id", deposit.id);

  return NextResponse.json({
    url: link.url,
    amount_dollars: finalAmount,
    applied_pct: appliedPct,
  });
}
