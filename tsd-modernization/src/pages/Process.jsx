import { v, SectionHeader, Card } from "../shared";
import PageShell from "./PageShell";

const STEPS = [
  { num: "01", title: "Discovery", desc: "We schedule a 1-2 hour session where we walk through your current operations, tools, and pain points. You get actionable insights on the spot.", detail: "In-person or remote. No sales pressure. Free for qualified businesses." },
  { num: "02", title: "Proposal", desc: "Within 48 hours, you receive a written modernization roadmap with clear scope, timeline, and pricing. No surprises.", detail: "Typically 2-4 pages. Includes technical approach, deliverables, and payment schedule." },
  { num: "03", title: "Build", desc: "We execute the project on a 2-4 week timeline with regular check-ins. You see progress throughout, not just at the end.", detail: "Weekly updates. Revisions included. We don't disappear." },
  { num: "04", title: "Handoff", desc: "Every project comes with comprehensive documentation, video tutorials, and a 2-week support window. You own everything.", detail: "Written guides, Loom walkthroughs, and live Q&A session." },
];

export default function Process() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "900px", margin: "0 auto" }}>
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
    </PageShell>
  );
}
