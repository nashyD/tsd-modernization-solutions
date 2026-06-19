import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  C, v, useFadeIn, useCountUp,
  DiamondDivider, RippleButton, Button,
  Eyebrow, ChapterRule, GradientText, EditorialMasthead, PillBadge,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { ArrowRightIcon } from "../icons";
import BookCallButton from "../components/BookCallButton";

/* ── Hero ──────────────────────────────────────────────────────── */
/* Layout: text-first headline above a framed Charlotte timelapse.
   The timelapse is no longer the full-bleed background — it's mood,
   contained. The background is a navy-on-blueprint composition that
   ties the page to the "Modernization" identity without competing
   with the type. */
function Hero() {
  const [r1, f1] = useFadeIn(150);
  const [r2, f2] = useFadeIn(350);
  const [r3, f3] = useFadeIn(550);
  const [r4, f4] = useFadeIn(750);
  const [r5, f5] = useFadeIn(950);
  const [r6, f6] = useFadeIn(1150);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Video autoplay strategy preserved from prior implementation:
     iOS Safari is unreliable on autoplay, so we re-attempt on every
     lifecycle event AND on the first user gesture (which Safari always
     honors). A poster overlay above the video covers any tap-to-play
     chrome until the `playing` event fires. */
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    let cancelled = false;
    const tryPlay = () => {
      if (cancelled || !el) return;
      const p = el.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {});
      }
    };
    el.addEventListener("loadedmetadata", tryPlay);
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    const onVis = () => { if (document.visibilityState === "visible") tryPlay(); };
    document.addEventListener("visibilitychange", onVis);

    const gestureEvents = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"];
    const onFirstGesture = () => {
      gestureEvents.forEach((evt) =>
        document.removeEventListener(evt, onFirstGesture, { capture: true, passive: true })
      );
      tryPlay();
    };
    gestureEvents.forEach((evt) =>
      document.addEventListener(evt, onFirstGesture, { capture: true, passive: true })
    );

    tryPlay();
    return () => {
      cancelled = true;
      el.removeEventListener("loadedmetadata", tryPlay);
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVis);
      gestureEvents.forEach((evt) =>
        document.removeEventListener(evt, onFirstGesture, { capture: true, passive: true })
      );
    };
  }, [isMobile]);

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: "72px", paddingBottom: "96px",
      background: "var(--c-hero-bg)",
    }}>
      {/* Blueprint grid — architectural lines that say "Modernization"
          without overpowering the type. Theme-aware: subtle Carolina on
          navy in dark, subtle navy on cream in light. Radial mask fades
          the grid toward the edges so it never reads as a hard boundary. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(var(--c-hero-grid) 1px, transparent 1px),
          linear-gradient(90deg, var(--c-hero-grid) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, #000 0%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, #000 0%, transparent 100%)",
      }} />

      {/* Carolina aurora behind the headline — a large soft glow that
          gives the type a guaranteed contrast pocket. Lower opacity in
          light mode so it doesn't wash out against cream. */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "4%", left: "50%", transform: "translateX(-50%)",
        width: "min(1100px, 100%)", height: "560px", zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, var(--c-hero-aurora) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Charlotte skyline photograph — theme-aware. Dark mode uses a
          twilight cinematic shot of uptown; light mode uses a daytime
          shot. Positioned to peek out at the sides of and below the
          frame so the editorial frame reads as set against the actual
          city. Top + bottom mask gradients fade the photo into the
          section background so the photo never has hard edges. */}
      <div aria-hidden="true" style={{
        position: "absolute", left: 0, right: 0, bottom: "120px",
        height: "560px", zIndex: 0, pointerEvents: "none",
        backgroundImage: "var(--c-hero-skyline)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 45%",
        backgroundSize: "cover",
        opacity: "var(--c-hero-skyline-opacity)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
      }} />

      {/* Subtle grain — kept from prior implementation for tactile depth.
          Blend mode and opacity swap by theme so the grain reads on
          both navy and cream. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        opacity: "var(--c-hero-grain-opacity)",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        backgroundSize: "180px 180px",
        mixBlendMode: "var(--c-hero-grain-blend)",
      }} />

      {/* Content */}
      <div style={{
        maxWidth: "880px", textAlign: "center", position: "relative", zIndex: 2,
        padding: "0 24px",
      }}>
        <div ref={r1} style={{
          ...f1, marginBottom: "14px",
          color: "var(--c-hero-text-soft)",
        }}>
          <EditorialMasthead
            items={["Charlotte Metro", "Web + AI Studio", "Built Your Way"]}
            color="var(--c-hero-text-soft)"
          />
        </div>

        <h1 ref={r2} style={{
          ...f2,
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(32px, 4.6vw, 56px)",
          letterSpacing: "-2px", lineHeight: 1.04,
          color: "var(--c-hero-text)", marginBottom: SPACE.sm,
        }}>
          We find the money
          <br />
          your business is leaking —
          <br />
          {/* Same bold sans as the rest of the headline; emphasis via the brand
              accent instead of an italic serif (cleaner + far more legible). */}
          <span style={{ color: "var(--c-accent)" }}>and build what stops it.</span>
        </h1>

        <DiamondDivider width={150} style={{ marginBottom: SPACE.md }} />

        <p ref={r3} style={{
          ...f3,
          fontSize: "16px", lineHeight: 1.55, fontWeight: 500,
          color: "var(--c-hero-text-soft)",
          maxWidth: "580px", margin: "0 auto 20px",
        }}>
          Missed after-hours calls, slow quotes, forgotten subscriptions — one local bakery was losing $540 a month until we cut it. Custom websites and AI for established Charlotte businesses. <span style={{ fontWeight: 700, color: "var(--c-hero-text)" }}>Priced to your size — managed by us, or owned by you.</span>
        </p>

        <div ref={r4} style={{
          ...f4, display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
        }}>
          <BookCallButton variant="primary" refSource="home-hero">
            Book a fit call
          </BookCallButton>
          <Link to="/savings" style={{ textDecoration: "none" }}>
            <Button as="span" variant="editorial" size="lg">
              See what you're losing
            </Button>
          </Link>
        </div>

        {/* Tertiary audit affordance — lowest-commitment first action. Plain
            <a> because /audit is a Vercel rewrite to the Next.js app, not a
            react-router route. */}
        <div style={{
          ...f4, marginTop: "14px", textAlign: "center", fontSize: "13px",
        }}>
          <a href="/audit" style={{
            color: "var(--c-hero-text-muted)", textDecoration: "none",
            borderBottom: "1px solid var(--c-hero-rule)",
            paddingBottom: "1px",
            transition: "color 0.15s ease, border-color 0.15s ease",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--c-hero-text)";
              e.currentTarget.style.borderBottomColor = "var(--c-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--c-hero-text-muted)";
              e.currentTarget.style.borderBottomColor = "var(--c-hero-rule)";
            }}
          >
            Or run a free presence audit →
          </a>
        </div>
      </div>

      {/* Framed timelapse — Charlotte motion as setting, not full-bleed
          atmosphere. Editorial chrome (hairline rim, layered shadow +
          Carolina glow) keeps it premium without aping macOS window UI.
          Border + shadow swap by theme; frame interior bg stays dark in
          both modes since the video itself is dark content. */}
      <div ref={r6} style={{
        ...f6,
        position: "relative", zIndex: 2,
        marginTop: "32px",
        width: "min(1080px, calc(100% - 48px))",
        aspectRatio: "16 / 9",
        borderRadius: RADIUS["2xl"],
        overflow: "hidden",
        border: "1px solid var(--c-hero-frame-border)",
        background: "var(--c-hero-frame-bg)",
        boxShadow: "var(--c-hero-frame-shadow)",
      }}>
        <video
          ref={videoRef}
          key={isMobile ? "mobile" : "desktop"}
          className="hero-video"
          autoPlay muted loop playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          poster={isMobile ? "/hero-loop-mobile-poster.webp" : "/hero-loop-poster.webp"}
          onPlaying={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
          onWaiting={() => setVideoPlaying(false)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            background: "var(--c-hero-frame-bg)",
            pointerEvents: "none",
          }}
        >
          <source src={isMobile ? "/hero-loop-mobile.mp4" : "/hero-loop.mp4"} type="video/mp4" />
        </video>

        <img
          src={isMobile ? "/hero-loop-mobile-poster.webp" : "/hero-loop-poster.webp"}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            opacity: videoPlaying ? 0 : 1,
            transition: "opacity 0.6s ease",
            pointerEvents: "none",
          }}
        />

        {/* Inner top-edge highlight — a single hairline of light gives
            the surface dimensional lift without tipping into UI chrome. */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 0%, var(--c-hero-frame-rim-highlight) 50%, transparent 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Cohort scarcity strip — moved below the frame so it doesn't
          push the visual below the fold. Reads as an editorial caption
          to the timelapse. Flanking rules hide on mobile so the inline
          group fits cleanly on narrow viewports. */}
      <div ref={r5} style={{
        ...f5, marginTop: "32px",
        position: "relative", zIndex: 2,
        display: "flex", alignItems: "center",
        gap: isMobile ? "10px" : "14px",
        justifyContent: "center", flexWrap: "wrap",
        fontSize: isMobile ? "10px" : "11px",
        fontWeight: 600,
        letterSpacing: isMobile ? "1.6px" : "2.5px",
        textTransform: "uppercase",
        color: "var(--c-hero-text-muted)",
        padding: "0 12px",
      }}>
        {!isMobile && (
          <span style={{ flex: "0 0 32px", height: "1px", background: "var(--c-hero-rule)" }} />
        )}
        <span style={{ whiteSpace: "nowrap" }}>Managed or owned</span>
        <span style={{ color: "var(--c-accent)", fontSize: "7px" }}>{"◆"}</span>
        <span style={{ whiteSpace: "nowrap" }}>Charlotte-built</span>
        <span style={{ color: "var(--c-accent)", fontSize: "7px" }}>{"◆"}</span>
        <span style={{ whiteSpace: "nowrap" }}>Money-back guarantee</span>
        {!isMobile && (
          <span style={{ flex: "0 0 32px", height: "1px", background: "var(--c-hero-rule)" }} />
        )}
      </div>

      {/* Section bottom blend — softens the transition into the next
          section without a hard rule. */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
        background: "linear-gradient(to bottom, transparent 0%, var(--c-bg) 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />
    </section>
  );
}

