import type { NextConfig } from "next";

// Baseline security headers on every response. No CSP yet — a strict policy
// needs the Vapi / Supabase / Square / QR / analytics origins allowlisted and
// careful testing; the headers below are safe and high-value. Permissions-Policy
// must keep geolocation (the "Near me" field tool) and microphone (the Vapi
// voice demo) enabled for same-origin.
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
