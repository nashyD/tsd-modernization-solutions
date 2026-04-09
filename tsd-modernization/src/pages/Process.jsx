import { useState } from "react";
import { C, useFadeIn, SectionHeader } from "../shared";
import PageShell from "./PageShell";

function ProcessStep({ s, i }) {
  const [hover, setHover] = useState(false);
  const [ref, fadeStyle] = useFadeIn(i * 150);
  return (
    <div ref={ref} style={{
      ...fadeStyle,
      position: "relative",
      background: hover
        ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
        : C.glass,
      border: `1px solid ${hover ? s.borderColor : C.glassBorder}`,
      borderRadius: "24px",
      padding: "36px 26px 32px",
      textAlign: "center",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease",
      transform: hover ? "translateY(-8px)" : "translateY(0)",
      boxShadow: hover
        ? `0 24px 60px ${s.glowColor}, 0 0 0 1px ${s.borderColor}`
        : "0 4px 20px rgba(0,0,0,0.2)",
      overflow: "hidden",
    }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>

      {/* Corner gradient accent */}
      <div style={{
        position: "absolute",
        top: "-40px", right: "-40px",
        width: "120px", height: "120px",
        borderRadius: "50%",
        background: s.gradient,
        filter: "blur(40px)",
        opacity: hover ? 0.35 : 0.15,
        transition: "opacity 0.35s ease",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative" }}>
        {/* Number badge with glow ring */}
        <div style={{
          position: "relative",
          width: "56px", height: "56px",
          margin: "0 auto 20px",
        }}>
          <div style={{
            position: "absolute", inset: "-8px",
            borderRadius: "20px",
            background: s.gradient,
            opacity: hover ? 0.55 : 0.25,
            filter: "blur(14px)",
            transition: "opacity 0.35s ease",
          }} />
          <div style={{
            position: "relative",
            width: "100%", height: "100%",
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontWeight: 800, color: "#fff",
            background: s.gradient,
            boxShadow: "0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            letterSpacing: "-0.5px",
          }}>{s.num}</div>
        </div>

        <h4 style={{
          fontSize: "19px", fontWeight: 700, marginBottom: "12px", color: C.text,
          letterSpacing: "-0.2px",
        }}>{s.title}</h4>

        {/* Duration chip */}
        <div style={{
          display: "inline-block",
          padding: "5px 12px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${C.glassBorder}`,
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: C.textMuted,
          marginBottom: "16px",
        }}>{s.duration}</div>

        <p style={{ fontSize: "14px", lineHeight: 1.65, color: C.textMuted, margin: 0 }}>{s.desc}</p>
      </div>
    </div>
  );
}

export default function Process() {
  const steps = [
    {
      num: "01", title: "Discovery",
      duration: "1–2 hours",
      desc: "Deep dive into your business, current tools, pain points, and goals.",
      gradient: C.gradient1,
      borderColor: `rgba(${C.accentRGB},0.45)`,
      glowColor: `rgba(${C.accentRGB},0.28)`,
    },
    {
      num: "02", title: "Proposal",
      duration: "Within 48 hours",
      desc: "You receive a written proposal with fixed scope, timeline, and price.",
      gradient: C.gradient2,
      borderColor: `rgba(${C.accentRGB},0.45)`,
      glowColor: `rgba(${C.accentRGB},0.28)`,
    },
    {
      num: "03", title: "Build",
      duration: "2–4 weeks",
      desc: "We build your solution with weekly check-ins, feedback loops, and revisions.",
      gradient: C.gradient3,
      borderColor: `rgba(${C.accentRGB},0.45)`,
      glowColor: `rgba(${C.accentRGB},0.28)`,
    },
    {
      num: "04", title: "Handoff",
      duration: "2-week support",
      desc: "Step-by-step guides, video tutorials, and a support window — you own it fully.",
      gradient: C.gradient4,
      borderColor: `rgba(${C.navyRGB},0.55)`,
      glowColor: `rgba(${C.navyRGB},0.35)`,
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <SectionHeader center label="How It Works" title="From Discovery to" titleAccent="Launch"
          sub="Our streamlined 4-phase process gets you from first conversation to fully operational — fast." />

        <div style={{ position: "relative" }}>
          {/* Gradient connector line behind the row (desktop only) */}
          <div className="process-connector" style={{
            position: "absolute",
            top: "65px",
            left: "14%", right: "14%",
            height: "2px",
            background: `linear-gradient(90deg, rgba(${C.accentRGB},0) 0%, rgba(${C.accentRGB},0.55) 18%, rgba(${C.accentRGB},0.6) 50%, rgba(${C.navyRGB},0.6) 82%, rgba(${C.navyRGB},0) 100%)`,
            zIndex: 0,
            pointerEvents: "none",
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            position: "relative",
            zIndex: 1,
          }}>
            {steps.map((s, i) => <ProcessStep key={i} s={s} i={i} />)}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
