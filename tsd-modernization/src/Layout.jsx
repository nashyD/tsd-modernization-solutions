import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { C, RippleButton } from "./shared";

const NAV_LINKS = [
  { label: "Services", to: "/services" },
  { label: "Why Us", to: "/why-us" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Team", to: "/team" },
];

function Nav({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,15,0.85)" : "rgba(10,10,15,0.6)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: scrolled ? `1px solid ${C.divider}` : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <Link to="/" aria-label="TSD Modernization Solutions — Home" style={{
        display: "flex", alignItems: "center",
        cursor: "pointer", zIndex: 1001, textDecoration: "none",
      }}>
        <img
          src="/tsd-ms-logo.svg"
          alt="TSD Modernization Solutions"
          style={{ height: "56px", width: "auto", display: "block" }}
        />
      </Link>

      {/* Desktop nav */}
      <ul className="desktop-nav" style={{ display: "flex", gap: "28px", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
        {NAV_LINKS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                fontSize: "14px", fontWeight: 500,
                color: isActive ? C.accentLight : C.textMuted,
                textDecoration: "none",
                transition: "color 0.2s ease",
              })}
              onMouseEnter={(e) => (e.target.style.color = "#fff")}
              onMouseLeave={(e) => {
                const isActive = e.target.getAttribute("aria-current") === "page";
                e.target.style.color = isActive ? C.accentLight : C.textMuted;
              }}
            >{item.label}</NavLink>
          </li>
        ))}
        <li>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <RippleButton style={{
              padding: "10px 24px", borderRadius: "12px", background: C.gradient1,
              color: "#fff", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
              boxShadow: `0 4px 20px ${C.accentGlow}`,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 30px ${C.accentGlow}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${C.accentGlow}`; }}
            >Free Consultation</RippleButton>
          </Link>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" aria-label="Menu" style={{
        display: "none", background: "none", border: "none", cursor: "pointer",
        padding: "8px", zIndex: 1001,
      }} onClick={() => setMenuOpen(!menuOpen)}>
        <div style={{
          width: "24px", height: "2px", background: C.text, marginBottom: "6px",
          transition: "all 0.3s ease",
          transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
        }} />
        <div style={{
          width: "24px", height: "2px", background: C.text,
          transition: "all 0.3s ease",
          opacity: menuOpen ? 0 : 1,
        }} />
        <div style={{
          width: "24px", height: "2px", background: C.text, marginTop: "6px",
          transition: "all 0.3s ease",
          transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
        }} />
      </button>

      {/* Mobile menu overlay */}
      <div className="mobile-menu" style={{
        position: "fixed", inset: 0, background: "rgba(10,10,15,0.97)",
        backdropFilter: "blur(20px)", zIndex: 999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "28px",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}>
        {[...NAV_LINKS, { label: "Contact", to: "/contact" }].map((item) => (
          <Link key={item.to} to={item.to} style={{
            fontSize: "28px", fontWeight: 700, color: C.text,
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}>{item.label}</Link>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "64px 48px 40px", textAlign: "center", fontSize: "14px",
      color: C.textDim, borderTop: `1px solid ${C.divider}`,
      background: "rgba(0,0,0,0.2)",
    }}>
      <Link to="/" aria-label="TSD Modernization Solutions — Home" style={{
        cursor: "pointer", marginBottom: "24px", display: "inline-block", textDecoration: "none",
      }}>
        <img
          src="/tsd-ms-logo.svg"
          alt="TSD Modernization Solutions"
          style={{ height: "88px", width: "auto", display: "block" }}
        />
      </Link>

      <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[...NAV_LINKS, { label: "Contact", to: "/contact" }].map((item) => (
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
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      margin: 0, padding: 0, overflowX: "hidden", background: C.bg, color: C.text,
      minHeight: "100vh",
    }}>
      <Nav scrolled={scrolled} />
      <Outlet />
      <Footer />
    </div>
  );
}
