# Audit Offer Playbook — Internal Sales Use Only

Internal-use only. Not deployed. Lives at repo root alongside `BUSINESS_PLAN.md`, `PROJECT_LOG.md`, and `GUARANTEE_VERIFICATION.md`.

The $1,500 Discovery audit was pulled from public `/pricing` tier cards on 2026-05-02 (Path B2 of the Hormozi-style audit) so that the public pricing page commits to two clean tiers — the Website + AI Build (formerly "Phase II Bundle") and the Full Modernization (formerly "Founding Partnership") — without a third option that fragments the build conversation. The audit still exists as a deliverable, and this doc explains when to offer it and how to position it.

---

## When to offer the audit

Default: **don't offer it unprompted.** If a prospect is qualifying for the Build or the Full Modernization, the audit is downstream of that conversation, not parallel to it. Mentioning it preemptively gives a hesitant buyer a cheaper escape hatch from the higher-quality conversation.

Offer the audit only when one of the following triggers fires in a fit call:

1. **The prospect explicitly asks** — "Do you do paid discovery first?" or "Can we just start with a scoping engagement?" Answer: yes, $1,500, here's what's in it. Don't try to redirect them up to the Build if they've actively asked for the smaller engagement.

2. **The prospect signals "not ready for a full build."** Phrases like "we're not sure we want to build the whole thing yet," "we need to see what we're getting into first," or "I want a roadmap before I commit." That's the audit's natural job — paid scope-and-recommend before a full-build commitment.

3. **The prospect is qualified for the Full Modernization but pushing back on the $10,000 commit.** Two paths: (a) walk them down to the Website + AI Build ($5,000), or (b) offer the audit as a smaller paid engagement that proves the relationship before the larger commitment. Path (b) is right when the prospect specifically wants documented strategic deliverables before scoping a build.

4. **The prospect explicitly says they want a "second opinion" or "outside perspective"** on their tech stack or operations. Audit fits that ask exactly.

**When NOT to offer:**
- A qualified buyer who's a clear Build fit and is just kicking tires on price. Don't undersell them.
- A buyer who hasn't yet articulated what they want fixed. Audit is for buyers who know enough to want a roadmap; for everyone else, the fit call IS the discovery.
- Buyers who are price-shopping multiple agencies. The audit competes against agency proposals, not against TSD's own Build offer. Path them up to the Build or the Full Modernization instead.

---

## How to position it on the call

If a prospect signals one of the triggers above, here's the script-style framing:

> "We do offer a paid discovery audit on a case-by-case basis — $1,500 for a 2-3 hour structured walkthrough of your operations, plus a written modernization roadmap with prioritized recommendations and ROI estimates per item, delivered within 48 hours. You leave with a documented plan whether or not you continue with us. Money-back if we can't find at least $25,000 of opportunities. If you do continue with the Website + AI Build within 30 days, we credit the $1,500 toward the Build [clarify with Bishop — this credit policy is a TBD decision below]."

Clarify what's in scope:
- 2-3 hour structured tech audit (in-person preferred, remote works)
- Written modernization roadmap (PDF, ~5-10 pages)
- Tool & platform recommendations with cost estimates
- Priority sequence with estimated ROI per item
- No obligation to continue; no upsell pressure during delivery

Clarify what's NOT in scope:
- No implementation. The audit is scope-and-recommend only.
- No code, no design mockups, no AI integration setup.
- No ongoing support after the 48-hour delivery (unless they continue into a Build or Full Modernization engagement).

---

## Open decision: should the $1,500 credit toward the Build?

**Currently undecided.** Two options:

- **Option 1 — Audit credits toward the Build.** Buyer pays $1,500, then if they continue within 30 days, the Build becomes $3,500 ($5,000 - $1,500). Cleaner from a "no double-charge" perspective; matches the wedge-credit pattern. But stacks two credits awkwardly: a buyer who bought both the wedge ($497) AND the audit ($1,500) would expect $1,000 wedge credit + $1,500 audit credit on the Build, which would drop the Build to $2,500 — that's deep into "what's the catch" territory.
- **Option 2 — Audit doesn't credit; it's a standalone engagement.** Buyer pays $1,500 for the audit (deliverable: roadmap), then full $5,000 if they continue to the Build. Cleaner pricing math. The audit's value is the roadmap, not a Build discount.

**Recommendation while undecided:** Option 2 (no credit). The audit's job is to deliver strategic value at a small price; if the buyer wants a discount on the Build, the wedge-first path already does that. Don't muddy two credit mechanics.

Bishop / Grant: when you offer the audit on a call, default to Option 2 unless Nash has updated this doc with a different decision.

---

## Mechanics

- **Quoted on:** the fit call only, after one of the triggers above fires. Don't quote the audit price preemptively in cold outreach or in chat-agent conversations unless the buyer asks.
- **Booked through:** Bishop sends a separate proposal + invoice for the audit (Stripe or whatever the cohort billing flow is). Don't try to book it through the Calendly path that's set up for Build / Full Modernization applications.
- **Delivered by:** Nash leads the audit session; Bishop drafts the written roadmap from Nash's notes. Targeting <48 hours from session to roadmap delivery.
- **Tracked in:** the project tracker. Tag the customer as `audit-only` until they convert (if they do); the tag distinguishes audit revenue from Build / Full Modernization revenue in the §12 financial-model rollup.

---

## Why we pulled it from public `/pricing`

For continuity — full reasoning lives in `PROJECT_LOG.md` 2026-05-02 entry on the Full Modernization restructure (then named "Founding Partnership"). Short version:

The audit at $1,500 sitting on `/pricing` as a third tier card next to the Build ($5,000) and the Full Modernization ($10,000) gave hesitant buyers a cheaper escape hatch from the build conversation. For prospects who are a clear Build fit but are flinching on price, the audit is a worse outcome than walking them through their objections — because the audit is a one-time engagement that doesn't build, while the Build is the actual outcome they wanted. Pulling the audit off the public page commits the funnel to "Build-or-walk-away" for the default buyer, while preserving the audit as a sales tool for the buyers it actually fits (the four triggers above).

This is a Hormozi-style move — concentrate the public offer on the strongest options; preserve weaker options as in-conversation fallbacks for buyers whose situation calls for them.

---

## Cross-references

- Plan section: `BUSINESS_PLAN.md` §1 (executive summary now reads "two packaged tiers + a wedge product"), §6 (audit treated as a stepping-stone offer)
- Decision entries: `PROJECT_LOG.md` 2026-05-02 entry on Phase 4 — Full Modernization (then "Founding Partnership") restructure + Phase I audit demote; 2026-05-03 entry on Set C tier renaming pass
- Live page that no longer features the audit: `/pricing` (now 2-column grid)
- Related internal docs: `GUARANTEE_VERIFICATION.md` (Build + Full Modernization guarantees)
