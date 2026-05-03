/* ChatbotDemo.jsx — animated demo for /services/ai-integration's "Custom
   Chatbot Interface" gallery card. 15.5s loop: pricing page → cursor clicks
   "Chat with TSD" → widget slides in → camera zooms to chat → conversation
   plays out (greeting, three user messages, three bot replies).

   Ported from a Claude Design handoff bundle (Stage/Scene primitives that
   ran in-browser via Babel-standalone). This native version has no playback
   bar, no localStorage persistence, no keyboard shortcuts — just autoplay +
   loop, scaled to fit whatever container it's dropped into. */

import {
  createContext, useContext, useEffect, useLayoutEffect,
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

// ── Scene: design tokens ────────────────────────────────────────────────────

const BG = "#0a1628";
const CARD_GRAD = "linear-gradient(165deg, #6fb3e8 0%, #4d8dc7 50%, #2f6aa3 100%)";
const CARD_DARK = "#16202f";
const MINT = "#5dd4a8";
const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
const SANS = 'Inter, "Helvetica Neue", system-ui, sans-serif';

// ── Pricing page chrome (top bar, call-us button) ───────────────────────────

function TopBar() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 36px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 28,
          background: "linear-gradient(135deg, #5fb0d8, #2f6aa3)",
          borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 11,
          letterSpacing: "0.05em",
        }}>TSD</div>
        <div style={{
          fontFamily: SANS, fontSize: 10, fontWeight: 600,
          letterSpacing: "0.32em", color: "#dce8f5",
          lineHeight: 1.2,
        }}>
          MODERNIZATION<br />
          <span style={{ fontSize: 7, opacity: 0.5, letterSpacing: "0.4em" }}>SOLUTIONS</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#dce8f5", fontSize: 14,
        }}>☀</div>
        <div style={{
          padding: "7px 18px", borderRadius: 18,
          background: "linear-gradient(135deg, #5fb0d8, #2f6aa3)",
          color: "#fff", fontFamily: SANS, fontSize: 12, fontWeight: 500,
          letterSpacing: "0.04em",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset",
        }}>≡  Menu</div>
      </div>
    </div>
  );
}

