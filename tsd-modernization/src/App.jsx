import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design System ─────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0f",
  bgAlt: "#0e0e16",
  glass: "rgba(255,255,255,0.05)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassHover: "rgba(255,255,255,0.08)",
  text: "#f0f0f5",
  textMuted: "rgba(255,255,255,0.55)",
  textDim: "rgba(255,255,255,0.35)",
  accent: "#7c5cfc",
  accentLight: "#a78bfa",
  accentGlow: "rgba(124,92,252,0.4)",
  accentGlowStrong: "rgba(124,92,252,0.6)",
  cyan: "#06d6a0",
  cyanGlow: "rgba(6,214,160,0.3)",
  pink: "#f472b6",
  pinkGlow: "rgba(244,114,182,0.25)",
  success: "#06d6a0",
  gradient1: "linear-gradient(135deg, #7c5cfc 0%, #a78bfa 100%)",
  gradient2: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
  gradient3: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  gradientHero: "linear-gradient(135deg, #7c5cfc 0%, #a78bfa 40%, #06d6a0 100%)",
  divider: "rgba(255,255,255,0.06)",
};

// ─── Hooks ─────────────────────────────────────────────────────────────────
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const go = () => {
      if (started.current) return;
      started.current = true;
      let start = 0;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setCount(Math.floor(p * end));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { go(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { go(); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return [count, ref];
}

function useFadeIn(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const trigger = () => setVisible(true);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) { trigger(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { trigger(); observer.disconnect(); }
    }, { threshold: 0, rootMargin: "100px 0px 0px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return [ref, {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  }];
}

function useTilt() {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  }, []);
  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)";
  }, []);
  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
}

