import "server-only";
import dns from "node:dns/promises";
import net from "node:net";

/**
 * SSRF-hardened fetch for the audit pipeline.
 *
 * The audit scraper fetches a URL that comes straight from an unauthenticated
 * public form (`business_url`). Without guards that is a server-side request
 * forgery primitive: an attacker can point it at cloud metadata
 * (169.254.169.254), loopback, or RFC-1918 hosts and use the serverless
 * function as a proxy into the internal network.
 *
 * Defenses here:
 *  1. scheme allow-list (http/https only — no file:, gopher:, etc.)
 *  2. resolve the hostname and reject if ANY resolved address is private,
 *     loopback, link-local, CGNAT, ULA, multicast, or otherwise non-public
 *  3. follow redirects MANUALLY, re-validating every hop, so a public host
 *     can't 30x-redirect into the internal range
 *  4. cap the response body so a huge/slow body can't exhaust the 300s lambda
 *
 * Residual: a determined attacker could still win a DNS-rebind race between our
 * `dns.lookup` check and `fetch`'s own resolution. Closing that fully needs a
 * pinned-IP dispatcher; for a public marketing audit tool the resolve-then-
 * revalidate-each-hop approach above removes the practical exposure.
 */

export const AUDIT_USER_AGENT =
  "Mozilla/5.0 (compatible; TSD-Audit-Bot/1.0; +https://tsd-modernization.com/audit)";

/** Thrown when a URL/host is rejected by the SSRF guard (vs. a normal network error). */
export class SsrfBlockedError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "SsrfBlockedError";
  }
}

export interface SafeFetchResult {
  ok: boolean;
  status: number;
  body: string;
  finalUrl: string;
}

function parseV4(ip: string): [number, number, number, number] | null {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const parts = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (parts.some((n) => n < 0 || n > 255)) return null;
  return parts as [number, number, number, number];
}

function v4Blocked(a: number, b: number, c: number, _d: number): boolean {
  if (a === 0) return true; // 0.0.0.0/8 "this host"
  if (a === 10) return true; // private
  if (a === 127) return true; // loopback
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64/10
  if (a === 169 && b === 254) return true; // link-local + cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // private
  if (a === 192 && b === 168) return true; // private
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0.0/24 (IETF protocol)
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 (benchmarking)
  if (a >= 224) return true; // 224/4 multicast, 240/4 reserved, 255.255.255.255 broadcast
  return false;
}

/**
 * True if `ip` (a literal IPv4 or IPv6 address) is in a non-public range we
 * refuse to let the audit scraper reach. Defaults to BLOCKED on anything it
 * can't positively classify as public.
 */
export function isBlockedIp(ip: string): boolean {
  const kind = net.isIP(ip);
  if (kind === 4) {
    const v4 = parseV4(ip);
    return v4 ? v4Blocked(...v4) : true;
  }
  if (kind === 6) {
    const lower = ip.toLowerCase();

    // IPv4-mapped/embedded in dotted form: ::ffff:1.2.3.4 or ::1.2.3.4
    if (lower.includes(".")) {
      const v4 = parseV4(lower.slice(lower.lastIndexOf(":") + 1));
      return v4 ? v4Blocked(...v4) : true;
    }
    // IPv4-mapped in hex form: ::ffff:a9fe:a9fe
    if (lower.startsWith("::ffff:")) {
      const groups = lower.slice("::ffff:".length).split(":");
      if (groups.length === 2 && groups.every((g) => /^[0-9a-f]{1,4}$/.test(g))) {
        const hi = parseInt(groups[0], 16);
        const lo = parseInt(groups[1], 16);
        return v4Blocked((hi >> 8) & 255, hi & 255, (lo >> 8) & 255, lo & 255);
      }
    }
    if (lower === "::" || lower === "::1") return true; // unspecified / loopback
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // ULA fc00::/7
    if (/^fe[89ab]/.test(lower)) return true; // link-local fe80::/10
    if (lower.startsWith("ff")) return true; // multicast ff00::/8
    return false;
  }
  return true; // not a valid IP literal — block conservatively
}

/**
 * Validate a URL is safe to fetch: http(s) scheme, and every address its host
 * resolves to is public. Throws {@link SsrfBlockedError} otherwise. Returns the
 * parsed URL on success.
 */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new SsrfBlockedError("invalid_url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new SsrfBlockedError("bad_scheme");
  }
  const host = u.hostname.replace(/^\[/, "").replace(/\]$/, ""); // strip IPv6 brackets

  if (net.isIP(host)) {
    if (isBlockedIp(host)) throw new SsrfBlockedError("blocked_ip");
    return u;
  }

  let addrs: { address: string }[];
  try {
    addrs = await dns.lookup(host, { all: true });
  } catch {
    throw new SsrfBlockedError("dns_failed");
  }
  if (!addrs.length) throw new SsrfBlockedError("dns_empty");
  for (const a of addrs) {
    if (isBlockedIp(a.address)) throw new SsrfBlockedError("blocked_ip");
  }
  return u;
}

async function readCapped(res: Response, maxBytes: number): Promise<string> {
  const stream = res.body;
  if (!stream) return "";
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const remaining = maxBytes - total;
      if (value.byteLength >= remaining) {
        chunks.push(value.subarray(0, remaining));
        total = maxBytes;
        try {
          await reader.cancel();
        } catch {
          // best-effort
        }
        break;
      }
      chunks.push(value);
      total += value.byteLength;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // best-effort
    }
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder("utf-8").decode(out);
}

/**
 * SSRF-safe replacement for `fetch` in the audit pipeline. Validates the URL
 * and every redirect hop against {@link assertPublicUrl}, caps the body, and
 * applies a timeout. Throws {@link SsrfBlockedError} for blocked URLs and a
 * normal Error for network/timeout failures.
 */
export async function safeFetch(
  rawUrl: string,
  opts: { timeoutMs: number; maxBytes: number; maxRedirects?: number }
): Promise<SafeFetchResult> {
  const maxRedirects = opts.maxRedirects ?? 5;
  let currentUrl = rawUrl;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const target = await assertPublicUrl(currentUrl);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs);
    let res: Response;
    try {
      res = await fetch(target, {
        signal: ctrl.signal,
        redirect: "manual",
        headers: { "User-Agent": AUDIT_USER_AGENT, Accept: "text/html,*/*" },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) {
        return { ok: false, status: res.status, body: "", finalUrl: target.toString() };
      }
      try {
        await res.body?.cancel();
      } catch {
        // best-effort
      }
      currentUrl = new URL(loc, target).toString(); // re-validated at top of next hop
      continue;
    }

    const body = await readCapped(res, opts.maxBytes);
    return { ok: res.ok, status: res.status, body, finalUrl: target.toString() };
  }

  throw new SsrfBlockedError("too_many_redirects");
}
