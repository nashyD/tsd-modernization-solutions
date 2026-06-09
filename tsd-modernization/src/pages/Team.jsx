import { useState } from "react";
import {
  C, v, useFadeIn,
  DiamondDivider, Button,
  Eyebrow, ChapterRule, GradientText,
  SPACE, RADIUS,
} from "../shared";
import { TSDLogo, XIcon } from "../icons";
import PageShell from "./PageShell";

const TEAM = [
  {
    number: "01",
    initials: "ND", name: "Nash Davis", role: "CEO & Head of Modernization",
    school: "UNC Chapel Hill", schoolId: "chapelhill",
    pullQuote: "When it breaks, you call me — not a ticket queue.",
    bio: "AI and technology strategy. Leads technical delivery, client engagement, and custom solution architecture.",
    ships: ["Custom AI chatbots & integrations", "Site architecture & build", "Solution scoping and delivery"],
    image: "/nash-davis.png",
    card: {
      company: "TSD MODERNIZATION SOLUTIONS",
      name: "NASH DAVIS", title: "Chief Executive Officer",
      email: "nashdavis@tsd-ventures.com", website: "tsd-ventures.com",
      location: "Charlotte, North Carolina", phone: "+1 980-217-6884",
    },
  },
  {
    number: "02",
    initials: "BS", name: "Bishop Switzer", role: "COO \u2014 Operations",
    school: "UNC Wilmington", schoolId: "wilmington",
    pullQuote: "Every proposal is documented. Every handoff is yours to keep.",
    bio: "Operations and process management. Oversees project tracking, proposals, invoicing, and handoff documentation.",
    ships: ["Project tracking & timelines", "Proposals & invoicing", "Handoff documentation & training"],
    image: "/bishop-switzer.jpg",
    card: {
      company: "TSD \u00b7 VENTURES",
      name: "BISHOP SWITZER", title: "Chief Operating Officer",
      email: "bishopswitzer@tsd-ventures.com", website: "tsd-ventures.com",
      location: "Charlotte, North Carolina", phone: "+1 980-217-9777",
    },
  },
  {
    number: "03",
    initials: "GT", name: "Grant Tadlock", role: "CFO & Sales Lead",
    school: "UNC Charlotte", schoolId: "charlotte",
    pullQuote: "You get a fixed price and a guarantee before you commit a dollar.",
    bio: "Financial planning and client acquisition. Drives sales pipeline, pricing strategy, and relationship development.",
    ships: ["Financial planning & pricing", "Sales pipeline & intake", "Client relationships"],
    image: "/grant-tadlock.jpg",
    card: {
      company: "TSD \u00b7 VENTURES",
      name: "GRANT TADLOCK", title: "Chief Financial Officer  \u00b7  Sales",
      email: "granttadlock@tsd-ventures.com", website: "tsd-ventures.com",
      location: "Charlotte, North Carolina", phone: "+1 980-246-4961",
    },
  },
];

/* ── School banner ─────────────────────────────────────────────
   Each founder gets a varsity-letterhead-style banner above their
   name in the founder spread. Brand-color field, accent stripes
   top + bottom, white roundel logo on the left.

   `logoSrc` points to an official school mark in /public. Drop the
   SVG/PNG file from each school's brand kit at that path and the
   banner picks it up. While the file is missing the <img> errors
   and we render `Fallback` — a stylized monogram — so the banner
   never breaks. */
const SCHOOLS = {
  chapelhill: {
    name: "UNC Chapel Hill",
    nickname: "Tar Heels",
    bg: "#4B9CD3",       /* Carolina blue */
    bgDark: "#3a7db0",
    accent: "#13294B",   /* Carolina navy */
    logoSrc: "/UNC_primary_mark_blue.svg",
    logoAlt: "UNC Chapel Hill logo",
    /* Roughly square mark — round medallion. */
    medallion: { shape: "round", width: 44, height: 44, padding: 6 },
    Fallback: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <text x="12" y="17" textAnchor="middle"
              fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic" fontWeight="700" fontSize="15"
              letterSpacing="-1.4"
              fill="currentColor">NC</text>
      </svg>
    ),
  },
  wilmington: {
    name: "UNC Wilmington",
    nickname: "Seahawks",
    bg: "#006666",       /* UNCW teal */
    bgDark: "#004d4d",
    accent: "#F1D45A",   /* UNCW gold */
    logoSrc: "/uncw-logo.png",
    logoAlt: "UNC Wilmington logo",
    /* Wordmark + columns — wider rounded rectangle so the mark breathes. */
    medallion: { shape: "rect", width: 64, height: 44, padding: 6 },
    Fallback: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M 4 7 L 7 17 L 10 11 L 12 17 L 14 11 L 17 17 L 20 7"
              stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 5 20 Q 8 18.5 11 20 T 17 20"
              stroke="currentColor" strokeWidth="1.4"
              strokeLinecap="round" fill="none" opacity="0.65" />
      </svg>
    ),
  },
  charlotte: {
    name: "UNC Charlotte",
    nickname: "49ers",
    bg: "#00703C",       /* UNCC green */
    bgDark: "#00502b",
    accent: "#B9975B",   /* UNCC gold */
    logoSrc: "/charlotte-49ers.svg",
    logoAlt: "UNC Charlotte logo",
    /* Horizontal composition — wider rounded rectangle. */
    medallion: { shape: "rect", width: 64, height: 44, padding: 6 },
    Fallback: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M 4 8 L 6 4 L 9 7 L 12 3 L 15 7 L 18 4 L 20 8 L 19.5 11 L 4.5 11 Z" />
        <text x="12" y="21" textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight="800" fontSize="11"
              letterSpacing="0.5"
              fill="currentColor">49</text>
      </svg>
    ),
  },
};

