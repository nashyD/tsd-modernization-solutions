import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { C, v, useTheme, DiamondDivider, RippleButton } from "./shared";
import { TSDLogo, SunIcon, MoonIcon, MenuIcon, XIcon, ChevronDownIcon } from "./icons";

const NAV_ITEMS = [
  { label: "Services", to: "/services" },
  { label: "Why Us", to: "/why-us" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

export default function Layout() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [location]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

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

        {/* Right side controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer", color: v("text-muted"),
            padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center",
            transition: "color 0.2s ease",
          }} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Menu dropdown trigger */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: menuOpen ? v("surface") : C.gradientPrism,
              border: menuOpen ? `1px solid ${v("surface-border")}` : "1px solid transparent",
              cursor: "pointer",
              color: menuOpen ? v("text") : "#fff",
              padding: "7px 14px", borderRadius: "100px",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
              boxShadow: menuOpen ? "none" : "0 2px 10px rgba(75,156,211,0.25)",
              lineHeight: 1,
            }} aria-label="Navigation menu">
              {menuOpen ? <XIcon size={14} /> : <MenuIcon size={14} />}
              Menu
            </button>

            {/* Dropdown panel */}
            {menuOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 12px)", right: 0,
                minWidth: "220px", padding: "8px",
                background: v("nav-bg"), backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: `1px solid ${v("surface-border")}`,
                borderRadius: "16px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
                animation: "fadeUp 0.2s ease",
              }}>
                {NAV_ITEMS.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} style={{
                    display: "block", padding: "12px 16px", borderRadius: "10px",
                    fontSize: "14px", fontWeight: 600, textDecoration: "none",
                    color: location.pathname === item.to ? v("accent") : v("text"),
                    background: location.pathname === item.to ? "rgba(75,156,211,0.1)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                    onMouseEnter={(e) => { if (location.pathname !== item.to) e.currentTarget.style.background = v("surface"); }}
                    onMouseLeave={(e) => { if (location.pathname !== item.to) e.currentTarget.style.background = "transparent"; }}
                  >{item.label}</Link>
                ))}
                <div style={{ height: "1px", background: v("divider"), margin: "8px 16px" }} />
                <Link to="/contact" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "4px" }}>
                  <RippleButton variant="primary" style={{ width: "100%", padding: "12px 0", fontSize: "13px" }}>
                    Free Consultation
                  </RippleButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

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
