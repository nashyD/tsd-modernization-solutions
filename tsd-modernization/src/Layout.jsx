import { useState, useEffect, useRef } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Analytics } from "@vercel/analytics/react";
import { C, v, useTheme, DiamondDivider, Button, RADIUS, SHADOW, SPACE } from "./shared";
import { TSDLogo, SunIcon, MoonIcon, MenuIcon, XIcon, ArrowRightIcon } from "./icons";
import { trackPageView } from "./analytics.js";
import TSDAgent from "./components/TSDAgent.jsx";
import CallButton from "./components/CallButton.jsx";

const NAV_ITEMS = [
  { label: "Services", to: "/services" },
  { label: "Why Us", to: "/why-us" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

/* On wide viewports the dropdown gets a horizontal preview row of the
   four most-trafficked links so the chrome doesn't feel one-button-thin. */
const PRIMARY_NAV = [
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Process", to: "/process" },
  { label: "Why us", to: "/why-us" },
];

/* ── Per-route SEO metadata ────────────────────────────────────────
   Rendered as a <Head> (react-helmet) tree on every route. During
   vite-react-ssg build this emits real <title>/<meta>/<link> tags
   into the static HTML shell so non-JS link-preview bots (LinkedIn,
   iMessage, Slack) see the right content per URL. */
const SITE_URL = "https://tsd-modernization.com";
const ROUTE_META = {
  "/": {
    title: "Charlotte Website + AI · Summer 2026 Cohort | TSD Modernization Solutions",
    description: "Ten Charlotte main-street builds between May 7 and August 10, 2026. Custom website, working AI, source code yours from day one — $5,000 fixed. Three founders, ten projects, hard close August 10. No retainers, no subscriptions.",
  },
  "/services": {
    title: "Services — AI, Websites & Automation | TSD Modernization Solutions",
    description: "Our core services: AI integration & automation, custom website design & redesign, and process modernization for Charlotte-area small businesses.",
  },
  "/services/ai-integration": {
    title: "AI Integration & Business Automation for Small Businesses | TSD Modernization Solutions",
    description: "Custom AI chatbots, workflow automation with Make and Zapier, and AI-powered reporting for Charlotte-area small businesses. Included in the $5,000 Website + AI Build, launched in 1-2 weeks.",
  },
  "/services/websites": {
    title: "Custom Website Design & Redesign | Charlotte Small Business Web Developer",
    description: "Fast, mobile-first websites with on-page SEO, analytics wiring, and full handoff docs so your team can manage content. 5-8 page sites at $5,000 founding rate, launched in 2-4 weeks.",
  },
  "/services/process-modernization": {
    title: "Tech Audits & Process Modernization for Small Businesses | TSD Modernization Solutions",
    description: "Structured tech audits and written modernization roadmaps for Charlotte-area small businesses. Identify bottlenecks, get cost estimates and ROI projections. $1,500 founding rate (anchor $3,000).",
  },
  "/why-us": {
    title: "Why Us — Local, Accountable, Main-Street Priced | TSD Modernization Solutions",
    description: "Why Charlotte small businesses choose TSD: local team, main-street pricing, no vendor lock-in. See how we compare to agencies and freelancers.",
  },
  "/process": {
    title: "Our Process — From Audit to Launch | TSD Modernization Solutions",
    description: "How we work: free fit call, written proposal within 48 hours, hands-on implementation, and training so your team owns what we build.",
  },
  "/pricing": {
    title: "Pricing — Founding Cohort, Summer 2026 | TSD Modernization Solutions",
    description: "Founding-cohort pricing for ten Charlotte-area small businesses. Website + AI Build at $5,000 plus the Full Modernization at $10,000 (by application). A $1,500 discovery audit is also available on request. Last project start July 13, 2026.",
  },
  "/ai-receptionist": {
    title: "AI Receptionist for Charlotte Trades — $497, Yours to Keep | TSD Modernization Solutions",
    description: "Custom AI answers the after-hours call, qualifies the lead, and books the job. Built for Charlotte HVAC, electricians, and plumbers. $497 founding setup, paid once. The agent transfers to you on August 31. No subscription forever.",
  },
  "/hvac": {
    title: "AI Receptionist for Charlotte HVAC Contractors | TSD Modernization Solutions",
    description: "Custom AI receptionist for Charlotte HVAC contractors — books the after-hours emergency call so it doesn't go to a competitor by morning. $497 founding setup, then the agent transfers to you on August 31. No subscription forever.",
  },
  "/electricians": {
    title: "AI Receptionist for Charlotte Electrical Contractors | TSD Modernization Solutions",
    description: "Custom AI receptionist for Charlotte electricians — captures emergency rewires, panel failures, and after-hours service calls so the on-call rotation doesn't break. $497 founding setup, then the agent transfers to you on August 31. No subscription forever.",
  },
  "/plumbers": {
    title: "AI Receptionist for Charlotte Plumbers | TSD Modernization Solutions",
    description: "Custom AI receptionist for Charlotte plumbers — captures weekend water-heater failures, burst pipes, and no-hot-water Sunday mornings, then books the truck. $497 founding setup, then the agent transfers to you on August 31. No subscription forever.",
  },
  "/salons": {
    title: "Custom Website + AI for Charlotte Salons | TSD Modernization Solutions",
    description: "Custom website and AI tools for Charlotte hair salons, nail studios, and spas — booking automation, after-hours chat, missed-call recovery. Built in 2-4 weeks. $5,000 founding-cohort rate (anchor $10,000), source code yours from day one.",
  },
  "/auto-shops": {
    title: "Custom Website + AI for Charlotte Auto Shops | TSD Modernization Solutions",
    description: "Custom website and AI tools for Charlotte auto repair, body shops, and tire stores — online quote requests, service catalogs, after-hours intake. Built in 2-4 weeks. $5,000 founding-cohort rate (anchor $10,000), source code yours from day one.",
  },
  "/restaurants": {
    title: "Custom Website + AI for Charlotte Restaurants | TSD Modernization Solutions",
    description: "Custom website and AI tools for Charlotte restaurants, bakeries, and food trucks — reservations, online ordering, AI chat for menu and hours. Built in 2-4 weeks. $5,000 founding-cohort rate (anchor $10,000), source code yours from day one.",
  },
  "/missed-call-calculator": {
    title: "Missed Call Calculator for Charlotte HVAC, Electricians & Plumbers | TSD Modernization Solutions",
    description: "Free four-question calculator for Charlotte trades. Estimate the annual revenue your phone is losing to voicemail, with no signup or email gate. Built for HVAC, electricians, and plumbers.",
  },
  "/testimonials": {
    title: "Case Studies Coming Soon | TSD Modernization Solutions",
    description: "We're shipping our first client projects now. Real results, real outcomes, documented here — coming soon.",
  },
  "/team": {
    title: "Our Team — Nash Davis, Bishop Switzer, Grant Tadlock | TSD Modernization Solutions",
    description: "Meet the founders of TSD Modernization Solutions — a local Charlotte team of small-business modernization specialists.",
  },
  "/book": {
    title: "Book a Fit Call — 30 Minutes with TSD | TSD Modernization Solutions",
    description: "Pick a 30-minute slot with one of the three founders — Nash, Bishop, or Grant. Walk through what you're trying to fix and see whether our $5,000 Website + AI Build or $10,000 Full Modernization fits the shape of the problem. No slide deck, no commitment.",
  },
  "/contact": {
    title: "Contact Us — Apply for a Founding Slot | TSD Modernization Solutions",
    description: "Apply for a Summer 2026 founding-cohort slot. Free 1-2 hour fit call, then a written proposal within 48 hours. Three founders, ten projects, hard close August 10.",
  },
};

function RouteMeta() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] || ROUTE_META["/"];
  const url = SITE_URL + pathname;
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
    </Head>
  );
}

