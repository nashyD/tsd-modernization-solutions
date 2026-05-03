import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { C, v, useFadeIn, useCountUp, DiamondDivider, Card, RippleButton, SectionHeader } from "../shared";
import { ArrowRightIcon } from "../icons";
import BookCallButton from "../components/BookCallButton";

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  const [r1, f1] = useFadeIn(200);
  const [r2, f2] = useFadeIn(400);
  const [r3, f3] = useFadeIn(600);
  const [r4, f4] = useFadeIn(800);
  const [r5, f5] = useFadeIn(1000);

  // Pick the right hero video for the viewport. Desktop gets the full 1080p
  // landscape (with contain so the full frame shows). Mobile gets a portrait-
  // cropped version so the storefront isn't reduced to a narrow middle slice.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Defer video download until the page is idle. The poster image paints
  // immediately (LCP candidate) and the video streams in afterwards. This
  // keeps 15 MB of mp4 out of the critical-path download and improves
  // Core Web Vitals — meaningful for SEO.
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
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      background: v("bg"),
      paddingTop: "140px", paddingBottom: "80px",
    }}>
      {/* Storefront image — base layer and mobile fallback */}
      <div className="hero-bg" style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/hero-storefront.webp)",
        backgroundSize: "cover", backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Palindrome video loop — viewport-specific source & fit.
          `key` forces React to remount on viewport change so the new <source> is picked up.
          <source> is rendered only after idle so the mp4 stays out of the critical path. */}
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
          background: "#0c1524",
        }}
      >
        {videoReady && (
          <source src={isMobile ? "/hero-loop-mobile.mp4" : "/hero-loop.mp4"} type="video/mp4" />
        )}
      </video>

      {/* Reveal overlay — frames the hero with the page bg color so the
          section blends with the active theme rather than presenting a
          dark-navy band against a cream page in light mode. Two trade-offs
          baked into the stop placement:
          • Top fade is tight (bg ends at 5%, transparent by 10%) so the
            editorial masthead at ~16% from the top sits on pure video,
            not on a half-faded bg tint. In light mode a wide bg-tint zone
            would put cream text on a cream-tinted backdrop and erase it.
            The radial vignette below this layer does the contrast work
            for the masthead instead.
          • Bottom fade is widened (transparent → bg over 16% of section
            height vs the prior 8%) so the exit into the next section
            doesn't show banding where the video's edge colors meet the
            cream theme bg — that was the "torn-edge" failure mode that
            killed an earlier attempt at this fix. */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(to bottom,
          var(--c-bg) 0%,
          var(--c-bg) 5%,
          transparent 10%,
          transparent 78%,
          var(--c-bg) 94%,
          var(--c-bg) 100%)`,
      }} />

      {/* Editorial gradient vignette — provides a theme-independent dark
          backdrop for the white headline and cream eyebrow text. Center
          shifted up to 42% (was 48%) and height extended to 70% (was 60%)
          so the masthead also gets coverage, now that the reveal overlay's
          top fade is too short to tint the masthead zone. Without this the
          masthead would sit on raw video sky in light mode and bleed. */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 75% 70% at 50% 42%, rgba(5,10,20,0.62) 0%, rgba(5,10,20,0.42) 45%, rgba(5,10,20,0.18) 75%, transparent 92%)",
      }} />

      {/* Content */}
      <div style={{ maxWidth: "820px", textAlign: "center", position: "relative", zIndex: 3, padding: "0 24px" }}>

        {/* Editorial masthead — No. 01 · Charlotte Edition · 2026 */}
        <div ref={r1} style={{
          ...f1, display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
          fontSize: "10px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
          color: "rgba(232,224,212,0.85)", marginBottom: "24px",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}>
          <span style={{ flex: "0 0 44px", height: "1px", background: "rgba(232,224,212,0.35)" }} />
          <span>Founding Cohort</span>
          <span style={{ color: C.carolinaLight, fontSize: "7px" }}>{"\u25C6"}</span>
          <span>Charlotte Edition</span>
          <span style={{ color: C.carolinaLight, fontSize: "7px" }}>{"\u25C6"}</span>
          <span>Summer MMXXVI</span>
          <span style={{ flex: "0 0 44px", height: "1px", background: "rgba(232,224,212,0.35)" }} />
        </div>

        <h1 ref={r2} style={{
          ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(32px, 5.5vw, 64px)", letterSpacing: "-2px", lineHeight: 1.08,
          color: "#fff", marginBottom: "20px",
          textShadow: "0 2px 18px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.8)",
        }}>
          Ten Charlotte builds between May and August.
          <br />
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            color: "#f4f9fd",
            textShadow: "0 2px 24px rgba(0,0,0,0.75), 0 1px 6px rgba(0,0,0,0.85)",
          }}>Then we close.</span>
        </h1>

        <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

        <p ref={r3} style={{
          ...f3, fontSize: "17px", lineHeight: 1.7, color: "#fff", fontWeight: 500,
          maxWidth: "580px", margin: "0 auto 36px",
          textShadow: "0 2px 14px rgba(0,0,0,0.75), 0 1px 4px rgba(0,0,0,0.85)",
        }}>
          Custom website, working AI, source code yours from day one. $5,000 fixed.
          We don't take retainers and we will not be your long-term agency.
        </p>

        <div ref={r4} style={{ ...f4, display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <BookCallButton variant="primary" refSource="home-hero" style={{ padding: "16px 36px", fontSize: "15px" }}>
            Book a fit call <ArrowRightIcon size={16} />
          </BookCallButton>
          <Link to="/pricing">
            <RippleButton variant="secondary" style={{
              padding: "16px 36px", fontSize: "15px",
              background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)", color: "#fff",
            }}>
              See pricing
            </RippleButton>
          </Link>
        </div>

        {/* Cohort scarcity strip — surfaces the hard cap and the last-start
            date so the time-bounded nature of the offer reads above the fold. */}
        <div ref={r5} style={{
          ...f5, marginTop: "36px",
          display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", flexWrap: "wrap",
          fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase",
          color: "rgba(232,224,212,0.78)",
          textShadow: "0 1px 4px rgba(0,0,0,0.85)",
        }}>
          <span style={{ flex: "0 0 32px", height: "1px", background: "rgba(232,224,212,0.3)" }} />
          <span>Ten spots</span>
          <span style={{ color: C.carolinaLight, fontSize: "7px" }}>{"◆"}</span>
          <span>Last start</span>
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
            fontSize: "14px", letterSpacing: "0", textTransform: "none",
            color: "#f4f9fd",
          }}>July 13</span>
          <span style={{ flex: "0 0 32px", height: "1px", background: "rgba(232,224,212,0.3)" }} />
        </div>
      </div>

    </section>
  );
}

/* ── Service ticker — slow-scrolling editorial marquee ─────────── */
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
  // Double the list so the translate animation loops seamlessly at -50%.
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section aria-hidden="true" style={{
      position: "relative", overflow: "hidden",
      borderTop: `1px solid ${v("divider")}`,
      borderBottom: `1px solid ${v("divider")}`,
      background: v("bg-alt"),
      padding: "18px 0",
    }}>
      <style>{`
        @keyframes tickerSlide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-track { animation: tickerSlide 55s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
      <div className="ticker-track" style={{ display: "flex", whiteSpace: "nowrap", gap: "48px", width: "max-content" }}>
        {loop.map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: "48px",
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
            fontSize: "clamp(22px, 3vw, 34px)",
            color: v("text-muted"), letterSpacing: "0.5px",
          }}>
            {item}
            <span style={{ color: v("accent"), fontSize: "10px", fontStyle: "normal" }}>{"\u25C6"}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Stats — asymmetric editorial "by the numbers" block ───────── */
function Stats() {
  const [headRef, headFade] = useFadeIn(0);
  const [count48, ref48] = useCountUp(48, 1600);
  const [count2k, ref2k] = useCountUp(5000, 1800);
  const [count100, ref100] = useCountUp(100, 1400);

  return (
    <section style={{
      padding: "80px 48px 100px", maxWidth: "1200px", margin: "0 auto",
    }}>
      <div ref={headRef} style={{
        ...headFade,
        display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "48px",
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"),
        }}>
          <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  By the Numbers
        </span>
        <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
        <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px" }}>§ 01</span>
      </div>

      <div style={{
        display: "grid", gap: "clamp(24px, 4vw, 56px)",
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
          padding: "48px", borderRadius: "24px",
          background: v("surface"),
          border: `1px solid ${v("surface-border")}`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: "320px",
        }}>
          {/* Large decorative diamond in the background */}
          <span aria-hidden="true" style={{
            position: "absolute", top: "-40px", right: "-40px",
            fontSize: "220px", color: v("accent"), opacity: 0.06,
            lineHeight: 1, pointerEvents: "none",
          }}>{"\u25C6"}</span>

          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("accent"), marginBottom: "24px", position: "relative",
          }}>
            The Differentiator
          </div>

          <div style={{ position: "relative" }}>
            <div className="stats-hero-num" style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(120px, 16vw, 180px)", lineHeight: 0.85, letterSpacing: "-4px",
              background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: "12px",
            }}>
              {count48}
              <span style={{
                fontFamily: "var(--font-body)", fontStyle: "normal", fontSize: "0.35em",
                letterSpacing: "0", marginLeft: "8px",
              }}>hrs</span>
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(18px, 2.4vw, 24px)",
              fontWeight: 700, color: v("text"), lineHeight: 1.25, marginBottom: "10px",
              letterSpacing: "-0.3px",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1px",
          background: v("divider"), borderRadius: "24px", overflow: "hidden",
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
      flex: 1, padding: "28px 32px", background: v("surface"),
      display: "flex", flexDirection: "column", justifyContent: "center",
      minHeight: "104px",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap" }}>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "34px", fontWeight: 800, letterSpacing: "-1px",
          background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          lineHeight: 1, minWidth: "fit-content",
        }}>
          {value}
        </div>
        <div style={{
          fontSize: "13px", fontWeight: 500, color: v("text"), lineHeight: 1.45, flex: 1,
        }}>
          {label}
        </div>
      </div>
      <div style={{
        fontSize: "11px", fontStyle: "italic", color: v("text-dim"),
        marginTop: "8px", fontFamily: "var(--font-display)",
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
  return (
    <section style={{ padding: "0 48px 100px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px",
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"),
        }}>
          <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  The Thesis
        </span>
        <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
        <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px" }}>§ 03</span>
      </div>

      <div style={{ maxWidth: "820px", marginBottom: "56px" }}>
        <h2 style={{
          fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)",
          letterSpacing: "-0.5px", lineHeight: 1.1, color: v("text"), marginBottom: "20px",
        }}>
          Main street built Charlotte.{" "}
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Let's keep it that way.</span>
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.65, color: v("text-muted"), maxWidth: "680px" }}>
          Fifty thousand small businesses in this metro, and fewer than a third have modern tools. It isn't because they don't want them — it's because nobody builds for them. That gap is why we exist.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {WHY_BEATS.map((b, i) => (
          <WhyCard key={i} beat={b} index={i} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "56px" }}>
        <Link to="/why-us">
          <RippleButton variant="ghost" style={{ padding: "14px 32px" }}>
            See how we compare <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
      </div>
    </section>
  );
}

