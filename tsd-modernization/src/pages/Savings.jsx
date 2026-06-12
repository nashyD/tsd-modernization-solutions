import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  SectionHeader, Button, Eyebrow,
  SPACE, RADIUS,
} from "../shared";
import { ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import BookCallButton from "../components/BookCallButton";
import { trackEvent } from "../analytics.js";

/* ── The leak calculator ────────────────────────────────────────────
   Four inputs an owner can answer without opening QuickBooks, three
   conservative assumptions printed right under the result. The math
   deliberately understates: winning 1 in 4 missed calls, only a
   quarter of software spend cuttable, owner time at $35/hr. Successor
   to the retired /missed-call-calculator (vercel.json 301s it here). */

const WIN_RATE = 0.25;        /* of currently-missed calls you'd win */
const CUTTABLE = 0.25;        /* of software spend an audit typically frees */
const OWNER_RATE = 35;        /* $/hr value on owner admin time */
const WEEKS_PER_MONTH = 4.33;

const fmt$ = (n) => "$" + Math.round(n).toLocaleString();

function LeakSlider({ label, min, max, step, value, onChange, format, eventName }) {
  return (
    <div style={{ marginBottom: SPACE.lg }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: "10px", gap: "16px",
      }}>
        <label style={{ fontSize: "14px", fontWeight: 600, color: v("text"), lineHeight: 1.4 }}>
          {label}
        </label>
        <span style={{
          fontSize: "16px", fontWeight: 800, color: v("accent-light"),
          whiteSpace: "nowrap", fontFeatureSettings: '"tnum" 1',
        }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={() => trackEvent("savings_calc_input", { field: eventName })}
        aria-label={label}
        style={{ width: "100%", accentColor: C.carolina, cursor: "pointer" }}
      />
    </div>
  );
}

function BreakdownRow({ label, value, first }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      gap: "16px", padding: "10px 0",
      borderTop: first ? "none" : `1px solid ${v("divider-soft")}`,
    }}>
      <span style={{ fontSize: "14px", color: v("text-muted"), lineHeight: 1.5 }}>{label}</span>
      <span style={{
        fontSize: "15px", fontWeight: 700, color: v("text"),
        whiteSpace: "nowrap", fontFeatureSettings: '"tnum" 1',
      }}>{value}</span>
    </div>
  );
}

function EmailBreakdown({ summary }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    trackEvent("savings_calc_email_submit");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: "Your savings breakdown — TSD Modernization Solutions",
          from_name: "TSD savings calculator",
          email,
          message: summary,
          botcheck: "",
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p style={{
        fontSize: "13px", color: v("text"), lineHeight: 1.6,
        padding: "12px 14px", borderRadius: RADIUS.md,
        background: "rgba(6,214,160,0.10)", border: `1px solid ${v("divider")}`,
        margin: 0,
      }}>
        Sent. Check your inbox — and when you're ready, the fit call is free.
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <label htmlFor="savings-email" className="sr-only">Email address</label>
      <input
        id="savings-email"
        type="email"
        required
        placeholder="you@yourbusiness.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: "1 1 200px", padding: "11px 14px",
          borderRadius: RADIUS.md, fontSize: "14px",
          background: v("bg-alt"), color: v("text"),
          border: `1px solid ${v("surface-border")}`,
          fontFamily: "var(--font-body)",
        }}
      />
      <Button type="submit" variant="secondary" size="sm" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Email me this breakdown"}
      </Button>
      {status === "error" && (
        <p style={{ fontSize: "12px", color: v("text-dim"), width: "100%", margin: "4px 0 0" }}>
          That didn't send — try again, or just book the free fit call below.
        </p>
      )}
    </form>
  );
}

