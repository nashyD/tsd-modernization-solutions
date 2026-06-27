---
name: tsd-modernization-site
description: Conventions, positioning, stack, and guardrails for the tsd-modernization.com marketing site. Load before any agent works in this repo.
---

# TSD Modernization Solutions — site skill

Persistent knowledge so loop agents do not re-learn the site every run.

## What this repo is

The public marketing storefront at https://www.tsd-modernization.com. Vite +
React 18 + react-router-dom, prerendered statically with `vite-react-ssg`.
Sentry + @vercel/analytics. Deployed on Vercel. A separate Next.js app at
`../tsd-modernization-app` serves /audit, /app, /sales, /demos via Vercel
rewrites and is OUT OF SCOPE here.

## Build and verify

- Dev: `npm run dev`. Build: `npm run build` (`vite-react-ssg build` + sitemap).
  Preview: `npm run preview`.
- There is no typecheck, lint, or test script in this app. Verification means a
  clean `npm run build` plus a preview-server check of every changed surface.

## File map

- `src/pages/Home.jsx` (homepage), `src/Layout.jsx` (app shell + per-route
  `<Head>` meta via `ROUTE_META`), `src/routes.jsx`, `src/route-jsonld.js`,
  `src/main.jsx`, `src/shared.jsx` (shared style tokens / helpers — match this)
- pages: `Services`, `ServiceDetail`, `Pricing`, `Process`, `WhyUs`, `Savings`,
  `Team`, `Testimonials`, `Contact`, `Book`, `Demo`, `News`, `NewsDetail`,
  `RelationshipPage`, `PageShell`
- data: `src/services-data.js`, `src/relationships-data.js`, `src/news-data.js`
- components: `BookCallButton`, `CallButton`, `ChatbotDemo`, `MakeFlowDemo`,
  `PricingEstimator`, `TSDAgent`
- `index.html` — site-level meta + JSON-LD ProfessionalService; loads Google
  Fonts Inter + Playfair Display + Cormorant Garamond
- `public/` — `hero-loop.mp4` (+ mobile + `.webp` posters), `og-image.png`,
  `sitemap.xml`, `robots.txt`, `llms.txt`

## Styling

No Tailwind. Styling is JSX/inline style objects, with shared tokens in
`src/shared.jsx`. Match the existing idiom exactly. Do not introduce a new
styling system.

## SEO model

Per-route `<title>`, description, canonical, and OG are injected at SSG build
time via the `<Head>` in `Layout.jsx` (`ROUTE_META`). Site-level meta and the
JSON-LD ProfessionalService block live in `index.html`. `route-jsonld.js` holds
per-route structured data. `sitemap.xml`, `robots.txt`, and `llms.txt` are in
`public/`.

## Positioning (do not dilute)

Money-saver "find the leak" wedge. Hero: "We find the leak. You outrun the
franchise." Four SKUs: TSD Front Desk, TSD Concierge, TSD Lead Engine, custom
websites. Audience: established Charlotte-metro local and trade businesses with
good reputations but dated tech. Offer cues: 48-hour proposals, AI from $73/mo,
a free cost-cut audit, a money-back guarantee. Company line +1-980-890-5815.

## Voice rules (hard constraints)

No em dashes. Never the "X, not Y" construction. No colon-lists, no three-part
closers, no buzzwords. Copy must read like a real person wrote it. Public copy
gets a humanizer pass before it ships.

## Governance

`BUSINESS_PLAN.md` is the source of truth. `.claude/CLAUDE.md` lists triggers
(pricing, the wedge, the hero, booking, team, phone numbers, operating dates,
stack changes, pipeline) that REQUIRE a matching `BUSINESS_PLAN.md` edit in the
same change set. Honor it.

## Guardrails

Read freely, change conservatively. Only safe, self-contained wins ship
automatically and only to a branch. Copy, pricing, and positioning stay
proposals for a human. Never merge to `main`, never deploy, never touch the Next
app.
