import { Link } from "react-router-dom";
import PageShell from "./PageShell";
import {
  C, v, SPACE, RADIUS, SHADOW,
  Eyebrow, GradientText, SectionHeader, Button, Card, PillBadge, useFadeIn,
} from "../shared";

/* The live demo app is deployed separately (Next.js + Supabase pgvector + Claude)
   and embedded here. Set VITE_DEMO_URL in the marketing site's env after deploy;
   falls back to the Vercel project URL. */
const DEMO_URL = import.meta.env.VITE_DEMO_URL || "https://tsd-rag-demo1.vercel.app";

const STEPS = [
  { n: "01", title: "Ask in plain English", body: "A visitor types or speaks a real question — pricing, hours, what's gluten-free, which service they need." },
  { n: "02", title: "It retrieves the real docs", body: "The question is matched against that business's own menu, pricing, FAQs and policies with vector search — not guessed." },
  { n: "03", title: "It answers, with sources", body: "A grounded, conversational answer comes back with the exact source documents cited and clickable. No made-up facts." },
];

const FEATURES = [
  ["Grounded & cited", "Every answer links the source it came from — open it and verify."],
  ["Voice + multilingual", "Speak to it and hear it back in English, Spanish, or Chinese."],
  ["Visual search", "Snap a photo of a part or a product and find the match."],
  ["Show-the-work panel", "A live look at the chunks retrieved and their similarity scores."],
  ["Embeddable anywhere", "One line of script drops it onto an existing site."],
  ["Captures leads", "Interested visitors get routed to a real conversation with you."],
  ["Bring your own doc", "Upload a PDF or paste a link — it's indexed live and the assistant answers from your real content."],
];

export default function Demo() {
  const [heroRef, heroFade] = useFadeIn(0);

  return (
    <PageShell>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: `0 ${SPACE.lg}` }}>
        {/* Hero */}
        <section ref={heroRef} style={{ ...heroFade, textAlign: "center", paddingTop: SPACE["2xl"], paddingBottom: SPACE["2xl"] }}>
          <Eyebrow style={{ justifyContent: "center" }}>Live demo</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-body)", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1, letterSpacing: "-1px",
            color: v("text"), margin: `${SPACE.md} 0`,
          }}>
            See an AI assistant <GradientText>trained on a business like yours</GradientText>
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.6, color: v("text-muted"), maxWidth: "640px", margin: "0 auto" }}>
            Pick a sample business below — auto shop, salon, restaurant, law firm, or store — and talk to its assistant.
            It answers only from that business's own documents, cites its sources, and speaks your language. This is exactly
            what TSD builds for clients.
          </p>
          <div style={{ display: "flex", gap: SPACE.md, justifyContent: "center", flexWrap: "wrap", marginTop: SPACE.xl }}>
            <Button as={Link} to="/book" variant="primary" size="lg">Book a free fit call</Button>
            <Button as="a" href={DEMO_URL} target="_blank" rel="noreferrer" variant="secondary" size="lg">Open full screen ↗</Button>
          </div>
        </section>

        {/* Embedded live demo */}
        <section style={{ paddingBottom: SPACE["3xl"] }}>
          <div style={{
            borderRadius: RADIUS["2xl"], overflow: "hidden",
            border: `1px solid ${v("surface-border")}`, boxShadow: SHADOW.xl,
            background: v("bg-alt"),
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: `${SPACE.sm} ${SPACE.md}`, background: C.navy }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: SPACE.sm, fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>tsd-modernization.com · live demo</span>
            </div>
            <iframe
              src={DEMO_URL}
              title="TSD live RAG demo"
              allow="microphone; clipboard-write"
              style={{ width: "100%", height: "min(90vh, 960px)", border: "none", display: "block", background: "#fbfaf7" }}
            />
          </div>
          <p style={{ textAlign: "center", fontSize: "13px", color: v("text-dim"), marginTop: SPACE.md }}>
            Best experienced on desktop. <a href={DEMO_URL} target="_blank" rel="noreferrer" style={{ color: v("accent") }}>Open it in its own tab →</a>
          </p>
        </section>

        {/* How it works */}
        <section style={{ paddingBottom: SPACE["3xl"] }}>
          <SectionHeader center label="How it works" num="01" title="Retrieval-augmented, not" titleAccent="made up" sub="The difference between a real assistant and a chatbot that hallucinates: it can only answer from what your business actually published." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: SPACE.lg }}>
            {STEPS.map((s, i) => (
              <Card key={s.n} delay={i * 80}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: v("accent"), fontWeight: 700, letterSpacing: "2px", marginBottom: SPACE.sm }}>{s.n}</div>
                <h3 style={{ fontSize: "19px", fontWeight: 700, color: v("text"), marginBottom: SPACE.sm }}>{s.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: v("text-muted") }}>{s.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section style={{ paddingBottom: SPACE["3xl"] }}>
          <SectionHeader center label="Every feature" num="02" title="Everything we'd put in" titleAccent="a real build" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: SPACE.md }}>
            {FEATURES.map(([title, body], i) => (
              <Card key={title} delay={i * 60} padded>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, marginBottom: SPACE.xs }}>
                  <span style={{ color: C.success, fontSize: "18px" }}>◆</span>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: v("text") }}>{title}</h4>
                </div>
                <p style={{ fontSize: "14px", lineHeight: 1.55, color: v("text-muted") }}>{body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section style={{ textAlign: "center", paddingBottom: SPACE["4xl"] }}>
          <PillBadge tone="accent" style={{ marginBottom: SPACE.md }}>For your business</PillBadge>
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 38px)", color: v("text"), marginBottom: SPACE.md, letterSpacing: "-0.5px" }}>
            Want one trained on <GradientText>your</GradientText> menu, pricing, and docs?
          </h2>
          <p style={{ fontSize: "17px", color: v("text-muted"), maxWidth: "560px", margin: `0 auto ${SPACE.xl}` }}>
            The fit call is free, and so is the cost-cut audit that comes with it. We'll tell you honestly whether this is worth building for you.
          </p>
          <Button as={Link} to="/book" variant="primary" size="lg">Book a free fit call</Button>
        </section>
      </div>
    </PageShell>
  );
}