export default function Savings() {
  const [ref, fade] = useFadeIn(0);
  const [missedCalls, setMissedCalls] = useState(5);
  const [avgTicket, setAvgTicket] = useState(250);
  const [swSpend, setSwSpend] = useState(400);
  const [ownerHrs, setOwnerHrs] = useState(6);

  const r = useMemo(() => {
    const calls = missedCalls * WEEKS_PER_MONTH * avgTicket * WIN_RATE;
    const soft = swSpend * CUTTABLE;
    const hrs = ownerHrs * WEEKS_PER_MONTH * OWNER_RATE;
    const monthly = calls + soft + hrs;
    return { calls, soft, hrs, monthly, annual: monthly * 12 };
  }, [missedCalls, avgTicket, swSpend, ownerHrs]);

  const summary = [
    "Your leak, estimated by the TSD savings calculator:",
    "",
    `Missed-call losses: ${fmt$(r.calls)}/mo (${missedCalls} missed calls a week at a ${fmt$(avgTicket)} ticket, winning 1 in 4)`,
    `Cuttable software spend: ${fmt$(r.soft)}/mo (a quarter of ${fmt$(swSpend)}/mo)`,
    `Owner hours on quotes + scheduling: ${fmt$(r.hrs)}/mo (${ownerHrs} hrs/wk at $${OWNER_RATE}/hr)`,
    "",
    `Total: ${fmt$(r.monthly)}/mo — about ${fmt$(r.annual)} a year.`,
    "",
    "Stop the leak: book a free fit call at https://tsd-modernization.com/book — fixed-price proposal in 48 hours, 100% money-back guarantee.",
  ].join("\n");

  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1140px", margin: "0 auto",
      }}>
        <SectionHeader center label="The Calculator" title="What you're" titleAccent="losing"
          sub="Four questions, sixty seconds, deliberately conservative math. The number at the end is monthly — brace for the annual one." />

        <section ref={ref} style={{ ...fade, maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: SPACE.xl,
            alignItems: "start",
          }} className="savings-grid">
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

              <Eyebrow style={{ marginBottom: SPACE.lg }}>Where it leaks</Eyebrow>

              <LeakSlider
                label="Missed or after-hours calls a week"
                min={0} max={20} step={1}
                value={missedCalls} onChange={setMissedCalls}
                format={(n) => `${n}`}
                eventName="missed_calls"
              />
              <LeakSlider
                label="Average job value"
                min={50} max={2000} step={25}
                value={avgTicket} onChange={setAvgTicket}
                format={fmt$}
                eventName="avg_ticket"
              />
              <LeakSlider
                label="Software + subscriptions a month"
                min={0} max={1500} step={10}
                value={swSpend} onChange={setSwSpend}
                format={fmt$}
                eventName="software_spend"
              />
              <LeakSlider
                label="Your hours on quotes + scheduling a week"
                min={0} max={20} step={1}
                value={ownerHrs} onChange={setOwnerHrs}
                format={(n) => `${n} hrs`}
                eventName="owner_hours"
              />

              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "13px", color: v("text-dim"), lineHeight: 1.6,
                margin: `${SPACE.md} 0 0`,
              }}>
                Assumes you'd win 1 in 4 of the calls you currently miss, that a quarter of software spend is cuttable, and your time at $35/hr. Real audits usually find more.
              </p>
            </div>

            {/* ── Result ─────────────────────────────── */}
            <div style={{
              background: "var(--glass-bg-strong)",
              backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
              WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
              border: "1px solid var(--glass-border-strong)",
              borderRadius: "var(--glass-radius)",
              padding: "clamp(24px, 3.5vw, 40px)",
              position: "relative",
              overflow: "hidden",
              isolation: "isolate",
              boxShadow: "var(--glass-shadow), 0 0 28px var(--glass-glow)",
            }}>
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

              <div style={{ position: "relative" }}>
                <Eyebrow style={{ marginBottom: SPACE.sm }}>Leaking every month</Eyebrow>
                <div style={{
                  fontFamily: "var(--font-body)", fontWeight: 800,
                  fontSize: "clamp(40px, 6vw, 56px)", lineHeight: 1.05, letterSpacing: "-1.5px",
                  background: C.gradientAccent, WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent", backgroundClip: "text",
                  paddingBottom: "0.08em", fontFeatureSettings: '"tnum" 1',
                }}>
                  {fmt$(r.monthly)}
                </div>
                <div style={{ fontSize: "14px", color: v("text-muted"), marginBottom: SPACE.lg }}>
                  ≈ <strong style={{ color: v("text"), fontWeight: 700 }}>{fmt$(r.annual)}</strong> a year
                </div>

                <BreakdownRow first label="Missed-call losses" value={`${fmt$(r.calls)}/mo`} />
                <BreakdownRow label="Cuttable software spend" value={`${fmt$(r.soft)}/mo`} />
                <BreakdownRow label={`Your hours at $${OWNER_RATE}/hr`} value={`${fmt$(r.hrs)}/mo`} />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: SPACE.lg }}>
                  <BookCallButton variant="primary" fullWidth refSource="savings-calc">
                    Book a free fit call
                  </BookCallButton>
                  <Link to="/services/cost-cut-audit" style={{ textDecoration: "none" }}
                    onClick={() => trackEvent("savings_calc_audit_click")}>
                    <Button as="span" variant="secondary" fullWidth>
                      Have us find it — guaranteed
                    </Button>
                  </Link>
                </div>

                <div style={{ height: "1px", background: v("divider"), margin: `${SPACE.lg} 0` }} />
                <EmailBreakdown summary={summary} />
              </div>
            </div>
          </div>

          <p style={{
            fontSize: "13px", color: v("text-dim"), lineHeight: 1.65,
            textAlign: "center", maxWidth: "660px", margin: `${SPACE.lg} auto 0`,
          }}>
            <strong style={{ color: v("text-muted"), fontWeight: 700 }}>This is an estimate built to understate.</strong>{" "}
            The fix is priced on the <Link to="/pricing" style={{ color: v("accent"), fontWeight: 600 }}>estimator</Link> and quoted fixed after a free fit call — and the cost-cut audit is free if it can't find its own fee in annual savings.
          </p>
        </section>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .savings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageShell>
  );
}
