import { useState } from "react";
import { C, GlassCard, SectionHeader, Tabs } from "../shared";
import { SparklesIcon, MonitorIcon, TrendingUpIcon, CheckIcon } from "../icons";
import PageShell from "./PageShell";

/* ── YouTube Embed ─────────────────────────────────────────────────────── */
function YouTubeEmbed({ videoId, title }) {
  return (
    <div style={{
      position: "relative", paddingBottom: "56.25%", height: 0,
      borderRadius: "14px", overflow: "hidden", marginBottom: "16px",
      border: `1px solid ${C.glassBorder}`,
    }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%", border: "none",
        }}
      />
    </div>
  );
}

/* ── Slideshow / Carousel ──────────────────────────────────────────────── */
function Slideshow({ slides }) {
  const [idx, setIdx] = useState(0);
  if (!slides || slides.length === 0) return null;
  const prev = () => setIdx((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === slides.length - 1 ? 0 : i + 1));
  const slide = slides[idx];

  const arrowBtn = (dir) => ({
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [dir === "left" ? "left" : "right"]: "12px",
    width: "40px", height: "40px", borderRadius: "12px",
    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
    border: `1px solid rgba(255,255,255,0.15)`,
    color: "#fff", fontSize: "20px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
    zIndex: 2,
  });

  return (
    <div>
      <div style={{
        position: "relative", borderRadius: "14px", overflow: "hidden",
        aspectRatio: "16/9",
        background: slide.gradient || `url(${slide.src}) center/cover no-repeat`,
        border: `1px solid ${C.glassBorder}`,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}>
        {/* caption overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(transparent 50%, rgba(0,0,0,0.7))",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: "24px",
        }}>
          <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, textAlign: "center" }}>
            {slide.caption}
          </p>
        </div>
        {slides.length > 1 && (
          <>
            <button onClick={prev} style={arrowBtn("left")} aria-label="Previous slide">&#8249;</button>
            <button onClick={next} style={arrowBtn("right")} aria-label="Next slide">&#8250;</button>
          </>
        )}
      </div>
      {/* dot indicators */}
      {slides.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "14px" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`}
              style={{
                width: idx === i ? "24px" : "8px", height: "8px",
                borderRadius: "4px", border: "none", cursor: "pointer",
                background: idx === i ? C.accentLight : `rgba(${C.accentRGB},0.25)`,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Overview Tab (original modal content) ─────────────────────────────── */
function OverviewTab({ service }) {
  return (
    <div>
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

/* ── Service Modal Content (tabbed) ────────────────────────────────────── */
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
      <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "20px", letterSpacing: "-0.5px", color: C.text }}>
        {service.title}
      </h2>
      <Tabs tabs={[
        { label: "Overview", content: <OverviewTab service={service} /> },
        {
          label: "Demo Videos",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {service.videos.map((v, i) => (
                <div key={i}>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: C.text, marginBottom: "10px" }}>{v.title}</h4>
                  <YouTubeEmbed videoId={v.id} title={v.title} />
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Solutions Gallery",
          content: <Slideshow slides={service.slides} />,
        },
      ]} />
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
      longDesc: "We help small businesses replace hours of manual work with smart, always-on AI tools. From customer-facing chatbots that answer FAQs 24/7 to back-office automations that handle scheduling, invoicing, and reporting: everything is built specifically around how your business already operates.",
      included: [
        "Custom AI chatbot trained on your business",
        "Make automation workflows",
        "AI-powered reporting dashboards",
        "Calendar & appointment automation",
        "Staff training on every tool we deploy",
      ],
      timeline: "1-2 weeks from kickoff to launch.",
      price: "Projects start at $250. Final quote depends on scope and is included in your free tech audit.",
      videos: [
        { id: "lM02vNMRRB0", title: "Placeholder: Custom Chatbot Setup" },
        { id: "BHACKCNDMW8", title: "Placeholder: Zapier Workflow Walkthrough" },
      ],
      slides: [
        { gradient: "linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #2d6a9f 100%)", caption: "AI chatbot dashboard — real-time conversation analytics" },
        { gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", caption: "Zapier automation builder — connect 5,000+ apps" },
        { gradient: "linear-gradient(135deg, #141e30 0%, #243b55 50%, #3a7bd5 100%)", caption: "AI-generated reporting — weekly insights on autopilot" },
      ],
    },
    {
      Icon: MonitorIcon, title: "Website Creation & Redesign",
      desc: "Professional, conversion-focused websites with built-in SEO, chatbot integration, and comprehensive handoff documentation.",
      tags: ["Webflow", "WordPress", "SEO", "Analytics"],
      gradient: C.gradient2, glow: `rgba(${C.accentRGB},0.3)`,
      longDesc: "A modern website that does more than just exist. We build conversion-focused sites with mobile-first design, fast load times, baked-in SEO, and analytics so you can see exactly what's working. Every site comes with handoff documentation so you can edit content without needing us.",
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
      videos: [
        { id: "hlWiI4xVXKY", title: "Placeholder: Mobile-First Responsive Demo" },
        { id: "lM02vNMRRB0", title: "Placeholder: SEO & Analytics Setup" },
      ],
      slides: [
        { gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b3a4b 50%, #3a86ff 100%)", caption: "Mobile-first responsive design — looks great on every screen" },
        { gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", caption: "Built-in SEO — optimized metadata and structured data" },
        { gradient: "linear-gradient(135deg, #0b0c10 0%, #1f2833 50%, #45a29e 100%)", caption: "Analytics dashboard — see exactly what's working" },
      ],
    },
    {
      Icon: TrendingUpIcon, title: "Process Modernization",
      desc: "A structured tech audit and written roadmap that maps your operations, identifies bottlenecks, and prioritizes implementation.",
      tags: ["Tech Audit", "Roadmap", "ROI Analysis", "Training"],
      gradient: C.gradient3, glow: `rgba(${C.navyRGB},0.35)`,
      longDesc: "Sometimes the answer isn't more technology — it's the right technology in the right places. We sit down with you and map out every step of how your business currently runs, then build a written roadmap of what to fix first, what to fix later, and what to leave alone.",
      included: [
        "2-3 hour structured tech audit (in-person or remote)",
        "Written modernization roadmap",
        "Tool & platform recommendations with cost estimates",
        "Priority sequence + estimated ROI per item",
        "No obligation to continue with us",
      ],
      timeline: "Audit completed in a single session. Written roadmap delivered within 48 hours.",
      price: "$150-$250 one-time fee. Free if bundled with a website or AI project.",
      videos: [
        { id: "BHACKCNDMW8", title: "Placeholder: Tech Audit Walkthrough" },
      ],
      slides: [
        { gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d3436 50%, #636e72 100%)", caption: "Structured tech audit — every process mapped and scored" },
        { gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", caption: "Modernization roadmap — prioritized by ROI" },
        { gradient: "linear-gradient(135deg, #232526 0%, #414345 50%, #5c6b73 100%)", caption: "Tool recommendations — cost estimates included" },
      ],
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
