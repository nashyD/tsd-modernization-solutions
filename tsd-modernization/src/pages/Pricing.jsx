import { useState } from "react";
import {
  C, v, useFadeIn,
  SectionHeader, Card,
  Eyebrow, EditorialMasthead,
  SPACE, RADIUS,
} from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";
import PricingEstimator from "../components/PricingEstimator";

function PricingMasthead() {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{ ...fade, marginBottom: SPACE["2xl"] }}>
      <EditorialMasthead items={["Custom Builds", "AI Products", "Managed Ongoing"]} />
    </div>
  );
}

/* Risk-reversal pull-quote — the §-letterform headline pairs with the
   Pricing/Team mastheads. */
function GuaranteeBlock() {
  const [ref, fade] = useFadeIn(120);
  return (
    <div ref={ref} style={{
      ...fade,
      maxWidth: "880px", margin: "0 auto 64px",
      padding: "40px clamp(28px, 4vw, 48px)",
      borderTop: `1px solid ${v("divider")}`,
      borderBottom: `1px solid ${v("divider")}`,
      display: "grid", gridTemplateColumns: "auto 1fr",
      gap: "32px", alignItems: "center",
      position: "relative",
    }} className="guarantee-block">
      <div aria-hidden="true" style={{
        position: "absolute", top: "-1px", left: "20%", right: "20%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(75,156,211,0.5), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "clamp(72px, 9vw, 120px)",
        lineHeight: 1.1, flexShrink: 0,
        background: C.gradientAccent, WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent", backgroundClip: "text",
        textAlign: "center",
        paddingBottom: "0.05em",
      }}>{"§"}</div>
      <div>
        <Eyebrow style={{ marginBottom: "12px" }}>Risk Reversal</Eyebrow>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.45, color: v("text"),
          letterSpacing: "-0.2px",
        }}>
          You sign the scope. We deliver. If we missed the mark by handoff,
          every dollar comes back inside a week.
        </p>
      </div>
    </div>
  );
}

const PRODUCT_LEGEND = [
  {
    name: "Custom website",
    tagline: "The storefront that finally matches your reputation.",
    points: ["Fast, mobile-first, built to convert", "On-page SEO + analytics wired in", "Source code yours from day one"],
  },
  {
    name: "TSD Front Desk",
    tagline: "Your AI receptionist — answers phone and chat, qualifies, and books, day or night.",
    points: ["Captures the call you'd have missed", "Texts you a one-paragraph summary", "Built on your real intake flow"],
  },
  {
    name: "TSD Concierge",
    tagline: "Your site assistant — answers visitor questions from your content and catalog.",
    points: ["Search across your docs, videos, products", "Image + semantic catalog lookup", "Your expertise, on every page"],
  },
  {
    name: "TSD Booking Bridge",
    tagline: "Booking and automation — one front door, plus the workflow glue behind it.",
    points: ["Consolidates scattered booking", "Calendar + lead routing automation", "Built on the tools you already pay for"],
  },
  {
    name: "Reviews & reputation",
    tagline: "Turns happy jobs into reviews — and watches the ones that land.",
    points: ["Auto-requests a review after each job", "Monitors Google + Yelp, alerts on new ones", "Compounds the reputation you already have"],
  },
  {
    name: "Lead follow-up",
    tagline: "Re-engages the leads that slipped through the cracks.",
    points: ["Follows up old leads, no-shows, and stale quotes", "AI plus outbound calls and texts", "Recovers revenue you already earned"],
  },
  {
    name: "Local SEO",
    tagline: "Gets you found when people search locally.",
    points: ["Google Business Profile optimization", "Local citations + landing content", "Show up in the map pack"],
  },
];

