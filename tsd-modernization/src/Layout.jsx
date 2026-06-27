import { useState, useEffect, useRef, Suspense } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Analytics } from "@vercel/analytics/react";
import { C, v, useTheme, DiamondDivider, Button, RADIUS, SHADOW, SPACE } from "./shared";
import { TSDLogo, SunIcon, MoonIcon, MenuIcon, XIcon, ArrowRightIcon } from "./icons";
import { trackPageView } from "./analytics.js";
import { ROUTE_JSONLD } from "./route-jsonld.js";
import { SERVICES } from "./services-data";
import { POSTS } from "./news-data.js";
import TSDAgent from "./components/TSDAgent.jsx";
import CallButton from "./components/CallButton.jsx";

const NAV_ITEMS = [
  { label: "Services", to: "/services" },
  { label: "Live Demo", to: "/demo" },
  { label: "News", to: "/news" },
  { label: "Why Us", to: "/why-us" },
  { label: "Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "Savings", to: "/savings" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

/* ── Per-route SEO metadata ────────────────────────────────────────
   Rendered as a <Head> (react-helmet) tree on every route. During
   vite-react-ssg build this emits real <title>/<meta>/<link> tags
   into the static HTML shell so non-JS link-preview bots (LinkedIn,
   iMessage, Slack) see the right content per URL. */
const SITE_URL = "https://www.tsd-modernization.com";
const ROUTE_META = {
  "/": {
    title: "Charlotte Websites + AI That Pay for Themselves | TSD Modernization Solutions",
    description: "We find the money your business is leaking, like missed after-hours calls, slow quotes, and forgotten subscriptions, and build what stops it. Custom websites and AI for established Charlotte businesses; one bakery saved $540/mo. Managed by us, or owned by you.",
  },
  "/services": {
    title: "Websites + AI That Stop the Leak | TSD Modernization Solutions",
    description: "Four services for established Charlotte businesses: TSD Front Desk, TSD Concierge, TSD Lead Engine, and custom websites, each priced by what it saves. Every free fit call includes a cost-cut audit. Managed by us, or owned by you.",
  },
  "/services/front-desk": {
    title: "TSD Front Desk: AI Receptionist That Books Jobs | TSD Modernization Solutions",
    description: "An AI receptionist on your existing phone line and chat: answers 24/7, qualifies the caller, and books real calendar slots, for a fraction of a $1,500–2,500/mo front-desk hire. From $73/mo managed; free if it books nothing in your first 30 days.",
  },
  "/services/concierge": {
    title: "TSD Concierge: Site Assistant Trained on Your Catalog | TSD Modernization Solutions",
    description: "Visitors ask in plain English; it answers from your real products, docs, and policies with the source linked, 24/7. Running for a Charlotte wholesale importer at $73/mo. Saves the hours your staff burns repeating the same answers.",
  },
  "/services/websites": {
    title: "Custom Website Design & Redesign | Charlotte Business Web Developer",
    description: "Fast, mobile-first custom websites with on-page SEO and analytics wired in, launched in 2-4 weeks. Saves the agency retainer: Managed hosting + edits from $49/mo, or own it outright with source code, credentials, and runbook from day one.",
  },
  "/services/lead-engine": {
    title: "TSD Lead Engine: Landing Funnel + Lead Dashboard | TSD Modernization Solutions",
    description: "A conversion-built landing funnel plus a dashboard your team actually works leads from: capture, qualify, follow up, close. Stops referrals and ad clicks from dying in an unread inbox. Running live for a Carolina insurance agency.",
  },
  "/services/cost-cut-audit": {
    title: "TSD Cost-Cut Audit: Free With Your Fit Call | TSD Modernization Solutions",
    description: "The free diagnostic inside every 30-minute fit call: a line-by-line teardown of your software, subscription, and vendor bills, with a kill list and a switch plan for every cut. $540/mo found at one local bakery. Yours to keep whether or not you hire us.",
  },
  "/savings": {
    title: "Savings Calculator: What Your Business Is Losing | TSD Modernization Solutions",
    description: "Four questions, sixty seconds: missed calls, ticket size, software spend, and your admin hours, priced with deliberately conservative math. See the monthly leak, then get a fixed-price proposal to stop it within 48 hours.",
  },
  "/demo": {
    title: "Live AI Demo: Try a RAG Assistant Trained on Your Business | TSD Modernization Solutions",
    description: "Talk to a live AI assistant trained on a sample business: auto shop, salon, restaurant, law firm, or store. Grounded answers with cited sources, voice, and English/Spanish/Chinese. The exact concierge TSD builds for clients.",
  },
  "/why-us": {
    title: "Why Us: Local, Accountable, Managed or Owned | TSD Modernization Solutions",
    description: "Why established Charlotte businesses choose TSD: a local team you can reach directly, every build managed by us or owned by you, and recurring plans you can cancel anytime. See how we compare to agencies and freelancers.",
  },
  "/process": {
    title: "Our Process: From Fit Call to Launch | TSD Modernization Solutions",
    description: "How we work: free fit call, written proposal within 48 hours, hands-on build, then your kind of handoff. We keep it managed and current, or you take it over with source code, credentials, and runbook in hand.",
  },
  "/pricing": {
    title: "Pricing & Estimate: Custom Websites + AI | TSD Modernization Solutions",
    description: "Build a real estimate in three clicks: your size, what you want running, and whether we manage it or you own it. Managed starts lower with a monthly you can cancel anytime ($49/mo site, $73/mo AI); Owned runs higher one-time with the full handoff included. Exact fixed price from a free fit call.",
  },
  "/salons": {
    title: "Custom Website + AI for Charlotte Salons & Spas | TSD Modernization Solutions",
    description: "Websites and AI for established Charlotte salons and spas: consolidated booking, after-hours chat that answers from your services, and an AI front desk that books while you're with a client. Managed by us, or owned by you.",
  },
  "/auto-shops": {
    title: "Custom Website + AI for Charlotte Specialty Auto Shops | TSD Modernization Solutions",
    description: "Websites and AI for established Charlotte specialty automotive shops: online quote requests, service and parts catalog lookup, and an AI front desk that captures the call you'd have missed. Managed by us, or owned by you.",
  },
  "/restaurants": {
    title: "Custom Website + AI for Charlotte Restaurants | TSD Modernization Solutions",
    description: "Websites and AI for established Charlotte restaurants: reservations, online ordering, and an AI assistant that answers menu and hours questions from your own content. Managed by us, or owned by you.",
  },
  "/testimonials": {
    title: "Case Studies Coming Soon | TSD Modernization Solutions",
    description: "We're shipping our first client projects now. Real results, real outcomes, documented here, coming soon.",
  },
  "/team": {
    title: "Our Team: Nash Davis, Bishop Switzer, Grant Tadlock | TSD Modernization Solutions",
    description: "Meet the founders of TSD Modernization Solutions, a Charlotte-metro web and AI studio. When something breaks at 7pm, you talk to the person who built it.",
  },
  "/book": {
    title: "Book a Fit Call: 30 Minutes with TSD | TSD Modernization Solutions",
    description: "Pick a 30-minute slot with one of the three founders: Nash, Bishop, or Grant. Walk through what you're trying to fix and we'll tell you honestly whether we can help. No slide deck, no commitment.",
  },
  "/contact": {
    title: "Contact Us: Start a Project | TSD Modernization Solutions",
    description: "Tell us what you're trying to fix. Free fit call, then a written proposal within 48 hours. Custom websites and AI for established Charlotte-metro businesses, managed by us, or owned by you.",
  },
};

/* Savings sheets — one printable one-pager per service, generated from
   the same catalog the routes prerender from. The pages themselves
   carry a noindex robots tag (sales collateral, thin duplicates of the
   service pages). */
SERVICES.forEach((s) => {
  ROUTE_META[`/sheets/${s.slug}`] = {
    title: `${s.title}: Savings Sheet | TSD Modernization Solutions`,
    description: s.saves,
  };
});

/* News index + one entry per post, generated from the posts catalog so a
   new post in news-data.js automatically gets its <title>/<meta> for link
   previews. */
ROUTE_META["/news"] = {
  title: "News & Field Notes | TSD Modernization Solutions",
  description:
    "What we've been building for local businesses. Short, honest updates on the websites and AI we ship across Gastonia and the Charlotte metro. Real numbers, no fluff.",
};
POSTS.forEach((p) => {
  ROUTE_META[`/news/${p.slug}`] = {
    title: `${p.title} | TSD Modernization Solutions`,
    description: p.excerpt,
  };
});

function RouteMeta() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] || ROUTE_META["/"];
  const url = SITE_URL + pathname;
  /* Page-specific JSON-LD nodes (Service, Offer, FAQPage, HowTo, etc.).
     The global ProfessionalService schema lives in index.html and renders
     on every route; these add page-scoped entities that reference the
     business via @id without duplicating org-level fields. */
  const jsonLd = ROUTE_JSONLD[pathname];
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
      {jsonLd && jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(node)}
        </script>
      ))}
    </Head>
  );
}

