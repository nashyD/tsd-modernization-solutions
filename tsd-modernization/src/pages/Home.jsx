import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { C, v, useFadeIn, useCountUp, DiamondDivider, Card, RippleButton, SectionHeader } from "../shared";
import { ArrowRightIcon } from "../icons";

/* ── Holographic particles overlay ────────────────────────────── */
function HoloParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 12,
    duration: 8 + Math.random() * 10,
    opacity: 0.2 + Math.random() * 0.5,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.left, bottom: "-10px",
          width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
          background: i % 3 === 0 ? C.carolinaLight : i % 3 === 1 ? C.carolina : C.gold,
          animation: `particleFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
          opacity: 0,
          boxShadow: `0 0 ${p.size * 3}px ${i % 3 === 0 ? C.carolinaLight : C.carolina}`,
        }} />
      ))}
      {/* Pulsing glow dots on buildings */}
      {[
        { x: "15%", y: "30%" }, { x: "85%", y: "25%" }, { x: "10%", y: "55%" },
        { x: "90%", y: "50%" }, { x: "25%", y: "20%" }, { x: "75%", y: "35%" },
      ].map((d, i) => (
        <div key={`glow-${i}`} style={{
          position: "absolute", left: d.x, top: d.y,
          width: "6px", height: "6px", borderRadius: "50%",
          background: C.carolinaLight,
          animation: `particlePulse ${3 + i * 0.7}s ${i * 0.5}s ease-in-out infinite`,
          boxShadow: `0 0 12px ${C.carolinaLight}, 0 0 24px rgba(123,184,224,0.3)`,
        }} />
      ))}
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  const [r1, f1] = useFadeIn(200);
  const [r2, f2] = useFadeIn(400);
  const [r3, f3] = useFadeIn(600);
  const [r4, f4] = useFadeIn(800);

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

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      background: "var(--c-bg)",
      paddingTop: "140px", paddingBottom: "80px",
    }}>
      {/* Storefront image — base layer and mobile fallback */}
      <div className="hero-bg" style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/hero-storefront.jpg)",
        backgroundSize: "cover", backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Palindrome video loop — viewport-specific source & fit.
          `key` forces React to remount on viewport change so the new <source> is picked up. */}
      <video
        key={isMobile ? "mobile" : "desktop"}
        className="hero-video"
        autoPlay muted loop playsInline
        preload="metadata"
        poster={isMobile ? "/hero-loop-mobile-poster.jpg" : "/hero-loop-poster.jpg"}
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          width: "100%", height: "100%",
          objectFit: "contain",
          objectPosition: "center center",
          background: "var(--c-bg)",
        }}
      >
        <source src={isMobile ? "/hero-loop-mobile.mp4" : "/hero-loop.mp4"} type="video/mp4" />
      </video>

      {/* Reveal overlay — a sliver of solid bg at top (tucks behind nav), then clears to reveal the full video frame, solid bg at bottom */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(to bottom,
          var(--c-bg) 0%,
          var(--c-bg) 8%,
          transparent 20%,
          transparent 82%,
          var(--c-bg) 90%,
          var(--c-bg) 100%)`,
      }} />

      {/* Soft darkening behind text for readability (no hard edge) */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 45% at 50% 32%, rgba(12,21,36,0.55) 0%, rgba(12,21,36,0.25) 45%, transparent 75%)",
      }} />

      {/* Holographic glow concentrated in the visible video band */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `radial-gradient(ellipse at 20% 65%, rgba(75,156,211,0.1) 0%, transparent 40%),
                     radial-gradient(ellipse at 80% 65%, rgba(123,184,224,0.08) 0%, transparent 40%)`,
        animation: "heroGlow 6s ease-in-out infinite",
      }} />

      <HoloParticles />

      {/* Content */}
      <div style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 3, padding: "0 24px" }}>
        <div ref={r1} style={{
          ...f1, fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: C.carolinaLight, marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
          textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)",
        }}>
          <span style={{ fontSize: "8px" }}>{"\u25C6"}</span> Small Business Modernization Specialists
        </div>

        <h1 ref={r2} style={{
          ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(32px, 5.5vw, 64px)", letterSpacing: "-2px", lineHeight: 1.08,
          color: "#fff", marginBottom: "20px",
          textShadow: "0 4px 24px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)",
        }}>
          The world moved forward.{" "}
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            color: "#f4f9fd",
            textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9), 0 0 32px rgba(0,0,0,0.5)",
          }}>Your business can too.</span>
        </h1>

        <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

        <p ref={r3} style={{
          ...f3, fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.85)",
          maxWidth: "520px", margin: "0 auto 36px",
          textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.7)",
        }}>
          AI integration, custom websites, and workflow automation for Charlotte-area small businesses.
          Real results at a fraction of agency prices.
        </p>

        <div ref={r4} style={{ ...f4, display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/contact">
            <RippleButton variant="primary" style={{ padding: "16px 36px", fontSize: "15px" }}>
              Book Free Consultation <ArrowRightIcon size={16} />
            </RippleButton>
          </Link>
          <Link to="/services">
            <RippleButton variant="secondary" style={{
              padding: "16px 36px", fontSize: "15px",
              background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)", color: "#fff",
            }}>
              Our Services
            </RippleButton>
          </Link>
        </div>
      </div>

    </section>
  );
}

