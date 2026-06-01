import "server-only";
import crypto from "node:crypto";
import { env } from "@/lib/env";

/**
 * The notification URLs the signature might have been computed against.
 * Square signs HMAC-SHA256(signatureKey, notificationURL + rawBody) using the
 * EXACT URL registered in the dashboard. The canonical host (www vs apex) is
 * easy to mismatch against NEXT_PUBLIC_SITE_URL, so we accept a match against
 * any known-good variant. This stays cryptographically sound — forging a
 * signature for ANY of these URLs still requires the signing key.
 */
function candidateUrls(): string[] {
  const e = env();
  const urls = new Set<string>();
  const add = (base: string | undefined) => {
    if (!base) return;
    urls.add(`${base.replace(/\/$/, "")}/api/square/webhook`);
  };
  add(e.SQUARE_WEBHOOK_URL); // explicit override, if set
  add(e.NEXT_PUBLIC_SITE_URL);
  // Accept the www <-> apex variant of NEXT_PUBLIC_SITE_URL too.
  add(
    e.NEXT_PUBLIC_SITE_URL.includes("://www.")
      ? e.NEXT_PUBLIC_SITE_URL.replace("://www.", "://")
      : e.NEXT_PUBLIC_SITE_URL.replace("://", "://www."),
  );
  return [...urls];
}

/**
 * Verify a Square webhook signature (HMAC-SHA256 over notificationUrl + rawBody).
 * Lives in lib (not the route file) so the route module only exports its handler.
 */
export function verifySquareWebhook(
  signatureHeader: string | null,
  rawBody: string,
): boolean {
  const e = env();
  const key = e.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key || !signatureHeader) return false;
  const expected = Buffer.from(signatureHeader);
  for (const url of candidateUrls()) {
    const hmac = crypto
      .createHmac("sha256", key)
      .update(url + rawBody)
      .digest("base64");
    const candidate = Buffer.from(hmac);
    if (
      candidate.length === expected.length &&
      crypto.timingSafeEqual(candidate, expected)
    ) {
      return true;
    }
  }
  return false;
}
