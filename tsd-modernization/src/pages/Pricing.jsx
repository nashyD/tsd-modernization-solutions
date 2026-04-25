import { Link } from "react-router-dom";
import { C, v, useFadeIn, SectionHeader, Card, RippleButton } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

/* Editorial masthead — pairs with the Home/Team mastheads. Frames the page
   so every dollar amount below sits inside the cohort scarcity context. */
function CohortMasthead() {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{
      ...fade,
      display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
      fontSize: "10px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
      color: v("text-muted"), marginBottom: "40px", flexWrap: "wrap",
    }}>
      <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
      <span>Founding Cohort</span>
      <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
      <span>Ten Spots</span>
      <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
      <span>Summer MMXXVI</span>
      <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
    </div>
  );
}

/* Risk-reversal pull-quote — surfaces the money-back guarantee that was
   previously buried on the homepage hero only. */
function GuaranteeBlock() {
  const [ref, fade] = useFadeIn(120);
  return (
    <div ref={ref} style={{
      ...fade,
      maxWidth: "820px", margin: "0 auto 64px",
      padding: "36px 40px",
      borderTop: `1px solid ${v("divider")}`,
      borderBottom: `1px solid ${v("divider")}`,
      display: "flex", gap: "32px", alignItems: "center",
    }} className="guarantee-block">
      <div style={{
        fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "84px",
        lineHeight: 1.1, flexShrink: 0,
        paddingBottom: "4px",
        background: C.gradientAccent, WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{"§"}</div>
      <div>
        <div style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), marginBottom: "10px",
        }}>Risk Reversal</div>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "20px", lineHeight: 1.5, color: v("text"),
        }}>
          You sign the scope. We deliver. If we missed the mark by handoff,
          every dollar comes back inside a week.
        </p>
      </div>
    </div>
  );
}

/* Tier card. Bundle gets featured treatment + anchor price (small struck-
   through standard above the prominent founding number). */
function TierCard({ tier, delay }) {
  const featured = tier.featured;
  return (
    <Card delay={delay} style={{
      border: featured ? `2px solid ${C.carolina}` : undefined,
      position: "relative",
      padding: featured ? "44px 36px 36px" : "36px",
    }}>
      <div style={{
        position: "absolute", top: "-12px", left: "24px",
        padding: "4px 12px", borderRadius: "100px",
        fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
        background: featured ? C.gradientPrism : v("bg"),
        color: featured ? "#fff" : v("text-muted"),
        border: featured ? "none" : `1px solid ${v("divider")}`,
      }}>{tier.phase}</div>

      {featured && (
        <div style={{
          position: "absolute", top: "-12px", right: "24px",
          padding: "4px 12px", borderRadius: "100px",
          fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
          background: v("bg"), color: v("accent"),
          border: `1px solid ${v("accent")}`,
        }}>Most Popular</div>
      )}

      <div style={{ textAlign: "center", marginBottom: "28px", marginTop: "8px" }}>
        <div style={{
          fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
          color: v("accent"), marginBottom: "16px",
        }}>{tier.label}</div>

        {tier.anchor ? (
          <>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
              fontSize: "20px", color: v("text-dim"), lineHeight: 1,
              textDecoration: "line-through", textDecorationColor: v("text-dim"),
              textDecorationThickness: "1px",
              marginBottom: "8px",
            }}>{tier.anchor}</div>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              fontSize: "60px", letterSpacing: "-1px", lineHeight: 1,
              background: C.gradientAccent, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: "10px",
            }}>{tier.price}</div>
            <div style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
              color: v("accent"),
            }}>{tier.range}</div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "44px",
              color: v("text"), letterSpacing: "-1px", marginBottom: "6px", lineHeight: 1,
            }}>{tier.price}</div>
            <div style={{ fontSize: "13px", color: v("text-dim") }}>{tier.range}</div>
          </>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: tier.bonus ? "20px" : "32px" }}>
        {tier.features.map((f, j) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <CheckIcon size={16} style={{ color: C.success, flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "14px", color: v("text-muted"), lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      {tier.bonus && (
        <div style={{
          padding: "14px 16px", borderRadius: "10px",
          background: "rgba(75,156,211,0.08)",
          border: `1px dashed ${C.carolina}`,
          marginBottom: "24px",
        }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("accent"), marginBottom: "6px",
          }}>{"◆ Bonus"}</div>
          <p style={{ fontSize: "13px", color: v("text"), lineHeight: 1.5 }}>{tier.bonus}</p>
        </div>
      )}

      <Link to="/contact">
        <RippleButton variant={featured ? "primary" : "ghost"} style={{ width: "100%", padding: "14px 0" }}>
          {tier.btn}
        </RippleButton>
      </Link>
    </Card>
  );
}

/* Closing footnote — operational truth of a time-bounded business.
   A buyer signing in late July needs to know the season ends. */
function ClosingNote() {
  const [ref, fade] = useFadeIn(240);
  return (
    <div ref={ref} style={{
      ...fade,
      marginTop: "72px", textAlign: "center",
      maxWidth: "640px", margin: "72px auto 0",
      padding: "0 24px",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "12px", justifyContent: "center",
        marginBottom: "18px",
      }}>
        <span style={{ flex: "0 0 32px", height: "1px", background: v("divider") }} />
        <span style={{ color: v("accent"), fontSize: "8px" }}>{"◆"}</span>
        <span style={{ flex: "0 0 32px", height: "1px", background: v("divider") }} />
      </div>
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "16px", lineHeight: 1.65, color: v("text-muted"),
      }}>
        Last project start: <span style={{ color: v("text") }}>July 13</span>. We deliver
        to handoff, then the season closes.
      </p>
    </div>
  );
}

