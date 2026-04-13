import { v, SectionHeader, Card } from "../shared";
import { QuoteIcon } from "../icons";
import PageShell from "./PageShell";

const TESTIMONIALS = [
  {
    quote: "They set up an AI chatbot that handles 60% of our customer questions automatically. Our staff can actually focus on cooking instead of answering the phone all day.",
    metric: "60% fewer calls",
    name: "Local Restaurant Owner",
    role: "Charlotte, NC",
  },
  {
    quote: "The website they built loads faster than anything our old agency ever delivered, and it cost a fraction of the price. Plus they actually taught us how to update it ourselves.",
    metric: "3x faster load time",
    name: "Dental Practice Manager",
    role: "Gastonia, NC",
  },
  {
    quote: "I was drowning in spreadsheets before TSD modernized our workflow. Now everything is automated and I get a dashboard that tells me exactly where I stand.",
    metric: "12 hrs/week saved",
    name: "Real Estate Professional",
    role: "Belmont, NC",
  },
];

export default function Testimonials() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader center label="Social Proof" title="What clients" titleAccent="say"
          sub="Real results from real Charlotte-area businesses." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} delay={i * 120} hover={false} style={{ display: "flex", flexDirection: "column" }}>
              <QuoteIcon size={36} style={{ color: v("accent"), marginBottom: "16px" }} />
              <div style={{
                display: "inline-block", padding: "4px 12px", borderRadius: "100px",
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px",
                background: "rgba(6,214,160,0.1)", color: "#06d6a0",
                border: "1px solid rgba(6,214,160,0.2)", marginBottom: "16px", alignSelf: "flex-start",
              }}>{t.metric}</div>
              <p style={{
                fontSize: "15px", lineHeight: 1.75, color: v("text-muted"),
                fontStyle: "italic", flex: 1, marginBottom: "24px",
              }}>
                "{t.quote}"
              </p>
              <div style={{ borderTop: `1px solid ${v("surface-border")}`, paddingTop: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: v("text") }}>{t.name}</div>
                <div style={{ fontSize: "13px", color: v("text-dim") }}>{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
