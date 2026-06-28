# Stage 16 — Blog index + filter (both locales)

**Session size:** ~25 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 10, 11 · **Next:** 17
**PRD refs:** §6.4, §7.4 · **Design refs:** DESIGN-minimax.md §1, §4

## Goal
Build the Blog index for EN and KO: reverse-chronological list of the current locale's posts with tag-chip filtering and draft exclusion in production.

## Prerequisites / context
- Posts seeded (Stage 10); Card/Tag from Stage 11. Search + pagination are P1 — v1 lists all and provides tag filter only.

## Tasks
- [x] Build `src/pages/blog/index.astro` (EN) and `src/pages/ko/blog/index.astro` (KO) — thin wrappers over a shared `BlogIndexPage.astro`.
- [x] List current-locale posts reverse-chron: title, date (localized), reading time, tags, excerpt (description fallback).
- [x] **Tag chips filter** (client-side, progressive enhancement; full list without JS).
- [x] **Exclude `draft: true`** from production builds (allow in dev) — `import.meta.env.PROD ? !draft : true`.
- [x] Graceful empty/low-count state (no broken layout if a locale has few posts, §7.4).
- [x] Link each item to its post route in the same locale.

## Files to create / edit
- `src/pages/blog/index.astro`, `src/pages/ko/blog/index.astro` — new.

## Acceptance criteria
- Production build excludes drafts; dev shows them.
- Only current-locale posts appear; dates/reading-time localized.
- Tag filter works with JS, degrades without.

## Verify
- `npm run build` → confirm a `draft: true` post is absent from `dist`.
- Load both locales; test tag filter + JS-off fallback.

## Handoff note
Record Blog index complete; note search/pagination deferred to P1.