/* Loads the official logo from /public; on 404/load error it swaps
   to the inline Fallback monogram so the banner is never empty.
   The image fills the medallion's content box (less the padding) and
   uses object-fit: contain so a wide wordmark scales to fit without
   distortion. */
function SchoolLogo({ school }) {
  const [errored, setErrored] = useState(false);
  const m = school.medallion || { width: 40, height: 40, padding: 7 };
  const innerW = m.width - m.padding * 2;
  const innerH = m.height - m.padding * 2;
  if (errored || !school.logoSrc) {
    const F = school.Fallback;
    return <F />;
  }
  return (
    <img
      src={school.logoSrc}
      alt={school.logoAlt}
      style={{
        display: "block",
        width: `${innerW}px`,
        height: `${innerH}px`,
        objectFit: "contain",
        objectPosition: "center",
      }}
      onError={() => setErrored(true)}
    />
  );
}

function SchoolBanner({ schoolId }) {
  const s = SCHOOLS[schoolId];
  if (!s) return null;
  const m = s.medallion || { shape: "round", width: 40, height: 40, padding: 7 };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "14px",
      padding: "10px 18px 10px 10px",
      borderRadius: RADIUS.md,
      background: `linear-gradient(180deg, ${s.bg} 0%, ${s.bgDark} 100%)`,
      borderTop: `3px solid ${s.accent}`,
      borderBottom: `3px solid ${s.accent}`,
      borderLeft: "1px solid rgba(255,255,255,0.10)",
      borderRight: "1px solid rgba(255,255,255,0.10)",
      marginBottom: SPACE.md,
      boxShadow: "0 8px 24px rgba(7,13,26,0.22), inset 0 1px 0 rgba(255,255,255,0.20)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle diagonal sheen */}
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 38%)",
      }} />

      {/* Logo medallion — white field ringed in the school's accent color.
          Round for square marks, rounded rectangle for wide wordmarks.
          Renders the official mark from /public if present, otherwise the
          stylized fallback monogram. */}
      <span style={{
        width: `${m.width}px`,
        height: `${m.height}px`,
        borderRadius: m.shape === "rect" ? "10px" : RADIUS.full,
        background: "#fff",
        color: s.bg,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `inset 0 0 0 2px ${s.accent}, 0 2px 6px rgba(7,13,26,0.18)`,
        position: "relative", zIndex: 1,
        overflow: "hidden",
      }}>
        <SchoolLogo school={s} />
      </span>

      <div style={{
        display: "flex", flexDirection: "column", gap: "2px",
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontSize: "12px", fontWeight: 800, letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "#fff", lineHeight: 1.15,
          textShadow: "0 1px 2px rgba(0,0,0,0.25)",
        }}>
          {s.name}
        </span>
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600,
          fontSize: "13px", lineHeight: 1.2,
          color: s.accent,
          letterSpacing: "0.3px",
        }}>
          {s.nickname}
        </span>
      </div>
    </div>
  );
}

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
      <TSDLogo size={36} style={{ marginBottom: "16px" }} />

      <div style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "3.5px",
        color: v("card-text"), marginBottom: "12px", textAlign: "center", whiteSpace: "nowrap",
      }}>{data.company}</div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "70%", marginBottom: "18px" }}>
        <div style={{ flex: 1, height: "1px", background: v("card-divider") }} />
        <span style={{ color: v("card-accent"), fontSize: "8px" }}>{"\u25C6"}</span>
        <div style={{ flex: 1, height: "1px", background: v("card-divider") }} />
      </div>

      <div style={{
        fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
        fontSize: "clamp(24px, 4vw, 32px)", color: v("card-text"), letterSpacing: "1px",
        marginBottom: "4px", textAlign: "center",
      }}>{data.name}</div>

      <div style={{
        fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 400,
        color: v("card-text-muted"), marginBottom: "18px", textAlign: "center",
      }}>{data.title}</div>

      <div style={{ width: "55%", marginBottom: "18px" }}>
        <div style={{ height: "1px", background: v("card-accent"), opacity: 0.35, marginBottom: "3px" }} />
        <div style={{ height: "2px", background: v("card-accent"), opacity: 0.5 }} />
      </div>

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
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>{member.school}</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>{member.bio}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Editorial founder spread ──────────────────────────────────── */
function FounderSpread({ member, index, onView }) {
  const [ref, fade] = useFadeIn(index * 100);
  const reverse = index % 2 === 1;

  return (
    <article ref={ref} style={{
      ...fade,
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
      gap: "clamp(32px, 5vw, 72px)",
      alignItems: "center",
      padding: "clamp(32px, 6vw, 64px) 0",
      borderTop: `1px solid ${v("divider")}`,
    }} className="founder-spread">
      <style>{`
        @media (max-width: 820px) {
          .founder-spread { grid-template-columns: 1fr !important; }
          .founder-portrait {
            max-width: 420px;
            margin: 0 auto !important;
            order: 1 !important;
          }
          .founder-copy { order: 2 !important; }
        }
      `}</style>
      {/* Portrait */}
      <div className="founder-portrait" style={{
        order: reverse ? 2 : 1,
        position: "relative",
        aspectRatio: "4 / 5",
        borderRadius: "16px", overflow: "hidden",
        background: v("surface"),
        border: "1px solid var(--glass-border)",
      }}>
        <img
          src={member.image} alt={`${member.name}, ${member.role}`}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: "saturate(1.05) contrast(1.02)",
          }}
        />
        {/* Corner number plate */}
        <div style={{
          position: "absolute", top: "18px", left: "18px",
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 14px", borderRadius: "100px",
          background: "rgba(12,21,36,0.72)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.18)",
          fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", color: "#fff",
        }}>
          <span style={{ color: C.carolinaLight, fontSize: "7px" }}>{"\u25C6"}</span>
          FOUNDER NO. {member.number}
        </div>
      </div>

      {/* Copy */}
      <div className="founder-copy" style={{ order: reverse ? 1 : 2 }}>
        <SchoolBanner schoolId={member.schoolId} />
        <h2 style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(36px, 5vw, 58px)", lineHeight: 1.18, letterSpacing: "-1px",
          color: v("text"), marginBottom: "8px",
        }}>
          {member.name}
        </h2>
        <div style={{
          fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
          color: v("accent"), marginBottom: "28px",
        }}>
          {member.role}
        </div>

        {/* Pull quote */}
        <div style={{
          padding: "20px 24px",
          borderLeft: `2px solid ${v("accent")}`,
          marginBottom: "28px",
          background: "var(--glass-bg-strong)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          borderRadius: "0 10px 10px 0",
        }}>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500,
            fontSize: "clamp(16px, 1.8vw, 20px)", lineHeight: 1.45, color: v("text"),
            letterSpacing: "-0.2px",
          }}>
            &ldquo;{member.pullQuote}&rdquo;
          </p>
        </div>

        {/* Bio */}
        <p style={{
          fontSize: "15px", lineHeight: 1.7, color: v("text-muted"),
          marginBottom: "24px",
        }}>
          {member.bio}
        </p>

        {/* What I ship — first-person framing, the founder speaking */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            color: v("text-dim"), marginBottom: "12px",
          }}>
            What I ship
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {member.ships.map((s, j) => (
              <li key={j} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                padding: "8px 0",
                borderTop: j === 0 ? "none" : `1px solid ${v("divider")}`,
                fontSize: "14px", color: v("text"), lineHeight: 1.5,
              }}>
                <span style={{
                  color: v("accent"), fontSize: "7px", marginTop: "8px", flexShrink: 0,
                }}>{"\u25C6"}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onView(member)}
          style={{
            background: "none",
            border: "1px solid var(--glass-border)",
            borderRadius: "100px",
            padding: "10px 20px",
            fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
            color: v("text"), cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--glass-bg-strong)";
            e.currentTarget.style.borderColor = "var(--glass-border-strong)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.borderColor = "var(--glass-border)";
          }}
        >
          View business card &nbsp;&rarr;
        </button>
      </div>
    </article>
  );
}

