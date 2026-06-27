import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  Button, Eyebrow,
  SPACE, RADIUS,
} from "../shared";
import { ArrowRightIcon, CheckIcon } from "../icons";

/* ──────────────────────────────────────────────────────────────
   PRICING ESTIMATOR — company size + product picker → an estimated
   one-time range and a monthly Managed AI range.

   ⚠️  PLACEHOLDER NUMBERS. Every figure in PRICING/SIZES/MANAGED is a
   default pending Nash's sign-off. Tune them here — nothing else needs
   to change. Output is deliberately framed as an estimate, never a
   quote; the exact number comes from the free fit call. */

const SIZES = [
  { id: "solo",        label: "Just me",     detail: "1–2 people",   mult: 0.8, pkg: "Starter Modernization" },
  { id: "small",       label: "Small team",  detail: "3–7 people",   mult: 1.0, pkg: "Core Modernization" },
  { id: "established", label: "Established",  detail: "8–30 people",  mult: 1.3, pkg: "Full Modernization" },
  { id: "larger",      label: "Larger",      detail: "30+ people",   mult: 2.7, pkg: "Custom Engagement" },
];

/* ⚠️ KEEP IN SYNC with tsd-modernization-app/src/lib/sales/estimator.ts —
   the sales pitch page and this public estimator must agree to the dollar.
   Pinned by estimator.test.ts in the app; change both files together. */
const PRODUCTS = [
  { id: "website",   label: "A new website",      detail: "Custom, fast, managed or owned",     low: 2900, high: 4000, ai: false },
  { id: "frontDesk", label: "TSD Front Desk",     detail: "AI receptionist, phone + chat, books work", low: 1200, high: 1600, ai: true },
  { id: "concierge", label: "TSD Concierge",      detail: "Site assistant, answers from your content + catalog", low: 4100, high: 5800, ai: true },
  { id: "leadEngine", label: "TSD Lead Engine",   detail: "Landing funnel + a lead dashboard your team works", low: 2400, high: 3400, ai: false },
];

/* Monthly Managed AI, by how many AI products are running. */
const MANAGED = { 0: 0, 1: 73, 2: 147, 3: 222, 4: 297, 5: 373 };

/* Owned-outright builds carry a higher one-time fee: the handoff package
   (source code, credentials, runbook, docs + live training) plus the
   recurring revenue TSD forgoes. Managed keeps the base setup price and
   adds the monthly. ⚠️ PLACEHOLDER multiplier pending Nash's sign-off —
   KEEP IN SYNC with estimator.ts (same caveat as PRODUCTS above). */
const OWNED_MULT = 1.25;

const OWNERSHIP = [
  { id: "managed", label: "Managed by us", detail: "Lower setup. We host, maintain, and make your changes; monthly, cancel anytime" },
  { id: "owned", label: "Owned by you", detail: "Higher setup. Source code, credentials + runbook at handoff; nothing monthly" },
];

const round100 = (n) => Math.round(n / 100) * 100;
const fmt$ = (n) => "$" + Math.round(n).toLocaleString();

function OptionButton({ active, onClick, label, detail, check }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        position: "relative",
        flex: "1 1 150px",
        textAlign: "left",
        padding: "16px 18px",
        borderRadius: RADIUS.lg,
        cursor: "pointer",
        background: active ? "rgba(75,156,211,0.10)" : v("bg-alt"),
        border: `1px solid ${active ? C.carolina : v("surface-border")}`,
        color: v("text"),
        transition: "border-color 0.2s ease, background 0.2s ease",
        fontFamily: "var(--font-body)",
      }}
    >
      {check && (
        <span aria-hidden="true" style={{
          position: "absolute", top: "12px", right: "12px",
          width: "20px", height: "20px", borderRadius: RADIUS.full,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: active ? C.gradientAccent : "transparent",
          border: active ? "none" : `1px solid ${v("divider")}`,
          color: "#fff",
        }}>
          {active && <CheckIcon size={12} strokeWidth={3} />}
        </span>
      )}
      <span style={{ display: "block", fontSize: "15px", fontWeight: 700, marginBottom: "2px", paddingRight: check ? "26px" : 0 }}>{label}</span>
      <span style={{ display: "block", fontSize: "12px", color: v("text-dim"), lineHeight: 1.4 }}>{detail}</span>
    </button>
  );
}

