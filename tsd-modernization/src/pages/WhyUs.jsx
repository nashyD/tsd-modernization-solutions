import { C, v, SectionHeader, useFadeIn, Eyebrow, SPACE, RADIUS } from "../shared";
import { CheckIcon, XIcon } from "../icons";
import PageShell from "./PageShell";

const ROWS = [
  { feature: "Founder direct support (no ticket queue)", tsd: true, agency: false, freelancer: "varies", diy: "n/a" },
  { feature: "Managed for you, or full source-code ownership — your call", tsd: true, agency: "extra", freelancer: "varies", diy: false },
  { feature: "Claude + GitHub continuity (no vendor lock-in)", tsd: true, agency: false, freelancer: false, diy: false },
  { feature: "48-hour written proposal", tsd: true, agency: false, freelancer: "varies", diy: "n/a" },
  { feature: "Money-back if we miss the mark", tsd: true, agency: false, freelancer: false, diy: "n/a" },
  { feature: "Charlotte / Gaston local (no offshoring, no account managers)", tsd: true, agency: false, freelancer: "varies", diy: "n/a" },
];

function CellVal({ val }) {
  if (val === true) return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "26px", height: "26px", borderRadius: RADIUS.full,
      background: "rgba(6,214,160,0.16)",
      color: C.success,
    }}>
      <CheckIcon size={14} strokeWidth={2.5} />
    </span>
  );
  if (val === false) return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "26px", height: "26px", borderRadius: RADIUS.full,
      background: v("surface"),
      color: v("text-dim"),
    }}>
      <XIcon size={12} />
    </span>
  );
  return (
    <span style={{
      fontSize: "11px", fontWeight: 400, color: v("text-dim"),
      textTransform: "uppercase", letterSpacing: "1.5px",
      fontStyle: "normal", fontFamily: "var(--font-body)",
    }}>{val}</span>
  );
}

export default function WhyUs() {
  const [ref, fade] = useFadeIn(100);
  return (
    <PageShell>
      <div style={{
        padding: `${SPACE.xl} clamp(20px, 4vw, 48px) ${SPACE["4xl"]}`,
        maxWidth: "1080px", margin: "0 auto",
      }}>
        <SectionHeader center label="Why Choose Us" title="How we" titleAccent="compare"
          sub="You earned the reputation; your tech should carry it. We build for established local businesses where the owner has become the bottleneck — and we stay accountable for what we ship." />

        <div ref={ref} style={{
          ...fade,
          overflowX: "auto",
          borderRadius: "var(--glass-radius)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
          boxShadow: "var(--glass-shadow)",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "left" }}>
                  <Eyebrow color={v("text-muted")} diamond={false}>Feature</Eyebrow>
                </th>
                <th style={{
                  ...thStyle,
                  background: "linear-gradient(180deg, rgba(75,156,211,0.16) 0%, rgba(75,156,211,0.06) 100%)",
                  position: "relative",
                }}>
                  <Eyebrow>TSD</Eyebrow>
                  <div style={{
                    fontSize: "9px", fontWeight: 400, letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: C.carolinaLight, marginTop: "4px",
                    fontStyle: "normal", fontFamily: "var(--font-body)",
                  }}>You are here</div>
                </th>
                <th style={thStyle}><Eyebrow color={v("text-muted")} diamond={false}>Agency</Eyebrow></th>
                <th style={thStyle}><Eyebrow color={v("text-muted")} diamond={false}>Freelancer</Eyebrow></th>
                <th style={thStyle}><Eyebrow color={v("text-muted")} diamond={false}>DIY</Eyebrow></th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td style={{
                    ...tdStyle, textAlign: "left", fontWeight: 600, color: v("text"),
                    fontSize: "14px",
                  }}>{r.feature}</td>
                  <td style={{ ...tdStyle, background: "rgba(75,156,211,0.04)" }}><CellVal val={r.tsd} /></td>
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
  padding: "20px 22px", textAlign: "center",
  borderBottom: `1px solid var(--c-divider)`,
  background: "var(--glass-bg-strong)",
  verticalAlign: "middle",
};

const tdStyle = {
  padding: "16px 22px", fontSize: "14px", textAlign: "center",
  color: "var(--c-text-muted)",
  borderBottom: `1px solid var(--c-divider-soft)`,
};
