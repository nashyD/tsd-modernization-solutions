/**
 * Deposit pricing + discount-floor logic. PURE — no IO, no env.
 * The single source of truth for how much Square charges. Server-only callers
 * pass the prospect's own target + floor and the looked-up code pct; the browser
 * never sends a price.
 */
export interface ResolveDepositInput {
  targetDollars: number;
  maxDiscountPct: number; // the silent floor (0-100)
  code: string | null; // raw code the user typed (for echo only)
  codePct: number | null; // pct from discount_codes, or null if code unknown/inactive
}

export interface ResolvedDeposit {
  amountDollars: number;
  appliedPct: number;
  codeAccepted: boolean;
}

export function resolveDepositAmount(input: ResolveDepositInput): ResolvedDeposit {
  const target = Math.max(0, Number(input.targetDollars) || 0);
  const floor = clampPct(input.maxDiscountPct);
  const pct = input.codePct == null ? 0 : clampPct(input.codePct);

  // A code only counts if it exists AND is within the prospect's floor.
  const accepted =
    input.code != null && input.codePct != null && pct > 0 && pct <= floor;
  const appliedPct = accepted ? pct : 0;
  const amount = round2(target * (1 - appliedPct / 100));

  return { amountDollars: Math.max(0, amount), appliedPct, codeAccepted: accepted };
}

export function centsFromDollars(dollars: number): number {
  return Math.round((Number(dollars) || 0) * 100);
}

function clampPct(n: number): number {
  const v = Number(n) || 0;
  return Math.min(100, Math.max(0, v));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
