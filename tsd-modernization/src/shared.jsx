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
  creamSoft: "#f0ebe1",
  gold: "#c9b896",
  success: "#06d6a0",
  error: "#ef4444",

  /* Refined surface stack — used to layer cards/glass without going to raw hex. */
  ink: "#070d1a",
  inkSoft: "#0c1524",
  inkRise: "#101c2e",
  inkRiseHigh: "#16243a",

  /* Two-stop gradients — the four-stop prism reads heavy on small surfaces.
     Use `gradientPrism` for hero / large hero buttons; the two-stop pair
     below for everything else. */
  gradientPrism: "linear-gradient(135deg, #7BB8E0 0%, #4B9CD3 35%, #2c5f8a 70%, #13294B 100%)",
  gradientAccent: "linear-gradient(135deg, #4B9CD3 0%, #7BB8E0 100%)",
  gradientAccentSoft: "linear-gradient(135deg, #5fa8d8 0%, #87c2e6 100%)",
  gradientNavy: "linear-gradient(135deg, #1d3a66 0%, #13294B 100%)",
  gradientSubtle: "linear-gradient(135deg, rgba(75,156,211,0.12) 0%, rgba(19,41,75,0.08) 100%)",
  gradientFog: "linear-gradient(180deg, rgba(75,156,211,0.08) 0%, rgba(75,156,211,0) 100%)",
};

/* ── Design tokens ─────────────────────────────────────────────── */
/* Single source for spacing/radius/shadow so every section uses the
   same rhythm. Kept on a 4pt grid (Material) with the larger steps
   stretching to editorial breathing room. */
export const SPACE = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
  "5xl": "128px",
};

export const RADIUS = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
};

export const SHADOW = {
  none: "none",
  /* Layered shadow for cards — ambient + key. The wide ambient gives a soft
     halo, the tight key shadow grounds the surface. Both tinted with the
     navy/accent so they never read as gray. */
  sm: "0 1px 2px rgba(7,13,26,0.10), 0 1px 1px rgba(7,13,26,0.06)",
  md: "0 4px 12px rgba(7,13,26,0.12), 0 2px 4px rgba(7,13,26,0.08)",
  lg: "0 12px 32px rgba(7,13,26,0.18), 0 4px 12px rgba(7,13,26,0.10)",
  xl: "0 24px 60px rgba(7,13,26,0.28), 0 10px 24px rgba(7,13,26,0.14)",
  glow: "0 0 0 1px rgba(75,156,211,0.4), 0 12px 32px rgba(75,156,211,0.18)",
  glowSoft: "0 12px 40px rgba(75,156,211,0.22)",
  /* Press-state shadow — flatter, used during active state. */
  press: "0 2px 6px rgba(7,13,26,0.16), inset 0 1px 0 rgba(255,255,255,0.04)",
};

/* ── Liquid glass material ─────────────────────────────────────────
   The reusable Apple-style recipe, driven by the --glass-* CSS vars
   defined per theme in Layout.jsx (so it retunes between dark + light).
   `surface` is the lighter, decorative fill; `panel` is the text-bearing
   (more opaque) fill that keeps body copy above WCAG AA over the drifting
   backdrop. Spread a preset onto any bespoke panel, or use the
   <Card>/<Surface> components which already wrap it. */
export const GLASS = {
  blur: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
  radius: "var(--glass-radius)",
  shadow: "var(--glass-shadow)",
  rim: "var(--glass-rim)",
  surface: {
    background: "var(--glass-bg)",
    backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
    WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
    border: "1px solid var(--glass-border)",
    boxShadow: "var(--glass-shadow)",
  },
  panel: {
    background: "var(--glass-bg-strong)",
    backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
    WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
    border: "1px solid var(--glass-border)",
    boxShadow: "var(--glass-shadow)",
  },
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
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
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
          /* Ease-out so the count settles rather than ramming the final number. */
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(eased * end));
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

/* Track pointer presence for hover-aware interactions. False on touch
   so press-effects don't get stuck on tap-and-release. */
export function useHasHover() {
  const [hasHover, setHasHover] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover)");
    setHasHover(mq.matches);
    const fn = (e) => setHasHover(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return hasHover;
}

