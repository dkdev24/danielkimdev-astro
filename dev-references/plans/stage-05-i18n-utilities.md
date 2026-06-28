# Stage 05 — i18n utilities & UI dictionaries

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 01 · **Next:** 06
**PRD refs:** §7.1, §7.2, §7.3 · **Design refs:** —

## Goal
Build the i18n plumbing every component depends on: per-locale UI string dictionaries and helper functions for locale detection, translation lookup, localized routing, and date/reading-time formatting. No hardcoded display strings anywhere downstream.

## Prerequisites / context
- Astro i18n routing is configured (EN root, KO `/ko/`). This stage adds the app-level helpers on top.

## Tasks
- [x] Create `src/i18n/en.json` and `src/i18n/ko.json` covering all chrome: nav labels, buttons/CTAs, footer, "Read in 한국어"/"Read in English", reading-time phrasing, date labels, theme/lang toggle labels, 404 copy.
- [x] Create `src/i18n/utils.ts` with: `getLangFromUrl(url)`, `useTranslations(lang)` → `t(key)`, `getLocalizedPath(path, lang)` (root for `en`, `/ko` prefix for `ko`), `getAltLocale(lang)`.
- [x] Add `formatDate(date, lang)` and `formatReadingTime(minutes, lang)` localized helpers.
- [x] Add a typed `Lang = 'en' | 'ko'` and ensure dictionaries share one key shape (type-check parity between en/ko).

## Files to create / edit
- `src/i18n/en.json`, `src/i18n/ko.json` — new.
- `src/i18n/utils.ts` — new.

## Acceptance criteria
- `t('nav.blog')` style lookups resolve in both locales.
- `getLocalizedPath('/about/', 'ko')` → `/ko/about/`; for `'en'` → `/about/`.
- en/ko dictionaries have identical key sets (no missing keys).

## Verify
- Add a throwaway test in an `.astro` page printing a few `t()` calls for both langs; remove after.
- `astro check` clean (typed dictionary shape).

## Handoff note
Record that i18n utils + dictionaries exist and define the key namespace convention used by all components.
