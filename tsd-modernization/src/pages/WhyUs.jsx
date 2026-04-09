import { C, useFadeIn, SectionHeader } from "../shared";
import PageShell from "./PageShell";

export default function WhyUs() {
  const comparisons = [
    { type: "Digital Agencies", price: "$2,000–$5,000+", speed: "6–12 weeks", ai: "Limited", support: "Account manager" },
    { type: "TSD Modernization", price: "$150–$1,800", speed: "2–4 weeks", ai: "AI-first", support: "Founders directly", featured: true },
    { type: "Freelancers", price: "$500–$2,000", speed: "4–8 weeks", ai: "Varies", support: "Inconsistent" },
    { type: "DIY (Wix/Squarespace)", price: "$0–$300", speed: "You do it", ai: "None", support: "Help articles" },
  ];
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <SectionHeader center label="Why Us" title="How We" titleAccent="Compare"
          sub="We combine agency quality with startup speed and founder-level attention — at a fraction of the cost." />
        <div ref={ref} style={{ ...fadeStyle, overflowX: "auto" }}>
          <table style={{
            width: "100%", borderCollapse: "separate", borderSpacing: "0 8px",
            fontSize: "14px", minWidth: "600px",
          }}>
            <thead>
              <tr>
                {["", "Price Range", "Turnaround", "AI Expertise", "Support"].map((h, i) => (
                  <th key={i} style={{
                    padding: "12px 16px", textAlign: "left", fontWeight: 600,
                    color: C.textDim, fontSize: "12px", textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c, i) => (
                <tr key={i} style={{
                  background: c.featured ? "rgba(124,92,252,0.15)" : C.glass,
                  borderRadius: "12px",
                }}>
                  <td style={{
                    padding: "16px", fontWeight: 700, color: c.featured ? C.accentLight : C.text,
                    borderRadius: "12px 0 0 12px",
                    border: c.featured ? "1px solid rgba(124,92,252,0.3)" : `1px solid ${C.glassBorder}`,
                    borderRight: "none",
                  }}>
                    {c.type}
                    {c.featured && <span style={{
                      marginLeft: "8px", padding: "2px 8px", borderRadius: "6px",
                      background: C.gradient1, color: "#fff", fontSize: "10px", fontWeight: 700,
                    }}>YOU ARE HERE</span>}
                  </td>
                  {[c.price, c.speed, c.ai, c.support].map((val, j) => (
                    <td key={j} style={{
                      padding: "16px", color: c.featured ? C.text : C.textMuted,
                      fontWeight: c.featured ? 600 : 400,
                      border: c.featured ? "1px solid rgba(124,92,252,0.3)" : `1px solid ${C.glassBorder}`,
                      borderLeft: "none",
                      borderRight: j < 3 ? "none" : undefined,
                      borderRadius: j === 3 ? "0 12px 12px 0" : undefined,
                    }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
