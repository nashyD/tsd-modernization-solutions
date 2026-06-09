import { useEffect, useRef, useState } from "react";
import {
  v, useFadeIn,
  DiamondDivider, EditorialMasthead, GradientText,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import PageShell from "./PageShell";

const CALENDLY_URL =
  "https://calendly.com/nashdavis-tsd-ventures/30min?primary_color=4B9CD3&hide_gdpr_banner=1";

export default function Book() {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  const [r3, f3] = useFadeIn(500);
  const calendlyRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !calendlyRef.current) return;
    let cancelled = false;

    function tryInit() {
      if (cancelled) return;
      if (window.Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calendlyRef.current,
        });
      } else {
        setTimeout(tryInit, 100);
      }
    }

    tryInit();
    return () => { cancelled = true; };
  }, [mounted]);

  return (
    <PageShell>
      <section style={{
        padding: `${SPACE["3xl"]} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <div ref={r1} style={{ ...f1, marginBottom: SPACE.xl }}>
          <EditorialMasthead items={["Fit Call", "Thirty Minutes", "No Slide Deck"]} />
        </div>

        <h1 ref={r2} style={{
          ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(36px, 5.6vw, 64px)",
          letterSpacing: "-2px", lineHeight: 1.06,
          color: v("text"), marginBottom: SPACE.lg,
          textAlign: "center",
        }}>
          Pick a time.
          <br />
          <GradientText>Talk to a founder.</GradientText>
        </h1>

        <DiamondDivider width={180} style={{ marginBottom: SPACE.lg }} />

        <p ref={r3} style={{
          ...f3, fontSize: "17px", lineHeight: 1.65, color: v("text-muted"),
          maxWidth: "660px", margin: `0 auto ${SPACE["2xl"]}`,
          textAlign: "center",
        }}>
          One of us hops on a thirty-minute call to walk through what you're
          trying to fix and how a custom build scoped to your business would
          take it on. No commitment, no slide deck, written proposal within
          48 hours if there's a fit.
        </p>

        <div
          ref={calendlyRef}
          style={{
            // Calendly's iframe is height:100%, which only resolves against a
            // parent with a *definite* height. min-height leaves height:auto,
            // so the iframe collapsed to ~150px and the calendar was clipped.
            height: "720px",
            // initInlineWidget({parentElement}) doesn't add the
            // .calendly-inline-widget class, so we must supply its
            // position:relative ourselves — otherwise Calendly's absolutely
            // positioned loading spinner escapes the container (top:50% of the
            // viewport), never gets covered by the iframe, and spins forever.
            position: "relative",
            background: "var(--glass-bg-strong)",
            backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
            WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--glass-radius)",
            overflow: "hidden",
            boxShadow: "var(--glass-shadow)",
          }}
        />

        <p style={{
          marginTop: SPACE.xl, textAlign: "center",
          fontSize: "13px", color: v("text-dim"),
          fontFamily: "var(--font-display)", fontStyle: "italic",
        }}>
          Prefer to write us a longer note?{" "}
          <a href="/contact" style={{
            color: v("accent"), textDecoration: "underline",
            textUnderlineOffset: "3px", textDecorationThickness: "1px",
            fontWeight: 600,
          }}>
            Use the contact form instead
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
