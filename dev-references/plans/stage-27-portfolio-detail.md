# Stage 27 — Portfolio detail pages (`/portfolio/[slug]`)

**Session size:** ~25–30 min · **Priority:** P1 · **Theme:** Pages
**Depends on:** 15 (portfolio page) · **Next:** 28
**PRD refs:** §9.2 (portfolio schema), §12 (P1 backlog) · **Design refs:** DESIGN-minimax (tokens)
**Status:** ✅ Done (2026-06-29) — see [`../../WORKLOG.md`](../../WORKLOG.md).

## Goal
Give every portfolio entry its own crawlable, deep-linkable page at `/portfolio/<slug>/`
(+ `/ko/portfolio/<slug>/`), rendering the frontmatter chrome + markdown body + external
links. Then wire the portfolio cards and tag-archive titles — currently plain text by
design — to link into the new route.

## Prerequisites / context
- Mirror the **blog detail** architecture: `getBlogPaths`/`getPostPath` in `utils/blog.ts`,
  the thin route `pages/blog/[...slug].astro`, and the `BlogPost.astro` layout. Build the
  portfolio equivalents the same way for consistency.
- **Locale pairing differs from blog.** Portfolio has **no `translationKey`** (see
  `content/config.ts`) — EN/KO are paired by **shared filename/slug** (`ai-knowledge-work.md`
  exists in both `portfolio/en/` and `portfolio/ko/`). So the cross-language counterpart is
  just the same slug in the other locale — no key lookup needed.
- Portfolio entries have **short bodies** (a few lines) plus rich frontmatter (`role`, `org`,
  `period`, `summary`, `category`, `tags`, `links`, `thumbnail`). The detail page is mostly
  chrome around a small body — not an article, so **no `articleMeta`/BlogPosting JSON-LD**
  (website type is fine; a `CreativeWork`/profile schema is optional).
- No `draft` field on portfolio (all entries publish). No prev/next chronology needed —
  ordering is by `order`, not date; a back-link is enough.
- The archive helper already supports an optional `href` (`ArchiveEntry.href`) and
  `getPortfolioTagPaths` leaves it unset with a "no detail route yet (Stage 27)" comment —
  this stage flips that on.

## Tasks
- [x] `src/utils/portfolio.ts`: `getPortfolioSlug(id)`, `getPortfolioPath(entry)` (EN
      `/portfolio/<slug>/`, KO `/ko/portfolio/<slug>/` via `getLocalizedPath`), and
      `getPortfolioPaths(lang)` — sorted by `order ?? 99`, props carry the same-slug
      counterpart in the other locale when it exists.
- [x] `src/layouts/PortfolioItem.astro` mirroring `BlogPost.astro` chrome: header
      (category badge · period · locale, title, role · org, tags, cross-lang link), optional
      thumbnail, a `prose` body slot, external **links** list, `career`→About-timeline link,
      back-to-portfolio link. OG image falls back to `thumbnail`. Not an article — no
      prev/next, no BlogPosting JSON-LD.
- [x] Route files `src/pages/portfolio/[...slug].astro` + `src/pages/ko/portfolio/[...slug].astro`
      (thin, like the blog routes: `getStaticPaths = () => getPortfolioPaths('en'|'ko')`).
- [x] Wire links: `PortfolioPage.astro` card titles → `getPortfolioPath`; in `utils/tags.ts`
      `getPortfolioTagPaths` set `href: getPortfolioPath(i)` and drop the self-contained note.
      **Decision:** the index card's inline `<details>` expander (Stage 15) is *replaced* by a
      "View details →" link — the detail page is now the canonical home for the body/links, so
      the inline duplicate render was dropped (no more `render()` in `PortfolioPage`).
- [x] i18n: added `portfolio.backTo`, `portfolio.viewInOtherLang`, and a `portfolio.categories.*`
      group (4 category labels) to BOTH `en.json` and `ko.json` (parity-enforced).

## Files to create / edit
- New: `src/utils/portfolio.ts`, `src/layouts/PortfolioItem.astro`,
  `src/pages/portfolio/[...slug].astro`, `src/pages/ko/portfolio/[...slug].astro`.
- Edit: `src/components/PortfolioPage.astro` (link titles), `src/utils/tags.ts` (archive `href`),
  `src/i18n/en.json`, `src/i18n/ko.json`.

## Acceptance criteria
- Every portfolio entry resolves at `/portfolio/<slug>/` and `/ko/portfolio/<slug>/` → 200,
  rendering frontmatter chrome + body + links; cross-locale link shown when a counterpart slug exists. ✅
- Portfolio page cards **and** tag-archive card titles now link to the detail route. ✅
- Both locales + both themes; `astro check` clean; prod page count grows by 12 (39 → **51 pages**). ✅

## Verify
- `astro check` 0 errors · `astro build` clean (**51 pages**, +12).
- `tests/e2e/portfolio-detail.spec.ts` (4): EN detail chrome+links+back, card title links through,
  cross-lang EN→KO at same slug, KO `career` back-link + About-timeline link. Updated the Stage-26
  `tag-archives` spec (portfolio titles now link, no longer plain text). Full suite **19 passed**.

## Handoff note
Closes the HANDOFF "after Stage 27" cleanup (archive titles were plain text by design). The
`utils/portfolio.ts` pattern mirrors `utils/blog.ts`; locale pairing is by **shared slug** (no
`translationKey` — the field exists in the `.md` files but is stripped by the Zod schema). Stage 28's
generated OG card, when it lands, slots ahead of `thumbnail` in the layout's OG precedence.
