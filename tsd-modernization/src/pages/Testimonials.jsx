import { C, GlassCard, SectionHeader } from "../shared";
import PageShell from "./PageShell";

function TestimonialModalContent({ t }) {
  return (
    <div>
      <div style={{
        display: "inline-block", padding: "8px 18px", borderRadius: "10px",
        background: "rgba(6,214,160,0.12)", border: "1px solid rgba(6,214,160,0.3)",
        fontSize: "13px", fontWeight: 700, color: C.cyan, marginBottom: "24px",
      }}>{t.metric}</div>
      <p style={{ fontSize: "20px", lineHeight: 1.6, color: C.text, marginBottom: "32px", fontStyle: "italic", fontWeight: 500 }}>
        "{t.quote}"
      </p>
      <div style={{ marginBottom: "32px", paddingBottom: "24px", borderBottom: `1px solid ${C.glassBorder}` }}>
        <p style={{ fontSize: "17px", fontWeight: 700, color: C.text, marginBottom: "4px" }}>{t.author}</p>
        <p style={{ fontSize: "14px", color: C.textMuted }}>{t.role}</p>
      </div>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Project Overview
      </h3>
      <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "28px" }}>
        {t.projectOverview}
      </p>

      <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: C.accentLight, marginBottom: "12px" }}>
        Results
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {t.results.map((r, i) => (
          <li key={i} style={{
            padding: "12px 16px", marginBottom: "8px", borderRadius: "12px",
            background: `rgba(${C.accentRGB},0.06)`,
            border: `1px solid rgba(${C.accentRGB},0.18)`,
            fontSize: "14px", color: C.text,
          }}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      quote: "TSD helped us set up an AI chatbot that handles 60% of our customer inquiries. Our response time went from 4 hours to under 2 minutes.",
      author: "Local Restaurant Owner",
      role: "Charlotte, NC",
      metric: "60% fewer manual inquiries",
      projectOverview: "[Placeholder] Local Charlotte restaurant struggling with high volume of repetitive customer questions about hours, menu, reservations, and dietary options. We deployed a custom AI chatbot trained on their menu and FAQs, integrated with their reservation system.",
      results: [
        "[Placeholder] 60% reduction in manual customer inquiries",
        "[Placeholder] Average response time dropped from 4 hours to under 2 minutes",
        "[Placeholder] Front-of-house staff freed up to focus on dine-in service",
        "[Placeholder] Project completed in 2 weeks",
      ],
    },
    {
      quote: "They rebuilt our website and set up automated scheduling in just 3 weeks. The handoff documentation was so thorough I can manage everything myself.",
      author: "Dental Practice Manager",
      role: "Gastonia, NC",
      metric: "3-week turnaround",
      projectOverview: "[Placeholder] Established dental practice needed a modern website and online appointment scheduling. We delivered a custom-designed site with integrated booking, automated reminders, and a content management system the practice manager could update herself.",
      results: [
        "[Placeholder] New website launched in 3 weeks",
        "[Placeholder] Online bookings up 45% in first month",
        "[Placeholder] Reduced no-shows by 30% with automated reminders",
        "[Placeholder] Full self-service editing for staff",
      ],
    },
    {
      quote: "The tech audit alone was worth it. They identified 5 processes we could automate and saved us roughly 15 hours per week.",
      author: "Real Estate Brokerage",
      role: "Belmont, NC",
      metric: "15 hrs/week saved",
      projectOverview: "[Placeholder] Mid-sized real estate brokerage running on spreadsheets and manual data entry. Our tech audit mapped out their entire workflow and identified five high-impact automations. We then built out the top three.",
      results: [
        "[Placeholder] 15 hours/week of admin work eliminated",
        "[Placeholder] Lead intake fully automated from web to CRM",
        "[Placeholder] Listings auto-published across 3 platforms",
        "[Placeholder] Agents now spend more time selling, less time updating spreadsheets",
      ],
    },
  ];
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader center label="Results" title="What Our Clients" titleAccent="Experience"
          sub="Real impact for Charlotte-area businesses — measured in time saved, customers served, and revenue generated." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
          {testimonials.map((t, i) => (
            <GlassCard key={i} delay={i * 150} hoverGlow={C.accentGlow}
              expandable expandedContent={<TestimonialModalContent t={t} />}>
              <div style={{
                display: "inline-block", padding: "6px 14px", borderRadius: "8px",
                background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.2)",
                fontSize: "12px", fontWeight: 700, color: C.cyan, marginBottom: "20px",
              }}>{t.metric}</div>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textMuted, marginBottom: "24px", fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>{t.author}</p>
                <p style={{ fontSize: "13px", color: C.textDim }}>{t.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
