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
function Hero() {
  const [r1, f1] = useFadeIn(150);
  const [r2, f2] = useFadeIn(350);
  const [r3, f3] = useFadeIn(550);
  const [r4, f4] = useFadeIn(750);
  const [r5, f5] = useFadeIn(950);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Defer video download until idle. The poster paints immediately
     (LCP candidate); the video streams in afterward. Keeps 15 MB of
     mp4 out of the critical path. */
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    const kick = () => setVideoReady(true);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(kick, { timeout: 1500 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    const id = setTimeout(kick, 400);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    if (videoReady && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [videoReady, isMobile]);

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: v("bg"),
      paddingTop: "140px", paddingBottom: "120px",
    }}>
      {/* Storefront poster — base layer + LCP image */}
      <div className="hero-bg" style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/hero-storefront.webp)",
        backgroundSize: "cover", backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }} />

      <video
        ref={videoRef}
        key={isMobile ? "mobile" : "desktop"}
        className="hero-video"
        autoPlay muted loop playsInline
        preload="none"
        poster={isMobile ? "/hero-loop-mobile-poster.webp" : "/hero-loop-poster.webp"}
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          background: "#0a1320",
        }}
      >
        {videoReady && (
          <source src={isMobile ? "/hero-loop-mobile.mp4" : "/hero-loop.mp4"} type="video/mp4" />
        )}
      </video>

      {/* Theme blend — top + bottom fades into the page bg so the section
          doesn't present a torn edge against the cream/navy backdrop. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(to bottom,
          var(--c-bg) 0%,
          var(--c-bg) 4%,
          transparent 12%,
          transparent 78%,
          var(--c-bg) 96%,
          var(--c-bg) 100%)`,
      }} />

      {/* Center vignette — gives the headline a guaranteed dark backdrop
          regardless of theme. Pulled tighter and richer than the prior
          implementation so the white type stays anchored. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(5,10,20,0.68) 0%, rgba(5,10,20,0.46) 45%, rgba(5,10,20,0.18) 75%, transparent 92%)",
      }} />

      {/* Subtle grain — adds a layer of premium texture over the video. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        backgroundSize: "180px 180px",
        mixBlendMode: "overlay",
      }} />

      {/* Content */}
      <div style={{
        maxWidth: "880px", textAlign: "center", position: "relative", zIndex: 4,
        padding: "0 24px",
      }}>

        {/* Editorial masthead */}
        <div ref={r1} style={{
          ...f1, marginBottom: "28px",
          color: "rgba(236,228,214,0.92)",
          textShadow: "0 1px 4px rgba(0,0,0,0.85)",
        }}>
          <EditorialMasthead
            items={["Founding Cohort", "Charlotte Edition", "Summer MMXXVI"]}
            color="rgba(236,228,214,0.92)"
          />
        </div>

        <h1 ref={r2} style={{
          ...f2,
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(36px, 5.8vw, 72px)",
          letterSpacing: "-2.5px", lineHeight: 1.04,
          color: "#fff", marginBottom: SPACE.lg,
          textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.85)",
        }}>
          Ten Charlotte builds
          <br />
          between May and August.
          <br />
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            color: "#f4f9fd",
            textShadow: "0 2px 28px rgba(0,0,0,0.78), 0 1px 6px rgba(0,0,0,0.9)",
          }}>Then we close.</span>
        </h1>

        <DiamondDivider width={180} style={{ marginBottom: SPACE.lg }} />

        <p ref={r3} style={{
          ...f3,
          fontSize: "18px", lineHeight: 1.6, fontWeight: 500,
          color: "rgba(255,255,255,0.96)",
          maxWidth: "620px", margin: "0 auto 40px",
          textShadow: "0 2px 14px rgba(0,0,0,0.78), 0 1px 4px rgba(0,0,0,0.9)",
        }}>
          Custom website, working AI, source code yours from day one. <span style={{ fontWeight: 700, color: "#fff" }}>$5,000 fixed.</span>
          {" "}We don't take retainers and we will not be your long-term agency.
        </p>

        <div ref={r4} style={{
          ...f4, display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
        }}>
          <BookCallButton variant="primary" refSource="home-hero">
            Book a fit call
          </BookCallButton>
          <Link to="/pricing" style={{ textDecoration: "none" }}>
            <Button as="span" variant="editorial" size="lg">
              See pricing
            </Button>
          </Link>
        </div>

        {/* Cohort scarcity strip — surfaces hard cap + last-start date so
            the time-bounded nature reads above the fold. */}
        <div ref={r5} style={{
          ...f5, marginTop: "44px",
          display: "flex", alignItems: "center", gap: "14px",
          justifyContent: "center", flexWrap: "wrap",
          fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "rgba(236,228,214,0.78)",
          textShadow: "0 1px 4px rgba(0,0,0,0.85)",
        }}>
          <span style={{ flex: "0 0 32px", height: "1px", background: "rgba(236,228,214,0.32)" }} />
          <span>Ten spots</span>
          <span style={{ color: C.carolinaLight, fontSize: "7px" }}>{"◆"}</span>
          <span>Last start</span>
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
            fontSize: "15px", letterSpacing: "0", textTransform: "none",
            color: "#f4f9fd",
          }}>July 13</span>
          <span style={{ flex: "0 0 32px", height: "1px", background: "rgba(236,228,214,0.32)" }} />
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
        zIndex: 4,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        opacity: 0.6,
        animation: "scrollBounce 2.4s ease-in-out infinite",
      }}>
        <span style={{
          fontSize: "9px", fontWeight: 700, letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(236,228,214,0.7)",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        }}>Scroll</span>
        <div style={{
          position: "relative", width: "20px", height: "32px",
          borderRadius: "10px",
          border: "1.5px solid rgba(236,228,214,0.5)",
        }}>
          <div style={{
            position: "absolute", top: "8px", left: "50%", marginLeft: "-2px",
            width: "4px", height: "6px", borderRadius: "2px",
            background: "rgba(236,228,214,0.85)",
            animation: "scrollDot 1.6s ease-out infinite",
          }} />
        </div>
      </div>
    </section>
  );
}

