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

### 2026-04-26 — Pricing restructure: third tier, anchors on Phase I, FAQ migrated from Contact

**What.** Restructured [`/pricing`](src/pages/Pricing.jsx) from two tiers to three, repriced and anchor-formatted Phase I, added a live spots-remaining counter on the capped tiers, added objection-handling copy below each CTA, and moved the FAQ block from [`/contact`](src/pages/Contact.jsx) to [`/pricing`](src/pages/Pricing.jsx). Together these implement the P0 "pricing page restructure" block of the v2 Marc Lou checklist (Slice 1 of the Marc Lou implementation arc).

The new tier shape:

| Tier | Phase chip | Anchor | Founding | Range | Cap | CTA | Objection line |
|---|---|---|---|---|---|---|---|
| Discovery | Phase I | $3,000 | $1,500 | Founding rate · One-time | none | Book Tech Audit | *"Money-back if we can't find $25K of opportunities."* |
| Website + AI Bundle (featured) | Phase II | $4,000 | $2,000 | Founding rate | 10 | Claim Founding Spot | *"Fixed fee. Delivered by handoff. Source code is yours from day one."* |
| Founding Partnership | Partnership | $10,000 | $5,000 | Founding rate · By application | 3 | Apply for Partnership | *"Cancel any time after handoff. No retainer trap."* |

The `featured: true` flag stays on Phase II — 2px Carolina border + Most Popular badge + slightly taller padding. Marc's structural rule is three tiers with the middle as the obvious pick; the Bundle is still that pick, the Partnership is the upmarket "for serious buyers" option, and Phase I now reads as the discounted entry instead of a too-cheap-to-trust audit.

A new `SPOTS` config at the top of [`Pricing.jsx`](src/pages/Pricing.jsx) holds `{ bundle: { remaining, total }, partnership: { remaining, total } }` and renders as a Carolina-bordered chip with a green status dot beneath the price on capped tiers (e.g. "● 10 OF 10 SPOTS REMAINING"). Update the numbers as contracts sign — the counter surfaces real scarcity visually rather than burying it in prose.

The FAQ moved verbatim from [`Contact.jsx`](src/pages/Contact.jsx) into [`Pricing.jsx`](src/pages/Pricing.jsx) with one wording fix ("the founding-cohort rate is" → "our founding-cohort rates are" — plural now that there are three founding rates) and a reorder so the price-justification answer ("Why are your prices so much lower than agencies?") appears first. The `<DiamondDivider />` that previously separated the contact form from the FAQ also dropped, and `DiamondDivider` was pruned from the Contact imports.

**Why.** Marc Lou's pricing rule is three tiers with the middle as the obvious pick — two tiers gives the buyer a binary they're more likely to opt out of, four+ gives them analysis paralysis. Reframing $250 → $1,500/$3,000 fixes the inverse-signaling problem: a $250 audit reads as "the work isn't valuable" before the buyer has read a feature; the same audit at $1,500 with a struck-through $3,000 anchor reads as a 50%-off founding rate from a serious vendor. The Partnership tier exists to anchor *upward* — most buyers will still pick the middle, but the existence of a $10,000-anchored option makes the $4,000-anchored Bundle read as the reasonable middle rather than the expensive one. Capped at 3 spots so it stays honest scarcity (one founder × ~12-15 hours/month of named ops handholding from Bishop is the realistic ceiling).

The objection-handling copy under each CTA is Marc's "FAQ at the moment of decision" rule applied to a single line: the buyer's eye lands on the price, drifts to the button, hesitates — the italic line answers the specific objection that tier triggers. Phase I: *will I get my money back if it's a wash?* Bundle: *will the price change on me, and do I really own the code?* Partnership: *am I locking myself into a retainer?* Each line is a pre-emptive yes to the most likely objection at that price point.

The FAQ migration follows the same logic at section scope. A buyer who reaches `/contact` has already self-selected past the price; they need a form to fill out. A buyer reading `/pricing` is *deciding* — that's where the FAQ does the salesperson's job. The reorder puts the price-justification answer first because that's the dominant hesitation on a pricing page.

**Files touched.**
- [`src/pages/Pricing.jsx`](src/pages/Pricing.jsx) — added `SPOTS` config, restructured `TIERS` to three entries with `anchor` + `objection` + `spotsKey` fields, added spots-remaining badge inside `TierCard`, added italic objection line below each CTA, changed grid from `1fr 1.3fr` to `1fr 1.15fr 1fr`, bumped mobile-stack breakpoint from 820px → 980px, added `FAQSection` + `FAQS` array (moved from Contact), updated section header from "Two ways to start" → "Three ways to start", updated wedge pointer copy to "built for HVAC, electricians, and plumbers" (matches v2 trades-wedge identity).
- [`src/pages/Contact.jsx`](src/pages/Contact.jsx) — removed `FAQSection` component, removed `<FAQSection />` and the preceding `<DiamondDivider />` from page composition, dropped `DiamondDivider` from the shared imports.
- [`src/services-data.js`](src/services-data.js) — added missing `CogIcon` to the icon import list. Pre-existing bug surfaced during verification: `CogIcon` is exported from [`icons.jsx`](src/icons.jsx) and referenced inside `SERVICES`, but was never named in the import line, so every visit to `/services` or `/services/process-modernization` was throwing a `ReferenceError` at runtime. One-character fix; left it in this slice rather than carrying an open bug.

**Verification.** Dev server reloaded via Vite HMR. Accessibility snapshot at `/pricing` confirms three tier cards render in the right order with the correct anchor / price / range / spots-counter / features / bonus / CTA / objection structure. Phase II keeps the Most Popular badge and 2px Carolina border. The FAQ block renders below the wedge pointer with seven questions in the new order — "Why are your prices so much lower than agencies?" first. Snapshot at `/contact` confirms the page is now NAP block + map + form only (no FAQ, no divider). Snapshot at `/services` after the `CogIcon` import fix confirms all three service cards render cleanly with no `ReferenceError`. No new console errors introduced by this slice.

**Out of scope this pass.** The `?ref=` query-param attribution on the three pricing CTAs is still on the P3 list (would need both URL params on the links *and* the contact form to capture them server-side); doing only the URL half here would create half-finished tracking. The headline test (P1 — five H1 variations sent to friends) is a parallel manual task. The remaining P0 items — homepage trades-wedge reframe, AIReceptionist anti-SaaS positioning, trade-specific landing pages (`/hvac`, `/electricians`, `/plumbers`), and the Missed Call Calculator — are slices 2–5 of this implementation arc.

**Voice notes.** Drafted copy passed through the humanizer rules — no "X, not Y" contrastive constructions in the new strings, no imperative trio cadence, no banned vocabulary. The objection lines are deliberately short statements rather than mini-paragraphs because they sit beneath a CTA and shouldn't compete with it.

**Principle reinforced.** *Three tiers with a middle pick beats two tiers with a winner.* Two-tier pricing forces the buyer to evaluate yes/no on the bigger number — the question becomes "do I want this at all." Three-tier pricing reframes the question to "which of these do I want," which is a much easier yes. The Partnership tier doesn't have to sell on its own; it just has to exist, so the Bundle reads as the obvious middle. Same logic on the FAQ migration: surface the answer at the moment of hesitation, before the buyer has self-selected past the question.

---

### 2026-04-25 — TSD chat agent (proof of concept)

**What.** Custom LLM-powered chat widget mounted globally on the site. Floating "Chat with TSD" bubble bottom-right; expands to a 380×560px editorial-styled panel that talks to a Vercel serverless function backed by Claude Haiku 4.5. The agent answers questions about TSD (services, pricing, cohort, founders) and, when a visitor shows clear intent, calls a `capture_lead` tool that posts to the same Web3Forms backend the contact form uses. New lead lands in the founders' inbox tagged `[Chat agent]`.

