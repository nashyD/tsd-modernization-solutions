import { C, GlassCard, SectionHeader } from "../shared";
import { SparklesIcon, MonitorIcon, TrendingUpIcon, CheckIcon } from "../icons";
import PageShell from "./PageShell";

function ServiceModalContent({ service }) {
  return (
    <div>
      <div style={{
        width: "72px", height: "72px", borderRadius: "18px",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "24px", background: service.gradient, color: "#fff",
        boxShadow: `0 8px 24px ${service.glow}`,
      }}>
        <service.Icon size={36} />
      </div>
      <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px", letterSpacing: "-0.5px", color: C.text }}>
        {service.title}
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.7, color: C.textMuted, marginBottom: "32px" }}>
        {service.longDesc}
      </p>
      <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "16px" }}>
        What's Included
      </h3>
      <ul style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}>
        {service.included.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", fontSize: "15px", lineHeight: 1.6, color: C.text }}>
            <span style={{ color: C.success, flexShrink: 0, marginTop: "2px" }}><CheckIcon size={18} /></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Typical Timeline
      </h3>
      <p style={{ fontSize: "15px", lineHeight: 1.6, color: C.textMuted, marginBottom: "32px" }}>
        {service.timeline}
      </p>
      <div style={{
        padding: "20px 24px", borderRadius: "16px",
        background: `rgba(${C.accentRGB},0.08)`,
        border: `1px solid rgba(${C.accentRGB},0.25)`,
      }}>
        <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: C.accentLight, marginBottom: "6px" }}>
          [Placeholder] Starting Price
        </p>
        <p style={{ fontSize: "15px", color: C.text }}>{service.price}</p>
      </div>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      Icon: SparklesIcon, title: "AI Integration & Automation",
      desc: "Deploy intelligent chatbots, automate repetitive workflows, and unlock AI-powered insights — so you can focus on running your business.",
      tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling"],
      gradient: C.gradient1, glow: C.accentGlow,
      longDesc: "[Placeholder] We help small businesses replace hours of manual work with smart, always-on AI tools. From customer-facing chatbots that answer FAQs 24/7 to back-office automations that handle scheduling, invoicing, and reporting — everything is built specifically around how your business already operates.",
      included: [
        "[Placeholder] Custom AI chatbot trained on your business",
        "[Placeholder] Zapier / Make automation workflows (up to 3)",
        "[Placeholder] AI-powered reporting dashboards",
        "[Placeholder] Calendar & appointment automation",
        "[Placeholder] Staff training on every tool we deploy",
      ],
      timeline: "[Placeholder] 2-3 weeks from kickoff to launch.",
      price: "[Placeholder] Projects start at $400. Final quote depends on scope and is included in your free tech audit.",
    },
    {
      Icon: MonitorIcon, title: "Website Creation & Redesign",
      desc: "Professional, conversion-focused websites with built-in SEO, chatbot integration, and comprehensive handoff documentation.",
      tags: ["Webflow", "WordPress", "SEO", "Analytics"],
      gradient: C.gradient2, glow: `rgba(${C.accentRGB},0.3)`,
      longDesc: "[Placeholder] A modern website that does more than just exist. We build conversion-focused sites with mobile-first design, fast load times, baked-in SEO, and analytics so you can see exactly what's working. Every site comes with handoff documentation so you can edit content without needing us.",
      included: [
        "[Placeholder] 5-8 page custom-designed website",
        "[Placeholder] Mobile-first responsive build",
        "[Placeholder] On-page SEO and metadata setup",
        "[Placeholder] Google Analytics + Search Console wiring",
        "[Placeholder] Contact form & chatbot integration",
        "[Placeholder] Written + video handoff documentation",
        "[Placeholder] 2 weeks of post-launch support",
      ],
      timeline: "[Placeholder] 3-4 weeks from approved mockup to launch.",
      price: "[Placeholder] Starter websites from $400. Bundle pricing available with AI integration.",
    },
    {
      Icon: TrendingUpIcon, title: "Process Modernization",
      desc: "A structured tech audit and written roadmap that maps your operations, identifies bottlenecks, and prioritizes implementation.",
      tags: ["Tech Audit", "Roadmap", "ROI Analysis", "Training"],
      gradient: C.gradient3, glow: `rgba(${C.navyRGB},0.35)`,
      longDesc: "[Placeholder] Sometimes the answer isn't more technology — it's the right technology in the right places. We sit down with you and map out every step of how your business currently runs, then build a written roadmap of what to fix first, what to fix later, and what to leave alone.",
      included: [
        "[Placeholder] 2-3 hour structured tech audit (in-person or remote)",
        "[Placeholder] Written modernization roadmap",
        "[Placeholder] Tool & platform recommendations with cost estimates",
        "[Placeholder] Priority sequence + estimated ROI per item",
        "[Placeholder] No obligation to continue with us",
      ],
      timeline: "[Placeholder] Audit completed in a single session. Written roadmap delivered within 48 hours.",
      price: "[Placeholder] $150-$250 one-time fee. Free if bundled with a website or AI project.",
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="What We Do" title="Three Ways to" titleAccent="Modernize"
          sub="From AI-powered customer service to complete website overhauls, we help Charlotte businesses work smarter — not harder." />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px" }}>
          {services.map((s, i) => (
            <GlassCard key={i} delay={i * 150} hoverGlow={s.glow} enableTilt
              expandable expandedContent={<ServiceModalContent service={s} />}
              style={{ flex: "1 1 320px", maxWidth: "380px" }}>
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
