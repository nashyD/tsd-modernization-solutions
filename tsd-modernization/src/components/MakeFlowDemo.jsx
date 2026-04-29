/* MakeFlowDemo.jsx — animated demo for /services/ai-integration's "Make
   Automation Flow" gallery card. Sibling to ChatbotDemo: same 1280×720
   stage, same 15.5s loop, same visual language. Shows a contact-form
   submission firing through a 5-node Make scenario (Webhook → HubSpot →
   Email → Slack → Calendly), with traveling tokens and lighting nodes.

   Ported from a Claude Design handoff bundle (Stage/Scene that ran via
   in-browser Babel). Native React port: no playback bar, no localStorage,
   no keyboard shortcuts — autoplay + loop, scaled to fit container. */

import {
  createContext, useContext, useEffect,
  useMemo, useRef, useState,
} from "react";

// ── Easing + interpolate ────────────────────────────────────────────────────

const Easing = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        return output[i] + (output[i + 1] - output[i]) * ease(local);
      }
    }
    return output[output.length - 1];
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = createContext({ time: 0, duration: 0 });
const useTime = () => useContext(TimelineContext).time;

// ── Stage (auto-play, auto-scale, no playback chrome) ───────────────────────

function Stage({ width, height, duration, background, loop = true, children }) {
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const s = Math.min(el.clientWidth / width, el.clientHeight / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  useEffect(() => {
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) next = loop ? next % duration : duration;
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [duration, loop]);

  const ctxValue = useMemo(() => ({ time, duration }), [time, duration]);

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        width: "100%", height: "100%",
        background: "#06101e",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width, height,
          background,
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <TimelineContext.Provider value={ctxValue}>
          {children}
        </TimelineContext.Provider>
      </div>
    </div>
  );
}

// ── Design tokens ───────────────────────────────────────────────────────────

const MF_BG = "#0a1628";
const MF_BG_DEEP = "#06101e";
const MF_CARD = "#16202f";
const MF_GRAD = "linear-gradient(165deg, #6fb3e8 0%, #4d8dc7 50%, #2f6aa3 100%)";
const MF_MINT = "#5dd4a8";
const MF_ACCENT = "#7fc6e6";
const MF_TEXT = "#dce8f5";
const MF_DIM = "rgba(220,232,245,0.55)";
const MF_FAINT = "rgba(220,232,245,0.30)";
const MF_SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
const MF_SANS = 'Inter, "Helvetica Neue", system-ui, sans-serif';

// ── Top bar ─────────────────────────────────────────────────────────────────

function MFTopBar() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", zIndex: 5,
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 26,
          background: "linear-gradient(135deg, #5fb0d8, #2f6aa3)",
          borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontFamily: MF_SANS, fontWeight: 700, fontSize: 10,
          letterSpacing: "0.05em",
        }}>TSD</div>
        <div style={{
          fontFamily: MF_SANS, fontSize: 9, fontWeight: 600,
          letterSpacing: "0.32em", color: MF_TEXT, lineHeight: 1.2,
        }}>
          MODERNIZATION<br />
          <span style={{ fontSize: 6.5, opacity: 0.5, letterSpacing: "0.4em" }}>SOLUTIONS</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          padding: "6px 16px", borderRadius: 16,
          background: "linear-gradient(135deg, #5fb0d8, #2f6aa3)",
          color: "#fff", fontFamily: MF_SANS, fontSize: 11, fontWeight: 500,
          letterSpacing: "0.04em",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset",
        }}>≡  Menu</div>
      </div>
    </div>
  );
}

function MFSectionLabel() {
  return (
    <div style={{
      position: "absolute", top: 78, left: 60,
      fontFamily: MF_SANS, fontSize: 10, fontWeight: 600,
      letterSpacing: "0.28em", color: MF_ACCENT,
    }}>
      AUTOMATION GALLERY
    </div>
  );
}

// ── Contact form ────────────────────────────────────────────────────────────

