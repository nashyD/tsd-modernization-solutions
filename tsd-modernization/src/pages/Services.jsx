import { C, GlassCard, SectionHeader } from "../shared";
import { SparklesIcon, MonitorIcon, TrendingUpIcon } from "../icons";
import PageShell from "./PageShell";

export default function Services() {
  const services = [
    {
      Icon: SparklesIcon, title: "AI Integration & Automation",
      desc: "Deploy intelligent chatbots, automate repetitive workflows, and unlock AI-powered insights — so you can focus on running your business.",
      tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling"],
      gradient: C.gradient1, glow: C.accentGlow,
    },
    {
      Icon: MonitorIcon, title: "Website Creation & Redesign",
      desc: "Professional, conversion-focused websites with built-in SEO, chatbot integration, and comprehensive handoff documentation.",
      tags: ["Webflow", "WordPress", "SEO", "Analytics"],
      gradient: C.gradient2, glow: `rgba(${C.accentRGB},0.3)`,
    },
    {
      Icon: TrendingUpIcon, title: "Process Modernization",
      desc: "A structured tech audit and written roadmap that maps your operations, identifies bottlenecks, and prioritizes implementation.",
      tags: ["Tech Audit", "Roadmap", "ROI Analysis", "Training"],
      gradient: C.gradient3, glow: `rgba(${C.navyRGB},0.35)`,
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="What We Do" title="Three Ways to" titleAccent="Modernize"
          sub="From AI-powered customer service to complete website overhauls, we help Charlotte businesses work smarter — not harder." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {services.map((s, i) => (
            <GlassCard key={i} delay={i * 150} hoverGlow={s.glow} enableTilt>
              <div style={{
                width: "64px", height: "64px", borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "24px", background: s.gradient, color: "#fff",
                boxShadow: `0 8px 24px ${s.glow}`,
              }}>
                <s.Icon size={32} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px", color: C.text }}>{s.title}</h3>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "20px" }}>{s.desc}</p>
              <div>
                {s.tags.map((tag, j) => (
                  <span key={j} style={{
                    display: "inline-block", padding: "4px 12px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: 600, marginRight: "8px", marginBottom: "8px",
                    background: `rgba(${C.accentRGB},0.1)`, border: `1px solid rgba(${C.accentRGB},0.2)`,
                    color: C.accentLight,
                  }}>{tag}</span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
