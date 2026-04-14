import { Link } from "react-router-dom";
import { C, v, useFadeIn, useCountUp, DiamondDivider, Card, RippleButton, Tag } from "../shared";
import { BotIcon, GlobeIcon, CogIcon, ArrowRightIcon } from "../icons";

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

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "flex-end", justifyContent: "center",
      position: "relative", overflow: "hidden", paddingBottom: "80px",
    }}>
      {/* Storefront image — base layer and mobile fallback */}
      <div className="hero-bg" style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/hero-storefront.jpg)",
        backgroundSize: "cover", backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Palindrome video loop (desktop only — hidden on mobile via CSS) */}
      <video
        className="hero-video"
        autoPlay muted loop playsInline
        preload="metadata"
        poster="/hero-loop-poster.jpg"
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 40%",
        }}
      >
        <source src="/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay gradient — heavier at bottom for text readability, fully opaque at edge to blend into page bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `linear-gradient(to bottom, rgba(12,21,36,0.3) 0%, rgba(12,21,36,0.5) 40%, rgba(12,21,36,0.85) 70%, rgba(12,21,36,1) 95%)`,
      }} />

      {/* Holographic glow on the edges */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `radial-gradient(ellipse at 20% 30%, rgba(75,156,211,0.08) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 25%, rgba(123,184,224,0.06) 0%, transparent 50%)`,
        animation: "heroGlow 6s ease-in-out infinite",
      }} />

      <HoloParticles />

      {/* Content */}
      <div style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 3, padding: "0 24px" }}>
        <div ref={r1} style={{
          ...f1, fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: C.carolinaLight, marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}>
          <span style={{ fontSize: "8px" }}>{"\u25C6"}</span> Small Business Modernization Specialists
        </div>

        <h1 ref={r2} style={{
          ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(32px, 5.5vw, 64px)", letterSpacing: "-2px", lineHeight: 1.08,
          color: "#fff", marginBottom: "20px",
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
          The world moved forward.{" "}
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(75,156,211,0.4))",
          }}>Your business can too.</span>
        </h1>

        <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

        <p ref={r3} style={{
          ...f3, fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.75)",
          maxWidth: "520px", margin: "0 auto 36px",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
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

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        animation: "scrollBounce 2s ease-in-out infinite", opacity: 0.5, zIndex: 3,
      }}>
        <div style={{ width: "20px", height: "32px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,0.3)", position: "relative" }}>
          <div style={{
            width: "3px", height: "6px", borderRadius: "2px", background: "rgba(255,255,255,0.4)",
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            animation: "scrollDot 1.5s ease-in-out infinite",
          }} />
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

/* ── Services preview ──────────────────────────────────────────── */
const SERVICES = [
  { Icon: BotIcon, title: "AI Integration & Automation", desc: "Deploy chatbots, automate repetitive workflows, and unlock AI-powered insights that save your team hours every week.", tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling"], gradient: C.gradientPrism },
  { Icon: GlobeIcon, title: "Website Creation", desc: "Fast, mobile-first websites that look great and show up in search results. Includes documentation so you can update content yourself.", tags: ["React", "SEO", "Mobile-First", "CMS"], gradient: C.gradientAccent },
  { Icon: CogIcon, title: "Process Modernization", desc: "Replace spreadsheets and manual processes with streamlined digital tools. We audit your workflow and build exactly what you need.", tags: ["Workflows", "Dashboards", "Integrations", "Training"], gradient: "linear-gradient(135deg, #2c5f8a 0%, #13294B 100%)" },
];

function ServicesPreview() {
  return (
    <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <div style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
        }}>
          <span style={{ fontSize: "8px" }}>{"\u25C6"}</span> What We Do
        </div>
        <h2 style={{
          fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)",
          letterSpacing: "-0.5px", lineHeight: 1.1, color: v("text"), marginBottom: "16px",
        }}>
          Three ways we{" "}
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>modernize</span>
        </h2>
        <p style={{ fontSize: "17px", color: v("text-muted"), maxWidth: "520px", margin: "0 auto", lineHeight: 1.65 }}>
          Every service is hands-on, documented, and priced for small business budgets.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {SERVICES.map((s, i) => (
          <Card key={i} delay={i * 120}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px", background: s.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", marginBottom: "24px",
            }}>
              <s.Icon size={24} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: v("text"), marginBottom: "12px" }}>{s.title}</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-muted"), marginBottom: "20px" }}>{s.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <Link to="/services">
          <RippleButton variant="ghost" style={{ padding: "14px 32px" }}>
            View All Services <ArrowRightIcon size={16} />
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
      <ServicesPreview />
    </>
  );
}
