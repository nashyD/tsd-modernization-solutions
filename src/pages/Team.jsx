import { useState } from "react";
import { C, v, SectionHeader, Card, DiamondDivider, DoubleLine } from "../shared";
import { TSDLogo, MailIcon, PhoneIcon, MapPinIcon, LinkIcon, XIcon } from "../icons";
import PageShell from "./PageShell";

const TEAM = [
  {
    initials: "ND", name: "Nash Davis", role: "CEO & Head of Modernization",
    school: "UNC Chapel Hill",
    bio: "AI and technology strategy. Leads technical delivery, client engagement, and custom solution architecture.",
    image: "/nash-davis.png",
    card: {
      company: "TSD MODERNIZATION SOLUTIONS",
      name: "NASH DAVIS", title: "Chief Executive Officer",
      email: "nashdavis@tsd-ventures.com", website: "tsd-ventures.com",
      location: "Charlotte, North Carolina", phone: "+1 704-275-1410",
    },
  },
  {
    initials: "BS", name: "Bishop Switzer", role: "COO \u2014 Operations",
    school: "UNC Wilmington",
    bio: "Operations and process management. Oversees project tracking, proposals, invoicing, and handoff documentation.",
    image: "/bishop-switzer.jpg",
    card: {
      company: "TSD \u00b7 VENTURES",
      name: "BISHOP SWITZER", title: "Chief Operating Officer",
      email: "bishopswitzer@tsd-ventures.com", website: "tsd-ventures.com",
      location: "Charlotte, North Carolina", phone: "+1 704-275-1410",
    },
  },
  {
    initials: "GT", name: "Grant Tadlock", role: "CFO & Sales Lead",
    school: "UNC Charlotte",
    bio: "Financial planning and client acquisition. Drives sales pipeline, pricing strategy, and relationship development.",
    image: "/grant-tadlock.jpg",
    card: {
      company: "TSD \u00b7 VENTURES",
      name: "GRANT TADLOCK", title: "Chief Financial Officer  \u00b7  Sales",
      email: "granttadlock@tsd-ventures.com", website: "tsd-ventures.com",
      location: "Charlotte, North Carolina", phone: "+1 704-275-1410",
    },
  },
];

/* ── CSS Business Card (pixel-matches the PDF) ────────────────── */
function BusinessCard({ data }) {
  return (
    <div style={{
      width: "100%", maxWidth: "520px", aspectRatio: "1.75 / 1",
      background: v("card-front"),
      borderRadius: "12px", padding: "40px 48px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
      fontFamily: "var(--font-body)", position: "relative", overflow: "hidden",
    }}>
      {/* Logo */}
      <TSDLogo size={36} style={{ marginBottom: "16px" }} />

      {/* Company name */}
      <div style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "3.5px",
        color: v("card-text"), marginBottom: "12px", textAlign: "center", whiteSpace: "nowrap",
      }}>{data.company}</div>

      {/* Diamond divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "70%", marginBottom: "18px" }}>
        <div style={{ flex: 1, height: "1px", background: v("card-divider") }} />
        <span style={{ color: v("card-accent"), fontSize: "8px" }}>{"\u25C6"}</span>
        <div style={{ flex: 1, height: "1px", background: v("card-divider") }} />
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
        fontSize: "clamp(24px, 4vw, 32px)", color: v("card-text"), letterSpacing: "1px",
        marginBottom: "4px", textAlign: "center",
      }}>{data.name}</div>

      {/* Title */}
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 400,
        color: v("card-text-muted"), marginBottom: "18px", textAlign: "center",
      }}>{data.title}</div>

      {/* Double line */}
      <div style={{ width: "55%", marginBottom: "18px" }}>
        <div style={{ height: "1px", background: v("card-accent"), opacity: 0.35, marginBottom: "3px" }} />
        <div style={{ height: "2px", background: v("card-accent"), opacity: 0.5 }} />
      </div>

      {/* Contact details */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <a href={`mailto:${data.email}`} style={{
          fontSize: "13px", color: v("card-text-muted"), textDecoration: "none",
          fontFamily: "var(--font-display)",
        }}>{data.email}</a>
        <div style={{ fontSize: "13px", fontWeight: 700, color: v("card-text") }}>{data.website}</div>
        <div style={{ fontSize: "13px", color: v("card-text-muted"), fontFamily: "var(--font-display)" }}>{data.location}</div>
        <div style={{ fontSize: "13px", color: v("card-text-muted"), fontFamily: "var(--font-display)" }}>{data.phone}</div>
      </div>
    </div>
  );
}

/* ── Modal ─────────────────────────────────────────────────────── */
function CardModal({ member, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", animation: "fadeUp 0.3s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: "540px" }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "-40px", right: "0",
          background: "none", border: "none", color: "#fff", cursor: "pointer",
          opacity: 0.6, transition: "opacity 0.2s",
        }} aria-label="Close">
          <XIcon size={24} />
        </button>
        <BusinessCard data={member.card} />
        {/* Info below card */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>{member.school}</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>{member.bio}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Team page ─────────────────────────────────────────────────── */
export default function Team() {
  const [selected, setSelected] = useState(null);

  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader center label="The Team" title="Who" titleAccent="we are"
          sub="Three friends from the Charlotte area. We go to different UNC-system schools, but we grew up within 20 minutes of each other." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
          {TEAM.map((t, i) => (
            <Card key={i} delay={i * 150} onClick={() => setSelected(t)} style={{ textAlign: "center", cursor: "pointer" }}>
              {/* Avatar */}
              <div style={{
                width: "100px", height: "100px", borderRadius: "50%",
                background: t.image ? "none" : C.gradientPrism,
                border: `2px solid ${v("surface-border")}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", fontWeight: 700, color: "#fff",
                margin: "0 auto 20px", overflow: "hidden",
              }}>
                {t.image ? (
                  <img src={t.image} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : t.initials}
              </div>
              <h4 style={{ fontSize: "20px", fontWeight: 700, color: v("text"), marginBottom: "4px" }}>{t.name}</h4>
              <p style={{ fontSize: "14px", fontWeight: 600, color: v("accent"), marginBottom: "8px" }}>{t.role}</p>
              <p style={{ fontSize: "13px", color: v("text-dim"), marginBottom: "16px" }}>{t.school}</p>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: v("text-muted") }}>{t.bio}</p>
              <div style={{
                marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${v("surface-border")}`,
                fontSize: "12px", fontWeight: 600, color: v("accent"), letterSpacing: "1px", textTransform: "uppercase",
              }}>
                View Business Card
              </div>
            </Card>
          ))}
        </div>
      </div>
      {selected && <CardModal member={selected} onClose={() => setSelected(null)} />}
    </PageShell>
  );
}
