import { useState } from "react";
import { C, useFadeIn, SectionHeader, RippleButton } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

function FAQSection() {
  const faqs = [
    { q: "How does the free tech audit work?", a: "We schedule a 1-2 hour session (in-person or remote) where we walk through your current operations, tools, and pain points. You'll get actionable insights on the spot — no sales pressure. If there's a fit, we'll follow up with a written proposal within 48 hours." },
    { q: "Do I need to know anything about AI?", a: "Not at all. That's what we're here for. We'll explain everything in plain English, recommend only tools that genuinely fit your needs, and handle all the technical setup. You just tell us what's slowing your business down." },
    { q: "What happens after my project is done?", a: "Every project comes with comprehensive handoff documentation, video tutorials, and a 2-week support window. You'll be able to manage everything independently. For ongoing support, our monthly retainer ($200-$500/mo) keeps us available for updates, new automations, and troubleshooting." },
    { q: "Why are your prices so much lower than agencies?", a: "We're a lean team of three founders with minimal overhead — no office rent, no account managers, no bloated project management. We're also deliberately underpricing to build our portfolio and earn client trust. You get the same quality at 3-5x less." },
    { q: "What's your service area?", a: "We serve the Charlotte metro area including Gastonia, Belmont, and surrounding communities (roughly a 40-50 mile radius). Discovery meetings can be done in-person or remote, and all technical work is done remotely." },
    { q: "How long does a typical project take?", a: "Tech audits are done in a single session. Website builds and AI integrations typically take 2-4 weeks from proposal to handoff. Our 48-hour proposal turnaround means you won't be waiting around to get started." },
  ];
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <div style={{ padding: "80px 48px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <SectionHeader center label="FAQ" title="Common" titleAccent="Questions"
        sub="Everything you need to know about working with TSD Modernization Solutions." />
      <div ref={ref} style={{ ...fadeStyle, display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{
              background: C.glass, border: `1px solid ${isOpen ? `rgba(${C.accentRGB},0.3)` : C.glassBorder}`,
              borderRadius: "16px", overflow: "hidden",
              transition: "border-color 0.3s ease",
            }}>
              <button onClick={() => setOpenIndex(isOpen ? null : i)} style={{
                width: "100%", padding: "20px 24px", background: "none", border: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", color: C.text, fontSize: "16px", fontWeight: 600,
                textAlign: "left",
              }}>
                {faq.q}
                <span style={{
                  fontSize: "20px", color: C.accentLight,
                  transition: "transform 0.3s ease",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  flexShrink: 0, marginLeft: "16px",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? "300px" : "0",
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <p style={{
                  padding: "0 24px 20px", fontSize: "14px", lineHeight: 1.7,
                  color: C.textMuted,
                }}>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", business: "", message: "", botcheck: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ref, fadeStyle] = useFadeIn(0);

  const inputStyle = {
    padding: "16px 20px", borderRadius: "14px", border: `1px solid ${C.glassBorder}`,
    background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "15px",
    outline: "none", backdropFilter: "blur(10px)", transition: "border-color 0.2s ease, background 0.2s ease",
    fontFamily: "inherit",
  };
  const focusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = `rgba(${C.accentRGB},0.4)`; e.target.style.background = "rgba(255,255,255,0.1)"; },
    onBlur: (e) => { e.target.style.borderColor = C.glassBorder; e.target.style.background = "rgba(255,255,255,0.06)"; },
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
          access_key: "324d5bf7-1ecb-4da6-9e04-6626f782b082",
          subject: `New tech audit request from ${formData.name || "website visitor"}`,
          from_name: "TSD Modernization Solutions Website",
          replyto: formData.email,
          name: formData.name,
          email: formData.email,
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
        setError(data.message || "Something went wrong. Please try again or email us directly at nashdavis@tsd-ventures.com.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setSending(false);
  };

  return (
    <div style={{ padding: "40px 48px", textAlign: "center", position: "relative" }}>
      <div style={{
        position: "absolute", width: "600px", height: "400px", borderRadius: "50%",
        filter: "blur(120px)", opacity: 0.2, background: `radial-gradient(circle, ${C.accent}, transparent)`,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />
      <div ref={ref} style={{
        ...fadeStyle,
        maxWidth: "800px", margin: "0 auto", position: "relative",
        background: `linear-gradient(145deg, rgba(${C.navyRGB},0.45), rgba(${C.accentRGB},0.1))`,
        border: `1px solid rgba(${C.accentRGB},0.3)`,
        borderRadius: "32px", padding: "64px 48px",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 25px 80px rgba(${C.accentRGB},0.15)`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
          fontSize: "13px", fontWeight: 700, color: "rgba(167,139,250,0.8)",
          textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px",
        }}>&#9670; Let's Talk</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px", color: C.text }}>
          Ready to Modernize Your Business?
        </h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6, color: C.textMuted, maxWidth: "500px", margin: "0 auto 40px" }}>
          Start with a free, no-obligation tech audit. We'll map your current operations and show you exactly where AI and automation can help.
        </p>

        {submitted ? (
          <div style={{
            padding: "40px", borderRadius: "16px",
            background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.3)",
          }}>
            <div style={{ marginBottom: "16px", color: C.success, display: "flex", justifyContent: "center" }}><CheckIcon size={56} strokeWidth={2.5} /></div>
            <h3 style={{ fontSize: "24px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>Thank you!</h3>
            <p style={{ color: C.textMuted, fontSize: "16px" }}>We'll be in touch within 24 hours to schedule your free tech audit.</p>
          </div>
        ) : (
          <form style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}
            onSubmit={handleSubmit}>
            <input
              type="text"
              name="botcheck"
              value={formData.botcheck}
              onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <input style={inputStyle} type="text" placeholder="Your name" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} {...focusHandlers} />
              <input style={inputStyle} type="email" placeholder="Email address" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} {...focusHandlers} />
            </div>
            <input style={inputStyle} type="text" placeholder="Business name" value={formData.business}
              onChange={(e) => setFormData({ ...formData, business: e.target.value })} {...focusHandlers} />
            <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              placeholder="Tell us about your business and what you're looking to modernize..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} {...focusHandlers} />
            {error && (
              <div style={{
                padding: "14px 18px", borderRadius: "12px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)",
                color: "#fca5a5", fontSize: "14px", textAlign: "left", lineHeight: 1.5,
              }}>{error}</div>
            )}
            <RippleButton type="submit" style={{
              padding: "18px 44px", borderRadius: "16px", background: C.gradient1,
              color: "#fff", fontSize: "16px", fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: `0 8px 25px ${C.accentGlow}`, transition: "transform 0.2s ease, box-shadow 0.2s ease",
              opacity: sending ? 0.7 : 1,
            }}
              disabled={sending}
              onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 35px ${C.accentGlowStrong}`; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 25px ${C.accentGlow}`; }}
            >{sending ? "Sending..." : "Book My Free Tech Audit \u2192"}</RippleButton>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <PageShell>
      <ContactForm />
      <FAQSection />
    </PageShell>
  );
}
