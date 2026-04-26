import { useState } from "react";
import { C, v, useFadeIn, SectionHeader, RippleButton } from "../shared";
import { CheckIcon } from "../icons";
import PageShell from "./PageShell";

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

/* ── Service-area map — Charlotte metro centroid. TSD operates as a
     service-area business (no storefront), so the map shows the city
     centroid rather than a pinned address. Useful as a local-SEO signal
     and as visitor reassurance that we're locally based. ────────── */
function ServiceAreaMap() {
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <div ref={ref} style={{
      ...fadeStyle, padding: "32px 48px 0", maxWidth: "700px", margin: "0 auto",
    }}>
      <div style={{
        position: "relative",
        borderRadius: "14px", overflow: "hidden",
        border: `1px solid ${v("surface-border")}`,
        height: "280px",
      }}>
        <iframe
          title="TSD Modernization Solutions service area — Charlotte, NC"
          src="https://www.google.com/maps?q=Charlotte%2C+NC&t=&z=11&ie=UTF8&iwloc=&output=embed"
          width="100%" height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

/* ── Contact page ──────────────────────────────────────────────── */
export default function Contact() {
  return (
    <PageShell>
      <ContactInfo />
      <ServiceAreaMap />
      <ContactForm />
    </PageShell>
  );
}
