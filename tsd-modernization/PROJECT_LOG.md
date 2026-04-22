# TSD Modernization Solutions — Project Log

**Purpose.** A running record of what's wrong with the site, what's been fixed, and why each decision was made. Dual use: operational log for what shipped, and learning doc for the concepts behind web work.

Keep entries concrete — file paths, line numbers, principle at stake. Add newest entries at the top of "Changes log" so the recent state is always at the top.

---

## First-iteration audit — 2026-04-16

The site is a **Vite + React SPA** (Single Page App) deployed on Vercel, served at `https://tsd-modernization.com`. It has 8 routes (Home, Services, Why Us, Process, Pricing, Testimonials, Team, Contact), a dark-mode-first design, a contact form wired to Web3Forms, and JSON-LD structured data for local business SEO. Good bones.

Below: the gaps found, grouped by category, with the underlying principle for each. Read this once, then refer back when you tackle the fixes.

### 1. SEO: the SPA-rendering problem (biggest limiter)

**What's happening.** Every route — `/services`, `/pricing`, `/contact`, etc. — is served by the same `index.html`. The real page content only appears after React boots in the browser and runs `applyRouteMeta()` in [`Layout.jsx`](src/Layout.jsx) to swap in the correct `<title>` and meta description.

**Why it matters.** Search crawlers and social-preview scrapers have different capabilities:
- **Google** runs JS in a second-pass render, so it does eventually see your per-route meta — but it's slower and less reliable than static HTML.
- **Bing, LinkedIn, Facebook, iMessage, Slack** link-preview bots mostly do **not** run JS. They see only the `index.html` shell — same title, same description, same OG image for every URL. Your iMessage preview for `/pricing` looks identical to `/team`.
- Initial page load has a "blank shell" moment before JS hydrates. This is visible to users and counted by performance tools as poor LCP.

**Principle.** *Static HTML is the universal interface.* Crawlers, scrapers, and slow devices all render it. JS-rendered content is an optimization on top, not a replacement for it.

**Fix paths (ordered by effort):**
1. **Prerender at build time** — a Vite plugin (`vite-plugin-prerender` or `vite-react-ssg`) renders each route to static HTML during `npm run build`. Minimal code change, keeps the SPA feel.
2. **Migrate to Next.js or Astro** — both do this natively. More work, more benefits (per-route code splitting, image optimization, etc.).
3. **Split `/services` into 3 routes** (`/services/ai`, `/services/websites`, `/services/automation`). Each service is a separate search surface. The current modal approach means one URL competes for three different buyer intents.

### 2. Conversion: one form, one page, one shot

**What's happening.** The only lead-capture mechanism is the contact form at [`Contact.jsx`](src/pages/Contact.jsx). A visitor who bounces from the homepage is lost with zero data.

**Principle.** *Lead capture is a funnel, not a page.* Buyers don't convert on first touch. You need multiple paths (primary CTA, secondary offer, exit intent, email magnet) so you can re-engage.

**Fix paths:**
- Sticky "Book 15-min call" button with Calendly embed.
- Homepage email capture tied to a lead magnet (PDF checklist, free audit template).
- Multiple CTA variants tested against each other — which requires analytics (see next item).

### 3. No analytics — flying blind

**What's happening.** Zero tracking in the codebase. No way to know which page converts, where users drop off, whether hero video matters.

**Principle.** *You can't optimize what you don't measure.* Every other improvement is a guess without data.

**Fix.** Installed 2026-04-16 — see Changes log.

### 4. Performance

**What's happening.**
- `hero-loop.mp4` is ~15 MB. The deferral trick in [`Home.jsx`](src/pages/Home.jsx) helps LCP (the poster image loads fast) but mobile users on LTE still pay the data cost.
- All images are JPG/PNG — no WebP or AVIF variants. Modern formats are 40–70% smaller at equal quality.
- No route-level code splitting. Every visitor downloads `Services.jsx`, `Pricing.jsx`, `Team.jsx`, etc. just to view Home. Lazy imports + `<Suspense>` would split the bundle per route.

**Principle.** *Performance is a ranking factor now.* Google's Core Web Vitals (LCP, INP, CLS) feed into SEO. Fast sites also convert better — every 100ms of load time costs conversion rate.

