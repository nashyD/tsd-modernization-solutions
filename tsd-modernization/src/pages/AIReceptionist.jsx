import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  Card, Button, DiamondDivider,
  Eyebrow, ChapterRule, GradientText, EditorialMasthead, PillBadge,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { CheckIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import BookCallButton from "../components/BookCallButton";

/* Local chapter head — wraps ChapterRule and adds title/sub copy. */
function ChapterHead({ label, num, title, sub }) {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{ ...fade, marginBottom: SPACE.xl, maxWidth: "820px" }}>
      <ChapterRule label={label} num={num} style={{ marginBottom: SPACE.lg }} />
      {title && <h2 style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(28px, 4vw, 42px)",
        letterSpacing: "-0.6px", lineHeight: 1.12,
        color: v("text"), marginBottom: sub ? SPACE.md : 0,
      }}>{title}</h2>}
      {sub && <p style={{
        fontSize: "16px", lineHeight: 1.65,
        color: v("text-muted"),
      }}>{sub}</p>}
    </div>
  );
}

function ReceptionistHero() {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  const [r3, f3] = useFadeIn(500);
  const [r4, f4] = useFadeIn(700);
  const [r5, f5] = useFadeIn(900);
  return (
    <section style={{
      padding: `${SPACE["3xl"]} 24px ${SPACE["4xl"]}`,
      maxWidth: "960px", margin: "0 auto",
      textAlign: "center",
      position: "relative",
    }}>
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
        width: "70%", height: "60%",
        background: "radial-gradient(ellipse, rgba(75,156,211,0.10) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div ref={r1} style={{ ...f1, marginBottom: SPACE.xl, position: "relative", zIndex: 1 }}>
        <EditorialMasthead items={["AI Receptionist", "Charlotte Trades", "Summer MMXXVI"]} />
      </div>

      <h1 ref={r2} style={{
        ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(36px, 5.8vw, 64px)",
        letterSpacing: "-2px", lineHeight: 1.1,
        color: v("text"), marginBottom: SPACE.lg,
        position: "relative", zIndex: 1,
      }}>
        Get every after-hours call into a booked appointment.
        <br />
        <GradientText>And the agent is yours.</GradientText>
      </h1>

      <DiamondDivider width={180} style={{ marginBottom: SPACE.lg }} />

      <p ref={r3} style={{
        ...f3, fontSize: "17px", lineHeight: 1.65, color: v("text-muted"),
        maxWidth: "620px", margin: "0 auto 36px",
        position: "relative", zIndex: 1,
      }}>
        A custom-trained AI answers your phone 24/7, qualifies the lead, and lands the appointment on your calendar. Built for Charlotte HVAC, electricians, and plumbers. Setup in a week — and on August 31, the agent transfers to you.
      </p>

      <div ref={r4} style={{
        ...f4, display: "flex", gap: "12px", justifyContent: "center",
        flexWrap: "wrap", marginBottom: SPACE.xl,
        position: "relative", zIndex: 1,
      }}>
        <Link to="/contact?ref=ai-receptionist" style={{ textDecoration: "none" }}>
          <Button as="span" variant="primary" size="lg" iconRight={<ArrowRightIcon size={16} />}>
            Reserve a setup spot
          </Button>
        </Link>
        <BookCallButton variant="ghost" refSource="ai-receptionist">
          Book a fit call
        </BookCallButton>
      </div>

      <div ref={r5} style={{
        ...f5, display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
        fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px",
        textTransform: "uppercase",
        color: v("text-muted"), flexWrap: "wrap",
        position: "relative", zIndex: 1,
      }}>
        <span style={{ flex: "0 0 32px", height: "1px", background: v("divider") }} />
        <span>$497 founding setup</span>
        <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
        <span>Ten spots</span>
        <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
        <span>Last start <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
          fontSize: "13px", letterSpacing: "0", textTransform: "none",
          color: v("text"),
        }}>July 13</span></span>
        <span style={{ flex: "0 0 32px", height: "1px", background: v("divider") }} />
      </div>
    </section>
  );
}

