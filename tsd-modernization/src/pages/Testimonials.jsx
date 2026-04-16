import { Link } from "react-router-dom";
import { v, SectionHeader, DiamondDivider, RippleButton } from "../shared";
import { QuoteIcon, ArrowRightIcon } from "../icons";
import PageShell from "./PageShell";

export default function Testimonials() {
  return (
    <PageShell>
      <div style={{
        padding: "40px 48px 120px", maxWidth: "760px", margin: "0 auto",
        textAlign: "center",
      }}>
        <SectionHeader
          center
          label="Case Studies"
          title="Coming"
          titleAccent="soon"
          sub="We're a new Charlotte team, just accepting our first clients."
        />

        <DiamondDivider width={180} style={{ margin: "8px auto 40px" }} />

        <div style={{
          width: "88px", height: "88px", borderRadius: "50%",
          background: "rgba(75,156,211,0.08)",
          border: `1px solid ${v("divider")}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
        }}>
          <QuoteIcon size={36} style={{ color: v("accent") }} />
        </div>

        <p style={{
          fontSize: "16px", lineHeight: 1.8, color: v("text-muted"),
          marginBottom: "24px",
        }}>
          Every project we ship will be documented here with real outcomes — load time saved, hours reclaimed, revenue captured. Names, faces, numbers, and the story of what we built.
        </p>

        <p style={{
          fontSize: "15px", lineHeight: 1.7, color: v("text-dim"),
          marginBottom: "40px",
        }}>
          Want to be the first case study?
        </p>

        <Link to="/contact">
          <RippleButton variant="primary" style={{ padding: "16px 36px", fontSize: "15px" }}>
            Claim a founding slot <ArrowRightIcon size={16} />
          </RippleButton>
        </Link>
      </div>
    </PageShell>
  );
}
