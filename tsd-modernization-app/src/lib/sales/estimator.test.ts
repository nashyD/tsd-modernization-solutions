import { describe, it, expect } from "vitest";
import { estimate, depositFromSelection, SIZES, PRODUCTS } from "./estimator";

describe("estimate", () => {
  it("returns zero for an empty selection", () => {
    const r = estimate("small", []);
    expect(r.low).toBe(0);
    expect(r.high).toBe(0);
    expect(r.managedMonthly).toBe(0);
  });

  it("computes website at the small (1.0x) tier", () => {
    const r = estimate("small", ["website"]);
    expect(r.low).toBe(3000); // 3000 * 1.0
    expect(r.high).toBe(6000);
    expect(r.aiCount).toBe(0); // website is not an AI product
    expect(r.managedMonthly).toBe(0);
  });

  it("applies the team-size multiplier and rounds to 100", () => {
    // established = 1.3x; website low 3000*1.3 = 3900, high 6000*1.3 = 7800
    const r = estimate("established", ["website"]);
    expect(r.low).toBe(3900);
    expect(r.high).toBe(7800);
  });

  it("counts AI products for Managed AI tiering", () => {
    // frontDesk + concierge + booking = 3 AI products -> $297/mo
    const r = estimate("small", ["frontDesk", "concierge", "booking"]);
    expect(r.aiCount).toBe(3);
    expect(r.managedMonthly).toBe(297);
    // low = (1200+4000+1200) * 1.0 = 6400
    expect(r.low).toBe(6400);
  });

  it("caps Managed AI at 5 AI products", () => {
    const allAi = PRODUCTS.filter((p) => p.ai).map((p) => p.id); // 5 AI products
    const r = estimate("small", allAi);
    expect(r.aiCount).toBe(5);
    expect(r.managedMonthly).toBe(497);
  });

  it("flags the larger tier", () => {
    expect(estimate("larger", ["website"]).isLarger).toBe(true);
    expect(estimate("small", ["website"]).isLarger).toBe(false);
  });

  it("ignores unknown service ids and falls back on unknown size", () => {
    const r = estimate("bogus-size", ["website", "not-a-real-service"]);
    expect(r.serviceIds).toEqual(["website"]);
    expect(r.sizeId).toBe("small"); // default fallback
  });
});

describe("depositFromSelection", () => {
  it("is depositPct% of the low estimate", () => {
    // website small low = 3000; 10% = 300
    expect(depositFromSelection("small", ["website"], 10)).toBe(300);
  });

  it("scales with team size", () => {
    // established website low = 3900; 10% = 390
    expect(depositFromSelection("established", ["website"], 10)).toBe(390);
  });

  it("is zero with no selection", () => {
    expect(depositFromSelection("small", [], 10)).toBe(0);
  });

  it("clamps a nonsense pct into range", () => {
    expect(depositFromSelection("small", ["website"], 999)).toBe(3000); // 100%
    expect(depositFromSelection("small", ["website"], -5)).toBe(0);
  });

  it("every SIZES tier has a positive multiplier", () => {
    for (const s of SIZES) expect(s.mult).toBeGreaterThan(0);
  });
});
