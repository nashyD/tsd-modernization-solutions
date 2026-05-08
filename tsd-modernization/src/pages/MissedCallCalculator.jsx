import { Link } from "react-router-dom";
import {
  v, useFadeIn,
  Button, DiamondDivider,
  EditorialMasthead, GradientText,
  SPACE,
} from "../shared";
import { ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import MissedCallCalculatorWidget from "../components/MissedCallCalculatorWidget";

function CalculatorMasthead() {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{ ...fade, marginBottom: SPACE.xl }}>
      <EditorialMasthead items={["Free Tool", "Charlotte Trades", "Summer 2026"]} />
    </div>
  );
}

function Hero() {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  return (
    <section style={{
      padding: `${SPACE["3xl"]} 24px ${SPACE["2xl"]}`,
      maxWidth: "860px", margin: "0 auto",
      textAlign: "center",
    }}>
      <CalculatorMasthead />

      <h1 ref={r1} style={{
        ...f1, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(34px, 5.4vw, 56px)",
        letterSpacing: "-2px", lineHeight: 1.08,
        color: v("text"), marginBottom: SPACE.lg,
      }}>
        How much are missed calls costing you?
        <br />
        <GradientText>Four questions. Real number.</GradientText>
      </h1>

      <DiamondDivider width={180} style={{ marginBottom: SPACE.lg }} />

      <p ref={r2} style={{
        ...f2, fontSize: "17px", lineHeight: 1.65, color: v("text-muted"),
        maxWidth: "600px", margin: "0 auto",
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
      ...fade,
      padding: `${SPACE["2xl"]} 24px ${SPACE["4xl"]}`,
      textAlign: "center",
      maxWidth: "640px", margin: "0 auto",
    }}>
      <DiamondDivider width={120} style={{ marginBottom: SPACE.lg }} />
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "19px", lineHeight: 1.5, color: v("text-muted"),
        marginBottom: SPACE.lg,
      }}>
        Ten spots. Last start: <span style={{ color: v("accent") }}>July 13</span>. After August 31, the agent is yours.
      </p>
      <Link to="/ai-receptionist" style={{ textDecoration: "none" }}>
        <Button as="span" variant="ghost" iconRight={<ArrowRightIcon size={14} />}>
          See the full Receptionist offer
        </Button>
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
