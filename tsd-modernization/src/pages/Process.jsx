import {
  C, v, useFadeIn,
  SectionHeader, Card,
  Eyebrow, ChapterRule, GradientText,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import PageShell from "./PageShell";

const STEPS = [
  { num: "01", title: "Fit call", desc: "A 1-2 hour conversation where we walk through your business, your operations, and what you'd want modernized. You leave with a clear read on whether we're the right fit.", detail: "In-person or remote. Free, no commitment. If we're a match, the next step is a $1,500 discovery audit or a written proposal for the Website + AI Build." },
  { num: "02", title: "Proposal", desc: "Within 48 hours, you receive a written modernization roadmap with clear scope, timeline, and pricing. No surprises.", detail: "Typically 2-4 pages. Includes technical approach, deliverables, and payment schedule." },
  { num: "03", title: "Build", desc: "We execute the project on a 2-4 week timeline with regular check-ins. You see progress throughout, not just at the end.", detail: "Weekly updates. Revisions included. We don't disappear." },
  { num: "04", title: "Handoff", desc: "Every project ends with written documentation, video tutorials, and a live training session. You own the source code, the credentials, and the deployment when we're done.", detail: "One founder stays on call for fixes through August 31, 2026." },
];

function PostSeason() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade,
      padding: `${SPACE.lg} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "920px", margin: "0 auto",
    }}>
      <ChapterRule label="After August 31" num="02" style={{ marginBottom: SPACE.xl, marginTop: SPACE.xl }} />

      <h2 style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(30px, 4vw, 44px)",
        letterSpacing: "-0.8px", lineHeight: 1.1,
        color: v("text"), marginBottom: SPACE.lg,
      }}>
        You're not <GradientText>on your own.</GradientText>
      </h2>

      <div style={{
        display: "flex", flexDirection: "column", gap: "20px",
        fontSize: "16px", lineHeight: 1.7, color: v("text-muted"),
        maxWidth: "740px",
      }}>
        <p>Every TSD build ships on GitHub + Vercel — both free for small business. The repo, the deployment, and the domain belong to you from day one.</p>
        <p>During handoff we link your Claude account to your GitHub repo. When you want to make a change to your site, you screenshot what you want — anything from your hours to your hero photo — and send it to Claude. Claude commits the fix, and Vercel deploys it automatically. You learn the workflow in the training session, and after a few cycles it's muscle memory.</p>
        <p>One founder stays on call for fixes through August 31. Past that, your codebase has a co-pilot.</p>
      </div>
    </section>
  );
}

export default function Process() {
  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE.lg}`,
        maxWidth: "920px", margin: "0 auto",
      }}>
        <SectionHeader center label="How It Works" title="Our" titleAccent="process"
          sub="From first meeting to final handoff, here's how every engagement works." />

        <div style={{ position: "relative" }}>
          {/* Vertical rail connecting the four steps */}
          <div aria-hidden="true" className="step-rail" style={{
            position: "absolute", top: "60px", bottom: "60px",
            left: "39px",
            width: "1px",
            background: "linear-gradient(180deg, transparent, rgba(75,156,211,0.4) 10%, rgba(75,156,211,0.4) 90%, transparent)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {STEPS.map((s, i) => (
              <Card key={i} delay={i * 100} style={{
                display: "grid", gridTemplateColumns: "80px 1fr",
                gap: "28px", alignItems: "start",
                padding: "32px",
              }}>
                <div style={{
                  width: "80px", height: "80px",
                  borderRadius: RADIUS.full,
                  background: `linear-gradient(135deg, ${v("bg-alt")} 0%, ${v("surface")} 100%)`,
                  border: `1px solid ${v("surface-border")}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", zIndex: 1,
                  boxShadow: SHADOW.sm,
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
                    fontSize: "32px",
                    background: C.gradientAccent,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-1px",
                    fontFeatureSettings: '"tnum" 1',
                  }}>{s.num}</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: "22px", fontWeight: 700, color: v("text"),
                    marginBottom: SPACE.sm, letterSpacing: "-0.3px",
                  }}>{s.title}</h3>
                  <p style={{
                    fontSize: "15px", lineHeight: 1.7,
                    color: v("text-muted"), marginBottom: SPACE.sm,
                  }}>{s.desc}</p>
                  <p style={{
                    fontSize: "13px", lineHeight: 1.65, color: v("text-dim"),
                    fontStyle: "italic", fontFamily: "var(--font-display)",
                  }}>{s.detail}</p>
                </div>
              </Card>
            ))}
          </div>

          <style>{`@media (max-width: 600px) { .step-rail { display: none !important; } }`}</style>
        </div>
      </div>
      <PostSeason />
    </PageShell>
  );
}