/* Each Why card gets its own visual treatment — numbered header / big diamond / pull-quote — so the three-up row doesn't read as a carbon-copy grid. */
function WhyCard({ beat, index }) {
  const [ref, fade] = useFadeIn(index * 120);

  const variants = [
    // 01 — large numbered marker
    {
      header: (
        <div style={{
          display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "20px",
          borderBottom: `1px solid ${v("divider")}`, paddingBottom: "16px",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            fontSize: "52px", lineHeight: 0.9, color: v("accent"), letterSpacing: "-2px",
          }}>01</span>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("text-muted"),
          }}>{beat.label}</span>
        </div>
      ),
    },
    // 02 — oversized diamond glyph
    {
      header: (
        <div style={{ marginBottom: "20px", borderBottom: `1px solid ${v("divider")}`, paddingBottom: "16px" }}>
          <div style={{
            fontSize: "44px", color: v("accent"), lineHeight: 0.7,
            marginBottom: "14px", letterSpacing: "6px",
          }}>
            {"\u25C6 \u25C6 \u25C6"}
          </div>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("text-muted"),
          }}>{beat.label}</span>
        </div>
      ),
    },
    // 03 — pull-quote mark
    {
      header: (
        <div style={{ marginBottom: "20px", borderBottom: `1px solid ${v("divider")}`, paddingBottom: "16px" }}>
          <div style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            fontSize: "72px", lineHeight: 0.6, color: v("accent"), opacity: 0.4,
            marginBottom: "8px",
          }}>&ldquo;</div>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("text-muted"),
          }}>{beat.label}</span>
        </div>
      ),
    },
  ];

  return (
    <div ref={ref} style={{
      ...fade,
      padding: "32px",
      borderRadius: "20px",
      background: v("surface"),
      border: `1px solid ${v("surface-border")}`,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    }}>
      {variants[index]?.header}
      <h3 style={{
        fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 700,
        color: v("text"), marginBottom: "14px", lineHeight: 1.2, letterSpacing: "-0.3px",
      }}>
        {beat.title}
      </h3>
      <p style={{ fontSize: "14px", lineHeight: 1.75, color: v("text-muted") }}>
        {beat.body}
      </p>
    </div>
  );
}

