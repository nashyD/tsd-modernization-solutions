import { Link } from "react-router-dom";
import { C, v, useFadeIn, DiamondDivider, RippleButton } from "../shared";
import { ArrowRightIcon, ClockIcon, ChartBarIcon, ClipboardIcon } from "../icons";
import PageShell from "./PageShell";

const LEDGER_COLUMNS = [
  {
    number: "I",
    icon: ClockIcon,
    label: "What we measure",
    headline: "Hours reclaimed and minutes saved.",
    body: "Every engagement begins with a before-measurement — the manual process, the load time, the weekly hours spent. We log the baseline, ship the fix, and measure again four weeks later. The delta is the case study.",
    sampleLabel: "Sample metric",
    sample: "34 hrs/week of manual invoicing \u2192 4 hrs/week after automation",
  },
  {
    number: "II",
    icon: ClipboardIcon,
    label: "How we report",
    headline: "Problem, build, outcome — in that order.",
    body: "Each case study follows the same three-part structure. First: what was wrong, in the owner's own words. Second: what we built and why that approach. Third: what changed — numbers, screenshots, before/after comparisons.",
    sampleLabel: "Sample format",
    sample: "Problem \u25B8 Build \u25B8 Outcome \u2014 documented, linkable, dated.",
  },
  {
    number: "III",
    icon: ChartBarIcon,
    label: "What you'll see",
    headline: "Real names, real numbers, real businesses.",
    body: "When our first engagements wrap, this page becomes the ledger. Named clients. Photos of the storefronts and teams. Specific dollar figures where disclosed, methodology citations where not. No stock photos, no anonymous quotes.",
    sampleLabel: "Coming first",
    sample: "Three Charlotte-area founding clients shipping spring \u2013 summer 2026.",
  },
];

export default function Testimonials() {
  const [introRef, introFade] = useFadeIn(0);
  const [ctaRef, ctaFade] = useFadeIn(200);

  return (
    <PageShell>
      <div style={{ padding: "40px 48px 100px", maxWidth: "1120px", margin: "0 auto" }}>
        {/* Editorial masthead */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
            color: v("accent"),
          }}>
            <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  The Ledger
          </span>
          <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
          <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px" }}>{"Vol. I \u2014 Opening Entries"}</span>
        </div>

        <div ref={introRef} style={{ ...introFade, marginBottom: "72px" }}>
          <h1 style={{
            fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "clamp(36px, 6vw, 68px)",
            letterSpacing: "-2px", lineHeight: 1.18, color: v("text"), marginBottom: "24px",
            maxWidth: "900px",
          }}>
            We're booking founding clients now.{" "}
            <span style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>The ledger opens this spring.</span>
          </h1>
          <p style={{
            fontSize: "18px", lineHeight: 1.65, color: v("text-muted"),
            maxWidth: "680px",
          }}>
            Instead of a placeholder, here's the method. This is exactly how every engagement will be documented when our first case studies land — so you can hold the receipts before we have any.
          </p>
        </div>

        <DiamondDivider width={200} style={{ marginBottom: "56px" }} />

        {/* Three methodology columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "1px",
          background: v("divider"),
          borderRadius: "24px",
          overflow: "hidden",
          border: `1px solid ${v("surface-border")}`,
          marginBottom: "72px",
        }}>
          {LEDGER_COLUMNS.map((col, i) => (
            <LedgerColumn key={i} col={col} delay={i * 140} />
          ))}
        </div>

        {/* Provisional entries row — shows the template filled with "coming" markers */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
            color: v("accent"),
          }}>
            <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  Provisional Entries
          </span>
          <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
          <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px", fontStyle: "italic" }}>pending first ship</span>
        </div>

        <div style={{ display: "grid", gap: "16px", marginBottom: "72px" }}>
          {["No. 01", "No. 02", "No. 03"].map((num, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "24px",
              alignItems: "center",
              padding: "20px 24px",
              background: v("surface"),
              border: `1px dashed ${v("surface-border")}`,
              borderRadius: "14px",
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
                fontSize: "28px", color: v("accent"), letterSpacing: "-1px",
                minWidth: "60px",
              }}>
                {num}
              </div>
              <div style={{
                fontSize: "14px", color: v("text-dim"), fontStyle: "italic",
                fontFamily: "var(--font-display)",
              }}>
                {"Awaiting first ship \u2014 client name, outcome, and case study land here."}
              </div>
              <div style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
                color: v("text-dim"),
                padding: "4px 10px", borderRadius: "100px",
                border: `1px solid ${v("divider")}`,
              }}>
                Open slot
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{
          ...ctaFade,
          padding: "clamp(36px, 5vw, 56px) clamp(28px, 4vw, 48px)",
          borderRadius: "24px",
          background: C.gradientPrism,
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 20px 60px rgba(19,41,75,0.25)",
        }}>
          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)", marginBottom: "14px",
          }}>
            <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  An opportunity
          </div>
          <h2 style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800,
            letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "14px",
          }}>
            Take one of the open entries.
          </h2>
          <p style={{
            fontSize: "16px", lineHeight: 1.65, color: "rgba(255,255,255,0.9)",
            maxWidth: "560px", margin: "0 auto 28px",
          }}>
            Founding-client pricing and a named case study on this page the week we wrap. Three slots available.
          </p>
          <Link to="/contact">
            <RippleButton variant="secondary" style={{
              padding: "16px 36px", fontSize: "15px",
              background: "#fff", color: C.navy, borderColor: "transparent",
            }}>
              Claim a founding slot <ArrowRightIcon size={16} />
            </RippleButton>
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
      padding: "36px 32px",
      background: v("surface"),
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: C.gradientAccent, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={22} />
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          fontSize: "38px", color: v("text-dim"), lineHeight: 1, letterSpacing: "-1px",
        }}>{col.number}</div>
      </div>

      <div style={{
        fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
        color: v("accent"), marginBottom: "12px",
      }}>
        {col.label}
      </div>

      <h3 style={{
        fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 700,
        color: v("text"), marginBottom: "14px", lineHeight: 1.2, letterSpacing: "-0.3px",
      }}>
        {col.headline}
      </h3>

      <p style={{
        fontSize: "14px", lineHeight: 1.7, color: v("text-muted"),
        marginBottom: "24px", flex: 1,
      }}>
        {col.body}
      </p>

      <div style={{
        marginTop: "auto",
        paddingTop: "20px",
        borderTop: `1px solid ${v("divider")}`,
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
