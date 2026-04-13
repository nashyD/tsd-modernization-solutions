import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// ─── Design System ─────────────────────────────────────────────────────────
// Theme is driven by CSS variables on document.documentElement.
// Components consume the static `C` object (whose values are `var(--c-*)`).
// To switch themes at runtime, call `setTheme("dark" | "light")`.
// Components that depend on the theme name (e.g. swapping logo assets)
// can subscribe via `useTheme()`.

// Tar Heel Blue dark theme (default).
const PALETTE_DARK = {
  "--c-bg": "#000000",
  "--c-bg-alt": "#060a12",
  "--c-glass": "rgba(123,175,212,0.06)",
  "--c-glass-border": "rgba(123,175,212,0.18)",
  "--c-glass-hover": "rgba(123,175,212,0.12)",
  "--c-text": "#f1f6fb",
  "--c-text-muted": "rgba(241,246,251,0.58)",
  "--c-text-dim": "rgba(241,246,251,0.35)",
  "--c-accent": "#7BAFD4",
  "--c-accent-light": "#9FCAE3",
  "--c-accent-rgb": "123,175,212",
  "--c-accent-glow": "rgba(123,175,212,0.4)",
  "--c-accent-glow-strong": "rgba(123,175,212,0.65)",
  "--c-cyan": "#56B4E3",
  "--c-cyan-glow": "rgba(86,180,227,0.3)",
  "--c-pink": "#13294B",
  "--c-pink-glow": "rgba(19,41,75,0.4)",
  "--c-success": "#7BAFD4",
  "--c-navy": "#13294B",
  "--c-navy-rgb": "19,41,75",
  "--c-gradient-1": "linear-gradient(135deg, #7BAFD4 0%, #9FCAE3 100%)",
  "--c-gradient-2": "linear-gradient(135deg, #56B4E3 0%, #13294B 100%)",
  "--c-gradient-3": "linear-gradient(135deg, #9FCAE3 0%, #4A90BF 100%)",
  "--c-gradient-4": "linear-gradient(135deg, #4A90BF 0%, #13294B 100%)",
  "--c-gradient-hero": "linear-gradient(135deg, #7BAFD4 0%, #9FCAE3 40%, #56B4E3 100%)",
  "--c-divider": "rgba(123,175,212,0.12)",
  // Theme-specific extras (used by GridBg / placeholder color / overlays)
  "--c-grid-line": "rgba(255,255,255,0.03)",
  "--c-placeholder": "rgba(255,255,255,0.35)",
  "--c-menu-panel": "rgba(6,10,18,0.96)",
  "--c-modal-bg": "linear-gradient(155deg, rgba(19,41,75,0.92), rgba(10,14,24,0.96))",
  "--c-modal-border": "rgba(123,175,212,0.35)",
  "--c-modal-btn-bg": "rgba(255,255,255,0.06)",
  "--c-modal-btn-hover": "rgba(123,175,212,0.2)",
};

// Carolina Blue light theme.
const PALETTE_LIGHT = {
  "--c-bg": "#f7fafc",
  "--c-bg-alt": "#ffffff",
  "--c-glass": "rgba(19,41,75,0.04)",
  "--c-glass-border": "rgba(19,41,75,0.14)",
  "--c-glass-hover": "rgba(19,41,75,0.08)",
  "--c-text": "#0a0f1a",
  "--c-text-muted": "rgba(10,15,26,0.66)",
  "--c-text-dim": "rgba(10,15,26,0.42)",
  "--c-accent": "#2C7DA0",
  "--c-accent-light": "#4A90BF",
  "--c-accent-rgb": "44,125,160",
  "--c-accent-glow": "rgba(44,125,160,0.28)",
  "--c-accent-glow-strong": "rgba(44,125,160,0.45)",
  "--c-cyan": "#2C7DA0",
  "--c-cyan-glow": "rgba(44,125,160,0.22)",
  "--c-pink": "#13294B",
  "--c-pink-glow": "rgba(19,41,75,0.18)",
  "--c-success": "#0e7490",
  "--c-navy": "#13294B",
  "--c-navy-rgb": "19,41,75",
  "--c-gradient-1": "linear-gradient(135deg, #2C7DA0 0%, #4A90BF 100%)",
  "--c-gradient-2": "linear-gradient(135deg, #4A90BF 0%, #13294B 100%)",
  "--c-gradient-3": "linear-gradient(135deg, #4A90BF 0%, #2C7DA0 100%)",
  "--c-gradient-4": "linear-gradient(135deg, #2C7DA0 0%, #13294B 100%)",
  "--c-gradient-hero": "linear-gradient(135deg, #2C7DA0 0%, #4A90BF 40%, #13294B 100%)",
  "--c-divider": "rgba(19,41,75,0.12)",
  "--c-grid-line": "rgba(19,41,75,0.05)",
  "--c-placeholder": "rgba(10,15,26,0.38)",
  "--c-menu-panel": "rgba(247,250,252,0.96)",
  "--c-modal-bg": "linear-gradient(155deg, rgba(255,255,255,0.99), rgba(241,245,249,0.99))",
  "--c-modal-border": "rgba(44,125,160,0.4)",
  "--c-modal-btn-bg": "rgba(19,41,75,0.06)",
  "--c-modal-btn-hover": "rgba(44,125,160,0.18)",
};

