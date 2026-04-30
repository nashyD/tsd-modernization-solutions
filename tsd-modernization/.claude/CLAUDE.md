# Claude project instructions — TSD Modernization Solutions

## Keep `BUSINESS_PLAN.md` in sync with the site

The repo contains [`BUSINESS_PLAN.md`](../BUSINESS_PLAN.md) at the same level as `README.md` and `PROJECT_LOG.md`. It is the single-source-of-truth narrative description of the business — pricing, packaging, vertical positioning, founders, operating window, financial model, technology, roadmap. It feeds external conversations (advisors, prospects asking "what do you actually do") and internal continuity across the three founders.

**Whenever you make a change in this repo that affects the business plan's content, update `BUSINESS_PLAN.md` in the same change set.** Stale plan = silently rotting document. Don't leave drift for "later."

### Triggers that require a plan update

If you touch any of the following, the matching plan section needs a corresponding edit:

| Code surface touched | Plan section(s) to update |
|---|---|
| `src/pages/Pricing.jsx`, `src/services-data.js`, JSON-LD `priceRange` in `index.html` | §6 Pricing & Packaging, §12 Financial Model |
| `src/pages/AIReceptionist.jsx`, wedge messaging, the $497 one-time fee, ownership-transfer terms | §5.4, §6 (wedge sub-section), §12 |
| `src/pages/Home.jsx` hero / wedge framing, `src/pages/TradePage.jsx`, `src/pages/RelationshipPage.jsx`, new vertical landing pages | §4 Market & Opportunity (vertical positioning), §8.2 Acquisition channels |
| `src/pages/Book.jsx`, `src/components/BookCallButton.jsx`, Calendly URL (`calendly.com/nashdavis-tsd-ventures/30min`), event config, presence/absence of "Book a fit call" CTAs on conversion pages | §8.2 Acquisition channels (booking row), §11.1 Technology & Infrastructure (booking row) |
| `src/pages/Team.jsx`, founder roles / emails / schools | §3 Founders & Roles |
| Phone number anywhere (`+17043175630` is canonical), JSON-LD `telephone`, contracts contracting party | §2 Company Overview |
| Operating window dates (May 7 / Aug 10 / Aug 31 / July 13), cohort caps | §1, §2, §7, §14 |
| Tech stack additions/removals (analytics, error monitoring, rate limiting, voice carrier, sister repos like `voice-receptionist` / `tsd-dialer`) | §11 Technology & Infrastructure |
| New `PROJECT_LOG.md` entries that ship features or close audit items | §14 Roadmap (move items between "open" and "done"), §13 Risks (close mitigated risks) |
| Pipeline status — new lead, signed contract, status change on existing leads | §9 Customer Pipeline |
| Legal-entity language — TSD Ventures LLC vs. brand name, d/b/a status | §1, §2 |

If a change spans multiple sections, update all of them. The plan should not contradict the live site at any point in time.

### How to update

- Match the existing section structure and editorial voice (concrete file references where possible, no fabricated stats).
- For pricing or numerical changes, update both the prose AND the financial-model tables in §12 if the math shifts.
- For "done" roadmap items, move them under §14's "Done since the original plan extraction" list and add the date / `PROJECT_LOG` slice reference. Add new open items to the "Still open" list.
- The plan's front-matter line ("refreshed against live source on YYYY-MM-DD") should be bumped when a meaningful refresh pass happens.

### When in doubt

If you're unsure whether a change rises to the level of a plan update, err on the side of editing the plan. A small clarifying tweak is cheaper than letting drift compound.