/* ── Segment strip ────────────────────────────────────────────── */
const SEGMENTS = [
  "Salons & spas",
  "Specialty automotive",
  "Wholesale & supply",
  "Studios & makers",
  "Professional services",
  "Specialty retail",
];

function SegmentStrip() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade,
      padding: "clamp(24px, 5vw, 36px) 20px",
      borderTop: `1px solid ${v("divider")}`,
      borderBottom: `1px solid ${v("divider")}`,
      background: "transparent",
      position: "relative",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "clamp(12px, 3vw, 24px)",
        flexWrap: "wrap", maxWidth: "1100px", margin: "0 auto",
        textAlign: "center",
      }}>
        <Eyebrow style={{ whiteSpace: "nowrap" }}>Who we build for</Eyebrow>
        {/* Each trade is its own flex item with whiteSpace:nowrap so multi-word
            names like "Garage Doors" never split mid-name. The wrapper is
            display:flex with flex-wrap:wrap so the line breaks BETWEEN trades
            on narrow viewports — relying on inline whitespace for break
            opportunities was unreliable on iOS Safari (no whitespace between
            adjacent JSX <span>s = no break opportunity = single overflowing
            line on phones). */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          alignItems: "center", rowGap: "4px",
          fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
          fontSize: "clamp(15px, 2vw, 22px)", color: v("text"),
          lineHeight: 1.5, letterSpacing: "0.1px",
        }}>
          {SEGMENTS.map((seg, i) => (
            <span key={seg} style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
              {seg}
              {i < SEGMENTS.length - 1 && (
                <span aria-hidden="true" style={{
                  color: v("accent"), fontStyle: "normal",
                  margin: "0 clamp(6px, 1.2vw, 10px)",
                }}>
                  {"·"}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Service ticker ────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "TSD Front Desk",
  "TSD Concierge",
  "Booking automation",
  "Custom websites",
  "Lead engines",
  "Cost-cut audits",
  "48-hour proposals",
  "Managed or owned",
];

function ServiceTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section aria-hidden="true" style={{
      position: "relative", overflow: "hidden",
      borderBottom: `1px solid ${v("divider")}`,
      padding: "20px 0",
      background: "transparent",
    }}>
      <style>{`
        @keyframes tickerSlide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-track { animation: tickerSlide 65s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
      {/* Edge fades so the ticker bleeds into the page rather than chopping
          mid-letter at the viewport edges. */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: "120px", zIndex: 2,
        background: `linear-gradient(to right, ${v("bg")} 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "120px", zIndex: 2,
        background: `linear-gradient(to left, ${v("bg")} 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />
      <div className="ticker-track" style={{ display: "flex", whiteSpace: "nowrap", gap: "56px", width: "max-content" }}>
        {loop.map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: "56px",
            fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 34px)",
            color: v("text-muted"), letterSpacing: "0.5px",
          }}>
            {item}
            <span style={{ color: v("accent"), fontSize: "10px", fontStyle: "normal" }}>{"◆"}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Stats — editorial "by the numbers" block ──────────────────── */
function Stats() {
  const [headRef, headFade] = useFadeIn(0);
  const [count540, ref540] = useCountUp(540, 1600);
  const [count100, ref100] = useCountUp(100, 1400);

  return (
    <section style={{
      padding: `${SPACE["4xl"]} clamp(20px, 4vw, 48px) ${SPACE["3xl"]}`,
      maxWidth: "1200px", margin: "0 auto",
    }}>
      <div ref={headRef} style={{ ...headFade, marginBottom: SPACE["2xl"] }}>
        <ChapterRule label="By the numbers" num="01" />
      </div>

      <div style={{
        display: "grid", gap: "clamp(16px, 2.5vw, 32px)",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        alignItems: "stretch",
      }} className="stats-grid">
        <style>{`
          @media (max-width: 760px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .stats-hero { padding: 32px !important; }
            .stats-hero-num { font-size: clamp(96px, 22vw, 140px) !important; }
          }
        `}</style>

        {/* Hero stat — the bakery teardown */}
        <div ref={ref540} className="stats-hero" style={{
          position: "relative",
          padding: "56px",
          borderRadius: "var(--glass-radius)",
          background: "linear-gradient(160deg, var(--glass-bg) 0%, var(--glass-bg-strong) 100%)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: "340px",
          boxShadow: "var(--glass-shadow)",
        }}>
          {/* Background diamond — decorative */}
          <span aria-hidden="true" style={{
            position: "absolute", top: "-40px", right: "-40px",
            fontSize: "240px", color: v("accent"), opacity: 0.06,
            lineHeight: 1, pointerEvents: "none",
          }}>{"◆"}</span>

          {/* Top hairline */}
          <span aria-hidden="true" style={{
            position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(75,156,211,0.45), transparent)",
            pointerEvents: "none",
          }} />

          <Eyebrow>Found &amp; Cut</Eyebrow>

          <div style={{ position: "relative" }}>
            <div className="stats-hero-num" style={{
              fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
              fontSize: "clamp(96px, 13vw, 156px)", lineHeight: 1.05, letterSpacing: "-4px",
              background: C.gradientAccent,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: 0,
              paddingBottom: "0.08em",
              fontFeatureSettings: '"tnum" 1',
            }}>
              <span style={{
                fontFamily: "var(--font-body)", fontStyle: "normal", fontSize: "0.5em",
                letterSpacing: "-2px", marginRight: "4px", fontWeight: 800,
              }}>$</span>
              {count540}
              <span style={{
                fontFamily: "var(--font-body)", fontStyle: "normal", fontSize: "0.32em",
                letterSpacing: "0", marginLeft: "10px", fontWeight: 600,
              }}>/mo</span>
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(20px, 2.4vw, 26px)",
              fontWeight: 700, color: v("text"), lineHeight: 1.2,
              marginTop: SPACE.lg, marginBottom: SPACE.sm,
              letterSpacing: "-0.4px",
            }}>
              Found and cut at one local bakery.
            </div>
            <div style={{
              fontSize: "14px", lineHeight: 1.7, color: v("text-muted"), maxWidth: "480px",
            }}>
              A website vendor and a domain middleman, gone in one audit — $6,480 a year back on the P&amp;L. The audit's part of your free fit call.
            </div>
          </div>
        </div>

        {/* Supporting stats — stacked column */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "1px",
          background: v("divider-soft"),
          borderRadius: "var(--glass-radius)", overflow: "hidden",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          boxShadow: "var(--glass-shadow)",
        }}>
          <SupportStat
            value="48 hrs"
            label="From first call to fixed-price proposal"
            note="Agencies take weeks. We take two days."
          />
          <SupportStat
            value="24/7"
            label="AI that answers when you can't"
            note="Phone, chat, after-hours — from $73/mo."
          />
          <SupportStat
            forwardRef={ref100}
            value={`${count100}%`}
            label="Money-back guarantee on every engagement"
            note="The audit goes further — free if it can't pay for itself."
          />
        </div>
      </div>
    </section>
  );
}

function SupportStat({ forwardRef, value, label, note }) {
  return (
    <div ref={forwardRef} style={{
      padding: "26px 28px",
      background: "var(--glass-bg-strong)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      minHeight: "108px",
      transition: "background 0.25s ease",
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "32px", fontWeight: 800, letterSpacing: "-1px",
        background: C.gradientAccent,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        lineHeight: 1.1,
        marginBottom: "10px",
        paddingBottom: "0.08em",
        fontFeatureSettings: '"tnum" 1',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "13px", fontWeight: 500,
        color: v("text"), lineHeight: 1.45,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "13px", fontStyle: "normal", color: v("text-dim"),
        marginTop: "6px", fontFamily: "var(--font-body)",
      }}>
        — {note}
      </div>
    </div>
  );
}

/* ── The math — three leaks, priced ────────────────────────────── */
const LEAKS = [
  {
    label: "Leak 01 — The missed call",
    value: "≈ $1,350 /mo",
    body: "Five missed calls a week, a $250 average ticket, and winning just one in four of them. That's the cost of voicemail.",
  },
  {
    label: "Leak 02 — The front desk",
    value: "$1,500–2,500 /mo",
    body: "What part-time desk coverage actually costs, loaded. TSD Front Desk answers the same calls from $73 a month, managed.",
  },
  {
    label: "Leak 03 — Subscription creep",
    value: "$540 /mo",
    body: "A website vendor, a domain middleman, a tool from 2019 nobody opens. That's what one audit found at a local bakery.",
  },
];

function TheMath() {
  const [headRef, headFade] = useFadeIn(0);
  return (
    <section style={{
      padding: `${SPACE["3xl"]} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "1200px", margin: "0 auto",
    }}>
      <div ref={headRef} style={{ ...headFade, marginBottom: SPACE.xl }}>
        <ChapterRule label="The Math" num="02" />
      </div>

      <div style={{ maxWidth: "860px", marginBottom: SPACE["2xl"] }}>
        <h2 style={{
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(30px, 4.5vw, 52px)",
          letterSpacing: "-1px", lineHeight: 1.08,
          color: v("text"), marginBottom: SPACE.lg,
        }}>
          Three leaks, <GradientText>priced.</GradientText>
        </h2>
        <p style={{
          fontSize: "18px", lineHeight: 1.6, color: v("text-muted"),
          maxWidth: "720px",
        }}>
          Conservative arithmetic on purpose — your numbers will differ. The calculator takes sixty seconds and shows you where yours go.
        </p>
      </div>

      <div className="card-grid" style={{
        "--cg-min": "280px",
        gap: "20px",
        marginBottom: SPACE["2xl"],
      }}>
        {LEAKS.map((leak, i) => (
          <LeakCard key={i} leak={leak} index={i} />
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/savings" style={{ textDecoration: "none" }}>
          <Button as="span" variant="primary" iconRight={<ArrowRightIcon size={14} />}>
            See what you're losing
          </Button>
        </Link>
        <Link to="/services/cost-cut-audit" style={{ textDecoration: "none" }}>
          <Button as="span" variant="ghost">
            Or have us find it — free on your fit call
          </Button>
        </Link>
      </div>
    </section>
  );
}

function LeakCard({ leak, index }) {
  const [ref, fade] = useFadeIn(index * 120);
  return (
    <div ref={ref} style={{
      ...fade,
      padding: SPACE.xl,
      borderRadius: "var(--glass-radius)",
      background: "var(--glass-bg-strong)",
      border: "1px solid var(--glass-border)",
      backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-shadow)",
      position: "relative",
      isolation: "isolate",
    }}>
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
        background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
        pointerEvents: "none",
      }} />
      <Eyebrow style={{ marginBottom: SPACE.md }}>{leak.label}</Eyebrow>
      <div style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(28px, 3.4vw, 38px)", letterSpacing: "-1px",
        background: C.gradientAccent,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        paddingBottom: "0.08em",
        fontFeatureSettings: '"tnum" 1',
        marginBottom: SPACE.sm,
      }}>{leak.value}</div>
      <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-muted"), margin: 0 }}>{leak.body}</p>
    </div>
  );
}

