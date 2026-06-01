import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // `server-only` is a Next.js runtime guard with no Node entry point;
      // stub it so server libs can be unit-tested under vitest.
      "server-only": resolve(__dirname, "./src/test/server-only-stub.ts"),
    },
  },
});
