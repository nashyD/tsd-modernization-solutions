import { C, GlassCard, SectionHeader } from "../shared";
import PageShell from "./PageShell";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "TSD helped us set up an AI chatbot that handles 60% of our customer inquiries. Our response time went from 4 hours to under 2 minutes.",
      author: "Local Restaurant Owner",
      role: "Charlotte, NC",
      metric: "60% fewer manual inquiries",
    },
    {
      quote: "They rebuilt our website and set up automated scheduling in just 3 weeks. The handoff documentation was so thorough I can manage everything myself.",
      author: "Dental Practice Manager",
      role: "Gastonia, NC",
      metric: "3-week turnaround",
    },
    {
      quote: "The tech audit alone was worth it. They identified 5 processes we could automate and saved us roughly 15 hours per week.",
      author: "Real Estate Brokerage",
      role: "Belmont, NC",
      metric: "15 hrs/week saved",
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Results" title="What Our Clients" titleAccent="Experience"
          sub="Real impact for Charlotte-area businesses — measured in time saved, customers served, and revenue generated." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
          {testimonials.map((t, i) => (
            <GlassCard key={i} delay={i * 150} hoverGlow={C.accentGlow}>
              <div style={{
                display: "inline-block", padding: "6px 14px", borderRadius: "8px",
                background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.2)",
                fontSize: "12px", fontWeight: 700, color: C.cyan, marginBottom: "20px",
              }}>{t.metric}</div>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "24px", fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>{t.author}</p>
                <p style={{ fontSize: "13px", color: C.textDim }}>{t.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
