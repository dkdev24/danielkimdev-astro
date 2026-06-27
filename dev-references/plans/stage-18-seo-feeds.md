# Stage 18 — SEO, feeds, sitemap, structured data

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 3 Pages
**Depends on:** 13, 17 · **Next:** 19
**PRD refs:** §7.5, §10.3, §10.4 · **Design refs:** —

## Goal
Complete the discoverability layer: full head meta, hreflang alternates, JSON-LD, RSS feeds, and sitemap — so both locales are correctly indexable and shareable.

## Prerequisites / context
- Pages (13–17) expose SEO props to BaseHead. Sitemap i18n is already configured in `astro.config.mjs`.

## Tasks
- [ ] Finalize `BaseHead.astro`: per-page `<title>`, meta description, canonical, OpenGraph + Twitter card tags.
- [ ] **hreflang:** emit `en` + `x-default` → unprefixed root URLs, `ko` → `/ko/...`, only on pages with counterparts (§7.5).
- [ ] **OG image:** ship one branded default OG image now; per-post override via `ogImage` frontmatter. (Auto-generated per-post cards are P1.)
- [ ] **JSON-LD:** `Person` on Home + About; `BlogPosting` on posts.
- [ ] **RSS:** `@astrojs/rss` — combined feed at `/rss.xml` plus per-locale `/ko/rss.xml`; link feeds in `<head>` and footer.
- [ ] Confirm `@astrojs/sitemap` emits per-locale entries with the i18n config.

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
