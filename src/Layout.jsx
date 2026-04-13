import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { C, v, useTheme, DiamondDivider, RippleButton } from "./shared";
import { TSDLogo, SunIcon, MoonIcon, MenuIcon, XIcon } from "./icons";

const NAV_ITEMS = [
  { label: "Services", to: "/services" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Team", to: "/team" },
];

export default function Layout() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); window.scrollTo(0, 0); }, [location]);

  return (
    <>
      {/* ── Nav ─────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "12px 48px" : "20px 48px",
        background: scrolled ? v("nav-bg") : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${v("divider")}` : "1px solid transparent",
        transition: "all 0.35s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
          <TSDLogo size={40} />
          <div>
            <div style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "3.5px", textTransform: "uppercase",
              color: v("text"), lineHeight: 1.2,
            }}>Modernization</div>
            <div style={{
              fontSize: "9px", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase",
              color: v("text-dim"),
            }}>Solutions</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} style={{
              fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px",
              color: location.pathname === item.to ? v("accent") : v("text-muted"),
              transition: "color 0.2s ease", textDecoration: "none",
            }}>{item.label}</Link>
          ))}
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer", color: v("text-muted"),
            padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center",
            transition: "color 0.2s ease",
          }} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/contact">
            <RippleButton variant="primary" style={{ padding: "10px 24px", fontSize: "13px" }}>
              Free Consultation
            </RippleButton>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="mobile-menu-btn">
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer", color: v("text-muted"),
            padding: "6px", display: "flex",
          }} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            background: "none", border: "none", cursor: "pointer", color: v("text"),
            padding: "4px", display: "flex",
          }} aria-label="Menu">
            {mobileOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ──────────────────── */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: v("bg"), backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px",
        }}>
          {[...NAV_ITEMS, { label: "Contact", to: "/contact" }].map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{
              fontSize: "20px", fontWeight: 700, letterSpacing: "1px",
              color: location.pathname === item.to ? v("accent") : v("text"),
              textDecoration: "none",
            }}>{item.label}</Link>
          ))}
        </div>
      )}

      {/* ── Content ─────────────────────────── */}
      <main><Outlet /></main>

      {/* ── Footer ──────────────────────────── */}
      <footer style={{
        padding: "60px 48px 40px", textAlign: "center",
        borderTop: `1px solid ${v("divider")}`,
      }}>
        <DiamondDivider width={160} style={{ marginBottom: "32px" }} />
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap", marginBottom: "24px" }}>
          {[...NAV_ITEMS, { label: "Contact", to: "/contact" }].map((item) => (
            <Link key={item.to} to={item.to} style={{
              fontSize: "13px", fontWeight: 600, color: v("text-muted"),
              transition: "color 0.2s", textDecoration: "none",
            }}>{item.label}</Link>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: v("text-dim"), marginBottom: "8px" }}>
          TSD Modernization Solutions — A division of TSD Incorporated, LLC
        </p>
        <p style={{ fontSize: "12px", color: v("text-dim") }}>
          Serving the Charlotte metro area including Gastonia, Belmont, and surrounding communities.
        </p>
        <p style={{ fontSize: "12px", color: v("text-dim"), marginTop: "16px" }}>
          &copy; {new Date().getFullYear()} TSD Ventures. All rights reserved.
        </p>
      </footer>
    </>
  );
}
