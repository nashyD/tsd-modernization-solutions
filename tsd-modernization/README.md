# TSD Modernization Solutions — site

The marketing + lead-capture site for [TSD Modernization Solutions](https://tsd-modernization.com), a summer-only (May 7 – Aug 10, 2026) tech-modernization service for Charlotte-area small businesses. Three founders, ten founding-client cap, one offer.

## Stack

- **Vite + React 18** — SPA build with `vite-react-ssg` for per-route static prerendering. Every route ships as its own `index.html` so non-JS link-preview bots (LinkedIn, iMessage, Slack) see the right meta per URL.
- **react-router-dom v6** — `vite-react-ssg` requires v6 specifically; routes are defined in `src/routes.jsx`.
- **Vercel** — auto-deploys on push to `main` from `https://github.com/nashyD/tsd-modernization-solutions`.
- **Web3Forms** — contact-form backend, no server code.

## Local setup

```bash
git clone https://github.com/nashyD/tsd-modernization-solutions.git
cd tsd-modernization-solutions/tsd-modernization
npm install
cp .env.example .env.local        # fill in only the keys you need
npm run dev                        # → http://localhost:5173
```

The dev server runs in plain CSR mode (no SSG pass) so iteration is fast. Production builds use SSG.

## Build & deploy

```bash
npm run build      # → dist/, runs SSG over every route, then writes dist/sitemap.xml
npm run preview    # serve dist/ locally to verify the prerendered output
```

`build` runs `vite-react-ssg build` followed by `node scripts/generate-sitemap.mjs`. The sitemap script walks `dist/` for `index.html` files and writes `dist/sitemap.xml` so newly-added routes appear automatically.

Vercel watches `main` and runs the same build command on every push. No manual deploy step.

## Project structure

```
tsd-modernization/
├── public/                Static assets served as-is at /
│   ├── favicon.svg, og-image.svg, tsd-ms-logo*.svg   Logos (4-slab prism)
│   ├── hero-loop.mp4, hero-storefront.webp           Home hero media
│   ├── robots.txt
│   └── sitemap.xml        Source-of-truth sitemap (overwritten in dist/ at build time)
├── src/
│   ├── main.jsx           ViteReactSSG entry; calls initSentry + initAnalytics on client
│   ├── routes.jsx         Route table (paths → components, getStaticPaths for /services/:slug)
│   ├── Layout.jsx         App shell, nav/footer, per-route <Head> (title/meta) via ROUTE_META
│   ├── shared.jsx         Brand palette (C), CSS-var helpers (v), useFadeIn hook, Card, RippleButton, SectionHeader, DiamondDivider
│   ├── icons.jsx          SVG icon components (TSDLogo + line icons)
│   ├── analytics.js       GA4 + Plausible + Microsoft Clarity loaders, env-gated
│   ├── sentry.js          Sentry init, env-gated
│   ├── services-data.js   SERVICES array consumed by Services.jsx and ServiceDetail.jsx
│   └── pages/
│       ├── Home.jsx, Pricing.jsx, AIReceptionist.jsx, Process.jsx, …
│       └── PageShell.jsx  Common page wrapper (top padding for fixed nav)
├── scripts/
│   └── generate-sitemap.mjs   Post-build sitemap generator
├── PROJECT_LOG.md         Audit + change log (read this before making non-trivial changes)
└── index.html             Document shell + JSON-LD ProfessionalService schema
```

## Environment variables

All client-side env vars must be `VITE_`-prefixed. Set them in Vercel → Project → Settings → Environment Variables for production. For local dev, copy `.env.example` to `.env.local`.

| Variable | Purpose | Required? |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | Web3Forms access key for the contact form | yes for the form to submit |
| `VITE_GA4_ID` | Google Analytics 4 measurement ID, format `G-XXXXXXXXXX` | optional |
| `VITE_PLAUSIBLE_ID` | Plausible site script token, format `pa-XXXXX...` | optional |
| `VITE_CLARITY_ID` | Microsoft Clarity project ID | optional |
| `VITE_SENTRY_DSN` | Sentry frontend DSN | optional |

Each analytics provider and Sentry no-ops when its env var is unset, so dev runs stay clean.

## Conventions

### `PROJECT_LOG.md` is the source of truth for *why*

Every meaningful change gets a top-of-changelog entry: what shipped, why, files touched, and the principle reinforced. Newest entries at the top. Read the audit at the top of the file and the most recent few entries before opening a PR.

### Voice rules (per audit + humanizer skill)

- **No "X, not Y" contrastive phrasing** — the rhythm reads as an LLM tell. State the positive directly.
- **No imperative trio cadence** — three parallel imperatives ("Read the X, sign the Y, get the Z.") read as AI-generated, even when the content is correct.
- **No fabricated stats** — the homepage stats are sourced or removable. Don't invent retention rates / satisfaction scores until they exist.

### Per-route SEO metadata

Every route has a `ROUTE_META` entry in `src/Layout.jsx` covering title, description, and og/twitter tags. `vite-react-ssg` bakes these into the static HTML so link-preview bots see the right thing per URL. Adding a new route → add a `ROUTE_META` entry.

### Editorial design system

Established on Home / Team / Pricing / AIReceptionist:
- Carolina-blue palette + cream + navy. See `shared.jsx` `C` constant and the CSS variables in `Layout.jsx`.
- Typography: **Playfair Display** italic for editorial accents, **Inter** for body.
- Diamond glyph (`◆`) is the system-level signifier — bullets, separators, masthead segment dividers.
- Section markers: `◆ LABEL` / hairline rule / `§ 0N` (matches Home and AIReceptionist).
- Founder/phase chips: `FOUNDER NO. 0X` and `PHASE I/II` follow the same magazine-issue conceit.

## Common tasks

### Add a new top-level route

1. Create the page component in `src/pages/`.
2. Import + register it in `src/routes.jsx`.
3. Add a `ROUTE_META` entry in `src/Layout.jsx`.
4. Add a `PRIORITY_META` entry in `scripts/generate-sitemap.mjs` (or accept the `DEFAULT_META` fallback at priority 0.5).
5. Run `npm run build` and verify the route renders in `dist/<route>/index.html`.

### Update logo files

The 4-slab prism design lives in `src/icons.jsx` (`TSDLogo` React component) and across `public/*.svg`. To regenerate raster files (PNGs) from the SVG masters, install librsvg and run:

```bash
brew install librsvg
rsvg-convert -w 256 public/favicon.svg -o public/favicon-32.png
rsvg-convert -w 1200 public/og-image.svg -o public/og-image.png
# etc.
```

### Run analytics locally

`.env.local` with the IDs filled in → `npm run dev`. Analytics scripts will load and report against your real properties. Use Plausible's "Goals → Test" or GA4 DebugView to confirm events arrive.

## Pre-launch context

The site is in pre-launch posture for a May 7, 2026 launch. The Hormozi-style audit on 2026-04-25 named the constraint as a **lead problem** (no booked discovery audits, no proven channel) with **pricing** as secondary. Pricing fixes shipped in Phases 1–3 of the audit; the lead problem requires founder-driven outreach, not site work. The "First Move" punch list is in `PROJECT_LOG.md` under the 2026-04-25 entries.

The site shape reflects the time-bounded operating window: every offer page surfaces the cohort cap, the last-project-start date (July 13), and the on-call window (founder available through Aug 31, 2026). Be careful when editing copy that you don't introduce ongoing-business framing that contradicts the wind-down.

## Repository

- **Live site:** https://tsd-modernization.com
- **GitHub:** https://github.com/nashyD/tsd-modernization-solutions
- **Vercel:** auto-deploys `main`
