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
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !calendlyRef.current) return;
    let cancelled = false;
    let tries = 0;

    function tryInit() {
      if (cancelled) return;
      if (window.Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calendlyRef.current,
        });
      } else if (tries < 100) {
        // Retry for ~10s while Calendly's script finishes loading.
        tries += 1;
        setTimeout(tryInit, 100);
      } else {
        // Script never arrived (blocked/offline) — surface a real fallback
        // instead of an empty box that spins forever.
        setLoadFailed(true);
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
          maxWidth: "660px", margin: `0 auto ${SPACE.lg}`,
          textAlign: "center",
        }}>
          One of us hops on a thirty-minute call to walk through what you're
          trying to fix and how a custom build scoped to your business would
          take it on. No commitment, no slide deck, written proposal within
          48 hours if there's a fit.
        </p>

        <p style={{
          ...f3, fontSize: "15px", lineHeight: 1.6, color: v("text"),
          maxWidth: "640px", margin: `0 auto ${SPACE["2xl"]}`,
          textAlign: "center", fontWeight: 600,
        }}>
          Every fit call includes a free <span style={{ color: v("accent") }}>cost-cut audit</span>. We tear down your software and vendor bills and show you what to cut before you spend a dollar. The kill list is yours to keep either way.
        </p>

        <p style={{
          ...f3, textAlign: "center", maxWidth: "760px",
          margin: `0 auto ${SPACE.lg}`,
          fontSize: "13px", fontWeight: 600, color: v("text-muted"),
        }}>
          Free 30-minute call{" "}
          <span aria-hidden="true" style={{ color: v("accent") }}>·</span> A cost-cut audit you keep{" "}
          <span aria-hidden="true" style={{ color: v("accent") }}>·</span> 48-hour written proposal{" "}
          <span aria-hidden="true" style={{ color: v("accent") }}>·</span> 100% money-back guarantee
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

        {loadFailed && (
          <p style={{
            marginTop: SPACE.md, textAlign: "center",
            fontSize: "15px", lineHeight: 1.6, color: v("text"),
            maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
          }}>
            Calendar slow to load? Call{" "}
            <a href="tel:+19808905815" style={{ color: v("accent"), fontWeight: 600 }}>(980) 890-5815</a>{" "}
            or use the contact form below and we&apos;ll get you booked.
          </p>
        )}

        <p style={{
          marginTop: SPACE.xl, textAlign: "center",
          fontSize: "13px", color: v("text-dim"),
          fontFamily: "var(--font-body)", fontStyle: "normal",
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
