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
    expect(r.low).toBe(2900); // 2900 * 1.0
    expect(r.high).toBe(4000);
    expect(r.aiCount).toBe(0); // website is not an AI product
    expect(r.managedMonthly).toBe(0);
  });

  it("applies the team-size multiplier and rounds to 100", () => {
    // established = 1.3x; website low 2900*1.3 = 3770 -> 3800, high 4000*1.3 = 5200
    const r = estimate("established", ["website"]);
    expect(r.low).toBe(3800);
    expect(r.high).toBe(5200);
  });

  it("counts AI products for Managed AI tiering", () => {
    // front_desk + concierge = 2 AI products -> $147/mo
    const r = estimate("small", ["front_desk", "concierge"]);
    expect(r.aiCount).toBe(2);
    expect(r.managedMonthly).toBe(147);
    // low = (1200+4100) * 1.0 = 5300
    expect(r.low).toBe(5300);
  });

  it("counts every AI product (Front Desk + Concierge are the only two)", () => {
    const allAi = PRODUCTS.filter((p) => p.ai).map((p) => p.id);
    expect(allAi.sort()).toEqual(["concierge", "front_desk"]);
    const r = estimate("small", allAi);
    expect(r.aiCount).toBe(2);
    expect(r.managedMonthly).toBe(147);
  });

  it("prices the Booking/Lead Engine SKU (regression: used to be $0 via a stale id map)", () => {
    const r = estimate("small", ["booking_bridge"]);
    expect(r.low).toBe(2400);
    expect(r.high).toBe(3400);
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

  it("defaults to managed ownership", () => {
    expect(estimate("small", ["website"]).ownership).toBe("managed");
  });

  it("owned applies OWNED_MULT to the one-time range", () => {
    // website small owned: 2900*1.0*1.25 = 3625 -> 3600; 4000*1.25 = 5000
    const r = estimate("small", ["website"], "owned");
    expect(r.ownership).toBe("owned");
    expect(r.low).toBe(3600);
    expect(r.high).toBe(5000);
  });

  it("owned composes with the team-size multiplier", () => {
    // established website owned: 2900*1.3*1.25 = 4712.5 -> 4700; 4000*1.3*1.25 = 6500
    const r = estimate("established", ["website"], "owned");
    expect(r.low).toBe(4700);
    expect(r.high).toBe(6500);
  });

  it("owned zeroes the Managed AI monthly but still counts AI products", () => {
    const r = estimate("small", ["front_desk", "concierge"], "owned");
    expect(r.aiCount).toBe(2);
    expect(r.managedMonthly).toBe(0);
  });
});

describe("depositFromSelection", () => {
  it("is depositPct% of the low estimate", () => {
    // website small low = 2900; 10% = 290
    expect(depositFromSelection("small", ["website"], 10)).toBe(290);
  });

  it("scales with team size", () => {
    // established website low = 3800; 10% = 380
    expect(depositFromSelection("established", ["website"], 10)).toBe(380);
  });

  it("is zero with no selection", () => {
    expect(depositFromSelection("small", [], 10)).toBe(0);
  });

  it("clamps a nonsense pct into range", () => {
    expect(depositFromSelection("small", ["website"], 999)).toBe(2900); // 100%
    expect(depositFromSelection("small", ["website"], -5)).toBe(0);
  });

  it("every SIZES tier has a positive multiplier", () => {
    for (const s of SIZES) expect(s.mult).toBeGreaterThan(0);
  });

  it("owned ownership flows through to the deposit", () => {
    // owned website small low = 3600; 10% = 360
    expect(depositFromSelection("small", ["website"], 10, "owned")).toBe(360);
  });
});
