# Stage 13 — Home page (both locales)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 08, 10, 11 · **Next:** 18
**PRD refs:** §6.1, §7.4 · **Design refs:** DESIGN-minimax.md §1, §4

## Goal
Build the Home page for EN (root) and KO (`/ko/`): hero, identity strip, featured work, latest writing, about teaser, footer CTA — fully static and locale-aware.

## Prerequisites / context
- Uses Card/Button/Tag (Stage 11), chrome (Stage 08), seed content (Stage 10), i18n helpers (Stage 05).

## Tasks
- [x] Build `src/pages/index.astro` (EN) and `src/pages/ko/index.astro` (KO) on `BaseLayout`, or a shared `HomePage` component fed by locale.
- [x] **Hero:** name, one-line positioning (from §13.3 / data), subhead, primary CTA "View Portfolio" + secondary "Read the Blog" — localized.
- [x] **Identity strip:** focus-area chips (OTT · DRM/Content Security · Cloud/SaaS · AI).
- [x] **Featured work:** 3 `featured: true` portfolio cards (title, one-liner, tag, link).
- [x] **Latest writing:** 3 most recent posts in the current locale; graceful fill if < 3 (no empty cards, §7.4).
- [x] **About teaser** linking to full About; **Footer CTA** (email, LinkedIn).
- [x] Above-the-fold hero readable on 375px wide; fully static, no layout shift.

## Files to create / edit
- `src/pages/index.astro`, `src/pages/ko/index.astro` — new.
- (optional) `src/components/sections/*` for hero/featured/latest.

## Acceptance criteria
- Both `/` and `/ko/` render with locale-correct copy and the current locale's latest posts.
- A stranger can parse Home in < 60s (PRD goal); no CLS; hero fits 375px.
- Featured/latest pull from collections, not hardcoded.

## Verify
- Load `/` and `/ko/` in light + dark; resize to 375px.
- Confirm latest-writing locale filtering + graceful fill.

## Handoff note
Record Home complete for both locales; note any section extracted to reusable components.
