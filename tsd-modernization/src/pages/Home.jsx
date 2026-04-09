import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { C, useCountUp, GridBg, GradientOrbs, RippleButton } from "../shared";

function FloatingCards() {
  const cardBase = {
    position: "absolute", borderRadius: "16px",
    background: C.glass, border: `1px solid ${C.glassBorder}`,
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    padding: "16px 20px", pointerEvents: "none",
  };
  const iconBox = (bg) => ({
    width: "36px", height: "36px", borderRadius: "10px", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
  });
  return (
    <div className="hero-floating-cards" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ ...cardBase, top: "18%", right: "8%", animation: "cardFloat1 8s ease-in-out infinite", opacity: 0.7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={iconBox(C.gradient1)}>&#9889;</div>
          <div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500 }}>AI Workflows</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>+340%</div>
          </div>
        </div>
      </div>
      <div style={{ ...cardBase, bottom: "22%", left: "6%", animation: "cardFloat2 10s ease-in-out infinite 2s", opacity: 0.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={iconBox(C.gradient3)}>&#10003;</div>
          <div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500 }}>Tasks Automated</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>2,400+</div>
          </div>
        </div>
      </div>
      <div style={{ ...cardBase, top: "55%", right: "5%", animation: "cardFloat3 9s ease-in-out infinite 4s", opacity: 0.5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={iconBox(C.gradient2)}>&#128337;</div>
          <div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500 }}>Avg Response</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>&lt;2hr</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ refProp, val, label, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <div ref={refProp} style={{
      background: hover ? "rgba(255,255,255,0.07)" : C.glass,
      border: `1px solid ${hover ? `rgba(${C.accentRGB},0.3)` : C.glassBorder}`,
      borderRadius: "20px", padding: "32px 24px", textAlign: "center",
      backdropFilter: "blur(12px)",
      transition: "all 0.3s ease",
      transform: hover ? "translateY(-4px)" : "translateY(0)",
      boxShadow: hover ? `0 8px 30px rgba(${C.accentRGB},0.12)` : "none",
    }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div style={{ fontSize: "24px", marginBottom: "12px" }}>{icon}</div>
      <div style={{
        fontSize: "36px", fontWeight: 800, marginBottom: "4px",
        background: C.gradientHero, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{val}</div>
      <div style={{ fontSize: "14px", fontWeight: 500, color: C.textMuted }}>{label}</div>
    </div>
  );
}

export default function Home() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t); }, []);
  const fadeUp = (d) => ({
    opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  });

  const [s1, r1] = useCountUp(50000);
  const [s2, r2] = useCountUp(30);
  const [s3, r3] = useCountUp(48);
  const [s4, r4] = useCountUp(95);

  return (
    <>
      {/* Hero */}
      <section id="hero" style={{
        position: "relative", minHeight: "100vh", background: C.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", overflow: "hidden",
      }}>
        <GridBg />
        <GradientOrbs />
        <FloatingCards />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "780px", textAlign: "center" }}>
          <div style={{
            ...fadeUp(0), display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 20px", borderRadius: "50px",
            background: C.glass, border: `1px solid ${C.glassBorder}`,
            backdropFilter: "blur(12px)", fontSize: "13px", fontWeight: 600,
            color: C.accentLight, letterSpacing: "0.5px", textTransform: "uppercase",
            marginBottom: "36px",
          }}>
            <span style={{ fontSize: "14px" }}>&#9889;</span>
            Charlotte's Small Business Modernization Partner
          </div>

          <h1 style={{
            ...fadeUp(150), fontSize: "clamp(42px, 6.5vw, 78px)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-2.5px", color: C.text, marginBottom: "28px",
          }}>
            Bring Your Business<br />
            <span style={{ background: C.gradientHero, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Into the Future</span>
          </h1>

          <p style={{
            ...fadeUp(300), fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.65,
            color: C.textMuted, maxWidth: "560px", margin: "0 auto 48px",
          }}>
            AI integration, custom websites, and workflow automation built
            for small businesses in the Charlotte metro area. Real results,
            transparent pricing, no corporate fluff.
          </p>

          <div style={{ ...fadeUp(450), display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact" style={{ textDecoration: "none" }}>
              <RippleButton style={{
                padding: "18px 40px", borderRadius: "14px", background: C.gradient1,
                color: "#fff", fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
                boxShadow: `0 0 30px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 50px ${C.accentGlow}, 0 12px 40px rgba(0,0,0,0.35)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 30px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`; }}
              >Book a Free Tech Audit &rarr;</RippleButton>
            </Link>
            <Link to="/services" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "18px 40px", borderRadius: "14px",
                background: C.glass, border: `1px solid ${C.glassBorder}`,
                backdropFilter: "blur(12px)", color: C.text,
                fontSize: "16px", fontWeight: 600, cursor: "pointer",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = C.glassHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = C.glass; }}
              >Explore Services</button>
            </Link>
          </div>

          <div style={{ ...fadeUp(600), marginTop: "56px", display: "flex", alignItems: "center", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
            {[
              { label: "Free consultation", icon: "&#10003;" },
              { label: "48hr proposals", icon: "&#9889;" },
              { label: "3-5x below agency rates", icon: "&#128176;" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.textMuted, fontWeight: 500 }}>
                <span style={{
                  width: "24px", height: "24px", borderRadius: "8px",
                  background: `rgba(${C.accentRGB},0.15)`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: C.accentLight,
                }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          animation: "scrollBounce 2s ease-in-out infinite", opacity: 0.4,
        }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: "24px", height: "40px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.15)", position: "relative" }}>
            <div style={{
              width: "4px", height: "8px", borderRadius: "2px", background: "rgba(255,255,255,0.3)",
              position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
              animation: "scrollDot 2s ease-in-out infinite",
            }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px", padding: "60px 48px", maxWidth: "1200px", margin: "0 auto",
      }}>
        <StatCard refProp={r1} val={`${s1.toLocaleString()}+`} label="Small Businesses in Charlotte" icon={"\u{1F3E2}"} />
        <StatCard refProp={r2} val={`<${s2}%`} label="Have Adopted AI Tools" icon={"\u{1F916}"} />
        <StatCard refProp={r3} val={`${s3}hr`} label="Proposal Turnaround" icon={"\u26A1"} />
        <StatCard refProp={r4} val={`${s4}%+`} label="Gross Margin" icon={"\u{1F4C8}"} />
      </div>
    </>
  );
}
