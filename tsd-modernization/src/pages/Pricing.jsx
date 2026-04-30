import { useState } from "react";
import { Link } from "react-router-dom";
import { C, v, useFadeIn, SectionHeader, Card, RippleButton } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";
import MissedCallCalculatorWidget from "../components/MissedCallCalculatorWidget";
import BookCallButton from "../components/BookCallButton";

/* Live scarcity counter — update these as contracts sign so the counter
   on each tier card stays honest. Currently 0 closed contracts; all open. */
const SPOTS = {
  bundle: { remaining: 10, total: 10 },
  partnership: { remaining: 3, total: 3 },
};

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
      <span>Ten spots</span>
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

/* Tier card. Featured tier (the middle bundle) gets the 2px border + Most
   Popular badge so the visual hierarchy nudges toward it as the obvious pick.
   Anchor pricing renders as small struck-through standard above the prominent
   founding number. Live spots counter renders below the price for tiers that
   have a cap. Objection-handling line renders below the CTA. */
function TierCard({ tier, delay }) {
  const featured = tier.featured;
  const spots = tier.spotsKey ? SPOTS[tier.spotsKey] : null;
  return (
    <Card delay={delay} style={{
      border: featured ? `2px solid ${C.carolina}` : undefined,
      position: "relative",
      padding: featured ? "44px 32px 32px" : "32px",
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

      <div style={{ textAlign: "center", marginBottom: spots ? "18px" : "28px", marginTop: "8px" }}>
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

      {spots && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          padding: "8px 14px",
          borderRadius: "100px",
          background: "rgba(75,156,211,0.1)",
          border: `1px solid ${C.carolina}`,
          fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
          color: v("accent"),
          margin: "0 auto 24px",
          width: "fit-content",
        }}>
          <span aria-hidden="true" style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: C.success,
          }} />
          {spots.remaining} of {spots.total} spots remaining
        </div>
      )}

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
      <BookCallButton variant="secondary" refSource="pricing" style={{ width: "100%", padding: "12px 0", marginTop: "10px", fontSize: "13px" }}>
        Or book a fit call
      </BookCallButton>
      {tier.objection && (
        <p style={{
          marginTop: "14px",
          fontSize: "12px", lineHeight: 1.55,
          fontFamily: "var(--font-display)", fontStyle: "italic",
          color: v("text-dim"),
          textAlign: "center",
        }}>
          {tier.objection}
        </p>
      )}
      <div style={{
        marginTop: "18px", paddingTop: "16px",
        borderTop: `1px solid ${v("divider")}`,
        display: "flex", flexDirection: "column", gap: "8px",
      }}>
        {UNIVERSAL_GUARANTEES.map((g, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "8px",
          }}>
            <CheckIcon size={12} style={{ color: C.success, flexShrink: 0, marginTop: "3px" }} />
            <span style={{ fontSize: "12px", color: v("text-dim"), lineHeight: 1.5 }}>{g}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const UNIVERSAL_GUARANTEES = [
  "100% money-back guarantee",
  "48-hour written proposal",
  "No retainers, no subscriptions",
];

function QualificationNote() {
  const [ref, fade] = useFadeIn(180);
  return (
    <div ref={ref} style={{
      ...fade,
      maxWidth: "720px", margin: "0 auto 56px",
      textAlign: "center", padding: "0 24px",
    }}>
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "17px", lineHeight: 1.6, color: v("text-muted"),
      }}>
        Three founders. Ten Charlotte main-street builds. May 7 through August 10, then we close.
        We don't take retainers, we don't sell subscriptions, and we will not be your long-term agency.
      </p>
    </div>
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
        Last start: <span style={{ color: v("text") }}>July 13</span>. We deliver
        to handoff, then the season closes.
      </p>
    </div>
  );
}

const TIERS = [
  {
    phase: "Phase I",
    label: "Discovery",
    anchor: "$3,000",
    price: "$1,500",
    range: "Founding rate · One-time",
    features: [
      "2-3 hour structured tech audit",
      "Written modernization roadmap",
      "Tool & platform recommendations",
      "Priority areas identified",
      "No obligation to continue",
    ],
    btn: "Book Tech Audit",
    objection: "Money-back if we can't find $25K of opportunities.",
  },
  {
    phase: "Phase II",
    label: "Website + AI Bundle",
    anchor: "$4,000",
    price: "$2,000",
    range: "Founding rate",
    spotsKey: "bundle",
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
    objection: "Fixed fee. Delivered by handoff. Source code is yours from day one.",
  },
  {
    phase: "Partnership",
    label: "Founding Partnership",
    anchor: "$10,000",
    price: "$5,000",
    range: "Founding rate · By application",
    spotsKey: "partnership",
    features: [
      "Phase I audit included",
      "Phase II Bundle (everything in the middle column)",
      "AI receptionist setup included",
      "Monthly optimization check-ins through August 31",
      "Named ops handholding from Bishop — calendar, proposals, weekly status",
    ],
    btn: "Apply for Partnership",
    objection: "Cancel any time after handoff. No retainer trap.",
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
        {" "}— built for HVAC, electricians, and plumbers.
      </p>
    </div>
  );
}

