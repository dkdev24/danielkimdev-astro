# Stage 17 — Blog post layout + MDX features

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 12, 16 · **Next:** 18
**PRD refs:** §6.5, §9.1 · **Design refs:** DESIGN-minimax.md §3 (reading measure), §4

## Goal
Build the blog post layout and dynamic routes for both locales with full MDX richness, TOC, prev/next, cross-language link, and per-post SEO hooks.

## Prerequisites / context
- TOC, Callout, CodeBlock from Stage 12. `translationKey` links EN/KO versions (Stage 09/10). Per-post SEO meta is finalized in Stage 18 — expose the props here.

## Tasks
- [x] Build `src/pages/blog/[...slug].astro` (EN) and `src/pages/ko/blog/[...slug].astro` (KO) using `getStaticPaths` over the locale's posts (shared `getBlogPaths(lang)` in `utils/blog.ts`).
- [x] Post layout: title, date, optional updated-date, reading time, tag chips, locale badge.
- [x] Body: headings with anchor IDs, syntax-highlighted code (copy button via CodeCopy), callouts (Stage 12), optimized images, tables, footnotes (remark-gfm default).
- [x] **TOC** auto from headings, sticky desktop / collapsible mobile (Stage 12 `TOC` — omits itself when a post has no headings).
- [x] **Prev/next** within the same locale (reverse-chron neighbours: older/newer).
- [x] **Cross-language link** ("Read in 한국어"/"Read in English") shown only when a `translationKey` counterpart exists.
- [x] Keep blog body to a generous ~65–75ch measure (DESIGN-minimax §3) — `.post__body { max-width: 72ch }`.
- [x] Pass per-post SEO props (title/description/ogImage=heroImage) up to BaseHead via BaseLayout (full per-post SEO finalized Stage 18).

**Routing finalized this stage:** posts now live at `/blog/<slug>/` (EN) and `/ko/blog/<slug>/` (KO) — the locale folder is stripped from the entry id. The old `/blog/<locale>/<slug>/` scheme is gone; `getPostPath(entry)` (in `utils/blog.ts`) is the single source of truth, now used by Home + blog index too.

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
