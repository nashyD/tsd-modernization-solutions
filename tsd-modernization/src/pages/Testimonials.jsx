import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  DiamondDivider, Button,
  Eyebrow, ChapterRule, GradientText,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { ArrowRightIcon, ClockIcon, ChartBarIcon, ClipboardIcon } from "../icons";
import PageShell from "./PageShell";

const LEDGER_COLUMNS = [
  {
    number: "1",
    icon: ClockIcon,
    label: "What we measure",
    headline: "Hours reclaimed and minutes saved.",
    body: "Every engagement begins with a before-measurement — the manual process, the load time, the weekly hours spent. We log the baseline, ship the fix, and measure again four weeks later. The delta is the case study.",
    sampleLabel: "Sample metric",
    sample: "34 hrs/week of manual invoicing → 4 hrs/week after automation",
  },
  {
    number: "2",
    icon: ClipboardIcon,
    label: "How we report",
    headline: "Problem, build, outcome — in that order.",
    body: "Each case study follows the same three-part structure. First: what was wrong, in the owner's own words. Second: what we built and why that approach. Third: what changed — numbers, screenshots, before/after comparisons.",
    sampleLabel: "Sample format",
    sample: "Problem ▸ Build ▸ Outcome — documented, linkable, dated.",
  },
  {
    number: "3",
    icon: ChartBarIcon,
    label: "What you'll see",
    headline: "Real names, real numbers, real businesses.",
    body: "When our first engagements wrap, this page becomes the ledger. Named clients. Photos of the storefronts and teams. Specific dollar figures where disclosed, methodology citations where not. No stock photos, no anonymous quotes.",
    sampleLabel: "Coming first",
    sample: "Charlotte-area clients shipping their first builds.",
  },
];

export default function Testimonials() {
  const [introRef, introFade] = useFadeIn(0);
  const [ctaRef, ctaFade] = useFadeIn(200);

  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1140px", margin: "0 auto",
      }}>
        <ChapterRule label="The Ledger" num="Vol. 1 — Opening Entries" style={{ marginBottom: SPACE.lg }} />

        <div ref={introRef} style={{ ...introFade, marginBottom: SPACE["3xl"] }}>
          <h1 style={{
            fontFamily: "var(--font-body)", fontWeight: 800,
            fontSize: "clamp(40px, 6vw, 72px)",
            letterSpacing: "-2.5px", lineHeight: 1.06,
            color: v("text"), marginBottom: SPACE.lg,
            maxWidth: "920px",
          }}>
            Case studies are coming soon.{" "}
            <GradientText>Here's how we'll document them.</GradientText>
          </h1>
          <p style={{
            fontSize: "18px", lineHeight: 1.6, color: v("text-muted"),
            maxWidth: "700px",
          }}>
            Instead of a placeholder, here's the method. This is exactly how every engagement will be documented when our first case studies land — so you can hold the receipts before we have any.
          </p>
        </div>

        <DiamondDivider width={200} style={{ marginBottom: SPACE["3xl"] }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1px",
          background: v("divider-soft"),
          borderRadius: RADIUS["2xl"],
          overflow: "hidden",
          border: `1px solid ${v("surface-border")}`,
          marginBottom: SPACE["3xl"],
          boxShadow: SHADOW.sm,
        }}>
          {LEDGER_COLUMNS.map((col, i) => (
            <LedgerColumn key={i} col={col} delay={i * 140} />
          ))}
        </div>

        <ChapterRule label="Provisional Entries" num="pending first ship" style={{ marginBottom: SPACE.lg }} />

        <div style={{ display: "grid", gap: "12px", marginBottom: SPACE["3xl"] }}>
          {["No. 01", "No. 02", "No. 03"].map((num, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: SPACE.lg, alignItems: "center",
              padding: "22px 26px",
              background: v("surface"),
              border: `1px dashed ${v("surface-border")}`,
              borderRadius: RADIUS.lg,
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
                fontSize: "32px", letterSpacing: "-1px",
                background: C.gradientAccent,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                minWidth: "60px",
              }}>
                {num}
              </div>
              <div style={{
                fontSize: "14px", color: v("text-dim"), fontStyle: "italic",
                fontFamily: "var(--font-display)",
              }}>
                Client name, outcome, and case study land here once the first builds wrap.
              </div>
              <div style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
                color: v("text-dim"),
                padding: "5px 12px", borderRadius: RADIUS.full,
                border: `1px solid ${v("divider")}`,
              }}>
                Coming soon
              </div>
            </div>
          ))}
        </div>

        <div ref={ctaRef} style={{
          ...ctaFade,
          padding: "clamp(40px, 6vw, 64px) clamp(28px, 5vw, 56px)",
          borderRadius: RADIUS["2xl"],
          background: C.gradientPrism,
          textAlign: "center", color: "#fff",
          boxShadow: "0 28px 80px rgba(19,41,75,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
          position: "relative", overflow: "hidden",
        }}>
          <span aria-hidden="true" style={{
            position: "absolute", top: "-50px", right: "-50px",
            fontSize: "260px", color: "#fff", opacity: 0.04,
            lineHeight: 1, pointerEvents: "none",
          }}>{"◆"}</span>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "6px 14px", borderRadius: RADIUS.full,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.22)",
            fontSize: "11px", fontWeight: 700, letterSpacing: "3px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
            marginBottom: SPACE.md,
          }}>
            <span style={{ fontSize: "8px" }}>{"◆"}</span> Be an early entry
          </div>
          <h2 style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: SPACE.md,
          }}>
            Be one of the first entries in the ledger.
          </h2>
          <p style={{
            fontSize: "16px", lineHeight: 1.6,
            color: "rgba(255,255,255,0.92)",
            maxWidth: "560px", margin: `0 auto ${SPACE.xl}`,
          }}>
            Start a project now and your build becomes a named case study on this page the week we wrap. Free fit call, 48-hour proposal, money-back guarantee.
          </p>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <Button as="span" variant="onAccent" size="lg" iconRight={<ArrowRightIcon size={16} />}>
              Start a project
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function LedgerColumn({ col, delay }) {
  const [ref, fade] = useFadeIn(delay);
  const Icon = col.icon;
  return (
    <div ref={ref} style={{
      ...fade,
      padding: "40px 32px",
      background: v("surface"),
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "16px", marginBottom: SPACE["2xl"],
      }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: RADIUS.md,
          background: C.gradientAccent, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 18px rgba(75,156,211,0.32)",
        }}>
          <Icon size={22} />
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          fontSize: "44px", color: v("text-dim"), lineHeight: 0.9, letterSpacing: "-1.5px",
        }}>{col.number}</div>
      </div>

      <Eyebrow style={{ marginBottom: SPACE.sm }}>{col.label}</Eyebrow>

      <h3 style={{
        fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 700,
        color: v("text"), marginBottom: SPACE.md,
        lineHeight: 1.2, letterSpacing: "-0.3px",
      }}>
        {col.headline}
      </h3>

      <p style={{
        fontSize: "14px", lineHeight: 1.7, color: v("text-muted"),
        marginBottom: SPACE.lg, flex: 1,
      }}>
        {col.body}
      </p>

      <div style={{
        marginTop: "auto",
        paddingTop: SPACE.md,
        borderTop: `1px solid ${v("divider-soft")}`,
      }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
          color: v("text-dim"), marginBottom: "6px",
        }}>
          {col.sampleLabel}
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
          fontSize: "14px", lineHeight: 1.5, color: v("text"),
        }}>
          {col.sample}
        </div>
      </div>
    </div>
  );
}
