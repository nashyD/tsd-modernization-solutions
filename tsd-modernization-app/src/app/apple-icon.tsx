import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#060c1a",
          padding: "20px",
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="3" width="11" height="11" rx="2" fill="#13294B" />
          <rect x="18" y="3" width="11" height="11" rx="2" fill="#4B9CD3" />
          <rect x="3" y="18" width="11" height="11" rx="2" fill="#4B9CD3" />
          <rect x="18" y="18" width="11" height="11" rx="2" fill="#13294B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
