import { C, v, SectionHeader, Card, Tag } from "../shared";
import { BotIcon, GlobeIcon, CogIcon } from "../icons";
import PageShell from "./PageShell";

const SERVICES = [
  {
    Icon: BotIcon, title: "AI Integration & Automation",
    desc: "Deploy intelligent chatbots, automate repetitive workflows, and unlock AI-powered insights. We set up the tools, train your team, and document everything.",
    longDesc: "From customer-facing chatbots that handle FAQs to backend automations that replace hours of manual data entry, we build AI solutions that actually make sense for your business size and budget.",
    tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling", "Email Automation"],
    gradient: C.gradientPrism,
  },
  {
    Icon: GlobeIcon, title: "Website Creation",
    desc: "We build sites that load fast, look good on phones, and show up in search results. Every site comes with written and video documentation so you can update content without calling us.",
    longDesc: "Two weeks of post-launch support included. We use modern frameworks like React and Vite to build sites that are fast, accessible, and easy to maintain.",
    tags: ["React", "SEO", "Mobile-First", "CMS", "Performance", "Analytics"],
    gradient: C.gradientAccent,
  },
  {
    Icon: CogIcon, title: "Process Modernization",
    desc: "Replace spreadsheets, paper forms, and manual processes with streamlined digital tools. We audit your current workflow and build exactly what you need.",
    longDesc: "Whether it's a custom dashboard, automated invoicing, or a client portal, we identify the bottlenecks and build targeted solutions that save your team real time every week.",
    tags: ["Workflows", "Dashboards", "Integrations", "Training", "Documentation"],
    gradient: "linear-gradient(135deg, #2c5f8a 0%, #13294B 100%)",
  },
];

export default function Services() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader center label="What We Do" title="Our" titleAccent="services"
          sub="Every engagement is hands-on, fully documented, and priced for small business budgets." />
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {SERVICES.map((s, i) => (
            <Card key={i} delay={i * 120} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "start" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "16px", background: s.gradient,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
              }}>
                <s.Icon size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: v("text"), marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: v("text-muted"), marginBottom: "8px" }}>{s.desc}</p>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-dim"), marginBottom: "20px" }}>{s.longDesc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