function ProductLegend() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
      }}>
        {PRODUCT_LEGEND.map((p, i) => (
          <Card key={p.name} delay={i * 90}>
            <h3 style={{
              fontFamily: "var(--font-body)", fontSize: "19px", fontWeight: 700,
              color: v("text"), marginBottom: SPACE.sm, letterSpacing: "-0.3px",
            }}>{p.name}</h3>
            <p style={{
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: "14px", lineHeight: 1.5, color: v("text-muted"), marginBottom: SPACE.md,
            }}>{p.tagline}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {p.points.map((pt, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{
                    flexShrink: 0, marginTop: "1px",
                    width: "18px", height: "18px", borderRadius: RADIUS.full,
                    background: "rgba(6,214,160,0.14)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: C.success,
                  }}>
                    <CheckIcon size={12} strokeWidth={2.5} />
                  </span>
                  <span style={{ fontSize: "13px", color: v("text"), lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const UNIVERSAL_GUARANTEES = [
  "100% money-back guarantee",
  "48-hour written proposal",
  "Source code yours — Managed AI is optional, cancel anytime",
];

function GuaranteeStrip() {
  const [ref, fade] = useFadeIn(180);
  return (
    <div ref={ref} style={{
      ...fade, maxWidth: "740px", margin: "0 auto",
      display: "flex", flexWrap: "wrap", justifyContent: "center",
      gap: "12px 28px", padding: "0 24px",
    }}>
      {UNIVERSAL_GUARANTEES.map((g, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.success, flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: v("text-muted"), lineHeight: 1.5 }}>{g}</span>
        </div>
      ))}
    </div>
  );
}

const FAQS = [
  { q: "How does pricing work?", a: "Every build is a fixed price, quoted in a written proposal within 48 hours of a free fit call. The estimator above gives you a realistic range; the exact number depends on your content, your catalog, and the systems you already run." },
  { q: "What's Managed AI, and is it required?", a: "AI tools drift if nobody tends them — new content to index, prompts to tune, models that keep improving. Managed AI keeps yours sharp: re-indexing, prompt and model upkeep, monitoring, and a monthly report. It's optional, starts after launch, and you can cancel anytime. A website-only build doesn't need it." },
  { q: "Do I own what you build?", a: "Yes. Source code, credentials, and a runbook are yours from day one, with written + video documentation and a live training session at handoff. Managed AI is a service on top — never a lock-in." },
  { q: "How long does a build take?", a: "Most websites and AI builds run 2–4 weeks from approved scope to launch. Larger, multi-system engagements — big catalogs, multiple integrations — are scoped individually." },
  { q: "What kinds of businesses do you work with?", a: "Established local businesses whose digital presence has fallen behind their reputation — salons and spas, specialty automotive, wholesale and supply, studios and makers, professional services, specialty retail. If the business runs on the owner's hours, that's exactly what we fix." },
  { q: "What's the first step?", a: "A free fit call — 30 minutes, in person or remote. We'll tell you honestly whether we can help, and if so, send a fixed-price proposal within 48 hours." },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, fadeStyle] = useFadeIn(0);

  return (
    <div style={{ padding: `${SPACE["4xl"]} 0 0`, maxWidth: "820px", margin: "0 auto" }}>
      <SectionHeader center label="FAQ" title="Common" titleAccent="questions"
        sub="The stuff people usually ask before getting started." />
      <div ref={ref} style={{ ...fadeStyle, display: "flex", flexDirection: "column", gap: "8px" }}>
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{
              background: isOpen ? `linear-gradient(180deg, rgba(75,156,211,0.06) 0%, ${v("surface")} 100%)` : v("surface"),
              border: `1px solid ${isOpen ? "rgba(75,156,211,0.4)" : v("surface-border")}`,
              borderRadius: RADIUS.lg, overflow: "hidden",
              transition: "border-color 0.3s ease, background 0.3s ease",
            }}>
              <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{
                width: "100%", padding: "20px 24px", background: "none", border: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", color: v("text"), fontSize: "15px", fontWeight: 600,
                textAlign: "left", fontFamily: "var(--font-body)",
                gap: "16px",
              }}>
                <span>{faq.q}</span>
                <span style={{
                  flexShrink: 0,
                  width: "28px", height: "28px", borderRadius: RADIUS.full,
                  background: isOpen ? C.gradientAccent : v("surface"),
                  border: isOpen ? "none" : `1px solid ${v("divider")}`,
                  color: isOpen ? "#fff" : v("accent"),
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", fontWeight: 700, lineHeight: 1,
                  transition: "all 0.3s ease",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? "360px" : "0", overflow: "hidden",
                transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <p style={{
                  padding: "0 24px 22px", fontSize: "14px",
                  lineHeight: 1.7, color: v("text-muted"),
                }}>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1140px", margin: "0 auto",
      }}>
        <PricingMasthead />
        <SectionHeader
          center
          label="Estimate"
          title="Build an estimate,"
          titleAccent="then talk to a human."
          sub="Tell us your size and what you want running. You'll get a realistic range in two clicks — the exact, fixed price comes from a free fit call."
        />
        <GuaranteeBlock />
        <PricingEstimator />
        <div style={{ padding: `${SPACE["4xl"]} 0 0` }}>
          <SectionHeader
            center
            label="What's in a build"
            title="The products,"
            titleAccent="mixed to fit."
            sub="Start with what hurts most. Add the rest when you're ready — the website is the storefront, the AI is what runs once you've gone home."
          />
        </div>
        <ProductLegend />
        <div style={{ marginTop: SPACE["2xl"] }}>
          <GuaranteeStrip />
        </div>
        <FAQSection />
      </div>
      <style>{`
        @media (max-width: 980px) {
          .guarantee-block { grid-template-columns: 1fr !important; gap: 16px !important; text-align: center; padding: 36px 24px !important; }
        }
      `}</style>
    </PageShell>
  );
}
