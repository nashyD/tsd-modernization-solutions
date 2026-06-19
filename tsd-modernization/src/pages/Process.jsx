import {
  C, v, useFadeIn,
  SectionHeader, Card,
  Eyebrow, ChapterRule, GradientText,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import PageShell from "./PageShell";

const STEPS = [
  { num: "01", title: "Fit call", desc: "A 1-2 hour conversation where we walk through your business, your operations, and what you'd want modernized. You leave with a clear read on whether we're the right fit.", detail: "In-person or remote. Free, no commitment. If we're a match, the next step is a fixed-price proposal for a custom build scoped to your business." },
  { num: "02", title: "Proposal", desc: "Within 48 hours, you receive a written modernization roadmap with clear scope, timeline, and pricing. No surprises.", detail: "Typically 2-4 pages. Includes technical approach, deliverables, and payment schedule." },
  { num: "03", title: "Build", desc: "We execute the project on a 2-4 week timeline with regular check-ins. You see progress throughout, not just at the end.", detail: "Weekly updates. Revisions included. We don't disappear." },
  { num: "04", title: "Launch, your way", desc: "Go live Managed — we host it and make every change for you, just text us — or Owned, where the source code, credentials, and deployment are yours with documentation and a live training session.", detail: "Managed plans from $49/mo (site) or $73/mo (AI) keep it sharp after launch — cancel anytime." },
];

function PostSeason() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{
      ...fade,
      padding: `${SPACE.lg} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
      maxWidth: "920px", margin: "0 auto",
    }}>
      <ChapterRule label="After Launch" num="02" style={{ marginBottom: SPACE.xl, marginTop: SPACE.xl }} />

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
        <p>You choose how it runs. Managed is the simplest path: we host it, keep it current, and make every change for you. Text us what you need — a new hours line, a swapped hero photo, a fresh quote — and it's done. Your domain stays registered in your name, and you never touch code or a vendor login. From $49/mo for a site, $73/mo for AI, cancel anytime.</p>
        <p>Owned is for teams who'd rather hold the keys: the repo, the deployment, and the domain are yours from day one. During handoff we link your Claude account to your GitHub repo, so to make a change you screenshot what you want and send it to Claude — Claude commits the fix, and Vercel deploys it automatically. You learn the workflow in the training session, and after a few cycles it's muscle memory.</p>
        <p>Either way, it's yours — never a lock-in. Managed is a service you can cancel anytime; Owned is a clean handoff with documentation and training.</p>
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
                    fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
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
                    fontStyle: "normal", fontFamily: "var(--font-body)",
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
