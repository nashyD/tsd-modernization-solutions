import { Link } from "react-router-dom";
import {
  v, useFadeIn, DiamondDivider,
  ChapterRule, GradientText, PillBadge, Card,
  SPACE,
} from "../shared";
import { ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import { POSTS } from "../news-data.js";

export default function News() {
  const [introRef, introFade] = useFadeIn(0);

  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1140px", margin: "0 auto",
      }}>
        <ChapterRule label="Field Notes" num="The TSD Journal" style={{ marginBottom: SPACE.lg }} />

        <div ref={introRef} style={{ ...introFade, marginBottom: SPACE["3xl"] }}>
          <h1 style={{
            fontFamily: "var(--font-body)", fontWeight: 800,
            fontSize: "clamp(40px, 6vw, 72px)",
            letterSpacing: "-2.5px", lineHeight: 1.06,
            color: v("text"), marginBottom: SPACE.lg, maxWidth: "920px",
          }}>
            What we've been building,{" "}
            <GradientText>in the open.</GradientText>
          </h1>
          <p style={{
            fontSize: "18px", lineHeight: 1.6, color: v("text-muted"),
            maxWidth: "700px",
          }}>
            Short, honest updates on what we ship for local businesses: the wins, the real numbers, and what we learned. The same way we'd tell you over coffee.
          </p>
        </div>

        <DiamondDivider width={200} style={{ marginBottom: SPACE["3xl"] }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: SPACE.lg,
        }}>
          {POSTS.map((p, i) => (
            <Link key={p.slug} to={`/news/${p.slug}`} style={{ textDecoration: "none" }}>
              <Card delay={i * 100} style={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: SPACE.md }}>
                  <PillBadge>{p.tag}</PillBadge>
                  <span style={{ fontSize: "13px", color: v("text-dim") }}>{p.date}</span>
                </div>
                <h2 style={{
                  fontFamily: "var(--font-body)", fontWeight: 700,
                  fontSize: "24px", letterSpacing: "-0.5px", lineHeight: 1.2,
                  color: v("text"), marginBottom: SPACE.sm,
                }}>
                  {p.title}
                </h2>
                <p style={{
                  fontSize: "15px", lineHeight: 1.65, color: v("text-muted"),
                  marginBottom: SPACE.lg, flex: 1,
                }}>
                  {p.excerpt}
                </p>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "14px", fontWeight: 700, color: v("accent"),
                }}>
                  Read <ArrowRightIcon size={14} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