/* ── Trades strip ─────────────────────────────────────────────── */
function TradesStrip() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade,
      padding: "32px 24px",
      borderTop: `1px solid ${v("divider")}`,
      borderBottom: `1px solid ${v("divider")}`,
      background: v("bg-alt"),
      position: "relative",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "24px",
        flexWrap: "wrap", maxWidth: "1100px", margin: "0 auto",
        textAlign: "center",
      }}>
        <Eyebrow style={{ whiteSpace: "nowrap" }}>Built for the trades</Eyebrow>
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(17px, 2.2vw, 22px)", color: v("text"),
          lineHeight: 1.4, letterSpacing: "0.1px",
        }}>
          HVAC <span style={{ color: v("accent"), fontStyle: "normal", margin: "0 8px" }}>·</span>
          Electrical <span style={{ color: v("accent"), fontStyle: "normal", margin: "0 8px" }}>·</span>
          Plumbing <span style={{ color: v("accent"), fontStyle: "normal", margin: "0 8px" }}>·</span>
          Garage Doors <span style={{ color: v("accent"), fontStyle: "normal", margin: "0 8px" }}>·</span>
          Roofing <span style={{ color: v("accent"), fontStyle: "normal", margin: "0 8px" }}>·</span>
          Home Services
        </span>
      </div>
    </section>
  );
}