/* Pointer-reactive sheen — returns props to spread on a glass element so a
   soft highlight tracks the cursor. GPU-cheap: writes CSS vars straight to
   the node (no React re-render), caches the rect on enter, and no-ops on
   touch (no hover). Pair with a <span className="glass-sheen" /> child whose
   opacity is driven by --sheen-o (zeroed under reduced-motion / -transparency
   by the media rules in Layout). Always returns `ref` so callers can attach. */
export function useGlassSheen() {
  const ref = useRef(null);
  const rect = useRef(null);
  const hasHover = useHasHover();
  const onMouseEnter = useCallback(() => {
    const el = ref.current; if (!el) return;
    rect.current = el.getBoundingClientRect();
    el.style.setProperty("--sheen-o", "1");
  }, []);
  const onMouseMove = useCallback((e) => {
    const el = ref.current, r = rect.current; if (!el || !r) return;
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);
  const onMouseLeave = useCallback(() => {
    ref.current?.style.setProperty("--sheen-o", "0");
  }, []);
  return hasHover ? { ref, onMouseEnter, onMouseMove, onMouseLeave } : { ref };
}

/* ── Shared components ─────────────────────────────────────────── */

export function DiamondDivider({ width = 200, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width, margin: "0 auto", ...style }}>
      <div style={{ flex: 1, height: "1px", background: v("divider") }} />
      <span style={{ color: v("accent"), fontSize: "8px", lineHeight: 1 }}>{"◆"}</span>
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

/* Reusable accent text — the gradient-filled emphasis on most headlines.
   Bold sans (no italic serif); the gradient fill carries the emphasis.
   Inline-block so the bleed clipping doesn't crop descenders. The `italic`
   prop is accepted for back-compat but no longer renders cursive. */
export function GradientText({ children, gradient = C.gradientAccent, style }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "var(--font-body)",
      fontStyle: "normal",
      fontWeight: 800,
      background: gradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      paddingBottom: "0.05em",
      ...style,
    }}>
      {children}
    </span>
  );
}

/* Editorial eyebrow — the small uppercase caption with optional ◆.
   Replaces the dozen hand-rolled copies of this pattern across pages. */
export function Eyebrow({ children, diamond = true, color, style }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      fontSize: "11px", fontWeight: 700, letterSpacing: "3px",
      textTransform: "uppercase", lineHeight: 1,
      color: color || v("accent"), fontFamily: "var(--font-body)",
      ...style,
    }}>
      {diamond && <span style={{ fontSize: "7px" }}>{"◆"}</span>}
      {children}
    </span>
  );
}

/* Chapter rule — the [◆ LABEL ──── § 0N] pattern used as a section header
   on multiple pages. Hairline rule fills the space between label and §
   number. Standardized into a single primitive so every page has the
   exact same rhythm. */
export function ChapterRule({ label, num, style }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: "16px",
      flexWrap: "wrap",
      ...style,
    }}>
      {label && <Eyebrow>{label}</Eyebrow>}
      <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
      {num && <span style={{
        fontSize: "11px", color: v("text-dim"),
        letterSpacing: "2px", whiteSpace: "nowrap",
        fontFeatureSettings: '"tnum" 1',
      }}>§ {num}</span>}
    </div>
  );
}

/* Editorial masthead strip — the long [— FOUNDING COHORT ◆ EDITION ◆ … —]
   bar used at the top of Hero, Pricing, AI Receptionist, etc.
   Lines flex-grow equally so the content is always anchored at center
   regardless of label widths. Labels are nowrap so they don't break
   awkwardly between letters. On narrow viewports the row would wrap
   awkwardly (leading ◆ diamonds left-aligned on each broken line), so
   below 600px we switch to a stacked layout: horizontal rule above,
   each label on its own row with a centered diamond between rows,
   horizontal rule below. */
