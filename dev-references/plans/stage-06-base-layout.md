# Stage 06 — Base layout shell & landmarks

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 03, 04, 05 · **Next:** 07
**PRD refs:** §11 (semantics), §7.5 (lang attr), §10.4 (head) · **Design refs:** DESIGN-minimax.md §1 layout

## Goal
Create the single page shell every page uses: correct landmarks, per-locale `<html lang>`, skip-to-content link, theme script, and a refactored head — so pages just slot content into `<main>`.

## Prerequisites / context
- Replaces ad-hoc starter layout. Header/footer are placeholders here (built in Stage 07/08) — leave clearly marked slots.

## Tasks
- [x] Create `src/layouts/BaseLayout.astro` accepting props: `title`, `description`, `lang`, `ogImage?`, `noindex?`.
- [x] Set `<html lang={lang}>` and the locale class used by `:lang(ko)` font rules.
- [x] Include the no-flash `ThemeScript` (Stage 03) in `<head>` before paint.
- [x] Render `BaseHead` (meta/title/desc/fonts) — full SEO/OG/hreflang lands in Stage 18; leave hooks.
- [x] Add skip-to-content link (first focusable), `<header>` slot, `<main id="main">` with content `<slot/>`, `<footer>` slot.
- [x] Apply max content-width container + full-bleed capability per DESIGN-minimax §1.
- [x] Wire global styles import (tokens + global.css).

## Files to create / edit
- `src/layouts/BaseLayout.astro` — new.
- `src/components/BaseHead.astro` — refactor to take props from layout.

## Acceptance criteria
- A page using `BaseLayout` has exactly one `<h1>` slot path, `header/main/footer` landmarks, and `lang` correct per locale.
- Skip link is the first Tab stop and jumps to `#main`.
- No theme flash on load.

## Verify
- Tab from page top → skip link appears and works.
- View source on `/` and `/ko/`: `<html lang>` correct; landmarks present.
- `astro check` clean.

## Handoff note
Record that BaseLayout is the canonical shell; header/footer are placeholder slots pending 07/08.