export default function Layout() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);
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
    const onKey = (e) => { if (e.key === "Escape") { setMenuOpen(false); menuBtnRef.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        /* Centered card grids — flex-wrap so partial/last rows center instead of
           left-aligning a stranded card. Per-grid column width via --cg-min. */
        .card-grid { display: flex; flex-wrap: wrap; justify-content: center; }
        .card-grid > * { flex: 1 1 var(--cg-min, 280px); max-width: var(--cg-max, calc(var(--cg-min, 280px) + 200px)); min-width: 0; }
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
        /* ── Liquid-glass spatial backdrop drift ────────────────────────
           Two large Carolina auroras oscillate slowly on the GPU (transform
           only) so the fixed backdrop the glass floats over feels alive and
           refracting. Disabled wholesale under prefers-reduced-motion. */
        @keyframes auroraDrift1 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 33% { transform: translate3d(7vw,-5vh,0) scale(1.14); } 66% { transform: translate3d(-6vw,4vh,0) scale(0.92); } }
        @keyframes auroraDrift2 { 0%,100% { transform: translate3d(0,0,0) scale(1.06); } 50% { transform: translate3d(-8vw,6vh,0) scale(1.2); } }

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
          /* Body / secondary copy. WCAG AA passes ~4.5:1 against bg. */
          --c-text-muted: rgba(236,228,214,0.78);
          /* Captions, footnotes, italic notes. Bumped from 0.38 so
             "metadata"-tier copy still reads on cream-on-navy. */
          --c-text-dim: rgba(236,228,214,0.58);
          --c-accent: ${C.carolina};
          --c-accent-light: ${C.carolinaLight};
          --c-divider: rgba(75,156,211,0.22);
          --c-divider-soft: rgba(255,255,255,0.08);
          --c-glow: rgba(75,156,211,0.18);
          --c-nav-bg: rgba(10,19,32,0.78);
          --c-card-front: #0c1524;
          --c-card-text: #ece4d6;
          --c-card-text-muted: rgba(236,228,214,0.78);
          --c-card-accent: ${C.carolinaLight};
          --c-card-divider: rgba(123,184,224,0.3);

          /* ── Liquid glass material (dark) ─────────────────────────────
             One recipe consumed by Card / Surface / Button + bespoke panels.
             glass-bg-strong is the text-bearing fill — opaque enough that
             cream body copy clears WCAG AA over the drifting backdrop;
             glass-bg is the lighter fill for decorative / non-text glass. */
          --glass-blur: 26px;
          --glass-saturate: 200%;
          --glass-bg: rgba(20,34,56,0.42);
          --glass-bg-strong: rgba(12,21,36,0.64);
          --glass-border: rgba(255,255,255,0.14);
          --glass-border-strong: rgba(123,184,224,0.52);
          --glass-rim: rgba(255,255,255,0.72);
          --glass-rim-soft: rgba(255,255,255,0.22);
          --glass-glow: rgba(75,156,211,0.30);
          --glass-sheen: rgba(180,214,240,0.24);
          --glass-radius: 24px;
          --glass-shadow: 0 26px 60px rgba(7,13,26,0.50), 0 6px 16px rgba(7,13,26,0.32), inset 0 1px 0 rgba(255,255,255,0.13), 0 0 56px rgba(75,156,211,0.18);

          /* Hero — theme-scoped tokens. The hero composition swaps
             wholesale between dark and light: bg gradient, text colors,
             blueprint grid, aurora glow, frame chrome, and skyline
             photo all retune so the hero reads as "the same scene under
             different lighting" rather than a dark island in a light
             page. */
          --c-hero-bg: radial-gradient(ellipse 100% 80% at 50% 25%, ${C.inkRise} 0%, ${C.inkSoft} 55%, ${C.ink} 100%);
          --c-hero-text: #fff;
          --c-hero-text-soft: rgba(236,228,214,0.92);
          --c-hero-text-strong: #f4f9fd;
          --c-hero-text-muted: rgba(236,228,214,0.78);
          --c-hero-rule: rgba(236,228,214,0.32);
          --c-hero-grid: rgba(123,184,224,0.07);
          --c-hero-aurora: rgba(75,156,211,0.30);
          --c-hero-grain-blend: overlay;
          --c-hero-grain-opacity: 0.05;
          --c-hero-frame-border: rgba(75,156,211,0.32);
          --c-hero-frame-bg: #0a1320;
          --c-hero-frame-shadow: 0 30px 80px rgba(7,13,26,0.55), 0 12px 32px rgba(7,13,26,0.4), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(75,156,211,0.14);
          --c-hero-frame-rim-highlight: rgba(255,255,255,0.22);
          --c-hero-skyline: url(/charlotte-skyline-dark.webp);
          --c-hero-skyline-opacity: 0.50;
        }

        [data-theme="light"] {
          --c-bg: #f4f0e6;
          --c-bg-alt: #ece5d6;
          --c-bg-deep: #e3dac6;
          --c-surface: rgba(19,41,75,0.04);
          --c-surface-hover: rgba(19,41,75,0.07);
          --c-surface-border: rgba(19,41,75,0.12);
          --c-surface-border-hover: rgba(44,95,138,0.36);
          --c-text: #13294B;
          /* Body / secondary copy. Bumped from 0.66 → 0.78 — navy at
             0.66 was passing AA but felt washed out on cream. */
          --c-text-muted: rgba(19,41,75,0.78);
          /* Captions, footnotes, italic notes. Bumped from 0.40 → 0.66
             so 12-13px italic on cream sits comfortably above WCAG AA
             4.5:1 contrast. */
          --c-text-dim: rgba(19,41,75,0.66);
          --c-accent: ${C.steel};
          --c-accent-light: ${C.carolina};
          --c-divider: rgba(19,41,75,0.20);
          --c-divider-soft: rgba(19,41,75,0.10);
          --c-glow: rgba(75,156,211,0.14);
          --c-nav-bg: rgba(244,240,230,0.82);
          --c-card-front: #f4f0e6;
          --c-card-text: #13294B;
          --c-card-text-muted: rgba(19,41,75,0.78);
          --c-card-accent: ${C.steel};
          --c-card-divider: rgba(44,95,138,0.25);

          /* ── Liquid glass material (light) — frosted white, macOS-light. */
          --glass-blur: 22px;
          --glass-saturate: 180%;
          --glass-bg: rgba(255,255,255,0.44);
          --glass-bg-strong: rgba(255,253,248,0.70);
          --glass-border: rgba(19,41,75,0.14);
          --glass-border-strong: rgba(44,95,138,0.46);
          --glass-rim: rgba(255,255,255,0.96);
          --glass-rim-soft: rgba(255,255,255,0.70);
          --glass-glow: rgba(75,156,211,0.22);
          --glass-sheen: rgba(255,255,255,0.72);
          --glass-radius: 24px;
          --glass-shadow: 0 26px 60px rgba(19,41,75,0.16), 0 6px 16px rgba(19,41,75,0.10), inset 0 1px 0 rgba(255,255,255,0.85), 0 0 56px rgba(75,156,211,0.18);

          /* Hero — light-mode counterparts. The hero is the same scene
             but in soft daylight: cream paper background, navy ink text,
             steel-blue frame chrome, and watercolor Charlotte at the
             edges. Frame interior stays dark so the timelapse content
             reads consistently in both themes. */
          --c-hero-bg: radial-gradient(ellipse 100% 80% at 50% 25%, #fbf7ed 0%, #f4f0e6 55%, #ece5d6 100%);
          --c-hero-text: #13294B;
          --c-hero-text-soft: rgba(19,41,75,0.85);
          --c-hero-text-strong: #1d3a66;
          --c-hero-text-muted: rgba(19,41,75,0.72);
          --c-hero-rule: rgba(19,41,75,0.28);
          --c-hero-grid: rgba(19,41,75,0.05);
          --c-hero-aurora: rgba(75,156,211,0.18);
          --c-hero-grain-blend: multiply;
          --c-hero-grain-opacity: 0.04;
          --c-hero-frame-border: rgba(44,95,138,0.32);
          --c-hero-frame-bg: #0a1320;
          --c-hero-frame-shadow: 0 30px 80px rgba(19,41,75,0.18), 0 12px 32px rgba(19,41,75,0.12), 0 0 0 1px rgba(19,41,75,0.06), 0 0 60px rgba(75,156,211,0.20);
          --c-hero-frame-rim-highlight: rgba(255,255,255,0.22);
          --c-hero-skyline: url(/charlotte-skyline-light.webp);
          --c-hero-skyline-opacity: 0.32;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        /* overflow-x: clip on <html> is the iOS Safari fix that overflow-x:
           hidden on <body> alone doesn't accomplish — fixed-position children
           and absolutely-positioned decorative layers (auroras, oversized
           glows) that exceed viewport width otherwise widen the layout
           viewport on iOS, letting the page pinch-zoom-pan off-center. clip
           is widely supported (Safari 16+, Chrome 90+) and unlike hidden
           does not establish a new containing block / scroll boundary. */
        /* Base colour lives on <html> so the fixed .liquid-bg backdrop
           (z-index:-1) is never occluded by the body canvas, and there is
           no pre-hydration flash. <body> is transparent on top of it. */
        html { scroll-behavior: smooth; overflow-x: clip; background: var(--c-bg); transition: background 0.4s ease; }
        body {
          font-family: var(--font-body);
          background: transparent;
          color: var(--c-text);
          overflow-x: clip;
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

        /* Ambient backdrop now lives on the .liquid-bg element (rendered
           below the <style> tag) so each aurora layer animates its own GPU
           transform. Kept off the body pseudo to avoid a second fixed layer. */

        /* Suppress every flavor of native video chrome on the hero loop.
           iOS Safari paints a giant tap-to-play button when it can't
           autoplay; the rules below remove that overlay (and any
           transport controls) so the video either plays silently or
           shows just the poster — never an interactive play button. */
        .hero-video::-webkit-media-controls,
        .hero-video::-webkit-media-controls-enclosure,
        .hero-video::-webkit-media-controls-panel,
        .hero-video::-webkit-media-controls-overlay-play-button,
        .hero-video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .hero-video {
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .hero-bg { background-size: 180% auto !important; background-position: center 35% !important; }
        }

        /* Mobile nav scaling — at narrow widths the logo + brand text + theme +
           menu button sum past viewport width, which leaks past body's
           overflow-x:hidden because nav is position:fixed. Result on iOS Safari:
           the layout viewport widens, the page pans, and zooming out shows it
           off-center. These rules shrink the nav internals so the fixed bar
           always fits 320px+ viewports. */
        @media (max-width: 480px) {
          .site-nav { padding-left: 12px !important; padding-right: 12px !important; }
          .site-nav-brand { gap: 10px !important; }
          .site-nav-brand svg { width: 56px !important; height: auto !important; }
          .site-nav-brand-text-1 { font-size: 10px !important; letter-spacing: 3px !important; }
          .site-nav-brand-text-2 { font-size: 8px !important; letter-spacing: 3.5px !important; }
          .site-nav-menu-btn { padding: 9px 14px !important; }
        }
        @media (max-width: 360px) {
          .site-nav-brand-text { display: none !important; }
        }

        /* ── Liquid-glass accessibility fallbacks ───────────────────────
           Honor the three OS-level "calm it down" signals. Reduced-motion
           freezes the aurora drift + sheen; reduced-transparency drops the
           glass to solid opaque surfaces (no blur, full legibility); high
           contrast strengthens every glass border. */
        @media (prefers-reduced-motion: reduce) {
          .liquid-bg__aura { animation: none !important; }
          .glass-sheen { opacity: 0 !important; }
        }
        @media (prefers-reduced-transparency: reduce) {
          :root, [data-theme="dark"], [data-theme="light"] {
            --glass-bg: var(--c-card-front);
            --glass-bg-strong: var(--c-card-front);
            --glass-blur: 0px;
            --glass-saturate: 100%;
          }
          .liquid-bg__aura, .liquid-bg__skyline, .liquid-bg__grain { display: none !important; }
          .glass-sheen { opacity: 0 !important; }
        }
        @media (prefers-contrast: more) {
          :root, [data-theme="dark"], [data-theme="light"] {
            --glass-border: var(--c-text-muted);
            --glass-border-strong: var(--c-accent);
            --glass-bg-strong: var(--c-card-front);
          }
        }

        /* Glass surfaces opt into hardware compositing + clip the sheen. */
        .glass-surface { transform: translateZ(0); }
        .glass-sheen {
          position: absolute; inset: 0; border-radius: inherit; z-index: -1;
          pointer-events: none; opacity: var(--sheen-o, 0);
          transition: opacity 0.45s ease;
          background: radial-gradient(circle 220px at var(--mx, 50%) var(--my, 0%), var(--glass-sheen), transparent 60%);
        }
      `}</style>

      {/* ── Liquid-glass spatial backdrop ───────────────────────────
          One fixed, GPU-composited world the whole site's glass floats
          over: ambient glow, two slowly drifting Carolina auroras, a
          faint Charlotte skyline silhouette, and film grain. All four
          layers are theme-aware via CSS vars and degrade under the
          reduced-motion / reduced-transparency media rules above. */}
      <div className="liquid-bg" aria-hidden="true" style={{
        position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden",
        background: v("bg"),
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 55% at 50% 0%, var(--c-glow), transparent 60%)",
        }} />
        <div className="liquid-bg__aura" style={{
          position: "absolute", top: "-14%", left: "-8%",
          width: "72vw", height: "72vw", maxWidth: "1040px", maxHeight: "1040px",
          borderRadius: "50%", filter: "blur(80px)", willChange: "transform",
          background: "radial-gradient(circle at 50% 50%, var(--c-hero-aurora), transparent 66%)",
          animation: "auroraDrift1 26s ease-in-out infinite",
        }} />
        <div className="liquid-bg__aura" style={{
          position: "absolute", bottom: "-18%", right: "-10%",
          width: "66vw", height: "66vw", maxWidth: "960px", maxHeight: "960px",
          borderRadius: "50%", filter: "blur(80px)", willChange: "transform",
          background: "radial-gradient(circle at 50% 50%, var(--glass-glow), transparent 68%)",
          animation: "auroraDrift2 34s ease-in-out infinite",
        }} />
        {/* Third, central aura — keeps the world glowing behind mid-page
            sections so the glass always has colour to refract. */}
        <div className="liquid-bg__aura" style={{
          position: "absolute", top: "34%", left: "50%",
          width: "60vw", height: "60vw", maxWidth: "820px", maxHeight: "820px",
          marginLeft: "-30vw", borderRadius: "50%", filter: "blur(96px)", willChange: "transform",
          background: "radial-gradient(circle at 50% 50%, var(--glass-glow), transparent 70%)",
          animation: "auroraDrift2 44s ease-in-out infinite reverse",
        }} />
        <div className="liquid-bg__skyline" style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: "32vh",
          backgroundImage: "var(--c-hero-skyline)",
          backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundSize: "cover",
          opacity: 0.1,
          WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, #000 0%, transparent 100%)",
        }} />
        <div className="liquid-bg__grain" style={{
          position: "absolute", inset: 0,
          opacity: "var(--c-hero-grain-opacity)",
          mixBlendMode: "var(--c-hero-grain-blend)",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
          backgroundSize: "180px 180px",
        }} />
      </div>

      <RouteMeta />
      <a href="#main" className="skip-link">Skip to main content</a>
      {/* ── Nav ─────────────────────────────── */}
      <nav className="site-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "10px clamp(16px, 4vw, 48px)" : "18px clamp(16px, 4vw, 48px)",
        background: scrolled ? v("nav-bg") : "transparent",
        backdropFilter: scrolled ? "blur(var(--glass-blur)) saturate(var(--glass-saturate))" : "none",
        WebkitBackdropFilter: scrolled ? "blur(var(--glass-blur)) saturate(var(--glass-saturate))" : "none",
        borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
        boxShadow: scrolled ? "inset 0 1px 0 var(--glass-rim-soft), 0 10px 30px rgba(7,13,26,0.26)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" className="site-nav-brand" style={{
          display: "flex", alignItems: "center", gap: "14px", textDecoration: "none",
          filter: scrolled ? "none" : "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
          transition: "filter 0.4s ease",
          minWidth: 0,
        }}>
          <TSDLogo size={64} style={{ flexShrink: 0 }} />
          <div className="site-nav-brand-text">
            <div className="site-nav-brand-text-1" style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "3.5px", textTransform: "uppercase",
              color: v("text"), lineHeight: 1.2,
            }}>Modernization</div>
            <div className="site-nav-brand-text-2" style={{
              fontSize: "9px", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase",
              color: v("text-dim"),
            }}>Solutions</div>
          </div>
        </Link>

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

          <Link to="/book" style={{ textDecoration: "none" }}>
            <Button as="span" variant="secondary" size="sm" style={{
              filter: scrolled ? "none" : "drop-shadow(0 4px 14px rgba(0,0,0,0.35))",
            }}>
              Book a fit call
            </Button>
          </Link>

          {/* Menu dropdown trigger */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button ref={menuBtnRef} onClick={() => setMenuOpen(!menuOpen)} className="site-nav-menu-btn" style={{
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
            }} aria-label="Navigation menu" aria-haspopup="true" aria-controls="nav-menu-panel" aria-expanded={menuOpen}>
              {menuOpen ? <XIcon size={14} /> : <MenuIcon size={14} />}
              Menu
            </button>

            {/* Dropdown panel */}
            {menuOpen && (
              <div id="nav-menu-panel" style={{
                position: "absolute", top: "calc(100% + 14px)", right: 0,
                minWidth: "260px", padding: "10px",
                background: v("nav-bg"),
                backdropFilter: "blur(calc(var(--glass-blur) + 8px)) saturate(var(--glass-saturate))",
                WebkitBackdropFilter: "blur(calc(var(--glass-blur) + 8px)) saturate(var(--glass-saturate))",
                border: "1px solid var(--glass-border)",
                borderRadius: RADIUS.xl,
                boxShadow: "var(--glass-shadow)",
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
                {/* Free audit + TSD Portal — both cross-app rewrites to the
                    Next.js app. Plain <a> so the browser does a full nav
                    (react-router would client-side route and 404 since
                    /audit and /app aren't marketing-site routes). */}
                <a
                  href="/audit"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: RADIUS.md,
                    fontSize: "13px", fontWeight: 600, textDecoration: "none",
                    color: v("text"),
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = v("surface"); }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span>
                    <span style={{ color: v("accent"), marginRight: "6px", fontSize: "9px" }}>{"◆"}</span>
                    Free presence audit
                  </span>
                  <ArrowRightIcon size={13} />
                </a>
                <a
                  href="/app"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: RADIUS.md,
                    fontSize: "13px", fontWeight: 600, textDecoration: "none",
                    color: v("text-dim"),
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = v("surface");
                    e.currentTarget.style.color = v("text");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = v("text-dim");
                  }}
                >
                  <span>TSD Portal</span>
                  <ArrowRightIcon size={13} />
                </a>
                <div style={{ height: "1px", background: v("divider"), margin: "8px 14px" }} />
                <div style={{ padding: "4px 4px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link to="/contact" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                    <Button as="span" variant="primary" size="sm" fullWidth iconRight={<ArrowRightIcon size={14} />}>
                      Start a project
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
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div style={{ minHeight: "70vh" }} aria-hidden="true" />}>
          <Outlet />
        </Suspense>
      </main>

      {/* ── Footer ──────────────────────────── */}
      <footer style={{
        marginTop: SPACE["3xl"],
        padding: "72px clamp(24px, 4vw, 48px) 48px",
        background: "var(--glass-bg-strong)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        borderTop: "1px solid var(--glass-border)",
        boxShadow: "inset 0 1px 0 var(--glass-rim-soft)",
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
                fontFamily: "var(--font-body)", fontStyle: "normal",
                fontSize: "14px", lineHeight: 1.6, color: v("text-muted"),
                maxWidth: "320px", marginBottom: "16px",
              }}>
                Modern websites and AI for established businesses across the Charlotte metro. Managed by us, or owned by you.
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
              <a href="tel:+19808905815" style={{
                display: "block", marginBottom: "10px",
                fontFamily: "var(--font-body)", fontStyle: "normal", fontWeight: 700,
                fontSize: "20px", letterSpacing: "-0.3px",
                color: v("text"),
              }}>
                (980) 890-5815
              </a>
              <p style={{ fontSize: "12px", color: v("text-dim"), marginBottom: "12px", lineHeight: 1.5 }}>
                Open every day · 8am – 8pm
              </p>
              <Link to="/book" style={{ textDecoration: "none" }}>
                <Button as="span" variant="primary" size="sm" iconRight={<ArrowRightIcon size={12} />}>
                  Book a fit call
                </Button>
              </Link>
              {/* Tertiary audit affordance in the footer — same Vercel rewrite
                  gotcha as the dropdown link, hence plain <a>. */}
              <a href="/audit" style={{
                display: "block", marginTop: "12px",
                fontSize: "12px", color: v("text-muted"),
                textDecoration: "underline", textUnderlineOffset: "3px",
                textDecorationColor: v("divider"),
                transition: "color 0.2s, text-decoration-color 0.2s",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = v("text");
                  e.currentTarget.style.textDecorationColor = v("accent");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = v("text-muted");
                  e.currentTarget.style.textDecorationColor = v("divider");
                }}
              >
                Or run a free presence audit →
              </a>
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