/* ── Founders strip — editorial portrait row ───────────────────── */
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
  const [quoteRef, quoteFade] = useFadeIn(100);
  return (
    <section style={{ padding: "0 48px 100px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "56px",
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"),
        }}>
          <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  The Masthead
        </span>
        <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
        <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px" }}>§ 02</span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "clamp(24px, 3vw, 40px)",
        marginBottom: "56px",
      }}>
        {FOUNDERS.map((f, i) => (
          <FounderPortrait key={i} founder={f} delay={i * 140} />
        ))}
      </div>

      {/* Pull quote — editorial attribution strip */}
      <div ref={quoteRef} style={{
        ...quoteFade,
        padding: "40px clamp(24px, 4vw, 48px)",
        borderTop: `1px solid ${v("divider")}`,
        borderBottom: `1px solid ${v("divider")}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "clamp(24px, 4vw, 48px)",
        alignItems: "center",
      }}>
        <div aria-hidden="true" style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(80px, 10vw, 140px)", lineHeight: 0.7,
          color: v("accent"), opacity: 0.35, marginTop: "-8px",
        }}>&ldquo;</div>
        <div>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(18px, 2.4vw, 26px)", lineHeight: 1.4, color: v("text"),
            marginBottom: "16px", letterSpacing: "-0.2px",
          }}>
            When something breaks at 7pm, you talk to the person who built it. No account managers, no offshoring, no calling a ticketing queue for a password reset.
          </p>
          <p style={{
            fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("accent"),
          }}>
            <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  Three founders, one phone number
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <Link to="/team">
          <RippleButton variant="ghost" style={{ padding: "14px 32px" }}>
            Meet the team <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
      </div>
    </section>
  );
}

function FounderPortrait({ founder, delay }) {
  const [ref, fade] = useFadeIn(delay);
  return (
    <div ref={ref} style={{ ...fade }}>
      <div style={{
        position: "relative",
        aspectRatio: "4 / 5",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${v("surface-border")}`,
        background: v("surface"),
        marginBottom: "20px",
      }}>
        <img
          src={founder.image} alt={`${founder.name}, ${founder.role}`}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: "saturate(1.05) contrast(1.02)",
          }}
        />
        {/* Editorial number chip */}
        <div style={{
          position: "absolute", top: "14px", left: "14px",
          padding: "6px 12px", borderRadius: "100px",
          background: "rgba(12,21,36,0.75)", backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px",
          color: "#fff",
        }}>
          No. {founder.number}
        </div>
        {/* Bottom gradient + name plate */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          padding: "48px 20px 18px",
          background: "linear-gradient(to top, rgba(12,21,36,0.95) 0%, rgba(12,21,36,0.7) 55%, transparent 100%)",
        }}>
          <div style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            fontSize: "22px", color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.1,
          }}>
            {founder.name}
          </div>
          <div style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase",
            color: C.carolinaLight, marginTop: "4px",
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
          display: "block", fontSize: "11px", color: v("text-dim"),
          letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px",
        }}>{founder.school}</span>
        {founder.bio}
      </p>
    </div>
  );
}