**Architecture.**
- **Backend:** [`api/agent.js`](api/agent.js) — Vercel serverless function. Uses `@anthropic-ai/sdk` ^0.x, calls `claude-haiku-4-5` with a system prompt drawn from services-data + Pricing + AIReceptionist + Team. Single tool: `capture_lead` with `{name, email, business, summary}` schema. Manual agent loop with a 3-iteration safety cap; tool execution submits to Web3Forms server-side and returns success/failure to the model so it can confirm to the visitor in plain language.
- **Frontend:** [`src/components/TSDAgent.jsx`](src/components/TSDAgent.jsx) — React widget, mounted in [`src/Layout.jsx`](src/Layout.jsx) so it appears on every route. Uses the existing `C` palette + `v()` theme vars. Editorial header (`◆ CHAT AGENT / TSD Modernization` in italic Playfair) matches site typography. Chat bubbles styled as Carolina-gradient (user) / surface-bordered (assistant). Typing-dots animation while waiting; red bar for errors; green-tinted "Lead submitted" banner when capture fires.
- **Statelessness:** server returns the FULL message history (including tool_use / tool_result blocks) on every response; client stores it verbatim and sends it back unchanged on the next request. No server session store needed. Display layer filters down to text-only blocks for rendering.

**Voice + honesty rules in the system prompt.** Operator-direct, short sentences, no "X, not Y" patterns, no banned vocab. Critically: **zero signed clients as of launch.** When asked "who has hired you" or "show me case studies," the agent answers plainly: no one yet, Summer 2026 is the first cohort, recruiting the founding ten now. The transparency *is* the pitch. Locked-pipeline names (Studio C, Moose Electric, etc.) are not in the system prompt and the agent never represents them as clients.

**Why.** Two payoffs. (1) Eat-our-own-dog-food proof: the chat product TSD sells to clients is now running on TSD's own site. Anyone who asks "can you actually build one of these" can press the bubble and try it. (2) 24/7 sales surface: the contact form requires a visitor to compose a message; the agent qualifies, answers objections, and only asks for contact details once the visitor shows they're serious. Lower friction than the form, higher signal than a generic chatbot.

**Files touched.**
- [`api/agent.js`](api/agent.js) (new)
- [`src/components/TSDAgent.jsx`](src/components/TSDAgent.jsx) (new)
- [`src/Layout.jsx`](src/Layout.jsx) (import + global mount after `<Analytics />`)
- [`.env.example`](.env.example) (added `ANTHROPIC_API_KEY` row, no VITE_ prefix on purpose)
- [`package.json`](package.json) / [`package-lock.json`](package-lock.json) (added `@anthropic-ai/sdk` dependency)

**Verification.** Dev server reloaded via Vite HMR. Bubble renders bottom-right with the correct aria-label. Click expands the panel; greeting renders; user input round-trips correctly through the React state. The fetch to `/api/agent` 404s in local dev because Vite doesn't run serverless functions — the widget displays "Request failed (404)" gracefully in its error bar, which confirms the error path is intact. Full backend behavior can only be verified after `ANTHROPIC_API_KEY` is set in Vercel.

**Operational notes.**
- **Required env var:** `ANTHROPIC_API_KEY` (no `VITE_` prefix — server-side only, must NOT be exposed in the browser bundle). The Web3Forms key (`VITE_WEB3FORMS_KEY`) is reused server-side for lead capture — Vercel env vars are accessible from serverless functions regardless of prefix.
- **Cost:** ~$0.008 per conversation at expected volume (Haiku 4.5 at $1/M input + $5/M output). 100 conversations/day ≈ $24/month. Negligible at pre-launch traffic.
- **No rate limit yet.** Open endpoint. If the URL gets discovered or someone scripts it, costs could spike. Add a token-bucket or Vercel Edge rate limit if traffic grows.
- **No streaming yet.** Non-streaming responses; visitor waits ~1-3s for the full reply. Acceptable at this volume; revisit if responses get longer.

**Hidden gotcha.** Vercel auto-detects functions in `/api/` at the project root. The existing `vercel.json` rewrites `/(.*)` to `/index.html` for SPA fallback — but Vercel's filesystem checks (including serverless function routes) take precedence over rewrites, so `/api/agent` resolves to the function before the catch-all hits. No vercel.json change needed. (Side note: now that the site is fully prerendered by `vite-react-ssg`, the SPA catch-all rewrite may be dead code — worth removing in a future pass.)

**Principle reinforced.** *Eat your own dog food, and tell the truth.* The agent demonstrates the AI-chatbot product TSD is selling — visitors who experience it firsthand are warmer leads than ones who read prose about it. And the honest-framing rule (no signed clients yet) compounds rather than undercuts: a prospect who sees the chat acknowledge "no one yet, you'd be the first" gets two signals at once — the product works, *and* the founders won't bullshit them.

---

### 2026-04-25 — Vertical soften: trades-only → Charlotte-metro small business

**What.** Pulled the homepage off its hard HVAC/trades vertical commit and broadened it to address Charlotte small businesses across verticals. Three changes in [`src/pages/Home.jsx`](src/pages/Home.jsx):

1. **Hero H1** — "Get every after-hours call into a booked appointment." → "Get every missed call into a booked customer." Same Hormozi-spec "Get every X into Y" structure, broader noun. "after-hours call" was HVAC-coded; "missed call" works for any service business with a phone. "booked appointment" was salon/contractor-coded; "booked customer" extends to retail and food-service.
2. **Hero sub** — "Custom AI for Charlotte HVAC, plumbing, roofing, and home services. 48-hour proposals and a 100% money-back guarantee." → "Custom websites and AI tools for Charlotte small businesses. 48-hour proposals and a 100% money-back guarantee." Names the products (websites + AI) instead of the vertical (HVAC + trades).
3. **Audience strip (formerly TradesStrip)** — eyebrow "Built for the trades" → "Built for main street"; vertical list "HVAC · Plumbing · Roofing · Electrical · Lawn Care · Home Services" → "Trades · Salons · Auto Shops · Restaurants · Retail · Home Services." Six items, mirrored visual rhythm. Each name in the new list maps to a real or potential client type — "Salons" = Studio C, "Auto Shops" = Diesel Doctors, "Trades" = Moose Electric, "Restaurants" covers Cake Me Away, "Retail" + "Home Services" extend to plausible adjacent buyers.

Component name `TradesStrip` left in place (internal only). Inline comment above the function updated to reflect the broader purpose.

**Kept hard-vertical (intentional):** [`src/pages/AIReceptionist.jsx`](src/pages/AIReceptionist.jsx) — the wedge product page commits fully to HVAC + trades because it's the destination for paid local ads against trades keywords. The Pricing page's `WedgePointer` ([`src/pages/Pricing.jsx`](src/pages/Pricing.jsx)) still labels the wedge as "built for HVAC and trades" so a non-trades visitor self-selects out of the wedge funnel. [`Layout.jsx`](src/Layout.jsx) `ROUTE_META["/ai-receptionist"]` likewise stays HVAC-coded for SEO/share-preview reasons. The split is now intentional: the homepage is broad, the wedge funnel is sharp.

**Why.** As of 2026-04-25 Nash has 3 locked clients + 1 warm: Studio C Salon (Gastonia), Moose Electric (Lincolnton), Diesel Doctors (Charlotte), Cake Me Away Bakery (Dallas, NC). Only 1 of the 4 fits the HVAC/trades thesis the homepage was committing to. Three of four came in via relationship outreach, not the site — but when those buyers Google TSD or share the link, the trades-only framing reads like a mismatch with what they bought. Reality is broader than the page; updating the page so it stops contradicting the actual sales motion. The vertical wedge is preserved for paid traffic where narrow targeting still earns its keep.

**Files touched.**
- [`src/pages/Home.jsx`](src/pages/Home.jsx) — hero H1, hero sub, audience strip eyebrow + vertical list, comment above the strip function.

**Verification.** Dev server up via `preview_start`, accessibility snapshot confirms all four text changes rendered correctly on `/`. Visual screenshot at desktop and mobile widths shows the hero, sub, and audience strip stacking cleanly with no layout regression. No console errors. The cohort masthead, scarcity strip, and "Founding Cohort · Charlotte Edition · Summer MMXXVI" framing all unchanged.

**Voice notes.** New copy passed through the humanizer rules — no "X, not Y" contrastive constructions introduced, no banned vocabulary, no imperative trio cadence. The H1 keeps the "Get every X into Y" Hormozi-spec structure intentionally; that pattern is a conversion-pitch shape, not a voice tic.

