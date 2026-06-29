# Stage 26 — Tag/topic archive pages (blog + portfolio)

**Session size:** ~25–30 min · **Priority:** P1 · **Theme:** Taxonomy
**Depends on:** 15 (portfolio page), 16 (blog index) · **Next:** 27
**PRD refs:** §5 (taxonomy), §12 (P1 backlog) · **Design refs:** DESIGN-minimax (tokens)
**Status:** ✅ Done (2026-06-29) — see [`../../WORKLOG.md`](../../WORKLOG.md).

## Goal
Give every taxonomy tag a static, crawlable, deep-linkable page — the indexable counterpart to
the index/portfolio interactive filters (one URL per topic, per collection, per locale).

## Prerequisites / context
- Two **separate** tag enums (`content/config.ts`): blog tags vs. portfolio tags. Each archive
  is per collection so the enums never cross.
- The index filters (Stage 16/25) are client-side and live behind one URL; these archive pages
  are the SEO/shareable form — built statically, one page per tag actually used.
- **Portfolio has no detail route yet** (that's Stage 27), so portfolio archive cards must be
  self-contained — no dead links.

## Tasks
- [x] New `src/utils/tags.ts` with builders: `getBlogTagPaths(lang)`, `getPortfolioTagPaths(lang)`
      (produce `getStaticPaths` params **and** pre-formatted `ArchiveEntry` card props), and
      `getTagPath(kind, tag, lang)` for linking.
- [x] Shared dumb renderer `TagArchivePage.astro` fed by those props; `ArchiveEntry.href` is
      optional — blog cards link to the post, **portfolio cards omit href** (plain-text title).
- [x] Route files (thin): `/blog/tags/[tag]`, `/portfolio/tags/[tag]` (+ `/ko/...`), each calling
      its builder for both locales.
- [x] Link item tag chips on the blog index + portfolio page into the archive set; the current
      tag's chip carries `aria-current="page"`.
- [x] Localized headings via `{kind}.taggedTitle`; add the needed i18n keys to both dicts.

## Files to create / edit
- New: `src/utils/tags.ts`, `src/components/TagArchivePage.astro`,
  `src/pages/{blog,ko/blog,portfolio,ko/portfolio}/tags/[tag].astro`.
- Edit: `src/components/{BlogIndexPage,PortfolioPage,Tag}.astro`, `src/i18n/{en,ko}.json`.

## Acceptance criteria
- Each used tag resolves at `/{blog,portfolio}/tags/<tag>/` (+ `/ko/`) → 200, listing its entries.
- Blog cards link to posts; portfolio cards are self-contained; tag chips link into archives with
  `aria-current` on the active one. Off-enum tags can't exist (schema-enforced).
- Both locales + themes; `astro check` clean; prod build grows 13 → 39 pages.

## Verify
- `astro check` + `astro build`.
- `tests/e2e/tag-archives.spec.ts` (4). **Gotcha:** scope heading locators to the page
  (e.g. `.archive__head h1`) — the Astro dev toolbar injects its own `<h1>` and trips strict mode.

## Handoff note
`getPortfolioTagPaths` leaves `href` unset on purpose until Stage 27 ships `/portfolio/[slug]`;
once it does, set `href: getPortfolioPath(i)` there and link the archive titles.
