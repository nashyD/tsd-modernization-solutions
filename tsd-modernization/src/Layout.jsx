import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { C } from "./shared";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Why Us", to: "/why-us" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Team", to: "/team" },
];

function MenuButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="menu-button-wrap" style={{
      position: "fixed",
      top: "24px", right: "32px",
      zIndex: 1000,
    }}>
      <div style={{ position: "relative" }}>
        <button
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "flex", flexDirection: "column", gap: "5px",
            alignItems: "center", justifyContent: "center",
            background: menuOpen ? `rgba(${C.accentRGB},0.2)` : "rgba(6,10,18,0.78)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: `1px solid ${menuOpen ? C.accentLight : C.glassBorder}`,
            borderRadius: "12px",
            padding: "14px 18px",
            cursor: "pointer",
            zIndex: 1001,
            transition: "all 0.25s ease",
            boxShadow: menuOpen
              ? `0 0 0 4px rgba(${C.accentRGB},0.18), 0 8px 30px rgba(0,0,0,0.5)`
              : "0 8px 24px rgba(0,0,0,0.45)",
          }}
          onMouseEnter={(e) => { if (!menuOpen) e.currentTarget.style.background = `rgba(${C.accentRGB},0.1)`; }}
          onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = "rgba(6,10,18,0.78)"; }}
        >
          <div style={{
            width: "24px", height: "2px", background: C.text,
            transition: "all 0.3s ease", borderRadius: "2px",
            transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
          }} />
          <div style={{
            width: "24px", height: "2px", background: C.text,
            transition: "all 0.3s ease", borderRadius: "2px",
            opacity: menuOpen ? 0 : 1,
          }} />
          <div style={{
            width: "24px", height: "2px", background: C.text,
            transition: "all 0.3s ease", borderRadius: "2px",
            transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
          }} />
        </button>

        {/* Dropdown panel */}
        <div style={{
          position: "absolute",
          top: "calc(100% + 14px)",
          right: 0,
          minWidth: "240px",
          background: "rgba(6,10,18,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${C.divider}`,
          borderRadius: "16px",
          padding: "12px",
          display: "flex", flexDirection: "column", gap: "2px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}>
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "15px", fontWeight: 500,
                color: isActive ? C.accentLight : C.textMuted,
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive ? `rgba(${C.accentRGB},0.15)` : "transparent",
              })}
              onMouseEnter={(e) => {
                if (e.currentTarget.getAttribute("aria-current") !== "page") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = C.text;
                }
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                e.currentTarget.style.background = isActive ? `rgba(${C.accentRGB},0.15)` : "transparent";
                e.currentTarget.style.color = isActive ? C.accentLight : C.textMuted;
              }}
            >{item.label}</NavLink>
          ))}
          <div style={{ height: "1px", background: C.divider, margin: "8px 4px" }} />
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "13px 16px", borderRadius: "10px",
              background: C.gradient1,
              color: "#fff",
              fontSize: "15px", fontWeight: 600,
              textAlign: "center",
              boxShadow: `0 4px 20px ${C.accentGlow}`,
              cursor: "pointer",
            }}>Free Consultation</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FloatingLogo() {
  return (
    <div
      aria-hidden="true"
      className="floating-logo"
      style={{
        position: "fixed",
        top: "12px", left: "50%",
        width: "280px",
        pointerEvents: "none",
        zIndex: 999,
        animation: "tsdFloatPulse 6s ease-in-out infinite",
        willChange: "transform, opacity",
      }}
    >
      <img
        src={C.logoSrc}
        alt=""
        style={{
          width: "100%", display: "block",
          filter: `drop-shadow(0 0 40px rgba(${C.accentRGB},0.55)) drop-shadow(0 0 80px rgba(${C.accentRGB},0.25))`,
        }}
      />
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "64px 48px 40px", textAlign: "center", fontSize: "14px",
      color: C.textDim, borderTop: `1px solid ${C.divider}`,
      background: "rgba(0,0,0,0.2)",
      position: "relative", zIndex: 2,
    }}>
      <Link to="/" aria-label="TSD Modernization Solutions — Home" style={{
        cursor: "pointer", marginBottom: "24px", display: "inline-block", textDecoration: "none",
      }}>
        <img
          src={C.logoSrc}
          alt="TSD Modernization Solutions"
          style={{ height: "140px", width: "auto", display: "block" }}
        />
      </Link>

      <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[...NAV_LINKS.filter((l) => l.to !== "/"), { label: "Contact", to: "/contact" }].map((item) => (
          <Link key={item.to} to={item.to} style={{
            color: C.textMuted, textDecoration: "none", fontSize: "14px", fontWeight: 500,
            cursor: "pointer", transition: "color 0.2s ease",
          }}
            onMouseEnter={(e) => (e.target.style.color = C.accentLight)}
            onMouseLeave={(e) => (e.target.style.color = C.textMuted)}>
            {item.label}
          </Link>
        ))}
      </div>

      <div style={{
        height: "1px", maxWidth: "200px", margin: "0 auto 24px",
        background: `linear-gradient(90deg, transparent, ${C.glassBorder}, transparent)`,
      }} />

      <p style={{ marginBottom: "8px", fontSize: "13px" }}>
        <span style={{ fontWeight: 700, color: C.text }}>TSD Modernization Solutions</span>{" "}
        &mdash; A division of TSD Incorporated, LLC
      </p>
      <p style={{ fontSize: "13px" }}>Serving the Charlotte Metro Area &middot; Gastonia &middot; Belmont &middot; Charlotte, NC</p>
      <p style={{ marginTop: "16px", opacity: 0.4, fontSize: "12px" }}>&copy; {new Date().getFullYear()} TSD Incorporated, LLC. All rights reserved.</p>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      margin: 0, padding: 0, overflowX: "hidden", background: C.bg, color: C.text,
      minHeight: "100vh",
    }}>
      <FloatingLogo />
      <MenuButton />
      <Outlet />
      <Footer />
    </div>
  );
}
