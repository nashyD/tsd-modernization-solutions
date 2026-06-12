# Money-saver overhaul — design

**Date:** 2026-06-12 · **Status:** approved by Nash section-by-section in session, review gates waived ("just make the changes and push them directly to the site") · **Shipped:** same day, see PROJECT_LOG 2026-06-12

## Origin

Three consecutive daily money-moves briefs (06-09 → 06-11) converged on one move: with SMB margins tight, reposition TSD's offers as cost-cutters — "re-frame your AI receptionist the way a CFO hears it… it pays for itself the first month it saves a missed booking. Same product you already have, a different sentence" — and "hand Grant and Bishop a one-page 'what it saves you per month' sheet." Nash: pitch TSD as a money saver, and rebuild the services page around the actual named services instead of vague AI automation.

## Decisions (Nash's calls)

1. **Reframe scope:** money-led pitch, same audience. The hero and key homepage sections lead with dollars/hours saved; the established-specialist wedge and reputation story stay as the supporting layer.
2. **Service lineup:** the four anchors (TSD Front Desk, TSD Concierge, TSD Booking Bridge, Custom Websites) plus two new named services productized from real work — **TSD Cost-Cut Audit** (Cake Me Away teardown) and **TSD Lead Engine** (gallantrenters funnel + dashboard). Estimator/quote-tool stays a feature, the growth bucket folds into an add-ons strip.
3. **Proof:** real numbers, anonymized ($540/mo bakery cut; $73/mo importer assistant) + published conservative CFO math. Named case studies deferred until DJ/Brittany sign-off.
4. **Approach C:** full catalog rebuild + interactive leak calculator + per-service savings one-pagers (chose the max version over catalog-only).
5. **Hero direction C ("find the leak"):** *"We find the money your business is leaking — and build what stops it,"* bakery number in the subhead.
6. Defaults accepted: `/savings` route name; email capture in calculator v1; all six sheets from one template.

## Design

**Messaging system.** Every page leads with what the visitor stops losing, with a number wherever defensible. Five honest numbers site-wide: $540/mo (bakery), $73/mo (importer), 48-hr proposal, 2-click estimate, calculator arithmetic. No invented stats (April-audit principle). Voice rule: no "X, not Y" contrastive constructions.

**Homepage.** Hero C copy; secondary CTA → `/savings`; ticker carries the six service names; stats hero slot = $540/mo count-up ("Found and cut at one local bakery"), support = 48hrs / 24-7 / 100% guarantee; new **"The Math"** section (three leak cards: missed call ≈$1,350/mo, front desk $1,500–2,500/mo, subscription creep $540/mo) with calculator + audit CTAs; thesis beat 2 gains the dollars sentence; closing offer routes fit-call + calculator.

**Services.** Six named services, each its own prerendered route under `/services/<slug>`, ordered Front Desk → Concierge → Booking Bridge → Websites → Lead Engine → Cost-Cut Audit ("Start here" badge). Cards carry an italic saves-line. Detail template opens with a "What this saves you" money table (`savesRows`) + proof + assumptions note, then optional steps/comparison sections (Front Desk inherits the old `/ai-receptionist` page's 3-step flow, 30-day guarantee, and vs-SaaS table), included list, timeline + price (+ risk-reversal box), videos/gallery, pairs-with, CTA. Add-ons strip: reviews, follow-up, local SEO, automations (still estimator line items). Audit offer: flat fee quoted on the fit call, **free if it can't find at least its fee in annual savings** (fee TBD by Nash).

**`/savings` calculator.** Four inputs (missed calls/wk 0–20, avg ticket $50–2,000, software spend $0–1,500/mo, owner hours 0–20/wk). Math: calls×4.33×ticket×25% + spend×25% + hours×4.33×$35. Assumptions printed under the result. Monthly + annual leak, per-leak breakdown, CTAs (fit call, audit, estimator), "email me this breakdown" via Web3Forms, `savings_calc_*` analytics events. Successor to the retired missed-call calculator (301 repointed).

**`/sheets/<slug>` one-pagers.** Print-styled Letter sheet per service, generated from `services-data.js` (math table, sheetLine + proof, included, guarantee, phone + `/savings` URL). White/ink-light regardless of theme; `@media print` isolates the sheet; noindex. For Grant/Bishop iPad pitches + AirPrint leave-behinds.

**Plumbing.** 301s (`ai-integration`→`front-desk`, `process-modernization`→`booking-bridge`, `/ai-receptionist`→`/services/front-desk`, trade pages repointed, `/missed-call-calculator`→`/savings`); ROUTE_META + per-service JSON-LD `Service` nodes; `llms.txt`, `index.html` global schema, and `content/tsd-knowledge.md` (chat agent brain) rewritten to the six-service catalog; estimator gains Lead Engine $2,400–$3,400 placeholder in dollar-lockstep with the app's `estimator.ts`; BUSINESS_PLAN §5/§6/§8.2/§14 synced; PROJECT_LOG entry.

## Out of scope / fast-follows

- Named case studies (pending DJ + Brittany written sign-off) — anonymized until then.
- QR code on the sheets pointing at `/savings`.
- Per-vertical calculator presets (salon vs auto defaults).
- Audit flat fee + Lead Engine estimator range: placeholder figures pending Nash's pricing sign-off.
- `tsd-receptionist` repo keeps a synced copy of `tsd-knowledge.md` read at startup — needs the same update + redeploy for the voice agent.
