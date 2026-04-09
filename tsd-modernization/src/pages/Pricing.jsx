import { useState } from "react";
import { Link } from "react-router-dom";
import { C, useFadeIn, SectionHeader, RippleButton } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

function PricingTier({ t, i }) {
  const [hover, setHover] = useState(false);
  const [ref, fadeStyle] = useFadeIn(i * 150);
  const featured = t.featured;
  return (
    <div ref={ref} style={{
      ...fadeStyle,
      background: featured ? `linear-gradient(145deg, rgba(${C.navyRGB},0.55), rgba(${C.accentRGB},0.2))` : C.glass,
      border: `1px solid ${featured ? `rgba(${C.accentRGB},0.4)` : hover ? "rgba(255,255,255,0.12)" : C.glassBorder}`,
      borderRadius: "24px", padding: "40px 32px", textAlign: "center",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      position: "relative",
      transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      transform: hover ? `${featured ? "scale(1.03)" : ""} translateY(-6px)`.trim() : featured ? "scale(1.03)" : "none",
      boxShadow: featured ? `0 20px 60px rgba(${C.accentRGB},0.22)` : "none",
    }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {featured && (
        <>
          <div style={{
            position: "absolute", inset: "-1px", borderRadius: "25px",
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight}, ${C.cyan}, ${C.accent})`,
            backgroundSize: "300% 300%",
            animation: "gradientShift 4s ease infinite",
            zIndex: -1, opacity: 0.6,
          }} />
          <div style={{
            position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
            padding: "6px 20px", borderRadius: "50px",
            background: C.gradient1, color: "#fff",
            fontSize: "12px", fontWeight: 700, boxShadow: `0 4px 15px ${C.accentGlow}`,
            textTransform: "uppercase", letterSpacing: "0.5px",
          }}>Most Popular</div>
        </>
      )}
      <p style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: C.accentLight }}>{t.label}</p>
      <p style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "4px", color: C.text }}>{t.price}</p>
      <p style={{ fontSize: "14px", color: C.textMuted, marginBottom: "24px" }}>{t.range}</p>
      <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: "24px" }}>
        {t.features.map((f, j) => (
          <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", lineHeight: 1.6, padding: "8px 0", textAlign: "left", color: C.text }}>
            <span style={{ color: C.success, display: "inline-flex", flexShrink: 0 }}><CheckIcon size={16} /></span>
            <span>{f}</span>
          </div>
        ))}
      </div>
      <Link to="/contact" style={{ textDecoration: "none", display: "block", marginTop: "28px" }}>
        <RippleButton style={{
          width: "100%", padding: "14px", borderRadius: "14px", fontSize: "15px",
          fontWeight: 600, border: "none", cursor: "pointer",
          background: featured ? "#fff" : C.gradient1,
          color: featured ? C.navy : "#fff",
          boxShadow: featured ? "0 4px 15px rgba(255,255,255,0.15)" : `0 4px 15px ${C.accentGlow}`,
          transition: "transform 0.2s ease",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >{t.btn}</RippleButton>
      </Link>
    </div>
  );
}

export default function Pricing() {
  const tiers = [
    {
      label: "Discovery", price: "$150-$250", range: "One-time engagement",
      features: ["2-3 hour structured tech audit", "Written modernization roadmap", "Tool & platform recommendations", "Priority sequence & estimated ROI", "No obligation to continue"],
      btn: "Book Tech Audit",
    },
    {
      label: "Website + AI Bundle", price: "$1,000-$1,800", range: "Our most popular package",
      features: ["5-8 page professional website", "AI chatbot integration", "2 automation workflows", "SEO & analytics setup", "Comprehensive handoff docs", "2-week post-launch support"],
      btn: "Start Your Project", featured: true,
    },
    {
      label: "Monthly Retainer", price: "$200-$500", range: "Per month, ongoing",
      features: ["Ongoing support & troubleshooting", "New automations & updates", "Performance monitoring", "Priority response time", "Monthly strategy check-in"],
      btn: "Learn More",
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Transparent Pricing" title="Agency Quality." titleAccent="Startup Pricing."
          sub="Deliberately 3-5x below agency rates. Fixed pricing, no surprises, no scope creep." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", alignItems: "start" }}>
          {tiers.map((t, i) => <PricingTier key={i} t={t} i={i} />)}
        </div>
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <div style={{
            display: "inline-block", background: C.glass,
            border: `1px solid ${C.glassBorder}`, borderRadius: "16px",
            padding: "24px 40px", fontSize: "15px", color: C.textMuted,
            backdropFilter: "blur(12px)",
          }}>
            <strong style={{ color: C.text }}>Need something specific?</strong>{" "}
            Individual services available: AI Chatbot Setup ($300-$600) &middot; Automation Build ($250-$500) &middot; Starter Website ($400-$800)
          </div>
        </div>
      </div>
    </PageShell>
  );
}