function ContactForm({ values, focused, submitFlash, submitPress }) {
  return (
    <div style={{
      position: "absolute",
      left: 60, top: 120,
      width: 460, height: 540,
      background: MF_CARD,
      borderRadius: 14,
      padding: "28px 30px",
      boxShadow: "0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        fontFamily: MF_SANS, fontSize: 9, fontWeight: 600,
        letterSpacing: "0.24em", color: MF_ACCENT,
        marginBottom: 8,
      }}>CONTACT</div>
      <div style={{
        fontFamily: MF_SERIF, fontStyle: "italic",
        fontSize: 32, fontWeight: 500,
        color: MF_TEXT, lineHeight: 1.05,
        letterSpacing: "-0.01em",
        marginBottom: 4,
      }}>Get in touch.</div>
      <div style={{
        fontFamily: MF_SANS, fontSize: 12,
        color: MF_DIM, marginBottom: 22,
      }}>We reply within 48 hours, in writing.</div>

      <FormField label="NAME" value={values.name} active={focused === "name"} />
      <FormField label="EMAIL" value={values.email} active={focused === "email"} />
      <FormField label="BUSINESS NAME" value={values.business} active={focused === "business"} />
      <FormField
        label="TELL US ABOUT YOUR BUSINESS"
        value={values.message}
        active={focused === "message"}
        textarea
      />

      <div style={{ flex: 1 }} />

      <div style={{
        marginTop: 16,
        position: "relative",
      }}>
        <div style={{
          padding: "13px 0", textAlign: "center",
          borderRadius: 24,
          background: MF_GRAD,
          color: "#fff",
          fontFamily: MF_SANS, fontSize: 13, fontWeight: 600,
          letterSpacing: "0.04em",
          boxShadow: submitFlash > 0
            ? `0 0 0 ${4 + submitFlash * 8}px rgba(95,176,216,${submitFlash * 0.3}), 0 4px 14px rgba(47,106,163,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset`
            : "0 4px 14px rgba(47,106,163,0.4), 0 0 0 1px rgba(255,255,255,0.15) inset",
          transform: `scale(${submitPress ? 0.97 : 1})`,
        }}>
          Send message  →
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, active, textarea }) {
  const showCursor = active;
  const empty = !value;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: MF_SANS, fontSize: 9, fontWeight: 600,
        letterSpacing: "0.2em", color: active ? MF_ACCENT : MF_FAINT,
        marginBottom: 6,
        transition: "color 200ms",
      }}>{label}</div>
      <div style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${active ? "rgba(127,198,230,0.45)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 8,
        padding: textarea ? "10px 12px" : "11px 12px",
        minHeight: textarea ? 64 : "auto",
        fontFamily: MF_SANS, fontSize: 13,
        color: empty ? "rgba(220,232,245,0.3)" : MF_TEXT,
        lineHeight: 1.4,
        boxShadow: active ? "0 0 0 3px rgba(127,198,230,0.08)" : "none",
        transition: "border-color 200ms, box-shadow 200ms",
        whiteSpace: textarea ? "pre-wrap" : "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {value || (active ? "" : <Placeholder label={label} />)}
        {showCursor && (
          <span style={{
            display: "inline-block", width: 1.5, height: 14,
            background: MF_ACCENT, marginLeft: 1,
            verticalAlign: "text-bottom",
            animation: "mf-blink 1s steps(2) infinite",
          }} />
        )}
      </div>
    </div>
  );
}

function Placeholder({ label }) {
  const map = {
    "NAME": "Your name",
    "EMAIL": "you@company.com",
    "BUSINESS NAME": "Company",
    "TELL US ABOUT YOUR BUSINESS": "What you sell, who you serve, where you're stuck...",
  };
  return <span>{map[label] || ""}</span>;
}

// ── Make scenario ───────────────────────────────────────────────────────────

const NODE_COORDS = [
  { x: 700, y: 270, label: "Webhook", sub: "Contact form trigger", icon: "webhook" },
  { x: 920, y: 270, label: "HubSpot", sub: "Add contact to CRM", icon: "crm" },
  { x: 1140, y: 270, label: "Email", sub: "Auto-reply queued", icon: "mail", subActive: "48-hour proposal sent" },
  { x: 1140, y: 490, label: "Slack", sub: "Notify founder", icon: "slack", subActive: "Bishop notified on Slack" },
  { x: 920, y: 490, label: "Calendly", sub: "Send booking link", icon: "cal", subActive: "Discovery slot offered" },
];

function getEdgePath(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dy) < 5) {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }
  const c1x = a.x + dx * 0.5;
  const c1y = a.y;
  const c2x = a.x + dx * 0.5;
  const c2y = b.y;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
}

