import { describe, it, expect } from "vitest";
import { suggestOwner, inCorridor } from "./routing";

describe("inCorridor", () => {
  it("matches the leadscout towns regardless of case", () => {
    expect(inCorridor("Gastonia", null)).toBe(true);
    expect(inCorridor("BELMONT", null)).toBe(true);
    expect(inCorridor("Mount Holly", null)).toBe(true);
  });

  it("normalizes the Mt Holly abbreviation", () => {
    expect(inCorridor("Mt Holly", null)).toBe(true);
    expect(inCorridor("Mt. Holly", null)).toBe(true);
  });

  it("treats west Charlotte (Steele Creek) as corridor, east Charlotte as not", () => {
    expect(inCorridor("Charlotte", -80.99)).toBe(true); // Steele Creek
    expect(inCorridor("Charlotte", -80.75)).toBe(false); // uptown/east
    expect(inCorridor("Charlotte", null)).toBe(false); // unknown position
  });

  it("rejects non-corridor towns", () => {
    expect(inCorridor("Concord", null)).toBe(false);
    expect(inCorridor(null, -81.1)).toBe(false);
  });
});

describe("suggestOwner", () => {
  it("routes concierge to bishop even inside the corridor", () => {
    expect(
      suggestOwner({
        city: "Gastonia",
        lng: -81.18,
        primary_product: "concierge",
        phone: "704-555-0100",
      }),
    ).toBe("bishop");
  });

  it("routes a corridor storefront to grant", () => {
    expect(
      suggestOwner({
        city: "Belmont",
        lng: -81.04,
        primary_product: "front_desk",
        phone: "704-555-0100",
      }),
    ).toBe("grant");
  });

  it("routes a reachable non-corridor business to bishop", () => {
    expect(
      suggestOwner({
        city: "Concord",
        lng: -80.58,
        primary_product: "website",
        phone: "704-555-0100",
      }),
    ).toBe("bishop");
    expect(
      suggestOwner({
        city: "Huntersville",
        lng: -80.84,
        primary_product: "website",
        phone: null,
        email: "owner@example.com",
      }),
    ).toBe("bishop");
  });

  it("leaves unreachable non-corridor candidates unassigned", () => {
    expect(
      suggestOwner({
        city: "Monroe",
        lng: -80.55,
        primary_product: "website",
        phone: null,
      }),
    ).toBe("unassigned");
  });
});