**Principle reinforced.** *Match the page to what's actually closing, not to the channel you wish was closing.* The trades-only positioning was good strategy when paid ads against HVAC keywords were the planned acquisition channel. It's a liability when 75% of pre-launch closes came from cross-vertical relationship leads. The fix isn't to abandon the vertical wedge — it's to give each acquisition channel its own funnel: relationship leads land on the broad homepage, ad traffic lands on the focused wedge.

---

### 2026-04-25 — Site admin pass: README, Sentry, dynamic sitemap

**What.** Closed the three remaining housekeeping items from the original audit (§9):

1. **`README.md`** at the project root — covers stack, local setup, build/deploy, project structure, env vars, conventions (PROJECT_LOG discipline + voice rules), common tasks, and pre-launch context. Links the live site, GitHub, Vercel auto-deploy. ~150 lines, written for a future collaborator who hasn't seen the project before.
2. **Sentry frontend error monitoring** — `@sentry/react` ^10.50 added as a dependency. New [`src/sentry.js`](src/sentry.js) module follows the exact env-gating pattern of `analytics.js`: reads `VITE_SENTRY_DSN`, no-ops if unset, sample rate kept at 0.1 to stay inside Sentry's free-tier quota. Wired into [`src/main.jsx`](src/main.jsx) inside the `isClient` callback, called *before* `initAnalytics()` so it captures errors thrown during analytics init too. New `VITE_SENTRY_DSN` row in [`.env.example`](.env.example).
3. **Auto-generated sitemap** — new [`scripts/generate-sitemap.mjs`](scripts/generate-sitemap.mjs) walks the prerendered `dist/` tree after build, finds every `index.html`, and writes both `dist/sitemap.xml` and `public/sitemap.xml`. Per-route priority + changefreq overrides live in `PRIORITY_META`; routes not in the table use a 0.5/monthly default. Build script in [`package.json`](package.json) now runs `vite-react-ssg build && node scripts/generate-sitemap.mjs`. New top-level `npm run sitemap` command for re-running the generator standalone.

**Why.** All three are fix-it-once-and-forget improvements. The README means a future contributor (or future-Nash returning to the project after a break) can get oriented in five minutes instead of by reading every file. Sentry means production JS errors after May 7 surface in a dashboard rather than silently breaking pages — useful when the founders are on outreach calls and not watching Vercel logs. The dynamic sitemap means adding a route in `routes.jsx` no longer requires also remembering to hand-edit `public/sitemap.xml` — the build pass picks it up. Removes one of the recurring sources of audit-flagged drift.

**Files touched.**
- `README.md` (new, ~150 lines)
- `src/sentry.js` (new)
- `src/main.jsx` (added Sentry init in client callback)
- `scripts/generate-sitemap.mjs` (new)
- `package.json` (added `@sentry/react` dep, updated `build` script, added `sitemap` script)
- `package-lock.json` (auto-updated by npm install)
- `.env.example` (added `VITE_SENTRY_DSN` row with format note)
- `public/sitemap.xml`, `dist/sitemap.xml` (regenerated; matches new format)

**Verification.** `npm run build` clean — 12 routes prerendered, sitemap script ran, both `dist/sitemap.xml` and `public/sitemap.xml` written with matching content. URLs use the correct base, priorities match `PRIORITY_META` (e.g. `/` is 1.0/weekly, `/contact` and `/pricing` are 0.9/monthly, `/ai-receptionist` is 0.8/monthly). `@sentry/react` resolves cleanly under Vite — the env-gated init is a no-op without `VITE_SENTRY_DSN`, so dev console stays clean.

**Operational note.** When you're ready, create a Sentry project at sentry.io (free tier is generous), grab the DSN, and add `VITE_SENTRY_DSN` in Vercel → Project → Settings → Environment Variables. Until then Sentry stays dormant. Same flow as GA4/Plausible/Clarity in the analytics setup.

**Hidden gotcha.** The npm install for `@sentry/react` failed the first time with a `~/.npm` cache permission error (`EACCES`). Workaround: `npm install ... --cache /tmp/npm-cache`. Worth a one-time fix when you have a moment: `sudo chown -R $(id -u):$(id -g) ~/.npm`.

