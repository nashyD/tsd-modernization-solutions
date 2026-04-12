import { Link } from "react-router-dom";
import { C, RippleButton } from "../shared";
import PageShell from "./PageShell";

export default function Testimonials() {
  return (
    <PageShell>
      <div style={{ padding: "40px 48px", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
          letterSpacing: "-1px", marginBottom: "20px", color: C.text,
        }}>
          Client work starts this summer
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.7, color: C.textMuted, marginBottom: "16px" }}>
          We launch in May 2026. Once we have real projects under our belt,
          this page will have actual results from actual clients &mdash; not
          placeholder quotes.
        </p>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textDim, marginBottom: "40px" }}>
          In the meantime, if you want to be one of our first clients
          (and get our lowest prices), reach out.
        </p>
        <Link to="/contact" style={{ textDecoration: "none" }}>
          <RippleButton style={{
            padding: "16px 36px", borderRadius: "14px", background: C.gradient1,
            color: "#fff", fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
            boxShadow: `0 0 30px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
          }}>
            Get in touch &rarr;
          </RippleButton>
        </Link>
      </div>
    </PageShell>
  );
}
