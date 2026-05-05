import { useState } from "react";
import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  SectionHeader, Card, Button,
  Eyebrow, GradientText, EditorialMasthead, PillBadge,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { CheckIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import MissedCallCalculatorWidget from "../components/MissedCallCalculatorWidget";
import BookCallButton from "../components/BookCallButton";

/* Per-tier scarcity counters removed 2026-05-03. Empty scarcity ("10 of 10
   spots remaining") reads as "nobody bought yet" — worse than no badge.
   Re-enable by adding entries here AND setting tier.spotsKey on the tier
   below, once 3+ contracts have closed and the remaining count is honest. */
const SPOTS = {};

function CohortMasthead() {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{ ...fade, marginBottom: SPACE["2xl"] }}>
      <EditorialMasthead items={["Founding Cohort", "Ten Spots", "Summer MMXXVI"]} />
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
      {/* Hairline accent — gradient bar that runs across the top edge */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-1px", left: "20%", right: "20%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(75,156,211,0.5), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "clamp(72px, 9vw, 120px)",
        lineHeight: 1, flexShrink: 0,
        background: C.gradientAccent, WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent", backgroundClip: "text",
        textAlign: "center",
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

function TierCard({ tier, delay }) {
  const [ref, fade] = useFadeIn(delay);
  const [hovered, setHovered] = useState(false);
  const featured = tier.featured;
  const spots = tier.spotsKey ? SPOTS[tier.spotsKey] : null;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...fade,
        position: "relative",
        padding: featured ? "48px 36px 36px" : "36px 32px",
        borderRadius: RADIUS["2xl"],
        background: featured
          ? `linear-gradient(160deg, ${v("surface")} 0%, rgba(75,156,211,0.06) 100%)`
          : v("surface"),
        border: `${featured ? "2px" : "1px"} solid ${
          featured
            ? "rgba(75,156,211,0.55)"
            : hovered ? v("surface-border-hover") : v("surface-border")
        }`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: featured
          ? hovered ? "0 24px 60px rgba(75,156,211,0.22), 0 8px 24px rgba(7,13,26,0.18)" : "0 12px 36px rgba(75,156,211,0.14), 0 4px 12px rgba(7,13,26,0.10)"
          : hovered ? SHADOW.lg : SHADOW.sm,
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.3s ease",
      }}>
      {/* Top-edge highlight — gradient line */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
        background: featured
          ? "linear-gradient(90deg, transparent, rgba(75,156,211,0.55), transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        pointerEvents: "none",
      }} />

      {/* Phase chip (top-left) */}
      <div style={{
        position: "absolute", top: "-12px", left: "28px",
        padding: "5px 14px", borderRadius: RADIUS.full,
        fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
        background: featured ? C.gradientAccent : v("bg"),
        color: featured ? "#fff" : v("text-muted"),
        border: featured ? "none" : `1px solid ${v("divider")}`,
        boxShadow: featured ? "0 4px 14px rgba(75,156,211,0.32)" : "none",
      }}>{tier.phase}</div>

      {/* Most-popular ribbon (top-right) */}
      {featured && (
        <div style={{
          position: "absolute", top: "-12px", right: "28px",
          padding: "5px 14px", borderRadius: RADIUS.full,
          fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
          background: v("bg"), color: v("accent"),
          border: `1px solid ${v("accent")}`,
        }}>★ Most Popular</div>
      )}

      <div style={{ textAlign: "center", marginBottom: spots ? "20px" : "32px", marginTop: SPACE.sm }}>
        <Eyebrow style={{ marginBottom: SPACE.md }}>{tier.label}</Eyebrow>

        {tier.anchor ? (
          <>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
              fontSize: "20px", color: v("text-dim"), lineHeight: 1.2,
              textDecoration: "line-through", textDecorationColor: v("text-dim"),
              textDecorationThickness: "1px",
              marginBottom: "8px",
            }}>{tier.anchor}</div>
            <div style={{
              fontFamily: "var(--font-body)", fontWeight: 800,
              fontSize: "clamp(56px, 7vw, 72px)", letterSpacing: "-2px",
              lineHeight: 1.05,
              background: C.gradientAccent, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: "10px", fontFeatureSettings: '"tnum" 1',
            }}>{tier.price}</div>
            <Eyebrow>{tier.range}</Eyebrow>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: "var(--font-body)", fontWeight: 800,
              fontSize: "clamp(56px, 7vw, 72px)", letterSpacing: "-2px",
              lineHeight: 1.05,
              color: v("text"),
              marginBottom: "10px", fontFeatureSettings: '"tnum" 1',
            }}>{tier.price}</div>
            <div style={{
              fontSize: "12px", color: v("text-dim"),
              fontStyle: "italic", fontFamily: "var(--font-display)",
            }}>{tier.range}</div>
          </>
        )}
      </div>

      {spots && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          padding: "8px 14px", borderRadius: RADIUS.full,
          background: "rgba(75,156,211,0.10)",
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

      {tier.intro && (
        <p style={{
          fontSize: "14px", color: v("text-muted"), lineHeight: 1.6,
          marginBottom: SPACE.lg, textAlign: "center",
          fontFamily: "var(--font-display)", fontStyle: "italic",
          maxWidth: "320px", marginLeft: "auto", marginRight: "auto",
        }}>{tier.intro}</p>
      )}

      <div style={{
        display: "flex", flexDirection: "column", gap: "12px",
        marginBottom: tier.bonus ? SPACE.lg : SPACE.xl,
        padding: SPACE.md,
        background: `linear-gradient(180deg, ${v("surface")} 0%, transparent 100%)`,
        borderRadius: RADIUS.md,
        border: `1px solid ${v("divider-soft")}`,
      }}>
        {tier.features.map((f, j) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <div style={{
              flexShrink: 0, marginTop: "1px",
              width: "18px", height: "18px", borderRadius: RADIUS.full,
              background: "rgba(6,214,160,0.14)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: C.success,
            }}>
              <CheckIcon size={12} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "14px", color: v("text"), lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      {tier.bonus && (
        <div style={{
          padding: "16px 18px", borderRadius: RADIUS.md,
          background: "rgba(75,156,211,0.08)",
          border: `1px dashed ${C.carolina}`,
          marginBottom: SPACE.lg,
        }}>
          <Eyebrow style={{ marginBottom: "6px" }}>Bonus</Eyebrow>
          <p style={{ fontSize: "13px", color: v("text"), lineHeight: 1.5 }}>{tier.bonus}</p>
        </div>
      )}

      <Link to="/contact" style={{ textDecoration: "none" }}>
        <Button as="span" variant={featured ? "primary" : "secondary"} fullWidth iconRight={<ArrowRightIcon size={14} />}>
          {tier.btn}
        </Button>
      </Link>
      <BookCallButton variant="ghost" refSource="pricing" style={{ marginTop: "10px", width: "100%" }}>
        Or book a fit call
      </BookCallButton>

      {tier.objection && (
        <p style={{
          marginTop: SPACE.md,
          fontSize: "12px", lineHeight: 1.55,
          fontFamily: "var(--font-display)", fontStyle: "italic",
          color: v("text-dim"),
          textAlign: "center",
        }}>
          {tier.objection}
        </p>
      )}

      <div style={{
        marginTop: SPACE.lg, paddingTop: SPACE.md,
        borderTop: `1px solid ${v("divider-soft")}`,
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {UNIVERSAL_GUARANTEES.map((g, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "8px",
          }}>
            <span style={{
              flexShrink: 0, marginTop: "5px",
              width: "5px", height: "5px", borderRadius: "50%",
              background: C.success,
            }} />
            <span style={{ fontSize: "12px", color: v("text-dim"), lineHeight: 1.5 }}>{g}</span>
          </div>
        ))}
      </div>
    </div>
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
      maxWidth: "740px", margin: "0 auto 72px",
      textAlign: "center", padding: "0 24px",
    }}>
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.55, color: v("text-muted"),
      }}>
        Three founders. Ten Charlotte main-street builds. May 7 through August 10, then we close.
        We don't take retainers, we don't sell subscriptions, and we will not be your long-term agency.
      </p>
    </div>
  );
}

