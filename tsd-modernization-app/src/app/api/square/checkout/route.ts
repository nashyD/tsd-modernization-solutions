import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { resolveDepositAmount, centsFromDollars } from "@/lib/sales/pricing";
import { createPaymentLink, squareConfigured } from "@/lib/square/checkout";

export const runtime = "nodejs";

const Body = z.object({
  prospect_id: z.string().uuid().optional(),
  token: z.string().optional(),
  code: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!squareConfigured()) {
    return NextResponse.json(
      { error: "Payments aren't enabled yet." },
      { status: 503 },
    );
  }
  const body = Body.parse(await req.json());
  const sb = supabaseAdmin();

  // Resolve the prospect either by admin-supplied id (requires login) or public token.
  let prospect: {
    id: string;
    business_name: string;
    deposit_target: number;
    max_discount_pct: number;
  } | null = null;
  if (body.prospect_id) {
    const {
      data: { user },
    } = await (await supabaseServer()).auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { data } = await sb
      .from("prospects")
      .select("id,business_name,deposit_target,max_discount_pct")
      .eq("id", body.prospect_id)
      .single();
    prospect = data;
  } else if (body.token) {
    const { data } = await sb
      .from("prospects")
      .select("id,business_name,deposit_target,max_discount_pct")
      .eq("share_token", body.token)
      .eq("share_enabled", true)
      .maybeSingle();
    prospect = data;
  }
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found." }, { status: 404 });
  }

  // Look up the code's pct (server-side; never trust the client's number).
  let codePct: number | null = null;
  const codeRaw = body.code?.trim().toLowerCase() || null;
  if (codeRaw) {
    const { data: c } = await sb
      .from("discount_codes")
      .select("pct,active")
      .eq("code", codeRaw)
      .maybeSingle();
    codePct = c && c.active ? c.pct : null;
  }

  const resolved = resolveDepositAmount({
    targetDollars: Number(prospect.deposit_target),
    maxDiscountPct: Number(prospect.max_discount_pct),
    code: codeRaw,
    codePct,
  });
  if (resolved.amountDollars <= 0) {
    return NextResponse.json(
      { error: "Deposit amount isn't set." },
      { status: 400 },
    );
  }

  const { data: deposit, error: depErr } = await sb
    .from("prospect_deposits")
    .insert({
      prospect_id: prospect.id,
      amount: resolved.amountDollars,
      code: resolved.codeAccepted ? codeRaw : null,
      status: "pending",
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
    amountCents: centsFromDollars(resolved.amountDollars),
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
    amount_dollars: resolved.amountDollars,
    applied_pct: resolved.appliedPct,
  });
}
