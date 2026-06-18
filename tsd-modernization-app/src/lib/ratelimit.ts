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

/**
 * Per-instance fixed-window fallback used when Upstash isn't configured. It is
 * NOT shared across lambdas, so it won't stop a distributed flood — but it caps
 * a single hot instance, which is far safer than the previous fully-open
 * behavior on the Claude/Vapi/OTP cost vectors. Keep Upstash configured in prod
 * for a real cross-instance limit.
 */
const memBuckets = new Map<string, { count: number; reset: number }>();
function memAllow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = memBuckets.get(key);
  if (!b || now > b.reset) {
    memBuckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Best-effort client IP. Prefer Vercel's `x-real-ip` (set by the platform to the
 * true client address) over the left-most `x-forwarded-for` hop, which a client
 * can spoof. Falls back to the first XFF hop, then "unknown".
 */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "unknown";
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

let showcaseVoiceLimiter: Ratelimit | null = null;
function getShowcaseVoiceLimiter() {
  if (showcaseVoiceLimiter) return showcaseVoiceLimiter;
  const r = redis();
  if (!r) return null;
  showcaseVoiceLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(10, "1 d"),
    analytics: true,
    prefix: "showcase:voice:ip",
  });
  return showcaseVoiceLimiter;
}

let loginIpLimiter: Ratelimit | null = null;
let loginEmailLimiter: Ratelimit | null = null;
function getLoginLimiters() {
  if (loginIpLimiter && loginEmailLimiter)
    return { ip: loginIpLimiter, email: loginEmailLimiter };
  const r = redis();
  if (!r) return null;
  loginIpLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "login:ip",
  });
  loginEmailLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "login:email",
  });
  return { ip: loginIpLimiter, email: loginEmailLimiter };
}

/** Per-IP daily cap on public showcase voice-demo grants (Vapi cost control).
 *  Falls back to a per-instance cap if Upstash isn't configured; the per-prospect
 *  DB cap is still the authoritative limit. */
export async function checkShowcaseVoiceRateLimit(ip: string): Promise<boolean> {
  const l = getShowcaseVoiceLimiter();
  if (!l) return memAllow(`voice:${ip || "unknown"}`, 10, DAY_MS);
  const res = await l.limit(ip || "unknown");
  return res.success;
}

export async function checkAuditRateLimit(opts: {
  ip: string;
  email: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const ipL = getIpLimiter();
  const emailL = getEmailLimiter();
  if (!ipL || !emailL) {
    // Upstash not configured — degrade to a per-instance cap instead of fully open.
    const email = opts.email.toLowerCase();
    if (!memAllow(`audit:ip:${opts.ip}`, 3, DAY_MS)) {
      return { ok: false, reason: "Too many audits from your network today. Try again tomorrow." };
    }
    if (!memAllow(`audit:email:${email}`, 2, DAY_MS)) {
      return { ok: false, reason: "You've already requested a couple of audits today. Reach out at hello@tsd-modernization.com if you need another." };
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

/** Throttle magic-link requests (email-bombing / OTP-quota abuse). Per-IP and
 *  per-email; degrades to a per-instance cap when Upstash is unconfigured. */
export async function checkLoginRateLimit(opts: {
  ip: string;
  email: string;
}): Promise<boolean> {
  const email = opts.email.toLowerCase();
  const lims = getLoginLimiters();
  if (!lims) {
    return (
      memAllow(`login:ip:${opts.ip}`, 10, HOUR_MS) &&
      memAllow(`login:email:${email}`, 5, HOUR_MS)
    );
  }
  const [ipRes, emailRes] = await Promise.all([
    lims.ip.limit(opts.ip),
    lims.email.limit(email),
  ]);
  return ipRes.success && emailRes.success;
}
