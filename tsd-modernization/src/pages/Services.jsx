import { Link } from "react-router-dom";
import { v, SectionHeader, Card, Tag } from "../shared";
import PageShell from "./PageShell";
import { SERVICES } from "../services-data";

export default function Services() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader center label="What We Do" title="Our" titleAccent="services"
          sub="Every engagement is hands-on, fully documented, and priced for small business budgets." />
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {SERVICES.map((s, i) => (
            <Link key={s.slug} to={`/services/${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card delay={i * 120}
                style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "start", cursor: "pointer" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "16px", background: s.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#a8d1ed", flexShrink: 0,
                }}><s.Icon size={28} /></div>
                <div>
                  <h3 style={{ fontSize: "22px", fontWeight: 700, color: v("text"), marginBottom: "10px" }}>{s.title}</h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: v("text-muted"), marginBottom: "8px" }}>{s.desc}</p>
                  <p style={{ fontSize: "14px", lineHeight: 1.7, color: v("text-dim"), marginBottom: "20px" }}>{s.longDesc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