/* ── Service ticker ────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "AI receptionists",
  "Custom websites",
  "Workflow automation",
  "Tech audits",
  "48-hour proposals",
  "100% money-back guarantee",
  "Charlotte-built",
  "Main-street pricing",
];

function ServiceTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section aria-hidden="true" style={{
      position: "relative", overflow: "hidden",
      borderBottom: `1px solid ${v("divider")}`,
      padding: "20px 0",
      background: v("bg"),
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
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
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
  const [count48, ref48] = useCountUp(48, 1600);
  const [count2k, ref2k] = useCountUp(5000, 1800);
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

        {/* Hero stat — the 48-hour proposal */}
        <div ref={ref48} className="stats-hero" style={{
          position: "relative",
          padding: "56px",
          borderRadius: RADIUS["2xl"],
          background: `linear-gradient(160deg, ${v("surface")} 0%, ${v("bg-alt")} 100%)`,
          border: `1px solid ${v("surface-border")}`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: "340px",
          boxShadow: SHADOW.md,
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

          <Eyebrow>The Differentiator</Eyebrow>

          <div style={{ position: "relative" }}>
            <div className="stats-hero-num" style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(120px, 16vw, 188px)", lineHeight: 1.05, letterSpacing: "-4px",
              background: C.gradientAccent,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: 0,
              paddingBottom: "0.08em",
              fontFeatureSettings: '"tnum" 1',
            }}>
              {count48}
              <span style={{
                fontFamily: "var(--font-body)", fontStyle: "normal", fontSize: "0.32em",
                letterSpacing: "0", marginLeft: "10px", fontWeight: 600,
              }}>hrs</span>
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(20px, 2.4vw, 26px)",
              fontWeight: 700, color: v("text"), lineHeight: 1.2,
              marginTop: SPACE.lg, marginBottom: SPACE.sm,
              letterSpacing: "-0.4px",
            }}>
              From first call to custom proposal.
            </div>
            <div style={{
              fontSize: "14px", lineHeight: 1.7, color: v("text-muted"), maxWidth: "480px",
            }}>
              Agencies take weeks. We take two days — with scope, timeline, and a fixed price.
            </div>
          </div>
        </div>

        {/* Supporting stats — stacked column */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "1px",
          background: v("divider-soft"),
          borderRadius: RADIUS["2xl"], overflow: "hidden",
          border: `1px solid ${v("surface-border")}`,
        }}>
          <SupportStat
            forwardRef={ref2k}
            value={`$${count2k.toLocaleString()}`}
            label="Founding-cohort rate (standard $10,000)"
            note="Half-price for our first ten."
          />
          <SupportStat
            value="Aug 31"
            label="One founder on call through this date"
            note="Past that, your codebase has a co-pilot."
          />
          <SupportStat
            forwardRef={ref100}
            value={`${count100}%`}
            label="Money-back guarantee on every engagement"
            note="The promise we stand behind."
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
      background: v("surface"),
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
        fontSize: "12px", fontStyle: "italic", color: v("text-dim"),
        marginTop: "6px", fontFamily: "var(--font-display)",
      }}>
        — {note}
      </div>
    </div>
  );
}

/* ── Why we do this ────────────────────────────────────────────── */
const WHY_BEATS = [
  {
    label: "For the 70%",
    title: "Priced out, not left behind",
    body: "Fewer than 30% of Charlotte small businesses have modern tools. That isn't reluctance — it's access. Agencies price for enterprise retainers and freelancers disappear after delivery. We bring the same capability at a price main street can actually spend.",
  },
  {
    label: "Ship it, teach it",
    title: "You own what we build",
    body: "Every project ends with written + video documentation and a live training session. You own the source code, the credentials, and the runbook when we're done. That's the deliverable — your team running what we built, on its own.",
  },
  {
    label: "From here, for here",
    title: "Local means accountable",
    body: "We live in the Charlotte metro. When something breaks at 7pm, you talk to the person who built it — not an offshore call center, not a ticket in a queue. Local means someone picks up. Accountable means it actually gets fixed.",
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
        <ChapterRule label="The Thesis" num="03" />
      </div>

      <div style={{ maxWidth: "860px", marginBottom: SPACE["3xl"] }}>
        <h2 style={{
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(30px, 4.5vw, 52px)",
          letterSpacing: "-1px", lineHeight: 1.08,
          color: v("text"), marginBottom: SPACE.lg,
        }}>
          Main street built Charlotte.{" "}
          <GradientText>Let's keep it that way.</GradientText>
        </h2>
        <p style={{
          fontSize: "18px", lineHeight: 1.6, color: v("text-muted"),
          maxWidth: "720px",
        }}>
          Fifty thousand small businesses in this metro, and fewer than a third have modern tools. It isn't because they don't want them — it's because nobody builds for them. That gap is why we exist.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
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
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
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
        borderRadius: RADIUS.xl,
        background: v("surface"),
        border: `1px solid ${hovered ? v("surface-border-hover") : v("surface-border")}`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "border-color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? SHADOW.lg : SHADOW.sm,
        position: "relative",
      }}>
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
const FOUNDERS = [
  {
    number: "01",
    name: "Nash Davis", role: "CEO & Head of Modernization", school: "UNC Chapel Hill",
    bio: "AI and technology strategy. Leads technical delivery and solution architecture.",
    image: "/nash-davis.png",
  },
  {
    number: "02",
    name: "Bishop Switzer", role: "COO — Operations", school: "UNC Wilmington",
    bio: "Project tracking, proposals, invoicing, and handoff documentation.",
    image: "/bishop-switzer.jpg",
  },
  {
    number: "03",
    name: "Grant Tadlock", role: "CFO & Sales Lead", school: "UNC Charlotte",
    bio: "Financial planning, pricing strategy, and client acquisition.",
    image: "/grant-tadlock.jpg",
  },
];

