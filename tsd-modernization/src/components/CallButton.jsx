import { C } from "../shared";
import { PhoneIcon } from "../icons";

/* Floating call-us pill, bottom-left. Mirror of TSDAgent's collapsed
 * button (bottom-right). Uses a native tel: link so mobile dials and
 * desktop hands off to the OS handler (FaceTime, Skype, Teams, etc.). */
export default function CallButton() {
  return (
    <a
      href="tel:+17043175630"
      aria-label="Call TSD at 704-317-5630"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 1000,
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px 22px",
        borderRadius: "100px",
        background: C.gradientPrism,
        color: "#fff",
        textDecoration: "none",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.2px",
        boxShadow:
          "0 12px 30px rgba(19,41,75,0.35), 0 4px 12px rgba(19,41,75,0.25)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(19,41,75,0.4), 0 6px 16px rgba(19,41,75,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(19,41,75,0.35), 0 4px 12px rgba(19,41,75,0.25)";
      }}
    >
      <PhoneIcon size={18} />
      <span>Call us</span>
    </a>
  );
}
