import { describe, it, expect, beforeEach, vi } from "vitest";
import crypto from "node:crypto";

// Mock env() so the verifier reads a known signing key + site URL.
const KEY = "test_signing_key";
let siteUrl = "https://www.tsd-modernization.com";
vi.mock("@/lib/env", () => ({
  env: () => ({
    SQUARE_WEBHOOK_SIGNATURE_KEY: KEY,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    SQUARE_WEBHOOK_URL: undefined,
  }),
}));

import { verifySquareWebhook } from "./webhook";

function sign(url: string, body: string): string {
  return crypto.createHmac("sha256", KEY).update(url + body).digest("base64");
}

const BODY = JSON.stringify({ type: "payment.updated", data: {} });

describe("verifySquareWebhook", () => {
  beforeEach(() => {
    siteUrl = "https://www.tsd-modernization.com";
  });

  it("accepts a signature computed against the configured www URL", () => {
    const sig = sign("https://www.tsd-modernization.com/api/square/webhook", BODY);
    expect(verifySquareWebhook(sig, BODY)).toBe(true);
  });

  it("accepts a signature computed against the apex variant (the real-world mismatch)", () => {
    // Square webhook was registered at the non-www apex, but NEXT_PUBLIC_SITE_URL is www.
    const sig = sign("https://tsd-modernization.com/api/square/webhook", BODY);
    expect(verifySquareWebhook(sig, BODY)).toBe(true);
  });

  it("also works when NEXT_PUBLIC_SITE_URL is the apex and Square used www", () => {
    siteUrl = "https://tsd-modernization.com";
    const sig = sign("https://www.tsd-modernization.com/api/square/webhook", BODY);
    expect(verifySquareWebhook(sig, BODY)).toBe(true);
  });

  it("rejects a signature made with the wrong key", () => {
    const bad = crypto
      .createHmac("sha256", "wrong_key")
      .update("https://www.tsd-modernization.com/api/square/webhook" + BODY)
      .digest("base64");
    expect(verifySquareWebhook(bad, BODY)).toBe(false);
  });

  it("rejects a missing signature header", () => {
    expect(verifySquareWebhook(null, BODY)).toBe(false);
  });

  it("rejects a tampered body", () => {
    const sig = sign("https://www.tsd-modernization.com/api/square/webhook", BODY);
    expect(verifySquareWebhook(sig, BODY + "tampered")).toBe(false);
  });
});
