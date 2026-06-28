# Stage 18 — SEO, feeds, sitemap, structured data

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 13, 17 · **Next:** 19
**PRD refs:** §7.5, §10.3, §10.4 · **Design refs:** —

## Goal
Complete the discoverability layer: full head meta, hreflang alternates, JSON-LD, RSS feeds, and sitemap — so both locales are correctly indexable and shareable.

## Prerequisites / context
- Pages (13–17) expose SEO props to BaseHead. Sitemap i18n is already configured in `astro.config.mjs`.

## Tasks
- [x] Finalize `BaseHead.astro`: per-page `<title>`, meta description, canonical, OpenGraph + Twitter card tags (+ `og:site_name`, `og:locale`, `og:type` website/article, `article:*`).
- [x] **hreflang:** emit `en` + `x-default` → unprefixed root URLs, `ko` → `/ko/...`, only on pages with counterparts (§7.5). Mirrored pages auto-derive the pair in BaseLayout; posts emit only when a `translationKey` counterpart exists.
- [x] **OG image:** ship one branded default OG image now (`public/og-default.png`, 1200×630, sharp-rendered); per-page/post override via `ogImage` frontmatter (precedence: ogImage → hero → default). (Auto-generated per-post cards stay P1.)
- [x] **JSON-LD:** `Person` on Home + About; `BlogPosting` on posts (`utils/seo.ts`).
- [x] **RSS:** `@astrojs/rss` — `/rss.xml` (EN) + `/ko/rss.xml` (KO), each single-language; linked in `<head>` (per-locale) and footer (per-locale).
- [x] Confirm `@astrojs/sitemap` emits per-locale entries with the i18n config (xhtml:link hreflang alternates present).

**Note on the RSS interpretation:** the plan said "combined feed at /rss.xml plus per-locale /ko/rss.xml". Implemented as per-locale single-language feeds (EN at root, KO at /ko/) — cleaner for subscribers and matches the EN-root/KO-/ko/ i18n model — rather than a mixed-language combined feed.

## Files to create / edit
- `src/components/BaseHead.astro` — meta + hreflang + JSON-LD.
- `src/pages/rss.xml.js` (EN) + `src/pages/ko/rss.xml.js` (KO).
- `public/og-default.*` — branded default OG image.

## Acceptance criteria
- Each page has unique title/description/canonical; hreflang correct and only where counterparts exist.
- `/rss.xml` and `/ko/rss.xml` validate; sitemap lists both locales.
- JSON-LD validates (Person + BlogPosting).

## Verify
- Build; validate RSS (W3C feed validator) and JSON-LD (Rich Results test) on the output.
- Inspect `<head>` on `/`, `/ko/`, and a post for canonical + hreflang + OG.

## Handoff note
Record SEO/feeds/sitemap complete; note auto-generated per-post OG images deferred to P1.