function CallUsButton() {
  return (
    <div style={{
      position: "absolute", bottom: 28, left: 28, zIndex: 5,
      padding: "10px 18px 10px 14px", borderRadius: 22,
      background: "linear-gradient(135deg, #5fb0d8, #3a7fb5)",
      color: "#fff", fontFamily: SANS, fontSize: 13, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 16px rgba(47, 106, 163, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Call us
    </div>
  );
}

// ── Pricing tier card ───────────────────────────────────────────────────────

function PricingTier({ phase, title, oldPrice, price, rateLabel, badge, popular, features, cta, footer, fade }) {
  const isPopular = popular;
  return (
    <div style={{
      flex: 1,
      background: isPopular ? CARD_GRAD : CARD_DARK,
      borderRadius: 16,
      padding: "28px 26px 24px",
      position: "relative",
      color: isPopular ? "#0a1628" : "#dce8f5",
      boxShadow: isPopular
        ? "0 20px 60px rgba(95, 176, 216, 0.25), 0 0 0 1px rgba(255,255,255,0.15) inset"
        : "0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04) inset",
      opacity: fade,
      transform: `translateY(${(1 - fade) * 8}px)`,
      minWidth: 0,
    }}>
      <div style={{ position: "absolute", top: -10, left: 24, display: "flex", gap: 6 }}>
        <div style={{
          padding: "4px 12px", borderRadius: 4,
          background: isPopular ? "#1c4870" : "rgba(20, 32, 48, 0.95)",
          color: isPopular ? "#7fc6e6" : "#5fb0d8",
          fontFamily: SANS, fontSize: 9, fontWeight: 600,
          letterSpacing: "0.18em",
          border: isPopular ? "1px solid #2a5a82" : "1px solid rgba(95, 176, 216, 0.2)",
        }}>{phase}</div>
        {badge && (
          <div style={{
            padding: "4px 12px", borderRadius: 4,
            background: "rgba(20, 32, 48, 0.95)",
            color: "#dce8f5",
            fontFamily: SANS, fontSize: 9, fontWeight: 500,
            letterSpacing: "0.18em",
          }}>{badge}</div>
        )}
      </div>

      <div style={{
        textAlign: "center", marginTop: 8,
        fontFamily: SANS, fontSize: 11, fontWeight: 600,
        letterSpacing: "0.28em",
        color: isPopular ? "#1c4870" : "#7fc6e6",
      }}>{title}</div>

      {oldPrice && (
        <div style={{
          textAlign: "center", marginTop: 14,
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: 22, fontWeight: 500,
          textDecoration: "line-through",
          color: isPopular ? "rgba(10,22,40,0.45)" : "rgba(220,232,245,0.35)",
        }}>{oldPrice}</div>
      )}

      <div style={{
        textAlign: "center",
        fontFamily: SERIF, fontStyle: "italic",
        fontSize: 64, fontWeight: 500,
        lineHeight: 1,
        color: isPopular ? "#0a1628" : "#dce8f5",
        marginTop: oldPrice ? 4 : 18,
        letterSpacing: "-0.02em",
      }}>{price}</div>

      <div style={{
        textAlign: "center", marginTop: 8,
        fontFamily: SANS, fontSize: 10, fontWeight: 600,
        letterSpacing: "0.22em",
        color: isPopular ? "#1c4870" : "#7fc6e6",
      }}>{rateLabel}</div>

      {features.spotsLabel && (
        <div style={{
          margin: "14px auto 0",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "5px 12px",
          borderRadius: 12,
          background: isPopular ? "rgba(10,22,40,0.18)" : "rgba(95,176,216,0.1)",
          color: isPopular ? "#0a1628" : "#7fc6e6",
          fontFamily: SANS, fontSize: 10, fontWeight: 600,
          letterSpacing: "0.05em",
          width: "fit-content",
          border: isPopular ? "1px solid rgba(10,22,40,0.2)" : "1px solid rgba(95,176,216,0.2)",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: MINT }} />
          {features.spotsLabel}
        </div>
      )}

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        {features.list.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, fontFamily: SANS, fontSize: 11.5, lineHeight: 1.4 }}>
            <span style={{
              color: isPopular ? "#0a1628" : MINT, fontWeight: 700, flexShrink: 0,
            }}>✓</span>
            <span style={{ color: isPopular ? "rgba(10,22,40,0.85)" : "rgba(220,232,245,0.85)" }}>{f}</span>
          </div>
        ))}
      </div>

      {features.bonus && (
        <div style={{
          marginTop: 16, padding: "12px 14px",
          background: "rgba(10,22,40,0.18)",
          border: "1px solid rgba(10,22,40,0.25)",
          borderRadius: 8,
          fontFamily: SANS, fontSize: 11, lineHeight: 1.4,
          color: "rgba(10,22,40,0.85)",
        }}>
          <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", marginBottom: 4 }}>
            <span style={{ color: "#1c4870" }}>★</span> BONUS
          </div>
          {features.bonus}
        </div>
      )}

      <div style={{
        margin: "18px 0 0", padding: "11px 0",
        textAlign: "center", borderRadius: 24,
        background: isPopular ? "linear-gradient(135deg, #5fb0d8, #3a7fb5)" : "rgba(220,232,245,0.08)",
        color: "#fff",
        fontFamily: SANS, fontSize: 13, fontWeight: 600,
        letterSpacing: "0.02em",
        border: isPopular ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(220,232,245,0.1)",
        boxShadow: isPopular ? "0 4px 12px rgba(47,106,163,0.4)" : "none",
      }}>{cta}</div>

      {footer && (
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: "1px solid rgba(220,232,245,0.06)",
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          {footer.italic && (
            <div style={{
              fontFamily: SERIF, fontStyle: "italic", fontSize: 10.5,
              textAlign: "center", marginBottom: 4,
              color: isPopular ? "rgba(10,22,40,0.55)" : "rgba(220,232,245,0.4)",
            }}>{footer.italic}</div>
          )}
          {footer.list.map((f, i) => (
            <div key={i} style={{
              display: "flex", gap: 8,
              fontFamily: SANS, fontSize: 10,
              color: isPopular ? "rgba(10,22,40,0.5)" : "rgba(220,232,245,0.4)",
            }}>
              <span style={{ color: isPopular ? "rgba(10,22,40,0.4)" : MINT, opacity: 0.6 }}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingPage({ shift }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: BG,
      transform: `translateX(${-shift * 12}px)`,
    }}>
      <TopBar />
      <CallUsButton />
      <div style={{
        position: "absolute", top: 84, left: 0, right: 0,
        textAlign: "center", fontFamily: SERIF, fontStyle: "italic",
        fontSize: 13, color: "rgba(220,232,245,0.4)",
      }}>
        term agency.
      </div>
      <div style={{
        position: "absolute", top: 130, left: 130, right: 130,
        display: "flex", gap: 20, alignItems: "flex-start",
      }}>
        <PricingTier
          phase="PHASE I"
          title="DISCOVERY"
          oldPrice="$3,000"
          price="$1,500"
          rateLabel="FOUNDING RATE · ONE-TIME"
          features={{
            spotsLabel: "AVAILABLE NOW",
            list: [
              "2-3 hour structured tech audit",
              "Written modernization roadmap",
              "Tool & platform recommendations",
              "Priority areas identified",
              "No obligation to continue",
            ],
          }}
          cta="Book Tech Audit"
          footer={{
            italic: "Money-back if we can't find $25K of opportunities.",
            list: [
              "100% money-back guarantee",
              "48-hour written proposal",
              "No retainers, no subscriptions",
            ],
          }}
          fade={1}
        />
        <PricingTier
          phase="BUILD"
          title="WEBSITE + AI BUILD"
          price="$5,000"
          rateLabel="FOUNDING RATE"
          badge="MOST POPULAR"
          popular
          features={{
            list: [
              "Custom responsive website",
              "AI chatbot or workflow automation",
              "On-page SEO + analytics wiring",
              "Written + video documentation",
              "Founder on call for fixes through August 31, 2026",
              "Full source code ownership",
            ],
            bonus: "Already bought After-Hours Lead Capture? Save $1,000 on this build within 30 days.",
          }}
          cta="Claim a Build Slot"
          footer={{
            italic: "Final fee. Delivered by handoff. Source code is yours from day one.",
            list: [
              "100% money-back guarantee",
              "48-hour written proposal",
            ],
          }}
          fade={1}
        />
        <PricingTier
          phase="MODERNIZATION"
          title="THE FULL MODERNIZATION"
          price="$10,000"
          rateLabel="FOUNDING RATE · BY APPLICATION"
          features={{
            list: [
              "Discovery audit + written modernization roadmap",
              "Custom website + AI receptionist (call + chat capture)",
              "One operational integration (ServiceTitan, QuickBooks, Jobber, or another)",
              "Custom AI re-training on your real call data through August 31",
              "Weekly written status report + monthly business review with your TSD partner",
              "Full source code ownership",
            ],
          }}
          cta="Apply for the Full Modernization"
          footer={{
            italic: "Cancel any time after handoff. No retainer trap.",
            list: [
              "100% money-back guarantee",
              "48-hour written proposal",
              "No retainers, no subscriptions",
            ],
          }}
          fade={1}
        />
      </div>
    </div>
  );
}

// ── Cursor ──────────────────────────────────────────────────────────────────

function Cursor({ x, y, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      pointerEvents: "none", zIndex: 100,
      transform: "translate(-2px, -2px)",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
    }}>
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
        <path d="M2 2 L2 18 L7 14 L10 21 L13 20 L10 13 L17 13 Z"
          fill="#fff" stroke="#0a1628" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Chat with TSD button ────────────────────────────────────────────────────

function ChatButton({ pressed, opacity }) {
  return (
    <div style={{
      position: "absolute", bottom: 28, right: 28, zIndex: 6,
      padding: "10px 18px 10px 14px", borderRadius: 22,
      background: "linear-gradient(135deg, #5fb0d8, #3a7fb5)",
      color: "#fff", fontFamily: SANS, fontSize: 13, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: pressed
        ? "0 0 0 6px rgba(95,176,216,0.25), 0 4px 12px rgba(47,106,163,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset"
        : "0 4px 16px rgba(47,106,163,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset",
      transform: `scale(${pressed ? 0.96 : 1})`,
      opacity,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      Chat with TSD
    </div>
  );
}

// ── Chat widget ─────────────────────────────────────────────────────────────

function ChatWidget({ openProgress, messages, typing, inputText, sendingFlash }) {
  // Widget dimensions intentionally sized so the chat reads as substantial
  // in the wide-shot intro (when the camera hasn't zoomed yet) AND fills the
  // frame at peak zoom. Bumped from 280×400 → 340×460 to make the widget
  // visible across the full 15.5s loop, not just the zoomed phase. The zoom
  // target below depends on the widget's stage-coordinate center; if these
  // dimensions change, recompute targetX/targetY in Scene().
  const widgetW = 340;
  const widgetH = 460;
  const tx = (1 - openProgress) * 40;
  const op = openProgress;
  const scale = 0.95 + 0.05 * openProgress;

  return (
    <div style={{
      position: "absolute",
      right: 28, bottom: 28,
      width: widgetW, height: widgetH,
      background: "#0f1825",
      border: "1px solid rgba(95,176,216,0.18)",
      borderRadius: 12,
      boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(95,176,216,0.08) inset",
      transform: `translateX(${tx}px) scale(${scale})`,
      transformOrigin: "bottom right",
      opacity: op,
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      zIndex: 8,
    }}>
      <div style={{
        padding: "14px 16px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: SANS, fontSize: 9, fontWeight: 600,
          letterSpacing: "0.22em", color: "#7fc6e6",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 3, background: MINT,
            boxShadow: `0 0 6px ${MINT}`,
          }} />
          CHAT AGENT
        </div>
        <div style={{
          marginTop: 4,
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: 22, fontWeight: 500, color: "#dce8f5",
          letterSpacing: "-0.01em",
        }}>
          TSD Modernization
        </div>
        <div style={{
          position: "absolute", top: 14, right: 14,
          width: 22, height: 22, borderRadius: 11,
          background: "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(220,232,245,0.5)", fontSize: 13, lineHeight: 1,
          fontFamily: SANS,
        }}>×</div>
      </div>

      <ScrollingMessages messages={messages} typing={typing} />

      <div style={{
        padding: "10px 12px 12px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(95,176,216,0.18)",
          borderRadius: 18,
          boxShadow: sendingFlash > 0
            ? `0 0 0 ${sendingFlash * 3}px rgba(95,176,216,${sendingFlash * 0.25})`
            : "none",
        }}>
          <div style={{
            flex: 1, fontFamily: SANS, fontSize: 11,
            color: inputText ? "#dce8f5" : "rgba(220,232,245,0.4)",
            minHeight: 14,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {inputText || "Ask about pricing, the cohort, or your..."}
            {inputText && <span style={{
              display: "inline-block", width: 1, height: 11, marginLeft: 1,
              background: "#7fc6e6", verticalAlign: "middle",
              animation: "tsd-blink 1s steps(2) infinite",
            }} />}
          </div>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: inputText ? "linear-gradient(135deg, #5fb0d8, #3a7fb5)" : "rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 200ms",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke={inputText ? "#fff" : "rgba(220,232,245,0.5)"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollingMessages({ messages, typing }) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const sig = messages.map((m) => m.from + ":" + (m.text || "").length).join("|") + (typing ? "|t" : "");

  useLayoutEffect(() => {
    const c = containerRef.current;
    const inner = innerRef.current;
    if (!c || !inner) return;
    const overflow = Math.max(0, inner.scrollHeight - c.clientHeight);
    inner.style.transition = "transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1)";
    inner.style.transform = `translateY(${-overflow}px)`;
  }, [sig]);

  return (
    <div ref={containerRef} style={{
      flex: 1,
      position: "relative",
      overflow: "hidden",
    }}>
      <div ref={innerRef} style={{
        position: "absolute",
        left: 0, right: 0, top: 0,
        padding: "14px 14px 8px",
        display: "flex", flexDirection: "column", gap: 10,
        willChange: "transform",
      }}>
        {messages.map((m, i) => <ChatMessage key={i} {...m} />)}
        {typing && <TypingDots />}
      </div>
    </div>
  );
}

function ChatMessage({ from, text, opacity = 1, slide = 0 }) {
  const isBot = from === "bot";
  return (
    <div style={{
      alignSelf: isBot ? "flex-start" : "flex-end",
      maxWidth: "88%",
      padding: "8px 11px",
      background: isBot ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #5fb0d8, #3a7fb5)",
      color: isBot ? "#dce8f5" : "#fff",
      fontFamily: SANS, fontSize: 11, lineHeight: 1.45,
      borderRadius: isBot ? "10px 10px 10px 2px" : "10px 10px 2px 10px",
      border: isBot ? "1px solid rgba(255,255,255,0.04)" : "none",
      opacity,
      transform: `translateY(${(1 - opacity) * 8 + slide}px)`,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}>
      {text}
    </div>
  );
}

function TypingDots() {
  const t = useTime();
  const dots = [0, 1, 2].map((i) => {
    const phase = (t * 2 - i * 0.18) % 1;
    return phase > 0 && phase < 0.5 ? Math.sin(phase * Math.PI) : 0;
  });
  return (
    <div style={{
      alignSelf: "flex-start",
      padding: "10px 12px",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "10px 10px 10px 2px",
      display: "flex", gap: 4,
    }}>
      {dots.map((lift, i) => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: 3,
          background: "rgba(220,232,245,0.6)",
          transform: `translateY(${-lift * 3}px)`,
          opacity: 0.5 + lift * 0.5,
        }} />
      ))}
    </div>
  );
}

// ── Scene composition ───────────────────────────────────────────────────────

function Scene() {
  const t = useTime();

  const cursorX = interpolate([0, 0.6, 1.4, 1.7], [400, 800, 1140, 1140], Easing.easeInOutCubic)(t);
  const cursorY = interpolate([0, 0.6, 1.4, 1.7], [560, 520, 540, 540], Easing.easeInOutCubic)(t);
  const cursorVisible = t < 3.4;

  const pressed = t > 1.35 && t < 1.6;
  const buttonOpacity = interpolate([0, 1.5, 1.7], [1, 1, 0], Easing.easeOutCubic)(t);

  const openProgress = interpolate([1.55, 2.0], [0, 1], Easing.easeOutCubic)(t);

  const zoomT = interpolate([2.7, 3.6], [0, 1], Easing.easeInOutCubic)(t);
  const finalScale = 2.1;
  const zoomScale = 1 + zoomT * (finalScale - 1);
  // Zoom target = stage-coordinate center of the chat widget.
  // Widget is 340×460 anchored at right:28, bottom:28 in a 1280×720 stage:
  //   left edge = 1280 - 28 - 340 = 912; right edge = 1252; horizontal center = 1082
  //   top edge  = 720  - 28 - 460 = 232; bottom edge = 692; vertical center  = 462
  // If widget dimensions change above, recompute these.
  const targetX = 1082, targetY = 462;
  const stageW = 1280, stageH = 720;
  const targetTx = stageW / 2 - targetX * finalScale;
  const targetTy = stageH / 2 - targetY * finalScale;
  const camTx = targetTx * zoomT;
  const camTy = targetTy * zoomT;

  const convo = buildConversation(t);
  const shift = interpolate([1.7, 2.2], [0, 1], Easing.easeOutCubic)(t);
  const fadeOut = interpolate([14.4, 14.9], [0, 1], Easing.easeInCubic)(t);

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      background: BG,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        transform: `translate(${camTx}px, ${camTy}px) scale(${zoomScale})`,
        transformOrigin: "0 0",
      }}>
        <PricingPage shift={shift} />
        <ChatButton pressed={pressed} opacity={buttonOpacity} />
        {openProgress > 0 && (
          <ChatWidget
            openProgress={openProgress}
            messages={convo.messages}
            typing={convo.typing}
            inputText={convo.inputText}
            sendingFlash={convo.sendingFlash}
          />
        )}
        <Cursor x={cursorX} y={cursorY} visible={cursorVisible} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: BG,
        opacity: fadeOut,
        pointerEvents: "none",
      }} />
    </div>
  );
}

function buildConversation(t) {
  const greetStart = 2.0;
  const greetEnd = 3.0;
  const greeting = "Hi — I'm the chat agent for TSD Modernization Solutions. Ask me about pricing, the cohort, or what we build. If you want to talk to a founder, just say so.";

  const u1 = "What's in the Website + AI Build?";
  const u1TypeStart = 4.0, u1TypeEnd = 5.6;
  const u1Send = 5.8;
  const u1BotTypingStart = 6.0, u1BotTypingEnd = 6.8;
  const u1BotReply = "The $5,000 Website + AI Build: custom responsive site, AI chatbot or workflow automation, on-page SEO + analytics, written + video docs, founder on call through Aug 31, 2026, and full source code. Wedge customers (the $497 After-Hours Lead Capture) save $1,000 on this build within 30 days of setup.";
  const u1BotEnd = 8.2;

  const u2 = "How many spots are left?";
  const u2TypeStart = 9.0, u2TypeEnd = 10.2;
  const u2Send = 10.4;
  const u2BotTypingStart = 10.6, u2BotTypingEnd = 11.3;
  const u2BotReply = "We're capping the founding cohort at ten total Charlotte builds for Summer 2026 — last project start is July 13. Want me to put you on a quick fit call with one of the founders?";
  const u2BotEnd = 12.6;

  const u3 = "Yes, book a call.";
  const u3TypeStart = 13.2, u3TypeEnd = 13.8;
  const u3Send = 13.9;

  const messages = [];

  if (t > greetStart) {
    const reveal = clamp((t - greetStart) / (greetEnd - greetStart), 0, 1);
    messages.push({ from: "bot", text: greeting.slice(0, Math.floor(greeting.length * reveal)), opacity: 1 });
  }

  if (t > u1Send) {
    messages.push({ from: "user", text: u1, opacity: clamp((t - u1Send) / 0.25, 0, 1) });
  }
  if (t > u1BotTypingEnd) {
    const reveal = clamp((t - u1BotTypingEnd) / (u1BotEnd - u1BotTypingEnd), 0, 1);
    messages.push({ from: "bot", text: u1BotReply.slice(0, Math.floor(u1BotReply.length * reveal)), opacity: 1 });
  }

  if (t > u2Send) {
    messages.push({ from: "user", text: u2, opacity: clamp((t - u2Send) / 0.25, 0, 1) });
  }
  if (t > u2BotTypingEnd) {
    const reveal = clamp((t - u2BotTypingEnd) / (u2BotEnd - u2BotTypingEnd), 0, 1);
    messages.push({ from: "bot", text: u2BotReply.slice(0, Math.floor(u2BotReply.length * reveal)), opacity: 1 });
  }

  if (t > u3Send) {
    messages.push({ from: "user", text: u3, opacity: clamp((t - u3Send) / 0.25, 0, 1) });
  }

  const typing =
    (t > u1BotTypingStart && t < u1BotTypingEnd) ||
    (t > u2BotTypingStart && t < u2BotTypingEnd) ||
    (t > 14.0 && t < 14.5);

  let inputText = "";
  if (t > u1TypeStart && t < u1Send) {
    const reveal = clamp((t - u1TypeStart) / (u1TypeEnd - u1TypeStart), 0, 1);
    inputText = u1.slice(0, Math.floor(u1.length * reveal));
  } else if (t > u2TypeStart && t < u2Send) {
    const reveal = clamp((t - u2TypeStart) / (u2TypeEnd - u2TypeStart), 0, 1);
    inputText = u2.slice(0, Math.floor(u2.length * reveal));
  } else if (t > u3TypeStart && t < u3Send) {
    const reveal = clamp((t - u3TypeStart) / (u3TypeEnd - u3TypeStart), 0, 1);
    inputText = u3.slice(0, Math.floor(u3.length * reveal));
  }

  let sendingFlash = 0;
  for (const sendT of [u1Send, u2Send, u3Send]) {
    if (t > sendT && t < sendT + 0.3) {
      sendingFlash = Math.max(sendingFlash, 1 - (t - sendT) / 0.3);
    }
  }

  return { messages, typing, inputText, sendingFlash };
}

// ── Default export ──────────────────────────────────────────────────────────

export default function ChatbotDemo() {
  return (
    <>
      <style>{`@keyframes tsd-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      <Stage width={1280} height={720} duration={15.5} background={BG}>
        <Scene />
      </Stage>
    </>
  );
}
