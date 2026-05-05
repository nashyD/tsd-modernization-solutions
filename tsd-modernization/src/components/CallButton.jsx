import { useState } from "react";
import { C, v, RADIUS } from "../shared";
import { PhoneIcon } from "../icons";

/* Floating call-us pill, bottom-left. Mirror of TSDAgent's collapsed
 * button (bottom-right). Uses a native tel: link so mobile dials and
 * desktop hands off to the OS handler (FaceTime, Skype, Teams, etc.).
 *
 * Visually consistent with the bottom-right chat bubble: same shape,
 * same lift-on-hover, same shadow treatment. Together they read as a
 * paired floating action dock instead of two unrelated widgets. */
export default function CallButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="tel:+17043175630"
      aria-label="Call TSD at 704-317-5630"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "22px",
        left: "22px",
        zIndex: 1000,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px 12px 14px",
        borderRadius: RADIUS.full,
        background: hovered ? v("nav-bg") : v("surface"),
        color: v("text"),
        border: `1px solid ${hovered ? v("surface-border-hover") : v("surface-border")}`,
        textDecoration: "none",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.1px",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        boxShadow: hovered
          ? "0 18px 44px rgba(7,13,26,0.45), 0 6px 18px rgba(7,13,26,0.25)"
          : "0 12px 30px rgba(7,13,26,0.35), 0 4px 12px rgba(7,13,26,0.18)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Icon medallion — gradient fill so the call button reads as the
          primary surface in this corner regardless of theme. */}
      <span style={{
        width: "28px", height: "28px", borderRadius: RADIUS.full,
        background: C.gradientAccent,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: "#fff",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        flexShrink: 0,
      }}>
        <PhoneIcon size={14} />
      </span>
      <span>Call us</span>
    </a>
  );
}
