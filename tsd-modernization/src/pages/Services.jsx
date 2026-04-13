import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { C, v, SectionHeader, Card, Tag } from "../shared";
import {
  BotIcon, GlobeIcon, CogIcon, CheckIcon,
  BoltIcon, ChartBarIcon, CalendarIcon,
  LayoutIcon, SearchIcon, ChatBubbleIcon, MapIcon, ClipboardIcon,
} from "../icons";
import PageShell from "./PageShell";

/* ── Modal (self-contained portal overlay) ────────────────────── */
function ServiceModal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(4,8,20,0.75)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", overflowY: "auto",
      animation: "modalFadeIn 0.25s ease-out",
    }} role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "relative", maxWidth: "800px", width: "100%",
        maxHeight: "calc(100vh - 80px)", overflowY: "auto",
        background: v("card-bg"), border: `1px solid ${v("border")}`,
        borderRadius: "24px", padding: "48px 48px 40px",
        boxShadow: "0 30px 100px rgba(0,0,0,0.45)",
        animation: "modalScaleIn 0.32s cubic-bezier(0.16,1,0.3,1)",
        color: v("text"),
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: "16px", right: "16px",
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,255,255,0.06)", border: `1px solid ${v("border")}`,
          color: v("text"), fontSize: "18px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>&times;</button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ── Tab Bar ──────────────────────────────────────────────────── */
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "videos", label: "Videos" },
  { key: "gallery", label: "Gallery" },
];

function TabBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: "4px", marginBottom: "32px", borderBottom: `1px solid rgba(75,156,211,0.15)` }}>
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            padding: "10px 20px", cursor: "pointer", background: "none", border: "none",
            borderBottom: isActive ? `2px solid ${C.carolina}` : "2px solid transparent",
            color: isActive ? C.carolina : v("text-muted"),
            fontWeight: isActive ? 700 : 500, fontSize: "14px", letterSpacing: "0.3px",
            transition: "color 0.2s, border-color 0.2s",
          }}>{t.label}</button>
        );
      })}
    </div>
  );
}

/* ── Play Icon ────────────────────────────────────────────────── */
function PlayIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <path d="M19 15l14 9-14 9V15z" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

/* ── Video Card ───────────────────────────────────────────────── */
function VideoCard({ video, gradient }) {
  return (
    <div style={{
      borderRadius: "16px", overflow: "hidden",
      border: `1px solid ${v("border")}`, background: v("card-bg"),
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.carolina; e.currentTarget.style.boxShadow = `0 4px 20px rgba(75,156,211,0.15)`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = v("border"); e.currentTarget.style.boxShadow = "none"; }}
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
        <h4 style={{ fontSize: "15px", fontWeight: 700, color: v("text"), marginBottom: "6px" }}>{video.title}</h4>
        <p style={{ fontSize: "13px", lineHeight: 1.6, color: v("text-muted"), margin: 0 }}>{video.desc}</p>
      </div>
    </div>
  );
}

/* ── Gallery Slideshow ────────────────────────────────────────── */
function GallerySlideshow({ slides, gradient }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);
  const arrowBtn = (dir) => ({
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [dir === "left" ? "left" : "right"]: "12px",
    width: "40px", height: "40px", borderRadius: "50%",
    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: "20px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
  });
  return (
    <div>
      <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: `1px solid ${v("border")}` }}>
        <div style={{
          height: "320px", background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "12px", padding: "32px",
        }}>
          <span style={{ opacity: 0.85, color: "#fff" }}>
            {slide.Icon ? <slide.Icon size={48} /> : null}
          </span>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#fff", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{slide.title}</span>
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
        <h4 style={{ fontSize: "16px", fontWeight: 700, color: v("text"), marginBottom: "6px" }}>{slide.title}</h4>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text-muted"), margin: 0 }}>{slide.desc}</p>
      </div>
      {slides.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === idx ? "24px" : "8px", height: "8px", borderRadius: "4px",
              border: "none", cursor: "pointer",
              background: i === idx ? C.carolina : "rgba(75,156,211,0.25)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tabbed Modal Content ─────────────────────────────────────── */
function ServiceModalContent({ service }) {
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <TabBar active={tab} onChange={setTab} />
      {tab === "overview" && (
        <div>
          <div style={{
            width: "60px", height: "60px", borderRadius: "16px", background: service.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", marginBottom: "24px",
          }}><service.Icon size={28} /></div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "12px", color: v("text") }}>{service.title}</h2>
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: v("text-muted"), marginBottom: "12px" }}>{service.desc}</p>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-dim"), marginBottom: "32px" }}>{service.longDesc}</p>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.carolina, marginBottom: "16px" }}>What's Included</h3>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}>
            {service.included.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "8px 0", fontSize: "14px", lineHeight: 1.6, color: v("text") }}>
                <span style={{ color: C.success, flexShrink: 0, marginTop: "2px" }}><CheckIcon size={16} /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.carolina, marginBottom: "12px" }}>Typical Timeline</h3>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text-muted"), marginBottom: "32px" }}>{service.timeline}</p>
          <div style={{ padding: "16px 20px", borderRadius: "14px", background: C.gradientSubtle, border: "1px solid rgba(75,156,211,0.2)" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: C.carolina, marginBottom: "4px" }}>Starting Price</p>
            <p style={{ fontSize: "14px", color: v("text"), margin: 0 }}>{service.price}</p>
          </div>
        </div>
      )}
      {tab === "videos" && (
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.carolina, marginBottom: "20px" }}>Demo Videos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {service.videos.map((vid, i) => <VideoCard key={i} video={vid} gradient={service.gradient} />)}
          </div>
          <p style={{ fontSize: "13px", color: v("text-dim"), textAlign: "center", marginTop: "24px", fontStyle: "italic" }}>
            Video demos are being produced — check back soon.
          </p>
        </div>
      )}
      {tab === "gallery" && (
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.carolina, marginBottom: "20px" }}>Solutions Gallery</h3>
          <GallerySlideshow slides={service.gallery} gradient={service.gradient} />
        </div>
      )}
    </div>
  );
}

