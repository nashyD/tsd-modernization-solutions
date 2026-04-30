import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Analytics } from "@vercel/analytics/react";
import { C, v, useTheme, DiamondDivider, RippleButton } from "./shared";
import { TSDLogo, SunIcon, MoonIcon, MenuIcon, XIcon } from "./icons";
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

/* ── Per-route SEO metadata ────────────────────────────────────────
   Rendered as a <Head> (react-helmet) tree on every route. During
   vite-react-ssg build this emits real <title>/<meta>/<link> tags
   into the static HTML shell so non-JS link-preview bots (LinkedIn,
   iMessage, Slack) see the right content per URL. */
const SITE_URL = "https://tsd-modernization.com";
const ROUTE_META = {
  "/": {
    title: "Charlotte Website + AI · Summer 2026 Cohort | TSD Modernization Solutions",
    description: "Ten Charlotte main-street builds between May 7 and August 10, 2026. Custom website, working AI, source code yours from day one — $2,000 fixed. Three founders, ten projects, hard close August 10. No retainers, no subscriptions.",
  },
  "/services": {
    title: "Services — AI, Websites & Automation | TSD Modernization Solutions",
    description: "Our core services: AI integration & automation, custom website design & redesign, and process modernization for Charlotte-area small businesses.",
  },
  "/services/ai-integration": {
    title: "AI Integration & Business Automation for Small Businesses | TSD Modernization Solutions",
    description: "Custom AI chatbots, workflow automation with Make and Zapier, and AI-powered reporting for Charlotte-area small businesses. Included in the $2,000 Website + AI Bundle (anchor $4,000), launched in 1-2 weeks.",
  },
  "/services/websites": {
    title: "Custom Website Design & Redesign | Charlotte Small Business Web Developer",
    description: "Fast, mobile-first websites with on-page SEO, analytics wiring, and full handoff docs so your team can manage content. 5-8 page sites at $2,000 founding rate (anchor $4,000), launched in 2-4 weeks.",
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
    description: "Founding-cohort pricing for ten Charlotte-area small businesses. Phase I audit at $1,500 (anchor $3,000), Phase II Website + AI Bundle at $2,000 (anchor $4,000), Founding Partnership at $5,000 (anchor $10,000, three spots). Last project start July 13, 2026.",
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
    description: "Custom website and AI tools for Charlotte hair salons, nail studios, and spas — booking automation, after-hours chat, missed-call recovery. Built in 2-4 weeks. $2,000 founding-cohort rate (anchor $4,000), source code yours from day one.",
  },
  "/auto-shops": {
    title: "Custom Website + AI for Charlotte Auto Shops | TSD Modernization Solutions",
    description: "Custom website and AI tools for Charlotte auto repair, body shops, and tire stores — online quote requests, service catalogs, after-hours intake. Built in 2-4 weeks. $2,000 founding-cohort rate (anchor $4,000), source code yours from day one.",
  },
  "/restaurants": {
    title: "Custom Website + AI for Charlotte Restaurants | TSD Modernization Solutions",
    description: "Custom website and AI tools for Charlotte restaurants, bakeries, and food trucks — reservations, online ordering, AI chat for menu and hours. Built in 2-4 weeks. $2,000 founding-cohort rate (anchor $4,000), source code yours from day one.",
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
    description: "Pick a 30-minute slot with one of the three founders — Nash, Bishop, or Grant. Walk through what you're trying to fix and see whether our $1,500 audit, $2,000 website + AI bundle, or $5,000 Founding Partnership fits the shape of the problem. No slide deck, no commitment.",
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
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes scrollBounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
        @keyframes scrollDot { 0% { top: 8px; opacity: 1; } 100% { top: 22px; opacity: 0; } }
        @keyframes orbFloat { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-25px,15px); } 66% { transform: translate(15px,-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanLine { 0% { top: -2px; } 100% { top: 100%; } }

        :root, [data-theme="dark"] {
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Inter', system-ui, -apple-system, sans-serif;
          --c-bg: #0c1524;
          --c-bg-alt: #101c2e;
          --c-surface: rgba(255,255,255,0.04);
          --c-surface-border: rgba(255,255,255,0.08);
          --c-surface-hover: rgba(255,255,255,0.07);
          --c-text: #e8e0d4;
          --c-text-muted: rgba(232,224,212,0.6);
          --c-text-dim: rgba(232,224,212,0.35);
          --c-accent: ${C.carolina};
          --c-accent-light: ${C.carolinaLight};
          --c-divider: rgba(75,156,211,0.15);
          --c-glow: rgba(75,156,211,0.15);
          --c-nav-bg: rgba(12,21,36,0.88);
          --c-card-front: #0c1524;
          --c-card-text: #e8e0d4;
          --c-card-text-muted: rgba(232,224,212,0.7);
          --c-card-accent: ${C.carolinaLight};
          --c-card-divider: rgba(123,184,224,0.3);
        }

        [data-theme="light"] {
          --c-bg: #f0ebe1;
          --c-bg-alt: #e8e0d4;
          --c-surface: rgba(19,41,75,0.04);
          --c-surface-border: rgba(19,41,75,0.1);
          --c-surface-hover: rgba(19,41,75,0.07);
          --c-text: #13294B;
          --c-text-muted: rgba(19,41,75,0.6);
          --c-text-dim: rgba(19,41,75,0.35);
          --c-accent: ${C.carolina};
          --c-accent-light: ${C.carolinaDark};
          --c-divider: rgba(19,41,75,0.12);
          --c-glow: rgba(75,156,211,0.12);
          --c-nav-bg: rgba(240,235,225,0.92);
          --c-card-front: #f0ebe1;
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
        }
        ::placeholder { color: var(--c-text-dim); }
        a { color: inherit; text-decoration: none; }
        img { max-width: 100%; display: block; }

        /* A11y: screen-reader-only utility */
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
        /* A11y: skip link — visible only when focused via keyboard */
        .skip-link {
          position: absolute; top: 8px; left: 8px; z-index: 2000;
          padding: 10px 16px; border-radius: 8px;
          background: var(--c-accent); color: #fff;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transform: translateY(-120%); transition: transform 0.2s ease;
        }
        .skip-link:focus, .skip-link:focus-visible { transform: translateY(0); outline: none; }
        /* A11y: keyboard focus ring on interactive elements */
        a:focus-visible, button:focus-visible,
        input:focus-visible, textarea:focus-visible, select:focus-visible {
          outline: 2px solid var(--c-accent);
          outline-offset: 2px;
        }
        main:focus { outline: none; }
        /* A11y: skip link target — offset scroll so #main lands below the fixed nav */
        main { scroll-margin-top: 100px; }

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
        padding: scrolled ? "12px clamp(16px, 4vw, 48px)" : "20px clamp(16px, 4vw, 48px)",
        background: scrolled ? v("nav-bg") : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${v("divider")}` : "1px solid transparent",
        transition: "all 0.35s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}>
          <TSDLogo size={72} />
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
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
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
                    Apply for a Slot
                  </RippleButton>
                </Link>
                <Link to="/book" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "4px" }}>
                  <RippleButton variant="secondary" style={{ width: "100%", padding: "12px 0", fontSize: "13px" }}>
                    Book a fit call
                  </RippleButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Content ─────────────────────────── */}
      <main id="main" tabIndex={-1}><Outlet /></main>

      {/* ── Footer ──────────────────────────── */}
      <footer style={{
        padding: "60px 48px 40px", textAlign: "center",
        borderTop: `1px solid ${v("divider")}`,
      }}>
        <DiamondDivider width={160} style={{ marginBottom: "32px" }} />
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap", marginBottom: "24px" }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} style={{
              fontSize: "13px", fontWeight: 600, color: v("text-muted"),
              transition: "color 0.2s", textDecoration: "none",
            }}>{item.label}</Link>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: v("text-dim"), marginBottom: "8px" }}>
          TSD Modernization Solutions — A brand of TSD Ventures, LLC
        </p>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: "13px", color: v("text-muted"), marginBottom: "8px",
        }}>
          Three founders. Ten Charlotte main-street builds. May 7 through August 10, 2026 — then we close.
        </p>
        <p style={{ fontSize: "12px", color: v("text-dim") }}>
          Serving the Charlotte metro area including Gastonia, Belmont, and surrounding communities.
        </p>
        <p style={{ fontSize: "12px", color: v("text-dim"), marginTop: "8px" }}>
          <a href="tel:+17043175630" style={{ color: "inherit" }}>(704) 317-5630</a>
          {" · Open every day, 8am – 8pm"}
        </p>
        <p style={{ fontSize: "12px", color: v("text-dim"), marginTop: "16px" }}>
          &copy; {new Date().getFullYear()} TSD Ventures. All rights reserved.
        </p>
      </footer>
      <Analytics />
      <TSDAgent />
      <CallButton />
    </>
  );
}