**Fix paths:**
- Re-encode the video: `ffmpeg -i hero-loop.mp4 -c:v libx264 -crf 28 -preset slower -vf scale=1280:-2 out.mp4` — usually drops 15 MB → <3 MB with no visible quality loss. Also consider AV1 for Chrome.
- `<picture>` element with AVIF → WebP → JPG fallback.
- `React.lazy(() => import('./pages/Home'))` + `<Suspense fallback={…}>` in `App.jsx` for each route.

### 5. Trust & social proof

**What's happening.** Homepage has no testimonials, no client logos, no case studies. The "Why We Do This" section talks about the company, not about results delivered to clients. The stats ("50,000+ small businesses," "95%+ satisfaction") are unsourced — readers won't believe them.

**Principle.** *Services buyers need proof before they book* — they're purchasing you, not a product. Unlike SaaS where a free trial closes the gap, services sales rely on social proof to reduce perceived risk.

**Fix paths:**
- Testimonial carousel on homepage (one above the fold, rest below).
- Row of client logos (even 3 real logos from real clients > generic stock).
- 2–3 case studies as their own routes: problem → what we built → outcome with numbers.
- Replace vague stats with defensible ones ("X Charlotte businesses launched in 2025") or cite the source.

### 6. Accessibility

**What's happening.**
- Contact form fields use `placeholder` only — no `<label>` elements. Screen readers can't announce what each field is for.
- Images (hero video, storefront, team photos, quote icons) have no `alt` text.
- No visible `:focus-visible` styles — keyboard users can't see where they are on the page.
- Theme toggle defaults to dark without checking `prefers-color-scheme`.

**Principle.** *Accessibility is table stakes.* It's a legal requirement in many jurisdictions (ADA in the US, EU Accessibility Act in Europe), an SEO signal (Google rewards semantic HTML), and ~15% of users have a disability of some kind. Ignoring a11y leaves money on the table.

**Fix paths:** Real `<label htmlFor="...">`s on every form field. Descriptive `alt` on every non-decorative image (`alt=""` for purely decorative). Add `:focus-visible` ring in the theme's accent color.

### 7. Content & messaging

**What's happening.**
- H1 "The world moved forward. Your business can too." is poetic but doesn't say what you do or for whom.
- No pricing anchor on the homepage — buyers filter by budget first; burying pricing at `/pricing` loses browsers.
- The 48-hour proposal turnaround is your strongest differentiator but it's buried in the stats row, not in the hero.

**Principle.** *Clarity beats cleverness at the top of the funnel.* When someone lands on your site from a Google search, they have <5 seconds to decide if you're the right fit. Ambiguous headlines lose them.

**Fix paths:** Rewrite the H1 to be specific ("Custom AI, websites, and automation for Charlotte small businesses — shipped in days, not months"). Put "Starting at $150" or "48-hour proposal" in the hero subheading.

### 8. Local SEO

**What's happening.** JSON-LD in `index.html` declares `areaServed: Charlotte, Gastonia, Belmont` but the on-page content doesn't leverage this. No embedded Google Map, no reviews widget, no link to Google Business Profile.

**Principle.** *Local SEO is a separate discipline from general SEO.* Google's local pack (the map results above organic) ranks on different signals: NAP consistency across directories, GBP reviews, local citations, proximity to searcher. Getting into the local pack for "AI consulting Charlotte" is more valuable than ranking #3 organically.

**Fix paths:**
- Claim and optimize Google Business Profile.
- Embed a Google Map on the Contact page.
- Add location-specific landing pages if expanding (`/gastonia`, `/belmont`).
- List on local directories (Yelp, BBB, Chamber of Commerce).

### 9. Technical / housekeeping

- `hero-loop.mp4.backup`, `hero-loop-poster.jpg.backup`, `hero-storefront.jpg.backup` in `public/` ship to production. `robots.txt` blocks them from indexing but they still bloat the deploy.
- No README or CLAUDE.md — future you (or a collaborator) won't know how to run this.
- No error monitoring (Sentry or similar). Production bugs will only surface when users complain.
- Sitemap is hand-edited — it'll drift as routes change.