function TheLeak() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: `${SPACE.xl} 24px ${SPACE["2xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead
        label="The Leak"
        num="01"
        title="The phone rings at 11pm. Most Charlotte trades miss it."
        sub="Industry data puts after-hours missed-call rates above 30% for service businesses. Every miss is a job that quoted with someone else by morning. Voicemail loses leads, call centers are overkill at this scale, and the math on a real receptionist rarely carries for a small operator."
      />
    </section>
  );
}

const STEPS = [
  {
    num: "01",
    title: "Forward",
    body: "After-hours calls forward to a dedicated AI line. Set a time window — nights only, weekends only, always-on. Your call.",
  },
  {
    num: "02",
    title: "Answer",
    body: "AI answers in your business voice, captures name, service, urgency, and address. Books an appointment slot from your calendar in real time.",
  },
  {
    num: "03",
    title: "Confirm",
    body: "You get an SMS with the booking and a one-paragraph call summary. Caller gets a confirmation text. You call back when ready.",
  },
];

function HowItWorks() {
  return (
    <section style={{
      padding: `${SPACE.lg} 24px ${SPACE["3xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead label="The Flow" num="02" title="How it works" />

      {/* Connector rail — visual line connecting the three steps. */}
      <div style={{ position: "relative" }}>
        <div aria-hidden="true" className="step-rail" style={{
          position: "absolute", top: "44px", left: "12%", right: "12%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(75,156,211,0.32) 15%, rgba(75,156,211,0.32) 85%, transparent)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: SPACE.lg, position: "relative",
        }}>
          {STEPS.map((s, i) => (
            <Card key={s.num} delay={i * 120}>
              <div style={{
                width: "56px", height: "56px",
                borderRadius: RADIUS.full,
                background: `linear-gradient(135deg, ${v("bg-alt")} 0%, ${v("surface")} 100%)`,
                border: `1px solid ${v("surface-border")}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
                fontSize: "26px",
                background: C.gradientAccent,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: SPACE.md,
                position: "relative", zIndex: 1,
              }}>{s.num}</div>
              <Eyebrow style={{ marginBottom: "8px" }}>Step</Eyebrow>
              <h3 style={{
                fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "22px",
                color: v("text"), marginBottom: SPACE.sm,
                letterSpacing: "-0.3px",
              }}>{s.title}</h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-muted") }}>{s.body}</p>
            </Card>
          ))}
        </div>
        <style>{`@media (max-width: 700px) { .step-rail { display: none !important; } }`}</style>
      </div>
    </section>
  );
}

const INCLUDED = [
  "Custom AI agent trained on your services, hours, and pricing",
  "Branded greeting and voice",
  "Calendar integration (Google or Apple)",
  "SMS confirmations to caller and to you",
  "Weekly summary of what got booked",
  "Founder on call for fixes through August 31, 2026",
  "Full transfer of credentials and the agent at handoff",
];

function TheOffer() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: `${SPACE.lg} 24px ${SPACE["4xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead
        label="The Offer"
        num="04"
        title="What you get, what it costs, what we promise."
      />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.xl,
        alignItems: "stretch",
      }} className="offer-grid">
        <Card delay={0}>
          <Eyebrow style={{ marginBottom: SPACE.lg }}>What's included</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {INCLUDED.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{
                  flexShrink: 0, marginTop: "2px",
                  width: "18px", height: "18px", borderRadius: RADIUS.full,
                  background: "rgba(6,214,160,0.14)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: C.success,
                }}>
                  <CheckIcon size={12} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: "14px", color: v("text"), lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{
          padding: SPACE.xl,
          borderRadius: RADIUS["2xl"],
          background: `linear-gradient(160deg, ${v("surface")} 0%, rgba(75,156,211,0.06) 100%)`,
          border: `2px solid rgba(75,156,211,0.55)`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          position: "relative",
          boxShadow: "0 16px 40px rgba(75,156,211,0.18), 0 6px 16px rgba(7,13,26,0.10)",
        }}>
          {/* Top-edge gradient highlight */}
          <span aria-hidden="true" style={{
            position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(75,156,211,0.6), transparent)",
            pointerEvents: "none",
          }} />

          <Eyebrow style={{ marginBottom: SPACE.lg }}>The price</Eyebrow>

          <div style={{ marginBottom: SPACE.lg }}>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
              fontSize: "20px", color: v("text-dim"), lineHeight: 1.2,
              textDecoration: "line-through", textDecorationColor: v("text-dim"),
              textDecorationThickness: "1px", marginBottom: SPACE.sm,
            }}>$1,500 standard</div>
            <div style={{
              fontFamily: "var(--font-body)", fontWeight: 800,
              fontSize: "clamp(56px, 8vw, 76px)", letterSpacing: "-2.5px",
              lineHeight: 1.1,
              background: C.gradientAccent, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: SPACE.sm,
              paddingBottom: "0.08em",
              fontFeatureSettings: '"tnum" 1',
            }}>$497</div>
            <p style={{ fontSize: "14px", color: v("text-muted"), marginBottom: "4px" }}>
              <strong style={{ color: v("text"), fontWeight: 700 }}>Founding setup, paid once.</strong>
            </p>
            <p style={{ fontSize: "13px", color: v("text-muted"), lineHeight: 1.55 }}>
              Agent transfers to you on August 31, 2026. No subscription, no recurring fee.
            </p>
          </div>

          <div style={{
            padding: "14px 16px", borderRadius: RADIUS.md,
            background: "rgba(75,156,211,0.08)",
            border: `1px solid ${v("divider")}`,
            marginBottom: SPACE.md,
          }}>
            <Eyebrow style={{ marginBottom: "6px" }}>Risk reversal</Eyebrow>
            <p style={{ fontSize: "13px", color: v("text"), lineHeight: 1.5 }}>
              If the AI doesn't book a single appointment in your first 30 days, every dollar comes back.
            </p>
          </div>

          <div style={{
            padding: "14px 16px", borderRadius: RADIUS.md,
            background: "rgba(75,156,211,0.04)",
            border: `1px dashed ${C.carolina}`,
            marginBottom: SPACE.md,
          }}>
            <Eyebrow style={{ marginBottom: "6px" }}>Build bonus</Eyebrow>
            <p style={{ fontSize: "13px", color: v("text"), lineHeight: 1.55 }}>
              Add the Website + AI Build within 30 days of setup and save $1,000 — full Build for $4,000 instead of $5,000.
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "13px", color: v("text-dim"), lineHeight: 1.6,
            marginBottom: SPACE.lg,
          }}>
            After August 31, ownership transfers. You own the agent, the credentials, and the call log, and you continue the underlying service directly.
          </p>

          <Link to="/contact?ref=ai-receptionist" style={{ textDecoration: "none" }}>
            <Button as="span" variant="primary" fullWidth iconRight={<ArrowRightIcon size={14} />}>
              Reserve a setup spot
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .offer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}