function ClosingNote() {
  const [ref, fade] = useFadeIn(240);
  return (
    <div ref={ref} style={{
      ...fade,
      marginTop: SPACE["4xl"], textAlign: "center",
      maxWidth: "640px", margin: `${SPACE["4xl"]} auto 0`,
      padding: "0 24px",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "12px", justifyContent: "center",
        marginBottom: SPACE.md,
      }}>
        <span style={{ width: "32px", height: "1px", background: v("divider") }} />
        <span style={{ color: v("accent"), fontSize: "8px" }}>{"◆"}</span>
        <span style={{ width: "32px", height: "1px", background: v("divider") }} />
      </div>
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "16px", lineHeight: 1.65, color: v("text-muted"),
      }}>
        Last start: <span style={{ color: v("text"), fontWeight: 600 }}>July 13</span>. We deliver
        to handoff, then the season closes.
      </p>
    </div>
  );
}

const TIERS = [
  {
    phase: "Build",
    label: "Website + AI Build",
    price: "$5,000",
    range: "Founding rate",
    intro: "A modern site that captures leads, shipped in 14 days. You own the code.",
    features: [
      "Custom responsive website",
      "AI chatbot or workflow automation",
      "On-page SEO + analytics wiring",
      "Written + video documentation",
      "Founder on call for fixes through August 31, 2026",
      "Full source code ownership",
    ],
    bonus: "Already bought After-Hours Lead Capture? Save $1,000 on this build within 30 days of your setup — Website + AI Build becomes $4,000 instead of $5,000.",
    btn: "Claim a Build Slot",
    featured: true,
    objection: "Live in 14 days from contract signature or 25% back ($1,250). 3 AI-captured leads in the first 30 days post-launch or we refund the AI portion and rebuild it free.",
  },
  {
    phase: "Modernization",
    label: "The Full Modernization",
    price: "$10,000",
    range: "Founding rate · By application",
    intro: "An outcome engagement. We work the system with you until the leads number hits — whatever it takes.",
    features: [
      "Discovery audit + written modernization roadmap",
      "Custom website + AI receptionist (call + chat capture)",
      "One operational integration: ServiceTitan, QuickBooks, Jobber, or another system you use",
      "Custom AI re-training on your real call data — starts after week 1, continues through August 31",
      "Weekly written status report — what shipped, what's next, what we need from you",
      "Monthly 1-hour business review with your TSD partner + 24-hour written recap",
      "Full source code ownership",
    ],
    btn: "Apply for the Full Modernization",
    objection: "15+ qualified leads in your pipeline before August 31, 2026, or $5,000 back and the AI integration rebuilt free. Cancel any time after handoff. No retainer trap.",
  },
];

