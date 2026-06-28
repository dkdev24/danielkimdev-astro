# WORKLOG

> **Purpose:** append-only history of every working session. Newest entry on top.
> For the *current* state and what to do next, see [`HANDOFF.md`](HANDOFF.md) instead.
> At the end of each session, add an entry here and refresh `HANDOFF.md`.

Entry template:

```
## YYYY-MM-DD — <short title>
**Did:** what changed this session.
**Decisions:** any decisions locked (with why).
**Files touched:** key files.
**Next:** what the next session should pick up.
```

---

## 2026-06-28 — Stage 19: Accessibility pass (WCAG 2.1 AA)

**Did:** Audited the built site for WCAG 2.1 AA with axe-core (tags wcag2a/wcag2aa/wcag21a/wcag21aa) driven through Playwright against `astro preview`, on Home, a post (agent-readiness), Portfolio, and the KO home — in BOTH light and dark themes.
- **Method note:** the plan's `/design:accessibility-review` skill wasn't available in this environment, so axe-core was used as the equivalent automated audit. Initial runs were contaminated by CSS-transition artifacts from toggling `data-theme` via JS mid-run (e.g. dark `#3b82f6` showing up in a "light" measurement); re-ran cleanly with a fresh load per theme + a transition-kill style, which isolated the genuine fails.
- **Found + fixed 2 real AA contrast fails (both token-level, so the fix propagates everywhere the token is used):**
  1. Light **muted metadata text** — `--color-text-muted` was `var(--gray-400)` (#8e8e93) = **3.26** on white (card date · reading-time, etc.). Changed to `var(--gray-500)` (#5f5f5f) ≈ **6.4:1**. Hierarchy preserved: body #222 > secondary #45515e > muted #5f5f5f.
  2. Dark **primary CTA** — `.btn--primary` rendered white on dark brand #3b82f6 = **3.67**. Added a dedicated `--color-btn-primary-bg` token (light = `--color-brand`; dark = `--color-primary-600` #2563eb = **5.17:1**) and pointed `.btn--primary` at it. Brand/links elsewhere unchanged.
- **Re-verified:** axe → **0 violations** on Home (light+dark), post (light+dark, 20 passing checks), Portfolio (light), KO home (light/dark, html lang=ko).
- **Confirmed already-compliant (code review + axe):** Header mobile menu (focus-trap, Escape, focus-return, click-outside, aria-expanded/label), theme toggle (aria-pressed + label sync, 44×44), language toggle (aria-label), filter chips + copy button = real buttons, TOC/expandable cards = native `<details>`, skip link + global `:focus-visible` ring, single `h1` per page, labelled landmarks, decorative images `alt=""`, ≥44px targets, and a global `prefers-reduced-motion` kill-switch.

**Decisions:** fixed contrast at the **token** layer (not per-component) so every current and future consumer inherits AA. Picked existing scale steps (gray-500, primary-600) rather than inventing new hex values, keeping the palette coherent. Used axe-core in lieu of the unavailable design skill — documented in the stage doc.

**Verify:** `astro check` → 0 errors/warnings/hints. `astro build` → succeeds. axe-core → 0 AA violations across the pages/themes above. (Manual screen-reader pass + the numeric Lighthouse a11y score are folded into Stage 20's holistic Lighthouse run.)

**Files touched:** `src/styles/tokens.css` (muted → gray-500; new `--color-btn-primary-bg` in light + dark), `src/components/Button.astro` (primary uses the new token), `dev-references/plans/00-index.md`, `dev-references/plans/stage-19-accessibility.md`, `HANDOFF.md`.

**Next:** Stage 20 — Performance & Lighthouse pass (`stage-20-performance.md`): Lighthouse (perf + the a11y/SEO/best-practices scores), Core Web Vitals, image/font/JS budget checks, caching headers (`public/_headers`). Then Stage 21 (Deploy to Cloudflare Pages — needs Daniel's auth).

---

## 2026-06-28 — Stage 18: SEO, feeds, sitemap, structured data (Phase 3 complete)

**Did:** Built the full discoverability layer; **Phase 3 (Pages) is now done.**
- **`BaseHead.astro` rebuilt** as the SEO hub: per-page `<title>`/description/canonical, OpenGraph (`og:type` website|article, `og:url`, `og:title/description/image`, `og:site_name`, `og:locale` + `og:locale:alternate` when a counterpart exists, `article:published_time/modified_time/tag`), Twitter summary-large-image, per-locale RSS `<link>`, **hreflang** alternates, and **JSON-LD** `<script is:inline type="application/ld+json">`. OG image precedence: `ogImage` string override → optimized `image` asset → `DEFAULT_OG_IMAGE`.
- **`BaseLayout.astro`** now threads `image`/`ogImage`/`articleMeta`/`alternates`/`jsonLd` to BaseHead, and **auto-derives the hreflang pair** (`{en, ko}` from the current path via `getLocalizedPath`) for mirrored pages; `alternates={false}` or `noindex` suppresses it. (Renamed the old `ogImage: ImageMetadata` prop to `image`; only BlogPost consumed it.)
- **JSON-LD** (`utils/seo.ts`): `personJsonLd` (Home + About — name/url/description/sameAs from consts) and `blogPostingJsonLd` (posts — headline/dates/inLanguage/author/image/keywords). Verified each `dist` block parses; Person on Home+About, BlogPosting on posts, none on portfolio/blog-index (correct).
- **Per-locale RSS** (`utils/rss.ts` `buildFeed(lang)`): `pages/rss.xml.js` (EN) + new `pages/ko/rss.xml.js` (KO), single-language each, drafts excluded, links via `getPostPath`, `<language>` tag set. Head + footer link the current locale's feed (removed the Stage-18 TODO in Footer).
- **Branded default OG image:** generated `public/og-default.png` (1200×630) by sharp-rasterizing an inline SVG (charcoal→brand-blue gradient, "Daniel Kim" + focus line + domain). `TODO(daniel)` left to swap for final artwork.
- **Sitemap:** confirmed `@astrojs/sitemap` i18n config emits both locales with `xhtml:link` hreflang alternates (was already configured in Stage 01).
- Cleanup: removed the now-unused legacy `SITE_DESCRIPTION` scalar from `consts.ts` (only `*_BY_LOCALE` remain).

**Decisions:** hreflang is emitted **only where a counterpart exists** — mirrored pages always qualify (auto-derived), posts qualify only when `translationKey` resolves; a counterpart-less post emits no hreflang (verified empirically). Interpreted the plan's "combined feed at /rss.xml" as a per-locale single-language feed at the root (EN) rather than a mixed-language feed — cleaner and matches the i18n model (noted in the stage doc). Shipped a real branded PNG OG (not SVG) since social crawlers don't reliably render SVG. JSON-LD scripts marked `is:inline` so Astro leaves them untouched.

**Verify:** `astro check` → 0 errors, 0 hints. `astro build` → 12 pages + `/rss.xml` + `/ko/rss.xml` + sitemap. Inspected `dist`: Home/KO-Home/About/posts carry correct canonical + hreflang (en/x-default/ko) + OG (`og:type`, locale + alternate) + JSON-LD; **temp counterpart-less KO post → 0 SEO hreflang link tags, absent from EN index/feed, present in KO** (then removed); both feeds well-formed XML with correct absolute links + language; sitemap lists all 12 URLs across both locales with xhtml alternates. OG PNG rendered + eyeballed (on-brand).

**Files touched:** `src/components/BaseHead.astro` (rewritten), `src/layouts/BaseLayout.astro`, `src/layouts/BlogPost.astro` (image/ogImage/articleMeta/alternates/jsonLd), `src/components/HomePage.astro` + `src/components/AboutPage.astro` (Person JSON-LD), `src/components/Footer.astro` (per-locale RSS), `src/utils/seo.ts` (new), `src/utils/rss.ts` (new), `src/pages/rss.xml.js` (rewritten) + `src/pages/ko/rss.xml.js` (new), `src/consts.ts` (drop SITE_DESCRIPTION, OG comment), `public/og-default.png` (new), `dev-references/plans/00-index.md`, `dev-references/plans/stage-18-seo-feeds.md`, `HANDOFF.md`.

**Next:** Stage 19 — Accessibility pass (WCAG 2.1 AA, `stage-19-accessibility.md`): keyboard nav, focus order, landmarks, contrast, alt text, reduced-motion, axe/Lighthouse a11y audit across both locales + themes. Then 20 (Performance/Lighthouse), 21 (Deploy to Cloudflare Pages — needs Daniel's auth).

---

## 2026-06-28 — Stage 17: Blog post layout + MDX features (both locales)

**Did:** Refactored the legacy starter `layouts/BlogPost.astro` into the real post layout (rendering through `BaseLayout`) and added localized dynamic routes for both locales.
- **Layout:** header (date · reading-time · EN/KO locale badge, title, optional updated-date, static `Tag`s, cross-language link), optimized `<Image>` hero (`widths`/`sizes`), Stage-12 `TOC` in a desktop sidebar / collapsible-mobile column, `prose` body capped at **72ch** (DESIGN-minimax §3 measure), older/newer pagination, back-to-blog link, and the `CodeCopy` enhancer dropped once (upgrades every Shiki block with a language label + copy button).
- **Routes:** `pages/blog/[...slug].astro` (EN) + new `pages/ko/blog/[...slug].astro` (KO), both delegating to a shared **`getBlogPaths(lang)`** helper in new `utils/blog.ts`. It returns each post's params + `newer`/`older` (in-locale reverse-chron neighbours) + `counterpart` (EN/KO via `translationKey`), applying the same prod draft gating as the index. The route calls `render(post)` and passes `headings` + `Content`.
- **Routing finalized & centralized:** posts now live at `/blog/<slug>/` (EN) and `/ko/blog/<slug>/` (KO) — `getPostSlug` strips the entry id's locale folder, `getPostPath(entry)` rebuilds the localized path. Replaced the interim `/blog/<id>/` (= `/blog/<locale>/<slug>/`) scheme everywhere; Home + blog index now import `getPostPath`. The old per-page `postUrl` helpers are gone.
- **Cross-language link:** renders only when a `translationKey` counterpart exists in the other locale (uses the existing `blog.readInOtherLang` dict).
- Added `blog.olderPost`/`newerPost`/`morePosts` keys to both dicts.

**Decisions:** centralized all blog routing in `utils/blog.ts` (one source for slug↔path) rather than per-page helpers, since Home, index, and the post layout all needed it and were drifting. Chose `/blog/<slug>/` + `/ko/blog/<slug>/` (locale folder stripped) to match the site-wide EN-root / KO-`/ko/` scheme used by about/portfolio, instead of exposing the content folder in the URL. Tags in the post header are static (display-only) — the index filter is client-side with no URL param, so a tag link would be dead. Pagination labeled "Older/Newer post" (unambiguous for a blog) rather than Prev/Next. Per-post SEO is wired through BaseLayout (`ogImage`=heroImage) but full canonical/hreflang/per-post OG stays Stage 18.

**Verify:** `astro check` → 0 errors. `astro build` → succeeds; routes emit `/blog/{agent-readiness,welcome-digital-garden}/` + `/ko/blog/...`. **Seed pair:** cross-language link (`Read in 한국어 →` → `/ko/blog/agent-readiness/`) + prev/next render. **Temp rich post** (headings + code + table + footnote, built then removed) proved: `TOC` renders with links matching auto-generated heading IDs (`#first-section`…), GFM `<table>` + `data-footnotes` footnotes render, code block carries `data-language="js"` for CodeCopy. **Draft gating** carried over from the util (prod drops drafts). The two seed posts have no headings, so their TOC correctly self-omits.

**Files touched:** `src/layouts/BlogPost.astro` (rewritten), `src/utils/blog.ts` (new), `src/pages/blog/[...slug].astro` (rewritten), `src/pages/ko/blog/[...slug].astro` (new), `src/components/BlogIndexPage.astro` + `src/components/HomePage.astro` (use `getPostPath`), `src/i18n/en.json` + `src/i18n/ko.json` (older/newer/morePosts), `dev-references/plans/00-index.md`, `dev-references/plans/stage-17-blog-post.md`, `HANDOFF.md`.

**Next:** Stage 18 — SEO, feeds, sitemap, structured data (`stage-18-seo-feeds.md`): per-post/per-page SEO meta, hreflang alternates (the `BaseHead` TODO hook), JSON-LD, RSS feed(s) per locale, finalize OG. Depends on 13, 17 (done).

---

## 2026-06-28 — Stage 16: Blog index + filter (both locales)

**Did:** Built the Blog index for both locales as a shared `BlogIndexPage.astro` (fed by `lang`), with thin wrappers `pages/blog/index.astro` (replacing the legacy Bear Blog index) + new `pages/ko/blog/index.astro`.
- **Reverse-chron list:** every current-locale post as a `Card` — localized date · reading-time meta, title (links to post), `description` excerpt, `Tag`s. Responsive `auto-fill` grid. Content-driven (new post file → appears, no edits).
- **Tag filter:** chip row (`All` + each distinct blog tag in the locale, as interactive `Tag` buttons) reusing the Stage 15 pattern — toggles `[hidden]` on non-matching items + syncs `aria-pressed`. **Progressive enhancement:** no-JS shows the full list; the filter row only renders when the locale has tagged posts.
- **Draft exclusion:** `getCollection('blog', e => e.data.lang === lang && (import.meta.env.PROD ? !e.data.draft : true))` — drafts visible in `astro dev`, dropped from prod builds. A `draft` badge shows in the meta line when a draft is visible (dev).
- **Empty state:** `noPosts` message renders when a locale has zero posts (no broken layout).
- Added `blog.title` + `blog.intro` keys to both `en.json`/`ko.json` (parity compile-enforced).

**Decisions:** kept the same `[hidden]`/`aria-pressed` filter mechanism as Portfolio (Stage 15) for consistency and PE robustness. Used `import.meta.env.PROD` for draft gating (Astro-native, no env var). Post URLs still use the legacy `/blog/<id>/` scheme (the entry id includes the locale folder) — deliberately left for Stage 17 to finalize alongside the post layout. Blog leads on AI-for-knowledge-work tags only (media-tech tags are portfolio-only per the locked taxonomy), so the filter naturally never surfaces DRM/OTT tags.

**Verify:** `astro check` → 0 errors. `astro build` → succeeds; `/blog/` + `/ko/blog/` built. **Draft exclusion proven:** added a temp `draft: true` post, prod build → 0 occurrences in `dist/blog/index.html`; removed the temp file. EN dist lists both EN posts, correctly localized.

**Files touched:** `src/components/BlogIndexPage.astro` (new), `src/pages/blog/index.astro` (rewritten as wrapper), `src/pages/ko/blog/index.astro` (new), `src/i18n/en.json` + `src/i18n/ko.json` (blog.title/intro), `dev-references/plans/00-index.md`, `dev-references/plans/stage-16-blog-index.md`, `HANDOFF.md`.

**Next:** Stage 17 — Blog post layout + MDX features (`stage-17-blog-post.md`): rework the legacy `blog/[...slug].astro` post route + `BlogPost` layout into a localized post page (TOC, callouts, code copy from Stage 12), finalize the post routing scheme (centralized in `postUrl`). Depends on 12, 16 (done).

---

## 2026-06-28 — Stage 15: Portfolio page + filter (both locales)

**Did:** Built Portfolio for both locales as a shared `PortfolioPage.astro` (fed by `lang`), wrappers `pages/portfolio.astro` + new `pages/ko/portfolio.astro`.
- **Collection-driven grid:** renders every `portfolio` entry for the locale (ordered) as a `Card` — title, `role · org · period` meta, summary, `Tag`s. Responsive `auto-fill` grid (1 → 2 → 3 columns). Adding an entry = one file, no component edits (PRD acceptance).
- **Tag filter:** a chip row (`All` + each distinct tag in the locale's items, as interactive `Tag` buttons with `data-filter`). A small script toggles `[hidden]` on non-matching cards and syncs `aria-pressed`. **Progressive enhancement:** without JS every card is visible (the chips just don't filter). `:global(.pf-card[hidden])` overrides `.card{display:block}`.
- **Inline expandable cards:** native `<details>`/`<summary>` ("View details") reveal the entry's rendered body + any `links` (external) + a career→About-timeline cross-link — keyboard-operable, exposes open state, works with no JS. No `/portfolio/[slug]` route (stays P1).
- Covers all four buckets (product / talk-writing / side-ai / career). **Resolves the Home "View portfolio" CTA + featured-card links** (were 404).

**Decisions:** used native `<details>` for the expandable rather than a custom `aria-expanded` button — it's the most robust PE expandable (no-JS + keyboard + state for free). Filter is single-select (one tag or All); cards hidden via the `[hidden]` attribute (semantic, also hides from AT). `/portfolio/[slug]` deferred to P1 per the locked decision.

**Verify:** `astro check` → 0 errors. `astro build` → succeeds; `dist/portfolio/` + `dist/ko/portfolio/` exist (6 cards, 9 filter chips, 6 details each). **Verified live (Playwright):** clicking the `drm-content-security` chip filtered 6 → 2 visible cards and set its `aria-pressed=true`; "All" reset to 6; details expand. Screenshot confirmed the grid, filter row, and an expanded card.

**Files touched:** `src/components/PortfolioPage.astro` (new), `src/pages/portfolio.astro` + `src/pages/ko/portfolio.astro` (new), `dev-references/plans/00-index.md`, `dev-references/plans/stage-15-portfolio.md`, `HANDOFF.md`.

**Next:** Stage 16 — Blog index + filter (`stage-16-blog-index.md`): localized blog index (current-locale posts, tag filter), reworking the legacy `blog/index.astro`. Depends on 10, 11 (done). Then 17 (blog post layout + routing).

---

## 2026-06-28 — Stage 14: About page (both locales)

**Did:** Built About for both locales as a shared `AboutPage.astro` (fed by `lang`), with thin wrappers `pages/about.astro` (replacing the old lorem/BlogPost page) + new `pages/ko/about.astro`.
- **Headshot + monogram fallback:** `<img src="/images/daniel.jpg" onerror="this.remove()">` over a "DK" monogram circle — when the image is absent (it is, `TODO(daniel)`), the img removes itself and the monogram shows. Works with and without the file, no JS framework.
- **Bio:** paragraphs from `src/data/about.ts` (EN seed; KO stub `TODO(daniel)`), lead paragraph emphasized.
- **Skills / focus:** grouped Product / Domain / Technical / AI from a new `ABOUT_SKILLS` export (localized group labels, items drawn from Daniel's real background). New `about.skillsTitle` dict key.
- **Career timeline:** rendered **dynamically** from the `timeline` collection (current locale, ordered) via `TimelineItem` inside `<ol class="timeline">` — adding a timeline entry needs zero markup changes. `period` = `${start} – ${end}` (shows the `TODO(daniel)` date placeholders until filled).
- **Contact row:** email (`mailto:`) + LinkedIn `Button`s with localized labels.

**Decisions:** monogram fallback via inline `onerror` (simplest robust no-image path). Skill items kept as proper nouns / mostly shared across locales (technical terms); only group labels localized. The bio and timeline copy are seed/`TODO(daniel)` — not fabricated.

**Verify:** `astro check` → 0 errors. `astro build` → succeeds; `dist/about/` + `dist/ko/about/` exist. **Verified live (Playwright):** EN about renders the monogram (img auto-removed since the headshot 404s — the only console error, expected), **4 timeline items** + **4 skill groups**; the KO route shows the KO skills heading (기술과 관심사). Screenshot confirmed the avatar + vertical-rail timeline + contact layout.

**Files touched:** `src/components/AboutPage.astro` (new), `src/pages/about.astro` (rewritten wrapper), `src/pages/ko/about.astro` (new), `src/data/about.ts` (`ABOUT_SKILLS`), `src/i18n/en.json` + `ko.json` (`about.skillsTitle`), `dev-references/plans/00-index.md`, `dev-references/plans/stage-14-about.md`, `HANDOFF.md`.

**Still open `TODO(daniel)`:** KO bio native copy; timeline exact dates/orgs; the `/public/images/daniel.jpg` headshot.

**Next:** Stage 15 — Portfolio page + filter (`stage-15-portfolio.md`). Renders the portfolio collection with a tag/category filter; **resolves the Home "View portfolio" links**. Depends on 10, 11 (done).

---

## 2026-06-28 — Stage 13: Home page (both locales) — Phase 3 begins

**Did:** Built the Home page for both locales as a shared `HomePage.astro` fed by `lang`, with thin route wrappers `pages/index.astro` (en) + new `pages/ko/index.astro` (ko).
- **Hero:** name + tagline + subhead (from `HOME_HERO`/`consts`), primary CTA "View portfolio" + secondary "Read the blog" (localized via `home.*`), and an identity strip of focus-area chips (`HOME_HERO[lang].focusAreas` — the AI-knowledge-work chips per the locked positioning, not the old OTT/DRM ones).
- **Featured work:** the 3 `featured: true` portfolio entries for the current locale (ordered by `order`), as brand-glow `Card`s with title, summary, and `Tag`s.
- **Latest writing:** the 3 newest non-draft posts for the current locale, as `Card`s with `formatDate` · `formatReadingTime(readingTimeMinutes(body))`, description, and `Tag`s; graceful `blog.noPosts` empty state (no empty cards, PRD §7.4).
- **About teaser** card linking to `/about/`. All from collections, nothing hardcoded.
- **Creating `/ko/` resolves the language toggle** — the header/footer toggle's `/ko/` target is now a real page.

**Fixed a global bug found here:** there was **no `box-sizing: border-box`** anywhere, so `.container` (`width:100%` + `padding-inline`) overflowed the viewport — 32px of horizontal scroll at 375px. Added the universal border-box reset to `global.css`; overflow gone (scrollWidth == clientWidth at 375). This benefits every page, not just Home.

**Decisions:** identity chips are plain styled `<li>`s (not `Tag`, since focus-areas aren't taxonomy tags). Post URLs centralized in a `postUrl(id)` helper returning the current `/blog/<id>/` legacy scheme, with a `TODO(stage-16/17)` to switch to the canonical localized route in one place. Featured cards + the hero "View portfolio" CTA point at `/portfolio/` (resolves once Stage 15 lands).

**Verify:** `astro check` → 0 errors. `astro build` → succeeds; `dist/ko/index.html` exists. **Verified live (Playwright):** EN `/` and KO `/ko/` render locale-correct copy and the current locale's posts (EN→`/blog/en/*`, KO→`/blog/ko/*`); screenshots in light + dark; KO at **375px** reads well with the collapsed hamburger and **no horizontal overflow** after the box-sizing fix.

**Files touched:** `src/components/HomePage.astro` (new), `src/pages/index.astro` (rewritten to wrapper), `src/pages/ko/index.astro` (new), `src/styles/global.css` (box-sizing reset), `dev-references/plans/00-index.md`, `dev-references/plans/stage-13-home.md`, `HANDOFF.md`.

**Next:** Stage 14 — About page (both locales) (`stage-14-about.md`): render `src/data/about.ts` bio + the `timeline` collection via `TimelineItem`, contact links. Depends on 10, 12 (done). (15 Portfolio, 16 Blog index also open.)

---

## 2026-06-28 — Stage 12: core components B (Callout, Timeline, Code, TOC)

**Did:** Built the content-rendering primitives for About + blog posts, all token-only and verified in both themes.
- **`Callout.astro`** — variants note/tip/warning/important mapped to the semantic status tokens (`--color-{info,success,warning,error}` + `-bg`). Icon + title + body slot. Contrast kept AA by using the accent only for the left rail + icon, the heading color for the title, and primary text for the body (so it never relies on accent-on-tint legibility).
- **`TimelineItem.astro`** — one career entry: `title` (role), `org?`, `period?` + body slot. Vertical rail via `::before` with a brand dot marker; the rail auto-stops after the last item. Render inside `<ol class="timeline">` (About, Stage 14).
- **`TOC.astro`** — auto-built from Astro's `headings` (filtered h2–h3). Ships as a `<nav>` → `<details open>` → nested list that works with **no JS**; a script adds IntersectionObserver scroll-spy that toggles `.is-active`. Sticky ≥1024px.
- **`CodeCopy.astro`** — a runtime enhancer (drop once into the post layout, Stage 17): wraps every Shiki `<pre.astro-code>`, adds a language label (from `data-language`) and a keyboard-operable **copy button** that announces success via an `aria-live` region (async Clipboard API). Its injected nodes are styled in `global.css` (scoped styles can't reach runtime-created elements).
- **Config / global:** added `markdown.shikiConfig` with **dual themes** (`github-light` / `github-dark`, `wrap: true`) + a transformer that stamps each `<pre>` with `data-language`; added the `[data-theme="dark"] .astro-code` var-swap, the `.code-block*` chrome styles, and a global `@media (prefers-reduced-motion: reduce)` kill-switch to `global.css`. Added a `code.*` namespace (copy/copied/aria) to both dictionaries.

**Decisions:** Shiki dark theme is swapped under our own `[data-theme="dark"]` selector (not `prefers-color-scheme`) so code follows the manual toggle. Dropped an `execCommand` copy fallback — the modern Clipboard API covers every secure context (the site is HTTPS), and the fallback tripped a deprecation hint. TOC defaults to h2–h3 and degrades to a plain list without JS (PE).

**Verify:** `astro check` → 0 errors / 0 hints. `astro build` → succeeds. **Verified live (Playwright, throwaway MDX + Astro pages):** all 4 callout variants render AA-legible in **light and dark** (screenshots); the code block highlights and swaps light↔dark with a "JS" label; the copy button has the right text/`aria-label`/lang label and is keyboard-reachable (Clipboard rejects silently under headless — works in a real browser); TOC scroll-spy highlights the in-view section (scrolled to #two → its link got `is-active`), renders as a `nav` landmark with `details` open; 3 timeline items render. Threw the test pages + screenshots away after.

**Files touched:** `src/components/{Callout,TimelineItem,TOC,CodeCopy}.astro` (new), `astro.config.mjs` (shikiConfig), `src/styles/global.css` (shiki dark swap, `.code-block*`, reduced-motion), `src/i18n/en.json` + `ko.json` (`code.*`), `dev-references/plans/00-index.md`, `dev-references/plans/stage-12-components-core-b.md`, `HANDOFF.md`.

**Component API:** `Callout {variant?, title?}` + slot · `TimelineItem {title, org?, period?}` + slot · `TOC {headings, lang, minDepth?, maxDepth?}` · `CodeCopy {lang}` (drop once per post). Shiki theme: github-light / github-dark.

**Next:** Phase 3 (Pages). **Stage 13 — Home (both locales)** (`stage-13-home.md`) is the natural next step; 14/15/16/17 also unblocked now that components + content exist.

---

## 2026-06-28 — Stage 11: core components A (Button, Card, Tag)

**Did:** Built the three highest-reuse UI primitives, each token-only (reads CSS vars, zero literals), documented with a header comment block, and verified in both themes.
- **`Button.astro`** — `variant` primary/secondary/ghost, `size` md (≥44px target) / sm, renders `<a>` when `href` is set else `<button>` (`type`, `disabled`→ real disable or `aria-disabled`, `external`→ target/rel). Primary is **brand-filled** (not the §4 charcoal) so it stays visible/saturated in dark too; secondary = muted fill + hairline; ghost = transparent link-colored. States: hover (brightness/fill shift), active (1px translate), focus-visible (global ring), disabled (dimmed, no pointer events).
- **`Card.astro`** — slot-based surface, generous rounding (`radius-xl`), Level-1 shadow. `featured` → brand purple-glow shadow (§6) + faint brand hairline; `interactive` → lift on hover/`focus-within` with elevated shadow; `as` prop sets the element (default `<article>`).
- **`Tag.astro`** — maps a taxonomy **key → localized label** through new `tags.*` dictionary entries (added to en.json + ko.json for all 9 blog+portfolio tags), falling back to the bare key. Three modes by precedence: `interactive` → `<button aria-pressed>` (filter chip), else `href` → `<a>`, else static `<span>`. Pressed state = brand-tinted fill.

**Decisions:** primary button uses the brand fill rather than DESIGN §4's charcoal-dark CTA — the design doc is light-only, and a charcoal button would vanish on the dark page bg; brand blue is theme-safe and on-brand. Tag labels live in the i18n `tags.*` namespace (not hardcoded in the component) so they localize and stay in one place; the key is cast to `TranslationKey` and the component degrades to the raw key for any unknown tag.

**Verify:** `astro check` → 0 errors. Built a throwaway `zz-gallery` page rendering every variant/state, drove it with Playwright, and **captured full-page screenshots in light AND dark** — all confirmed on-brand and legible: button variants incl. disabled/small, base/interactive/featured cards (featured glow visible in both themes), and display/pressed/link tags. Deleted the gallery page + screenshots after. Focus-visible confirmed via the global ring.

**Files touched:** `src/components/Button.astro`, `src/components/Card.astro`, `src/components/Tag.astro` (all new), `src/i18n/en.json` + `ko.json` (`tags.*` labels), `dev-references/plans/00-index.md`, `dev-references/plans/stage-11-components-core-a.md`, `HANDOFF.md`.

**Component API (for pages to consume):**
- `Button` — `{ variant?, href?, type?, disabled?, size?, external?, class? }` + slot.
- `Card` — `{ as?, featured?, interactive?, class? }` + slot.
- `Tag` — `{ tag, lang, interactive?, pressed?, href?, label?, class? }`.

**Next:** Stage 12 — core components B (Callout, Timeline, Code block, TOC) (`stage-12-components-core-b.md`). Depends on 11.

---

## 2026-06-28 — Stage 10: seed content (EN/KO posts, portfolio, timeline)

**Did:** Populated all three collections so pages have real content and the "drop a file in" workflow is proven.
- **Blog:** `blog/en/{agent-readiness,welcome-digital-garden}.md` + `blog/ko/{agent-readiness,welcome-digital-garden}.md` — all `draft: false`, EN↔KO paired by `translationKey` (`agent-readiness`, `welcome`). KO is authored natively (合쇼체 draft, no em-dash), NOT machine-translated, each with a `TODO(daniel)` voice-refine marker per §13's rule.
- **Portfolio:** 6 EN + 6 KO entries mirrored by `translationKey` — AI-knowledge-work (lead), digital-garden, talks/DevRel, Multi-DRM, watermarking/anti-piracy, career — covering all four categories (`side-ai`/`talk-writing`/`product`/`career`). **3 marked `featured: true` per locale** (ai-knowledge-work, digital-garden, multi-drm) to surface on Home. Media-tech tags live only on portfolio items (per the split taxonomy); crossover items carry `ai-ready-docs`/`ai-knowledge-mgmt` too. KO summaries are `TODO(daniel)` native stubs.
- **Timeline:** 4 EN + 4 KO JSON entries mapping the arc Software Engineer (C/C++, Java) → Product Owner → Product Manager → Developer Relations (DoveRunner / PallyCon).
- **About prose:** new `src/data/about.ts` — EN bio (the §13.1 seed draft, 4 paragraphs) + a KO `TODO(daniel)` native stub. Positioning one-liners (§13.3) were already wired in `consts.ts` / `data/home.ts` from earlier stages (EN locked, KO locked tagline) — nothing to add.

**Decisions:** rather than leave KO collections empty, every KO entry exists with valid frontmatter and a clearly-marked `TODO(daniel)` for the native body/summary, so the KO Home/Blog/Portfolio pages (Stages 13/15/16) render instead of 404/empty — while honoring "author KO natively, don't MT." Exact dates, orgs, and metrics are `TODO(daniel)` placeholders (visible in UI by design until Daniel fills them), never fabricated. `heroImage`/`thumbnail` omitted (no assets yet) — schemas make them optional.

**Verify:** `astro check` → 0 errors. `astro build` → succeeds (7 pages). Confirmed: 3 featured portfolio items **per locale**; 2 non-draft posts **per locale**; `translationKey` pairs `agent-readiness`×2 + `welcome`×2 link EN↔KO; **23 files carry flagged `TODO(daniel)`** gaps. The off-taxonomy guard from Stage 09 still holds (media-tech tags rejected from blog).

**Open `TODO(daniel)` content gaps (for Daniel to fill):** (1) KO native copy — About bio, both KO blog posts' voice, all KO portfolio summaries, all KO timeline summaries; (2) portfolio metrics/results — Multi-DRM, watermarking, AI-knowledge-work, talks list; (3) exact dates & orgs — every timeline entry's `start`/`end` + the early-career employer(s), and the `period` on DRM/DevRel portfolio items.

**Files touched:** `src/content/blog/{en,ko}/*.md` (4), `src/content/portfolio/{en,ko}/*.md` (12), `src/content/timeline/*.json` (8), `src/data/about.ts` (new), `dev-references/plans/00-index.md`, `dev-references/plans/stage-10-seed-content.md`, `HANDOFF.md`.

**Note:** the legacy `blog/index.astro` + `blog/[...slug].astro` now render these posts (mixed-locale, un-localized routes) — that's expected; Stage 16/17 rework blog routing/layout.

**Next:** Stage 11 — core components A (Button, Card, Tag) (`stage-11-components-core-a.md`). Depends on 03, 04 (both done); now also has real content/tags to render against.

---

## 2026-06-28 — Stage 09: content collections & schemas (Phase 2 start)

**Did:**
- Replaced the minimal scaffold blog schema in `src/content.config.ts` with the full typed content model (PRD §9.1–9.3): **blog** + **portfolio** collections (md/mdx via `glob`), and a **timeline** data collection (json/yaml). Blog fields: `title, description, pubDate, updatedDate?, lang, tags[], draft(=false), translationKey?, heroImage?(image()), ogImage?(string)`. Portfolio: `title, role, org?, period, summary, category(enum), tags[], lang, links[]?(label+url), thumbnail?(image()), featured(=false), order?`. Timeline: `role, org, start, end, summary, lang, order?`.
- **Two separate, exported tag enums** enforcing the locked taxonomy split: `BLOG_TAGS` = `ai-knowledge-mgmt`/`automation`/`ai-ready-docs`/`ai-llm`/`pkm`/`solopreneur` (AI-for-knowledge-work only); `PORTFOLIO_TAGS` = `drm-content-security`/`ott-streaming`/`cloud-saas` **plus** the blog tags (for crossover items). Media-tech tags are deliberately absent from the blog enum, so they can never surface as a blog topic. Also exported `PORTFOLIO_CATEGORIES` (`product|talk-writing|side-ai|career`) and `Lang`/`BlogTag`/`PortfolioTag`/`PortfolioCategory` types for downstream components (Stage 11 Tag, 15/16 filters).
- Created the folder structure `src/content/{blog,portfolio}/{en,ko}/` + `src/content/timeline/` with `.gitkeep`s (real content seeds in Stage 10).
- Added `src/utils/readingTime.ts` — `readingTimeMinutes(body, lang)` returns whole minutes (EN: words/200; KO: non-space chars/500, since Korean isn't space-delimited; floor 1). Pairs with the i18n `formatReadingTime` for localized phrasing.

**Decisions:** **locale strategy = folder-by-locale + explicit `lang` field** (redundant on purpose: folders organize authoring, the field makes locale filtering explicit and move-proof — PRD §9.1 left the choice open). `heroImage` uses `image()` (optimized in-page asset) but `ogImage` is a plain string path (social crawlers need a URL, not an optimized asset; resolved to absolute in head at Stage 18). `links[].url` validated with a `.refine(/^https?:\/\//)` instead of the now-deprecated `z.string().url()` to keep `astro check` hint-free. Taxonomy enums + types live in `content.config.ts` and are imported elsewhere (single source of truth).

**Verify:** `astro check` → 0 errors / 0 hints. `astro build` → succeeds. **Schema enforcement proven:** dropped a throwaway blog post tagged `ott-streaming` (a portfolio-only tag) → build failed with `InvalidContentEntryDataError … tags.0: Invalid option: expected one of "ai-knowledge-mgmt"|…`; a sibling valid post passed. Reading-time util spot-checked via tsx (400 EN words → 2 min, 1000 KO chars → 2 min, empty → 1). Test files removed after.

**Files touched:** `src/content.config.ts` (full rewrite), `src/utils/readingTime.ts` (new), `src/content/{blog,portfolio}/{en,ko}/.gitkeep` + `src/content/timeline/.gitkeep` (new), `src/pages/about.astro` (pass `lang`/`tags`/`draft` to the legacy BlogPost layout so it type-checks under the stricter schema), `dev-references/plans/00-index.md`, `dev-references/plans/stage-09-content-collections.md`, `HANDOFF.md`.

**Next:** Stage 10 — seed content (`stage-10-seed-content.md`): author real (or placeholder) EN/KO blog posts, portfolio items, and timeline entries into the new folders. `TODO(daniel)` open: which PKM pieces seed the first 3–5 posts per locale. Depends on 09.

---

## 2026-06-28 — Stage 08: footer & global chrome wiring (Phase 1 complete)

**Did:**
- Rewrote `Footer.astro` as the MiniMax **dark footer** (DESIGN-minimax §2) — pinned to fixed brand tokens (`--color-charcoal` bg, `--color-text-on-dark` text) so it reads dark in **both** themes, not just light. Contents: i18n tagline, a social `<nav>` (LinkedIn + email `mailto:` + RSS, each with an inline icon + visible label), a built-with line, a dynamic `© {year} Daniel Kim`, and a secondary **LanguageToggle + ThemeToggle** for header/footer parity.
- Wired the real contact details into `consts.ts`: added `CONTACT_EMAIL = 'danielkimdev24@gmail.com'` and set `SOCIAL_LINKS.linkedin` to the real profile URL. **Dropped the `twitter` / `github` placeholder keys entirely** — per the locked 2026-06-28 decision there are no X/GitHub accounts yet, so they're omitted rather than scaffolded.
- Wired both `Header` and `Footer` into `BaseLayout`'s `header` / `footer` slots (the Stage 06 placeholder landmark markup is gone). RSS link points at the root `/rss.xml` for now with a `TODO(stage-18)` for per-locale feeds.

**Decisions:** social presence is **LinkedIn + email + RSS only** (locked) — no invented X/GitHub URLs, overriding the older stage-doc note that said to leave `TODO(daniel):` placeholders (the real values are now known). Footer toggles reuse the Stage 07 components as-is; because those scripts query *all* matching instances, the second (footer) instance needed zero extra JS — confirmed both footer toggles are live.

**Verify:** `astro check` → 0 errors (21 files). `astro build` → succeeds. **Verified live in a real browser (Playwright):** the footer background is `rgb(24,30,37)` (charcoal) in **both** light and dark themes (toggled theme, bg unchanged → stays dark); social labels render LinkedIn / Email / RSS feed; the footer carries exactly 2 toggles (lang + theme) for parity. `dist/index.html` confirms `href` = real LinkedIn URL + `mailto:danielkimdev24@gmail.com` + `/rss.xml`, copyright line present, and **no GitHub** anywhere (the only "twitter" strings are the legitimate `twitter:*` OG card meta in BaseHead, not a social link).

**Files touched:** `src/components/Footer.astro` (rewritten), `src/consts.ts` (`CONTACT_EMAIL` + real LinkedIn, dropped X/GitHub), `src/layouts/BaseLayout.astro` (slot in Footer), `dev-references/plans/00-index.md`, `dev-references/plans/stage-08-footer-chrome.md`, `HANDOFF.md`.

**Phase 1 (Foundation) is complete** — config, tokens, dark mode, fonts, i18n, layout shell, header, footer all done. **Next: Stage 09 — content collections & schemas** (`stage-09-content-collections.md`), the start of Phase 2 (Content engine). Define the blog + portfolio + timeline collections and their Zod schemas, including the two tag enums (blog vs portfolio per PRD §5) and the `translationKey` linkage for i18n.

---

## 2026-06-28 — Stage 07: header — nav + language & theme toggles

**Did:**
- Replaced the starter `Header.astro` with the real sticky **pill nav** (DESIGN-minimax §4): brand link → localized home, then Home · About · Portfolio · Blog. Labels come from the i18n dict (`t('nav.*')`); hrefs via `getLocalizedPath`; active item gets `.active` (pill indicator) + `aria-current="page"` (locale-agnostic match after stripping any `/ko` prefix). Below 768px the primary links collapse behind a hamburger; the toggles cluster collapses with it (closed bar = brand + hamburger). Mobile menu JS: open/close, `aria-expanded` + label swap (`common.openMenu`/`closeMenu`), focus moves to the first link on open and returns to the button on close, **Tab is focus-trapped** within the open menu, **Esc closes**, click-outside closes, and a desktop-resize listener drops the open state.
- `ThemeToggle.astro` (new) — a `<button>` honoring the Stage 03 contract: on click sets `localStorage.theme` + `<html data-theme>` and dispatches `theme-change`. Sun/moon icons swap via CSS keyed on `html[data-theme]`. A script syncs `aria-pressed` + `aria-label` (toLight/toDark) on load, on click, and on any `theme-change` event — so multiple instances (footer toggle in Stage 08) stay consistent. 44×44 target.
- `LanguageToggle.astro` (new) — a real navigation **link** (works without JS) to the current page's counterpart in the other locale, default = mirrored path via `getLocalizedPath(pathname, altLocale)`; accepts an explicit `href` override for pages lacking a 1:1 translation (PRD §7.3, used by Stage 16/17). Carries `hreflang`/`lang` for correct SR voice; persists the choice to `localStorage.lang` on click. Modeled as a link (not an aria-pressed button) since it navigates.
- Wired `Header` as the default content of BaseLayout's `header` slot. Added a `nav.primaryLabel` key ("Main navigation" / "주 메뉴") to both dictionaries for the `<nav>` aria-label.

**Decisions:** language toggle is a **link**, not a toggle button — navigation semantics (`hreflang`/`lang`) are more correct than `aria-pressed`, which the plan listed but fits a stateful button, not a navigation control. Toggles collapse with the mobile menu (closed bar stays minimal); revisit if Daniel wants the theme toggle always visible. The theme-toggle script targets *all* `.theme-toggle` instances so the future footer toggle is handled for free.

**Verify:** `astro check` → 0 errors (21 files). `astro build` → succeeds. **Verified live in a real browser via Playwright (preview build):** (1) theme toggle: light→dark sets `data-theme=dark`, `aria-pressed=true`, `localStorage.theme=dark`, label→"Switch to light theme"; second click reverts and persists `light`. (2) Mobile menu @375px: closed bar shows only the hamburger (links/cluster hidden); opening sets `data-open`, reveals links, `aria-expanded=true`, label→"Close menu", and moves focus to the first nav link; Esc closes and resets `aria-expanded`. Inspected `dist/index.html`: localized labels, `aria-current` on Home, lang toggle `href="/ko/"` + `hreflang="ko"`, theme button ARIA + data-labels.

**Known limitation (expected):** the language toggle's target (`/ko/...`) 404s until **Stage 13** builds the KO routes. The toggle logic is correct; only the destination pages don't exist yet.

**Files touched:** `src/components/Header.astro` (rewritten), `src/components/ThemeToggle.astro` + `src/components/LanguageToggle.astro` (new), `src/layouts/BaseLayout.astro` (render Header), `src/i18n/en.json` + `ko.json` (`nav.primaryLabel`), `dev-references/plans/00-index.md`, `dev-references/plans/stage-07-header-nav-toggles.md`, `HANDOFF.md`. (Old `HeaderLink.astro` is now unused — left in place; remove in a later cleanup.)

**Next:** Stage 08 — footer & global chrome wiring (`stage-08-footer-chrome.md`). Footer with social row (LinkedIn + email only — no X/GitHub), language/theme parity, and wiring `SOCIAL_LINKS` in `consts.ts` to the real values. Depends on 07.

---

## 2026-06-28 — Stage 06: base layout shell & landmarks

**Did:**
- Created `src/layouts/BaseLayout.astro` — the canonical shell every page renders through. Props: `title`, `description`, `lang: Lang`, `ogImage?`, `noindex?`. Owns the document scaffold: `<html lang={lang}>` (drives the `:lang(ko)` font rules from Stage 04), `<head>` via `BaseHead` (which includes the no-flash `ThemeScript` from Stage 03 before paint), a **skip-to-content** link as the first focusable element (→ `#main`), and the `header` / `main#main` / `footer` landmarks. Header and footer are **placeholder named slots** with empty-landmark fallbacks — Stage 07/08 inject the real chrome.
- Refactored `BaseHead.astro`: added a `noindex?` prop (emits `<meta name="robots" content="noindex, nofollow">`) and an hreflang/og:locale TODO hook for Stage 18. No behavior change for existing callers.
- `global.css`: added a `.container` / `.container--prose` layout utility (full-bleed-by-default; sections opt into the max measure + responsive gutter per DESIGN-minimax §1) and a single global `:focus-visible` ring (a11y baseline for the whole shell). `BaseLayout`'s scoped styles override the legacy prose-width `main` rule (full-width flow region) and make `<body>` a flex column so the footer sits at the bottom on short pages.
- Migrated `index.astro` onto `BaseLayout` as a minimal placeholder (name/tagline/subhead from `consts`/`home.ts`) — the full home build (identity strip, latest writing, CTAs) is Stage 13.

**Decisions:** pages are **full-bleed by default**; content opts into `.container` rather than `main` hard-constraining width (the old scaffold `main { width: 720px }` only suits article pages, reworked in 16/17). Header/footer kept as named slots, not direct component renders, so the shell stays valid before Stages 07/08 exist. One global focus ring lives in `global.css` so every interactive element inherits a visible keyboard indicator.

**Verify:** `astro check` → 0 errors (19 files). `astro build` → succeeds. Inspected `dist/index.html`: `<html lang="en">`, the skip link is the first element in `<body>` (`href="#main"`), `header`/`main#main`/`footer` landmarks present in order, no stray `noindex`. Theme script still in `<head>` before paint (Stage 03). KO `lang="ko"` mechanism proven via the `lang` prop — no `/ko/` routes render it yet (Stage 13+).

**Files touched:** `src/layouts/BaseLayout.astro` (new), `src/components/BaseHead.astro` (noindex + hreflang hook), `src/styles/global.css` (`.container` + focus ring), `src/pages/index.astro` (migrated to shell), `dev-references/plans/00-index.md`, `dev-references/plans/stage-06-base-layout.md`, `HANDOFF.md`.

**Next:** Stage 07 — header: nav + language & theme toggles (`stage-07-header-nav-toggles.md`). Real `<header>` chrome injected into BaseLayout's `header` slot, using the i18n dictionaries (Stage 05) and the theme-toggle contract (Stage 03). Depends on 06.

---

## 2026-06-28 — Stage 05: i18n utilities & UI dictionaries

**Did:**
- Created `src/i18n/en.json` + `src/i18n/ko.json` — per-locale UI string dictionaries covering all chrome, nested by surface: `nav`, `lang` (toggle), `theme` (toggle), `footer`, `blog` (reading-time, "Read in…", TOC, filters, empty states), `portfolio`, `home`, `about`, `notFound` (404), `common`. KO authored natively (not machine-translated). Identical key shape across both.
- Created `src/i18n/utils.ts` with the helpers every downstream component depends on: `type Lang = 'en'|'ko'`, `defaultLang`, `languages` label map, `getLangFromUrl(url)` (reads `/ko/` prefix), `useTranslations(lang)`→`t(key, params?)` (typed dot-path lookup over the nested dict, EN fallback, then raw-key fallback, with `{token}` interpolation), `getLocalizedPath(path, lang)` (en→root, ko→`/ko` prefix; idempotent; passes through `http`/`mailto`/`tel`/`#`), `getAltLocale(lang)`, `formatDate(date, lang)` (Intl, `en-US`/`ko-KR`), `formatReadingTime(minutes, lang)` (1-min floor, localized phrasing).
- **Key-parity guard:** `ko satisfies typeof en` makes any missing/extra key in `ko.json` a compile error under `astro check`. A recursive `NestedKeyOf` type narrows `t()`'s argument to keys that actually exist (e.g. `'blog.readingTime'`).

**Decisions:** dictionary keys are nested-by-surface objects looked up by **dot path** (`t('nav.blog')`) — this is the namespace convention all later component stages follow. `t()` interpolates `{token}` placeholders (used by reading-time). en.json is the canonical shape; ko is type-checked against it rather than the reverse.

**Verify:** `astro check` → 0 errors (19 files). Ran a throwaway `_i18n-test.astro` page + a `tsx` runtime check confirming: `getLocalizedPath('/about/','ko')`→`/ko/about/`, `('/about/','en')`→`/about/`, `('/ko/blog/','en')`→`/blog/` (strips prefix), `('/','ko')`→`/ko/`, idempotent on `/ko/about/`; `formatReadingTime(0,'ko')`→`1분 분량` (floor); dates `June 28, 2026` / `2026년 6월 28일`; `getLangFromUrl` reads `/ko/` correctly. Removed the throwaway page after.

**Files touched:** `src/i18n/en.json`, `src/i18n/ko.json`, `src/i18n/utils.ts` (all new), `dev-references/plans/00-index.md`, `dev-references/plans/stage-05-i18n-utilities.md`, `HANDOFF.md`.

**Next:** Stage 06 — base layout shell & landmarks (`stage-06-base-layout.md`): the shared page shell with semantic landmarks, `<html lang>` per locale, skip link, theme/font wiring. Depends on 03, 04, 05.

---

## 2026-06-28 — Stage 04: typography & font wiring

**Did:**
- Wired the configured fonts into every page via Astro's `<Font>` component (`import { Font } from 'astro:assets'`) in `BaseHead.astro`. Each `<Font cssVariable>` emits the family's `@font-face` set **and** defines its `--font-*` var — so all five families must be rendered or their var falls back to Helvetica. Rendered DM Sans + Pretendard with `preload` (the primary EN/KO body faces); Outfit, Poppins, Roboto without preload (load on demand, `font-display: swap` from config).
- The role→font bindings (`--font-ui/display/heading/data/korean/body` → the `--font-*` vars) were already in `tokens.css` from Stage 02 — confirmed they map per DESIGN-minimax §3 (DM Sans body/UI, Outfit display, Poppins mid-tier, Roboto data).
- **Korean (`:lang(ko)`):** swap `--font-body/-ui/-display/-heading` to `--font-korean` (Pretendard → Noto Sans KR), since the Latin display faces carry no Hangul. `--font-data` stays Roboto (code/Latin numerals). Added `body:lang(ko)` reading tweaks: `line-height: var(--leading-relaxed)` (1.7), `letter-spacing: -0.01em`, `word-break: keep-all` (no mid-cluster breaks). Scoped to `body` so heading line-heights are untouched.
- Replaced the `TODO(stage-04)` font marker in `BaseHead`; confirmed no Atkinson references remain anywhere in `src/`.

**Decisions:** preload only the two primary body faces (DM Sans EN / Pretendard KO) to limit preload bytes; secondary display faces load on demand. Korean body leading set to 1.7 (reuses `--leading-relaxed`).

**Verify:** `astro check` → 0 errors. `astro build` → succeeds. Inspected `dist/index.html` + built CSS: all five `--font-*` vars defined and resolving to real (hashed) faces; `optimizedFallbacks` emitted capsize-metric fallback faces (`DM Sans-… fallback: Arial`) → no CLS on swap; **preload links limited to DM Sans + Pretendard only** (confirmed via `filterPreloads(false) → null`, so the non-preload families emit none); `:lang(ko){--font-*:var(--font-korean)}` and `body:lang(ko){…keep-all}` both present (body prefix preserved through minify). EN computed fonts trace correctly (body→DM Sans, h1→Outfit). **KO computed-style not eyeballed** — no `/ko/` routes exist yet (Stage 13+); the CSS mechanism is verified in the bundle. Live browser check still blocked by the Chrome-extension localhost permission issue.

**Files touched:** `src/components/BaseHead.astro` (Font import + tags), `src/styles/tokens.css` (`:lang(ko)` overrides + KO body tuning), `dev-references/plans/00-index.md`, `dev-references/plans/stage-04-typography-fonts.md`, `HANDOFF.md`.

**Next:** Stage 05 — i18n utilities & UI dictionaries (`stage-05-i18n-utilities.md`): helpers for locale detection / path building and the EN/KO UI string dictionaries. (Depends only on 01; unblocks the layout shell in Stage 06.)

---

## 2026-06-28 — Stage 03: dark token set & no-flash theme switching

**Did:**
- Added a **dark theme** as a `[data-theme="dark"] { … }` override block in `src/styles/tokens.css` — re-binds the same semantic variable names so every token-consuming component restyles with zero per-component dark CSS. Derived from the MiniMax light palette (DESIGN-minimax is light-only per its §8 note):
  - Surfaces → near-black `#181e25`/`#18181b` family, layered by depth (`--color-bg` `#15181d` → `--color-surface` `#1c2129` → `--color-bg-muted` `#232a33`); borders `#2e353f`/`#262c34`.
  - Text ramp inverted (`#e6e8eb` body → `#f4f5f7` heading → `#aab2bd` secondary → `#828b96` muted); `--color-text-on-brand` left white.
  - Brand/links lightened for legibility on near-black (`--color-brand` → primary-500 `#3b82f6`; links → primary-light `#60a5fa`, hover `#93c5fd`). Status colors → brighter fg + desaturated dark-tint bg. Glass overlay flipped to dark translucent.
  - Shadows deepened (black 0.45–0.55) since soft shadows read poorly on dark; brand glow shifted blue (`rgba(96,165,250,…)`) since purple barely registers. `color-scheme: light|dark` set per theme for native UI.
- Created `src/components/ThemeScript.astro` — an **`is:inline` no-flash resolver** that runs in `<head>` before paint: reads `localStorage.theme` (`'light'|'dark'`), else falls back to `prefers-color-scheme`, and writes `data-theme` on `<html>`. Wired it as the first thing in `BaseHead`'s head so all pages get it. No-JS clients degrade to the light `:root` defaults.
- **Resolution order:** explicit `data-theme` attribute wins; the script resolves system pref into the attribute before paint, so CSS only needs the explicit-dark selector (no duplicated `@media` block).
- Documented the **toggle contract** for Stage 07 (in both `tokens.css` and `ThemeScript.astro`): storage key `theme`, attribute `data-theme` on `<html>`, and on toggle dispatch `new CustomEvent('theme-change', { detail: { theme } })` on `window`.

**Decisions:** dark palette values are **derived** here (not in DESIGN-minimax) — recorded so they're swappable if Daniel redesigns. No-JS → light is the accepted degradation (avoids a duplicated `prefers-color-scheme` token block).

**Verify:** `astro check` → 0 errors. `astro build` → succeeds (only the pre-existing harmless "blog collection empty" warning). Confirmed in `dist`: the inline theme script is emitted inline (not externalized/deferred) in built HTML, and `[data-theme=dark]{…}` + `color-scheme` are in the built CSS. WCAG AA spot-check (computed): all dark text/bg pairs pass — body 14.5:1, secondary 8.3:1, muted 5.15:1, link-on-surface 6.4:1, status colors 6.4–10.2:1. Browser-devtools eyeballing of the live toggle was **not** done — the Chrome extension can't load `localhost` (site-permission block, same as Stage 02); relied on build-artifact + contrast verification instead.

**Files touched:** `src/styles/tokens.css` (dark block), `src/components/ThemeScript.astro` (new), `src/components/BaseHead.astro` (import + render ThemeScript), `dev-references/plans/00-index.md` (Stage 03 → Done), `dev-references/plans/stage-03-dark-mode.md` (boxes), `HANDOFF.md`.

**Next:** Stage 04 — typography & font wiring (`stage-04-typography-fonts.md`): preload primary fonts (DM Sans / Pretendard) via `<Font />` in BaseHead (there's a `TODO(stage-04)` marker there), apply the role fonts, and wire Korean glyph switching for `/ko/`.

---

## 2026-06-28 — Stage 02: design token layer (light theme)

**Did:**
- Created `src/styles/tokens.css` — the centralized, swappable token source of truth (light theme only; dark set is Stage 03). Every value traces to a `DESIGN-minimax.md` section via inline comments:
  - **Color** (§2): brand (`#1456f0`), brand-deep, sky, decorative pink (`#ea5ec1`, commented logo/decorative-only — never text/buttons per §7), the blue primary ramp (200→700), a neutral gray ramp (named swatches from §2 + interpolated fills), and semantic surface/text role aliases (`--color-bg`, `--color-text`, `--color-border`, etc.). Status colors: success bg `#e8ffea` from §2; warning/error/info derived with a `TODO(daniel)` to confirm hues.
  - **Spacing** (§5): 8px-based scale named to the source steps (`--space-px` … `--space-20`).
  - **Radius** (§5): `--radius-xs`(4) → `-sm`(8) → `-md/lg/xl/2xl` → `--radius-pill`(9999px).
  - **Shadows** (§6): `--shadow-sm`, `-ambient`, `-brand-glow` (purple-tinted `rgba(44,30,116,0.16)`), `-brand-glow-offset`, `-lg` — all ≤0.16 opacity.
  - **Typography** (§3): font-role vars mapped to the `--font-*` vars from `astro.config.mjs` (`--font-ui/display/heading/data/korean/body`), a compact size scale (`--text-3xs`…`--text-display`/5rem), weights (500 default emphasis), and line-heights (universal 1.5; 1.1 tight, 1.7 relaxed).
  - **Motion**: `--motion-fast` 150ms / `--motion-base` 250ms + standard ease, with a documented `prefers-reduced-motion` note. Plus layout `--container-max`/`--container-prose`.
- Wired `src/styles/global.css`: `@import './tokens.css';` ahead of all resets; migrated every base element rule (body/headings/links/code/blockquote/etc.) off the hardcoded Bear Blog literals onto the new tokens. Kept the legacy `:root` (`--accent`/`--black`/`--gray*`/`--box-shadow`) as a clearly-flagged **deprecated** block — still consumed by un-reworked scaffold (Header/Footer/BlogPost/blog-index), to be deleted in Stages 07/08/16/17.

**Decisions:** none new — all values sourced from locked `DESIGN-minimax.md`. Status (warning/error/info) hues are placeholders pending Daniel.

**Gotcha logged:** a `*/` accidentally embedded mid-text in a CSS comment (`--gray*/--box-shadow`) silently closed the comment early and broke the lightningcss minify pass during `astro build` (cryptic "Expected identifier in class selector"). Fixed by rewording. Watch for literal `*/` sequences inside CSS comments.

**Verify:** `astro check` → 0 errors/warnings/hints. `astro build` → succeeds (only the pre-existing harmless "blog collection empty" warning). Token values confirmed in served output via a temporary `token-test.astro` swatch/type page (since deleted) — brand `#1456f0`, pill `9999px`, brand-glow `rgba(44,30,116,0.16)`, display `5rem` all resolved. Browser screenshot of the swatch page was blocked by a Chrome-extension localhost permission issue; non-blocking, verified via served HTML/CSS instead.

**Files touched:** `src/styles/tokens.css` (new), `src/styles/global.css`, `dev-references/plans/00-index.md` (Stage 02 → Done), `HANDOFF.md`.

**Next:** Stage 03 — dark mode token set & theme switching (`stage-03-dark-mode.md`): derive a dark token set overriding the same variable names under `[data-theme="dark"]`, both themes WCAG AA.

---

## 2026-06-27 — Positioning pivot to AI-for-knowledge-work; title/tagline set

**Did:**
- Recommended and set the site **title + tagline** (EN + KO) in `src/consts.ts` (`SITE_TITLE_HOME`, `SITE_TAGLINE`, `SITE_DESCRIPTION_BY_LOCALE`; legacy scalar `SITE_DESCRIPTION` retained, derived from EN) and seeded the home hero in new `src/data/home.ts` (`HOME_HERO` with name/tagline/subhead/`focusAreas`). KO authored natively via the `daniel-writing-style` skill (합쇼체, no em-dash), not translated.
- **Repositioned the site** per Daniel: blog now leads on **AI for knowledge work** — AI knowledge management, automation, and AI-readiness ("Agent Readiness" / 에이전트 준비도) of technical docs. Media-tech/OTT/DRM demoted from the headline to **credibility substrate in About/Portfolio only** ("career as proof, not a second topic" — Bridge angle).
- Swapped KO term to **에이전트 준비도** (with `(Agent Readiness)` 병기 in the description) per the style profile; updated the home focus chip.
- Realigned the PRD: **§5** taxonomy split into blog tags (`ai-knowledge-mgmt`, `automation`, `ai-ready-docs`, `ai-llm`, `pkm`, `solopreneur`) vs. portfolio tags (`drm-content-security`, `ott-streaming`, `cloud-saas` + crossover); **§6.1** identity strip rewritten to the AI pillars; **§1/§2/§13** rewritten to encode the throughline (AI focus, career as proof) incl. a tightened §13.1 About bio and reordered §13.4 portfolio (AI/agent-ready-docs lead item first); **§15** logs the decision.
- Updated plan **Stage 09** to define the two-enum (blog vs portfolio) taxonomy.

**Decisions (locked):**
- **Positioning:** Bridge angle — AI-for-knowledge-work foregrounded; media-tech career as credibility substrate (About/Portfolio only).
- **Taxonomy:** split blog vs portfolio tag sets (two enums in the content schema).
- **Title/tagline (EN/KO):** recorded in `HANDOFF.md` Locked decisions.

**Verify:** Korean strings em-dash-free; old "AI-for-media / senior media-tech operator" framing cleared; legacy `SITE_DESCRIPTION` export intact (starter imports unbroken). Full `astro check`/`build` to be run locally (sandbox arch mismatch).

**Files touched:** `src/consts.ts`, `src/data/home.ts` (new), `dev-references/astro-site-prd.md` (§1, §2, §5, §6.1, §13, §15), `dev-references/plans/stage-09-content-collections.md`, `HANDOFF.md`.

**Next:** Daniel to confirm KO register choices (디지털 가든 loanword; 프로덕트 vs 제품) and optionally have the style skill finish the §13.2 KO About draft. Build continues at Stage 02 (design tokens).

---

## 2026-06-27 — Stage 01 complete: foundation config & repo hygiene

**Did:**
- Added `output: 'static'` to `astro.config.mjs` (explicit static build for Cloudflare Pages); confirmed the already-locked `site`, i18n, sitemap-i18n, and font config.
- Pinned Node with `.nvmrc` = `22.12.0`; `package.json` `engines.node` (`>=22.12.0`) is satisfied by the pin.
- Rewrote `src/consts.ts`: `SITE_TITLE` ("Daniel Kim"), `SITE_DESCRIPTION` (PRD §8.2 positioning line), `SITE_AUTHOR`, `DEFAULT_OG_IMAGE` (`/og-default.png`, asset TODO), and `SOCIAL_LINKS` (LinkedIn/X/GitHub placeholders, `TODO(daniel)`).
- Created `public/_headers` (Cloudflare Pages): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, a `Permissions-Policy`, a baseline CSP, and `immutable` long-cache for `/_astro/*`.
- Removed the 5 starter posts (`first-post`, `second-post`, `third-post`, `markdown-style-guide`, `using-mdx`) and the Atkinson `.woff` files. Cleared the leftover `--font-atkinson` references in `BaseHead.astro` (removed the `<Font>` preload + unused import) and `global.css` (now `var(--font-dm-sans)`), both with `TODO(stage-04)` notes — grep for `atkinson`/`first-post`/`using-mdx` is now clean.
- Installed `@astrojs/check` + `typescript` (devDeps) to run `astro check`.

**Verify:**
- `npx astro check` → **0 errors, 0 warnings, 0 hints** (15 files).
- `npm run build` → **succeeds**, 3 pages + sitemap, fonts copied (12 files). The "collection blog is empty" log is expected/harmless until Stage 10 seeds content.
- `grep -ri "atkinson\|first-post\|using-mdx" src/ astro.config.mjs` → no matches.

**Files touched:** `astro.config.mjs`, `.nvmrc` (new), `src/consts.ts`, `public/_headers` (new), `src/components/BaseHead.astro`, `src/styles/global.css`, deleted `src/content/blog/*` + `src/assets/fonts/atkinson-*.woff`, `package.json`/lockfile (check deps). Plan/status: `plans/00-index.md`, `plans/stage-01-foundation-config.md`.

**Next:** Stage 02 — Design tokens (light), per `plans/stage-02-design-tokens-light.md` (values from `DESIGN-minimax.md`).

---

## 2026-06-27 — astro.config patched; P0 build plan decomposed into stage docs

**Did:**
- Patched `astro.config.mjs` to the locked decisions: `site: 'https://danielkimdev.com'`, Astro i18n (`defaultLocale: 'en'`, `locales: ['en','ko']`, `prefixDefaultLocale: false`), `@astrojs/sitemap` i18n config for hreflang, and the locked font stack — DM Sans/Outfit/Poppins/Roboto via `fontProviders.google()` and Pretendard via `fontProviders.fontsource()` (Noto Sans KR fallback), each exposed as a `--font-*` CSS variable. Replaced the scaffold's local Atkinson setup.
- Verified config syntax + field names against the Astro 7 font/i18n schema. Could not run a full `astro build` (sandbox is linux-arm64; repo `node_modules` are macOS — rolldown native binary mismatch). Builds fine locally.
- Reviewed `dev-references/astro-site-prd.md` and decomposed **P0** into **21 session-sized (~20–30 min) stage docs** + a master index in `dev-references/plans/` (`00-index.md` + `stage-01`…`stage-21`). Each stage has goal, depends-on, PRD/DESIGN refs, task checkboxes, files-to-touch, acceptance criteria, verify step, handoff note. Index has dependency table, critical path, P1/P2 backlog, and a per-stage status column.

**Decisions (locked/confirmed):**
- Content-collection locale strategy (recommended in plan): folder-by-locale (`blog/en`, `blog/ko`, …) **plus** a `lang` field.
- Primary dev tool going forward: **Claude Code** (local toolchain) — Cowork can edit but not build/run this repo.
- Plan scope is **P0 only** for now; P1/P2 to be decomposed after v1 ships.

**Files touched:** `astro.config.mjs`, `dev-references/plans/` (new: `00-index.md` + 21 stage docs), `HANDOFF.md`, `WORKLOG.md`.

**Next:** Finish Stage 01's remaining items (`output: 'static'`, `.nvmrc`, `consts.ts`, `public/_headers`, remove starter posts/fonts), then Stage 02 (light design tokens). Outstanding `TODO(daniel)`: social URLs, headshot, seed-post selection, native KO copy.

## 2026-06-26 — Project setup: PRD finalized, handoff docs created

**Did:**
- Added a "Project" overview section to `AGENTS.md` pointing future sessions to the PRD (`dev-references/astro-site-prd.md`).
- Wired `dev-references/DESIGN-minimax.md` into the PRD as the visual design source of truth (PRD §8): set precedence rules, mapped color/typography/radius/shadow tokens, resolved the accent-color question to MiniMax brand blue, and updated fonts (§7.6) to DM Sans / Outfit / Poppins / Roboto + Pretendard for Korean.
- Folded Daniel's open-question answers into the PRD and resolved §15 items.

**Decisions (locked):**
- Domain `danielkimdev.com` (Cloudflare Registrar); deploy via Cloudflare Pages (`wrangler` configured).
- i18n: `defaultLocale: "en"`, `prefixDefaultLocale: false` — English at root, Korean under `/ko/`. Updated IA (§5), routing (§7.1), hreflang (§7.5) accordingly.
- Dark mode derived from MiniMax light palette; tokens kept centralized/swappable (Daniel may redesign later).
- Analytics: Cloudflare Web Analytics. Portfolio detail: inline expandable cards (v1). Social: LinkedIn, X, GitHub.

**Files touched:** `AGENTS.md`, `dev-references/astro-site-prd.md`, `HANDOFF.md` (new), `WORKLOG.md` (new).

**Next:** Awaiting go-ahead to start Phase 1 (tokens + layout shell + i18n routing + nav/toggles) vs. scaffolding the full skeleton first. Outstanding `TODO(daniel)`: social URLs, headshot, seed-post selection.