const TIERS = [
  {
    phase: "Phase I",
    label: "Discovery",
    price: "$250",
    range: "One-time engagement",
    features: [
      "2-3 hour structured tech audit",
      "Written modernization roadmap",
      "Tool & platform recommendations",
      "Priority areas identified",
      "No obligation to continue",
    ],
    btn: "Book Tech Audit",
  },
  {
    phase: "Phase II",
    label: "Website + AI Bundle",
    price: "$2,000",
    anchor: "$4,000",
    range: "Founding rate · 10 spots",
    features: [
      "Custom responsive website",
      "AI chatbot or workflow automation",
      "On-page SEO + analytics wiring",
      "Written + video documentation",
      "Founder on call for fixes through August 31, 2026",
      "Full source code ownership",
    ],
    bonus: "AI receptionist setup ($497 value) included with the bundle.",
    btn: "Claim Founding Spot",
    featured: true,
  },
];

function WedgePointer() {
  return (
    <div style={{
      maxWidth: "640px", margin: "32px auto 0", padding: "0 24px",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "13px", color: v("text-dim"), lineHeight: 1.6 }}>
        Looking for the smaller wedge? See the{" "}
        <Link to="/ai-receptionist" style={{
          color: v("accent"), textDecoration: "underline", fontWeight: 600,
        }}>
          AI receptionist setup, $497
        </Link>
        {" "}— built for HVAC and trades.
      </p>
    </div>
  );
}

export default function Pricing() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <CohortMasthead />
        <SectionHeader
          center
          label="The Contract"
          title="Two ways to"
          titleAccent="start."
          sub="Two engagements. Single prices, scope spelled out before you sign."
        />
        <GuaranteeBlock />
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "32px",
          alignItems: "start",
        }} className="pricing-grid">
          {TIERS.map((t, i) => (
            <TierCard key={i} tier={t} delay={i * 120} />
          ))}
        </div>
        <ClosingNote />
        <WedgePointer />
      </div>
      <style>{`
        @media (max-width: 820px) {
          .pricing-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .guarantee-block { flex-direction: column !important; gap: 16px !important; text-align: center; padding: 32px 24px !important; }
        }
      `}</style>
    </PageShell>
  );
}