**Principle reinforced.** *Tooling that runs on every build is the only tooling that stays in sync.* The hand-edited sitemap was always going to drift — the audit predicted it three weeks ago. The fix isn't more discipline about hand-editing; it's removing the hand-edit step entirely. Same logic applies to the README (live in the repo, not in someone's head) and Sentry (errors surface automatically, not when someone remembers to check).

---

### 2026-04-25 — Phase 3: offer sharpening — vertical commit + AI receptionist wedge

**What.** Three-part offer-sharpening pass following Phases 1 and 2:

1. **Hero rewrite — outcome-led + vertical-bordered.** The Home H1 moved from a generic three-services list ("AI integration, custom websites, and workflow automation. Shipped in days.") to a single-outcome statement: "Get every after-hours call into a booked appointment. *Shipped in days.*" The sub now names the target audience by trade — "Custom AI for Charlotte HVAC, plumbing, roofing, and home services. 48-hour proposals and a 100% money-back guarantee." Added a `TradesStrip` section between the hero and the existing `ServiceTicker`: a single editorial line in italic Playfair listing HVAC · Plumbing · Roofing · Electrical · Lawn Care · Home Services under a "◆ BUILT FOR THE TRADES" eyebrow. Updated the `ServiceTicker` to lead with "AI receptionists" instead of "AI integration."

2. **New `/ai-receptionist` landing page.** Dedicated wedge product page at [`src/pages/AIReceptionist.jsx`](src/pages/AIReceptionist.jsx). Hero with editorial masthead `AI RECEPTIONIST ◆ CHARLOTTE HVAC + TRADES ◆ SUMMER MMXXVI`, the same outcome-led H1, a `Reserve a setup spot` CTA pointing to `/contact?ref=ai-receptionist`, and a scarcity strip with the hard $497 founding price + ten-spot cap + July 13 last-start. Five sections in the established "◆ LABEL / hairline / § 0N" pattern: **The Leak** (industry data on after-hours missed calls + voicemail/call-center math), **The Flow** (3-step explainer — Forward, Answer, Confirm), **The Offer** (asymmetric two-card grid: deliverables list + price card with $1,500 standard struck-through, $497 founding, $97/mo through Aug 31, risk-reversal callout, ownership-transfer note), and a closing CTA with diamond divider. New route registered in [`routes.jsx`](src/routes.jsx), `ROUTE_META` entry in [`Layout.jsx`](src/Layout.jsx) (title names HVAC + Trades), `<url>` entry in [`sitemap.xml`](public/sitemap.xml) at priority 0.8.

3. **Pricing → wedge pointer.** Added a `WedgePointer` element below the closing footnote on [`/pricing`](src/pages/Pricing.jsx): a single-line italic note linking "AI receptionist setup, $497 — built for HVAC and trades." Catches a buyer who landed on `/pricing` first and might want the lighter-weight entry product.

**Why.** Two of the three offer leaks the Hormozi audit flagged were generic dream-outcome language and a missing wedge product. Phases 1 and 2 fixed pricing and surfaced the cohort cap; Phase 3 sharpens the *offer* itself.

The H1 change is the bigger swing. The old H1 was a product list ("AI integration, custom websites, and workflow automation") — accurate but unmemorable, like reading a menu before you've decided you're hungry. The new H1 names a single buyer pain ("after-hours call → booked appointment") that any Charlotte service-business owner instantly recognizes. The trade-off: a non-HVAC visitor (a dentist, a salon) now reads a hero pitched at trades. The `TradesStrip` and the `home-services` framing in the sub are the mitigations — they broaden the audience without diluting the headline. The vertical narrowing happens hardest on `/ai-receptionist`, which fully commits to HVAC + trades because that page is the ad-targeting destination.

The wedge product page is the lower-priced entry point Hormozi calls a "sharp wedge" — small dollar amount, fast time-to-value, named outcome, easy yes. It exists for two reasons: (1) it gives Facebook + Google Local ads a converting funnel for $300/month-style ad budgets that wouldn't carry a $2,000 bundle, and (2) it captures buyers who balk at $2,000 but would say yes to $497, with a natural upsell path to the bundle later. The dedicated URL also lets the audit's recommended tactic — paid local ads against HVAC keywords — run against a focused destination instead of a generic homepage.

The summer-only operating window forced a small honesty addition to the wedge offer: `$97/mo through August 31, 2026` (matching the on-call window from Phase 1) followed by an ownership-transfer note explaining that the AI agent and credentials hand off to the buyer when the season closes. Same pattern as the bundle's "founder on call through Aug 31" — every offer page acknowledges the time bound rather than implying perpetual support.

**Files touched.**
- [`src/pages/Home.jsx`](src/pages/Home.jsx) — H1 text, sub text, `ServiceTicker` lead item changed from `AI integration` to `AI receptionists`. New `TradesStrip` component definition + invocation in the page composition.
- [`src/pages/AIReceptionist.jsx`](src/pages/AIReceptionist.jsx) — new file, ~270 lines, six sub-components (`ChapterHead`, `ReceptionistHero`, `TheLeak`, `HowItWorks`, `TheOffer`, `ClosingCTA`) plus the page wrapper.
- [`src/routes.jsx`](src/routes.jsx) — new import + new `ai-receptionist` child route.
- [`src/Layout.jsx`](src/Layout.jsx) — new `ROUTE_META["/ai-receptionist"]` entry.
- [`public/sitemap.xml`](public/sitemap.xml) — new `<url>` block at priority 0.8 (slightly below /pricing's 0.9 since the wedge is secondary).
- [`src/pages/Pricing.jsx`](src/pages/Pricing.jsx) — new `WedgePointer` component below `ClosingNote`, links to `/ai-receptionist`.

**Verification.** `npm run build` clean — 12 routes prerendered (was 11). Visual check on dev server confirmed Home hero reads correctly with the new H1, `TradesStrip` sits cleanly between hero and ticker, `/ai-receptionist` renders all five sections in the right vertical order, and the Pricing page now shows the wedge pointer below the closing footnote. The `?ref=ai-receptionist` query parameter on the CTA isn't read by the form yet — GA4 and Plausible will capture it as page params for traffic-attribution analysis; a future Phase 4 can wire it into the form submission directly so it appears in Web3Forms inbox.

**Out of scope this pass.** Facebook + Google Local ad creative for the new landing page (separate task with its own budget). Contact form modification to capture the `?ref=` param into a hidden field (deferred — analytics will still tell you which page sent the lead).

**Voice notes.** Drafted hero copy and landing-page copy mentally checked against the humanizer rule set: no imperative trio cadence (the Step titles "Forward / Answer / Confirm" are a structured 3-step format rather than free-prose imperatives, which is allowed), no "X, not Y" contrastive constructions, no banned vocabulary (`comprehensive`, `leverage`, `seamless`, etc.). One originally-drafted line — *"Voicemail loses; a call center is overkill; a receptionist is overhead the math doesn't carry."* — was three parallel statements; rewrote to a single sentence: *"Voicemail loses leads, call centers are overkill at this scale, and the math on a real receptionist rarely carries for a small operator."*

**Principle reinforced.** *Specificity multiplies in headlines, hedges everywhere else.* The Home H1 commits to one outcome ("after-hours call → booked appointment") because the H1 has 5 seconds to register; abstraction loses there. The sub broadens the audience because it has more space and more time. The trades strip names every adjacent vertical so a non-HVAC visitor doesn't bounce. And `/ai-receptionist` gets to commit *fully* to HVAC because it's a destination URL, not a doorway. Each layer trades a different amount of specificity for a different amount of audience reach — that's the right shape, not the same level of specificity everywhere.

---

### 2026-04-25 — Unified the logo system: 4-slab prism everywhere

**What.** Brought every static logo file in line with the 4-slab prism design used by the React nav component. Two parallel design systems lived in the project: the React `TSDLogo` component used 4 non-overlapping rectangles with `skewX(-12)` (light → dark Carolina-blue gradient, T/S/D over slabs 1–3), while every static SVG (favicon, og-image, `tsd-ms-logo*`) used 3 *overlapping* parallelograms drawn as path data with a tarheel-blue gradient. Same brand, different logos. A visitor saw one version on tsd-modernization.com and a different version on the browser tab favicon and the LinkedIn share preview. This pass swept the static SVGs over to the 4-slab design.

In the repo's `public/`:
- [`favicon.svg`](public/favicon.svg) → square mark (64×64), dark backdrop, prism centered, T S D letters.
- [`tsd-ms-logo.svg`](public/tsd-ms-logo.svg) (the JSON-LD logo for Google's Knowledge Panel — was on legacy purple/teal palette before this change), [`tsd-ms-logo-tarheel.svg`](public/tsd-ms-logo-tarheel.svg) → 4-slab prism + `MODERNIZATION` / `SOLUTIONS` wordmark in light-blue text (dark-theme).
- [`tsd-ms-logo-tarheel-light.svg`](public/tsd-ms-logo-tarheel-light.svg) → same prism, wordmark in navy/steel for light backgrounds.
- [`og-image.svg`](public/og-image.svg) → 1200×630 social-share card: prism scaled 2.2× on a dark navy backdrop with a subtle grid + radial glow.

Rasters regenerated from the new SVGs with `rsvg-convert`:
- `favicon-16.png`, `favicon-32.png`, `favicon.ico` (32×32 PNG bytes — modern browsers prefer the SVG anyway).
- `apple-touch-icon.png` (180×180).
- `og-image.png` (1200×630).

**Why.** Brand consistency. The Hormozi audit on the same day flagged perceived-likelihood as the offer's biggest leak — and a buyer who sees one logo on the site, a different one in the browser tab, and a third in the iMessage preview reads that as "this team isn't sure who they are yet." The 4-slab design is what shipped on the live nav and what the user explicitly named as canonical.

The JSON-LD `logo` field in [`index.html`](index.html) still references `tsd-ms-logo.svg`, which now carries the correct tarheel palette (it was purple/teal before this change). Google's Knowledge Panel will pick up the new asset on its next crawl.

**Files touched (in this repo).** 5 SVGs and 5 rasters in `tsd-modernization/public/`. Outside the repo, ~50 additional logo files across `TSD Inc. /Logos`, `TSD Ventures/Logos`, `TSD Inc. /TSD Business Cards/logos`, `TSD Inc. /launch-tracker/public/`, `TSD Ventures/tsd-ventures/public/`, and the `TSD All/*copy/...` mirror folders were updated to the same templates (those are local brand assets and don't deploy from this repo). TSD Mobile Detailing files (`tsd-md-*.svg`) were intentionally left alone — separate brand, teal palette.

**Verification.** `npm run build` clean. Live preview confirmed: `/favicon.svg` and `/tsd-ms-logo-tarheel.svg` render the new 4-slab prism. The nav logo (already on the new design from the earlier `icons.jsx` viewBox fix) remains visually unchanged.

**Tooling note.** Used `librsvg` (`brew install librsvg`) for SVG → PNG rasterization. `rsvg-convert -w <px> in.svg -o out.png` is the call. ICO regeneration would normally need ImageMagick; for this pass the 32×32 PNG bytes were copied to `favicon.ico` since modern browsers prefer the SVG favicon and the .ico is a fallback for older clients.

**Two known gaps left for you.**
- Banner PNGs (`tsd_modernization_banner.png`, `tsd_ventures_banner.png` in the brand-asset folders) had no SVG counterpart — the previous design lived only as a raster export. Not regenerated; they retain their previous design until a banner SVG template is created and exported.
- Business-card print files in TSD Inc./TSD Business Cards may have separate Adobe sources that need re-exporting from the new SVG masters before the next print run.

**Principle reinforced.** *Two designs for one brand is a credibility tax.* Every place a customer sees the company should show the same shape. When the React nav and the favicon and the LinkedIn share card don't match, each mismatch is a small "are these guys for real?" moment. The fix isn't picking the prettier design; it's picking *one* and stamping it everywhere it appears.

---

### 2026-04-25 — Phase 2: site-wide alignment with the Summer 2026 cohort

**What.** Followed Phase 1's pricing surgery with a sweep across every other page that still implied an ongoing relationship. Five files touched.

- **[`src/pages/Contact.jsx`](src/pages/Contact.jsx).** FAQ rewritten. The "How does the free tech audit work?" question was renamed to "How does the free consultation work?" since the audit is now $250 paid. A new FAQ inserted second-from-top: "How does the Summer 2026 cohort work?" — answers the model question (May 7 – Aug 10, three founders, ten clients, last start July 13, founder on call through Aug 31). The "What happens after my project is done?" answer dropped the "monthly retainer / ongoing support" language and replaced it with the on-call-through-Aug-31 message. The "Why are your prices so much lower?" answer now names the founding-cohort rate as deliberately half what's charged after Summer 2026.
- **[`src/services-data.js`](src/services-data.js).** Every `price` field aligned to the new offer: AI integration → "Included in the Summer 2026 Website + AI Bundle: $2,000 founding rate (standard $4,000)"; Websites → "Bundled with the Summer 2026 Website + AI offer: $2,000 founding rate (standard $4,000)"; Process Modernization → "$250 flat. This is the Discovery engagement of the Summer 2026 cohort, also included as Phase I of the $2,000 Website + AI Bundle." Websites `longDesc` and `included` list dropped "Two weeks of post-launch support" in favor of "Founder on call for fixes through August 31, 2026."
- **[`src/Layout.jsx`](src/Layout.jsx).** Three `ROUTE_META` descriptions updated. `/` now names the cohort cap and last-start date so search snippets and link-preview cards carry the framing. `/process` swapped "free tech audit" for "free consultation" (the audit is paid). `/contact` swapped its description to "Reserve a Summer 2026 founding-cohort spot."
- **[`index.html`](index.html).** JSON-LD `priceRange` updated from "$150 - $1800" to "$250 - $2000" so the Knowledge Panel doesn't advertise a price floor we no longer offer.
- **[`src/pages/Home.jsx`](src/pages/Home.jsx).** Hero masthead reworked from `— NO. 01 ◆ CHARLOTTE EDITION ◆ SPRING MMXXVI —` to `— FOUNDING COHORT ◆ CHARLOTTE EDITION ◆ SUMMER MMXXVI —`. Same three-chunk editorial pattern; "FOUNDING COHORT" carries the magazine-issue conceit "NO. 01" was carrying. New scarcity strip below the hero CTAs: hairline rule + `TEN SPOTS ◆ LAST PROJECT START` + italic Playfair `July 13` + hairline. Fades in at 1000ms (one tick after the CTAs at 800ms) so it lands as the hero settles.

**Why.** Phase 1 fixed the pricing page itself, but the rest of the site still talked like an ongoing service business — a buyer who skipped /pricing or arrived directly via a /services/* URL would have read the old "monthly retainer" promise on Contact, the "Two weeks of post-launch support" line in the websites service, and the "free tech audit" framing in route metadata. Three different surfaces, three different versions of the offer. The Hormozi audit's offer-clarity criterion (one URL = one intent) extends to the whole site, not just /pricing — every page has to render the same offer, in the same words, or trust starts leaking.

The Home hero update is the other half of "surface the cohort cap above the fold." The cohort masthead alone signals to a careful reader; the new scarcity strip signals to a skimmer. Together they make the time-bounded nature of the offer impossible to miss without reading the page in detail.

**Voice notes.** New Contact FAQ #2 ("How does the Summer 2026 cohort work?") drafted as concrete operator prose — dates, headcount, cap, deadline, the after-Aug-31 on-call window. No "X, not Y" cadence, no AI vocabulary. The "comprehensive handoff documentation" phrasing in the old FAQ #3 was dropped — `comprehensive` is on the humanizer's AI vocabulary list and was the only such word remaining in the FAQ body. Home masthead change keeps the established three-segment editorial pattern (label ◆ locality ◆ season) — only the first and third segments changed. The scarcity strip uses Roman/Arabic numerals consistent with the rest of the site: "TEN SPOTS" stays in editorial small-caps Inter, "July 13" in italic Playfair (matching the closing footnote treatment on /pricing).

**Verification.** `npm run build` clean (exit 0, 11 routes prerendered). Site-wide grep against `dist/` for `monthly retainer | 2 weeks of post-launch | two weeks of post-launch | cancel anytime | free tech audit` = 0 matches. Contact FAQ structure verified live in dev preview — seven questions, the new cohort question second, the rewritten on-call answer in slot four. /services/websites verified clean — `Two weeks of post-launch` / `2 weeks of post-launch` / `monthly retainer` all absent, `Founder on call` / `Aug 31` / `founding rate` / `$2,000` / `$4,000` all present.

**Principle reinforced.** *One URL = one intent applies across the whole site, not just the page.* The /pricing surgery in Phase 1 was a concentrated edit; the offer it described still leaked through every other page where the old retainer model lived in copy. A site of N pages communicates the offer N times — every contradiction is a small trust withdrawal. Pricing changes have to be swept, not patched.

---

### 2026-04-25 — Reframed /pricing as a Summer 2026 founding cohort

**What.** Eliminated the Monthly Retainer tier. Single-priced everything. Surfaced the money-back guarantee. Reframed the page around a "Founding Cohort · Ten Spots · Summer MMXXVI" cap. Two cards remain: Discovery at a flat **$250** (was $150–$250 range), and Website + AI Bundle at a **$2,000 founding rate with $4,000 anchor** (was $1,000–$1,800 range). Bundle gets editorial anchor pricing — italic Playfair struck-through `$4,000` above gradient-fill italic Playfair `$2,000`, with `FOUNDING RATE · 10 SPOTS` eyebrow underneath. Old "2 weeks post-launch support" feature replaced with "Founder on call for fixes through August 31, 2026" — the team disbands at handoff but one founder stays reachable for fixes through end of August. Closing footnote in italic Playfair below the cards: *"Last project start: July 13. We deliver to handoff, then the season closes."* Editorial masthead at the top mirrors Home/Team mastheads: `— FOUNDING COHORT ◆ TEN SPOTS ◆ SUMMER MMXXVI —`. Risk-reversal pull-quote (oversized italic Playfair `§` glyph + hairline rules) sits between the section header and the cards: *"You sign the scope. We deliver. If we missed the mark by handoff, every dollar comes back inside a week."*

**Why.** TSD operates as a summer-only business — May 7 to August 10, 2026 — confirmed today (2026-04-25). The retainer model can't survive a 14-week operating window: there's no "ongoing" relationship to retain. Bundle pricing has to absorb full project value rather than relying on retainer LTV stacking on top, so the bundle climbed from a $1,400 mid-range to a $2,000 founding rate (with the $4,000 standard anchor doing the persuasion work). The cohort cap is honest scarcity — three founders × ~30 hrs/project × ~9 weeks of demand window = realistic max 6–10 projects, so naming "Ten Spots" is accurate, not invented. Surfacing the wind-down explicitly (cohort masthead, last-project-start footnote, on-call-through-Aug-31 feature) avoids the trust risk of a buyer signing in late July expecting an ongoing relationship that won't exist.

This is Phase 1 of a Hormozi-style pre-launch audit run on the business today (operator-mode read with section 9 replaced by "The First Move"). The audit named the constraint as a **lead problem** (no booked discovery audits, no proven channel) with **pricing** as the secondary constraint. Phase 1 fixes pricing because it's a 30-minute job that compounds from deal #1; the lead problem is a 100-outreach motion with a separate timeline. Phase 2 (sweeping other pages for retainer/ongoing/monthly mentions, surfacing the cohort frame on the homepage, JSON-LD opening hours) and Phase 3 (offer sharpening, named-vertical dream outcome, AI-receptionist wedge) are queued.

**Files touched.**
- [`src/pages/Pricing.jsx`](src/pages/Pricing.jsx) — full rewrite. New `CohortMasthead`, `GuaranteeBlock`, `TierCard`, `ClosingNote` sub-components. `TIERS` array dropped from 3 to 2 entries. Asymmetric grid (`1fr 1.3fr`, collapses to single column at 820px) replaces the symmetric `repeat(auto-fit, minmax(300px, 1fr))`. The `TierCard` `tier.anchor` field branches into the strike-through-above-prominent-gradient pattern; without it, the card renders the simple single-number price block.
- [`src/Layout.jsx`](src/Layout.jsx) — `ROUTE_META["/pricing"]` updated. New title "Pricing — Founding Cohort, Summer 2026"; description names the cap, the $2,000 founding rate, the $4,000 anchor, and the July 13 last-start so link-preview bots and search snippets carry the cohort framing.

**Voice notes.** Drafted copy reviewed by the `the-humanizer` skill before shipping. Two AI tells caught and rewritten: imperative-trio cadence in the sub-headline (*"Read the box, sign the scope, get the work."*) and the guarantee opening (*"Read the proposal, sign the scope, work with us through handoff."*), plus a triple-negation closer in the guarantee body (*"No paperwork. No panel. No fight."*). Final guarantee body: *"You sign the scope. We deliver. If we missed the mark by handoff, every dollar comes back inside a week."* The humanizer skill itself was updated with a new pattern entry — "imperative trio cadence" — as the existing structural-marker rules only covered the contrastive three-part-parallel variant. One load-bearing inline-prose em-dash replaced with a comma in the closing footnote ("We deliver to handoff, then the season closes."). The site's existing em-dashes are bracketing flourishes around the masthead phrases (`— X ◆ Y ◆ Z —`); inline prose em-dashes are the AI tell.

**Verification.** `npm run build` clean (1.06s client, 189ms SSR, 11 routes prerendered, exit 0). Site-wide `grep -i "retainer\|monthly retainer"` against `dist/` = 0 matches. Visual check on dev server at 900px confirmed asymmetric grid + anchor-pricing render. Mobile stack at 820px verified. The prerendered `dist/pricing/index.html` contains the new masthead, `Risk Reversal`, `$2,000`, `$4,000`, `July 13`, `Phase II`, and `founding rate` strings — every editorial moment is in the static HTML for non-JS link-preview bots.

**Principle reinforced.** *Pricing is the cheapest lever to move.* The pricing surgery on `/pricing` was a 30-minute edit. The same revenue lift captured via outreach would take three founders 100+ hours of cold calls. Time-bounded businesses can't afford the slow lever — when the operating window is 14 weeks, every fix gets evaluated against "does this raise revenue per closed deal" first, "does this generate new deals" second.

---

### 2026-04-23 — Editorial overhaul of Home, Team, and Testimonials

**What.** Refined-evolution pass on the three pages carrying the most conversion weight. Same brand system (Playfair Display + Inter, Carolina/cream, diamond motifs) — just tighter compositions and more editorial personality. No new colors, no new fonts, no new components outside these three pages.

**Scope.**

1. **[Home.jsx](src/pages/Home.jsx).**
   - **Hero.** Added a masthead marker above the headline: `— NO. 01 ◆ CHARLOTTE EDITION ◆ SPRING MMXXVI —` with hairline rules on either side. Softened the text treatment — dropped the 4-way outline shadow that gave the H1 a poster look and replaced it with a tighter, stronger radial vignette (`70% 60% at 50% 48%`, peak 0.62 opacity) so the readable darkening lives in the backdrop rather than the letterforms. The masthead replaces the older "Small Business Modernization Specialists" eyebrow.
   - **ServiceTicker (new).** Slow horizontal marquee between the hero and stats — service names in italic Playfair, separated by diamond glyphs, 55s loop, honors `prefers-reduced-motion`. Doubles as an editorial rhythm break and as a keyword strip for anyone skimming.
   - **Stats → asymmetric "By the Numbers".** Replaced the 4-up symmetric grid with a 1.4 / 1 split: a hero stat on the left (`48 hrs` set in oversized italic Playfair with the gradient-accent text fill, "The Differentiator" label, supporting copy) and three smaller stacked stats on the right (50,000+ / < 30% / 100%, each with a Playfair-italic pull-quote line — "*The audience we serve.*", "*The gap we close.*", "*The promise we stand behind.*"). Collapses to single column below 760px.
   - **FoundersStrip → The Masthead.** Replaced the three-identical-circles with editorial portrait cards (4:5 aspect, "FOUNDER NO. 01/02/03" chips, nameplate with Playfair italic over a gradient scrim), followed by a pull-quote strip framed by hairlines with an oversized Playfair quote mark. School name is a small caps eyebrow above each bio.
   - **WhyWeDo → The Thesis.** Gave each of the three "why" cards a distinct header variant — (01) oversized italic numeral, (02) a triple-diamond glyph run, (03) an oversized quote mark — so the row doesn't read as a carbon-copy grid. Headline moved out of `SectionHeader` into a custom two-line editorial block.
   - **Section markers.** Each non-hero section now gets the same three-part header treatment: `◆ LABEL` / horizontal rule / `§ 0N` — so the page reads like a sequence of editorial chapters rather than a stack of cards.

2. **[Team.jsx](src/pages/Team.jsx).**
   - Rewrote from three-identical-circle cards to alternating magazine-style spreads. Each founder gets: a 4:5 portrait with a translucent "FOUNDER NO. 0X" chip, a Playfair-italic name set large, a pull-quote in an accent-bordered block, a bio paragraph, a "WHAT THEY SHIP" bulleted list with diamond markers, and a "View business card" button that opens the existing modal (kept as-is).
   - New page-level headline: "Three friends from the *Carolina piedmont.*" (italic Playfair accent on the place name).
   - Portraits alternate left/right on desktop; collapse to a single column below 820px.

3. **[Testimonials.jsx](src/pages/Testimonials.jsx) → The Ledger.**
   - Killed the "coming soon" shell. Reframed the page as a live-methodology spec: **I / II / III** — *What we measure · How we report · What you'll see* — each column with an icon, Roman numeral, headline, body, and a sample-format line set in italic Playfair.
   - Added a "Provisional Entries" row — three dashed-border cards labeled `No. 01 / 02 / 03` with "Awaiting first ship" italics and an "Open slot" pill. Shows the template filled with placeholders so visitors can see what a real entry will look like.
   - CTA block at the bottom keeps the existing prism-gradient treatment and "Claim a founding slot" button.
   - Uses the same masthead pattern as Home and Team for visual continuity.

**Why.** Audit items §5 (Trust & social proof) and §7 (Content & messaging). The three target pages were the weakest surfaces of an otherwise solid site:

- **Home** had a cohesive but quiet design — identical-width cards in every section meant the page read as one undifferentiated scroll with no hierarchy. Adding the masthead, ticker, and asymmetric stats introduces rhythm and a single strong focal point per section.
- **Team** undersold three founders by reducing them to matching 96px avatars. Portrait-first editorial layout gives each person proper real estate and a distinct voice via the pull-quotes.
- **Testimonials** admitted a gap without filling it. A "coming soon" page trains visitors to expect absence; a methodology page trains them to expect rigor. Shipping the *format* of a case study before any client testimonial exists signals the discipline the page will eventually document.

**Voice notes.**
- Preserved the "Avoid 'X, not Y'" rule throughout. All new copy reviewed — no contrastive symmetric phrasing.
- Kept every concrete fact (48 hours, 50,000+, <30%, 100%) intact; only the framing changed.

**Design notes — what was intentionally kept.**
- Brand palette untouched. No new hex values introduced.
- Font stack untouched (Playfair Display + Inter). Playfair gets more surface area in the new layouts, but it's the existing font.
- Diamond motif (`◆`) elevated to a system-level signifier — appears as bullet, section delimiter, decorative background element, and ticker separator.
- Card component, RippleButton, DiamondDivider all kept and reused.
- Hero video, theme toggle, nav, footer — all unchanged. The overhaul stops at the page content.

**A small bug caught during verification.** Unicode escapes (`\u2014`) written directly into JSX text content render literally because JSX text isn't a JS string. Fixed by wrapping in a JSX expression (`{"\u2014"}`). Worth remembering: JS string escapes only work inside JS strings, not inside JSX text.

**Files touched.**
- `src/pages/Home.jsx` — full section-by-section rewrite (Hero cleanup, new `ServiceTicker`, new `Stats` + `SupportStat`, new `FoundersStrip` + `FounderPortrait`, new `WhyWeDo` + `WhyCard`). Import list unchanged — every component still uses existing shared primitives.
- `src/pages/Team.jsx` — complete rewrite. `BusinessCard` and `CardModal` components preserved verbatim; the page wrapper and card grid replaced with `FounderSpread`.
- `src/pages/Testimonials.jsx` — complete rewrite. Three `LedgerColumn`s + provisional-entries row + CTA block.

**Principle reinforced.** *Refined evolution beats aesthetic resets for a brand that's already working.* A service business targeting main-street Charlotte owners trades trust before novelty — a radical visual reset risks the signal the current design already earns. The right move was structural: keep every choice that's carrying weight (type, palette, motif, motion), and raise the production value of the composition. Every page now earns its scroll with its own rhythm rather than being a cascade of similarly-weighted cards.

---

### 2026-04-23 — Local SEO: schema enrichment + visible NAP

**What.** Two-pronged pass at audit §8. Enriched the `ProfessionalService` JSON-LD with `geo` coordinates and an `openingHoursSpecification`. Added a three-card NAP strip (Call, Hours, Service area) above the contact form, and surfaced phone + hours in the footer so they ride along with every page.

**Why.** Local SEO is its own discipline — the local pack ranks on signals general organic doesn't care about: proximity, hours coverage, and citation consistency across directories. `geo` lets Google score how close a searcher is to the business's service centroid. `openingHoursSpecification` powers the "Open now" filter and populates Knowledge Panel hours. A visible NAP on every rendered page is the cheapest form of citation reinforcement — crawlers cross-check it against GBP, BBB, Yelp, and so on; consistent matches compound trust.

**Context — service-area business.** TSD operates as a service-area business on Google Business Profile (no public street address). Schema keeps `addressLocality: Charlotte, NC` without a street, which is the right pattern for SABs. `geo` set to downtown Charlotte (35.2271, -80.8431) as the service-area centroid so proximity scoring still works. Map embed intentionally skipped — with no storefront, a map adds visual weight for no real signal.

**Changes.**
- **[index.html](index.html).** Added `geo.GeoCoordinates` and `openingHoursSpecification` (Mon–Sun 08:00–20:00) to the LocalBusiness block.
- **[src/pages/Contact.jsx](src/pages/Contact.jsx).** New `ContactInfo` component above the form: three cards (Call → `tel:` link, Hours, Service area). Matches the page's existing `v()` theme vars, `useFadeIn` hook, and surface card styling. Grid collapses to a single column below ~560px.
- **[src/Layout.jsx](src/Layout.jsx).** Footer gained a line with the phone (as a `tel:` link) and hours between the service-area copy and the copyright.

**Deferred.**
- `sameAs` (GBP URL, socials, BBB, Yelp) — pending GBP verification and profile creation. Once the GBP listing goes live, add its share URL plus any real social profiles to the schema.
- Location-specific landing pages (`/charlotte`, `/gastonia`, `/belmont`) — separate content job.
- Off-site: GBP verification, directory listings, reviews flow — Nash's side, no code.

**Principle reinforced.** *Local SEO runs on citation consistency.* Google trusts a business when the same NAP, hours, and service areas appear identically across the rendered HTML, the structured data, and every external directory. Every mismatch costs a small amount of trust; every match compounds.

---

### 2026-04-23 — Prerendered every route with vite-react-ssg

**What.** Switched the build from plain `vite build` (single HTML shell, SPA hydrates the rest) to `vite-react-ssg build`. All 11 routes now ship as their own static HTML files with per-route `<title>`, `<meta name="description">`, `<link rel="canonical">`, and OG/Twitter tags baked into the shell. Dev stays on plain `vite` for fast CSR iteration.

**Why.** Closes the other half of audit §1. The old `applyRouteMeta()` DOM-mutation approach worked for Google (which runs JS on a second pass) but failed for every scraper that doesn't execute JavaScript — LinkedIn, iMessage, Slack, Facebook, Bing. They saw the same `index.html` shell for every URL. Prerendering emits correct first-byte HTML for every route so the right preview shows up wherever a link gets shared.

**Dependency shift.** vite-react-ssg supports `react-router-dom@^6`, so downgraded `react-router-dom` from `7.14.0` to `6.30.3`. All router APIs in use (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `Link`, `useLocation`, `Navigate`) are identical between v6 and v7, so zero call-site changes were needed.

**Structural changes.**
- **`src/routes.jsx`** (new). Data-router route array in vite-react-ssg's format. `getStaticPaths` on `services/:slug` enumerates the three service slugs so SSG knows to render `/services/ai-integration`, `/services/websites`, and `/services/process-modernization` at build time.
- **`src/main.jsx`**. Replaced `ReactDOM.createRoot(…).render(…)` with `ViteReactSSG({ routes }, ({ isClient }) => { if (isClient) initAnalytics() })`. Analytics only initialize on the client; the Node SSG pass never loads GA4/Plausible/Clarity scripts.
- **`src/App.jsx`** — deleted. Its global `<style>` block and `<Analytics />` moved into `Layout.jsx`. The router is now constructed internally by ViteReactSSG, so App.jsx had nothing left to hold.
- **`src/Layout.jsx`**. The old `applyRouteMeta(pathname)` function that mutated `document.title` and individual `<meta>` elements is replaced by a `<RouteMeta>` component that renders a `<Head>` from vite-react-ssg (a thin wrapper over react-helmet-async). `useLocation()` picks the right entry from `ROUTE_META` at render time — so the correct tags end up in the emitted HTML shell at build, and continue to update on client-side navigation after hydration.
- **`src/analytics.js`**. `trackPageView(path, title)` now takes the title explicitly. Without this, it read `document.title` inside a useEffect, which raced react-helmet-async's head update on route change — the first GA4 pageview after navigation would occasionally log the previous route's title.
- **`index.html`**. Removed the per-route-varying `<title>`, `<meta name="description">`, `<link rel="canonical">`, og:title/description/url, and twitter:title/description. They were duplicating the Helmet-injected ones in the built HTML. Kept favicons, og:image/type/site_name, twitter:card/image, JSON-LD structured data, and the pre-paint theme script (all shared across routes).
- **`vite.config.js`**. Added `ssgOptions: { script: 'async', dirStyle: 'nested', formatting: 'none' }`. `dirStyle: 'nested'` emits `/services/index.html` rather than `/services.html` so Vercel's default static-file resolution picks them up.
- **`package.json`**. `"build": "vite-react-ssg build"`.
- **`vercel.json`** unchanged. The existing `{ source: "/(.*)", destination: "/index.html" }` rewrite runs "after filesystem" by default — static files are served first, rewrite only fires for URLs with no matching file. That's the SPA fallback for typos while prerendered routes get served directly.

**Build output.**
```
dist/index.html                                  Home
dist/services/index.html                         Services overview
dist/services/ai-integration/index.html          (from getStaticPaths)
dist/services/websites/index.html                (from getStaticPaths)
dist/services/process-modernization/index.html   (from getStaticPaths)
dist/why-us/index.html
dist/process/index.html
dist/pricing/index.html
dist/testimonials/index.html
dist/team/index.html
dist/contact/index.html
```

Verified by grep against the built HTML: every route has its correct title, description, canonical, og:*, and twitter:* baked in. Dev preview confirmed client-side navigation updates the same tags via Helmet (tested by pushing `/services/ai-integration` and observing `document.title`, canonical, and og:url all update).

**Incidental fix.** The footer nav in `Layout.jsx` was spreading `NAV_ITEMS` and then appending another `{ label: "Contact", to: "/contact" }`. Both entries produced `<Link key="/contact">`, which logged a React duplicate-key warning on every render. Removed the extra entry.

**Principle reinforced.** *Static HTML is the universal interface.* Search crawlers, link-preview bots, screen readers, slow devices, JS-disabled browsers — they all render it. Client-side rendering layered on top is an optimization. The audit surfaced this gap in January; splitting `/services` in April unlocked per-URL topical focus; today's change makes that focus visible to every consumer of the HTML, including the ones that never run a line of JavaScript.

---

### 2026-04-22 — Wired accessibility baseline

**What.** Closed most of audit §6: added form labels, a keyboard focus ring, a skip link, and a `<main>` landmark. No visual design changes — every improvement is either invisible to sighted users or only appears on keyboard focus.

**Why.** Accessibility is table stakes (ADA in the US, EU Accessibility Act in Europe), an SEO signal (Google rewards semantic HTML), and around 15% of users have a disability of some kind. The audit called out four specific gaps; three are fixed here (the fourth — `prefers-color-scheme` theme default — was deferred as a UX preference rather than an a11y one).

**Changes.**
- **Contact form labels** (audit item 1). Every `<input>` and `<textarea>` now has a `<label htmlFor="...">` via unique ids (`contact-name`, `contact-email`, `contact-business`, `contact-message`). Labels use a new `.sr-only` utility class (absolute 1×1 px clipped box) so screen readers announce them but sighted users see no visual change — placeholders still read as labels. Added `autoComplete` attributes (`name` / `email` / `organization`) so browsers can autofill and reduce typing friction.
- **Form error alert.** The submission-error div is now `role="alert"`, which gives it implicit `aria-live="assertive"` behavior so screen readers interrupt to announce it when it appears.
- **Focus-visible ring** (audit item 3). Global rule: `a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 2px solid var(--c-accent); outline-offset: 2px; }`. Modern browsers only apply `:focus-visible` on keyboard-initiated focus (Tab, Shift+Tab), so mouse users never see it and keyboard users always do. Removed the `outline: "none"` override that had been suppressing focus indicators on the Contact form inputs.
- **Skip link.** First focusable element on the page: `<a href="#main" className="skip-link">Skip to main content</a>`. Off-screen by default (`transform: translateY(-120%)`), slides in via the accent color when it receives focus. Pairs with a new `<main id="main" tabIndex={-1}>` so activating the skip link moves focus programmatically into the main content. `scroll-margin-top: 100px` on `main` ensures the scroll target lands below the fixed nav instead of behind it.

**Files touched.** `src/App.jsx` (added sr-only, skip-link, and :focus-visible CSS rules), `src/Layout.jsx` (skip link above `<nav>`, `id="main"` + `tabIndex={-1}` on `<main>`), `src/pages/Contact.jsx` (labels + ids + autoComplete + role=alert, plus removing the `outline: "none"` override).

**Design decision — sr-only labels vs visible ones.** Two ways to label form fields: visible labels above each input (traditional, more accessible, changes the visual design) or visually-hidden labels paired with placeholders (same a11y benefit, no visual change). Chose the second because (a) the placeholders already carry the labels for sighted users, (b) moving to visible labels is a design choice separate from a11y and shouldn't be bundled into an a11y pass, (c) Nash can opt into visible labels later without undoing any of this work.

**Verification note.** `:focus` and `:focus-visible` don't trigger in the dev preview frame because it doesn't hold document focus (`document.hasFocus()` returns false). Confirmed the CSS rules are parsed correctly by inspecting `document.styleSheets` directly, and confirmed the skip link renders correctly by forcing the visible state inline. In a real browser window with keyboard focus, all three patterns work.

**Principle reinforced.** *Accessibility and visual design aren't in conflict.* The common objection to a11y work is that it forces ugly defaults — giant focus rings, visible form labels cluttering minimal designs. In 2026, the modern CSS primitives (`:focus-visible`, `.sr-only`, `scroll-margin-top`) let you deliver the a11y contract without changing what non-disabled users see. If a team thinks a11y means compromising design, they're using the 2010 toolkit.

---

### 2026-04-22 — Split /services into three per-service routes

**What.** Replaced the single modal-driven `/services` page with three indexable routes:

- `/services/ai-integration`
- `/services/websites`
- `/services/process-modernization`

Along the way: extracted the service data into its own module, rewrote the overview page as a pure link grid, and added per-route meta + sitemap entries.

**Why.** Fixes the remaining half of audit §1. One URL was trying to rank for three buyer intents (AI consulting, website design, process modernization). Google can rank a URL for one topic well or several topics mediocrely — not all several topics well at once. Three URLs with focused content, focused titles, focused descriptions let each page win its own intent.

**Structural moves.**
- `src/services-data.js` (new) — `SERVICES` array keyed by `slug`, plus a `getServiceBySlug(slug)` helper. Single source of truth for both the overview and the detail pages, so copy changes don't have to be made twice.
- `src/pages/ServiceDetail.jsx` (new) — rendered at `/services/:slug` via a React Router dynamic segment. Unknown slugs `<Navigate>` to `/services`.
- `src/pages/Services.jsx` — rewrote from 354 lines to ~32. Cards became `<Link>`s to the deep pages; the modal, `ServiceModalContent`, `VideoCard`, `GallerySlideshow`, and `TabBar` moved to `ServiceDetail.jsx`. In the process, the old modal's Overview / Videos / Gallery tabs became stacked full-page sections — tab-hidden content ranks weaker because Google downweights content that isn't visible on initial render.
- `src/App.jsx` — one new `<Route path="services/:slug" element={<ServiceDetail />} />`.
- `src/Layout.jsx` — three new `ROUTE_META` entries with keyword-targeted titles (e.g. `"Custom Website Design & Redesign | Charlotte Small Business Web Developer"`). The existing `applyRouteMeta` already does exact-pathname lookup, so dynamic routes work as long as each final pathname has its own entry.
- `public/sitemap.xml` — three new `<url>` entries at priority 0.8.

**What this SEO work is and isn't yet.** Google's second-pass JS renderer will eventually index the three new URLs and pick up their per-route titles and descriptions. Link-preview scrapers (LinkedIn, Facebook, iMessage, Slack) mostly don't run JS — they'll still see the static `index.html` shell on every URL until the site is prerendered. So today's change unlocks **search results** for the three focused terms; **social previews** remain generic until prerendering lands. The two lifts are complementary; this one had to come first because prerendering only helps if per-route content already exists.

**Principle reinforced.** *One URL = one intent.* The SEO penalty for stacking buyer intents on a single URL isn't additive — it's multiplicative in reverse. A page trying to rank for three keywords doesn't rank 1/3 as well for each; it ranks substantially worse for all three, because topical focus is one of the strongest ranking signals. Whenever a buyer's journey branches (they search for one of several distinct things you offer), the site's URL structure should branch at the same point.

---

### 2026-04-22 — Rewrote hero copy for specificity and surfaced the 48-hour claim

**What.** Replaced the poetic H1 ("The world moved forward. Your business can too.") with a services-specific one: "AI integration, custom websites, and workflow automation. *Shipped in days.*" Preserved the two-phrase display-italic structure that was already a signature element of the hero. Swapped the subhead from a services restatement to two risk-reversal signals: "48-hour proposals and a 100% money-back guarantee for Charlotte-area small businesses. Real results at a fraction of agency prices." Widened and strengthened the readability gradient behind the text since the longer copy spans a taller block.

**Why.** Audit §7 called the old H1 poetic but ambiguous — a visitor from Google has under five seconds to decide if you fit their need. "The world moved forward" doesn't survive that test on its own. The new H1 says *what* you do, and the italic second phrase carries the *differentiator* (speed). The subhead moves the 48-hour claim out of the stats strip and above the fold, where it does conversion work instead of decoration work.

**Voice note — avoid the "X, not Y" pattern.** First attempt was "Shipped in days, not months." User flagged the contrastive "this not that" construction as an AI writing tell and asked to cut it to "Shipped in days." — which reads cleaner and less formulaic. Saved as a global style rule: avoid symmetric "X, not Y" phrasing in copy, comments, and log entries, since the pattern is a common LLM signature even when the content is accurate.

**Files touched.** `src/pages/Home.jsx` only. Three edits: H1 text + added `<br />` before the italic span so the two-phrase rhythm survives the longer main phrase; subhead text; radial gradient widened from `70% 45% at 50% 32%` to `90% 80% at 50% 50%` at higher opacity, with a stronger subhead textShadow to match.

**Principle reinforced.** *Clarity beats cleverness at the top of the funnel.* Poetry works once a visitor is already in your world. At the front door, they need to know what you sell and why you're worth another thirty seconds of their time — in that order, in that span.

---

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
2. Prerender the build so per-route meta reaches link-preview bots — the `/services` split shipped on 2026-04-22; prerendering is the remaining half of the SEO lift.
3. Claim and link Google Business Profile; embed Map on Contact page.
4. Add README with dev setup and deploy steps.
