import { describe, it, expect } from "vitest";
import { resolveDepositAmount, centsFromDollars } from "./pricing";

describe("resolveDepositAmount", () => {
  const base = { targetDollars: 1500, maxDiscountPct: 10 };

  it("returns the target when no code is given", () => {
    const r = resolveDepositAmount({ ...base, code: null, codePct: null });
    expect(r.amountDollars).toBe(1500);
    expect(r.appliedPct).toBe(0);
    expect(r.codeAccepted).toBe(false);
  });

  it("applies a code within the floor", () => {
    const r = resolveDepositAmount({ ...base, code: "g10", codePct: 10 });
    expect(r.amountDollars).toBe(1350); // 1500 - 10%
    expect(r.appliedPct).toBe(10);
    expect(r.codeAccepted).toBe(true);
  });

  it("rejects a code deeper than the floor (no discount, generic miss)", () => {
    const r = resolveDepositAmount({ ...base, code: "g15", codePct: 15 });
    expect(r.amountDollars).toBe(1500); // floor holds
    expect(r.appliedPct).toBe(0);
    expect(r.codeAccepted).toBe(false);
  });

  it("treats an unknown code (null pct) as no discount", () => {
    const r = resolveDepositAmount({ ...base, code: "zzz", codePct: null });
    expect(r.amountDollars).toBe(1500);
    expect(r.codeAccepted).toBe(false);
  });

  it("never returns below zero or NaN", () => {
    const r = resolveDepositAmount({
      targetDollars: 0,
      maxDiscountPct: 100,
      code: "g10",
      codePct: 10,
    });
    expect(r.amountDollars).toBe(0);
  });
});

describe("centsFromDollars", () => {
  it("converts to integer cents", () => {
    expect(centsFromDollars(1350)).toBe(135000);
    expect(centsFromDollars(19.99)).toBe(1999);
  });
});
