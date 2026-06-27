# Stage 20 — Performance & Lighthouse pass

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 4 Polish
**Depends on:** 13–18 · **Next:** 21
**PRD refs:** §10.5, §2 (goal) · **Design refs:** —

## Goal
Hit the performance bar: Lighthouse ≥ 95 (Perf / A11y / Best-Practices / SEO) on Home and a representative post, with zero CLS.

## Prerequisites / context
- Fonts are preloaded with `swap` (Stage 04). Images should use Astro's optimization with explicit dimensions.

## Tasks
- [ ] Ensure all raster images use Astro `<Image>`/optimization with explicit `width`/`height` (prevent CLS); lazy-load below-fold images.
- [ ] Confirm primary fonts preload and `font-display: swap`; drop any unused font weights/subsets from `astro.config.mjs`.
- [ ] Verify JS is minimal — islands only where needed (filters, toggles, copy, expandable cards); no stray hydration.
- [ ] Check `_headers` long-cache for `/_astro/*` hashed assets is effective.
- [ ] Run Lighthouse on Home + a post (both locales ideally); fix the largest offenders (LCP image, render-blocking, layout shift).

## Files to create / edit
- Image usages across pages/components; `astro.config.mjs` font trimming; `public/_headers` as needed.

## Acceptance criteria
- Lighthouse ≥ 95 on all four categories for Home and a representative post.
- CLS ≈ 0; LCP within target; no render-blocking warnings of note.

## Verify
- `npm run build && npm run preview`, then Lighthouse (or `lighthouse` CLI) on `/` and a post URL.
- Re-check after fixes until all four categories ≥ 95.

## Handoff note
Record Lighthouse scores achieved (per page/locale) and any deferred micro-optimizations.
