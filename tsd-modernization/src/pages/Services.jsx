import { useState } from "react";
import { C, GlassCard, SectionHeader } from "../shared";
import {
  SparklesIcon, MonitorIcon, TrendingUpIcon, CheckIcon,
  ChatBotIcon, BoltIcon, ChartBarIcon, CalendarIcon,
  LayoutIcon, SearchIcon, ChatBubbleIcon, MapIcon, ClipboardIcon,
} from "../icons";
import PageShell from "./PageShell";

/* ── Tab Bar ──────────────────────────────────────────────────────────────── */
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "videos", label: "Videos" },
  { key: "gallery", label: "Gallery" },
];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: "4px", marginBottom: "32px",
      borderBottom: `1px solid rgba(${C.accentRGB},0.15)`,
    }}>
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              padding: "10px 20px", cursor: "pointer",
              background: "none", border: "none",
              borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
              color: isActive ? C.accent : C.textMuted,
              fontWeight: isActive ? 700 : 500,
              fontSize: "14px", letterSpacing: "0.3px",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Play Icon (inline SVG for video placeholder) ─────────────────────────── */
function PlayIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <path d="M19 15l14 9-14 9V15z" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

/* ── Video Placeholder Card ───────────────────────────────────────────────── */
function VideoCard({ video, gradient }) {
  return (
    <div style={{
      borderRadius: "16px", overflow: "hidden",
      border: `1px solid ${C.glassBorder}`,
      background: `rgba(${C.accentRGB},0.04)`,
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.accent;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(${C.accentRGB},0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.glassBorder;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        height: "160px", background: gradient, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <PlayIcon />
        <span style={{
          position: "absolute", bottom: "10px", right: "12px",
          background: "rgba(0,0,0,0.6)", borderRadius: "6px",
          padding: "2px 8px", fontSize: "12px", color: "#fff", fontWeight: 600,
        }}>Coming Soon</span>
      </div>
      <div style={{ padding: "16px" }}>
        <h4 style={{ fontSize: "15px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
          {video.title}
        </h4>
        <p style={{ fontSize: "13px", lineHeight: 1.6, color: C.textMuted, margin: 0 }}>
          {video.desc}
        </p>
      </div>
    </div>
  );
}

/* ── Gallery Slideshow ────────────────────────────────────────────────────── */
function GallerySlideshow({ slides, gradient }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  const arrowBtn = (direction) => ({
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [direction === "left" ? "left" : "right"]: "12px",
    width: "40px", height: "40px", borderRadius: "50%",
    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: "20px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
    zIndex: 2,
  });

  return (
    <div>
      <div style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        border: `1px solid ${C.glassBorder}`,
      }}>
        <div style={{
          height: "320px", background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "12px", padding: "32px",
          transition: "opacity 0.3s ease",
        }}>
          <span style={{ opacity: 0.85, color: "#fff" }}>
            {slide.Icon ? <slide.Icon size={48} /> : null}
          </span>
          <span style={{
            fontSize: "16px", fontWeight: 600, color: "#fff",
            textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>{slide.title}</span>
          <span style={{
            position: "absolute", bottom: "10px", right: "12px",
            background: "rgba(0,0,0,0.6)", borderRadius: "6px",
            padding: "2px 8px", fontSize: "12px", color: "#fff", fontWeight: 600,
          }}>Placeholder</span>
        </div>

        {slides.length > 1 && (
          <>
            <button onClick={prev} style={arrowBtn("left")} aria-label="Previous slide">&#8249;</button>
            <button onClick={next} style={arrowBtn("right")} aria-label="Next slide">&#8250;</button>
          </>
        )}
      </div>

      <div style={{ padding: "20px 4px 0" }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
          {slide.title}
        </h4>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textMuted, margin: 0 }}>
          {slide.desc}
        </p>
      </div>

      {slides.length > 1 && (
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px",
          marginTop: "16px",
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === idx ? "24px" : "8px", height: "8px",
                borderRadius: "4px", border: "none", cursor: "pointer",
                background: i === idx ? C.accent : `rgba(${C.accentRGB},0.25)`,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Overview Tab (existing modal content) ────────────────────────────────── */
function OverviewTab({ service }) {
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

/* ── Service Modal Content (tabbed) ───────────────────────────────────────── */
function ServiceModalContent({ service }) {
  const [tab, setTab] = useState("overview");

  return (
    <div>
      <TabBar active={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab service={service} />}

      {tab === "videos" && (
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "20px" }}>
            Demo Videos
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {service.videos.map((v, i) => (
              <VideoCard key={i} video={v} gradient={service.gradient} />
            ))}
          </div>
          <p style={{
            fontSize: "13px", color: C.textMuted, textAlign: "center",
            marginTop: "24px", fontStyle: "italic",
          }}>
            Video demos are being produced — check back soon.
          </p>
        </div>
      )}

      {tab === "gallery" && (
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "20px" }}>
            Solutions Gallery
          </h3>
          <GallerySlideshow slides={service.gallery} gradient={service.gradient} />
        </div>
      )}
    </div>
  );
}

/* ── Services Page ────────────────────────────────────────────────────────── */
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
        { title: "Chatbot Setup Walkthrough", desc: "See how we build and train a custom AI chatbot for your business in under a week." },
        { title: "Workflow Automation Demo", desc: "Watch a Make/Zapier automation route leads, schedule calls, and update your CRM automatically." },
        { title: "AI Reporting Dashboard", desc: "A live look at how AI-generated insights surface trends you'd otherwise miss." },
      ],
      gallery: [
        { Icon: ChatBotIcon, title: "Custom Chatbot Interface", desc: "Branded chatbot widget embedded on a client's homepage, answering FAQs and capturing leads 24/7." },
        { Icon: BoltIcon, title: "Make Automation Flow", desc: "Multi-step automation connecting a contact form to CRM, email sequences, and calendar booking." },
        { Icon: ChartBarIcon, title: "AI Reporting Dashboard", desc: "Real-time analytics dashboard with AI-generated summaries and trend detection." },
        { Icon: CalendarIcon, title: "Smart Scheduling", desc: "Automated calendar system that syncs availability, sends reminders, and handles rescheduling." },
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
        { title: "Design to Launch Process", desc: "Follow a website build from initial mockup through to live deployment." },
        { title: "SEO & Analytics Setup", desc: "How we wire up Google Analytics, Search Console, and on-page SEO from day one." },
        { title: "Handoff Documentation", desc: "See the video + written guides we create so you can manage your own content." },
      ],
      gallery: [
        { Icon: LayoutIcon, title: "Responsive Design Preview", desc: "Mobile-first layouts that look great on every screen size, from phones to ultrawide monitors." },
        { Icon: SearchIcon, title: "SEO Configuration", desc: "On-page metadata, structured data, and AI search optimization baked into every page." },
        { Icon: TrendingUpIcon, title: "Analytics Dashboard", desc: "Google Analytics and Search Console wired up from day one so you can track what's working." },
        { Icon: ChatBubbleIcon, title: "Chatbot Integration", desc: "Seamless chatbot widget embedded into the site design for instant visitor engagement." },
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
        { title: "Tech Audit Session Preview", desc: "A preview of what a structured tech audit looks like and the questions we walk through." },
        { title: "Roadmap Walkthrough", desc: "See an example modernization roadmap with priorities, costs, and ROI estimates." },
      ],
      gallery: [
        { Icon: SearchIcon, title: "Process Mapping", desc: "Visual breakdown of current workflows showing where time and money are being lost." },
        { Icon: MapIcon, title: "Modernization Roadmap", desc: "Prioritized action plan with cost estimates, ROI projections, and recommended timeline." },
        { Icon: ClipboardIcon, title: "Tool Recommendations", desc: "Platform-by-platform comparison tailored to your business size, budget, and technical comfort." },
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
