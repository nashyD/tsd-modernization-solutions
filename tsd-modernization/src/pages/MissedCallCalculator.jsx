import { Link } from "react-router-dom";
import { C, v, useFadeIn, RippleButton, DiamondDivider } from "../shared";
import { ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import MissedCallCalculatorWidget from "../components/MissedCallCalculatorWidget";

/* Standalone Missed Call Calculator page. Wraps the reusable widget
   (also embedded inside /pricing) with page-specific chrome — masthead,
   hero, closing CTA. The widget owns the form + report + math. */

function CalculatorMasthead() {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{
      ...fade,
      display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
      fontSize: "10px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
      color: v("text-muted"), marginBottom: "32px", flexWrap: "wrap",
    }}>
      <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
      <span>Free Tool</span>
      <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
      <span>Charlotte Trades</span>
      <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
      <span>Summer MMXXVI</span>
      <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
    </div>
  );
}

function Hero() {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  return (
    <section style={{
      padding: "60px 24px 40px", maxWidth: "820px", margin: "0 auto",
      textAlign: "center",
    }}>
      <CalculatorMasthead />

      <h1 ref={r1} style={{
        ...f1, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(32px, 5.2vw, 52px)", letterSpacing: "-1.5px", lineHeight: 1.1,
        color: v("text"), marginBottom: "20px",
      }}>
        How much are missed calls costing you?
        <br />
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          background: C.gradientAccent, WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>Four questions. Real number.</span>
      </h1>

      <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

      <p ref={r2} style={{
        ...f2, fontSize: "17px", lineHeight: 1.7, color: v("text-muted"),
        maxWidth: "580px", margin: "0 auto",
      }}>
        Built for Charlotte HVAC, electricians, and plumbers. No signup, no email gate. Answer four questions and get an honest estimate of what your phone is leaving on the table every month.
      </p>
    </section>
  );
}

function ClosingCTA() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: "40px 24px 100px", textAlign: "center",
      maxWidth: "640px", margin: "0 auto",
    }}>
      <DiamondDivider width={120} style={{ marginBottom: "24px" }} />
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "18px", lineHeight: 1.5, color: v("text-muted"), marginBottom: "24px",
      }}>
        Ten setup spots. Last start: <span style={{ color: v("accent") }}>July 13</span>. After August 31, the agent is yours.
      </p>
      <Link to="/ai-receptionist">
        <RippleButton variant="ghost" style={{ padding: "14px 32px", fontSize: "15px" }}>
          See the full Receptionist offer <ArrowRightIcon size={16} />
        </RippleButton>
      </Link>
    </section>
  );
}

export default function MissedCallCalculator() {
  return (
    <PageShell>
      <Hero />
      <MissedCallCalculatorWidget />
      <ClosingCTA />
    </PageShell>
  );
}
