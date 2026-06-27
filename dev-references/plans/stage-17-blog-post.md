# Stage 17 — Blog post layout + MDX features

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 12, 16 · **Next:** 18
**PRD refs:** §6.5, §9.1 · **Design refs:** DESIGN-minimax.md §3 (reading measure), §4

## Goal
Build the blog post layout and dynamic routes for both locales with full MDX richness, TOC, prev/next, cross-language link, and per-post SEO hooks.

## Prerequisites / context
- TOC, Callout, CodeBlock from Stage 12. `translationKey` links EN/KO versions (Stage 09/10). Per-post SEO meta is finalized in Stage 18 — expose the props here.

## Tasks
- [ ] Build `src/pages/blog/[...slug].astro` (EN) and `src/pages/ko/blog/[...slug].astro` (KO) using `getStaticPaths` over the locale's posts.
- [ ] Post layout: title, date, optional updated-date, reading time, tag chips, locale badge.
- [ ] Body: headings with anchor links, syntax-highlighted code (copy button), callouts, captioned images (optimized), tables, footnotes.
- [ ] **TOC** auto from headings, sticky desktop / collapsible mobile.
- [ ] **Prev/next** within the same locale.
- [ ] **Cross-language link** ("Read in 한국어"/"Read in English") shown only when a `translationKey` counterpart exists.
- [ ] Keep blog body to a generous ~65–75ch measure (DESIGN-minimax §3).
- [ ] Pass per-post SEO props (title/description/canonical/ogImage) up to BaseHead (finalized Stage 18).

## Files to create / edit
- `src/pages/blog/[...slug].astro`, `src/pages/ko/blog/[...slug].astro` — new.
- `src/layouts/BlogPost.astro` — refactor from starter to spec.

## Acceptance criteria
- A KO-only post renders correctly and is absent from the EN list (no empty EN counterpart) — PRD §6.5 acceptance.
- All MDX features render; TOC + copy button keyboard-operable.
- Cross-language link appears only when a translation exists.

## Verify
- Build; open an EN and a KO post; confirm prev/next, TOC, anchors, code copy, footnotes.
- Confirm the cross-language link logic on the seeded `translationKey` pair.

## Handoff note
Record post layout complete; note per-post SEO finalized in Stage 18.