// ─── Grid Background ──────────────────────────────────────────────────────
function GridBg({ opacity = 0.03 }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, ${C.bg} 100%)`,
      }} />
    </div>
  );
}

// ─── Section Divider ─────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
      <div style={{
        height: "1px",
        background: `linear-gradient(90deg, transparent 0%, ${C.glassBorder} 20%, rgba(124,92,252,0.2) 50%, ${C.glassBorder} 80%, transparent 100%)`,
      }} />
    </div>
  );
}

// ─── Gradient Orbs ────────────────────────────────────────────────────────
function GradientOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: "600px", height: "600px",
        borderRadius: "50%", filter: "blur(120px)", opacity: 0.35,
        background: `radial-gradient(circle, ${C.accent}, transparent)`,
        top: "-15%", right: "-10%", animation: "orbFloat1 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: "500px", height: "500px",
        borderRadius: "50%", filter: "blur(100px)", opacity: 0.25,
        background: `radial-gradient(circle, ${C.cyan}, transparent)`,
        bottom: "-10%", left: "-8%", animation: "orbFloat2 15s ease-in-out infinite 3s",
      }} />
      <div style={{
        position: "absolute", width: "350px", height: "350px",
        borderRadius: "50%", filter: "blur(90px)", opacity: 0.2,
        background: `radial-gradient(circle, ${C.pink}, transparent)`,
        top: "35%", left: "55%", animation: "orbFloat3 18s ease-in-out infinite 6s",
      }} />
    </div>
  );
}

// ─── Floating Hero Cards ──────────────────────────────────────────────────
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
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ ...cardBase, top: "18%", right: "8%", animation: "cardFloat1 8s ease-in-out infinite", opacity: 0.7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={iconBox("linear-gradient(135deg, #7c5cfc, #a78bfa)")}>&#9889;</div>
          <div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500 }}>AI Workflows</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>+340%</div>
          </div>
        </div>
      </div>
      <div style={{ ...cardBase, bottom: "22%", left: "6%", animation: "cardFloat2 10s ease-in-out infinite 2s", opacity: 0.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={iconBox("linear-gradient(135deg, #06d6a0, #34d399)")}>&#10003;</div>
          <div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500 }}>Tasks Automated</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>2,400+</div>
          </div>
        </div>
      </div>
      <div style={{ ...cardBase, top: "55%", right: "5%", animation: "cardFloat3 9s ease-in-out infinite 4s", opacity: 0.5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={iconBox("linear-gradient(135deg, #f472b6, #f9a8d4)")}>&#128337;</div>
          <div>
            <div style={{ fontSize: "11px", color: C.textMuted, fontWeight: 500 }}>Avg Response</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: C.text }}>&lt;2hr</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Glass Card (reusable with tilt) ──────────────────────────────────────
function GlassCard({ children, style, hoverGlow, delay = 0, enableTilt = false, ...props }) {
  const [hover, setHover] = useState(false);
  const [ref, fadeStyle] = useFadeIn(delay);
  const tilt = useTilt();
  const cardRef = useCallback((node) => {
    ref.current = node;
    tilt.ref.current = node;
  }, [ref, tilt.ref]);

  return (
    <div ref={cardRef} style={{
      background: C.glass,
      border: `1px solid ${hover ? "rgba(255,255,255,0.12)" : C.glassBorder}`,
      borderRadius: "24px", padding: "40px",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
      boxShadow: hover && hoverGlow ? `0 8px 40px ${hoverGlow}` : "0 4px 20px rgba(0,0,0,0.2)",
      cursor: "default",
      ...fadeStyle,
      ...style,
    }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={(e) => { setHover(false); if (enableTilt) tilt.onMouseLeave(e); }}
      onMouseMove={enableTilt ? tilt.onMouseMove : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────
function SectionHeader({ label, title, titleAccent, sub, center }) {
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <div ref={ref} style={{ ...fadeStyle, textAlign: center ? "center" : "left", marginBottom: "40px" }}>
      <div style={{
        display: center ? "flex" : "inline-flex", alignItems: "center", gap: "8px",
        justifyContent: center ? "center" : "flex-start",
        fontSize: "13px", fontWeight: 700, color: C.accentLight,
        textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px",
      }}>&#9670; {label}</div>
      <h2 style={{
        fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800,
        lineHeight: 1.15, letterSpacing: "-1px", color: C.text, marginBottom: "16px",
      }}>
        {title}{" "}
        <span style={{
          background: C.gradientHero,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{titleAccent}</span>
      </h2>
      <p style={{
        fontSize: "18px", lineHeight: 1.6, color: C.textMuted,
        maxWidth: "600px", margin: center ? "0 auto" : undefined,
      }}>{sub}</p>
    </div>
  );
}

// ─── Ripple Button ────────────────────────────────────────────────────────
function RippleButton({ children, style, onClick, ...props }) {
  const btnRef = useRef(null);
  const handleClick = (e) => {
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    if (onClick) onClick(e);
  };
  return (
    <button ref={btnRef} style={{
      position: "relative", overflow: "hidden", ...style,
    }} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────
function Nav({ scrolled, onScrollTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.divider}` : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <div onClick={() => onScrollTo("hero")} style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer", zIndex: 1001 }}>
        <span style={{ background: C.gradient1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TSD</span>
        <span style={{ fontWeight: 400, color: C.textMuted }}> Modernization</span>
      </div>

      {/* Desktop nav */}
      <ul className="desktop-nav" style={{ display: "flex", gap: "32px", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
        {["Services", "Process", "Pricing", "Team"].map((item) => (
          <li key={item}>
            <button style={{
              fontSize: "14px", fontWeight: 500, color: C.textMuted,
              cursor: "pointer", transition: "color 0.2s ease",
              background: "none", border: "none", padding: 0,
            }}
              onClick={() => onScrollTo(item.toLowerCase())}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => (e.target.style.color = C.textMuted)}
            >{item}</button>
          </li>
        ))}
        <li>
          <RippleButton style={{
            padding: "10px 24px", borderRadius: "12px", background: C.gradient1,
            color: "#fff", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
            boxShadow: `0 4px 20px ${C.accentGlow}`,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
            onClick={() => onScrollTo("contact")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 30px ${C.accentGlow}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${C.accentGlow}`; }}
          >Free Consultation</RippleButton>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" style={{
        display: "none", background: "none", border: "none", cursor: "pointer",
        padding: "8px", zIndex: 1001,
      }} onClick={() => setMenuOpen(!menuOpen)}>
        <div style={{
          width: "24px", height: "2px", background: C.text, marginBottom: "6px",
          transition: "all 0.3s ease",
          transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
        }} />
        <div style={{
          width: "24px", height: "2px", background: C.text,
          transition: "all 0.3s ease",
          opacity: menuOpen ? 0 : 1,
        }} />
        <div style={{
          width: "24px", height: "2px", background: C.text, marginTop: "6px",
          transition: "all 0.3s ease",
          transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
        }} />
      </button>

      {/* Mobile menu overlay */}
      <div className="mobile-menu" style={{
        position: "fixed", inset: 0, background: "rgba(10,10,15,0.97)",
        backdropFilter: "blur(20px)", zIndex: 999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}>
        {["Services", "Process", "Pricing", "Team", "Contact"].map((item) => (
          <button key={item} style={{
            fontSize: "28px", fontWeight: 700, color: C.text,
            background: "none", border: "none", cursor: "pointer",
            transition: "color 0.2s ease",
          }}
            onClick={() => { onScrollTo(item.toLowerCase()); setMenuOpen(false); }}
          >{item}</button>
        ))}
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────
function HeroSection({ onScrollTo }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t); }, []);
  const fadeUp = (d) => ({
    opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  });

  return (
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
          <RippleButton onClick={() => onScrollTo("contact")} style={{
            padding: "18px 40px", borderRadius: "14px", background: C.gradient1,
            color: "#fff", fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
            boxShadow: `0 0 30px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 50px ${C.accentGlow}, 0 12px 40px rgba(0,0,0,0.35)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 30px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`; }}
          >Book a Free Tech Audit &rarr;</RippleButton>
          <button onClick={() => onScrollTo("services")} style={{
            padding: "18px 40px", borderRadius: "14px",
            background: C.glass, border: `1px solid ${C.glassBorder}`,
            backdropFilter: "blur(12px)", color: C.text,
            fontSize: "16px", fontWeight: 600, cursor: "pointer",
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = C.glassHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = C.glass; }}
          >Explore Services</button>
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
                background: "rgba(124,92,252,0.15)",
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
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────
function StatCard({ refProp, val, label, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <div ref={refProp} style={{
      background: hover ? "rgba(255,255,255,0.07)" : C.glass,
      border: `1px solid ${hover ? "rgba(124,92,252,0.3)" : C.glassBorder}`,
      borderRadius: "20px", padding: "32px 24px", textAlign: "center",
      backdropFilter: "blur(12px)",
      transition: "all 0.3s ease",
      transform: hover ? "translateY(-4px)" : "translateY(0)",
      boxShadow: hover ? `0 8px 30px rgba(124,92,252,0.12)` : "none",
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

// ─── Stats Section ────────────────────────────────────────────────────────
function StatsSection() {
  const [s1, r1] = useCountUp(50000);
  const [s2, r2] = useCountUp(30);
  const [s3, r3] = useCountUp(48);
  const [s4, r4] = useCountUp(95);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px", padding: "60px 48px", maxWidth: "1200px", margin: "0 auto",
    }}>
      <StatCard refProp={r1} val={`${s1.toLocaleString()}+`} label="Small Businesses in Charlotte" icon={"\u{1F3E2}"} />
      <StatCard refProp={r2} val={`<${s2}%`} label="Have Adopted AI Tools" icon={"\u{1F916}"} />
      <StatCard refProp={r3} val={`${s3}hr`} label="Proposal Turnaround" icon={"\u26A1"} />
      <StatCard refProp={r4} val={`${s4}%+`} label="Gross Margin" icon={"\u{1F4C8}"} />
    </div>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    {
      icon: "&#129302;", title: "AI Integration & Automation",
      desc: "Deploy intelligent chatbots, automate repetitive workflows, and unlock AI-powered insights — so you can focus on running your business.",
      tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling"],
      gradient: C.gradient1, glow: C.accentGlow,
    },
    {
      icon: "&#128187;", title: "Website Creation & Redesign",
      desc: "Professional, conversion-focused websites with built-in SEO, chatbot integration, and comprehensive handoff documentation.",
      tags: ["Webflow", "WordPress", "SEO", "Analytics"],
      gradient: C.gradient2, glow: "rgba(14,165,233,0.3)",
    },
    {
      icon: "&#128200;", title: "Process Modernization",
      desc: "A structured tech audit and written roadmap that maps your operations, identifies bottlenecks, and prioritizes implementation.",
      tags: ["Tech Audit", "Roadmap", "ROI Analysis", "Training"],
      gradient: C.gradient3, glow: "rgba(245,158,11,0.25)",
    },
  ];
  return (
    <section id="services" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <SectionHeader label="What We Do" title="Three Ways to" titleAccent="Modernize"
        sub="From AI-powered customer service to complete website overhauls, we help Charlotte businesses work smarter — not harder." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
        {services.map((s, i) => (
          <GlassCard key={i} delay={i * 150} hoverGlow={s.glow} enableTilt>
            <div style={{
              width: "64px", height: "64px", borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", marginBottom: "24px", background: s.gradient,
              boxShadow: `0 8px 24px ${s.glow}`,
            }}>
              <span dangerouslySetInnerHTML={{ __html: s.icon }} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px", color: C.text }}>{s.title}</h3>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "20px" }}>{s.desc}</p>
            <div>
              {s.tags.map((tag, j) => (
                <span key={j} style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: 600, marginRight: "8px", marginBottom: "8px",
                  background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)",
                  color: C.accentLight,
                }}>{tag}</span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// ─── Why Choose Us Section ────────────────────────────────────────────────
function WhyChooseUsSection() {
  const comparisons = [
    { type: "Digital Agencies", price: "$2,000–$5,000+", speed: "6–12 weeks", ai: "Limited", support: "Account manager" },
    { type: "TSD Modernization", price: "$150–$1,800", speed: "2–4 weeks", ai: "AI-first", support: "Founders directly", featured: true },
    { type: "Freelancers", price: "$500–$2,000", speed: "4–8 weeks", ai: "Varies", support: "Inconsistent" },
    { type: "DIY (Wix/Squarespace)", price: "$0–$300", speed: "You do it", ai: "None", support: "Help articles" },
  ];
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      <SectionHeader center label="Why Us" title="How We" titleAccent="Compare"
        sub="We combine agency quality with startup speed and founder-level attention — at a fraction of the cost." />
      <div ref={ref} style={{ ...fadeStyle, overflowX: "auto" }}>
        <table style={{
          width: "100%", borderCollapse: "separate", borderSpacing: "0 8px",
          fontSize: "14px", minWidth: "600px",
        }}>
          <thead>
            <tr>
              {["", "Price Range", "Turnaround", "AI Expertise", "Support"].map((h, i) => (
                <th key={i} style={{
                  padding: "12px 16px", textAlign: "left", fontWeight: 600,
                  color: C.textDim, fontSize: "12px", textTransform: "uppercase",
                  letterSpacing: "1px",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c, i) => (
              <tr key={i} style={{
                background: c.featured ? "rgba(124,92,252,0.15)" : C.glass,
                borderRadius: "12px",
              }}>
                <td style={{
                  padding: "16px", fontWeight: 700, color: c.featured ? C.accentLight : C.text,
                  borderRadius: "12px 0 0 12px",
                  border: c.featured ? "1px solid rgba(124,92,252,0.3)" : `1px solid ${C.glassBorder}`,
                  borderRight: "none",
                }}>
                  {c.type}
                  {c.featured && <span style={{
                    marginLeft: "8px", padding: "2px 8px", borderRadius: "6px",
                    background: C.gradient1, color: "#fff", fontSize: "10px", fontWeight: 700,
                  }}>YOU ARE HERE</span>}
                </td>
                {[c.price, c.speed, c.ai, c.support].map((val, j) => (
                  <td key={j} style={{
                    padding: "16px", color: c.featured ? C.text : C.textMuted,
                    fontWeight: c.featured ? 600 : 400,
                    border: c.featured ? "1px solid rgba(124,92,252,0.3)" : `1px solid ${C.glassBorder}`,
                    borderLeft: "none",
                    borderRight: j < 3 ? "none" : undefined,
                    borderRadius: j === 3 ? "0 12px 12px 0" : undefined,
                  }}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────
function ProcessSection() {
  const steps = [
    { num: "01", title: "Discovery", desc: "1-2 hour deep dive into your business, current tools, pain points, and goals.", gradient: C.gradient1 },
    { num: "02", title: "Proposal", desc: "Within 48 hours, you receive a written proposal with fixed scope, timeline, and price.", gradient: C.gradient2 },
    { num: "03", title: "Build", desc: "We build your solution in 2-4 weeks with weekly check-ins, feedback loops, and revisions.", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)" },
    { num: "04", title: "Handoff", desc: "Step-by-step guides, video tutorials, and a 2-week support window — you own it fully.", gradient: C.gradient3 },
  ];
  return (
    <section id="process" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      <SectionHeader center label="How It Works" title="From Discovery to" titleAccent="Launch"
        sub="Our streamlined 4-phase process gets you from first conversation to fully operational — fast." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
        {steps.map((s, i) => {
          const [hover, setHover] = useState(false);
          const [ref, fadeStyle] = useFadeIn(i * 150);
          return (
            <div key={i} ref={ref} style={{
              ...fadeStyle,
              background: C.glass, border: `1px solid ${hover ? "rgba(255,255,255,0.12)" : C.glassBorder}`,
              borderRadius: "20px", padding: "36px 28px", textAlign: "center",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              transform: hover ? "translateY(-4px)" : "translateY(0)",
            }}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 800, margin: "0 auto 20px", color: "#fff",
                background: s.gradient,
              }}>{s.num}</div>
              <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: C.text }}>{s.title}</h4>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textMuted }}>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────
function PricingSection({ onScrollTo }) {
  const tiers = [
    {
      label: "Discovery", price: "$150-$250", range: "One-time engagement",
      features: ["2-3 hour structured tech audit", "Written modernization roadmap", "Tool & platform recommendations", "Priority sequence & estimated ROI", "No obligation to continue"],
      btn: "Book Tech Audit",
    },
    {
      label: "Website + AI Bundle", price: "$1,000-$1,800", range: "Our most popular package",
      features: ["5-8 page professional website", "AI chatbot integration", "2 automation workflows", "SEO & analytics setup", "Comprehensive handoff docs", "2-week post-launch support"],
      btn: "Start Your Project", featured: true,
    },
    {
      label: "Monthly Retainer", price: "$200-$500", range: "Per month, ongoing",
      features: ["Ongoing support & troubleshooting", "New automations & updates", "Performance monitoring", "Priority response time", "Monthly strategy check-in"],
      btn: "Learn More",
    },
  ];
  return (
    <section id="pricing" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <SectionHeader center label="Transparent Pricing" title="Agency Quality." titleAccent="Startup Pricing."
        sub="Deliberately 3-5x below agency rates. Fixed pricing, no surprises, no scope creep." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", alignItems: "start" }}>
        {tiers.map((t, i) => {
          const [hover, setHover] = useState(false);
          const [ref, fadeStyle] = useFadeIn(i * 150);
          const featured = t.featured;
          return (
            <div key={i} ref={ref} style={{
              ...fadeStyle,
              background: featured ? "linear-gradient(145deg, rgba(79,70,229,0.4), rgba(124,92,252,0.2))" : C.glass,
              border: `1px solid ${featured ? "rgba(124,92,252,0.4)" : hover ? "rgba(255,255,255,0.12)" : C.glassBorder}`,
              borderRadius: "24px", padding: "40px 32px", textAlign: "center",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              position: "relative",
              transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              transform: hover ? `${featured ? "scale(1.03)" : ""} translateY(-6px)`.trim() : featured ? "scale(1.03)" : "none",
              boxShadow: featured ? `0 20px 60px rgba(124,92,252,0.2)` : "none",
            }}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              {featured && (
                <>
                  <div style={{
                    position: "absolute", inset: "-1px", borderRadius: "25px",
                    background: "linear-gradient(135deg, #7c5cfc, #a78bfa, #06d6a0, #7c5cfc)",
                    backgroundSize: "300% 300%",
                    animation: "gradientShift 4s ease infinite",
                    zIndex: -1, opacity: 0.6,
                  }} />
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    padding: "6px 20px", borderRadius: "50px",
                    background: C.gradient1, color: "#fff",
                    fontSize: "12px", fontWeight: 700, boxShadow: `0 4px 15px ${C.accentGlow}`,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>Most Popular</div>
                </>
              )}
              <p style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: C.accentLight }}>{t.label}</p>
              <p style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "4px", color: C.text }}>{t.price}</p>
              <p style={{ fontSize: "14px", color: C.textMuted, marginBottom: "24px" }}>{t.range}</p>
              <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: "24px" }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", lineHeight: 1.6, padding: "8px 0", textAlign: "left", color: C.text }}>
                    <span style={{ color: C.success, fontSize: "16px" }}>&#10003;</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <RippleButton onClick={() => onScrollTo("contact")} style={{
                width: "100%", padding: "14px", borderRadius: "14px", fontSize: "15px",
                fontWeight: 600, border: "none", cursor: "pointer", marginTop: "28px",
                background: featured ? "#fff" : C.gradient1,
                color: featured ? "#4f46e5" : "#fff",
                boxShadow: featured ? "0 4px 15px rgba(255,255,255,0.15)" : `0 4px 15px ${C.accentGlow}`,
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >{t.btn}</RippleButton>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", background: C.glass,
          border: `1px solid ${C.glassBorder}`, borderRadius: "16px",
          padding: "24px 40px", fontSize: "15px", color: C.textMuted,
          backdropFilter: "blur(12px)",
        }}>
          <strong style={{ color: C.text }}>Need something specific?</strong>{" "}
          Individual services available: AI Chatbot Setup ($300-$600) &middot; Automation Build ($250-$500) &middot; Starter Website ($400-$800)
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Section ─────────────────────────────────────────────────
function SocialProofSection() {
  const testimonials = [
    {
      quote: "TSD helped us set up an AI chatbot that handles 60% of our customer inquiries. Our response time went from 4 hours to under 2 minutes.",
      author: "Local Restaurant Owner",
      role: "Charlotte, NC",
      metric: "60% fewer manual inquiries",
    },
    {
      quote: "They rebuilt our website and set up automated scheduling in just 3 weeks. The handoff documentation was so thorough I can manage everything myself.",
      author: "Dental Practice Manager",
      role: "Gastonia, NC",
      metric: "3-week turnaround",
    },
    {
      quote: "The tech audit alone was worth it. They identified 5 processes we could automate and saved us roughly 15 hours per week.",
      author: "Real Estate Brokerage",
      role: "Belmont, NC",
      metric: "15 hrs/week saved",
    },
  ];
  return (
    <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <SectionHeader center label="Results" title="What Our Clients" titleAccent="Experience"
        sub="Real impact for Charlotte-area businesses — measured in time saved, customers served, and revenue generated." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
        {testimonials.map((t, i) => (
          <GlassCard key={i} delay={i * 150} hoverGlow={C.accentGlow}>
            <div style={{
              display: "inline-block", padding: "6px 14px", borderRadius: "8px",
              background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.2)",
              fontSize: "12px", fontWeight: 700, color: C.cyan, marginBottom: "20px",
            }}>{t.metric}</div>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "24px", fontStyle: "italic" }}>
              "{t.quote}"
            </p>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>{t.author}</p>
              <p style={{ fontSize: "13px", color: C.textDim }}>{t.role}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// ─── Team Section ─────────────────────────────────────────────────────────
function TeamSection() {
  const team = [
    { initials: "ND", name: "Nash Davis", role: "CEO & Head of Modernization", school: "UNC Chapel Hill", bio: "AI and technology strategy. Leads technical delivery, client engagement, and custom solution architecture.", image: "/nash-davis.png" },
    { initials: "BS", name: "Bishop Switzer", role: "COO — Operations", school: "UNC Wilmington", bio: "Operations and process management. Oversees project tracking, proposals, invoicing, and handoff documentation." },
    { initials: "GT", name: "Grant Tadlock", role: "CFO & Sales Lead", school: "UNC Charlotte", bio: "Financial planning and client acquisition. Drives sales pipeline, pricing strategy, and relationship development." },
  ];
  return (
    <section id="team" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
      <SectionHeader center label="Meet the Team" title="Built by" titleAccent="Founders Who Care"
        sub="Three UNC-system students combining technical expertise with genuine commitment to helping Charlotte businesses thrive." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
        {team.map((t, i) => (
          <GlassCard key={i} delay={i * 150} hoverGlow={C.accentGlow} enableTilt style={{ textAlign: "center" }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "24px",
              background: t.image ? "none" : "linear-gradient(135deg, rgba(124,92,252,0.2), rgba(6,214,160,0.1))",
              border: `1px solid rgba(124,92,252,0.25)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "36px", margin: "0 auto 20px", color: C.accentLight,
              fontWeight: 700, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(124,92,252,0.1)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: "-3px", borderRadius: "27px",
                background: "linear-gradient(135deg, rgba(124,92,252,0.4), transparent, rgba(6,214,160,0.3))",
                zIndex: -1, filter: "blur(6px)", opacity: 0.6,
              }} />
              {t.image ? (
                <img src={t.image} alt={t.name} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                }} />
              ) : t.initials}
            </div>
            <h4 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px", color: C.text }}>{t.name}</h4>
            <p style={{ fontSize: "14px", color: C.accentLight, fontWeight: 600, marginBottom: "8px" }}>{t.role}</p>
            <p style={{ fontSize: "13px", color: C.textDim, marginBottom: "16px" }}>{t.school}</p>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textMuted }}>{t.bio}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────