function WedgePointer() {
  return (
    <div style={{
      maxWidth: "680px", margin: `${SPACE.xl} auto 0`, padding: "0 24px",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "13px", color: v("text-dim"), lineHeight: 1.6 }}>
        Looking for the smaller wedge? See{" "}
        <Link to="/ai-receptionist" style={{
          color: v("accent"), textDecoration: "underline",
          textUnderlineOffset: "3px", textDecorationThickness: "1px",
          fontWeight: 600,
        }}>
          After-Hours Lead Capture, $497
        </Link>
        {" "}— built for HVAC, electricians, and plumbers.
      </p>
    </div>
  );
}

const FAQS = [
  { q: "Why are your prices so much lower than agencies?", a: "We're a lean team of three founders with minimal overhead. Our founding-cohort rates are deliberately half what we'll charge after Summer 2026, set so we can build our portfolio and earn client trust. You get the same quality at 3-5x less than agency rates." },
  { q: "How does the Summer 2026 cohort work?", a: "We operate from May 7 to August 10, 2026 — three founders running together over the summer, capped at ten clients so every project gets the time it needs. Last project start is July 13. After August 10 we hand off; one founder stays on call for fixes through August 31." },
  { q: "How does the free fit call work?", a: "A 1-2 hour conversation, in-person or remote, where we walk through your business, your operations, and what you'd want modernized. You leave with a clear read on whether we're the right fit. If we're a match, the next step is a written proposal for the Website + AI Build or the Full Modernization within 48 hours. We also offer a standalone $1,500 discovery audit on request — ask about it on your fit call if you'd rather start with a paid scope-and-recommend before committing to a full build." },
  { q: "What happens after my project is done?", a: "Every project ends with handoff documentation, video tutorials, and a live training session. You'll run everything independently from there. One founder stays on call for fixes through August 31, 2026; past that, the season closes." },
  { q: "Do I need to know anything about AI?", a: "Not at all. That's what we're here for. We'll explain everything in plain English, recommend only tools that genuinely fit your needs, and handle all the technical setup. You just tell us what's slowing your business down." },
  { q: "How long does a typical project take?", a: "Tech audits are done in a single session. Website builds and AI integrations typically take 2-4 weeks from proposal to handoff." },
  { q: "What's your service area?", a: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities. Discovery meetings can be done in-person or remote." },
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
          gridTemplateColumns: "1.12fr 1fr",
          gap: SPACE.xl,
          alignItems: "start",
        }} className="pricing-grid">
          {TIERS.map((t, i) => (
            <TierCard key={i} tier={t} delay={i * 120} />
          ))}
        </div>
        <WedgePointer />
        <div style={{ padding: `${SPACE["4xl"]} 0 0` }}>
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
          .pricing-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .guarantee-block { grid-template-columns: 1fr !important; gap: 16px !important; text-align: center; padding: 36px 24px !important; }
        }
      `}</style>
    </PageShell>
  );
}
