import { Link } from "react-router-dom";
import { C, v, SectionHeader, Card, RippleButton } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

const TIERS = [
  {
    label: "Discovery",
    price: "$150 - $250",
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
    label: "Website + AI Bundle",
    price: "$1,000 - $1,800",
    range: "Our most popular package",
    features: [
      "Custom responsive website",
      "AI chatbot or automation integration",
      "SEO optimization & analytics",
      "Written & video documentation",
      "2 weeks post-launch support",
      "Source code ownership",
    ],
    btn: "Start Your Project",
    featured: true,
  },
  {
    label: "Monthly Retainer",
    price: "$200 - $500",
    range: "Per month, ongoing",
    features: [
      "Ongoing site updates & maintenance",
      "New automation workflows",
      "Priority support & troubleshooting",
      "Monthly performance reports",
      "Cancel anytime",
    ],
    btn: "Learn More",
  },
];

export default function Pricing() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Pricing" title="Transparent" titleAccent="pricing"
          sub="No hidden fees, no scope creep. Here's what each engagement looks like." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
          {TIERS.map((t, i) => (
            <Card key={i} delay={i * 120} style={{
              border: t.featured ? `2px solid ${C.carolina}` : undefined,
              position: "relative",
            }}>
              {t.featured && (
                <div style={{
                  position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                  padding: "4px 16px", borderRadius: "100px", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase",
                  background: C.gradientPrism, color: "#fff",
                }}>Most Popular</div>
              )}
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{
                  fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                  color: v("accent"), marginBottom: "12px",
                }}>{t.label}</div>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "36px",
                  color: v("text"), letterSpacing: "-1px", marginBottom: "4px",
                }}>{t.price}</div>
                <div style={{ fontSize: "13px", color: v("text-dim") }}>{t.range}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckIcon size={16} style={{ color: C.success, flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "14px", color: v("text-muted"), lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact">
                <RippleButton variant={t.featured ? "primary" : "ghost"} style={{ width: "100%", padding: "14px 0" }}>
                  {t.btn}
                </RippleButton>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
