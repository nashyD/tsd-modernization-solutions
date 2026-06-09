# Liquid Glass Redesign — Design Spec

**Date:** 2026-06-09
**Branch:** `feat/liquid-glass`
**Status:** Approved (brainstorm complete)

## Goal

Reskin the public flagship marketing site (`tsd-modernization/`, the Vite/SSG app
served at tsd-modernization.com) with a full Apple-style "Liquid Glass" design
language — dark-primary, spatial, with a matching light-glass variant. Direction
prompted by the TSD daily report ("the web is going liquid glass").

## Scope

**In:** Home, Services, Service Detail, Pricing, Process, Why Us, Team,
Testimonials, Contact, Book, AI Receptionist. Both themes. Nav, footer, cards,
CTAs, modals, pricing estimator, section panels.

**Out:** the internal sales-dashboard/audit Next.js app (`tsd-modernization-app/`,
separate codebase, proxied in at `/sales`, `/audit`, `/showcase`). Possible
follow-up for parity.

## Decisions (from brainstorm)

- **Intensity:** full glass, dark/spatial — the dramatic route.
- **Themes:** glassify *both*. Dark is primary and gets the full treatment; build a
  matching frosted-white "light glass" variant (macOS-light style). Keep the
  existing `useTheme` toggle and `data-theme` CSS-variable system.
- **Backdrop:** living gradient — a slow-drifting Carolina aurora mesh-gradient +
  existing film grain + faint Charlotte skyline silhouette, site-wide, with gentle
  scroll parallax. Hero keeps its video loop. Glass surfaces get pointer-reactive
  sheen.

## The glass material

One reusable recipe, applied consistently:

- **Vibrancy blur:** `backdrop-filter: blur(24px) saturate(180%)` so the backdrop's
  color bleeds through (the signature liquid-glass effect). Lighter blur radius on
  mobile.
- **Translucent fill:** dark `rgba(12,21,36,~0.55)` / light `rgba(255,255,255,~0.6)`,
  tuned per surface so text always clears WCAG AA.
- **Specular rim:** bright top-edge highlight + faint diagonal sheen (wet/lensed,
  not flat-frosted).
- **Edge lensing:** 1px gradient border (brighter top-left) + outer Carolina glow.
- **Concentric radii:** outer ~28px, nested elements step down (Apple's nested-corner
  rule).
- **Pointer-reactive sheen:** soft highlight tracking the cursor across each glass
  surface — GPU-cheap (opacity/transform only).

## Architecture

The site has **no CSS files**; everything is inline styles (~5,200 lines) with a
central token system in `src/shared.jsx` (`C`, `SPACE`, `RADIUS`, `SHADOW`, `v()`)
and a `data-theme` variable system injected in `src/Layout.jsx`.

- Extend `src/shared.jsx` with a `GLASS` token set + reusable primitives:
  `<Glass>` (base), `GlassCard`, `GlassPanel`, glassified `Button`/nav.
- One injected `<style>` block in `src/Layout.jsx` for what inline styles can't do:
  `@keyframes` (aurora drift, sheen) and the `@media` accessibility fallbacks.
- Extend the dark + light token sets; refactor each page's cards/CTAs/panels onto
  the glass primitives. One place to tune the whole look.

## Guardrails (non-negotiable)

- **Accessibility:** body text always on panels meeting AA contrast (>=4.5:1);
  `prefers-reduced-transparency` -> solid surfaces; `prefers-reduced-motion` -> no
  drift/parallax/sheen; `prefers-contrast` -> stronger borders.
- **Performance:** cap simultaneous blur layers, GPU-only animation
  (transform/opacity), lighter blur on mobile, lazy video, and **no change to
  crawlable HTML/meta** so SSG/SEO and LCP stay healthy.

## Rollout

1. Glass design system in `shared.jsx` + `Layout.jsx` (nav, footer, backdrop,
   keyframes, media fallbacks) **+ Home pilot** -> screenshot for sign-off.
2. Roll across the remaining pages once the pilot is approved.
3. Cross-page polish, both-theme QA, perf/a11y pass, final screenshots.
