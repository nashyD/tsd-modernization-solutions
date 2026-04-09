import { useState } from "react";
import { C, useFadeIn, SectionHeader } from "../shared";
import PageShell from "./PageShell";

function ProcessStep({ s, i }) {
  const [hover, setHover] = useState(false);
  const [ref, fadeStyle] = useFadeIn(i * 150);
  return (
    <div ref={ref} style={{
      ...fadeStyle,
      background: C.glass, border: `1px solid ${hover ? "rgba(255,255,255,0.12)" : C.glassBorder}`,
      borderRadius: "20px", padding: "36px 28px", textAlign: "center",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      transition: "transform 0.3s ease, border-color 0.3s ease",
      transform: hover ? "translateY(-4px)" : "translateY(0)",
    }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", fontWeight: 800, margin: "0 auto 20px", color: "#fff",
        background: s.gradient,
      }}>{s.num}</div>
      <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: C.text }}>{s.title}</h4>
      <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textMuted }}>{s.desc}</p>
    </div>
  );
}

export default function Process() {
  const steps = [
    { num: "01", title: "Discovery", desc: "1-2 hour deep dive into your business, current tools, pain points, and goals.", gradient: C.gradient1 },
    { num: "02", title: "Proposal", desc: "Within 48 hours, you receive a written proposal with fixed scope, timeline, and price.", gradient: C.gradient2 },
    { num: "03", title: "Build", desc: "We build your solution in 2-4 weeks with weekly check-ins, feedback loops, and revisions.", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)" },
    { num: "04", title: "Handoff", desc: "Step-by-step guides, video tutorials, and a 2-week support window — you own it fully.", gradient: C.gradient3 },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <SectionHeader center label="How It Works" title="From Discovery to" titleAccent="Launch"
          sub="Our streamlined 4-phase process gets you from first conversation to fully operational — fast." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {steps.map((s, i) => <ProcessStep key={i} s={s} i={i} />)}
        </div>
      </div>
    </PageShell>
  );
}
