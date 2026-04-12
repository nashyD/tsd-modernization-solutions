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
          Starting Price
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
      desc: "Chatbots that answer customer questions, automations that handle the repetitive stuff, and dashboards that actually make sense.",
      tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling"],
      gradient: C.gradient1, glow: C.accentGlow,
      longDesc: "We look at what you're doing manually and figure out what can be handed off to AI. FAQ chatbots, scheduling automation, invoicing workflows, reporting dashboards \u2014 built around how your business already runs, not some generic template.",
      included: [
        "Custom AI chatbot trained on your business",
        "Make automation workflows",
        "AI-powered reporting dashboards",
        "Calendar & appointment automation",
        "Staff training on every tool we deploy",
      ],
      timeline: "1-2 weeks from kickoff to launch.",
      price: "Projects start at $250. Final quote depends on scope and is included in your free tech audit.",
    },
    {
      Icon: MonitorIcon, title: "Website Creation & Redesign",
      desc: "Clean, fast websites with SEO baked in. You get handoff docs so you can actually update it yourself after we\u2019re done.",
      tags: ["Webflow", "WordPress", "SEO", "Analytics"],
      gradient: C.gradient2, glow: `rgba(${C.accentRGB},0.3)`,
      longDesc: "We build sites that load fast, look good on phones, and show up in search results. Every site comes with written and video documentation so you can update content without calling us. Two weeks of post-launch support included.",
      included: [
        "5-8 page custom-designed website",
        "Mobile-first responsive build",
        "On-page SEO and metadata optimized for AI search visibility",
        "Google Analytics + Search Console wiring",
        "Contact form & chatbot integration",
        "Written + video handoff documentation",
        "2 weeks of post-launch support",
      ],
      timeline: "2-4 weeks from approved mockup to launch.",
      price: "Starter websites from $250. Bundle pricing available with AI integration.",
    },
    {
      Icon: TrendingUpIcon, title: "Process Modernization",
      desc: "We sit down with you, map out how your business runs, and tell you what to fix first. Written roadmap, no obligation to hire us.",
      tags: ["Tech Audit", "Roadmap", "ROI Analysis", "Training"],
      gradient: C.gradient3, glow: `rgba(${C.navyRGB},0.35)`,
      longDesc: "Not everything needs AI. We walk through your operations, figure out where you\u2019re wasting time, and give you a prioritized list of what to change. You can hire us to do it or take the roadmap to someone else.",
      included: [
        "2-3 hour structured tech audit (in-person or remote)",
        "Written modernization roadmap",
        "Tool & platform recommendations with cost estimates",
        "Priority sequence + estimated ROI per item",
        "No obligation to continue with us",
      ],
      timeline: "Audit completed in a single session. Written roadmap delivered within 48 hours.",
      price: "$150-$250 one-time fee. Free if bundled with a website or AI project.",
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="What We Do" title="Three things" titleAccent="we build"
          sub="We keep it simple. Pick what you need, get a fixed quote, and we build it." />
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