---

## Changes log

Newest entries at the top. Each entry: what changed, why, files touched, and the principle reinforced.

### 2026-04-22 — Halved hero video weight, converted LCP-path images to WebP

**What.** Re-encoded both hero videos, converted the three poster/backdrop JPGs to WebP, and removed the `.backup` files from `public/`.

| File | Before | After | Change |
|---|---|---|---|
| `hero-loop.mp4` | 15.31 MB | 7.43 MB | −51% |
| `hero-loop-mobile.mp4` | 6.94 MB | 2.45 MB | −65% |
| `hero-loop-poster.jpg` → `.webp` | 425 KB | 196 KB | −54% |
| `hero-loop-mobile-poster.jpg` → `.webp` | 72 KB | 59 KB | −18% |
| `hero-storefront.jpg` → `.webp` | 133 KB | 77 KB | −42% |

Total savings: ~12.1 MB off every desktop session, ~4.6 MB off every mobile session.

**Why.** Fixes items #2 (hero video weight) and #8 (`.backup` file cleanup) from the audit. The hero videos dominated mobile data cost; the posters (not the videos) sit on the LCP path because the videos defer via `requestIdleCallback`.

**Surprise #1 — CRF 28 made the video bigger.** The audit's recipe (`-crf 28 -preset slower -vf scale=1280:-2`) grew `hero-loop.mp4` from 15.3 MB to 17.8 MB. CRF is a *quality target*, not a compression ratio — and the source was already heavily compressed (~2.5 Mbps at 1080p). Asking CRF 28 ("visually lossless-ish") at 720p effectively demanded higher bitrate than the input carries, so the output grew. Re-ran at CRF 34 to land at 7.4 MB with no visible artifacts in-browser (verified via dev-server playback at `currentTime=8s` — skyline, brick, and small signage all clean).

**Surprise #2 — WebP q=80 did the same thing to the poster.** `hero-loop-poster.jpg` at q=80 grew from 425 KB to 519 KB for the same reason. Dropped to q=65 and scaled 1920×1080 → 1280×720 (matching the new video resolution), landing at 196 KB.

**Encoding recipes used.**
```bash
ffmpeg -y -i hero-loop.mp4 -c:v libx264 -crf 34 -preset slower \
  -vf scale=1280:-2 -an -movflags +faststart hero-loop.new.mp4

ffmpeg -y -i hero-loop-mobile.mp4 -c:v libx264 -crf 34 -preset slower \
  -an -movflags +faststart hero-loop-mobile.new.mp4

cwebp -resize 1280 720 -q 65 -m 6 hero-loop-poster.jpg -o hero-loop-poster.webp
cwebp -q 55 -m 6 hero-loop-mobile-poster.jpg -o hero-loop-mobile-poster.webp
cwebp -q 80 -m 6 hero-storefront.jpg -o hero-storefront.webp
```

`-an` strips audio (hero is muted anyway). `+faststart` moves the MOOV atom to the front of the mp4 so browsers can begin playback on the first range request instead of downloading the whole file first.

**Files touched.**
- `public/hero-loop.mp4`, `hero-loop-mobile.mp4` — re-encoded in place.
- `public/hero-loop-poster.webp`, `hero-loop-mobile-poster.webp`, `hero-storefront.webp` — new.
- `public/hero-loop-poster.jpg`, `hero-loop-mobile-poster.jpg`, `hero-storefront.jpg` — deleted (replaced by `.webp`).
- `public/hero-loop.mp4.backup`, `hero-loop-poster.jpg.backup`, `hero-storefront.jpg.backup` — deleted.
- `src/pages/Home.jsx` — swapped the `poster` attribute and `.hero-bg` `backgroundImage` to `.webp`. Two-line change (lines 96, 110).

