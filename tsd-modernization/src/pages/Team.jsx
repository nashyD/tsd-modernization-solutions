import { C, GlassCard, SectionHeader } from "../shared";
import PageShell from "./PageShell";

export default function Team() {
  const team = [
    { initials: "ND", name: "Nash Davis", role: "CEO & Head of Modernization", school: "UNC Chapel Hill", bio: "AI and technology strategy. Leads technical delivery, client engagement, and custom solution architecture.", image: "/nash-davis.png" },
    { initials: "BS", name: "Bishop Switzer", role: "COO — Operations", school: "UNC Wilmington", bio: "Operations and process management. Oversees project tracking, proposals, invoicing, and handoff documentation.", image: "/bishop-switzer.jpg" },
    { initials: "GT", name: "Grant Tadlock", role: "CFO & Sales Lead", school: "UNC Charlotte", bio: "Financial planning and client acquisition. Drives sales pipeline, pricing strategy, and relationship development.", image: "/grant-tadlock.jpg" },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Meet the Team" title="Built by" titleAccent="Founders Who Care"
          sub="Three UNC-system students combining technical expertise with genuine commitment to helping Charlotte businesses thrive." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          {team.map((t, i) => (
            <GlassCard key={i} delay={i * 150} hoverGlow={C.accentGlow} enableTilt style={{ textAlign: "center" }}>
              <div style={{
                width: "100px", height: "100px", borderRadius: "24px",
                background: t.image ? "none" : `linear-gradient(135deg, rgba(${C.accentRGB},0.2), rgba(${C.navyRGB},0.25))`,
                border: `1px solid rgba(${C.accentRGB},0.25)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", margin: "0 auto 20px", color: C.accentLight,
                fontWeight: 700, overflow: "hidden",
                boxShadow: `0 8px 32px rgba(${C.accentRGB},0.1)`,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: "-3px", borderRadius: "27px",
                  background: `linear-gradient(135deg, rgba(${C.accentRGB},0.4), transparent, rgba(${C.navyRGB},0.4))`,
                  zIndex: -1, filter: "blur(6px)", opacity: 0.6,
                }} />
                {t.image ? (
                  <img src={t.image} alt={t.name} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                  }} />
                ) : t.initials}
              </div>
              <h4 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px", color: C.text }}>{t.name}</h4>
              <p style={{ fontSize: "14px", color: C.accentLight, fontWeight: 600, marginBottom: "8px" }}>{t.role}</p>
              <p style={{ fontSize: "13px", color: C.textDim, marginBottom: "16px" }}>{t.school}</p>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textMuted }}>{t.bio}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
