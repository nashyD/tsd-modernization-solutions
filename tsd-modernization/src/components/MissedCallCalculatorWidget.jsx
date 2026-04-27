import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { C, v, useFadeIn, RippleButton } from "../shared";
import { ArrowRightIcon, CheckIcon } from "../icons";

/* Self-contained Missed Call Calculator widget. Two consumers:

     1. /missed-call-calculator — the standalone page wraps this with a
        Hero, masthead, and ClosingCTA so it has SERP / sharing value.
     2. /pricing — embeds this between the wedge pointer and the FAQ so a
        buyer comparing tiers can size the loss the AI Receptionist solves.

   The widget owns its own input state. Both consumers get the same form
   + report behavior; the wrapping page chrome differs. The Report fades
   in below the form when an input snapshot exists, recomputes via useMemo
   when inputs change, and the submit button becomes "Recalculate". */

/* Per-trade after-hours call density (calls per off-hour). Stage-zero
   conservative estimates tunable in one constant when real cohort data
   lands. Peak summer + storm weeks can push these 2-3x; off-peak runs
   lower. Honest defaults outperform inflated ones — a calculator that
   says $3M/year for a $1.5M shop fails the credibility test before the
   buyer reads the CTA. */
const TRADE_CALL_DENSITY = {
  hvac: 0.10,
  electrical: 0.04,
  plumbing: 0.08,
};

const TRADE_LABELS = {
  hvac: "HVAC",
  electrical: "Electrical",
  plumbing: "Plumbing",
};

/* Industry benchmark per the v2 checklist: of voicemails left during
   unanswered hours, ~85% of callers never call back — they dial the
   next listing. The remaining 15% are a callback opportunity (still at
   risk, but at least surfaced). The calculator counts only the 85%. */
const NO_CALLBACK_RATE = 0.85;

/* Currency formatter — $1,234, no cents. */
const fmt$ = (n) => "$" + Math.round(n).toLocaleString();

