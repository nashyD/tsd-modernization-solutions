import { Link } from "react-router-dom";
import { C, v, useFadeIn, Card, RippleButton, DiamondDivider } from "../shared";
import { CheckIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import BookCallButton from "../components/BookCallButton";

/* Trade-specific landing page — lighter sibling of /ai-receptionist.
   Hero + Math come from the per-trade data file (trades-data.js); the
   Flow / Offer / ClosingCTA are identical to /ai-receptionist's bones
   (no anti-SaaS comparison or disqualification — those stay on the full
   spec page so the buyer who wants depth clicks through).

   Pattern: cold-traffic ad → trade page (this) → /contact?ref={slug}
   for the buy, OR /ai-receptionist for the full spec before deciding. */

/* Section header — matches /ai-receptionist's editorial pattern:
   ◆ LABEL / hairline / § 0N. Inlined here rather than imported so the
   trade pages stay self-contained. */
function ChapterHead({ label, num, title, sub }) {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{ ...fade, marginBottom: "40px", maxWidth: "780px" }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "20px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), display: "inline-flex", alignItems: "center", gap: "8px",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: "8px" }}>{"◆"}</span> {label}
        </span>
        <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
        <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px", whiteSpace: "nowrap" }}>§ {num}</span>
      </div>
      {title && <h2 style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.5px", lineHeight: 1.15,
        color: v("text"), marginBottom: sub ? "14px" : 0,
      }}>{title}</h2>}
      {sub && <p style={{ fontSize: "16px", lineHeight: 1.65, color: v("text-muted") }}>{sub}</p>}
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
      padding: "60px 24px 80px", maxWidth: "920px", margin: "0 auto",
      textAlign: "center",
    }}>
      <div ref={r1} style={{
        ...f1, display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
        fontSize: "10px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase",
        color: v("text-muted"), marginBottom: "32px", flexWrap: "wrap",
      }}>
        <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
        <span>AI Receptionist</span>
        <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
        <span>{trade.vertical}</span>
        <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
        <span>Summer MMXXVI</span>
        <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
      </div>

      <h1 ref={r2} style={{
        ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(32px, 5.2vw, 56px)", letterSpacing: "-1.5px", lineHeight: 1.1,
        color: v("text"), marginBottom: "20px",
      }}>
        {trade.hero.h1}
        <br />
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          background: C.gradientAccent, WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>{trade.hero.h1Italic}</span>
      </h1>

      <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

      <p ref={r3} style={{
        ...f3, fontSize: "17px", lineHeight: 1.7, color: v("text-muted"),
        maxWidth: "620px", margin: "0 auto 32px",
      }}>
        {trade.hero.sub}
      </p>

      <div ref={r4} style={{
        ...f4, display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
        marginBottom: "32px",
      }}>
        <Link to={contactHref}>
          <RippleButton variant="primary" style={{ padding: "16px 36px", fontSize: "15px" }}>
            Reserve a setup spot <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
        <BookCallButton variant="secondary" refSource={trade.slug} style={{ padding: "16px 36px", fontSize: "15px" }}>
          Book a fit call
        </BookCallButton>
        <Link to="/ai-receptionist">
          <RippleButton variant="ghost" style={{ padding: "16px 36px", fontSize: "15px" }}>
            See the full spec
          </RippleButton>
        </Link>
      </div>

      <div ref={r5} style={{
        ...f5, display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
        fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase",
        color: v("text-muted"), flexWrap: "wrap",
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
      ...fade, padding: "40px 24px 60px",
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead
        label="The Math"
        num="01"
        title={trade.math.title}
        sub={trade.math.body}
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

function TheFlow() {
  return (
    <section style={{ padding: "20px 24px 60px", maxWidth: "1100px", margin: "0 auto" }}>
      <ChapterHead
        label="The Flow"
        num="02"
        title="How it works"
      />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px",
      }}>
        {STEPS.map((s, i) => (
          <Card key={s.num} delay={i * 120}>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              fontSize: "44px", lineHeight: 1,
              background: C.gradientAccent, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: "16px",
            }}>{s.num}</div>
            <div style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
              color: v("accent"), marginBottom: "8px",
            }}>Step</div>
            <h3 style={{
              fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "22px",
              color: v("text"), marginBottom: "12px", letterSpacing: "-0.3px",
            }}>{s.title}</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.65, color: v("text-muted") }}>{s.body}</p>
          </Card>
        ))}
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
    <section ref={ref} style={{ ...fade, padding: "20px 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
      <ChapterHead
        label="The Offer"
        num="03"
        title="What you get, what it costs, what we promise."
      />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px",
        alignItems: "stretch",
      }} className="trade-offer-grid">
        <Card delay={0}>
          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("accent"), marginBottom: "20px",
          }}>What's included</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {INCLUDED.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckIcon size={16} style={{ color: C.success, flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "14px", color: v("text-muted"), lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={120} style={{ border: `2px solid ${C.carolina}` }}>
          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("accent"), marginBottom: "20px",
          }}>The price</div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
              fontSize: "20px", color: v("text-dim"), lineHeight: 1,
              textDecoration: "line-through", textDecorationColor: v("text-dim"),
              textDecorationThickness: "1px", marginBottom: "8px",
            }}>$1,500 standard</div>
            <div style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              fontSize: "56px", letterSpacing: "-1px", lineHeight: 1.1,
              paddingBottom: "4px",
              background: C.gradientAccent, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              marginBottom: "10px",
            }}>$497</div>
            <div style={{ fontSize: "13px", color: v("text-muted"), marginBottom: "6px" }}>Founding setup, paid once.</div>
            <div style={{ fontSize: "13px", color: v("text-muted") }}>Agent transfers to you on August 31, 2026. No subscription, no recurring fee.</div>
          </div>

          <div style={{
            padding: "14px 16px", borderRadius: "10px",
            background: "rgba(75,156,211,0.08)",
            border: `1px solid ${v("divider")}`,
            marginBottom: "18px",
          }}>
            <div style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
              color: v("accent"), marginBottom: "6px",
            }}>Risk reversal</div>
            <p style={{ fontSize: "13px", color: v("text"), lineHeight: 1.5 }}>
              If the AI doesn't book a single appointment in your first 30 days, every dollar comes back.
            </p>
          </div>

          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "13px", color: v("text-dim"), lineHeight: 1.55, marginBottom: "20px",
          }}>
            After August 31, ownership transfers. You own the agent, the credentials, and the call log, and you continue the underlying service directly.
          </p>

          <Link to={contactHref}>
            <RippleButton variant="primary" style={{ width: "100%", padding: "14px 0" }}>
              Reserve a setup spot
            </RippleButton>
          </Link>
        </Card>
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
      ...fade, padding: "60px 24px 100px", textAlign: "center",
      maxWidth: "640px", margin: "0 auto",
    }}>
      <DiamondDivider width={120} style={{ marginBottom: "24px" }} />
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "20px", lineHeight: 1.5, color: v("text"), marginBottom: "28px",
      }}>
        Ten spots. Last start: <span style={{ color: v("accent") }}>July 13</span>.
      </p>
      <Link to={contactHref}>
        <RippleButton variant="primary" style={{ padding: "14px 36px", fontSize: "15px" }}>
          Reserve a setup spot <ArrowRightIcon size={16} />
        </RippleButton>
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