**Dependency added.** `cwebp` (Google's libwebp encoder), installed via `brew install webp`. Local dev tool only — nothing in the repo or build depends on it.

**Browser support for `.webp` in the `<video poster>` attribute and CSS `background-image`.** Safari 14+ (Sept 2020), Chrome/Firefox/Edge far earlier. In 2026, dropping the JPG fallback is safe.

**Principle reinforced.** *Compression targets answer to the input, not just the knob.* CRF 28 and WebP q=80 both made files *larger* here because the existing assets were already aggressively compressed by some earlier pipeline — the encoder's "quality level 80" was above the source's actual quality, so the "re-encode" reproduced the source at a higher-fidelity setting than it started at. The right mental model isn't "pick a quality slider, see what size you get" — it's "the output can't be smaller than what the encoder thinks it needs to match the input's quality level." Always probe the input's real bitrate/resolution before picking a target. For hero-background media specifically, the viewer's fidelity threshold is very low (dark gradient overlay, never the focal point) — target well below what the input carries and verify visually, rather than compressing blindly to a "visually lossless" spec.

---

### 2026-04-16 — Debugged: env vars set but analytics still not firing

**What.** After setting all three env vars in Vercel and redeploying multiple times, the Plausible dashboard still couldn't detect the install. Inspecting the deployed JS bundle showed none of the tokens (`pa-...`, `G-SKT5WM633H`, `wclqqyqray`) — even though the pre-existing `VITE_WEB3FORMS_KEY` was there.

**Root cause.** `src/analytics.js` and the `Layout.jsx`/`main.jsx` wiring existed only locally — never committed, never pushed. Vercel kept auto-deploying the same pre-analytics commit (`5ef4642`) from GitHub, and rebuilding it with the new env vars changed nothing because **nothing in that commit's code read them**. Fix was one commit + push; pushing landed commit `0b65cb3`, Vercel auto-deployed, all three tokens appeared in the bundle.

**Symptoms that should have tipped us off sooner.**
- **Bundle filename didn't change** across redeploys (`index-DqmS-seF.js` every time). If the source input were different, Vite's content-hashed output would be different too.
- **Suspiciously fast builds** (~14 s; a real Vite rebuild is 40–60 s). Fast means cache reuse, which means the build thinks the source is unchanged.
- `x-vercel-cache: HIT` on repeated fetches — this was a red herring. Cache invalidates when Vercel promotes a new deploy; if you see HIT with an old bundle name, the deploy itself didn't produce new output.

**The 30-second debugging check to do first next time.** When a deploy ships but behavior doesn't match what you built:

```bash
git log origin/main --oneline -5
```

If your change isn't in the remote log, stop troubleshooting the deploy — nothing downstream matters. This should have been check #1, not check #11. We worked through env var scopes, the "Use existing Build Cache" checkbox, and CDN caching — all irrelevant because the code simply wasn't on GitHub.

**Secondary gotcha — two `.git` directories.** This project has both `Modernization Solutions Site/.git` (the real repo, wired to GitHub → Vercel) and `tsd-modernization/.git` (a stray empty repo with zero commits). Running `git status` inside the inner directory reports "No commits yet" — technically true, but misleading: Vercel doesn't watch that repo. `git remote -v` is the source of truth (the GitHub URL only appears in the outer repo). Worth deleting the inner `.git` to prevent future confusion — commit below to do this cleanly:

```bash
rm -rf tsd-modernization/.git
```

**Principle reinforced.** *An env-gated feature has two halves: code that reads the variable, and the variable set in the environment that builds the code. Both must ship, to the same place, at the same time.* Missing either half is a silent no-op. Ship them as one atomic unit: commit the code **and** set the env var **before** the deploy that should light them up. If you split the steps, verify each: `git log origin/main` for the code half, Vercel's Environment Variables page for the config half. If either is stale, you've already found your bug.

---

### 2026-04-16 — Wired Microsoft Clarity (project ID `wclqqyqray`)

**What.** No code change — [`src/analytics.js`](src/analytics.js) `initClarity()` already reproduces Clarity's install IIFE verbatim, with the ID injected via `JSON.stringify`. Smoke-tested `https://www.clarity.ms/tag/wclqqyqray` and it loaded 200.

**What's needed (user action).** In Vercel → Project → Settings → Environment Variables:

- Set `VITE_CLARITY_ID` = `wclqqyqray`

Then redeploy. Clarity takes ~2 hours to process the first session recordings. Once populated, the dashboard at [clarity.microsoft.com](https://clarity.microsoft.com) will show:
- **Heatmaps** — where users click, scroll, and hover on each page.
- **Session recordings** — anonymized video replays of individual user sessions.
- **Insights** — auto-flagged "rage clicks," "dead clicks" (clicks on non-interactive elements), "excessive scrolling," and "quick backs" (immediate bounces).

**Why this matters more than GA4/Plausible for a new site.** GA4 and Plausible tell you *what* pages people visit and *what* they do. Clarity tells you *why* they drop off. For a services business at launch, when you don't yet know which parts of your funnel leak, session recordings are the fastest way to find the leak. Five minutes of watching real users fumble your form is worth an hour reading analytics charts.

**Privacy note.** Clarity records sessions. Anonymization is automatic — input fields are masked by default and Clarity doesn't see keystrokes in forms, passwords, or credit card fields. No cookie banner is legally required in the US today, but if you ever expand to EU/UK, Clarity's recordings fall under GDPR and you'll need consent.

**Principle reinforced.** *Quantitative and qualitative analytics are complements, not substitutes.* GA4/Plausible give you dashboards — abstract, aggregated, fast to skim. Clarity gives you sessions — concrete, individual, slow to watch but irreplaceable. Teams that only do the first kind optimize local maxima forever ("landing page bounce rate is 42%"), because they can't see the actual user behavior that explains the number. Teams that only do the second can't prioritize which sessions to watch. Ship both. Look at dashboards weekly; watch 3 sessions per week.

**Analytics stack now complete.** All three tools installed and verified. Set the three env vars in Vercel, redeploy, and you'll have:
- **GA4** — funnels, acquisition sources, long-term trends.
- **Plausible** — simple daily dashboard, shareable links, no cookie consent headaches.
- **Clarity** — heatmaps + session recordings for qualitative UX debugging.

---

### 2026-04-16 — Wired GA4 (measurement ID `G-SKT5WM633H`)

**What.** No code change needed — [`src/analytics.js`](src/analytics.js) `initGA4()` already matches Google's install snippet. Smoke-tested the tag URL with your real ID and it loaded 200.

**One detail worth calling out.** Google's default snippet is:

```js
gtag('config', 'G-SKT5WM633H');
```

Our code uses:

```js
gtag('config', GA4_ID, { send_page_view: false });
```

That `send_page_view: false` flag is deliberate. GA4's default behavior is to fire one `page_view` event when `config` runs — which is fine for static multi-page sites, but **broken for SPAs**: the `config` call only runs once (on initial load), so subsequent React Router navigations would never be counted. With the flag off, we suppress GA4's auto pageview and instead fire it ourselves from the route-change `useEffect` in [`Layout.jsx`](src/Layout.jsx) via `trackPageView()`. Every navigation counts.

**What's needed (user action).** In Vercel → Project → Settings → Environment Variables:

- Set `VITE_GA4_ID` = `G-SKT5WM633H`

Then redeploy. After ~30 minutes of traffic, check Google Analytics → Realtime to confirm events are flowing. DebugView (GA4 → Admin → DebugView) is also useful for confirming individual page_view events are coming through with the right `page_path`.

**Privacy note.** GA4 sets cookies and collects IP-derived location. No consent banner is strictly required for US-only traffic today, but the moment you sell into the EU/UK or California-scale, you'll need one. Deferred until market scope expands.

**Principle reinforced.** *Framework defaults assume a non-SPA world.* Most vendor-provided snippets (GA4, Facebook Pixel, Hotjar, etc.) were written when every page was its own HTML document. They auto-fire "pageview" on script load, which maps 1:1 to a page on a traditional site. On an SPA, script load happens once; navigation happens many times; the two are decoupled. Whenever you install a tracking tool on a React/Vue/SvelteKit app, check the vendor's SPA docs — they almost always have a section on manual pageview tracking, and you almost always need it.

---

### 2026-04-16 — Switched Plausible to v2 script-token snippet

**What.** Updated the Plausible integration in [`src/analytics.js`](src/analytics.js) to use the new site-specific script URL pattern (`https://plausible.io/js/pa-{id}.js`) plus the `plausible.init()` shim. Renamed the env var `VITE_PLAUSIBLE_DOMAIN` → `VITE_PLAUSIBLE_ID`.

**Why.** When you signed up for Plausible, you were issued the newer install snippet (site-specific script with an explicit `init()` call) rather than the legacy `script.js` + `data-domain` attribute. Both formats work, but Plausible's newer script is what they now hand out by default and it's the format that unlocks extensions (outbound link tracking, file downloads, revenue tracking) via `init()` options later on.

**Files touched.**
- `src/analytics.js` — `initPlausible()` now appends the user-specific `pa-...js` script (async), defines the shim function so queued calls don't get dropped before the async script finishes loading, and calls `plausible.init()`.
- `.env.example` — renamed variable, updated example value and docstring.

**What's needed (user action).** In Vercel → Project → Settings → Environment Variables:
- Set `VITE_PLAUSIBLE_ID` = `pa-R3jO3KFcDkvH79c2b6_2J`

Then redeploy. (If you already set `VITE_PLAUSIBLE_DOMAIN`, delete that old variable — it's no longer read.)

**Verification.** Smoke-tested the script URL directly in the dev preview — `GET https://plausible.io/js/pa-R3jO3KFcDkvH79c2b6_2J.js` returned 200, and the script's `onload` fired. The URL the code constructs is correct; once the env var is live, real pageviews will flow.

**Privacy note.** The `pa-xxxxx` token is *not* a secret — it's a public identifier that appears in the HTML of every page. It's safe to commit or paste anywhere. We keep it in env vars purely for environment-switching (prod vs. staging vs. dev) convenience, not for secrecy.

**Principle reinforced.** *Vendor snippets are a starting point, not the final form.* When a third party hands you a copy-paste "install this" block, it's optimized for the simplest-possible HTML site — one vendor per page, no architecture to fit in with. Your site has a module for analytics with three tools that share behavior (env-var gating, dev-safe defaults). Adapt the snippet to that structure — but preserve the *semantics*: the shim function matters (catches calls made before the async script loads), the init call matters (tells Plausible to start tracking), the `async` attribute matters (doesn't block page rendering). Don't paraphrase vendor code; translate it.

---

### 2026-04-16 — Installed analytics (GA4 + Plausible + Microsoft Clarity)

**What.** Created [`src/analytics.js`](src/analytics.js) — a single module that conditionally loads GA4, Plausible, and Clarity based on env vars. Called `initAnalytics()` from [`main.jsx`](src/main.jsx) on app start, and `trackPageView()` from the existing route-change effect in [`Layout.jsx`](src/Layout.jsx).

**Why.** Fix #3 from the audit. Without analytics, every other improvement is guesswork. Chose all three tools for complementary views:
- **GA4** — Google's standard, free, integrates with Search Console and Google Ads. Captures conversions, traffic sources, funnels.
- **Plausible** — privacy-focused, cookieless (no GDPR banner needed), lightweight (<1 KB). Gives a cleaner overview when you don't want to wrangle GA's UI.
- **Clarity** — free session recordings + heatmaps from Microsoft. Shows *how* users actually interact, not just what. Invaluable for a new site where you don't yet know where people struggle.

**Files touched.**
- `src/analytics.js` (new) — loader module, reads `VITE_GA4_ID`, `VITE_PLAUSIBLE_DOMAIN`, `VITE_CLARITY_ID` from env.
- `src/main.jsx` — calls `initAnalytics()` before `ReactDOM.createRoot`.
- `src/Layout.jsx` — calls `trackPageView(location.pathname)` in the existing route-change `useEffect`, right after `applyRouteMeta` (so `document.title` is fresh when GA4 reads it).
- `.env.example` (new) — documents all four env vars (also surfaced the existing `VITE_WEB3FORMS_KEY`).
- `.gitignore` — added `.env`, `.env.local`, `.env.*.local` so secrets never commit.

**Design decisions.**
- **Env-var gating.** Each tool only loads if its env var is set. In dev without env vars, nothing fires — keeps the dev console clean and avoids polluting analytics with local traffic. In Vercel production, set the vars and they all activate.
- **GA4 manual pageviews.** The `gtag('config', ID, { send_page_view: false })` flag disables GA4's built-in pageview tracking, and we manually fire `page_view` events on route change. This is required for SPAs — without it, GA4 only sees the initial load and misses every in-app navigation.
- **Plausible auto-tracking.** Plausible's `script.js` hooks the browser's History API directly, so React Router navigations are tracked automatically. No manual call needed.
- **Clarity vendor snippet.** Clarity's standard IIFE snippet handles SPA route changes on its own via MutationObserver.

**Verification.** Ran `npm run dev`, confirmed in browser DevTools:
- `analytics.js` loads (200 OK).
- No network requests to `googletagmanager.com`, `plausible.io`, or `clarity.ms` — because env vars are unset locally. Exactly what we want.
- App renders normally, no JS errors from the new code.

**What's still needed (user action).**
1. Create GA4 property at [analytics.google.com](https://analytics.google.com) → Admin → Create Property → Web data stream. Copy the Measurement ID (format `G-XXXXXXXXXX`).
2. Create Plausible account at [plausible.io](https://plausible.io), add `tsd-modernization.com` as a site. *(Done — see next entry above for the superseded env var name.)*
3. Create Clarity project at [clarity.microsoft.com](https://clarity.microsoft.com). Copy the project ID from the Install tracking code section.
4. In Vercel → Project → Settings → Environment Variables, add:
   - `VITE_GA4_ID` = `G-XXXXXXXXXX`
   - ~~`VITE_PLAUSIBLE_DOMAIN` = `tsd-modernization.com`~~ — **superseded**, use `VITE_PLAUSIBLE_ID` per the newer entry above.
   - `VITE_CLARITY_ID` = (Clarity project ID)
5. Redeploy.

**Principle reinforced.** *Instrument first, optimize second.* Data before decisions.

**Privacy note.** GA4 and Clarity set cookies. If you ever sell to EU/UK customers or expand into jurisdictions with stricter privacy laws (CCPA, GDPR), you'll need a consent banner before loading those two. Plausible is cookieless and exempt. Deferred for now; revisit when market scope expands.

---

## Concepts glossary — things introduced so far

Short reference. Each concept links to where it was discussed above so you can come back to it.

- **SPA (Single Page Application)** — a website where all routes are rendered in the browser by JS instead of served as separate HTML pages. Fast in-app navigation, but the SEO/preview problem in §1.
- **Prerendering / SSG (Static Site Generation)** — compile each route to real HTML at build time. Combines SPA UX with static-HTML indexability.
- **SSR (Server-Side Rendering)** — render HTML on the server for each request. Similar benefits to prerendering but runs per-request instead of per-build.
- **JSON-LD / structured data** — machine-readable tags declaring what a page is (business, article, product). Powers Google's knowledge panels and rich results. See `index.html` lines 38–98 for an example.
- **Core Web Vitals** — Google's performance metrics: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift). Ranking factor and UX signal.
- **OpenGraph (OG) tags** — meta tags that control how links preview in iMessage, Slack, LinkedIn, etc. See `index.html` lines 17–28.
- **LCP image** — the largest image/element in the viewport on first paint. Optimizing it (preload, modern format) directly improves the LCP metric.
- **Env vars / secrets management** — never hardcode API keys. Use `.env.local` (gitignored) for dev, platform env-var settings (Vercel) for production. `VITE_` prefix exposes vars to the browser; without the prefix they stay server-only.
- **NAP consistency** — same Name, Address, Phone across your site and every directory/listing. Local SEO ranks this signal.
- **Lead magnet** — a free asset (PDF, checklist, template) traded for an email address. Top-of-funnel capture.

---

## Open items (next things to tackle, roughly ordered)

1. Add testimonials + client logos to the homepage (biggest conversion lift per hour).
2. Prerender the build and split `/services` into 3 pages (biggest SEO lift).
3. Add real `<label>` elements and image `alt` text (accessibility baseline).
4. Rewrite the H1 for specificity.
5. Move the "48-hour proposal" claim into the hero.
6. Claim and link Google Business Profile; embed Map on Contact page.
7. Add README with dev setup and deploy steps.
