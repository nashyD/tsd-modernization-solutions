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
  // `serverExternalPackages` keeps `@sparticuz/chromium`'s JS out of the
  // bundle, but Next's output-file tracer doesn't realise the package
  // also reads `bin/chromium.br`, `bin/swiftshader.tar.br`, etc. at
  // runtime. Without this, the PDF route on Vercel throws:
  //   "The input directory '.../node_modules/@sparticuz/chromium/bin'
  //    does not exist. ... you must externalize @sparticuz/chromium ..."
  // — even though we *did* externalize it. The fix is to explicitly
  // include the bin/ folder for the PDF route.
  outputFileTracingIncludes: {
    "/api/audit/[id]/pdf": [
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
};

export default nextConfig;