/* ── Why we do this ────────────────────────────────────────────── */
const WHY_BEATS = [
  {
    label: "The gap",
    title: "Your reputation outgrew your website",
    body: "You're the name people recommend — but a dated site, scattered booking, and an after-hours phone that rings out make you look smaller than you are. We make the digital side match the reputation you already earned.",
  },
  {
    label: "Off the critical path",
    title: "The business shouldn't wait on you",
    body: "When every quote, every booking, every after-hours call routes through one person, growth caps at that person's hours — and every miss has a dollar figure. We put AI on the repetitive work — answering, qualifying, scheduling — so the business keeps earning when you step away.",
  },
  {
    label: "Your way",
    title: "Managed by us, or owned by you",
    body: "Run it however fits. Managed: we host it and make every change for you — just text us. Owned: the source code, credentials, and runbook are yours from day one, with docs and a live training session. Either way it's yours — never a lock-in.",
  },
];

function WhyWeDo() {
  const [headRef, headFade] = useFadeIn(0);
  return (
    <section style={{
      padding: `${SPACE["3xl"]} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "1200px", margin: "0 auto",
    }}>
      <div ref={headRef} style={{ ...headFade, marginBottom: SPACE.xl }}>
        <ChapterRule label="The Thesis" num="04" />
      </div>

      <div style={{ maxWidth: "860px", marginBottom: SPACE["3xl"] }}>
        <h2 style={{
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(30px, 4.5vw, 52px)",
          letterSpacing: "-1px", lineHeight: 1.08,
          color: v("text"), marginBottom: SPACE.lg,
        }}>
          You earned the reputation.{" "}
          <GradientText>Your tech should carry it.</GradientText>
        </h2>
        <p style={{
          fontSize: "18px", lineHeight: 1.6, color: v("text-muted"),
          maxWidth: "720px",
        }}>
          Established local businesses spend years building trust — then a dated website and an owner who's become the bottleneck quietly tax it: missed calls, slow quotes, subscriptions nobody audits. We close the gap with modern websites and AI that pay for themselves.
        </p>
      </div>

      <div className="card-grid" style={{
        "--cg-min": "300px",
        gap: "20px",
      }}>
        {WHY_BEATS.map((b, i) => (
          <WhyCard key={i} beat={b} index={i} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: SPACE["3xl"] }}>
        <Link to="/why-us" style={{ textDecoration: "none" }}>
          <Button as="span" variant="ghost" iconRight={<ArrowRightIcon size={14} />}>
            See how we compare
          </Button>
        </Link>
      </div>
    </section>
  );
}

/* Each Why card has its own visual treatment so the row doesn't read as
   a carbon-copy grid. */
function WhyCard({ beat, index }) {
  const [ref, fade] = useFadeIn(index * 120);
  const [hovered, setHovered] = useState(false);

  const variants = [
    {
      header: (
        <div style={{
          display: "flex", alignItems: "baseline", gap: "16px",
          marginBottom: SPACE.lg,
          paddingBottom: SPACE.md,
          borderBottom: `1px solid ${v("divider-soft")}`,
        }}>
          <span style={{
            fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
            fontSize: "60px", lineHeight: 1.05,
            background: C.gradientAccent,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-3px",
            paddingBottom: "0.08em",
          }}>01</span>
          <Eyebrow color={v("text-muted")} diamond={false}>{beat.label}</Eyebrow>
        </div>
      ),
    },
    {
      header: (
        <div style={{
          marginBottom: SPACE.lg, paddingBottom: SPACE.md,
          borderBottom: `1px solid ${v("divider-soft")}`,
        }}>
          <div style={{
            fontSize: "44px", color: v("accent"), lineHeight: 1,
            marginBottom: SPACE.md, letterSpacing: "8px",
          }}>
            {"◆ ◆ ◆"}
          </div>
          <Eyebrow color={v("text-muted")} diamond={false}>{beat.label}</Eyebrow>
        </div>
      ),
    },
    {
      header: (
        <div style={{
          marginBottom: SPACE.lg, paddingBottom: SPACE.md,
          borderBottom: `1px solid ${v("divider-soft")}`,
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
            fontSize: "78px", lineHeight: 0.9,
            color: v("accent"), opacity: 0.45,
            marginBottom: "4px",
          }}>&ldquo;</div>
          <Eyebrow color={v("text-muted")} diamond={false}>{beat.label}</Eyebrow>
        </div>
      ),
    },
  ];

  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...fade,
        padding: SPACE.xl,
        borderRadius: "var(--glass-radius)",
        background: "var(--glass-bg-strong)",
        border: `1px solid ${hovered ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        transition: "border-color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "var(--glass-shadow), 0 0 28px var(--glass-glow)" : "var(--glass-shadow)",
        position: "relative",
        isolation: "isolate",
      }}>
      {/* Specular top-edge rim — same liquid highlight the shared Card uses. */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
        background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
        pointerEvents: "none",
      }} />
      {variants[index]?.header}
      <h3 style={{
        fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 700,
        color: v("text"), marginBottom: SPACE.md,
        lineHeight: 1.2, letterSpacing: "-0.3px",
      }}>
        {beat.title}
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-muted") }}>
        {beat.body}
      </p>
    </div>
  );
}