function MakeScenario({ activeNodes, activeEdges, tokenPositions, captionOpacity }) {
  return (
    <div style={{
      position: "absolute",
      left: 560, top: 120,
      right: 40, bottom: 60,
      background: MF_BG_DEEP,
      borderRadius: 14,
      boxShadow: "0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 18, left: 22, right: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontFamily: MF_SANS, fontSize: 9, fontWeight: 600,
            letterSpacing: "0.24em", color: MF_ACCENT,
          }}>SCENARIO</div>
          <div style={{
            fontFamily: MF_SERIF, fontStyle: "italic",
            fontSize: 20, fontWeight: 500, color: MF_TEXT,
            marginTop: 2, letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}>Contact intake</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 10,
          background: "rgba(93,212,168,0.1)",
          border: "1px solid rgba(93,212,168,0.25)",
          fontFamily: MF_SANS, fontSize: 9, fontWeight: 600,
          letterSpacing: "0.1em", color: MF_MINT,
          flexShrink: 0,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: 3, background: MF_MINT,
            boxShadow: `0 0 6px ${MF_MINT}`,
          }} />
          LIVE
        </div>
      </div>

      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", opacity: 0.5,
      }} viewBox="560 120 720 600">
        <defs>
          <pattern id="mf-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(127,198,230,0.15)" />
          </pattern>
        </defs>
        <rect x="560" y="120" width="720" height="600" fill="url(#mf-grid)" />
      </svg>

      <div style={{ position: "absolute", inset: 0 }}>
        <svg style={{
          position: "absolute", left: -560, top: -120,
          width: 1280, height: 720,
          pointerEvents: "none",
        }} viewBox="0 0 1280 720">
          {NODE_COORDS.slice(0, -1).map((n, i) => {
            const next = NODE_COORDS[i + 1];
            const path = getEdgePath(n, next);
            const prog = activeEdges[i] || 0;
            return (
              <g key={i}>
                <path d={path} stroke="rgba(127,198,230,0.18)" strokeWidth="2" fill="none" />
                <path
                  d={path}
                  stroke={MF_MINT}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - prog}
                  style={{
                    filter: prog > 0 ? `drop-shadow(0 0 4px ${MF_MINT})` : "none",
                  }}
                />
              </g>
            );
          })}

          {tokenPositions.map((tk, i) => (
            <g key={"tk" + i} style={{ opacity: tk.opacity }}>
              <circle cx={tk.x} cy={tk.y} r="9"
                fill={MF_ACCENT}
                style={{ filter: `drop-shadow(0 0 8px ${MF_ACCENT})` }} />
              <circle cx={tk.x} cy={tk.y} r="4" fill="#fff" />
            </g>
          ))}
        </svg>

        {NODE_COORDS.map((n, i) => (
          <FlowNode
            key={i}
            x={n.x - 560}
            y={n.y - 120}
            label={n.label}
            sub={n.sub}
            subActive={n.subActive}
            icon={n.icon}
            progress={activeNodes[i] || 0}
            index={i + 1}
          />
        ))}
      </div>

      <div style={{
        position: "absolute",
        left: 0, right: 0, bottom: 22,
        textAlign: "center",
        fontFamily: MF_SERIF, fontStyle: "italic",
        fontSize: 26, fontWeight: 500,
        color: MF_TEXT, letterSpacing: "-0.01em",
        opacity: captionOpacity,
        transform: `translateY(${(1 - captionOpacity) * 8}px)`,
      }}>
        Five steps. Four seconds. Zero manual work.
      </div>
    </div>
  );
}

