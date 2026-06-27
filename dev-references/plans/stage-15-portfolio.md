# Stage 15 — Portfolio page + filter (both locales)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 10, 11 · **Next:** 18
**PRD refs:** §6.3 · **Design refs:** DESIGN-minimax.md §1 (grid), §4 (cards)

## Goal
Build Portfolio for EN and KO: a collection-driven grid with client-side tag filtering (progressive enhancement) and inline expandable item cards.

## Prerequisites / context
- Portfolio collection seeded (Stage 10); Card/Tag from Stage 11. v1 uses inline expandable cards — dedicated `/portfolio/[slug]` pages stay P1.

## Tasks
- [ ] Build `src/pages/portfolio.astro` (EN) and `src/pages/ko/portfolio.astro` (KO).
- [ ] Render items from the `portfolio` collection filtered to the current locale (title, role, period, summary, tags, links, optional thumbnail).
- [ ] **Tag/topic filter:** chip row driving client-side filtering; must work without JS as a full list (progressive enhancement).
- [ ] **Inline expandable card:** click/keyboard to expand details in-place (`aria-expanded`); no separate route in v1.
- [ ] Cover the four buckets (product / talk-writing / side-ai / career); cross-link career to About timeline.
- [ ] Grid responsive 1 → 2 → 3 columns by breakpoint.

## Files to create / edit
- `src/pages/portfolio.astro`, `src/pages/ko/portfolio.astro` — new.
- (optional) `src/components/PortfolioFilter` island for the chip filter.

## Acceptance criteria
- Adding a portfolio entry = adding one file, no component edits (PRD acceptance).
- Filter works with JS and degrades to full list without JS.
- Expandable cards keyboard-operable with `aria-expanded`.

## Verify
- Disable JS → full list renders; enable JS → filter works.
- Load both locales in light + dark; keyboard-test expand.

## Handoff note
Record Portfolio complete (inline cards, v1); note `/portfolio/[slug]` deferred to P1.