/* ── Service Data ─────────────────────────────────────────────── */
const SERVICES = [
  {
    Icon: BotIcon, title: "AI Integration & Automation",
    desc: "Deploy intelligent chatbots, automate repetitive workflows, and unlock AI-powered insights. We set up the tools, train your team, and document everything.",
    longDesc: "From customer-facing chatbots that handle FAQs to backend automations that replace hours of manual data entry, we build AI solutions that actually make sense for your business size and budget.",
    tags: ["Chatbots", "Zapier", "AI Reports", "Scheduling", "Email Automation"],
    gradient: C.gradientPrism,
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
      { Icon: BotIcon, title: "Custom Chatbot Interface", desc: "Branded chatbot widget embedded on a client's homepage, answering FAQs and capturing leads 24/7." },
      { Icon: BoltIcon, title: "Make Automation Flow", desc: "Multi-step automation connecting a contact form to CRM, email sequences, and calendar booking." },
      { Icon: ChartBarIcon, title: "AI Reporting Dashboard", desc: "Real-time analytics dashboard with AI-generated summaries and trend detection." },
      { Icon: CalendarIcon, title: "Smart Scheduling", desc: "Automated calendar system that syncs availability, sends reminders, and handles rescheduling." },
    ],
  },
  {
    Icon: GlobeIcon, title: "Website Creation & Redesign",
    desc: "We build sites that load fast, look good on phones, and show up in search results. Every site comes with written and video documentation so you can update content without calling us.",
    longDesc: "Two weeks of post-launch support included. We use modern frameworks like React and Vite to build sites that are fast, accessible, and easy to maintain.",
    tags: ["React", "SEO", "Mobile-First", "CMS", "Performance", "Analytics"],
    gradient: C.gradientAccent,
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
      { Icon: ChartBarIcon, title: "Analytics Dashboard", desc: "Google Analytics and Search Console wired up from day one so you can track what's working." },
      { Icon: ChatBubbleIcon, title: "Chatbot Integration", desc: "Seamless chatbot widget embedded into the site design for instant visitor engagement." },
    ],
  },
  {
    Icon: CogIcon, title: "Process Modernization",
    desc: "Replace spreadsheets, paper forms, and manual processes with streamlined digital tools. We audit your current workflow and build exactly what you need.",
    longDesc: "Whether it's a custom dashboard, automated invoicing, or a client portal, we identify the bottlenecks and build targeted solutions that save your team real time every week.",
    tags: ["Workflows", "Dashboards", "Integrations", "Training", "Documentation"],
    gradient: "linear-gradient(135deg, #2c5f8a 0%, #13294B 100%)",
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

/* ── Services Page ────────────────────────────────────────────── */
export default function Services() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader center label="What We Do" title="Our" titleAccent="services"
          sub="Every engagement is hands-on, fully documented, and priced for small business budgets." />
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {SERVICES.map((s, i) => (
            <Card key={i} delay={i * 120} onClick={() => setOpenIdx(i)}
              style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "start", cursor: "pointer" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "16px", background: s.gradient,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
              }}><s.Icon size={28} /></div>
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
      {openIdx !== null && (
        <ServiceModal open onClose={() => setOpenIdx(null)}>
          <ServiceModalContent service={SERVICES[openIdx]} />
        </ServiceModal>
      )}
    </PageShell>
  );
}