export function EditorialMasthead({ items = [], color, style }) {
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(max-width: 600px)").matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 600px)");
    const fn = (e) => setIsNarrow(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const labelColor = color || v("text-muted");
  const baseTextStyle = {
    fontSize: "10px", fontWeight: 700, letterSpacing: "4px",
    textTransform: "uppercase", lineHeight: 1.4,
    color: labelColor,
  };

  if (isNarrow) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "8px", ...baseTextStyle, ...style,
      }}>
        <span style={{
          width: "120px", height: "1px",
          background: "currentColor", opacity: 0.35,
        }} />
        {items.map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", flexDirection: "column",
            alignItems: "center", gap: "8px",
          }}>
            {i > 0 && (
              <span style={{ color: v("accent"), fontSize: "7px", lineHeight: 1 }}>{"◆"}</span>
            )}
            <span style={{ textAlign: "center" }}>{item}</span>
          </span>
        ))}
        <span style={{
          width: "120px", height: "1px",
          background: "currentColor", opacity: 0.35,
        }} />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "14px", flexWrap: "wrap",
      ...baseTextStyle,
      ...style,
    }}>
      <span style={{
        flex: "1 1 60px", minWidth: "32px", maxWidth: "120px",
        height: "1px", background: "currentColor", opacity: 0.35,
      }} />
      {items.map((item, i) => (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: "14px",
          whiteSpace: "nowrap",
        }}>
          {i > 0 && <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>}
          <span>{item}</span>
        </span>
      ))}
      <span style={{
        flex: "1 1 60px", minWidth: "32px", maxWidth: "120px",
        height: "1px", background: "currentColor", opacity: 0.35,
      }} />
    </div>
  );
}

/* Pill badge — small uppercase chip used for category labels. Replaces
   the inline pill repeated in Pricing, TradePage, RelationshipPage. */
export function PillBadge({ children, tone = "accent", style }) {
  const tones = {
    accent: { bg: "rgba(75,156,211,0.12)", border: "rgba(75,156,211,0.28)", color: v("accent") },
    success: { bg: "rgba(6,214,160,0.12)", border: "rgba(6,214,160,0.32)", color: C.success },
    surface: { bg: v("surface"), border: v("surface-border"), color: v("text-muted") },
    solid: { bg: C.gradientPrism, border: "transparent", color: "#fff" },
  };
  const t = tones[tone] || tones.accent;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "5px 12px", borderRadius: RADIUS.full,
      fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px",
      textTransform: "uppercase", lineHeight: 1,
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.border}`,
      ...style,
    }}>
      {children}
    </span>
  );
}

export function SectionHeader({ label, num, title, titleAccent, sub, center, style }) {
  const [ref, fade] = useFadeIn(0);
  const align = center ? "center" : "left";
  return (
    <div ref={ref} style={{
      ...fade,
      textAlign: align,
      marginBottom: SPACE["3xl"],
      maxWidth: center ? "780px" : "none",
      marginLeft: center ? "auto" : 0,
      marginRight: center ? "auto" : 0,
      ...style,
    }}>
      {(label || num) && (
        center ? (
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", gap: "12px",
            marginBottom: SPACE.md,
          }}>
            {label && <Eyebrow>{label}</Eyebrow>}
            {num && (
              <>
                <span style={{ width: "32px", height: "1px", background: v("divider") }} />
                <span style={{
                  fontSize: "11px", color: v("text-dim"),
                  letterSpacing: "2px",
                  fontFeatureSettings: '"tnum" 1',
                }}>§ {num}</span>
              </>
            )}
          </div>
        ) : (
          <ChapterRule label={label} num={num} style={{ marginBottom: SPACE.lg }} />
        )
      )}
      <h2 style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(28px, 4vw, 44px)",
        letterSpacing: "-0.5px", lineHeight: 1.15,
        color: v("text"),
        marginBottom: sub ? SPACE.md : 0,
      }}>
        {title}
        {titleAccent && (
          <>
            {" "}
            <GradientText>{titleAccent}</GradientText>
          </>
        )}
      </h2>
      {sub && (
        <p style={{
          fontSize: "17px", lineHeight: 1.65,
          color: v("text-muted"),
          maxWidth: "620px",
          margin: center ? "0 auto" : 0,
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* Card — the workhorse surface. Refined elevation: layered shadow,
   subtle top-edge highlight, refined hover (lift + glow + border tint).
   `interactive` toggles the hover affordance; default true. */
export function Card({ children, style, delay = 0, hover = true, interactive = true, onClick, padded = true }) {
  const [fadeRef, fade] = useFadeIn(delay);
  const sheen = useGlassSheen();
  const [hovered, setHovered] = useState(false);
  const lift = hovered && hover && interactive;
  /* One node, two refs: the IntersectionObserver fade-in + the sheen tracker. */
  const setRefs = useCallback((node) => {
    fadeRef.current = node;
    if (sheen.ref) sheen.ref.current = node;
  }, [fadeRef, sheen]);
  return (
    <div
      ref={setRefs}
      onClick={onClick}
      onMouseEnter={(e) => { setHovered(true); sheen.onMouseEnter?.(e); }}
      onMouseMove={sheen.onMouseMove}
      onMouseLeave={(e) => { setHovered(false); sheen.onMouseLeave?.(e); }}
      style={{
        ...fade,
        position: "relative",
        isolation: "isolate",
        padding: padded ? SPACE.xl : 0,
        borderRadius: "var(--glass-radius)",
        background: "var(--glass-bg-strong)",
        border: `1px solid ${lift ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        transition: "border-color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: lift ? "translateY(-3px)" : "translateY(0)",
        boxShadow: lift ? "var(--glass-shadow), 0 0 28px var(--glass-glow)" : "var(--glass-shadow)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* Pointer-reactive sheen — sits above the glass fill, behind content. */}
      <span aria-hidden="true" className="glass-sheen" />
      {/* Specular top-edge rim — bright hairline so the glass reads wet/lensed
          rather than flat-frosted. */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
        background: "linear-gradient(90deg, transparent 0%, var(--glass-rim) 50%, transparent 100%)",
        pointerEvents: "none",
      }} />
      {children}
    </div>
  );
}

