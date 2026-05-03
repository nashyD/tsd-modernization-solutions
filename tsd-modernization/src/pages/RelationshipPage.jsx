import { Link } from "react-router-dom";
import { C, v, useFadeIn, RippleButton, DiamondDivider } from "../shared";
import { CheckIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import BookCallButton from "../components/BookCallButton";

/* Relationship-channel landing page — sibling of TradePage.jsx but lighter
   and bundle-led (not receptionist-led). Three sections + closing:

     1. Hero  — vertical-specific H1 + sub + dual CTAs
     2. The Build  — vertical-specific bullet list
     3. ClosingCTA — links to /pricing for the offer + /contact for direct

   The relationship buyer arrived via founder DM and already heard the
   $5,000 bundle pitch over text. The page's job is recognition (yes we
   work with your vertical), not conversion. Skip the offer card; link
   to /pricing for the full three-tier breakdown. */

/* Editorial section header — matches the ◆ LABEL / hairline / § 0N pattern
   used on /ai-receptionist and /hvac etc. Inlined here so the relationship
   pages stay self-contained. */
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

function RelationshipHero({ rel }) {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  const [r3, f3] = useFadeIn(500);
  const [r4, f4] = useFadeIn(700);
  const contactHref = `/contact?ref=${rel.slug}`;
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
        <span>Website + AI Bundle</span>
        <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
        <span>{rel.vertical}</span>
        <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
        <span>Summer MMXXVI</span>
        <span style={{ flex: "0 0 44px", height: "1px", background: v("divider") }} />
      </div>

      <h1 ref={r2} style={{
        ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(32px, 5.2vw, 56px)", letterSpacing: "-1.5px", lineHeight: 1.1,
        color: v("text"), marginBottom: "20px",
      }}>
        {rel.hero.h1}
        <br />
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          background: C.gradientAccent, WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>{rel.hero.h1Italic}</span>
      </h1>

      <DiamondDivider width={160} style={{ marginBottom: "20px" }} />

      <p ref={r3} style={{
        ...f3, fontSize: "17px", lineHeight: 1.7, color: v("text-muted"),
        maxWidth: "620px", margin: "0 auto 32px",
      }}>
        {rel.hero.sub}
      </p>

      <div ref={r4} style={{
        ...f4, display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
      }}>
        <Link to={contactHref}>
          <RippleButton variant="primary" style={{ padding: "16px 36px", fontSize: "15px" }}>
            Apply for a founding slot <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
        <BookCallButton variant="secondary" refSource={rel.slug} style={{ padding: "16px 36px", fontSize: "15px" }}>
          Book a fit call
        </BookCallButton>
        <Link to="/pricing">
          <RippleButton variant="ghost" style={{ padding: "16px 36px", fontSize: "15px" }}>
            See pricing
          </RippleButton>
        </Link>
      </div>
    </section>
  );
}

function TheBuild({ rel }) {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: "40px 24px 80px",
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead
        label="The Build"
        num="01"
        title={rel.build.title}
        sub={rel.build.sub}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "820px" }}>
        {rel.build.bullets.map((bullet, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "14px",
            padding: "18px 22px",
            borderRadius: "12px",
            background: v("surface"),
            border: `1px solid ${v("surface-border")}`,
          }}>
            <CheckIcon size={18} style={{ color: C.success, flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "15px", color: v("text"), lineHeight: 1.55 }}>{bullet}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCTA({ rel }) {
  const [ref, fade] = useFadeIn(0);
  const contactHref = `/contact?ref=${rel.slug}`;
  return (
    <section ref={ref} style={{
      ...fade, padding: "20px 24px 100px", textAlign: "center",
      maxWidth: "640px", margin: "0 auto",
    }}>
      <DiamondDivider width={120} style={{ marginBottom: "24px" }} />
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "20px", lineHeight: 1.5, color: v("text"), marginBottom: "10px",
      }}>
        $5,000 founding rate (anchor $10,000).
      </p>
      <p style={{
        fontSize: "15px", lineHeight: 1.65, color: v("text-muted"),
        marginBottom: "28px",
      }}>
        Ten spots. Last start: <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", color: v("accent"),
        }}>July 13</span>. 100% money-back guarantee.
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to={contactHref}>
          <RippleButton variant="primary" style={{ padding: "14px 32px", fontSize: "15px" }}>
            Apply for a founding slot <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
        <BookCallButton variant="secondary" refSource={rel.slug} style={{ padding: "14px 32px", fontSize: "15px" }}>
          Book a fit call
        </BookCallButton>
        <Link to="/pricing">
          <RippleButton variant="ghost" style={{ padding: "14px 32px", fontSize: "15px" }}>
            See both tiers
          </RippleButton>
        </Link>
      </div>
    </section>
  );
}

export default function RelationshipPage({ rel }) {
  return (
    <PageShell>
      <RelationshipHero rel={rel} />
      <TheBuild rel={rel} />
      <ClosingCTA rel={rel} />
    </PageShell>
  );
}
