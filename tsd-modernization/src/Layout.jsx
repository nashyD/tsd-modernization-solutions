import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { C, v, useTheme, DiamondDivider, RippleButton } from "./shared";
import { TSDLogo, SunIcon, MoonIcon, MenuIcon, XIcon, ChevronDownIcon } from "./icons";
import { trackPageView } from "./analytics.js";

const NAV_ITEMS = [
  { label: "Services", to: "/services" },
  { label: "Why Us", to: "/why-us" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

/* ── Per-route SEO metadata ────────────────────────────────────────
   Applied client-side on route change. Google's second-wave renderer
   executes JS and will pick these up; browsers show the right tab
   title; link previews show the right OG tags once shared. */
const SITE_URL = "https://tsd-modernization.com";
const ROUTE_META = {
  "/": {
    title: "TSD Modernization Solutions | AI Integration & Website Creation | Charlotte, NC",
    description: "Affordable AI integration, custom website creation, and workflow automation for small businesses in the Charlotte metro area. Book a free tech audit today.",
  },
  "/services": {
    title: "Services — AI, Websites & Automation | TSD Modernization Solutions",
    description: "Our core services: AI integration & automation, custom website design & redesign, and process modernization for Charlotte-area small businesses.",
  },
  "/services/ai-integration": {
    title: "AI Integration & Business Automation for Small Businesses | TSD Modernization Solutions",
    description: "Custom AI chatbots, workflow automation with Make and Zapier, and AI-powered reporting for Charlotte-area small businesses. Projects start at $250, launched in 1-2 weeks.",
  },
  "/services/websites": {
    title: "Custom Website Design & Redesign | Charlotte Small Business Web Developer",
    description: "Fast, mobile-first websites with on-page SEO, analytics wiring, and full handoff docs so your team can manage content. 5-8 page sites from $250, launched in 2-4 weeks.",
  },
  "/services/process-modernization": {
    title: "Tech Audits & Process Modernization for Small Businesses | TSD Modernization Solutions",
    description: "Structured tech audits and written modernization roadmaps for Charlotte-area small businesses. Identify bottlenecks, get cost estimates and ROI projections. From $150.",
  },
  "/why-us": {
    title: "Why Us — Local, Accountable, Main-Street Priced | TSD Modernization Solutions",
    description: "Why Charlotte small businesses choose TSD: local team, main-street pricing, no vendor lock-in. See how we compare to agencies and freelancers.",
  },
  "/process": {
    title: "Our Process — From Audit to Launch | TSD Modernization Solutions",
    description: "How we work: free tech audit, custom proposal within 48 hours, hands-on implementation, and training so your team owns what we build.",
  },
  "/pricing": {
    title: "Pricing — Tech Audits, Websites & AI from $150 | TSD Modernization Solutions",
    description: "Transparent pricing for Charlotte-area small businesses. Tech audits from $150, custom websites + AI bundles, and monthly care plans.",
  },
  "/testimonials": {
    title: "Case Studies Coming Soon | TSD Modernization Solutions",
    description: "We're shipping our first client projects now. Real results, real outcomes, documented here — coming soon.",
  },
  "/team": {
    title: "Our Team — Nash Davis, Bishop Switzer, Grant Tadlock | TSD Modernization Solutions",
    description: "Meet the founders of TSD Modernization Solutions — a local Charlotte team of small-business modernization specialists.",
  },
  "/contact": {
    title: "Contact Us — Free Tech Audit | TSD Modernization Solutions",
    description: "Book a free tech audit for your Charlotte-area small business. Call 704-275-1410 or send us a message.",
  },
};

function applyRouteMeta(pathname) {
  const meta = ROUTE_META[pathname] || ROUTE_META["/"];
  const url = SITE_URL + pathname;
  document.title = meta.title;
  const setAttr = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  setAttr('meta[name="description"]', "content", meta.description);
  setAttr('link[rel="canonical"]', "href", url);
  setAttr('meta[property="og:title"]', "content", meta.title);
  setAttr('meta[property="og:description"]', "content", meta.description);
  setAttr('meta[property="og:url"]', "content", url);
  setAttr('meta[name="twitter:title"]', "content", meta.title);
  setAttr('meta[name="twitter:description"]', "content", meta.description);
}

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

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    applyRouteMeta(location.pathname);
    /* Fire after applyRouteMeta so document.title is fresh when GA4 reads it. */
    trackPageView(location.pathname);
  }, [location]);

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
        padding: scrolled ? "12px clamp(16px, 4vw, 48px)" : "20px clamp(16px, 4vw, 48px)",
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
          <div ref={menuRef} style={{ position: "relative", overflow: "visible" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: menuOpen ? v("surface") : C.gradientPrism,
              border: "none",
              cursor: "pointer",
              color: menuOpen ? v("text") : "#fff",
              padding: "8px 16px", borderRadius: "100px",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
              boxShadow: menuOpen ? `0 0 0 1px ${v("surface-border")}` : "0 2px 10px rgba(75,156,211,0.25)",
              lineHeight: 1,
              WebkitAppearance: "none",
              MozAppearance: "none",
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
