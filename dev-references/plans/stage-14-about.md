# Stage 14 — About page (both locales)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 10, 12 · **Next:** 18
**PRD refs:** §6.2, §13.1–13.2 · **Design refs:** DESIGN-minimax.md §1, §4

## Goal
Build About for EN and KO: narrative bio, data-driven career timeline, grouped skills, headshot slot with fallback, contact row.

## Prerequisites / context
- Timeline data + bio seeded in Stage 10; TimelineItem component from Stage 12. KO prose is native (`TODO(daniel):` where pending), not translated.

## Tasks
- [ ] Build `src/pages/about.astro` (EN) and `src/pages/ko/about.astro` (KO) on `BaseLayout`.
- [ ] Narrative bio from §13.1 (EN) / §13.2 (KO native, `TODO(daniel):` if not yet written).
- [ ] **Career timeline:** render dynamically from the `timeline` collection via `TimelineItem` (no hardcoded markup).
- [ ] **Skills / focus areas** grouped: Product, Domain, Technical, AI.
- [ ] **Headshot slot:** `/public/images/daniel.jpg` with graceful fallback (initials/monogram) if absent — `TODO(daniel):` to add image.
- [ ] **Contact row:** email + socials (localized labels, `TODO(daniel):` URLs).

## Files to create / edit
- `src/pages/about.astro`, `src/pages/ko/about.astro` — new.

## Acceptance criteria
- Both locales exist with locale-appropriate prose (KO not auto-translated).
- Timeline renders from data; adding a timeline entry needs no markup edits.
- Page works with and without the headshot present.

## Verify
- Load `/about/` and `/ko/about/`; temporarily remove the headshot to confirm fallback.
- `astro check` clean.

## Handoff note
Record About complete; flag KO bio / headshot / social `TODO(daniel):` items still open.