/* Premium button system — `Button` is the new canonical CTA. Variants:
     primary  — gradient, white text, layered shadow, scale-press
     secondary — surface glass, outlined
     ghost    — no fill, hover surface
     editorial — outlined cream/navy, refined for hero / dark backgrounds
   Sizes: sm | md | lg.
   Use `<Button as="span">` to render inside a Link without nesting <button>. */
export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  fullWidth,
  children,
  style,
  iconLeft,
  iconRight,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { pad: "10px 18px", font: "13px", icon: 14 },
    md: { pad: "14px 28px", font: "14px", icon: 16 },
    lg: { pad: "16px 36px", font: "15px", icon: 18 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      base: {
        background: C.gradientAccent,
        color: "#fff",
        // Even glass rim. A transparent border let the diagonal gradient clamp
        // into the 1px border ring (background-clip border-box), making the edge
        // look muddy/uneven at the dark corner; a real rim is clean all around.
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: hovered
          ? "0 12px 28px rgba(75,156,211,0.42), inset 0 1px 0 rgba(255,255,255,0.18)"
          : "0 6px 18px rgba(75,156,211,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
      },
      hoverFilter: "brightness(1.04)",
    },
    primarySolid: {
      base: {
        background: C.gradientPrism,
        color: "#fff",
        // Even glass rim (see primary above) — clean edge on the dark prism.
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: hovered
          ? "0 14px 32px rgba(19,41,75,0.42), inset 0 1px 0 rgba(255,255,255,0.18)"
          : "0 6px 18px rgba(19,41,75,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
      },
    },
    secondary: {
      base: {
        background: hovered ? "var(--glass-bg-strong)" : "var(--glass-bg)",
        color: v("text"),
        border: `1px solid ${hovered ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        boxShadow: "inset 0 1px 0 var(--glass-rim-soft)",
      },
    },
    ghost: {
      base: {
        background: hovered ? v("surface") : "transparent",
        color: v("text"),
        border: `1px solid ${v("divider")}`,
      },
    },
    editorial: {
      base: {
        background: "rgba(255,255,255,0.12)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.30)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
      },
    },
    onAccent: {
      base: {
        background: "#fff",
        color: C.navy,
        border: "1px solid transparent",
        boxShadow: hovered ? SHADOW.md : SHADOW.sm,
      },
    },
  };
  const vstyle = variants[variant] || variants.primary;

  return (
    <Tag
      {...rest}
      onMouseEnter={(e) => { setHovered(true); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); setPressed(false); rest.onMouseLeave?.(e); }}
      onMouseDown={(e) => { setPressed(true); rest.onMouseDown?.(e); }}
      onMouseUp={(e) => { setPressed(false); rest.onMouseUp?.(e); }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        padding: s.pad,
        borderRadius: RADIUS.full,
        fontSize: s.font, fontWeight: 700,
        fontFamily: "var(--font-body)",
        letterSpacing: "0.1px",
        cursor: rest.disabled ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.15s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease",
        transform: pressed ? "scale(0.97)" : hovered ? "translateY(-1px)" : "translateY(0)",
        filter: hovered ? vstyle.hoverFilter : "none",
        width: fullWidth ? "100%" : undefined,
        opacity: rest.disabled ? 0.5 : 1,
        ...vstyle.base,
        ...style,
      }}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Tag>
  );
}

/* RippleButton — kept for back-compat with all callers. Now wraps the
   refined Button so visual upgrades flow through. The legacy ripple is
   replaced with the cleaner press-scale + shadow lift. */
export function RippleButton({ children, style, variant = "primary", ...props }) {
  /* Map legacy variants to Button variants. */
  const map = {
    primary: "primarySolid",
    secondary: "editorial",
    ghost: "secondary",
  };
  return (
    <Button {...props} variant={map[variant] || "primary"} size="md" style={style}>
      {children}
    </Button>
  );
}

export function Tag({ children }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 12px", borderRadius: RADIUS.full,
      fontSize: "12px", fontWeight: 600, letterSpacing: "0.3px",
      background: "rgba(75,156,211,0.10)", color: v("accent"),
      border: `1px solid rgba(75,156,211,0.18)`,
    }}>{children}</span>
  );
}

/* StatTile — for the editorial "by the numbers" blocks. Tabular figures
   so the numbers don't shift width. Optional supporting label & note. */
export function StatTile({ value, label, note, large, fadeRef, style }) {
  return (
    <div ref={fadeRef} style={{
      padding: large ? SPACE["2xl"] : SPACE.lg,
      background: v("surface"),
      borderRadius: large ? RADIUS["2xl"] : RADIUS.lg,
      border: `1px solid ${v("surface-border")}`,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: large ? "clamp(56px, 10vw, 96px)" : "32px",
        fontWeight: 800,
        letterSpacing: "-1.5px",
        lineHeight: 1,
        background: C.gradientAccent,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: SPACE.sm,
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
      }}>{value}</div>
      <div style={{
        fontSize: large ? "16px" : "13px",
        fontWeight: 600, color: v("text"),
        lineHeight: 1.45,
        marginBottom: note ? SPACE.xs : 0,
      }}>{label}</div>
      {note && (
        <div style={{
          fontSize: "12px", fontStyle: "normal",
          color: v("text-dim"),
          fontFamily: "var(--font-body)",
        }}>{note}</div>
      )}
    </div>
  );
}

/* Surface — flexible container with theme-aware glass/solid backing.
   Use it instead of inlining the same panel pattern. */
export function Surface({ children, tone = "glass", radius = "xl", padding = "xl", style, ...rest }) {
  const tones = {
    glass: { bg: "var(--glass-bg-strong)", border: "var(--glass-border)" },
    solid: { bg: v("bg-alt"), border: v("divider") },
    accent: { bg: "rgba(75,156,211,0.08)", border: "rgba(75,156,211,0.24)" },
    inverse: { bg: C.gradientPrism, border: "transparent", color: "#fff" },
  };
  const t = tones[tone] || tones.glass;
  const isGlass = tone === "glass";
  return (
    <div {...rest} style={{
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: RADIUS[radius] || radius,
      padding: SPACE[padding] || padding,
      color: t.color,
      backdropFilter: isGlass ? "blur(var(--glass-blur)) saturate(var(--glass-saturate))" : "none",
      WebkitBackdropFilter: isGlass ? "blur(var(--glass-blur)) saturate(var(--glass-saturate))" : "none",
      boxShadow: isGlass ? "var(--glass-shadow)" : undefined,
      ...style,
    }}>
      {children}
    </div>
  );
}