/* FAQ — moved from /contact 2026-04-26 per Marc's rule that the FAQ does the
   salesperson's job at the moment of hesitation, which is the pricing page
   (the buyer who reaches /contact has already self-selected past the price). */
const FAQS = [
  { q: "Why are your prices so much lower than agencies?", a: "We're a lean team of three founders with minimal overhead. Our founding-cohort rates are deliberately half what we'll charge after Summer 2026, set so we can build our portfolio and earn client trust. You get the same quality at 3-5x less than agency rates." },
  { q: "How does the Summer 2026 cohort work?", a: "We operate from May 7 to August 10, 2026 — three founders running together over the summer, capped at ten clients so every project gets the time it needs. Last project start is July 13. After August 10 we hand off; one founder stays on call for fixes through August 31." },
  { q: "How does the free fit call work?", a: "A 1-2 hour conversation, in-person or remote, where we walk through your business, your operations, and what you'd want modernized. You leave with a clear read on whether we're the right fit. If we're a match, the next step is a $1,500 Phase I Discovery audit or a written proposal for the Phase II Bundle within 48 hours." },
  { q: "What happens after my project is done?", a: "Every project ends with handoff documentation, video tutorials, and a live training session. You'll run everything independently from there. One founder stays on call for fixes through August 31, 2026; past that, the season closes." },
  { q: "Do I need to know anything about AI?", a: "Not at all. That's what we're here for. We'll explain everything in plain English, recommend only tools that genuinely fit your needs, and handle all the technical setup. You just tell us what's slowing your business down." },
  { q: "How long does a typical project take?", a: "Tech audits are done in a single session. Website builds and AI integrations typically take 2-4 weeks from proposal to handoff." },
  { q: "What's your service area?", a: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities. Discovery meetings can be done in-person or remote." },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, fadeStyle] = useFadeIn(0);

  return (
    <div style={{ padding: "80px 0 0", maxWidth: "800px", margin: "0 auto" }}>
      <SectionHeader center label="FAQ" title="Common" titleAccent="questions"
        sub="The stuff people usually ask before getting started." />
      <div ref={ref} style={{ ...fadeStyle, display: "flex", flexDirection: "column", gap: "10px" }}>
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{
              background: v("surface"), border: `1px solid ${isOpen ? v("accent") : v("surface-border")}`,
              borderRadius: "14px", overflow: "hidden", transition: "border-color 0.3s ease",
            }}>
              <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{
                width: "100%", padding: "18px 22px", background: "none", border: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", color: v("text"), fontSize: "15px", fontWeight: 600,
                textAlign: "left", fontFamily: "var(--font-body)",
              }}>
                {faq.q}
                <span style={{
                  fontSize: "18px", color: v("accent"), transition: "transform 0.3s ease",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: "16px",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? "320px" : "0", overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <p style={{ padding: "0 22px 18px", fontSize: "14px", lineHeight: 1.7, color: v("text-muted") }}>{faq.a}</p>
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
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <CohortMasthead />
        <SectionHeader
          center
          label="The Contract"
          title="Three ways to"
          titleAccent="start."
          sub="Three engagements. Single prices, scope spelled out before you sign."
        />
        <GuaranteeBlock />
        <QualificationNote />
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr 1fr",
          gap: "24px",
          alignItems: "start",
        }} className="pricing-grid">
          {TIERS.map((t, i) => (
            <TierCard key={i} tier={t} delay={i * 120} />
          ))}
        </div>
        <WedgePointer />
        <div style={{ padding: "80px 0 0" }}>
          <SectionHeader
            center
            label="Free Tool"
            title="See what your phone is"
            titleAccent="costing you."
            sub="Four questions, one number. No signup. Built for Charlotte HVAC, electricians, and plumbers."
          />
        </div>
        <MissedCallCalculatorWidget />
        <FAQSection />
        <ClosingNote />
      </div>
      <style>{`
        @media (max-width: 980px) {
          .pricing-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .guarantee-block { flex-direction: column !important; gap: 16px !important; text-align: center; padding: 32px 24px !important; }
        }
      `}</style>
    </PageShell>
  );
}
