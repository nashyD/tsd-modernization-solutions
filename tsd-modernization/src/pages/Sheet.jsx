import { useParams, Navigate, Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { v, Button, SPACE, RADIUS } from "../shared";
import { ArrowRightIcon } from "../icons";
import { getServiceBySlug } from "../services-data";

/* ── Savings sheet — the printable one-pager ────────────────────────
   One per service at /sheets/:slug, generated from the same
   services-data the site renders, so the sheet can never drift from
   the page. Built for two uses: Grant or Bishop pulling it up on the
   iPad mid-conversation, and AirPrint/PDF as a leave-behind.

   Always ink-light (white card, navy header) regardless of site theme.
   @media print hides everything except the sheet and fits it to one
   Letter page. noindex — it's sales collateral, a thin duplicate of
   the service page. */

const NAVY = "#13294B";
const CAROLINA = "#7BAFD4";
const INK_MUTED = "#5a6878";
const RULE = "#d8dee6";

export default function Sheet() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/services" replace />;

  return (
    <div style={{ paddingTop: "120px", minHeight: "100vh" }} className="sheet-shell">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{
        maxWidth: "680px", margin: "0 auto",
        padding: `0 20px ${SPACE["3xl"]}`,
      }}>
        {/* Screen-only chrome above the sheet */}
        <div data-print-hide style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "12px", flexWrap: "wrap", marginBottom: SPACE.lg,
        }}>
          <Link to={`/services/${service.slug}`} style={{
            color: v("accent"), fontWeight: 600, fontSize: "13px",
            display: "inline-flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
              <ArrowRightIcon size={14} />
            </span>
            {service.title}
          </Link>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            Print / save as PDF
          </Button>
        </div>

        {/* The sheet itself */}
        <div id="savings-sheet" style={{
          background: "#ffffff",
          borderRadius: RADIUS.lg,
          overflow: "hidden",
          boxShadow: "0 18px 50px rgba(7,13,26,0.35)",
        }}>
          {/* Header band */}
          <div style={{
            background: NAVY, padding: "20px 28px",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
          }}>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.3px" }}>
                {service.title}
              </div>
              <div style={{ fontSize: "12px", color: "#8fa9c4", marginTop: "2px" }}>
                What it saves you per month
              </div>
            </div>
            <div style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: CAROLINA, textAlign: "right",
              lineHeight: 1.5, whiteSpace: "nowrap",
            }}>
              TSD ◆ Modernization<br />Solutions
            </div>
          </div>

          <div style={{ padding: "24px 28px 22px" }}>
            <p style={{
              fontSize: "13.5px", color: "#3a4756", lineHeight: 1.6,
              margin: "0 0 18px",
            }}>
              {service.desc}
            </p>

            {/* The math */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "18px" }}>
              <tbody>
                {service.savesRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < service.savesRows.length - 1 ? `1px solid ${RULE}` : "none" }}>
                    <td style={{ padding: "8px 12px 8px 0", fontSize: "13px", color: INK_MUTED, lineHeight: 1.5 }}>
                      {row.label}
                    </td>
                    <td style={{
                      padding: "8px 0", fontSize: "13px", fontWeight: 700, color: NAVY,
                      textAlign: "right", whiteSpace: "nowrap",
                    }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* The line + the proof */}
            <div style={{
              background: "#eef4fa", borderRadius: "8px",
              padding: "12px 16px", marginBottom: "18px",
            }}>
              <p style={{ fontSize: "13px", color: NAVY, lineHeight: 1.55, margin: 0 }}>
                <strong style={{ fontWeight: 800 }}>{service.sheetLine}</strong>{" "}{service.proof}
              </p>
            </div>

            {/* Included + terms */}
            <p style={{ fontSize: "12px", color: INK_MUTED, lineHeight: 1.7, margin: "0 0 6px" }}>
              <strong style={{ color: NAVY, fontWeight: 700 }}>Included:</strong>{" "}
              {service.included.slice(0, 4).join(" · ")}
            </p>
            <p style={{ fontSize: "12px", color: INK_MUTED, lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: NAVY, fontWeight: 700 }}>How it runs:</strong>{" "}
              Managed by us, or owned by you. Fixed-price proposal within 48 hours of a free fit call. 100% money-back guarantee.
              {service.riskReversal ? ` ${service.riskReversal}` : ""}
            </p>

            {/* Footer */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "12px", flexWrap: "wrap",
              marginTop: "18px", paddingTop: "14px", borderTop: `1px solid ${RULE}`,
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: NAVY }}>(980) 890-5815</span>
              <span style={{ fontSize: "12px", color: INK_MUTED }}>
                Run your own numbers: <span style={{ color: NAVY, fontWeight: 700 }}>tsd-modernization.com/savings</span>
              </span>
            </div>
          </div>
        </div>

        {/* Screen-only: the other sheets */}
        <p data-print-hide style={{
          fontSize: "13px", color: v("text-dim"), textAlign: "center",
          marginTop: SPACE.lg, lineHeight: 1.6,
        }}>
          One sheet per service — swap the slug in the URL, or start from{" "}
          <Link to="/services" style={{ color: v("accent"), fontWeight: 600 }}>the catalog</Link>.
        </p>
      </div>

      <style>{`
        @media print {
          @page { size: letter; margin: 0.5in; }
          body * { visibility: hidden; }
          #savings-sheet, #savings-sheet * { visibility: visible; }
          #savings-sheet {
            position: absolute; left: 0; top: 0; width: 100%;
            box-shadow: none !important; border-radius: 0 !important;
          }
          .sheet-shell { padding-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}
