import { Link, useParams } from "react-router-dom";
import {
  C, v, useFadeIn, DiamondDivider, Button, PillBadge,
  SPACE, RADIUS,
} from "../shared";
import { ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import { getPost } from "../news-data.js";

export default function NewsDetail() {
  const { slug } = useParams();
  const post = getPost(slug);
  const [bodyRef, bodyFade] = useFadeIn(80);

  if (!post) {
    return (
      <PageShell>
        <div style={{
          padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
          maxWidth: "760px", margin: "0 auto", textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "32px",
            color: v("text"), marginBottom: SPACE.lg,
          }}>
            That post moved on.
          </h1>
          <Link to="/news" style={{ color: v("accent"), fontWeight: 700, textDecoration: "none" }}>
            ← Back to Field Notes
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "760px", margin: "0 auto",
      }}>
        <Link to="/news" style={{
          display: "inline-block", fontSize: "14px", fontWeight: 600,
          color: v("text-muted"), textDecoration: "none", marginBottom: SPACE.xl,
        }}>
          ← Field Notes
        </Link>

        <div style={{
          display: "flex", alignItems: "center", gap: SPACE.md,
          marginBottom: SPACE.lg, flexWrap: "wrap",
        }}>
          <PillBadge>{post.tag}</PillBadge>
          <span style={{ fontSize: "13px", color: v("text-dim") }}>
            {post.date} · {post.readMins} min read
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-body)", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 52px)",
          letterSpacing: "-1.5px", lineHeight: 1.1,
          color: v("text"), marginBottom: SPACE.lg,
        }}>
          {post.title}
        </h1>

        <p style={{
          fontSize: "19px", lineHeight: 1.6, color: v("text-muted"),
          marginBottom: SPACE["2xl"],
        }}>
          {post.lead}
        </p>

        {post.stats && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: SPACE.md, marginBottom: SPACE["2xl"],
          }}>
            {post.stats.map((s, i) => (
              <div key={i} style={{
                padding: SPACE.lg,
                background: v("surface"),
                border: `1px solid ${v("surface-border")}`,
                borderRadius: RADIUS.lg,
              }}>
                <div style={{
                  fontFamily: "var(--font-body)", fontWeight: 800,
                  fontSize: "32px", letterSpacing: "-1px", lineHeight: 1,
                  background: C.gradientAccent,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: SPACE.xs,
                  fontFeatureSettings: '"tnum" 1',
                }}>{s.value}</div>
                <div style={{ fontSize: "13px", lineHeight: 1.45, color: v("text-muted") }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <DiamondDivider width={200} style={{ marginBottom: SPACE["2xl"] }} />

        <div ref={bodyRef} style={bodyFade}>
          {post.sections.map((sec, i) => (
            <section key={i} style={{ marginBottom: SPACE.xl }}>
              <h2 style={{
                fontFamily: "var(--font-body)", fontWeight: 700,
                fontSize: "22px", letterSpacing: "-0.3px", lineHeight: 1.25,
                color: v("text"), marginBottom: SPACE.md,
              }}>
                {sec.heading}
              </h2>
              {sec.paras.map((para, j) => (
                <p key={j} style={{
                  fontSize: "17px", lineHeight: 1.75, color: v("text-muted"),
                  marginBottom: SPACE.md,
                }}>
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        {post.closer && (
          <p style={{
            fontSize: "17px", lineHeight: 1.75, color: v("text"), fontWeight: 500,
            margin: `${SPACE.xl} 0 ${SPACE["2xl"]}`,
          }}>
            {post.closer}
          </p>
        )}

        <div style={{
          padding: "clamp(32px, 5vw, 48px)",
          borderRadius: RADIUS["2xl"],
          background: C.gradientPrism,
          textAlign: "center", color: "#fff",
          boxShadow: "0 28px 80px rgba(19,41,75,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}>
          <h2 style={{
            fontFamily: "var(--font-body)", fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 34px)", letterSpacing: "-0.6px",
            lineHeight: 1.1, marginBottom: SPACE.md,
          }}>
            Think your business has a leak?
          </h2>
          <p style={{
            fontSize: "16px", lineHeight: 1.6, color: "rgba(255,255,255,0.92)",
            maxWidth: "500px", margin: `0 auto ${SPACE.xl}`,
          }}>
            The fit call is free, the cost-cut audit is yours to keep, and you'll have a fixed-price proposal within 48 hours.
          </p>
          <Link to="/book" style={{ textDecoration: "none" }}>
            <Button as="span" variant="onAccent" size="lg" iconRight={<ArrowRightIcon size={16} />}>
              Book a free fit call
            </Button>
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