function ClosingCTA() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade,
      padding: `${SPACE["3xl"]} 24px ${SPACE["4xl"]}`,
      textAlign: "center",
      maxWidth: "640px", margin: "0 auto",
    }}>
      <DiamondDivider width={120} style={{ marginBottom: SPACE.lg }} />
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "22px", lineHeight: 1.45, color: v("text"),
        marginBottom: SPACE.xl,
      }}>
        Ten spots. Last start: <span style={{ color: v("accent") }}>July 13</span>.
      </p>
      <Link to="/contact?ref=ai-receptionist" style={{ textDecoration: "none" }}>
        <Button as="span" variant="primary" size="lg" iconRight={<ArrowRightIcon size={16} />}>
          Reserve a setup spot
        </Button>
      </Link>
    </section>
  );
}

const SAAS_COMPARISON = [
  { axis: "Setup", saas: "Self-serve, remote", tsd: "Three founders, in-person" },
  { axis: "Pricing", saas: "$95–$199/mo forever", tsd: "$497 once, then yours" },
  { axis: "Ownership", saas: "Theirs — you rent it", tsd: "Yours — agent + credentials transfer Aug 31" },
  { axis: "Where they are", saas: "Anywhere in the country", tsd: "Charlotte / Gaston" },
];

function TheDifference() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: `${SPACE.lg} 24px ${SPACE["3xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead
        label="The Difference"
        num="03"
        title="The national SaaS rents you an AI. We sell you one."
        sub="Smith.ai, NextPhone, Marlie, RealVoice AI — they all charge a monthly subscription that never ends. TSD is one-time setup, then the agent and credentials transfer to you on August 31. Three months from now, theirs is a line item; yours is an asset."
      />

      <div style={{
        overflowX: "auto",
        borderRadius: RADIUS.xl,
        border: `1px solid ${v("surface-border")}`,
        boxShadow: SHADOW.sm,
      }}>
        <div style={{ minWidth: "640px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr" }}>
            <div style={{
              padding: "24px 28px", background: v("surface"),
              borderBottom: `1px solid ${v("divider")}`,
            }} />
            <div style={{
              padding: "24px 28px", background: v("surface"),
              borderBottom: `1px solid ${v("divider")}`,
              borderLeft: `1px solid ${v("divider")}`,
            }}>
              <Eyebrow color={v("text-muted")} diamond={false}>National SaaS</Eyebrow>
              <div style={{
                fontSize: "12px", fontStyle: "italic", color: v("text-dim"),
                marginTop: "6px", fontFamily: "var(--font-display)",
              }}>Smith.ai · NextPhone · Marlie</div>
            </div>
            <div style={{
              padding: "24px 28px",
              background: "linear-gradient(180deg, rgba(75,156,211,0.10) 0%, rgba(75,156,211,0.04) 100%)",
              borderBottom: `1px solid ${v("divider")}`,
              borderLeft: `1px solid ${v("divider")}`,
              position: "relative",
            }}>
              <Eyebrow>TSD</Eyebrow>
              <div style={{
                fontSize: "12px", fontStyle: "italic", color: v("text-muted"),
                marginTop: "6px", fontFamily: "var(--font-display)",
              }}>Charlotte trades</div>
            </div>
          </div>

          {SAAS_COMPARISON.map((row, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr 1.4fr",
              borderTop: i === 0 ? "none" : `1px solid ${v("divider-soft")}`,
            }}>
              <div style={{
                padding: "18px 28px", background: v("surface"),
                fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                color: v("text-muted"),
                display: "flex", alignItems: "center",
              }}>{row.axis}</div>
              <div style={{
                padding: "18px 28px", background: v("surface"),
                borderLeft: `1px solid ${v("divider-soft")}`,
                fontSize: "14px", color: v("text-muted"), lineHeight: 1.5,
              }}>{row.saas}</div>
              <div style={{
                padding: "18px 28px",
                background: "rgba(75,156,211,0.05)",
                borderLeft: `1px solid ${v("divider-soft")}`,
                fontSize: "14px", color: v("text"), fontWeight: 500, lineHeight: 1.5,
              }}>{row.tsd}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TheFit() {
  return (
    <section style={{
      padding: `0 24px ${SPACE["3xl"]}`,
      maxWidth: "820px", margin: "0 auto",
    }}>
      <ChapterHead
        label="The Fit"
        num="05"
        title="Already running ServiceTitan or Housecall Pro?"
        sub="You're not our customer — go to Marlie. We're built for the shop owner using Google Calendar and a notepad."
      />
    </section>
  );
}

export default function AIReceptionist() {
  return (
    <PageShell>
      <ReceptionistHero />
      <TheLeak />
      <HowItWorks />
      <TheDifference />
      <TheOffer />
      <TheFit />
      <ClosingCTA />
    </PageShell>
  );
}
