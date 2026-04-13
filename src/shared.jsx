import { useRef, useEffect, useState, useCallback } from "react";

/* ── Brand palette ─────────────────────────────────────────────── */
export const C = {
  navy: "#13294B",
  navyLight: "#1d3a66",
  carolina: "#4B9CD3",
  carolinaLight: "#7BB8E0",
  carolinaDark: "#3a7db0",
  steel: "#2c5f8a",
  cream: "#e8e0d4",
  gold: "#c9b896",
  success: "#06d6a0",
  error: "#ef4444",

  gradientPrism: "linear-gradient(135deg, #7BB8E0 0%, #4B9CD3 35%, #2c5f8a 70%, #13294B 100%)",
  gradientAccent: "linear-gradient(135deg, #4B9CD3 0%, #7BB8E0 100%)",
  gradientSubtle: "linear-gradient(135deg, rgba(75,156,211,0.12) 0%, rgba(19,41,75,0.08) 100%)",
};

/* ── CSS variable helpers (theme-aware) ────────────────────────── */
export const v = (name) => `var(--c-${name})`;

/* ── Hooks ─────────────────────────────────────────────────────── */
export function useFadeIn(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [
    ref,
    {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    },
  ];
}

export function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          setCount(Math.round(p * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return [count, ref];
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try { return document.documentElement.dataset.theme || "dark"; } catch { return "dark"; }
  });
  const setTheme = useCallback((t) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("tsd-ms-theme", t); } catch {}
  }, []);
  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
  return { theme, setTheme, toggle };
}

/* ── Shared components ─────────────────────────────────────────── */

export function DiamondDivider({ width = 200, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width, margin: "0 auto", ...style }}>
      <div style={{ flex: 1, height: "1px", background: v("divider") }} />
      <span style={{ color: v("accent"), fontSize: "8px", lineHeight: 1 }}>{"\u25C6"}</span>
      <div style={{ flex: 1, height: "1px", background: v("divider") }} />
    </div>
  );
}

export function DoubleLine({ width = 200, style }) {
  return (
    <div style={{ width, margin: "0 auto", display: "flex", flexDirection: "column", gap: "3px", ...style }}>
      <div style={{ height: "1px", background: v("accent"), opacity: 0.5 }} />
      <div style={{ height: "2px", background: v("accent"), opacity: 0.7 }} />
    </div>
  );
}

export function SectionHeader({ label, title, titleAccent, sub, center }) {
  const [ref, fade] = useFadeIn(0);
  const align = center ? "center" : "left";
  return (
    <div ref={ref} style={{ ...fade, textAlign: align, marginBottom: "56px", maxWidth: center ? "700px" : "none", marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }}>
      {label && (
        <div style={{
          fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px",
          color: v("accent"), marginBottom: "16px", fontFamily: "var(--font-body)",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: center ? "center" : "flex-start",
        }}>
          <span style={{ fontSize: "8px" }}>{"\u25C6"}</span> {label}
        </div>
      )}
      <h2 style={{
        fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)",
        letterSpacing: "-0.5px", lineHeight: 1.1, color: v("text"), marginBottom: sub ? "16px" : 0,
      }}>
        {title}{" "}
        {titleAccent && (
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{titleAccent}</span>
        )}
      </h2>
      {sub && <p style={{ fontSize: "17px", lineHeight: 1.65, color: v("text-muted"), maxWidth: "580px", margin: center ? "0 auto" : 0 }}>{sub}</p>}
    </div>
  );
}

export function Card({ children, style, delay = 0, hover = true, onClick }) {
  const [ref, fade] = useFadeIn(delay);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...fade,
        padding: "36px",
        borderRadius: "20px",
        background: v("surface"),
        border: `1px solid ${hovered && hover ? v("accent") : v("surface-border")}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered && hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered && hover ? `0 12px 40px ${v("glow")}` : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function RippleButton({ children, style, variant = "primary", ...props }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    span.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;animation:ripple 0.6s ease-out;pointer-events:none;`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 600);
    props.onClick?.(e);
  };

  const base = {
    position: "relative", overflow: "hidden", border: "none", cursor: "pointer",
    fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "15px",
    padding: "14px 32px", borderRadius: "100px", transition: "all 0.3s ease",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
  };

  const variants = {
    primary: { background: C.gradientPrism, color: "#fff", boxShadow: `0 4px 20px rgba(75,156,211,0.3)` },
    secondary: { background: "transparent", color: v("text"), border: `1.5px solid ${v("divider")}` },
    ghost: { background: v("surface"), color: v("text"), border: `1px solid ${v("surface-border")}` },
  };

  return (
    <button ref={ref} {...props} onClick={handleClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function Tag({ children }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 12px", borderRadius: "100px",
      fontSize: "12px", fontWeight: 600, letterSpacing: "0.3px",
      background: "rgba(75,156,211,0.1)", color: v("accent"),
      border: `1px solid rgba(75,156,211,0.15)`,
    }}>{children}</span>
  );
}
