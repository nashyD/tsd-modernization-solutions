import { useState } from "react";
import { C, v, useFadeIn, SectionHeader, RippleButton, DiamondDivider } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

/* ── FAQ ───────────────────────────────────────────────────────── */
function FAQSection() {
  const faqs = [
    { q: "How does the free consultation work?", a: "We schedule a 1-2 hour session (in-person or remote) where we walk through your current operations, tools, and pain points. You'll get actionable insights on the spot \u2014 no sales pressure. If there's a fit, we'll follow up with a written proposal within 48 hours." },
    { q: "How does the Summer 2026 cohort work?", a: "We operate from May 7 to August 10, 2026 \u2014 three founders running together over the summer, capped at ten clients so every project gets the time it needs. Last project start is July 13. After August 10 we hand off; one founder stays on call for fixes through August 31." },
    { q: "Do I need to know anything about AI?", a: "Not at all. That's what we're here for. We'll explain everything in plain English, recommend only tools that genuinely fit your needs, and handle all the technical setup. You just tell us what's slowing your business down." },
    { q: "What happens after my project is done?", a: "Every project ends with handoff documentation, video tutorials, and a live training session. You'll run everything independently from there. One founder stays on call for fixes through August 31, 2026; past that, the season closes." },
    { q: "Why are your prices so much lower than agencies?", a: "We're a lean team of three founders with minimal overhead. The founding-cohort rate is deliberately half what we'll charge after Summer 2026, set so we can build our portfolio and earn client trust. You get the same quality at 3-5x less than agency rates." },
    { q: "What's your service area?", a: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities. Discovery meetings can be done in-person or remote." },
    { q: "How long does a typical project take?", a: "Tech audits are done in a single session. Website builds and AI integrations typically take 2-4 weeks from proposal to handoff." },
  ];
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, fadeStyle] = useFadeIn(0);

  return (
    <div style={{ padding: "60px 48px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <SectionHeader center label="FAQ" title="Common" titleAccent="questions"
        sub="The stuff people usually ask before getting started." />
      <div ref={ref} style={{ ...fadeStyle, display: "flex", flexDirection: "column", gap: "10px" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{
              background: v("surface"), border: `1px solid ${isOpen ? v("accent") : v("surface-border")}`,
              borderRadius: "14px", overflow: "hidden", transition: "border-color 0.3s ease",
            }}>
              <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{
                width: "100%", padding: "18px 22px", background: "none", border: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", color: v("text"), fontSize: "15px", fontWeight: 600,
                textAlign: "left", fontFamily: "var(--font-body)",
              }}>
                {faq.q}
                <span style={{
                  fontSize: "18px", color: v("accent"), transition: "transform 0.3s ease",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: "16px",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? "300px" : "0", overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <p style={{ padding: "0 22px 18px", fontSize: "14px", lineHeight: 1.7, color: v("text-muted") }}>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Contact info (NAP block) ──────────────────────────────────── */
function ContactInfo() {
  const [ref, fadeStyle] = useFadeIn(0);
  const blocks = [
    { label: "Call", value: "(704) 275-1410", href: "tel:+17042751410" },
    { label: "Hours", value: "Every day · 8am – 8pm" },
    { label: "Service area", value: "Charlotte · Gastonia · Belmont" },
  ];
  const cardStyle = {
    padding: "18px 22px", borderRadius: "14px",
    background: v("surface"), border: `1px solid ${v("surface-border")}`,
    textAlign: "center", transition: "border-color 0.2s ease",
  };
  return (
    <div ref={ref} style={{
      ...fadeStyle, padding: "40px 48px 0", maxWidth: "700px", margin: "0 auto",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
      }}>
        {blocks.map((b, i) => {
          const inner = (
            <>
              <div style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: v("text-dim"), marginBottom: "6px",
              }}>{b.label}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: v("text") }}>
                {b.value}
              </div>
            </>
          );
          return b.href ? (
            <a key={i} href={b.href}
              style={{ ...cardStyle, display: "block", textDecoration: "none", color: "inherit" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = v("accent"); }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = v("surface-border"); }}>
              {inner}
            </a>
          ) : (
            <div key={i} style={cardStyle}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Contact form ──────────────────────────────────────────────── */
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", business: "", message: "", botcheck: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ref, fadeStyle] = useFadeIn(0);

  const inputStyle = {
    padding: "14px 18px", borderRadius: "12px",
    border: `1px solid ${v("surface-border")}`,
    background: v("surface"), color: v("text"),
    fontSize: "15px", fontFamily: "var(--font-body)", width: "100%",
    transition: "border-color 0.2s ease",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `New inquiry from ${formData.name || "website visitor"}`,
          from_name: "TSD Modernization Solutions Website",
          replyto: formData.email,
          name: formData.name, email: formData.email,
          business: formData.business || "(not provided)",
          message: formData.message || "(no message)",
          botcheck: formData.botcheck,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", business: "", message: "", botcheck: "" });
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setSending(false);
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: "700px", margin: "0 auto" }}>
      <SectionHeader center label="Let's Talk" title="Start your" titleAccent="project"
        sub="Tell us what you need and we'll get back to you within 24 hours." />
      <div ref={ref} style={{
        ...fadeStyle, padding: "48px", borderRadius: "24px",
        background: v("surface"), border: `1px solid ${v("surface-border")}`,
      }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%", background: "rgba(6,214,160,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <CheckIcon size={28} style={{ color: C.success }} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: v("text"), marginBottom: "8px" }}>Thank you!</h3>
            <p style={{ fontSize: "15px", color: v("text-muted") }}>We'll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Honeypot */}
            <input type="text" name="botcheck" value={formData.botcheck}
              onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
              tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label htmlFor="contact-name" className="sr-only">Your name</label>
                <input id="contact-name" style={inputStyle} type="text" placeholder="Your name" required
                  autoComplete="name"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={(e) => { e.target.style.borderColor = C.carolina; }}
                  onBlur={(e) => { e.target.style.borderColor = ""; }} />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Email address</label>
                <input id="contact-email" style={inputStyle} type="email" placeholder="Email address" required
                  autoComplete="email"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={(e) => { e.target.style.borderColor = C.carolina; }}
                  onBlur={(e) => { e.target.style.borderColor = ""; }} />
              </div>
            </div>
            <div>
              <label htmlFor="contact-business" className="sr-only">Business name (optional)</label>
              <input id="contact-business" style={inputStyle} type="text" placeholder="Business name"
                autoComplete="organization"
                value={formData.business} onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = C.carolina; }}
                onBlur={(e) => { e.target.style.borderColor = ""; }} />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">Tell us about your business</label>
              <textarea id="contact-message" style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                placeholder="Tell us about your business and what you're looking to modernize..."
                value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = C.carolina; }}
                onBlur={(e) => { e.target.style.borderColor = ""; }} />
            </div>
            {error && (
              <div role="alert" style={{
                padding: "12px 16px", borderRadius: "10px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5", fontSize: "14px",
              }}>{error}</div>
            )}
            <RippleButton type="submit" disabled={sending} style={{
              width: "100%", padding: "16px 0", opacity: sending ? 0.7 : 1,
            }}>
              {sending ? "Sending..." : "Send Message"}
            </RippleButton>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Contact page ──────────────────────────────────────────────── */
export default function Contact() {
  return (
    <PageShell>
      <ContactInfo />
      <ContactForm />
      <DiamondDivider width={120} style={{ margin: "20px auto" }} />
      <FAQSection />
    </PageShell>
  );
}
