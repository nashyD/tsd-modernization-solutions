/* ── Sentry — frontend error monitoring ─────────────────────────
   Captures uncaught JS errors and unhandled promise rejections in
   production. Env-gated like analytics — set VITE_SENTRY_DSN to turn
   on; without it nothing loads, dev console stays clean.

   Set VITE_SENTRY_DSN in Vercel → Project → Settings → Environment
   Variables. The DSN format is `https://<key>@<org>.ingest.sentry.io/<id>`
   and is *not* a secret — it's a public ingest token meant to ship in
   client-side bundles.

   Sample rates kept low to stay inside Sentry's free-tier quota:
     tracesSampleRate: 0.1   — 10% of transactions traced for perf
*/

import * as Sentry from "@sentry/react";

const DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!DSN) return;
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE || "production",
    tracesSampleRate: 0.1,
  });
}
