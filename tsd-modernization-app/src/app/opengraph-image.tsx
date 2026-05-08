import { ImageResponse } from "next/og";

export const alt = "TSD Modernization Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(circle at 15% 10%, rgba(75,156,211,0.25) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(31,54,102,0.5) 0%, transparent 60%), #060c1a",
          color: "#e9eef7",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect x="3" y="3" width="11" height="11" rx="2" fill="#13294B" />
            <rect x="18" y="3" width="11" height="11" rx="2" fill="#4B9CD3" />
            <rect x="3" y="18" width="11" height="11" rx="2" fill="#4B9CD3" />
            <rect x="18" y="18" width="11" height="11" rx="2" fill="#13294B" />
          </svg>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#e9eef7",
            }}
          >
            TSD Modernization Solutions
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#4B9CD3",
            }}
          >
            Charlotte · Summer 2026
          </div>
          <div
            style={{
              fontSize: "78px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              maxWidth: "1000px",
            }}
          >
            Custom websites, working AI, source code yours from day one.
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#98a4b8",
              marginTop: "16px",
            }}
          >
            tsd-modernization.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
