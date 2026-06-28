# Stage 04 — Typography & font wiring

**Session size:** ~25 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 02 · **Next:** 06
**PRD refs:** §7.6, §10.5 · **Design refs:** DESIGN-minimax.md §3 (type hierarchy)

## Goal
Wire the configured fonts into the page, map them to the typographic roles, preload the primary body fonts, and tune Korean text — so both locales render in their native faces with no FOIT/CLS.

## Prerequisites / context
- Fonts are declared in `astro.config.mjs` (DM Sans, Outfit, Poppins, Roboto via Google; Pretendard via Fontsource). Astro's `<Font>` component emits the `@font-face` + preload links.

## Tasks
- [x] In the base head (`BaseHead.astro`), render `<Font cssVariable="--font-dm-sans" preload />` and `<Font cssVariable="--font-pretendard" preload />`; render the remaining families without `preload`.
- [x] In `tokens.css`, bind role variables to the font CSS vars per DESIGN-minimax §3: body/UI → DM Sans, display headings → Outfit, mid-tier subheads → Poppins, data/technical → Roboto. *(Done in Stage 02; confirmed.)*
- [x] Apply Korean stack: when `lang="ko"`, body/headings use `--font-pretendard` (Noto Sans KR fallback). Use a `:lang(ko)` rule or a locale class on `<html>`.
- [x] Tune Korean: slightly higher line-height than the universal 1.5 and adjusted letter-spacing (§7.6).
- [x] Confirm no remaining Atkinson references (removed in Stage 01).

## Files to create / edit
- `src/components/BaseHead.astro` — `<Font>` tags + preload.
- `src/styles/tokens.css` — role→font bindings + `:lang(ko)` overrides.

## Acceptance criteria
- EN renders in DM Sans/Outfit; KO renders in Pretendard (verify in devtools computed styles, not fallback serif/sans).
- Preload links present for DM Sans and Pretendard; `font-display: swap` applied.
- No layout shift on font load (visually stable).

## Verify
- `npm run build` then inspect `<head>` of output for preload links.
- Load `/` and `/ko/` and check computed `font-family` on body + an h1.

## Handoff note
Record that fonts are wired and role-mapped; KO typography tuned.
