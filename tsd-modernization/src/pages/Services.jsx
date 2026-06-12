import { Link } from "react-router-dom";
import { useState } from "react";
import {
  C, v, useFadeIn,
  SectionHeader, Tag, Eyebrow,
  SPACE, RADIUS,
} from "../shared";
import { ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";
import { SERVICES, ADDONS } from "../services-data";

function ServiceCard({ service, delay, badge }) {
  const [ref, fade] = useFadeIn(delay);
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={`/services/${service.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...fade,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: SPACE.xl,
          alignItems: "center",
          padding: SPACE.xl,
          borderRadius: "var(--glass-radius)",
          background: "var(--glass-bg-strong)",
          border: `1px solid ${hovered ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          transition: "border-color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? "var(--glass-shadow), 0 0 28px var(--glass-glow)" : "var(--glass-shadow)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Top-edge highlight */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
          background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
          pointerEvents: "none",
        }} />

        {/* Icon plate */}
        <div style={{
          width: "84px", height: "84px",
          borderRadius: RADIUS.xl,
          background: service.gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#a8d1ed", flexShrink: 0,
          boxShadow: hovered ? "0 12px 32px rgba(75,156,211,0.32)" : "0 6px 18px rgba(75,156,211,0.18)",
          transition: "box-shadow 0.4s ease, transform 0.4s ease",
          transform: hovered ? "scale(1.04) rotate(-2deg)" : "scale(1) rotate(0deg)",
        }}>
          <service.Icon size={34} />
        </div>

        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: "24px", fontWeight: 700,
            color: v("text"), marginBottom: SPACE.sm,
            letterSpacing: "-0.4px",
            display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap",
          }}>
            {service.title}
            {badge && (
              <span style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px",
                textTransform: "uppercase", color: v("accent"),
                padding: "4px 10px", borderRadius: RADIUS.full,
                background: "rgba(75,156,211,0.12)",
                border: `1px solid ${v("divider")}`,
              }}>{badge}</span>
            )}
          </h3>
          <p style={{
            fontSize: "15px", lineHeight: 1.65,
            color: v("text-muted"), marginBottom: SPACE.sm,
          }}>{service.desc}</p>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "15px", lineHeight: 1.6,
            color: v("accent-light"), marginBottom: SPACE.md,
          }}>{service.saves}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>

        {/* Arrow chevron — slides on hover */}
        <div style={{
          width: "44px", height: "44px",
          borderRadius: RADIUS.full,
          background: hovered ? C.gradientAccent : v("surface"),
          border: hovered ? "none" : `1px solid ${v("surface-border")}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: hovered ? "#fff" : v("accent"),
          flexShrink: 0,
          boxShadow: hovered ? "0 8px 22px rgba(75,156,211,0.32)" : "none",
          transition: "all 0.3s ease",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
        }}>
          <ArrowRightIcon size={18} />
        </div>
      </div>
    </Link>
  );
}

function AddonsStrip() {
  const [ref, fade] = useFadeIn(0);
  return (
    <div ref={ref} style={{
      ...fade,
      marginTop: SPACE["2xl"],
      paddingTop: SPACE.xl,
      borderTop: `1px solid ${v("divider-soft")}`,
    }}>
      <Eyebrow style={{ marginBottom: SPACE.md }}>Add-ons</Eyebrow>
      <p style={{ fontSize: "14px", color: v("text-muted"), lineHeight: 1.6, marginBottom: SPACE.lg, maxWidth: "640px" }}>
        Smaller pieces that ride along with a build — each one a line item in the
        {" "}<Link to="/pricing" style={{ color: v("accent"), fontWeight: 600 }}>pricing estimator</Link>.
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: SPACE.md,
      }}>
        {ADDONS.map((a) => (
          <div key={a.name} style={{
            padding: "16px 18px",
            borderRadius: RADIUS.lg,
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
            WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: v("text"), marginBottom: "4px" }}>{a.name}</div>
            <div style={{ fontSize: "13px", color: v("text-muted"), lineHeight: 1.5 }}>{a.blurb}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1140px", margin: "0 auto",
      }}>
        <SectionHeader center label="What We Build" title="Six services." titleAccent="Each one stops a leak."
          sub="Missed calls, repeated answers, no-shows, bloated vendor bills — every service below exists because a real business was losing real money there. Fixed-price proposal in 48 hours; managed by us, or owned by you." />
        <div style={{ display: "flex", flexDirection: "column", gap: SPACE.lg }} className="services-list">
          {SERVICES.map((s, i) => (
            <ServiceCard
              key={s.slug}
              service={s}
              delay={i * 120}
              badge={s.slug === "cost-cut-audit" ? "Start here" : undefined}
            />
          ))}
        </div>
        <AddonsStrip />
      </div>
      <style>{`
        @media (max-width: 720px) {
          .services-list > a > div { grid-template-columns: 1fr !important; gap: 20px !important; }
          .services-list > a > div > div:last-child { display: none !important; }
        }
      `}</style>
    </PageShell>
  );
}
