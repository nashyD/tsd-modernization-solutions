import type { NextConfig } from "next";

// Content-Security-Policy. Shipped REPORT-ONLY first: the browser reports
// violations (devtools console) but blocks nothing, so it can't break the live
// pitch (Vapi voice, Calendly embed, QR, Supabase). Verify on a preview deploy
// with no violations, then flip CSP_ENFORCE to true. Dropping 'unsafe-inline'
// from script-src later needs per-request nonces (not wired here yet).
const CSP_ENFORCE = false;
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://*.squarecdn.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://api.qrserver.com https://*.calendly.com",
  `connect-src 'self' ${supabaseOrigin} https://*.supabase.co wss://*.supabase.co https://*.vapi.ai wss://*.vapi.ai https://*.daily.co wss://*.daily.co https://api.calendly.com`,
  "frame-src 'self' https://calendly.com https://*.calendly.com https://*.squarecdn.com",
  "media-src 'self' blob: https://*.vapi.ai https://*.daily.co",
].join("; ");

// Baseline security headers on every response. Permissions-Policy must keep
// geolocation (the "Near me" field tool) and microphone (the Vapi voice demo)
// enabled for same-origin.
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), microphone=(self), camera=()",
  },
  {
    key: CSP_ENFORCE
      ? "Content-Security-Policy"
      : "Content-Security-Policy-Report-Only",
    value: CSP,
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Puppeteer + the chromium-min loader (which uses tar-fs, brotli
  // decompress, and direct node:fs reads) need to stay outside the
  // Turbopack bundle. The 60MB chromium binary itself is downloaded at
  // runtime from GitHub releases on first invoke (see
  // src/lib/audit/pdf.tsx) and cached in /tmp for the lambda's lifetime.
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
