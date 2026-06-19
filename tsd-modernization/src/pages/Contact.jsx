import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  C, v, useFadeIn,
  SectionHeader, Button,
  Eyebrow,
  SPACE, RADIUS, SHADOW,
} from "../shared";
import { CheckIcon, PhoneIcon, ClockIcon, MapPinIcon } from "../icons";
import PageShell from "./PageShell";

function ContactInfo() {
  const [ref, fadeStyle] = useFadeIn(0);
  const blocks = [
    { label: "Call", value: "(980) 890-5815", href: "tel:+19808905815", Icon: PhoneIcon },
    { label: "Hours", value: "Every day · 8am – 8pm", Icon: ClockIcon },
    { label: "Service area", value: "Charlotte · Gastonia · Belmont", Icon: MapPinIcon },
  ];

  return (
    <div ref={ref} style={{
      ...fadeStyle,
      padding: `${SPACE.xl} clamp(20px, 4vw, 48px) 0`,
      maxWidth: "780px", margin: "0 auto",
    }}>
      <div className="card-grid" style={{
        "--cg-min": "190px",
        gap: SPACE.md,
      }}>
        {blocks.map((b, i) => {
          const inner = (
            <div style={{
              padding: "20px 22px", borderRadius: RADIUS.lg,
              background: "var(--glass-bg-strong)",
              backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
              WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
              transition: "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
              display: "flex", alignItems: "center", gap: "14px",
              height: "100%",
            }}>
              <span style={{
                width: "40px", height: "40px", borderRadius: RADIUS.full,
                background: "rgba(75,156,211,0.10)",
                color: v("accent"),
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <b.Icon size={18} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "2px",
                  textTransform: "uppercase", color: v("text-dim"),
                  marginBottom: "4px",
                }}>{b.label}</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: v("text"), lineHeight: 1.3 }}>
                  {b.value}
                </div>
              </div>
            </div>
          );

          return b.href ? (
            <a key={i} href={b.href}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
              onMouseEnter={(e) => {
                e.currentTarget.firstChild.style.borderColor = "var(--glass-border-strong)";
                e.currentTarget.firstChild.style.transform = "translateY(-2px)";
                e.currentTarget.firstChild.style.boxShadow = "var(--glass-shadow), 0 0 28px var(--glass-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.firstChild.style.borderColor = "var(--glass-border)";
                e.currentTarget.firstChild.style.transform = "translateY(0)";
                e.currentTarget.firstChild.style.boxShadow = "var(--glass-shadow)";
              }}>
              {inner}
            </a>
          ) : (
            <div key={i}>{inner}</div>
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
  const [searchParams] = useSearchParams();
  const refSource = searchParams.get("ref") || "";

  const inputStyle = {
    padding: "14px 18px", borderRadius: RADIUS.md,
    border: `1px solid ${v("surface-border")}`,
    background: v("bg-alt"),
    color: v("text"),
    fontSize: "15px", fontFamily: "var(--font-body)", width: "100%",
    transition: "border-color 0.2s ease, background 0.2s ease",
    outline: "none",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const subjectPrefix = refSource ? `[${refSource}] ` : "";
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `${subjectPrefix}New inquiry from ${formData.name || "website visitor"}`,
          from_name: "TSD Modernization Solutions Website",
          replyto: formData.email,
          name: formData.name, email: formData.email,
          business: formData.business || "(not provided)",
          message: formData.message || "(no message)",
          source: refSource || "(direct)",
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
    <div style={{
      padding: `${SPACE["2xl"]} clamp(20px, 4vw, 48px) ${SPACE["3xl"]}`,
      maxWidth: "780px", margin: "0 auto",
    }}>
      <SectionHeader center label="Get Started" title="Start your" titleAccent="project"
        sub="Tell us about your business and what you'd want modernized. We respond within 24 hours and follow up with a free fit call." />
      <div ref={ref} style={{
        ...fadeStyle,
        padding: "clamp(28px, 4vw, 48px)",
        borderRadius: "var(--glass-radius)",
        background: "var(--glass-bg-strong)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        position: "relative",
        isolation: "isolate",
        boxShadow: "var(--glass-shadow)",
      }}>
        {/* Specular top-edge rim */}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
          background: "linear-gradient(90deg, transparent, var(--glass-rim), transparent)",
          pointerEvents: "none",
        }} />

        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: RADIUS.full,
              background: "rgba(6,214,160,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              color: C.success,
            }}>
              <CheckIcon size={32} strokeWidth={2.5} />
            </div>
            <h3 style={{
              fontSize: "26px", fontWeight: 700, color: v("text"),
              marginBottom: SPACE.sm, letterSpacing: "-0.4px",
            }}>Thank you.</h3>
            <p style={{ fontSize: "15px", color: v("text-muted") }}>We'll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: SPACE.md }}>
            <input type="text" name="botcheck" value={formData.botcheck}
              onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
              tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.md }} className="contact-form-row">
              <div>
                <label htmlFor="contact-name" className="sr-only">Your name</label>
                <input id="contact-name" style={inputStyle} type="text" placeholder="Your name" required
                  autoComplete="name"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={(e) => { e.target.style.borderColor = C.carolina; e.target.style.background = v("surface"); }}
                  onBlur={(e) => { e.target.style.borderColor = v("surface-border"); e.target.style.background = v("bg-alt"); }} />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Email address</label>
                <input id="contact-email" style={inputStyle} type="email" placeholder="Email address" required
                  autoComplete="email"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={(e) => { e.target.style.borderColor = C.carolina; e.target.style.background = v("surface"); }}
                  onBlur={(e) => { e.target.style.borderColor = v("surface-border"); e.target.style.background = v("bg-alt"); }} />
              </div>
            </div>
            <div>
              <label htmlFor="contact-business" className="sr-only">Business name (optional)</label>
              <input id="contact-business" style={inputStyle} type="text" placeholder="Business name"
                autoComplete="organization"
                value={formData.business} onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = C.carolina; e.target.style.background = v("surface"); }}
                onBlur={(e) => { e.target.style.borderColor = v("surface-border"); e.target.style.background = v("bg-alt"); }} />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">Tell us about your business</label>
              <textarea id="contact-message" style={{ ...inputStyle, minHeight: "140px", resize: "vertical", lineHeight: 1.5 }}
                placeholder="Tell us about your business and what you're looking to modernize..."
                value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = C.carolina; e.target.style.background = v("surface"); }}
                onBlur={(e) => { e.target.style.borderColor = v("surface-border"); e.target.style.background = v("bg-alt"); }} />
            </div>
            {error && (
              <div role="alert" style={{
                padding: "12px 16px", borderRadius: RADIUS.md,
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.32)",
                color: "#fca5a5", fontSize: "14px",
              }}>{error}</div>
            )}
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
            <p style={{
              fontSize: "12px", color: v("text-dim"), textAlign: "center",
              fontStyle: "normal", fontFamily: "var(--font-body)", marginTop: SPACE.sm,
            }}>
              Free fit call · 48-hour written proposal · 100% money-back guarantee.
            </p>
          </form>
        )}
      </div>
      <style>{`
        @media (max-width: 540px) {
          .contact-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ServiceAreaMap() {
  const [ref, fadeStyle] = useFadeIn(0);
  return (
    <div ref={ref} style={{
      ...fadeStyle,
      padding: `${SPACE.xl} clamp(20px, 4vw, 48px) 0`,
      maxWidth: "780px", margin: "0 auto",
    }}>
      <div style={{
        position: "relative",
        borderRadius: RADIUS.lg, overflow: "hidden",
        border: `1px solid ${v("surface-border")}`,
        height: "300px",
        boxShadow: SHADOW.sm,
      }}>
        <iframe
          title="TSD Modernization Solutions service area — Charlotte, NC"
          src="https://www.google.com/maps?q=Charlotte%2C+NC&t=&z=11&ie=UTF8&iwloc=&output=embed"
          width="100%" height="100%"
          style={{ border: 0, display: "block", filter: "saturate(0.9)" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <PageShell>
      <ContactInfo />
      <ServiceAreaMap />
      <ContactForm />
    </PageShell>
  );
}