function FlowNode({ x, y, label, sub, subActive, icon, progress, index }) {
  const lit = progress > 0.05;
  const done = progress >= 0.95;
  const ringPulse = progress > 0 && progress < 1
    ? 0.6 + 0.4 * Math.sin(progress * Math.PI)
    : 0;

  const showActiveSub = done && subActive;

  return (
    <div style={{
      position: "absolute",
      left: x - 60, top: y - 60,
      width: 120,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{
        position: "absolute", top: -8, left: -8,
        width: 22, height: 22, borderRadius: 11,
        background: done ? MF_MINT : (lit ? MF_ACCENT : "rgba(20,32,48,0.95)"),
        color: done || lit ? "#0a1628" : MF_FAINT,
        border: `1px solid ${done ? MF_MINT : (lit ? MF_ACCENT : "rgba(127,198,230,0.2)")}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: MF_SANS, fontSize: 10, fontWeight: 700,
        zIndex: 2,
        transition: "all 240ms",
      }}>
        {done ? "✓" : index}
      </div>

      <div style={{
        width: 84, height: 84, borderRadius: 42,
        background: done
          ? "linear-gradient(165deg, #6fdfb5 0%, #3fb88c 100%)"
          : (lit ? MF_GRAD : MF_CARD),
        border: `1px solid ${done ? MF_MINT : (lit ? "rgba(255,255,255,0.2)" : "rgba(127,198,230,0.15)")}`,
        boxShadow: done
          ? `0 0 24px rgba(93,212,168,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset`
          : (lit
            ? `0 0 ${20 * ringPulse}px rgba(127,198,230,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset`
            : "0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04) inset"),
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 240ms, border-color 240ms",
      }}>
        <NodeIcon icon={icon} active={lit || done} />
      </div>

      {lit && !done && (
        <div style={{
          position: "absolute", top: 0, left: "50%",
          width: 84, height: 84, borderRadius: 42,
          marginLeft: -42,
          border: `2px solid ${MF_ACCENT}`,
          opacity: 0.6 * (1 - progress),
          transform: `scale(${1 + progress * 0.4})`,
          pointerEvents: "none",
        }} />
      )}

      <div style={{
        marginTop: 12,
        fontFamily: MF_SANS, fontSize: 12, fontWeight: 600,
        color: lit || done ? MF_TEXT : MF_DIM,
        letterSpacing: "0.02em",
        textAlign: "center",
        transition: "color 240ms",
      }}>{label}</div>

      <div style={{
        marginTop: 2,
        fontFamily: MF_SANS, fontSize: 10,
        color: showActiveSub ? MF_MINT : MF_FAINT,
        textAlign: "center",
        lineHeight: 1.3,
        maxWidth: 130,
        transition: "color 240ms",
      }}>
        {showActiveSub ? subActive : sub}
      </div>
    </div>
  );
}

function NodeIcon({ icon, active }) {
  const c = active ? "#fff" : "rgba(127,198,230,0.5)";
  const sw = 1.8;
  if (icon === "webhook") return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="18" r="3" stroke={c} strokeWidth={sw} />
      <circle cx="18" cy="18" r="3" stroke={c} strokeWidth={sw} />
      <circle cx="12" cy="6" r="3" stroke={c} strokeWidth={sw} />
      <path d="M12 9v3l-4 5M12 9l5 6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
  if (icon === "crm") return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="3.5" stroke={c} strokeWidth={sw} />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <path d="M16 4l2 2 4-4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (icon === "mail") return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="14" rx="2" stroke={c} strokeWidth={sw} />
      <path d="M3 8l9 6 9-6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (icon === "slack") return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="8" height="3" rx="1.5" stroke={c} strokeWidth={sw} />
      <rect x="13" y="3" width="3" height="8" rx="1.5" stroke={c} strokeWidth={sw} />
      <rect x="13" y="13" width="8" height="3" rx="1.5" stroke={c} strokeWidth={sw} />
      <rect x="8" y="13" width="3" height="8" rx="1.5" stroke={c} strokeWidth={sw} />
    </svg>
  );
  if (icon === "cal") return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke={c} strokeWidth={sw} />
      <path d="M3 9h18M8 3v4M16 3v4" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="12" cy="14" r="1.5" fill={c} />
    </svg>
  );
  return null;
}

// ── Scene ───────────────────────────────────────────────────────────────────

function MakeFlowScene() {
  const t = useTime();

  const NAME = "Sarah Chen";
  const EMAIL = "sarah@northbay.coffee";
  const BUSINESS = "North Bay Coffee Roasters";
  const MESSAGE = "We need a real website and a way to capture wholesale leads from Instagram.";

  const fields = [
    { key: "name", text: NAME, start: 1.5, end: 2.0 },
    { key: "email", text: EMAIL, start: 2.0, end: 2.6 },
    { key: "business", text: BUSINESS, start: 2.6, end: 3.2 },
    { key: "message", text: MESSAGE, start: 3.2, end: 4.2 },
  ];

  let focused = null;
  const values = { name: "", email: "", business: "", message: "" };
  for (const f of fields) {
    if (t >= f.end) {
      values[f.key] = f.text;
    } else if (t >= f.start) {
      const reveal = clamp((t - f.start) / (f.end - f.start), 0, 1);
      values[f.key] = f.text.slice(0, Math.floor(f.text.length * reveal));
      focused = f.key;
    }
  }

  const submitPress = t > 4.4 && t < 4.7;
  const submitFlash = interpolate([4.4, 4.55, 5.1], [0, 1, 0], Easing.easeOutCubic)(t);

  const edgeWindows = [
    [4.7, 5.7],
    [5.9, 6.9],
    [7.1, 8.3],
    [8.5, 9.5],
  ];

  const activeEdges = edgeWindows.map(([s, e]) =>
    interpolate([s, e], [0, 1], Easing.easeInOutCubic)(t)
  );

  const nodeWindows = [
    [4.55, 5.4],
    [5.7, 6.5],
    [6.9, 7.7],
    [8.3, 9.1],
    [9.5, 10.3],
  ];
  const activeNodes = nodeWindows.map(([s, e]) =>
    interpolate([s, e], [0, 1], Easing.easeInOutCubic)(t)
  );

  const tokens = [];

  if (t > 4.5 && t < 5.0) {
    const p = clamp((t - 4.55) / (4.95 - 4.55), 0, 1);
    const eased = Easing.easeInOutCubic(p);
    const sx = 470, sy = 580;
    const ex = NODE_COORDS[0].x, ey = NODE_COORDS[0].y;
    const mx = (sx + ex) / 2;
    const my = Math.min(sy, ey) - 60;
    const x = (1 - eased) ** 2 * sx + 2 * (1 - eased) * eased * mx + eased ** 2 * ex;
    const y = (1 - eased) ** 2 * sy + 2 * (1 - eased) * eased * my + eased ** 2 * ey;
    const op = p < 0.15 ? p / 0.15 : (p > 0.85 ? (1 - p) / 0.15 : 1);
    tokens.push({ x, y, opacity: clamp(op, 0, 1) });
  }

  edgeWindows.forEach(([s, e], i) => {
    if (t > s && t < e) {
      const p = clamp((t - s) / (e - s), 0, 1);
      const a = NODE_COORDS[i];
      const b = NODE_COORDS[i + 1];
      const eased = Easing.easeInOutCubic(p);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      let x, y;
      if (Math.abs(dy) < 5) {
        x = a.x + dx * eased;
        y = a.y + dy * eased;
      } else {
        const c1x = a.x + dx * 0.5, c1y = a.y;
        const c2x = a.x + dx * 0.5, c2y = b.y;
        const u = 1 - eased;
        x = u * u * u * a.x + 3 * u * u * eased * c1x + 3 * u * eased * eased * c2x + eased * eased * eased * b.x;
        y = u * u * u * a.y + 3 * u * u * eased * c1y + 3 * u * eased * eased * c2y + eased * eased * eased * b.y;
      }
      const op = p < 0.1 ? p / 0.1 : (p > 0.9 ? (1 - p) / 0.1 : 1);
      tokens.push({ x, y, opacity: clamp(op, 0, 1) });
    }
  });

  const captionOpacity = interpolate([11.0, 11.6], [0, 1], Easing.easeOutCubic)(t)
    * interpolate([14.0, 14.6], [1, 0], Easing.easeInCubic)(t);

  const fadeOut = interpolate([14.7, 15.2], [0, 1], Easing.easeInCubic)(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: MF_BG,
      overflow: "hidden",
    }}>
      <MFTopBar />
      <MFSectionLabel />

      <ContactForm
        values={values}
        focused={focused}
        submitPress={submitPress}
        submitFlash={submitFlash}
      />

      <MakeScenario
        activeNodes={activeNodes}
        activeEdges={activeEdges}
        tokenPositions={tokens}
        captionOpacity={captionOpacity}
      />

      <div style={{
        position: "absolute", inset: 0,
        background: MF_BG,
        opacity: fadeOut,
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ── Default export ──────────────────────────────────────────────────────────

export default function MakeFlowDemo() {
  return (
    <>
      <style>{`@keyframes mf-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      <Stage width={1280} height={720} duration={15.5} background={MF_BG}>
        <MakeFlowScene />
      </Stage>
    </>
  );
}
