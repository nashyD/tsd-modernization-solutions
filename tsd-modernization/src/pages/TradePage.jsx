import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  Card, Button, DiamondDivider,
  Eyebrow, ChapterRule, GradientText, EditorialMasthead,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { CheckIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import BookCallButton from "../components/BookCallButton";

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
        fontSize: "16px", lineHeight: 1.65, color: v("text-muted"),
      }}>{sub}</p>}
    </div>
  );
}

function TradeHero({ trade }) {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  const [r3, f3] = useFadeIn(500);
  const [r4, f4] = useFadeIn(700);
  const [r5, f5] = useFadeIn(900);
  const contactHref = `/contact?ref=${trade.slug}`;
  return (
    <section style={{
      padding: `${SPACE["3xl"]} 24px ${SPACE["4xl"]}`,
      maxWidth: "960px", margin: "0 auto",
      textAlign: "center",
      position: "relative",
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
        width: "70%", height: "60%",
        background: "radial-gradient(ellipse, rgba(75,156,211,0.10) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div ref={r1} style={{ ...f1, marginBottom: SPACE.xl, position: "relative", zIndex: 1 }}>
        <EditorialMasthead items={["AI Receptionist", trade.vertical, "Summer MMXXVI"]} />
      </div>

      <h1 ref={r2} style={{
        ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(34px, 5.4vw, 60px)",
        letterSpacing: "-2px", lineHeight: 1.1,
        color: v("text"), marginBottom: SPACE.lg,
        position: "relative", zIndex: 1,
      }}>
        {trade.hero.h1}
        <br />
        <GradientText>{trade.hero.h1Italic}</GradientText>
      </h1>

      <DiamondDivider width={180} style={{ marginBottom: SPACE.lg }} />

      <p ref={r3} style={{
        ...f3, fontSize: "17px", lineHeight: 1.65, color: v("text-muted"),
        maxWidth: "640px", margin: "0 auto 36px",
        position: "relative", zIndex: 1,
      }}>
        {trade.hero.sub}
      </p>

      <div ref={r4} style={{
        ...f4, display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
        marginBottom: SPACE.xl, position: "relative", zIndex: 1,
      }}>
        <Link to={contactHref} style={{ textDecoration: "none" }}>
          <Button as="span" variant="primary" size="lg" iconRight={<ArrowRightIcon size={16} />}>
            Reserve a setup spot
          </Button>
        </Link>
        <BookCallButton variant="ghost" refSource={trade.slug}>
          Book a fit call
        </BookCallButton>
        <Link to="/ai-receptionist" style={{ textDecoration: "none" }}>
          <Button as="span" variant="secondary" size="lg">
            See the full spec
          </Button>
        </Link>
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

function TheMath({ trade }) {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: `${SPACE.xl} 24px ${SPACE["2xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead label="The Math" num="01" title={trade.math.title} sub={trade.math.body} />
    </section>
  );
}

const STEPS = [
  { num: "01", title: "Forward", body: "After-hours calls forward to a dedicated AI line. Set a time window — nights only, weekends only, always-on. Your call." },
  { num: "02", title: "Answer", body: "AI answers in your business voice, captures name, service, urgency, and address. Books an appointment slot from your calendar in real time." },
  { num: "03", title: "Confirm", body: "You get an SMS with the booking and a one-paragraph call summary. Caller gets a confirmation text. You call back when ready." },
];

function TheFlow() {
  return (
    <section style={{
      padding: `${SPACE.lg} 24px ${SPACE["3xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead label="The Flow" num="02" title="How it works" />
      <div style={{ position: "relative" }}>
        <div aria-hidden="true" className="step-rail" style={{
          position: "absolute", top: "44px", left: "12%", right: "12%", height: "1px",
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
                color: v("text"), marginBottom: SPACE.sm, letterSpacing: "-0.3px",
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

function TheOffer({ trade }) {
  const [ref, fade] = useFadeIn(0);
  const contactHref = `/contact?ref=${trade.slug}`;
  return (
    <section ref={ref} style={{
      ...fade, padding: `${SPACE.lg} 24px ${SPACE["4xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead label="The Offer" num="03" title="What you get, what it costs, what we promise." />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.xl,
        alignItems: "stretch",
      }} className="trade-offer-grid">
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

          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "13px", color: v("text-dim"), lineHeight: 1.6,
            marginBottom: SPACE.lg,
          }}>
            After August 31, ownership transfers. You own the agent, the credentials, and the call log, and you continue the underlying service directly.
          </p>

          <Link to={contactHref} style={{ textDecoration: "none" }}>
            <Button as="span" variant="primary" fullWidth iconRight={<ArrowRightIcon size={14} />}>
              Reserve a setup spot
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .trade-offer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}

function ClosingCTA({ trade }) {
  const [ref, fade] = useFadeIn(0);
  const contactHref = `/contact?ref=${trade.slug}`;
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
      <Link to={contactHref} style={{ textDecoration: "none" }}>
        <Button as="span" variant="primary" size="lg" iconRight={<ArrowRightIcon size={16} />}>
          Reserve a setup spot
        </Button>
      </Link>
    </section>
  );
}

export default function TradePage({ trade }) {
  return (
    <PageShell>
      <TradeHero trade={trade} />
      <TheMath trade={trade} />
      <TheFlow />
      <TheOffer trade={trade} />
      <ClosingCTA trade={trade} />
    </PageShell>
  );
}
