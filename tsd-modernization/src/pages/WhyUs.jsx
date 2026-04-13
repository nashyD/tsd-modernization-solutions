import { C, v, SectionHeader, useFadeIn } from "../shared";
import { CheckIcon, XIcon } from "../icons";
import PageShell from "./PageShell";

const ROWS = [
  { feature: "Personalized service", tsd: true, agency: false, freelancer: true, diy: false },
  { feature: "Modern tech stack", tsd: true, agency: true, freelancer: "varies", diy: false },
  { feature: "Full documentation & training", tsd: true, agency: "extra", freelancer: false, diy: false },
  { feature: "Affordable for small business", tsd: true, agency: false, freelancer: true, diy: true },
  { feature: "AI integration expertise", tsd: true, agency: "extra", freelancer: "varies", diy: false },
  { feature: "48-hour proposal turnaround", tsd: true, agency: false, freelancer: false, diy: "n/a" },
  { feature: "Post-launch support", tsd: true, agency: "extra", freelancer: "varies", diy: false },
  { feature: "Local (Charlotte area)", tsd: true, agency: false, freelancer: "varies", diy: "n/a" },
];

function CellVal({ val }) {
  if (val === true) return <CheckIcon size={18} style={{ color: C.success }} />;
  if (val === false) return <XIcon size={16} style={{ color: "var(--c-text-dim)" }} />;
  return <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--c-text-dim)", textTransform: "uppercase" }}>{val}</span>;
}

export default function WhyUs() {
  const [ref, fade] = useFadeIn(100);
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1000px", margin: "0 auto" }}>
        <SectionHeader center label="Why Choose Us" title="How we" titleAccent="compare"
          sub="We're not the only option, but we think we're the right one for small businesses." />
        <div ref={ref} style={{ ...fade, overflowX: "auto", borderRadius: "20px", border: `1px solid ${v("surface-border")}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "left" }}>Feature</th>
                <th style={{ ...thStyle, background: `rgba(75,156,211,0.1)`, color: C.carolina }}>
                  TSD
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.carolinaLight, marginTop: "2px" }}>You are here</div>
                </th>
                <th style={thStyle}>Agency</th>
                <th style={thStyle}>Freelancer</th>
                <th style={thStyle}>DIY</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, color: v("text") }}>{r.feature}</td>
                  <td style={{ ...tdStyle, background: `rgba(75,156,211,0.04)` }}><CellVal val={r.tsd} /></td>
                  <td style={tdStyle}><CellVal val={r.agency} /></td>
                  <td style={tdStyle}><CellVal val={r.freelancer} /></td>
                  <td style={tdStyle}><CellVal val={r.diy} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

const thStyle = {
  padding: "16px 20px", fontSize: "14px", fontWeight: 700, textAlign: "center",
  color: "var(--c-text-muted)", borderBottom: `1px solid var(--c-surface-border)`,
  background: "var(--c-surface)",
};

const tdStyle = {
  padding: "14px 20px", fontSize: "14px", textAlign: "center",
  color: "var(--c-text-muted)", borderBottom: `1px solid var(--c-surface-border)`,
};