function CalculatorForm({ onCompute, hasReport }) {
  const [trade, setTrade] = useState("hvac");
  const [unansweredHours, setUnansweredHours] = useState("");
  const [ticketSize, setTicketSize] = useState("");
  const [jobsPerWeek, setJobsPerWeek] = useState("");

  const valid = unansweredHours && ticketSize && jobsPerWeek
    && Number(unansweredHours) > 0
    && Number(ticketSize) > 0
    && Number(jobsPerWeek) > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onCompute({
      trade,
      unansweredHours: Number(unansweredHours),
      ticketSize: Number(ticketSize),
      jobsPerWeek: Number(jobsPerWeek),
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px", borderRadius: "12px",
    border: `1px solid ${v("surface-border")}`,
    background: v("surface"), color: v("text"),
    fontSize: "16px", fontFamily: "var(--font-body)",
    transition: "border-color 0.2s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
    color: v("accent"), marginBottom: "8px",
  };

  const hintStyle = {
    fontSize: "12px", color: v("text-dim"),
    marginTop: "6px", lineHeight: 1.5,
  };

  return (
    <section style={{ padding: "20px 24px 40px", maxWidth: "780px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{
        background: v("surface"),
        border: `1px solid ${v("surface-border")}`,
        borderRadius: "20px",
        padding: "clamp(28px, 4vw, 44px)",
        display: "flex", flexDirection: "column", gap: "24px",
      }}>
        <div>
          <label htmlFor="trade" style={labelStyle}>Your trade</label>
          <select
            id="trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            style={inputStyle}
          >
            <option value="hvac">HVAC</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
          </select>
        </div>

        <div>
          <label htmlFor="unanswered" style={labelStyle}>Unanswered hours per week</label>
          <input
            id="unanswered"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 80"
            value={unansweredHours}
            onChange={(e) => setUnansweredHours(e.target.value)}
            style={inputStyle}
          />
          <p style={hintStyle}>
            Total hours per week your phone goes to voicemail. A typical 9-5, weekday-only operation has ~128 unanswered hours per week (nights, weekends).
          </p>
        </div>

        <div>
          <label htmlFor="ticket" style={labelStyle}>Average ticket size ($)</label>
          <input
            id="ticket"
            type="number"
            min="0"
            step="50"
            inputMode="numeric"
            placeholder="e.g. 850"
            value={ticketSize}
            onChange={(e) => setTicketSize(e.target.value)}
            style={inputStyle}
          />
          <p style={hintStyle}>
            What an average emergency call books for. HVAC averages $700–$1,000; electrical and plumbing vary by job type.
          </p>
        </div>

        <div>
          <label htmlFor="jobs" style={labelStyle}>Average jobs per week</label>
          <input
            id="jobs"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 25"
            value={jobsPerWeek}
            onChange={(e) => setJobsPerWeek(e.target.value)}
            style={inputStyle}
          />
          <p style={hintStyle}>
            How many jobs your team books in a typical week (for context — we report your missed calls separately).
          </p>
        </div>

        <RippleButton
          type="submit"
          disabled={!valid}
          style={{
            width: "100%", padding: "16px 0", fontSize: "15px",
            opacity: valid ? 1 : 0.5,
            cursor: valid ? "pointer" : "not-allowed",
          }}
        >
          {hasReport ? "Recalculate" : "Calculate my missed-call cost"} <ArrowRightIcon size={16} />
        </RippleButton>
      </form>
    </section>
  );
}

function Report({ inputs }) {
  const numbers = useMemo(() => {
    const density = TRADE_CALL_DENSITY[inputs.trade];
    const callsDuringUnansweredHours = inputs.unansweredHours * density;
    const lostCallsPerWeek = callsDuringUnansweredHours * NO_CALLBACK_RATE;
    const lostRevenuePerMonth = lostCallsPerWeek * inputs.ticketSize * 4.33;
    const lostRevenuePerYear = lostRevenuePerMonth * 12;
    const lostJobsPerYear = lostCallsPerWeek * 52;
    return {
      lostCallsPerWeek,
      lostRevenuePerMonth,
      lostRevenuePerYear,
      lostJobsPerYear,
    };
  }, [inputs]);

  const [ref, fade] = useFadeIn(0);
  const tradeLabel = TRADE_LABELS[inputs.trade];

  return (
    <section ref={ref} style={{
      ...fade, padding: "40px 24px 60px",
      maxWidth: "920px", margin: "0 auto",
    }} className="report-section">
      <div style={{
        display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), display: "inline-flex", alignItems: "center", gap: "8px",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: "8px" }}>{"◆"}</span> Your Estimate
        </span>
        <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
        <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px", whiteSpace: "nowrap" }}>{tradeLabel}</span>
      </div>

      <div style={{
        background: v("surface"),
        border: `1px solid ${v("surface-border")}`,
        borderRadius: "20px",
        padding: "clamp(28px, 4vw, 44px)",
        marginBottom: "24px",
      }}>
        {/* Hero number — annual revenue at risk */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("accent"), marginBottom: "16px",
          }}>Annual revenue at risk</div>
          <div style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 1, letterSpacing: "-2px",
            background: C.gradientAccent, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: "12px",
          }}>{fmt$(numbers.lostRevenuePerYear)}</div>
          <p style={{ fontSize: "14px", color: v("text-muted"), maxWidth: "520px", margin: "0 auto", lineHeight: 1.55 }}>
            Estimated value of jobs going to whoever picks up next when your phone is on voicemail.
          </p>
        </div>

        <div style={{ height: "1px", background: v("divider"), margin: "0 0 28px" }} />

        {/* Supporting numbers grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }} className="report-grid">
          <ReportStat
            label="Missed calls / week"
            value={Math.round(numbers.lostCallsPerWeek).toLocaleString()}
            note={`${TRADE_LABELS[inputs.trade]} after-hours benchmark × no-callback rate`}
          />
          <ReportStat
            label="Lost revenue / month"
            value={fmt$(numbers.lostRevenuePerMonth)}
            note={`Missed calls × $${inputs.ticketSize.toLocaleString()} avg ticket × 4.33 weeks`}
          />
          <ReportStat
            label="Lost jobs / year"
            value={Math.round(numbers.lostJobsPerYear).toLocaleString()}
            note="Jobs your phone is sending to a competitor"
          />
        </div>
      </div>

      {/* What TSD would do here */}
      <div style={{
        background: "rgba(75,156,211,0.06)",
        border: `1px solid ${C.carolina}`,
        borderRadius: "20px",
        padding: "clamp(28px, 4vw, 40px)",
        marginBottom: "32px",
      }}>
        <div style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
          color: v("accent"), marginBottom: "14px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "8px" }}>{"◆"}</span> What TSD would do here
        </div>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: v("text"), marginBottom: "20px",
        }}>
          Your AI receptionist takes the call, qualifies the emergency, books the slot from your calendar, and texts you a one-paragraph summary. Setup runs $497 once and $97/month through August 31. After that, the agent transfers to you — credentials, call log, the whole stack. No subscription forever.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {[
            "Setup in a week — your AI is live before next weekend",
            "Risk reversal: zero bookings in 30 days, every dollar back",
            "August 31 ownership transfer — no monthly bill in year two",
          ].map((bullet, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckIcon size={16} style={{ color: C.success, flexShrink: 0, marginTop: "3px" }} />
              <span style={{ fontSize: "14px", color: v("text"), lineHeight: 1.55 }}>{bullet}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link to="/contact?ref=calculator">
            <RippleButton variant="primary" style={{ padding: "14px 28px", fontSize: "15px" }}>
              Reserve a setup spot <ArrowRightIcon size={16} />
            </RippleButton>
          </Link>
          <Link to="/ai-receptionist">
            <RippleButton variant="ghost" style={{ padding: "14px 28px", fontSize: "15px" }}>
              See the full spec
            </RippleButton>
          </Link>
        </div>
      </div>

      {/* Method footnote — keeps the estimate honest */}
      <p style={{
        fontSize: "12px", color: v("text-dim"), lineHeight: 1.6,
        textAlign: "center", maxWidth: "640px", margin: "0 auto",
      }}>
        <strong style={{ color: v("text-muted") }}>How we calculated this:</strong>{" "}
        Estimated calls during your unanswered hours use a {TRADE_LABELS[inputs.trade].toLowerCase()} after-hours call-density benchmark. We assume 85% of callers who reach voicemail never call back (industry average for service trades). Your real numbers will vary by season, geography, and ad spend — this is a directional estimate, not a quote.
      </p>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "12px", color: v("accent"), fontWeight: 600,
            letterSpacing: "1px", textTransform: "uppercase",
            padding: "8px 16px",
          }}
          className="print-button"
        >
          Print or save as PDF
        </button>
      </div>
    </section>
  );
}

function ReportStat({ label, value, note }) {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "14px",
      background: v("bg-alt"),
      border: `1px solid ${v("divider")}`,
    }}>
      <div style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
        color: v("text-dim"), marginBottom: "10px",
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
        fontSize: "32px", lineHeight: 1, letterSpacing: "-0.5px",
        color: v("text"), marginBottom: "10px",
      }}>{value}</div>
      <div style={{ fontSize: "12px", color: v("text-muted"), lineHeight: 1.5 }}>
        {note}
      </div>
    </div>
  );
}

export default function MissedCallCalculatorWidget() {
  const [inputs, setInputs] = useState(null);
  return (
    <>
      <CalculatorForm onCompute={setInputs} hasReport={!!inputs} />
      {inputs && <Report inputs={inputs} />}
      <style>{`
        @media (max-width: 720px) {
          .report-grid { grid-template-columns: 1fr !important; }
        }
        @media print {
          nav, footer, .print-button, button[type="submit"], form { display: none !important; }
          .report-section { padding: 0 !important; }
          body { background: #fff !important; }
        }
      `}</style>
    </>
  );
}
