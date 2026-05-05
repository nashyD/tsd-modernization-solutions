import { Link } from "react-router-dom";
import {
  C, v, useFadeIn,
  Button, DiamondDivider,
  Eyebrow, ChapterRule, GradientText, EditorialMasthead,
  SPACE, RADIUS,
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

function RelationshipHero({ rel }) {
  const [r1, f1] = useFadeIn(100);
  const [r2, f2] = useFadeIn(300);
  const [r3, f3] = useFadeIn(500);
  const [r4, f4] = useFadeIn(700);
  const contactHref = `/contact?ref=${rel.slug}`;
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
        <EditorialMasthead items={["Website + AI Build", rel.vertical, "Summer MMXXVI"]} />
      </div>

      <h1 ref={r2} style={{
        ...f2, fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(34px, 5.4vw, 60px)",
        letterSpacing: "-2px", lineHeight: 1.1,
        color: v("text"), marginBottom: SPACE.lg,
        position: "relative", zIndex: 1,
      }}>
        {rel.hero.h1}
        <br />
        <GradientText>{rel.hero.h1Italic}</GradientText>
      </h1>

      <DiamondDivider width={180} style={{ marginBottom: SPACE.lg }} />

      <p ref={r3} style={{
        ...f3, fontSize: "17px", lineHeight: 1.65, color: v("text-muted"),
        maxWidth: "640px", margin: "0 auto 36px",
        position: "relative", zIndex: 1,
      }}>
        {rel.hero.sub}
      </p>

      <div ref={r4} style={{
        ...f4, display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
        position: "relative", zIndex: 1,
      }}>
        <Link to={contactHref} style={{ textDecoration: "none" }}>
          <Button as="span" variant="primary" size="lg" iconRight={<ArrowRightIcon size={16} />}>
            Apply for a founding slot
          </Button>
        </Link>
        <BookCallButton variant="ghost" refSource={rel.slug}>
          Book a fit call
        </BookCallButton>
        <Link to="/pricing" style={{ textDecoration: "none" }}>
          <Button as="span" variant="secondary" size="lg">
            See pricing
          </Button>
        </Link>
      </div>
    </section>
  );
}

function TheBuild({ rel }) {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade, padding: `${SPACE.xl} 24px ${SPACE["4xl"]}`,
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <ChapterHead label="The Build" num="01" title={rel.build.title} sub={rel.build.sub} />

      <div style={{
        display: "flex", flexDirection: "column", gap: "12px",
        maxWidth: "820px",
      }}>
        {rel.build.bullets.map((bullet, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "16px",
            padding: "20px 24px",
            borderRadius: RADIUS.lg,
            background: v("surface"),
            border: `1px solid ${v("surface-border")}`,
            transition: "border-color 0.25s ease",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = v("surface-border-hover")}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = v("surface-border")}
          >
            <div style={{
              flexShrink: 0, marginTop: "2px",
              width: "22px", height: "22px", borderRadius: RADIUS.full,
              background: "rgba(6,214,160,0.16)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: C.success,
            }}>
              <CheckIcon size={13} strokeWidth={2.5} />
            </div>
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
      ...fade, padding: `${SPACE.lg} 24px ${SPACE["4xl"]}`,
      textAlign: "center",
      maxWidth: "720px", margin: "0 auto",
    }}>
      <DiamondDivider width={120} style={{ marginBottom: SPACE.lg }} />
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "22px", lineHeight: 1.45, color: v("text"),
        marginBottom: SPACE.sm,
      }}>
        $5,000 founding rate <span style={{ color: v("text-dim") }}>(anchor $10,000).</span>
      </p>
      <p style={{
        fontSize: "15px", lineHeight: 1.65, color: v("text-muted"),
        marginBottom: SPACE.xl,
      }}>
        Ten spots. Last start: <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          color: v("accent"), fontWeight: 600,
        }}>July 13</span>. 100% money-back guarantee.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to={contactHref} style={{ textDecoration: "none" }}>
          <Button as="span" variant="primary" size="lg" iconRight={<ArrowRightIcon size={16} />}>
            Apply for a founding slot
          </Button>
        </Link>
        <BookCallButton variant="ghost" refSource={rel.slug}>
          Book a fit call
        </BookCallButton>
        <Link to="/pricing" style={{ textDecoration: "none" }}>
          <Button as="span" variant="secondary" size="lg">
            See both tiers
          </Button>
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
