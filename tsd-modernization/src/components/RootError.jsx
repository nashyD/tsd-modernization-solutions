import { useEffect } from "react";
import { useRouteError, Link } from "react-router-dom";
import { captureException } from "../sentry.js";

/* Router-level error boundary. Without an `errorElement`, any render-time throw
   anywhere in the tree falls through to vite-react-ssg's bare "Unexpected
   Application Error" white screen — which is exactly the symptom reported on the
   pricing page. This replaces that with a branded, recoverable UI, reports the
   real error to Sentry so the root cause is visible, and auto-recovers from the
   most common intermittent cause: a stale dynamic-import chunk after a deploy
   (an open tab references chunk hashes the new deploy replaced, so the next
   click fails to import). */

const RELOAD_GUARD = "tsd_chunk_reload";

function isChunkLoadError(err) {
  const msg = (err && (err.message || String(err))) || "";
  return /dynamically imported module|Loading chunk|module script failed|Failed to fetch/i.test(
    msg,
  );
}

export default function RootError() {
  const error = useRouteError();

  useEffect(() => {
    captureException(error);
    // eslint-disable-next-line no-console
    console.error("[RootError]", error);

    if (isChunkLoadError(error)) {
      // One hard reload pulls the current chunks; the guard (cleared on any
      // successful load in main.jsx) prevents a reload loop if it still fails.
      try {
        if (!sessionStorage.getItem(RELOAD_GUARD)) {
          sessionStorage.setItem(RELOAD_GUARD, "1");
          window.location.reload();
        }
      } catch {
        /* sessionStorage blocked — skip auto-reload, show the fallback. */
      }
    }
  }, [error]);

  const reload = () => {
    try {
      sessionStorage.removeItem(RELOAD_GUARD);
    } catch {
      /* noop */
    }
    window.location.reload();
  };

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        gap: "18px",
        fontFamily: "var(--font-body)",
        color: "var(--c-text)",
        background: "var(--c-bg)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5vw, 40px)",
          letterSpacing: "-0.5px",
          margin: 0,
        }}
      >
        Something went sideways
      </h1>
      <p
        style={{
          fontSize: "16px",
          lineHeight: 1.6,
          color: "var(--c-text-muted)",
          maxWidth: "440px",
          margin: 0,
        }}
      >
        We hit an unexpected error loading this page. A refresh usually clears it
        — and we&apos;ve been notified either way.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={reload}
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "15px",
            color: "#fff",
            background: "var(--c-accent, #4b9cd3)",
            fontFamily: "var(--font-body)",
          }}
        >
          Reload the page
        </button>
        <Link
          to="/"
          onClick={() => {
            try {
              sessionStorage.removeItem(RELOAD_GUARD);
            } catch {
              /* noop */
            }
          }}
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "1px solid var(--c-divider, rgba(255,255,255,0.18))",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--c-text)",
          }}
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
