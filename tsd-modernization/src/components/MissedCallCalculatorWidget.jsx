import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  Button,
  Eyebrow, ChapterRule,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { ArrowRightIcon, CheckIcon } from "../icons";

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

const NO_CALLBACK_RATE = 0.85;

const fmt$ = (n) => "$" + Math.round(n).toLocaleString();

const inputStyle = {
  width: "100%",
  padding: "14px 18px", borderRadius: RADIUS.md,
  border: `1px solid ${v("surface-border")}`,
  background: v("bg-alt"),
  color: v("text"),
  fontSize: "16px", fontFamily: "var(--font-body)",
  transition: "border-color 0.2s ease, background 0.2s ease",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
  color: v("accent"), marginBottom: "10px",
};

const hintStyle = {
  fontSize: "12px", color: v("text-dim"),
  marginTop: "6px", lineHeight: 1.55,
};

function NumericField({
  id, label, value, onChange,
  min, max, step,
  placeholder, hint,
  formatBound,
}) {
  const numeric = Number(value);
  const sliderValue = (value === "" || Number.isNaN(numeric))
    ? min
    : Math.max(min, Math.min(max, numeric));
  const pct = max > min ? ((sliderValue - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id}
        type="number"
        min={min}
        step={step}
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => { e.target.style.borderColor = C.carolina; e.target.style.background = v("surface"); }}
        onBlur={(e) => { e.target.style.borderColor = v("surface-border"); e.target.style.background = v("bg-alt"); }}
        style={inputStyle}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} — slider`}
        className="tsd-slider"
        style={{ "--slider-pct": pct + "%", marginTop: "16px" }}
      />
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
        color: v("text-dim"), marginTop: "8px", padding: "0 2px",
        fontFeatureSettings: '"tnum" 1',
      }}>
        <span>{formatBound ? formatBound(min) : min.toLocaleString()}</span>
        <span>{formatBound ? formatBound(max) : max.toLocaleString()}</span>
      </div>
      <p style={hintStyle}>{hint}</p>
    </div>
  );
}

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

  return (
    <section style={{ padding: `${SPACE.lg} 24px ${SPACE.xl}`, maxWidth: "820px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{
        background: `linear-gradient(180deg, ${v("surface")} 0%, ${v("bg-alt")} 100%)`,
        border: `1px solid ${v("surface-border")}`,
        borderRadius: RADIUS["2xl"],
        padding: "clamp(28px, 4vw, 48px)",
        display: "flex", flexDirection: "column", gap: SPACE.lg,
        boxShadow: SHADOW.md,
        position: "relative",
      }}>
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(75,156,211,0.4), transparent)",
          pointerEvents: "none",
        }} />

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

        <NumericField
          id="unanswered"
          label="Unanswered hours per week"
          value={unansweredHours}
          onChange={setUnansweredHours}
          min={0} max={168} step={1}
          placeholder="e.g. 80"
          formatBound={(n) => `${n} hrs`}
          hint="Total hours per week your phone goes to voicemail. A typical 9-5, weekday-only operation has ~128 unanswered hours per week (nights, weekends)."
        />

        <NumericField
          id="ticket"
          label="Average ticket size ($)"
          value={ticketSize}
          onChange={setTicketSize}
          min={0} max={5000} step={50}
          placeholder="e.g. 850"
          formatBound={(n) => `$${n.toLocaleString()}`}
          hint="What an average emergency call books for. HVAC averages $700–$1,000; electrical and plumbing vary by job type."
        />

        <NumericField
          id="jobs"
          label="Average jobs per week"
          value={jobsPerWeek}
          onChange={setJobsPerWeek}
          min={0} max={100} step={1}
          placeholder="e.g. 25"
          formatBound={(n) => `${n} / wk`}
          hint="How many jobs your team books in a typical week (for context — we report your missed calls separately)."
        />

        <Button
          type="submit"
          disabled={!valid}
          variant="primary"
          size="lg"
          fullWidth
          iconRight={<ArrowRightIcon size={16} />}
        >
          {hasReport ? "Recalculate" : "Calculate my missed-call cost"}
        </Button>
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
      ...fade, padding: `${SPACE.xl} 24px ${SPACE["3xl"]}`,
      maxWidth: "960px", margin: "0 auto",
    }} className="report-section">
      <ChapterRule label="Your Estimate" num={tradeLabel} style={{ marginBottom: SPACE.xl }} />

      <div style={{
        background: `linear-gradient(160deg, ${v("surface")} 0%, ${v("bg-alt")} 100%)`,
        border: `1px solid ${v("surface-border")}`,
        borderRadius: RADIUS["2xl"],
        padding: "clamp(32px, 4vw, 56px)",
        marginBottom: SPACE.lg,
        boxShadow: SHADOW.md,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decorative diamond */}
        <span aria-hidden="true" style={{
          position: "absolute", top: "-50px", right: "-50px",
          fontSize: "260px", color: v("accent"), opacity: 0.05,
          lineHeight: 1, pointerEvents: "none",
        }}>{"◆"}</span>

        <div style={{ textAlign: "center", marginBottom: SPACE.xl, position: "relative" }}>
          <Eyebrow style={{ marginBottom: SPACE.md }}>Annual revenue at risk</Eyebrow>
          <div style={{
            fontFamily: "var(--font-body)", fontWeight: 800,
            fontSize: "clamp(64px, 11vw, 112px)",
            lineHeight: 1.1, letterSpacing: "-3px",
            background: C.gradientAccent, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: SPACE.md,
            paddingBottom: "0.08em",
            fontFeatureSettings: '"tnum" 1',
          }}>{fmt$(numbers.lostRevenuePerYear)}</div>
          <p style={{
            fontSize: "14px", color: v("text-muted"),
            maxWidth: "540px", margin: "0 auto", lineHeight: 1.55,
          }}>
            Estimated value of jobs going to whoever picks up next when your phone is on voicemail.
          </p>
        </div>

        <div style={{ height: "1px", background: v("divider"), margin: `0 0 ${SPACE.xl}` }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: SPACE.md,
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

      <div style={{
        background: "linear-gradient(180deg, rgba(75,156,211,0.10) 0%, rgba(75,156,211,0.04) 100%)",
        border: "1px solid rgba(75,156,211,0.4)",
        borderRadius: RADIUS["2xl"],
        padding: "clamp(28px, 4vw, 44px)",
        marginBottom: SPACE.xl,
      }}>
        <Eyebrow style={{ marginBottom: SPACE.md }}>What TSD would do here</Eyebrow>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.55, color: v("text"),
          marginBottom: SPACE.lg,
          letterSpacing: "-0.2px",
        }}>
          Your AI receptionist takes the call, qualifies the emergency, books the slot from your calendar, and texts you a one-paragraph summary. Setup runs $497 once. On August 31, the agent transfers to you — credentials, call log, the whole stack. No subscription forever.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: SPACE.lg }}>
          {[
            "Setup in a week — your AI is live before next weekend",
            "Risk reversal: zero bookings in 30 days, every dollar back",
            "August 31 ownership transfer — agent and credentials are yours, no recurring fees",
          ].map((bullet, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{
                flexShrink: 0, marginTop: "2px",
                width: "18px", height: "18px", borderRadius: RADIUS.full,
                background: "rgba(6,214,160,0.16)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: C.success,
              }}>
                <CheckIcon size={12} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "14px", color: v("text"), lineHeight: 1.55 }}>{bullet}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/contact?ref=calculator" style={{ textDecoration: "none" }}>
            <Button as="span" variant="primary" iconRight={<ArrowRightIcon size={14} />}>
              Reserve a setup spot
            </Button>
          </Link>
          <Link to="/ai-receptionist" style={{ textDecoration: "none" }}>
            <Button as="span" variant="secondary">
              See the full spec
            </Button>
          </Link>
        </div>
      </div>

      <p style={{
        fontSize: "12px", color: v("text-dim"), lineHeight: 1.65,
        textAlign: "center", maxWidth: "660px", margin: "0 auto",
      }}>
        <strong style={{ color: v("text-muted"), fontWeight: 700 }}>How we calculated this:</strong>{" "}
        Estimated calls during your unanswered hours use a {TRADE_LABELS[inputs.trade].toLowerCase()} after-hours call-density benchmark. We assume 85% of callers who reach voicemail never call back (industry average for service trades). Your real numbers will vary by season, geography, and ad spend — this is a directional estimate, not a quote.
      </p>

      <div style={{ textAlign: "center", marginTop: SPACE.lg }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "11px", color: v("accent"), fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
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
      padding: SPACE.lg,
      borderRadius: RADIUS.lg,
      background: v("bg-alt"),
      border: `1px solid ${v("surface-border")}`,
    }}>
      <div style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
        color: v("text-dim"), marginBottom: SPACE.sm,
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "34px", lineHeight: 1, letterSpacing: "-0.8px",
        color: v("text"), marginBottom: SPACE.sm,
        fontFeatureSettings: '"tnum" 1',
      }}>{value}</div>
      <div style={{ fontSize: "12px", color: v("text-muted"), lineHeight: 1.55 }}>
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

        .tsd-slider {
          -webkit-appearance: none;
          appearance: none;
          display: block;
          width: 100%;
          height: 6px;
          border-radius: 100px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(to right,
            var(--c-accent) 0%,
            var(--c-accent) var(--slider-pct, 0%),
            var(--c-surface-border) var(--slider-pct, 0%),
            var(--c-surface-border) 100%);
        }
        .tsd-slider::-moz-range-track {
          background: var(--c-surface-border);
          height: 6px;
          border-radius: 100px;
          border: none;
        }
        .tsd-slider::-moz-range-progress {
          background: var(--c-accent);
          height: 6px;
          border-radius: 100px;
        }
        .tsd-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -8px;
          border-radius: 50%;
          background: var(--c-accent);
          border: 3px solid var(--c-bg);
          box-shadow: 0 2px 10px rgba(75,156,211,0.4);
          cursor: grab;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .tsd-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--c-accent);
          border: 3px solid var(--c-bg);
          box-shadow: 0 2px 10px rgba(75,156,211,0.4);
          cursor: grab;
        }
        .tsd-slider::-webkit-slider-thumb:hover {
          transform: scale(1.14);
          box-shadow: 0 6px 18px rgba(75,156,211,0.55);
        }
        .tsd-slider::-webkit-slider-thumb:active { cursor: grabbing; }
        .tsd-slider:focus-visible {
          outline: 2px solid var(--c-accent);
          outline-offset: 4px;
        }
      `}</style>
    </>
  );
}