export default function PricingEstimator() {
  const [ref, fade] = useFadeIn(0);
  const [size, setSize] = useState("small");
  const [selected, setSelected] = useState(["website"]);
  const [ownership, setOwnership] = useState("managed");

  const toggle = (id) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const result = useMemo(() => {
    const sz = SIZES.find((s) => s.id === size);
    const chosen = PRODUCTS.filter((p) => selected.includes(p.id));
    const owned = ownership === "owned";
    const mult = sz.mult * (owned ? OWNED_MULT : 1);
    const low = round100(chosen.reduce((a, p) => a + p.low, 0) * mult);
    const high = round100(chosen.reduce((a, p) => a + p.high, 0) * mult);
    const aiCount = Math.min(chosen.filter((p) => p.ai).length, 5);
    const managed = owned ? 0 : MANAGED[aiCount];
    return { sz, chosen, owned, low, high, aiCount, managed };
  }, [size, selected, ownership]);

  const hasPicks = result.chosen.length > 0;
  const isLarger = size === "larger";

  return (
    <section ref={ref} style={{ ...fade, maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.15fr 1fr",
        gap: SPACE.xl,
        alignItems: "start",
      }} className="estimator-grid">
        {/* ── Inputs ─────────────────────────────── */}
        <div style={{
          background: "var(--glass-bg-strong)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--glass-radius)",
          padding: "clamp(24px, 3.5vw, 40px)",
          boxShadow: "var(--glass-shadow)",
          position: "relative",
          isolation: "isolate",
        }}>
          <span aria-hidden="true" style={{
            position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
            background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
            pointerEvents: "none",
          }} />

          <div style={{ marginBottom: SPACE.xl }}>
            <Eyebrow style={{ marginBottom: SPACE.md }}>01. How big is your team?</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {SIZES.map((s) => (
                <OptionButton
                  key={s.id}
                  active={size === s.id}
                  onClick={() => setSize(s.id)}
                  label={s.label}
                  detail={s.detail}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: SPACE.xl }}>
            <Eyebrow style={{ marginBottom: SPACE.md }}>02. What do you want running?</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {PRODUCTS.map((p) => (
                <OptionButton
                  key={p.id}
                  active={selected.includes(p.id)}
                  onClick={() => toggle(p.id)}
                  label={p.label}
                  detail={p.detail}
                  check
                />
              ))}
            </div>
          </div>

          <div>
            <Eyebrow style={{ marginBottom: SPACE.md }}>03. How should it run?</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {OWNERSHIP.map((o) => (
                <OptionButton
                  key={o.id}
                  active={ownership === o.id}
                  onClick={() => setOwnership(o.id)}
                  label={o.label}
                  detail={o.detail}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Result ─────────────────────────────── */}
        <div style={{
          background: "var(--glass-bg-strong)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--glass-radius)",
          padding: "clamp(24px, 3.5vw, 40px)",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          boxShadow: "var(--glass-shadow)",
          minHeight: "100%",
        }}>
          {/* Specular top-edge rim — liquid highlight matching the shared Card. */}
          <span aria-hidden="true" style={{
            position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
            background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
            pointerEvents: "none",
          }} />
          <span aria-hidden="true" style={{
            position: "absolute", top: "-50px", right: "-50px",
            fontSize: "220px", color: v("accent"), opacity: 0.06,
            lineHeight: 1, pointerEvents: "none",
          }}>{"◆"}</span>

          {!hasPicks ? (
            <div style={{ position: "relative" }}>
              <Eyebrow style={{ marginBottom: SPACE.md }}>Your estimate</Eyebrow>
              <p style={{
                fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
                fontSize: "19px", lineHeight: 1.5, color: v("text-muted"),
              }}>
                Pick at least one thing you want running and your estimate appears here.
              </p>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <Eyebrow style={{ marginBottom: SPACE.sm }}>{result.sz.pkg}</Eyebrow>
              <div style={{
                fontSize: "12px", color: v("text-dim"), letterSpacing: "1.5px",
                textTransform: "uppercase", fontWeight: 700, marginBottom: SPACE.md,
              }}>
                {isLarger
                  ? "Custom build, typically from"
                  : result.owned
                    ? "One-time build, owned outright"
                    : "One-time build, managed"}
              </div>
              <div style={{
                fontFamily: "var(--font-body)", fontWeight: 800,
                fontSize: "clamp(34px, 5vw, 48px)", lineHeight: 1.05, letterSpacing: "-1.5px",
                background: C.gradientAccent, WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", backgroundClip: "text",
                paddingBottom: "0.08em", fontFeatureSettings: '"tnum" 1',
              }}>
                {isLarger ? `${fmt$(result.low)}+` : `${fmt$(result.low)}–${fmt$(result.high)}`}
              </div>

              <div style={{ height: "1px", background: v("divider"), margin: `${SPACE.lg} 0` }} />

              <div style={{
                fontSize: "12px", color: v("text-dim"), letterSpacing: "1.5px",
                textTransform: "uppercase", fontWeight: 700, marginBottom: "6px",
              }}>
                {result.owned ? "+ Monthly" : "+ Managed AI"}
              </div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: v("text"), letterSpacing: "-0.5px", fontFeatureSettings: '"tnum" 1' }}>
                {result.owned ? "$0" : result.managed > 0 ? `${fmt$(result.managed)}/mo` : "Optional"}
              </div>
              <p style={{ fontSize: "12px", color: v("text-dim"), lineHeight: 1.5, marginTop: "6px" }}>
                {result.owned
                  ? "Owned outright. Source code, credentials, and a runbook at handoff, with docs and a live training session baked into the setup price. Nothing recurring."
                  : result.managed > 0
                    ? "Keeps your AI current. Re-indexing, prompt + model upkeep, monitoring, a monthly report. Cancel anytime."
                    : "We host + maintain your site and make changes on request. Managed Website from $49/mo, set on your fit call."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: SPACE.lg }}>
                <Link to="/book" style={{ textDecoration: "none" }}>
                  <Button as="span" variant="primary" fullWidth iconRight={<ArrowRightIcon size={14} />}>
                    Book a fit call
                  </Button>
                </Link>
                <Link to="/contact?ref=estimator" style={{ textDecoration: "none" }}>
                  <Button as="span" variant="secondary" fullWidth>
                    Get a written proposal
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{
        fontSize: "13px", color: v("text-dim"), lineHeight: 1.65,
        textAlign: "center", maxWidth: "660px", margin: `${SPACE.lg} auto 0`,
      }}>
        <strong style={{ color: v("text-muted"), fontWeight: 700 }}>This is an estimate, not a quote.</strong>{" "}
        Real scope depends on your content, catalog, and the systems you already run. You get an exact, fixed price in a free 48-hour proposal after your fit call. Managed starts lower and carries a monthly you can cancel anytime ($49/mo for a site, $73/mo per AI tier). Owned carries a higher one-time price and nothing recurring. The full handoff (source code, credentials, runbook, live training) is in the number.
      </p>

      <style>{`
        @media (max-width: 860px) {
          .estimator-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
