import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time string comparison for secrets (internal API tokens, cron
 * bearer). Avoids leaking length/prefix via response-timing on `===`. Returns
 * false for empty inputs so an unset/empty secret can never match.
 */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