/* ── Founders strip ────────────────────────────────────────────── */
function FoundersStrip() {
  const [headRef, headFade] = useFadeIn(0);
  const [quoteRef, quoteFade] = useFadeIn(100);
  return (
    <section style={{
      padding: `0 clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "1200px", margin: "0 auto",
    }}>
      <div ref={headRef} style={{ ...headFade, marginBottom: SPACE["3xl"] }}>
        <ChapterRule label="The Masthead" num="03" />
      </div>

      {/* Pull quote */}
      <div ref={quoteRef} style={{
        ...quoteFade,
        padding: "44px clamp(24px, 4vw, 56px)",
        borderTop: `1px solid ${v("divider")}`,
        borderBottom: `1px solid ${v("divider")}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "center",
      }}>
        <div aria-hidden="true" style={{
          fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
          fontSize: "clamp(80px, 10vw, 152px)", lineHeight: 0.92,
          color: v("accent"), opacity: 0.4, marginTop: "-8px",
        }}>&ldquo;</div>
        <div>
          <p style={{
            fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
            fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.4, color: v("text"),
            marginBottom: SPACE.md, letterSpacing: "-0.3px",
          }}>
            When something breaks at 7pm, you talk to the person who built it. No account managers, no offshoring, no calling a ticketing queue for a password reset.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: SPACE["2xl"] }}>
        <Link to="/team" style={{ textDecoration: "none" }}>
          <Button as="span" variant="ghost" iconRight={<ArrowRightIcon size={14} />}>
            Meet the team
          </Button>
        </Link>
      </div>
    </section>
  );
}