export default function Layout() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    const meta = ROUTE_META[location.pathname] || ROUTE_META["/"];
    trackPageView(location.pathname, meta.title);
  }, [location]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    /* Escape key closes dropdown — keyboard parity with the close button. */
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUpBig { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes scrollBounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
        @keyframes scrollDot { 0% { top: 8px; opacity: 1; } 100% { top: 22px; opacity: 0; } }
        @keyframes orbFloat { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-25px,15px); } 66% { transform: translate(15px,-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanLine { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        :root, [data-theme="dark"] {
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Inter', system-ui, -apple-system, sans-serif;
          --c-bg: #0a1320;
          --c-bg-alt: #0e1828;
          --c-bg-deep: #060b14;
          --c-surface: rgba(255,255,255,0.04);
          --c-surface-hover: rgba(255,255,255,0.07);
          --c-surface-border: rgba(255,255,255,0.08);
          --c-surface-border-hover: rgba(123,184,224,0.32);
          --c-text: #ece4d6;
          --c-text-muted: rgba(236,228,214,0.66);
          --c-text-dim: rgba(236,228,214,0.38);
          --c-accent: ${C.carolina};
          --c-accent-light: ${C.carolinaLight};
          --c-divider: rgba(75,156,211,0.18);
          --c-divider-soft: rgba(255,255,255,0.06);
          --c-glow: rgba(75,156,211,0.18);
          --c-nav-bg: rgba(10,19,32,0.78);
          --c-card-front: #0c1524;
          --c-card-text: #ece4d6;
          --c-card-text-muted: rgba(236,228,214,0.7);
          --c-card-accent: ${C.carolinaLight};
          --c-card-divider: rgba(123,184,224,0.3);
        }

        [data-theme="light"] {
          --c-bg: #f4f0e6;
          --c-bg-alt: #ece5d6;
          --c-bg-deep: #e3dac6;
          --c-surface: rgba(19,41,75,0.04);
          --c-surface-hover: rgba(19,41,75,0.07);
          --c-surface-border: rgba(19,41,75,0.10);
          --c-surface-border-hover: rgba(44,95,138,0.36);
          --c-text: #13294B;
          --c-text-muted: rgba(19,41,75,0.66);
          --c-text-dim: rgba(19,41,75,0.40);
          --c-accent: ${C.steel};
          --c-accent-light: ${C.carolina};
          --c-divider: rgba(19,41,75,0.14);
          --c-divider-soft: rgba(19,41,75,0.06);
          --c-glow: rgba(75,156,211,0.14);
          --c-nav-bg: rgba(244,240,230,0.82);
          --c-card-front: #f4f0e6;
          --c-card-text: #13294B;
          --c-card-text-muted: rgba(19,41,75,0.7);
          --c-card-accent: ${C.steel};
          --c-card-divider: rgba(44,95,138,0.25);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: var(--font-body);
          background: var(--c-bg);
          color: var(--c-text);
          overflow-x: hidden;
          transition: background 0.4s ease, color 0.4s ease;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }
        ::placeholder { color: var(--c-text-dim); }
        ::selection { background: rgba(75,156,211,0.32); color: var(--c-text); }
        a { color: inherit; text-decoration: none; }
        img { max-width: 100%; display: block; }

        /* A11y: screen-reader-only utility */
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
        .skip-link {
          position: fixed; top: 8px; left: 8px; z-index: 2000;
          padding: 10px 16px; border-radius: 8px;
          background: var(--c-accent); color: #fff;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transform: translateY(-150%); transition: transform 0.2s ease;
        }
        .skip-link:focus, .skip-link:focus-visible { transform: translateY(0); outline: none; }
        a:focus-visible, button:focus-visible,
        input:focus-visible, textarea:focus-visible, select:focus-visible {
          outline: 2px solid var(--c-accent);
          outline-offset: 2px;
        }
        main:focus { outline: none; }
        main { scroll-margin-top: 100px; }

        /* Inline horizontal nav links — desktop nav row inside dropdown panel */
        .tsd-nav-link {
          font-size: 13px; font-weight: 600;
          color: var(--c-text-muted);
          padding: 6px 0;
          letter-spacing: 0.1px;
          transition: color 0.2s ease;
          position: relative;
        }
        .tsd-nav-link:hover { color: var(--c-text); }
        .tsd-nav-link.active { color: var(--c-accent); }

        /* Subtle ambient gradient that brightens on light mode for warmth */
        body::before {
          content: "";
          position: fixed; inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, var(--c-glow), transparent 60%),
            radial-gradient(ellipse 50% 40% at 100% 100%, rgba(75,156,211,0.06), transparent 60%);
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .hero-bg { background-size: 180% auto !important; background-position: center 35% !important; }
        }
      `}</style>
      <RouteMeta />
      <a href="#main" className="skip-link">Skip to main content</a>
      {/* ── Nav ─────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "10px clamp(16px, 4vw, 48px)" : "18px clamp(16px, 4vw, 48px)",
        background: scrolled ? v("nav-bg") : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
        borderBottom: scrolled ? `1px solid ${v("divider-soft")}` : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "14px", textDecoration: "none",
          filter: scrolled ? "none" : "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
          transition: "filter 0.4s ease",
        }}>
          <TSDLogo size={64} />
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

        {/* Desktop inline nav row — shows on wide screens, replaces some of
            the dropdown's burden. The full dropdown menu still works. */}
        <div className="hide-mobile" style={{
          display: "flex", alignItems: "center", gap: "28px",
        }}>
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `tsd-nav-link ${isActive ? "active" : ""}`}
              style={{
                filter: scrolled ? "none" : "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
              }}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={toggle} style={{
            width: "38px", height: "38px",
            background: scrolled ? v("surface") : "rgba(255,255,255,0.08)",
            border: `1px solid ${scrolled ? v("surface-border") : "rgba(255,255,255,0.12)"}`,
            cursor: "pointer", color: v("text-muted"),
            borderRadius: RADIUS.full,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s ease",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            filter: scrolled ? "none" : "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
          }} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link to="/book" className="hide-mobile" style={{ textDecoration: "none" }}>
            <Button as="span" variant="secondary" size="sm" style={{
              filter: scrolled ? "none" : "drop-shadow(0 4px 14px rgba(0,0,0,0.35))",
            }}>
              Book a fit call
            </Button>
          </Link>

          {/* Menu dropdown trigger */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: menuOpen ? v("surface") : C.gradientAccent,
              border: "none",
              cursor: "pointer",
              color: menuOpen ? v("text") : "#fff",
              padding: "9px 18px", borderRadius: RADIUS.full,
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)",
              transition: "all 0.25s ease",
              boxShadow: menuOpen ? "none" : "0 6px 18px rgba(75,156,211,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
              lineHeight: 1,
              WebkitAppearance: "none",
              MozAppearance: "none",
            }} aria-label="Navigation menu" aria-expanded={menuOpen}>
              {menuOpen ? <XIcon size={14} /> : <MenuIcon size={14} />}
              Menu
            </button>

            {/* Dropdown panel */}
            {menuOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 14px)", right: 0,
                minWidth: "260px", padding: "10px",
                background: v("nav-bg"),
                backdropFilter: "blur(28px) saturate(140%)",
                WebkitBackdropFilter: "blur(28px) saturate(140%)",
                border: `1px solid ${v("surface-border")}`,
                borderRadius: RADIUS.xl,
                boxShadow: SHADOW.xl,
                animation: "fadeUp 0.22s cubic-bezier(0.16,1,0.3,1)",
              }}>
                {NAV_ITEMS.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px", borderRadius: RADIUS.md,
                      fontSize: "14px", fontWeight: 600, textDecoration: "none",
                      color: active ? v("accent") : v("text"),
                      background: active ? "rgba(75,156,211,0.10)" : "transparent",
                      transition: "background 0.15s ease",
                    }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = v("surface"); }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span>{item.label}</span>
                      {active && <span style={{ color: v("accent"), fontSize: "9px" }}>{"◆"}</span>}
                    </Link>
                  );
                })}
                <div style={{ height: "1px", background: v("divider"), margin: "8px 14px" }} />
                <div style={{ padding: "4px 4px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link to="/contact" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                    <Button as="span" variant="primary" size="sm" fullWidth iconRight={<ArrowRightIcon size={14} />}>
                      Apply for a slot
                    </Button>
                  </Link>
                  <Link to="/book" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                    <Button as="span" variant="secondary" size="sm" fullWidth>
                      Book a fit call
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Content ─────────────────────────── */}
      <main id="main" tabIndex={-1}><Outlet /></main>

      {/* ── Footer ──────────────────────────── */}
      <footer style={{
        marginTop: SPACE["3xl"],
        padding: "72px clamp(24px, 4vw, 48px) 48px",
        background: v("bg-alt"),
        borderTop: `1px solid ${v("divider")}`,
        position: "relative",
      }}>
        {/* Top hairline accent — single gradient rule that spans the page width */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: "10%", right: "10%",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(75,156,211,0.5) 50%, transparent 100%)",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) repeat(3, minmax(0, 1fr))",
            gap: "48px 32px",
            marginBottom: "48px",
          }} className="footer-grid">
            <style>{`
              @media (max-width: 880px) {
                .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 24px !important; }
              }
              @media (max-width: 540px) {
                .footer-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {/* Brand column */}
            <div>
              <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <TSDLogo size={56} />
                <div>
                  <div style={{
                    fontSize: "11px", fontWeight: 700, letterSpacing: "3.5px",
                    textTransform: "uppercase", color: v("text"), lineHeight: 1.2,
                  }}>Modernization</div>
                  <div style={{
                    fontSize: "9px", fontWeight: 600, letterSpacing: "4px",
                    textTransform: "uppercase", color: v("text-dim"),
                  }}>Solutions</div>
                </div>
              </Link>
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "14px", lineHeight: 1.6, color: v("text-muted"),
                maxWidth: "320px", marginBottom: "16px",
              }}>
                Three founders. Ten Charlotte main-street builds. May 7 through August 10, 2026 — then we close.
              </p>
              <p style={{ fontSize: "12px", color: v("text-dim"), lineHeight: 1.5 }}>
                A brand of TSD Ventures, LLC<br />
                Charlotte metro · Gastonia · Belmont
              </p>
            </div>

            {/* Sitemap column */}
            <div>
              <div style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: v("accent"), marginBottom: "16px",
              }}>Site</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {NAV_ITEMS.slice(0, 4).map((item) => (
                  <Link key={item.to} to={item.to} style={{
                    fontSize: "13px", fontWeight: 500, color: v("text-muted"),
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = v("text")}
                  onMouseLeave={(e) => e.currentTarget.style.color = v("text-muted")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company column */}
            <div>
              <div style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: v("accent"), marginBottom: "16px",
              }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {NAV_ITEMS.slice(4).map((item) => (
                  <Link key={item.to} to={item.to} style={{
                    fontSize: "13px", fontWeight: 500, color: v("text-muted"),
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = v("text")}
                  onMouseLeave={(e) => e.currentTarget.style.color = v("text-muted")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact column */}
            <div>
              <div style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: v("accent"), marginBottom: "16px",
              }}>Reach us</div>
              <a href="tel:+17043175630" style={{
                display: "block", marginBottom: "10px",
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
                fontSize: "20px", letterSpacing: "-0.3px",
                color: v("text"),
              }}>
                (704) 317-5630
              </a>
              <p style={{ fontSize: "12px", color: v("text-dim"), marginBottom: "12px", lineHeight: 1.5 }}>
                Open every day · 8am – 8pm
              </p>
              <Link to="/book" style={{ textDecoration: "none" }}>
                <Button as="span" variant="primary" size="sm" iconRight={<ArrowRightIcon size={12} />}>
                  Book a fit call
                </Button>
              </Link>
            </div>
          </div>

          <DiamondDivider width={180} style={{ margin: "0 auto 32px" }} />

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "16px",
            paddingTop: "24px",
            borderTop: `1px solid ${v("divider-soft")}`,
          }}>
            <p style={{ fontSize: "11px", color: v("text-dim"), letterSpacing: "0.3px" }}>
              &copy; {new Date().getFullYear()} TSD Ventures, LLC. All rights reserved.
            </p>
            <p style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "3px",
              textTransform: "uppercase", color: v("text-dim"),
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
              Built in Charlotte
              <span style={{ color: v("accent"), fontSize: "7px" }}>{"◆"}</span>
            </p>
          </div>
        </div>
      </footer>
      <Analytics />
      <TSDAgent />
      <CallButton />
    </>
  );
}
