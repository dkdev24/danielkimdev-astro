# Stage 08 — Footer & global chrome wiring

**Session size:** ~20 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 07 · **Next:** 13
**PRD refs:** §5 (footer), §10.3 (feed links) · **Design refs:** DESIGN-minimax.md §2 (dark footer), §4

## Goal
Build the footer and wire header + footer into `BaseLayout` so the global chrome is complete for both locales — closing out Phase 1.

## Prerequisites / context
- DESIGN-minimax specifies a dark footer even in light theme — honor that.
- Social URLs are still `TODO(daniel):` (LinkedIn, X, GitHub).

## Tasks
- [ ] Create `src/components/Footer.astro`: short tagline (i18n), email link, social links (LinkedIn/X/GitHub — `TODO(daniel):` URLs from `consts.ts`), RSS link, © + current year, secondary language toggle.
- [ ] Style as the MiniMax dark footer (§2) regardless of active theme.
- [ ] Wire `Header` and `Footer` into `BaseLayout` slots; remove placeholder markup.
- [ ] Ensure footer links use localized paths and i18n labels.
- [ ] Add `<link rel="alternate" type="application/rss+xml">` head hook (feed built in Stage 18) — or leave a clearly-marked TODO if feeds aren't ready.

## Files to create / edit
- `src/components/Footer.astro` — replace starter footer.
- `src/layouts/BaseLayout.astro` — slot in Header/Footer.

## Acceptance criteria
- Every page now renders consistent header + footer in both locales/themes.
- Footer reads dark in both themes; links localized; year is dynamic.
- Social hrefs are `TODO(daniel):` placeholders, not invented URLs.

## Verify
- Load `/`, `/ko/`, toggle theme — chrome consistent.
- `astro check` clean; `npm run build` succeeds.

## Handoff note
**Phase 1 complete.** Record that global chrome is done; note social URLs still pending Daniel.