// Inject the CSS variables exactly once.
if (typeof document !== "undefined" && !document.getElementById("tsd-theme-vars")) {
  const toBlock = (selector, vars) =>
    `${selector} {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;
  const style = document.createElement("style");
  style.id = "tsd-theme-vars";
  style.textContent = [
    toBlock(':root, [data-theme="dark"]', PALETTE_DARK),
    toBlock('[data-theme="light"]', PALETTE_LIGHT),
  ].join("\n");
  document.head.appendChild(style);
}

// Static color object — references CSS variables. Components don't need
// to re-render on theme change; the browser repaints automatically.
export const C = {
  bg: "var(--c-bg)",
  bgAlt: "var(--c-bg-alt)",
  glass: "var(--c-glass)",
  glassBorder: "var(--c-glass-border)",
  glassHover: "var(--c-glass-hover)",
  text: "var(--c-text)",
  textMuted: "var(--c-text-muted)",
  textDim: "var(--c-text-dim)",
  accent: "var(--c-accent)",
  accentLight: "var(--c-accent-light)",
  accentRGB: "var(--c-accent-rgb)",
  accentGlow: "var(--c-accent-glow)",
  accentGlowStrong: "var(--c-accent-glow-strong)",
  cyan: "var(--c-cyan)",
  cyanGlow: "var(--c-cyan-glow)",
  pink: "var(--c-pink)",
  pinkGlow: "var(--c-pink-glow)",
  success: "var(--c-success)",
  navy: "var(--c-navy)",
  navyRGB: "var(--c-navy-rgb)",
  gradient1: "var(--c-gradient-1)",
  gradient2: "var(--c-gradient-2)",
  gradient3: "var(--c-gradient-3)",
  gradient4: "var(--c-gradient-4)",
  gradientHero: "var(--c-gradient-hero)",
  divider: "var(--c-divider)",
  // Logo src is a real string (CSS vars don't work in <img src>).
  // Components that need to swap on theme change should call useTheme().
  logoSrc: "/tsd-ms-logo-tarheel.svg",
  logoSrcLight: "/tsd-ms-logo-tarheel-light.svg",
};

// ─── Theme store (subscribable) ────────────────────────────────────────────
const THEME_STORAGE_KEY = "tsd-theme";
const themeListeners = new Set();
let currentTheme = (() => {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
})();

function getThemeSnapshot() { return currentTheme; }
function getServerTheme() { return "dark"; }
function subscribeTheme(cb) { themeListeners.add(cb); return () => themeListeners.delete(cb); }

export function setTheme(theme) {
  if (theme !== "dark" && theme !== "light") return;
  if (theme === currentTheme) return;
  currentTheme = theme;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }
  themeListeners.forEach((cb) => cb());
}

export function toggleTheme() {
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

export function useTheme() {
  return useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerTheme);
}

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
export function GridBg() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(var(--c-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--c-grid-line) 1px, transparent 1px)`,
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
export function GlassCard({ children, style, hoverGlow, delay = 0, enableTilt = false, expandable = false, expandedContent = null, ...props }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [ref, fadeStyle] = useFadeIn(delay);
  const tilt = useTilt();
  const cardRef = useCallback((node) => {
    ref.current = node;
    tilt.ref.current = node;
  }, [ref, tilt.ref]);

  const isClickable = expandable && expandedContent;

  return (
    <>
      <div ref={cardRef} style={{
        background: C.glass,
        border: `1px solid ${hover ? `rgba(${C.accentRGB},0.35)` : C.glassBorder}`,
        borderRadius: "24px", padding: "40px",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease",
        boxShadow: hover && hoverGlow ? `0 8px 40px ${hoverGlow}` : "0 4px 20px rgba(0,0,0,0.2)",
        cursor: isClickable ? "pointer" : "default",
        position: "relative",
        ...fadeStyle,
        ...style,
      }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={(e) => { setHover(false); if (enableTilt) tilt.onMouseLeave(e); }}
        onMouseMove={enableTilt ? tilt.onMouseMove : undefined}
        onClick={isClickable ? () => setOpen(true) : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } } : undefined}
        {...props}
      >
        {children}
      </div>
      {isClickable && (
        <CardModal open={open} onClose={() => setOpen(false)}>
          {expandedContent}
        </CardModal>
      )}
    </>
  );
}

// ─── Card Modal (lightbox overlay for expanded card content) ──────────────
export function CardModal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(4,8,16,0.72)",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
        animation: "modalFadeIn 0.25s ease-out",
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "800px", width: "100%",
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          background: "var(--c-modal-bg)",
          border: `1px solid var(--c-modal-border)`,
          borderRadius: "28px",
          padding: "48px 48px 40px",
          boxShadow: `0 30px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(${C.accentRGB},0.15), 0 0 80px rgba(${C.accentRGB},0.18)`,
          animation: "modalScaleIn 0.32s cubic-bezier(0.16,1,0.3,1)",
          color: C.text,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "16px", right: "16px",
            width: "40px", height: "40px", borderRadius: "12px",
            background: "var(--c-modal-btn-bg)",
            border: `1px solid ${C.glassBorder}`,
            color: C.text, fontSize: "20px", lineHeight: 1,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--c-modal-btn-hover)"; e.currentTarget.style.borderColor = C.accentLight; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--c-modal-btn-bg)"; e.currentTarget.style.borderColor = C.glassBorder; }}
        >&times;</button>
        {children}
      </div>
    </div>,
    document.body
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
