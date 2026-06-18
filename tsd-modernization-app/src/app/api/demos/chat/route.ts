import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getBusiness } from "@/lib/demos/businesses";
import { ask } from "@/lib/demos/chat";
import type { ChatMessage, DemoLang } from "@/lib/demos/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_HISTORY = 16;
const LANGS = new Set<DemoLang>(["en", "es"]);

// Self-contained limiter so the public concierge stays resilient: it reads
// Upstash creds directly rather than coupling to the strict env() validator the
// rest of the app uses. When Upstash is absent it falls back to a per-instance
// cap (below) instead of fully open — this route bills Claude tokens.
let limiter: Ratelimit | null | undefined;
function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  limiter =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(30, "1 m"),
          analytics: true,
          prefix: "demos:concierge:ip",
        })
      : null;
  return limiter;
}

// Per-instance fallback: 30 requests / minute / IP when Upstash is unconfigured.
const memHits = new Map<string, { count: number; reset: number }>();
function memAllow(ip: string): boolean {
  const now = Date.now();
  const b = memHits.get(ip);
  if (!b || now > b.reset) {
    memHits.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (b.count >= 30) return false;
  b.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const l = getLimiter();
  const allowed = l ? (await l.limit(ip)).success : memAllow(ip);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const { slug, messages, lang } = (body ?? {}) as {
    slug?: string;
    messages?: unknown;
    lang?: string;
  };

  const business = typeof slug === "string" ? getBusiness(slug) : undefined;
  if (!business) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const clean: ChatMessage[] = messages
    .filter(
      (m): m is ChatMessage =>
        m !== null &&
        typeof m === "object" &&
        typeof (m as ChatMessage).content === "string" &&
        ((m as ChatMessage).role === "user" ||
          (m as ChatMessage).role === "assistant"),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-MAX_HISTORY);

  if (clean.length === 0) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const safeLang: DemoLang = LANGS.has(lang as DemoLang)
    ? (lang as DemoLang)
    : "en";

  try {
    const result = await ask(business, clean, safeLang);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[demos/chat] route error:", err);
    return NextResponse.json({ error: "model" }, { status: 500 });
  }
}
