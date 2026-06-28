import { useParams, Navigate } from "react-router-dom";
import { Head } from "vite-react-ssg";

/* ── Private data room ───────────────────────────────────────────────
   One page per recipient (SBTDC / attorney / insurer), reached only by
   an unguessable token in the URL and kept out of search engines via
   <meta robots noindex>. Shows the relevant business-plan PDF plus the
   supporting documents that recipient needs. Always ink-light (white
   surfaces, navy text) regardless of the site theme, like the print
   sheets — these are documents, not marketing.

   Assets live under /public/plan/<token>/ so the PDFs themselves are
   only reachable if you already hold the token. Routes are registered
   in routes.jsx (getStaticPaths) and excluded from the sitemap. */

const NAVY = "#13294B";
const STEEL = "#2c5f8a";
const CARL = "#7BB8E0";
const CREAM = "#f7f2e8";
const INK = "#1d2531";
const MUTE = "#6b7280";
const LINE = "#e7e2d6";
const GOLD = "#bfa978";
const PRISM = "linear-gradient(90deg,#a8d1ed,#7BB8E0,#2c5f8a,#13294B)";

const ARTICLES = {
  name: "Articles of Organization",
  file: "articles-of-organization.pdf",
  desc: "Certified copy from the North Carolina Secretary of State, filed April 27, 2026 (SOSID 3273202).",
  tag: "Public record",
};
const OPERATIONS = {
  name: "Operations Agreement",
  file: "operations-agreement.pdf",
  desc: "The contractor and commission agreement among the owner and the two sales contractors.",
  tag: "Confidential",
};
const OA_DRAFT = {
  name: "Operating Agreement (draft)",
  file: "operating-agreement-draft.pdf",
  desc: "Single-member LLC operating agreement, a working draft for counsel review.",
  tag: "Draft",
};

const PLANS = {
  "sbtdc-9fbcf7d5bf50ccb7acd8": {
    recipient: "Prepared for the SBTDC",
    edition: "SBTDC Advisory edition",
    blurb: "A complete business plan for advisory review — company, market, operations, financials, and a 90-day plan. Several open questions are raised deliberately for your input.",
    docs: [ARTICLES],
  },
  "legal-865714de00f8f07b3075": {
    recipient: "Prepared for legal counsel",
    edition: "Legal Review edition",
    blurb: "The business plan plus the entity and contract documents, with the matters we are bringing to you collected in the Agenda for Counsel.",
    docs: [ARTICLES, OPERATIONS, OA_DRAFT],
  },
  "insurance-b82769c73aea16c74f25": {
    recipient: "Prepared for insurance underwriting",
    edition: "Insurance Underwriting edition",
    blurb: "The business plan written for underwriting — operations, the exposures the work creates, and the coverage lines they map to, with a one-page facts sheet.",
    docs: [ARTICLES],
  },
};

const btn = (primary) => ({
  display: "inline-flex", alignItems: "center", gap: "7px",
  padding: "10px 18px", borderRadius: "9px",
  fontFamily: "var(--font-body)", fontSize: "13.5px", fontWeight: 600,
  textDecoration: "none", lineHeight: 1, cursor: "pointer",
  background: primary ? NAVY : "#ffffff",
  color: primary ? "#ffffff" : NAVY,
  border: primary ? `1px solid ${NAVY}` : `1px solid ${LINE}`,
});

function DocCard({ slug, doc }) {
  const url = `/plan/${slug}/${doc.file}`;
  return (
    <div style={{
      background: "#ffffff", border: `1px solid ${LINE}`, borderRadius: "12px",
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "15.5px", fontWeight: 700, color: NAVY }}>
          {doc.name}
        </div>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", color: STEEL, background: CREAM,
          border: `1px solid ${LINE}`, borderRadius: "999px", padding: "3px 9px", whiteSpace: "nowrap",
        }}>{doc.tag}</span>
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "12.5px", color: MUTE, lineHeight: 1.5, flex: 1 }}>
        {doc.desc}
      </div>
      <div style={{ display: "flex", gap: "16px", marginTop: "2px" }}>
        <a href={url} target="_blank" rel="noreferrer"
          style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: STEEL, textDecoration: "none" }}>
          View ↗
        </a>
        <a href={url} download
          style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: STEEL, textDecoration: "none" }}>
          Download ↓
        </a>
      </div>
    </div>
  );
}

export default function DataRoom() {
  const { slug } = useParams();
  const plan = PLANS[slug];
  if (!plan) return <Navigate to="/" replace />;

  const planUrl = `/plan/${slug}/plan.pdf`;

  return (
    <div style={{ paddingTop: "116px", paddingBottom: "80px", minHeight: "100vh" }}>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>{plan.edition} — TSD Ventures Business Plan</title>
        <meta name="description" content="Confidential business plan and supporting documents for TSD Ventures, LLC." />
      </Head>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>

        {/* top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "26px", flexWrap: "wrap" }}>
          <img src="/tsd-ms-logo-tarheel-light.svg" alt="TSD Modernization Solutions" style={{ height: "46px", width: "auto" }} />
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: MUTE, border: `1px solid ${LINE}`, borderRadius: "999px", padding: "5px 12px",
          }}>Confidential &amp; proprietary</span>
        </div>

        {/* hero */}
        <div style={{
          background: CREAM, border: `1px solid ${LINE}`, borderRadius: "16px",
          padding: "30px 32px", marginBottom: "30px",
        }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: STEEL, marginBottom: "8px" }}>
            ◆ {plan.recipient}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "38px", lineHeight: 1.08, color: NAVY, margin: "0 0 4px" }}>
            TSD Ventures, LLC
          </h1>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 600, color: STEEL }}>
            Business Plan &middot; {plan.edition}
          </div>
          <div style={{ height: "4px", width: "72px", background: PRISM, borderRadius: "2px", margin: "16px 0" }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14.5px", lineHeight: 1.6, color: INK, margin: 0, maxWidth: "640px" }}>
            {plan.blurb}
          </p>
        </div>

        {/* plan viewer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "19px", color: NAVY, margin: 0 }}>The business plan</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href={planUrl} target="_blank" rel="noreferrer" style={btn(false)}>Open full-screen ↗</a>
            <a href={planUrl} download style={btn(true)}>Download PDF ↓</a>
          </div>
        </div>
        <div style={{ background: "#ffffff", border: `1px solid ${LINE}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 34px rgba(19,41,75,0.10)" }}>
          <iframe src={planUrl} title={`${plan.edition} business plan`} style={{ width: "100%", height: "760px", border: "none", display: "block" }} />
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: MUTE, marginTop: "8px" }}>
          If the document does not display above, use <strong style={{ color: STEEL }}>Open full-screen</strong> or <strong style={{ color: STEEL }}>Download</strong>.
        </p>

        {/* supporting documents */}
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "19px", color: NAVY, margin: "38px 0 4px" }}>Supporting documents</h2>
        <div style={{ height: "3px", width: "60px", background: PRISM, borderRadius: "2px", marginBottom: "18px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {plan.docs.map((d) => <DocCard key={d.file} slug={slug} doc={d} />)}
        </div>

        {/* footer */}
        <div style={{ marginTop: "44px", paddingTop: "20px", borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "11.5px", color: MUTE, lineHeight: 1.6, maxWidth: "560px" }}>
            This page and its documents are confidential and shared only with the intended recipient. Please do not forward the link.
            Questions: <strong style={{ color: NAVY }}>(980) 890-5815</strong> &middot; nashdavis@tsd-ventures.com
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD }}>
            TSD ◆ Ventures
          </span>
        </div>
      </div>
    </div>
  );
}
