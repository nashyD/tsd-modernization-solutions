import { Link } from "react-router-dom";
import { C, v, useFadeIn, useCountUp, DiamondDivider, Card, RippleButton, Tag } from "../shared";
import { BotIcon, GlobeIcon, CogIcon, ArrowRightIcon } from "../icons";

/* ── Floating stat cards in hero ──────────────────────────────── */
function FloatingCards() {
  const cards = [
    { label: "AI Workflows", value: "+340%", x: "8%", y: "22%", anim: "float1", dur: "6s" },
    { label: "Tasks Automated", value: "2,400+", x: "78%", y: "18%", anim: "float2", dur: "7s" },
    { label: "Avg Response", value: "<2hr", x: "72%", y: "68%", anim: "float1", dur: "8s" },
  ];
  return cards.map((c, i) => (
    <div key={i} style={{
      position: "absolute", left: c.x, top: c.y,
      padding: "14px 20px", borderRadius: "14px",
      background: v("surface"), border: `1px solid ${v("surface-border")}`,
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      animation: `${c.anim} ${c.dur} ease-in-out infinite`,
      zIndex: 2, display: "none",
    }} className="desktop-nav">{/* Only show on desktop */}
      <div style={{ fontSize: "18px", fontWeight: 800, color: v("accent"), letterSpacing: "-0.5px" }}>{c.value}</div>
      <div style={{ fontSize: "11px", fontWeight: 600, color: v("text-dim"), letterSpacing: "0.5px" }}>{c.label}</div>
    </div>
  ));
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  const [r1, f1] = useFadeIn(0);
  const [r2, f2] = useFadeIn(150);
  const [r3, f3] = useFadeIn(300);
  const [r4, f4] = useFadeIn(450);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 48px 80px",
    }}>
      {/* Background orb */}
      <div style={{
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        background: `radial-gradient(circle, rgba(75,156,211,0.08) 0%, transparent 70%)`,
        top: "10%", left: "50%", transform: "translateX(-50%)",
        animation: "orbFloat 15s ease-in-out infinite", pointerEvents: "none",
      }} />

      <FloatingCards />

      <div style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 3 }}>
        {/* Label */}
        <div ref={r1} style={{
          ...f1, fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
        }}>
          <span style={{ fontSize: "8px" }}>{"\u25C6"}</span> Small Business Modernization Specialists
        </div>

        {/* Headline */}
        <h1 ref={r2} style={{
          ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-2px", lineHeight: 1.05,
          color: v("text"), marginBottom: "24px",
        }}>
          We bring your business{" "}
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>into the future</span>
        </h1>

        <DiamondDivider width={180} style={{ marginBottom: "24px" }} />

        {/* Subtitle */}
        <p ref={r3} style={{
          ...f3, fontSize: "18px", lineHeight: 1.7, color: v("text-muted"),
          maxWidth: "560px", margin: "0 auto 40px",
        }}>
          AI integration, custom websites, and workflow automation for Charlotte-area small businesses.
          Real results at a fraction of agency prices.
        </p>

        {/* CTAs */}
        <div ref={r4} style={{ ...f4, display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/contact">
            <RippleButton variant="primary" style={{ padding: "16px 36px", fontSize: "15px" }}>
              Book Free Consultation <ArrowRightIcon size={16} />
            </RippleButton>
          </Link>
          <Link to="/services">
            <RippleButton variant="secondary" style={{ padding: "16px 36px", fontSize: "15px" }}>
              Our Services
            </RippleButton>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        animation: "scrollBounce 2s ease-in-out infinite", opacity: 0.4,
      }}>
        <div style={{ width: "20px", height: "32px", borderRadius: "10px", border: `1.5px solid ${v("text-dim")}`, position: "relative" }}>
          <div style={{
            width: "3px", height: "6px", borderRadius: "2px", background: v("text-dim"),
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