/* ── Team page ─────────────────────────────────────────────────── */
export default function Team() {
  const [selected, setSelected] = useState(null);

  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Editorial masthead */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
            color: v("accent"),
          }}>
            <span style={{ fontSize: "7px" }}>{"\u25C6"}</span>  The Masthead
          </span>
          <span style={{ flex: 1, height: "1px", background: v("divider"), minWidth: "40px" }} />
          <span style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "2px" }}>Vol. 1 — Charlotte</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)",
          letterSpacing: "-2px", lineHeight: 1.18, color: v("text"), marginBottom: "24px",
        }}>
          Three founders.{" "}
          <span style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
            background: C.gradientAccent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Building it ourselves.</span>
        </h1>
        <p style={{
          fontSize: "18px", lineHeight: 1.65, color: v("text-muted"),
          maxWidth: "640px", marginBottom: "56px",
        }}>
          We go to different UNC-system schools but grew up within twenty minutes of each other. When you hire TSD, you hire these three people — no account managers, no offshoring, no handoffs.
        </p>

        <DiamondDivider width={200} style={{ marginBottom: "8px" }} />

        {/* Founder spreads — alternating portrait/copy sides */}
        {TEAM.map((t, i) => (
          <FounderSpread key={i} member={t} index={i} onView={setSelected} />
        ))}
      </div>
      {selected && <CardModal member={selected} onClose={() => setSelected(null)} />}
    </PageShell>
  );
}
