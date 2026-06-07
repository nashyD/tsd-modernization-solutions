import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

let ipLimiter: Ratelimit | null = null;
let emailLimiter: Ratelimit | null = null;

function redis() {
  const e = env();
  if (!e.UPSTASH_REDIS_REST_URL || !e.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: e.UPSTASH_REDIS_REST_URL,
    token: e.UPSTASH_REDIS_REST_TOKEN,
  });
}

function getIpLimiter() {
  if (ipLimiter) return ipLimiter;
  const r = redis();
  if (!r) return null;
  ipLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(3, "1 d"),
    analytics: true,
    prefix: "audit:ip",
  });
  return ipLimiter;
}

function getEmailLimiter() {
  if (emailLimiter) return emailLimiter;
  const r = redis();
  if (!r) return null;
  emailLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(2, "1 d"),
    analytics: true,
    prefix: "audit:email",
  });
  return emailLimiter;
}

export async function checkAuditRateLimit(opts: {
  ip: string;
  email: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const ipL = getIpLimiter();
  const emailL = getEmailLimiter();
  if (!ipL || !emailL) {
    // Upstash not configured. Fail OPEN in dev for convenience, but fail CLOSED
    // in production — otherwise a missing env var silently disables the limiter
    // that throttles the (SSRF-capable) audit scraper and the Anthropic spend.
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        reason: "Audits are temporarily unavailable. Please try again shortly.",
      };
    }
    return { ok: true };
  }
  const [ipRes, emailRes] = await Promise.all([
    ipL.limit(opts.ip),
    emailL.limit(opts.email.toLowerCase()),
  ]);
  if (!ipRes.success) {
    return { ok: false, reason: "Too many audits from your network today. Try again tomorrow." };
  }
  if (!emailRes.success) {
    return { ok: false, reason: "You've already requested a couple of audits today. Reach out at hello@tsd-modernization.com if you need another." };
  }
  return { ok: true };
}