/* ── Founding-client offer ─────────────────────────────────────── */
function FoundingClientOffer() {
  const [ref, f] = useFadeIn(100);
  return (
    <section style={{
      padding: `0 clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <div ref={ref} style={{
        ...f,
        background: C.gradientPrism,
        borderRadius: RADIUS["2xl"],
        padding: "clamp(48px, 7vw, 80px) clamp(32px, 5vw, 64px)",
        textAlign: "center", color: "#fff",
        position: "relative", overflow: "hidden",
        boxShadow: "0 28px 80px rgba(19,41,75,0.32), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}>
        {/* Decorative diamond pattern in background */}
        <span aria-hidden="true" style={{
          position: "absolute", top: "-50px", left: "-50px",
          fontSize: "300px", color: "#fff", opacity: 0.04,
          lineHeight: 1, pointerEvents: "none",
        }}>{"◆"}</span>
        <span aria-hidden="true" style={{
          position: "absolute", bottom: "-80px", right: "-50px",
          fontSize: "260px", color: "#fff", opacity: 0.04,
          lineHeight: 1, pointerEvents: "none",
        }}>{"◆"}</span>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          padding: "6px 14px", borderRadius: RADIUS.full,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)",
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px",
          textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
          marginBottom: SPACE.lg,
        }}>
          <span style={{ fontSize: "8px" }}>{"◆"}</span> Charlotte Metro · Web + AI Studio
        </div>

        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800,
          letterSpacing: "-1px", lineHeight: 1.1,
          marginBottom: SPACE.md,
        }}>
          Make your digital side
          <br />
          <span style={{
            fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
          }}>match your reputation.</span>
        </h2>
        <p style={{
          fontSize: "16px", lineHeight: 1.6,
          color: "rgba(255,255,255,0.92)",
          maxWidth: "680px", margin: "0 auto 36px",
        }}>
          Custom websites, AI that runs the busywork, and an audit that cuts what you stopped needing. Direct founder access; managed by us, or owned by you. Sixty seconds on the calculator shows what the leaks cost — a free fit call prices the fix.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/book" style={{ textDecoration: "none" }}>
            <Button as="span" variant="onAccent" size="lg" iconRight={<ArrowRightIcon size={16} />}>
              Book a fit call
            </Button>
          </Link>
          <Link to="/savings" style={{
            display: "inline-flex", alignItems: "center",
            color: "rgba(255,255,255,0.92)", fontSize: "15px", fontWeight: 600,
            textDecoration: "underline", textUnderlineOffset: "4px",
            textDecorationColor: "rgba(255,255,255,0.4)",
          }}>
            See what you're losing →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Home page ─────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <SegmentStrip />
      <ServiceTicker />
      <Stats />
      <TheMath />
      <FoundersStrip />
      <WhyWeDo />
      <FoundingClientOffer />
    </>
  );
}