/* ── Stats ─────────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { end: 50000, suffix: "+", label: "Small businesses in Charlotte metro" },
    { end: 30, suffix: "%", prefix: "<", label: "Have adopted AI tools" },
    { end: 48, suffix: "hr", label: "From audit to proposal" },
    { end: 95, suffix: "%+", label: "Client satisfaction rate" },
  ];
  return (
    <section style={{
      padding: "0 48px", maxWidth: "1100px", margin: "-20px auto 80px",
      position: "relative", zIndex: 2,
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px",
        background: v("divider"), borderRadius: "20px", overflow: "hidden",
        border: `1px solid ${v("surface-border")}`,
      }}>
        {stats.map((s, i) => {
          const [count, ref] = useCountUp(s.end);
          return (
            <div key={i} ref={ref} style={{
              padding: "32px 24px", textAlign: "center", background: v("surface"),
            }}>
              <div style={{
                fontSize: "32px", fontWeight: 800, letterSpacing: "-1px",
                background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: "6px", fontFamily: "var(--font-body)",
              }}>
                {s.prefix || ""}{count.toLocaleString()}{s.suffix}
              </div>
              <div style={{ fontSize: "13px", color: v("text-muted"), fontWeight: 500 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </section>
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
    body: "Every project ends with documentation and training your team can actually use. When we're done, you run it — no vendor lock-in, no hostage fees, no calling a ticketing queue for a password reset. 95% of our clients stay modern because they understand what's under the hood.",
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
      <SectionHeader
        center
        label="Why We're Here"
        title="Main street built Charlotte."
        titleAccent="Let's keep it that way."
        sub="Those numbers above are the problem. Fifty thousand small businesses in this metro, and fewer than a third have modern tools. It isn't because they don't want them — it's because nobody builds for them. That gap is why we exist."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {WHY_BEATS.map((b, i) => (
          <Card key={i} delay={i * 120}>
            <div style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
              color: v("accent"), marginBottom: "18px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ fontSize: "7px" }}>{"\u25C6"}</span> {b.label}
            </div>
            <h3 style={{
              fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 700,
              color: v("text"), marginBottom: "14px", lineHeight: 1.2, letterSpacing: "-0.3px",
            }}>
              {b.title}
            </h3>
            <p style={{ fontSize: "14px", lineHeight: 1.75, color: v("text-muted") }}>
              {b.body}
            </p>
          </Card>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <Link to="/why-us">
          <RippleButton variant="ghost" style={{ padding: "14px 32px" }}>
            See how we compare <ArrowRightIcon size={16} />
          </RippleButton>
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
      <Stats />
      <WhyWeDo />
    </>
  );
}
