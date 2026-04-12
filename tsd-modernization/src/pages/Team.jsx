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
      bio: "Runs the tech side \u2014 scopes projects, builds the software, makes sure clients understand what they\u2019re getting.",
      image: "/nash-davis.png",
      fullBio: "Nash runs the tech consulting side of TSD \u2014 scoping projects, building the software, and making sure clients actually understand what they\u2019re getting. He\u2019s a freshman at UNC Chapel Hill with guaranteed admission to Kenan-Flagler, where he\u2019ll study Entrepreneurship and Finance.",
      specialties: ["AI Integration", "Solution Architecture", "Client Strategy", "Technical Delivery"],
      email: "nash@tsd-ventures.com",
      socials: [
        { label: "LinkedIn", handle: "linkedin.com/in/nashdavis", url: "https://www.linkedin.com/in/nashdavis" },
        { label: "Instagram", handle: "@nashyd694", url: "https://www.instagram.com/nashyd694/" },
      ],
    },
    {
      initials: "BS", name: "Bishop Switzer", role: "COO — Operations",
      school: "UNC Wilmington",
      bio: "Keeps the trains running \u2014 schedules, invoices, client updates, all of it.",
      image: "/bishop-switzer.jpg",
      fullBio: "Bishop keeps the trains running \u2014 schedules, invoices, client updates, all of it. He also heads up the detailing side of TSD Ventures, which he\u2019s been doing independently for a few years already. Studying Business Administration at UNC Wilmington\u2019s Cameron School of Business.",
      specialties: ["Project Management", "Operations", "Process Design", "Client Communication"],
      email: "bishop@tsd-ventures.com",
      socials: [
        { label: "LinkedIn", handle: "linkedin.com/in/bishopswitzer", url: "https://www.linkedin.com/in/bishopswitzer" },
        { label: "Instagram", handle: "@bilshup", url: "https://www.instagram.com/bilshup/" },
      ],
    },
    {
      initials: "GT", name: "Grant Tadlock", role: "CFO & Sales Lead",
      school: "UNC Charlotte",
      bio: "Usually the first person you\u2019ll talk to. Handles sales, pricing, and the money side.",
      image: "/grant-tadlock.jpg",
      fullBio: "Grant is usually the first person you\u2019ll talk to. He handles sales, pricing, and the money side of things. If you\u2019ve gotten a quote from us, it probably came from him. Studying Business Marketing at UNC Charlotte\u2019s Belk College of Business.",
      specialties: ["Sales", "Pricing Strategy", "Financial Planning", "Client Relationships"],
      email: "grant@tsd-ventures.com",
      socials: [
        { label: "LinkedIn", handle: "linkedin.com/in/granttadlock", url: "https://www.linkedin.com/in/granttadlock" },
        { label: "Instagram", handle: "@grant_tadlock", url: "https://www.instagram.com/grant_tadlock/" },
      ],
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="The Team" title="Who" titleAccent="we are"
          sub="Three friends from the Charlotte area. We go to different UNC-system schools, but we grew up within 20 minutes of each other." />
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