/* ── Founding client offer ─────────────────────────────────────── */
function FoundingClientOffer() {
  const [ref, f] = useFadeIn(100);
  return (
    <section style={{ padding: "0 48px 100px", maxWidth: "1100px", margin: "0 auto" }}>
      <div ref={ref} style={{
        ...f,
        background: C.gradientPrism,
        borderRadius: "24px",
        padding: "clamp(40px, 6vw, 64px) clamp(32px, 5vw, 56px)",
        textAlign: "center", color: "#fff",
        position: "relative", overflow: "hidden",
        boxShadow: "0 20px 60px rgba(19,41,75,0.25)",
      }}>
        <div style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
        }}>
          <span style={{ fontSize: "8px" }}>{"\u25C6"}</span> Founding Cohort · Summer 2026
        </div>
        <h2 style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800,
          letterSpacing: "-1px", lineHeight: 1.15, marginBottom: "16px",
        }}>
          Ten Charlotte businesses, one summer.
        </h2>
        <p style={{
          fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.92)",
          maxWidth: "620px", margin: "0 auto 32px",
        }}>
          Founding-cohort pricing on every offer — half what we'll charge after Summer 2026. Direct founder access. Source code yours from day one. Three tiers: the audit at $1,500, the website + AI bundle at $5,000, and the Founding Partnership at $5,000 (capped at three spots).
        </p>
        <Link to="/pricing">
          <RippleButton variant="secondary" style={{
            padding: "16px 36px", fontSize: "15px",
            background: "#fff", color: C.navy, borderColor: "transparent",
          }}>
            See all three tiers <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
      </div>
    </section>
  );
}

/* ── Audience strip — names the trades the homepage commits to (HVAC,
     electrical, plumbing as the wedge core; garage doors / roofing /
     home services as adjacent trades that share the after-hours pain).
     Per the v2 trades-wedge framing, the homepage is the cold-traffic
     destination for trades operators — non-trades visitors land via
     founder DM on /salons, /auto-shops, etc. ─────────────────────── */
function TradesStrip() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade,
      padding: "28px 24px",
      borderTop: `1px solid ${v("divider")}`,
      borderBottom: `1px solid ${v("divider")}`,
      background: v("bg-alt"),
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "20px",
        flexWrap: "wrap", maxWidth: "1100px", margin: "0 auto",
        textAlign: "center",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), display: "inline-flex", alignItems: "center", gap: "8px",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: "8px" }}>{"◆"}</span> Built for the trades
        </span>
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(16px, 2.2vw, 22px)", color: v("text"), lineHeight: 1.4,
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
