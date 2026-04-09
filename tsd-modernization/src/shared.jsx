import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design System ─────────────────────────────────────────────────────────
export const C = {
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
export function useCountUp(end, duration = 2000) {
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

export function useFadeIn(delay = 0) {
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

export function useTilt() {
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
export function GridBg({ opacity = 0.03 }) {
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

// ─── Gradient Orbs ────────────────────────────────────────────────────────
export function GradientOrbs() {
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

// ─── Glass Card (reusable with tilt) ──────────────────────────────────────
export function GlassCard({ children, style, hoverGlow, delay = 0, enableTilt = false, ...props }) {
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
export function SectionHeader({ label, title, titleAccent, sub, center }) {
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
export function RippleButton({ children, style, onClick, ...props }) {
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
