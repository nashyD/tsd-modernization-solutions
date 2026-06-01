import "server-only";
import crypto from "node:crypto";
import { env } from "@/lib/env";

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
  if (!key) return false;
  const sig = signatureHeader ?? "";
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
