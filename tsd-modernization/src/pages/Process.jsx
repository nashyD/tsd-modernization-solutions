import { C, v, SectionHeader, Card, useFadeIn } from "../shared";
import PageShell from "./PageShell";

const STEPS = [
  { num: "01", title: "Fit call", desc: "A 1-2 hour conversation where we walk through your business, your operations, and what you'd want modernized. You leave with a clear read on whether we're the right fit.", detail: "In-person or remote. Free, no commitment. If we're a match, the next step is a $1,500 Phase I Discovery audit or a written proposal for the Phase II Bundle." },
  { num: "02", title: "Proposal", desc: "Within 48 hours, you receive a written modernization roadmap with clear scope, timeline, and pricing. No surprises.", detail: "Typically 2-4 pages. Includes technical approach, deliverables, and payment schedule." },
  { num: "03", title: "Build", desc: "We execute the project on a 2-4 week timeline with regular check-ins. You see progress throughout, not just at the end.", detail: "Weekly updates. Revisions included. We don't disappear." },
  { num: "04", title: "Handoff", desc: "Every project ends with written documentation, video tutorials, and a live training session. You own the source code, the credentials, and the deployment when we're done.", detail: "One founder stays on call for fixes through August 31, 2026." },
];

/* Post-season section — the Claude+GitHub support story.
   Sits below the 4-step grid as a separate editorial section. Surfaces
   the strongest post-handoff differentiator: clients aren't stuck calling
   us for every change after the season closes — Claude knows their
   codebase and they're the one steering it. */
function PostSeason() {
  const [ref, fade] = useFadeIn(0);
  return (
    <section ref={ref} style={{ ...fade, padding: "16px 48px 80px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px",
        flexWrap: "wrap", marginTop: "40px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
          color: v("accent"), display: "inline-flex", alignItems: "center", gap: "8px",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: "8px" }}>{"◆"}</span> After August 31
        </span>
        <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
        <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px" }}>§ 02</span>
      </div>

      <h2 style={{
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.5px", lineHeight: 1.15,
        color: v("text"), marginBottom: "24px",
      }}>
        You're not{" "}
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          background: C.gradientAccent, WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>on your own.</span>
      </h2>

      <div style={{
        display: "flex", flexDirection: "column", gap: "18px",
        fontSize: "16px", lineHeight: 1.7, color: v("text-muted"), maxWidth: "720px",
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
      <div style={{ padding: "40px 48px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <SectionHeader center label="How It Works" title="Our" titleAccent="process"
          sub="From first meeting to final handoff, here's how every engagement works." />
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {STEPS.map((s, i) => (
            <Card key={i} delay={i * 100} style={{
              display: "grid", gridTemplateColumns: "80px 1fr", gap: "24px", alignItems: "start",
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
                fontSize: "42px", color: v("accent"), lineHeight: 1, letterSpacing: "-1px",
              }}>{s.num}</div>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: v("text"), marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: v("text-muted"), marginBottom: "8px" }}>{s.desc}</p>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: v("text-dim"), fontStyle: "italic" }}>{s.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <PostSeason />
    </PageShell>
  );
}
