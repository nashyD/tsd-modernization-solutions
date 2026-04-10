import { C, GlassCard, SectionHeader } from "../shared";
import PageShell from "./PageShell";

function TeamModalContent({ member }) {
  return (
    <div>
      <div style={{
        width: "140px", height: "140px", borderRadius: "32px",
        background: member.image ? "none" : `linear-gradient(135deg, rgba(${C.accentRGB},0.2), rgba(${C.navyRGB},0.25))`,
        border: `1px solid rgba(${C.accentRGB},0.35)`,
        margin: "0 auto 24px", overflow: "hidden",
        boxShadow: `0 8px 32px rgba(${C.accentRGB},0.18)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "48px", color: C.accentLight, fontWeight: 700,
      }}>
        {member.image
          ? <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : member.initials}
      </div>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "6px", color: C.text }}>{member.name}</h2>
        <p style={{ fontSize: "15px", color: C.accentLight, fontWeight: 600, marginBottom: "4px" }}>{member.role}</p>
        <p style={{ fontSize: "13px", color: C.textDim }}>{member.school}</p>
      </div>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        About
      </h3>
      <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "28px" }}>
        {member.fullBio}
      </p>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Specialties
      </h3>
      <div style={{ marginBottom: "28px" }}>
        {member.specialties.map((tag, i) => (
          <span key={i} style={{
            display: "inline-block", padding: "6px 14px", borderRadius: "10px",
            fontSize: "13px", fontWeight: 600, marginRight: "8px", marginBottom: "8px",
            background: `rgba(${C.accentRGB},0.12)`,
            border: `1px solid rgba(${C.accentRGB},0.25)`,
            color: C.accentLight,
          }}>{tag}</span>
        ))}
      </div>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Connect
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <a href={`mailto:${member.email}`} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "12px 16px", borderRadius: "12px",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}`,
          color: C.text, textDecoration: "none", fontSize: "14px",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${C.accentRGB},0.12)`; e.currentTarget.style.borderColor = C.accentLight; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = C.glassBorder; }}
        >
          <span style={{ color: C.accentLight, fontWeight: 700, minWidth: "70px" }}>Email</span>
          <span>{member.email}</span>
        </a>
        {member.socials.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 16px", borderRadius: "12px",
            background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}`,
            color: C.text, textDecoration: "none", fontSize: "14px",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${C.accentRGB},0.12)`; e.currentTarget.style.borderColor = C.accentLight; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = C.glassBorder; }}
          >
            <span style={{ color: C.accentLight, fontWeight: 700, minWidth: "70px" }}>{s.label}</span>
            <span>{s.handle}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Team() {
  const team = [
    {
      initials: "ND", name: "Nash Davis", role: "CEO & Head of Modernization",
      school: "UNC Chapel Hill",
      bio: "AI and technology strategy. Leads technical delivery, client engagement, and custom solution architecture.",
      image: "/nash-davis.png",
      fullBio: "[Placeholder] Nash leads TSD's technical vision and oversees every modernization project from kickoff to handoff. With deep expertise in AI integration, custom development, and solution architecture, he turns vague business problems into shipped, working software. Studying at UNC Chapel Hill.",
      specialties: ["AI Integration", "Solution Architecture", "Client Strategy", "Technical Delivery"],
      email: "nash@tsd-ventures.com",
      socials: [
        { label: "LinkedIn", handle: "[Placeholder] linkedin.com/in/nashdavis", url: "#" },
        { label: "GitHub", handle: "[Placeholder] github.com/nashyD", url: "#" },
      ],
    },
    {
      initials: "BS", name: "Bishop Switzer", role: "COO — Operations",
      school: "UNC Wilmington",
      bio: "Operations and process management. Oversees project tracking, proposals, invoicing, and handoff documentation.",
      image: "/bishop-switzer.jpg",
      fullBio: "[Placeholder] Bishop keeps every TSD engagement on rails. From scoping and proposals to invoicing and documentation, he makes sure clients always know exactly where their project stands and what comes next. Studying at UNC Wilmington.",
      specialties: ["Project Management", "Operations", "Process Design", "Client Communication"],
      email: "bishop@tsd-ventures.com",
      socials: [
        { label: "LinkedIn", handle: "[Placeholder] linkedin.com/in/bishopswitzer", url: "#" },
      ],
    },
    {
      initials: "GT", name: "Grant Tadlock", role: "CFO & Sales Lead",
      school: "UNC Charlotte",
      bio: "Financial planning and client acquisition. Drives sales pipeline, pricing strategy, and relationship development.",
      image: "/grant-tadlock.jpg",
      fullBio: "[Placeholder] Grant runs TSD's sales pipeline and financial planning. He's the first person most clients meet, and the one who builds long-term relationships that turn one project into ongoing partnerships. Studying at UNC Charlotte.",
      specialties: ["Sales", "Pricing Strategy", "Financial Planning", "Client Relationships"],
      email: "grant@tsd-ventures.com",
      socials: [
        { label: "LinkedIn", handle: "[Placeholder] linkedin.com/in/granttadlock", url: "#" },
      ],
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Meet the Team" title="Built by" titleAccent="Founders Who Care"
          sub="Three UNC-system students combining technical expertise with genuine commitment to helping Charlotte businesses thrive." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          {team.map((t, i) => (
            <GlassCard key={i} delay={i * 150} hoverGlow={C.accentGlow} enableTilt style={{ textAlign: "center" }}
              expandable expandedContent={<TeamModalContent member={t} />}>
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
