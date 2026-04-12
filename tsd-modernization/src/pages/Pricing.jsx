import { useState } from "react";
import { Link } from "react-router-dom";
import { C, useFadeIn, SectionHeader, RippleButton, CardModal } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

function PricingModalContent({ t }) {
  return (
    <div>
      <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "8px" }}>{t.label}</p>
      <h2 style={{ fontSize: "44px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "4px", color: C.text }}>{t.price}</h2>
      <p style={{ fontSize: "15px", color: C.textMuted, marginBottom: "28px" }}>{t.range}</p>

      <p style={{ fontSize: "16px", lineHeight: 1.7, color: C.textMuted, marginBottom: "32px" }}>{t.longDesc}</p>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Everything Included
      </h3>
      <ul style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}>
        {t.features.map((f, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", fontSize: "15px", lineHeight: 1.6, color: C.text }}>
            <span style={{ color: C.success, flexShrink: 0, marginTop: "2px" }}><CheckIcon size={18} /></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Best For
      </h3>
      <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "32px" }}>{t.bestFor}</p>

      <Link to="/contact" style={{ textDecoration: "none", display: "block" }}>
        <RippleButton style={{
          width: "100%", padding: "16px", borderRadius: "14px", fontSize: "16px",
          fontWeight: 700, border: "none", cursor: "pointer",
          background: C.gradient1, color: "#fff",
          boxShadow: `0 4px 20px ${C.accentGlow}`,
        }}>{t.btn} &rarr;</RippleButton>
      </Link>
    </div>
  );
}

function PricingTier({ t, i }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [ref, fadeStyle] = useFadeIn(i * 150);
  const featured = t.featured;
  return (
    <>
    <div ref={ref} style={{
      ...fadeStyle,
      background: featured ? `linear-gradient(145deg, rgba(${C.navyRGB},0.55), rgba(${C.accentRGB},0.2))` : C.glass,
      border: `1px solid ${featured ? `rgba(${C.accentRGB},0.4)` : hover ? `rgba(${C.accentRGB},0.35)` : C.glassBorder}`,
      borderRadius: "24px", padding: "40px 32px", textAlign: "center",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      position: "relative",
      transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      transform: hover ? "translateY(-6px)" : "none",
      boxShadow: featured ? `0 20px 60px rgba(${C.accentRGB},0.22)` : "none",
      cursor: "pointer",
    }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        // Don't open modal if user clicked the inner CTA button/link
        if (e.target.closest('a')) return;
        setOpen(true);
      }}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
    >
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
    <CardModal open={open} onClose={() => setOpen(false)}>
      <PricingModalContent t={t} />
    </CardModal>
    </>
  );
}

export default function Pricing() {
  const tiers = [
    {
      label: "Discovery", price: "$150-$250", range: "One-time engagement",
      features: ["2-3 hour structured tech audit", "Written modernization roadmap", "Tool & platform recommendations", "Priority sequence & estimated ROI", "No obligation to continue"],
      btn: "Book Tech Audit",
      longDesc: "We sit down with you (in person or remote), map out how your business runs today, and deliver a written roadmap of what to modernize first \u2014 and what to leave alone.",
      bestFor: "Business owners who know something needs to change but aren\u2019t sure where to start. No obligation to hire us after.",
    },
    {
      label: "Website + AI Bundle", price: "$1,000-$1,800", range: "Our most popular package",
      features: ["5-8 page professional website", "AI chatbot integration", "2 automation workflows", "SEO & analytics setup", "Comprehensive handoff docs", "2-week post-launch support"],
      btn: "Start Your Project", featured: true,
      longDesc: "A new website, an AI chatbot trained on your business, and two custom automation workflows \u2014 everything wired up and handed over with docs you can actually use.",
      bestFor: "Small businesses that need a real web presence and want to stop doing repetitive admin by hand. Restaurants, dental practices, trades, real estate \u2014 most service businesses.",
    },
    {
      label: "Monthly Retainer", price: "$200-$500", range: "Per month, ongoing",
      features: ["Ongoing support & troubleshooting", "New automations & updates", "Performance monitoring", "Priority response time", "Monthly strategy check-in"],
      btn: "Learn More",
      longDesc: "After your initial project ships, we stay on call for fixes, new automations, and monthly check-ins. Like having a tech team without hiring one.",
      bestFor: "Clients who\u2019ve already done a project with us and want ongoing improvements instead of one-and-done.",
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Pricing" title="What it" titleAccent="costs"
          sub="Fixed quotes, no hourly billing, no scope creep. Here's what we charge." />
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