function FoundersStrip() {
  const [headRef, headFade] = useFadeIn(0);
  const [quoteRef, quoteFade] = useFadeIn(100);
  return (
    <section style={{
      padding: `0 clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "1200px", margin: "0 auto",
    }}>
      <div ref={headRef} style={{ ...headFade, marginBottom: SPACE["3xl"] }}>
        <ChapterRule label="The Masthead" num="02" />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "clamp(24px, 3vw, 36px)",
        marginBottom: SPACE["3xl"],
      }}>
        {FOUNDERS.map((f, i) => (
          <FounderPortrait key={i} founder={f} delay={i * 140} />
        ))}
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
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(80px, 10vw, 152px)", lineHeight: 0.92,
          color: v("accent"), opacity: 0.4, marginTop: "-8px",
        }}>&ldquo;</div>
        <div>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.4, color: v("text"),
            marginBottom: SPACE.md, letterSpacing: "-0.3px",
          }}>
            When something breaks at 7pm, you talk to the person who built it. No account managers, no offshoring, no calling a ticketing queue for a password reset.
          </p>
          <Eyebrow>Three founders, one phone number</Eyebrow>
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

function FounderPortrait({ founder, delay }) {
  const [ref, fade] = useFadeIn(delay);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...fade, cursor: "default" }}>
      <div style={{
        position: "relative",
        aspectRatio: "4 / 5",
        borderRadius: RADIUS.lg,
        overflow: "hidden",
        border: `1px solid ${hovered ? v("surface-border-hover") : v("surface-border")}`,
        background: v("surface"),
        marginBottom: SPACE.lg,
        transition: "border-color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? SHADOW.lg : SHADOW.sm,
      }}>
        <img
          src={founder.image} alt={`${founder.name}, ${founder.role}`}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: "saturate(1.05) contrast(1.02)",
            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
        />
        {/* Number chip */}
        <div style={{
          position: "absolute", top: "16px", left: "16px",
          padding: "5px 12px", borderRadius: RADIUS.full,
          background: "rgba(7,13,26,0.7)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.18)",
          fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px",
          color: "#fff",
          fontFeatureSettings: '"tnum" 1',
        }}>
          No. {founder.number}
        </div>
        {/* Bottom gradient + name plate */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          padding: "60px 20px 20px",
          background: "linear-gradient(to top, rgba(7,13,26,0.96) 0%, rgba(7,13,26,0.72) 50%, transparent 100%)",
        }}>
          <div style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            fontSize: "24px", color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.15,
          }}>
            {founder.name}
          </div>
          <div style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase",
            color: C.carolinaLight, marginTop: "5px",
          }}>
            {founder.role}
          </div>
        </div>
      </div>
      <p style={{
        fontSize: "13px", lineHeight: 1.65, color: v("text-muted"),
        paddingLeft: "4px",
      }}>
        <span style={{
          display: "block", fontSize: "10px", color: v("text-dim"),
          letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", fontWeight: 700,
        }}>{founder.school}</span>
        {founder.bio}
      </p>
    </div>
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
          <span style={{ fontSize: "8px" }}>{"◆"}</span> Founding Cohort · Summer 2026
        </div>

        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800,
          letterSpacing: "-1px", lineHeight: 1.1,
          marginBottom: SPACE.md,
        }}>
          Ten Charlotte businesses,
          <br />
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          }}>one summer.</span>
        </h2>
        <p style={{
          fontSize: "16px", lineHeight: 1.6,
          color: "rgba(255,255,255,0.92)",
          maxWidth: "680px", margin: "0 auto 36px",
        }}>
          Founding-cohort pricing on every offer — half what we'll charge after Summer 2026. Direct founder access. Source code yours from day one. Two public tiers: the Website + AI Build at $5,000 and the Full Modernization at $10,000 (by application). A $1,500 discovery audit is available on request.
        </p>
        <Link to="/pricing" style={{ textDecoration: "none" }}>
          <Button as="span" variant="onAccent" size="lg" iconRight={<ArrowRightIcon size={16} />}>
            See both tiers
          </Button>
        </Link>
      </div>
    </section>
  );
}

/* ── Home page ─────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <TradesStrip />
      <ServiceTicker />
      <Stats />
      <FoundersStrip />
      <WhyWeDo />
      <FoundingClientOffer />
    </>
  );
}