function FAQSection() {
  const faqs = [
    { q: "How does the free tech audit work?", a: "We schedule a 1-2 hour session (in-person or remote) where we walk through your current operations, tools, and pain points. You'll get actionable insights on the spot — no sales pressure. If there's a fit, we'll follow up with a written proposal within 48 hours." },
    { q: "Do I need to know anything about AI?", a: "Not at all. That's what we're here for. We'll explain everything in plain English, recommend only tools that genuinely fit your needs, and handle all the technical setup. You just tell us what's slowing your business down." },
    { q: "What happens after my project is done?", a: "Every project comes with comprehensive handoff documentation, video tutorials, and a 2-week support window. You'll be able to manage everything independently. For ongoing support, our monthly retainer ($200-$500/mo) keeps us available for updates, new automations, and troubleshooting." },
    { q: "Why are your prices so much lower than agencies?", a: "We're a lean team of three founders with minimal overhead — no office rent, no account managers, no bloated project management. We're also deliberately underpricing to build our portfolio and earn client trust. You get the same quality at 3-5x less." },
    { q: "What's your service area?", a: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities (roughly a 40-50 mile radius). Discovery meetings can be done in-person or remote, and all technical work is done remotely." },
    { q: "How long does a typical project take?", a: "Tech audits are done in a single session. Website builds and AI integrations typically take 2-4 weeks from proposal to handoff. Our 48-hour proposal turnaround means you won't be waiting around to get started." },
  ];
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <section id="faq" style={{ padding: "80px 48px", maxWidth: "800px", margin: "0 auto" }}>
      <SectionHeader center label="FAQ" title="Common" titleAccent="Questions"
        sub="Everything you need to know about working with TSD Modernization Solutions." />
      <div ref={ref} style={{ ...fadeStyle, display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{
              background: C.glass, border: `1px solid ${isOpen ? "rgba(124,92,252,0.3)" : C.glassBorder}`,
              borderRadius: "16px", overflow: "hidden",
              transition: "border-color 0.3s ease",
            }}>
              <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{
                width: "100%", padding: "20px 24px", background: "none", border: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", color: C.text, fontSize: "16px", fontWeight: 600,
                textAlign: "left",
              }}>
                {faq.q}
                <span style={{
                  fontSize: "20px", color: C.accentLight,
                  transition: "transform 0.3s ease",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  flexShrink: 0, marginLeft: "16px",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? "300px" : "0",
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <p style={{
                  padding: "0 24px 20px", fontSize: "14px", lineHeight: 1.7,
                  color: C.textMuted,
                }}>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Contact / CTA Section ────────────────────────────────────────────────
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", business: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [ref, fadeStyle] = useFadeIn(0);

  const inputStyle = {
    padding: "16px 20px", borderRadius: "14px", border: `1px solid ${C.glassBorder}`,
    background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "15px",
    outline: "none", backdropFilter: "blur(10px)", transition: "border-color 0.2s ease, background 0.2s ease",
    fontFamily: "inherit",
  };
  const focusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = "rgba(124,92,252,0.4)"; e.target.style.background = "rgba(255,255,255,0.1)"; },
    onBlur: (e) => { e.target.style.borderColor = C.glassBorder; e.target.style.background = "rgba(255,255,255,0.06)"; },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Send via Formspree (replace with your own endpoint)
    try {
      const res = await fetch("https://formspree.io/f/xpwzgkvq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          business: formData.business,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", business: "", message: "" });
      } else {
        alert("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    }
    setSending(false);
  };

  return (
    <section id="contact" style={{ padding: "80px 48px", textAlign: "center", position: "relative" }}>
      <div style={{
        position: "absolute", width: "600px", height: "400px", borderRadius: "50%",
        filter: "blur(120px)", opacity: 0.2, background: `radial-gradient(circle, ${C.accent}, transparent)`,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />
      <div ref={ref} style={{
        ...fadeStyle,
        maxWidth: "800px", margin: "0 auto", position: "relative",
        background: "linear-gradient(145deg, rgba(79,70,229,0.25), rgba(124,92,252,0.1))",
        border: "1px solid rgba(124,92,252,0.3)",
        borderRadius: "32px", padding: "64px 48px",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 25px 80px rgba(124,92,252,0.15)`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
          fontSize: "13px", fontWeight: 700, color: "rgba(167,139,250,0.8)",
          textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px",
        }}>&#9670; Let's Talk</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px", color: C.text }}>
          Ready to Modernize Your Business?
        </h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6, color: C.textMuted, maxWidth: "500px", margin: "0 auto 40px" }}>
          Start with a free, no-obligation tech audit. We'll map your current operations and show you exactly where AI and automation can help.
        </p>

        {submitted ? (
          <div style={{
            padding: "40px", borderRadius: "16px",
            background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.3)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#10003;</div>
            <h3 style={{ fontSize: "24px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>Thank you!</h3>
            <p style={{ color: C.textMuted, fontSize: "16px" }}>We'll be in touch within 24 hours to schedule your free tech audit.</p>
          </div>
        ) : (
          <form style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}
            onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <input style={inputStyle} type="text" placeholder="Your name" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} {...focusHandlers} />
              <input style={inputStyle} type="email" placeholder="Email address" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} {...focusHandlers} />
            </div>
            <input style={inputStyle} type="text" placeholder="Business name" value={formData.business}
              onChange={(e) => setFormData({ ...formData, business: e.target.value })} {...focusHandlers} />
            <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              placeholder="Tell us about your business and what you're looking to modernize..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} {...focusHandlers} />
            <RippleButton type="submit" style={{
              padding: "18px 44px", borderRadius: "16px", background: C.gradient1,
              color: "#fff", fontSize: "16px", fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: `0 8px 25px ${C.accentGlow}`, transition: "transform 0.2s ease, box-shadow 0.2s ease",
              opacity: sending ? 0.7 : 1,
            }}
              disabled={sending}
              onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 35px ${C.accentGlowStrong}`; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 25px ${C.accentGlow}`; }}
            >{sending ? "Sending..." : "Book My Free Tech Audit \u2192"}</RippleButton>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer({ onScrollTo }) {
  return (
    <footer style={{
      padding: "64px 48px 40px", textAlign: "center", fontSize: "14px",
      color: C.textDim, borderTop: `1px solid ${C.divider}`,
      background: "rgba(0,0,0,0.2)",
    }}>
      <div onClick={() => onScrollTo("hero")} style={{
        fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer",
        marginBottom: "24px", display: "inline-block",
      }}>
        <span style={{ background: C.gradient1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TSD</span>
        <span style={{ fontWeight: 400, color: C.textMuted }}> Modernization</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "32px", flexWrap: "wrap" }}>
        {["Services", "Process", "Pricing", "Team", "Contact"].map((item) => (
          <span key={item} style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "color 0.2s ease" }}
            onClick={() => onScrollTo(item.toLowerCase())}
            onMouseEnter={(e) => (e.target.style.color = C.accentLight)}
            onMouseLeave={(e) => (e.target.style.color = C.textMuted)}>
            {item}
          </span>
        ))}
      </div>

      <div style={{
        height: "1px", maxWidth: "200px", margin: "0 auto 24px",
        background: `linear-gradient(90deg, transparent, ${C.glassBorder}, transparent)`,
      }} />

      <p style={{ marginBottom: "8px", fontSize: "13px" }}>
        <span style={{ fontWeight: 700, color: C.text }}>TSD Modernization Solutions</span>{" "}
        &mdash; A division of TSD Incorporated, LLC
      </p>
      <p style={{ fontSize: "13px" }}>Serving the Charlotte Metro Area &middot; Gastonia &middot; Belmont &middot; Charlotte, NC</p>
      <p style={{ marginTop: "16px", opacity: 0.4, fontSize: "12px" }}>&copy; {new Date().getFullYear()} TSD Incorporated, LLC. All rights reserved.</p>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function TSDModernizationSolutions() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      margin: 0, padding: 0, overflowX: "hidden", background: C.bg, color: C.text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; background: ${C.bg}; }
        ::placeholder { color: rgba(255,255,255,0.35); }
        @keyframes orbFloat1 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-30px,20px); } 66% { transform: translate(20px,-15px); } }
        @keyframes orbFloat2 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(25px,-20px); } 66% { transform: translate(-15px,25px); } }
        @keyframes orbFloat3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,-20px); } }
        @keyframes cardFloat1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes cardFloat2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-1deg); } }
        @keyframes cardFloat3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes scrollBounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
        @keyframes scrollDot { 0% { top: 8px; opacity: 1; } 100% { top: 22px; opacity: 0; } }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; flex-direction: column; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          nav { padding: 16px 20px !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <Nav scrolled={scrolled} onScrollTo={scrollTo} />
      <HeroSection onScrollTo={scrollTo} />
      <StatsSection />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <WhyChooseUsSection />
      <SectionDivider />
      <ProcessSection />
      <SectionDivider />
      <PricingSection onScrollTo={scrollTo} />
      <SectionDivider />
      <SocialProofSection />
      <SectionDivider />
      <TeamSection />
      <SectionDivider />
      <FAQSection />
      <ContactSection />
      <Footer onScrollTo={scrollTo} />
    </div>
  );
}
