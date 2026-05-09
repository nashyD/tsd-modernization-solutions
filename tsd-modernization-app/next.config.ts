import type { NextConfig } from "next";

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
};

export default nextConfig;
