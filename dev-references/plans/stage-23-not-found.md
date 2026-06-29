# Stage 23 — 404 page (bilingual)

**Session size:** ~20 min · **Priority:** P1 · **Theme:** Polish
**Depends on:** 06 (BaseLayout), 11 (Button) · **Next:** 24
**PRD refs:** §12 (P1 backlog) · **Design refs:** DESIGN-minimax (tokens)

## Goal
Replace the default error page with a branded, on-design 404 that works in both locales and helps a lost visitor get back to real content.

## Prerequisites / context
- Astro emits one static `dist/404.html` from `src/pages/404.astro`; Cloudflare Pages serves it for **any** unmatched route, including `/ko/…`. Because it's a single file, the locale can't be decided server-side.
- The `notFound.{title,message,home}` i18n keys already exist in both dictionaries (scaffolded earlier) — reuse them; secondary links reuse `nav.blog` / `nav.about`.

## Tasks
- [x] Create `src/pages/404.astro` through `BaseLayout` with `noindex` and `alternates={false}` (no hreflang on an error page).
- [x] Render **both** locale blocks at build time (EN visible, KO `hidden`), each with title, message, a primary "home" `Button`, and ghost links to Blog/About — locale-correct hrefs (`/…` vs `/ko/…`).
- [x] Add an `is:inline` script that detects a `/ko/` path and reveals the KO block (hides EN), fixing `<html lang>` + `document.title`. No-JS degrades to the EN block.
- [x] Style with tokens only (large muted "404" mark, centered column, wrapping action row); verify all referenced tokens exist (`--text-h2`, `--space-16/20`, `--font-heading`, etc.).

## Files to create / edit
- `src/pages/404.astro` (new).

## Acceptance criteria
- `astro build` emits `dist/404.html`; `astro check` clean.
- EN visitor sees English; visiting a `/ko/<missing>` URL swaps to Korean content + `lang="ko"`.
- Page is `noindex`, emits no hreflang, and renders with no JS (English fallback).

## Verify
- `astro check` + `astro build`; confirm `dist/404.html` exists and contains both `data-locale="en"` and `data-locale="ko"` blocks.
- Optional: `npm run preview` then hit a bad URL (`/nope`) and a `/ko/nope` URL.

## Handoff note
Known compromise: the Header/Footer chrome stays in its build-time locale (EN) on the 404 even for KO visitors; only the main content swaps. Acceptable for a single static error page — revisit only if a fully-localized error experience is wanted.
