import { useEffect, useRef, useState } from "react";
import { C, v, useFadeIn, DiamondDivider } from "../shared";
import PageShell from "./PageShell";

/* /book — synchronous conversion surface. Inline Calendly embed for the
   30-minute "Fit Call" event. Sibling page to /contact: contact runs the
   async Web3Forms track for prospects who'd rather write a longer
   message; /book is for the "I'm ready to talk now" crowd.

   Calendly's widget script + CSS load once globally in index.html, so
   window.Calendly is available by the time this component mounts. The
   `mounted` gate prevents Calendly's iframe from being injected during
   vite-react-ssg's static prerender pass — the widget is client-only.

   Today the URL is on Nash's individual Calendly schedule
   (`nashdavis-tsd-ventures/30min`); when Bishop + Grant join a Calendly
   Teams workspace the URL constant swaps to a team round-robin event. */

const CALENDLY_URL =
  "https://calendly.com/nashdavis-tsd-ventures/30min?primary_color=4B9CD3&hide_gdpr_banner=1";

export default function Book() {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  const [r3, f3] = useFadeIn(500);
  const calendlyRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !calendlyRef.current) return;
    let cancelled = false;

    function tryInit() {
      if (cancelled) return;
      if (window.Calendly && calendlyRef.current) {
        // Clear any prior children in case the SPA re-mounted this route;
        // otherwise we'd stack a second iframe on top of the first.
        calendlyRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calendlyRef.current,
        });
      } else {
        // Calendly script may still be in flight (slow network, blockers).
        // Poll briefly. The async <script> in index.html means this usually
        // resolves within ~200ms after first paint.
        setTimeout(tryInit, 100);
      }
    }

    tryInit();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  return (
    <PageShell>
      <section style={{
        padding: "60px 24px 80px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <div ref={r1} style={{
          ...f1, display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
          fontSize: "10px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
          color: v("text-muted"), marginBottom: "32px", flexWrap: "wrap",
        }}>
          <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
          <span>Fit Call</span>
          <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
          <span>Thirty Minutes</span>
          <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
          <span>No Slide Deck</span>
          <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
        </div>

        <h1 ref={r2} style={{
          ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(32px, 5.2vw, 56px)", letterSpacing: "-1.5px", lineHeight: 1.1,
          color: v("text"), marginBottom: "20px", textAlign: "center",
        }}>
          Pick a time.
          <br />
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Talk to a founder.</span>
        </h1>

        <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

        <p ref={r3} style={{
          ...f3, fontSize: "17px", lineHeight: 1.7, color: v("text-muted"),
          maxWidth: "640px", margin: "0 auto 40px", textAlign: "center",
        }}>
          One of us hops on a thirty-minute call to walk through what you're
          trying to fix and which of our three founding-cohort offers fits
          the shape of the problem. No commitment, no slide deck, written
          proposal within 48 hours if there's a fit.
        </p>

        <div
          ref={calendlyRef}
          style={{
            minHeight: "700px",
            background: v("surface"),
            border: `1px solid ${v("surface-border")}`,
            borderRadius: "20px",
            overflow: "hidden",
          }}
        />

        <p style={{
          marginTop: "32px", textAlign: "center",
          fontSize: "13px", color: v("text-dim"),
          fontFamily: "var(--font-display)", fontStyle: "italic",
        }}>
          Prefer to write us a longer note?{" "}
          <a href="/contact" style={{ color: v("accent"), textDecoration: "underline" }}>
            Use the contact form instead
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
