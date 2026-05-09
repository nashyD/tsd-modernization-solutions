import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Puppeteer + the Sparticuz Chromium binary need to stay outside the
  // Turbopack/Webpack bundle — they ship native deps (the Chromium
  // executable, plus pdfkit/fontkit-style binaries) that the bundler
  // can't statically trace. Without this they break the build.
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
