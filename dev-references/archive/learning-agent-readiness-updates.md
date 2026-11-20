# Agent Readiness Implementation Log

Running log of findings, surprises, and deviations from the skill template during
the danielkimdev.com rollout. This feeds back into upgrading the skill.

**Site:** danielkimdev.com  
**Platform:** Cloudflare Pages (static)  
**Stack:** Astro (no Starlight), bilingual EN/KO, `output: 'static'`  
**Started:** 2026-07-07  
**Finished:** 2026-07-07  
**Skill version used:** 0.1.0  
**Final score:** 99/100 (A) — 0→99 in one session

---

## Pre-flight: afdocs CLI vs. Fern/AFDocs web UI

**Finding:** The Fern Agent Score web UI (fern.dev) gates scanning to "documentation
sites" and rejected danielkimdev.com outright. The `npx afdocs` CLI has no such
gate — it ran immediately and returned a real 0/100 (F) score with full check output.

**Implication for skill:** The skill references
`npx afdocs check https://example.com --format scorecard` as the validation tool.
That's correct. The web UI is a dead end for personal sites / blogs; always use the
CLI. Add a note to the skill that web-UI-based scanners (Fern, isitagentready.com)
may gate on site type — the CLI is the reliable path.

**afdocs version installed:** 0.18.7 (auto-installed via npx)

---

## Site-specific adaptations from the skill template

The skill's examples assume a Starlight `docs` collection and a `Banner` component.
This site needed these adjustments:

### Content collection shape
- Skill template uses `getCollection('docs')`, IDs like `getting-started.md`
- This site uses `getCollection('blog')`, IDs like `en/post-slug` (locale-prefixed)
- Slug derivation: strip `^(en|ko)/` prefix (matches existing `getPostSlug()` in `utils/blog.ts`)
- Blog URLs are `/blog/<slug>/` not `/<slug>/` — so markdown siblings are at
  `/blog/<slug>.md`, not `/<slug>.md`
- Portfolio similarly: `en/slug` → `/portfolio/<slug>.md`

### No single catch-all .md endpoint
- Skill template shows one `src/pages/[...slug].md.ts` for the whole site
- This site has two separate content types at different URL prefixes, so two endpoints
  are cleaner: `src/pages/blog/[slug].md.ts` and `src/pages/portfolio/[slug].md.ts`
- Static pages (Home, About, Blog index, Portfolio index) have no content-collection
  entry, so they need separate hand-written `*.md.ts` endpoints

### Body directive location
- No Starlight `Banner` slot — injected directly in `BaseLayout.astro` after the
  existing skip link (`<a class="skip-link">`)

### llms.txt page source
- EN blog posts only (Layer 1 scope)
- Static pages listed as a flat section (hand-maintained descriptions, not from collection)
- KO locale deferred as a fast-follow

---

## Layer 1 findings

### Layer 1 achieved 94/100 before any middleware

After deploying Layer 1 (llms.txt, robots.txt, .md siblings, body directive, _headers)
but before deploying the middleware, afdocs returned **94/100 (A)**. The host-agnostic
pieces alone carried most of the weight. This validates the skill's "build in layers"
guidance.

### The llms.txt "static pages" problem

**Initial approach:** linked static pages (Home, About, Blog, Portfolio) in `llms.txt`
as pretty HTML URLs (`/`, `/about/`, etc.) since they have no collection entry.

**Problem:** `llms-txt-links-markdown` FAIL — scanner fetched those URLs, got HTML back,
failed the check because all llms.txt links are expected to point to markdown content.

**Fix:** Created hand-written `*.md.ts` endpoint for each static page, and updated
`llms.txt` to link to `/index.md`, `/about.md`, `/blog/index.md`, `/portfolio/index.md`.

**Lesson for skill:** The skill's template only shows `llms.txt` for a `docs` collection
where every page already has a `.md` sibling. For sites with static/non-collection pages,
the skill should explicitly note:
1. Static pages that don't come from a content collection still need `.md` endpoints
   (hand-written `*.md.ts` files) or they'll break `llms-txt-links-markdown`.
2. All links in `llms.txt` must point directly to `.md` URLs, not pretty HTML URLs —
   even for "index" pages. The scanner fetches each link and expects `text/markdown`.

---

## Layer 2 findings (Cloudflare Pages middleware)

### The `_middleware.ts` + `env.ASSETS.fetch()` pattern works

Confirmed: `functions/_middleware.ts` with `env.ASSETS.fetch()` intercepts
`Accept: text/markdown` requests correctly and serves pre-built `.md` assets.
No unexpected behavior — the design in `references/cloudflare-pages.md` was correct.

### Trailing-slash handling: Pages normalises BEFORE middleware

Confirmed via curl: Cloudflare Pages sends the redirect from `/blog/post-slug` to
`/blog/post-slug/` *before* the middleware sees the request. The middleware receives
the trailing-slash form. Stripping the trailing slash with `.replace(/\/$/, '')` and
appending `.md` works correctly for post pages.

**Important:** This means the non-trailing-slash → trailing-slash redirect happens
*outside* the middleware's control. The `Accept` header is preserved across this
redirect (CF Pages doesn't strip it). So we don't need to handle the non-trailing-slash
form specially in the middleware — the redirect delivers the trailing-slash form, and the
middleware handles that. This contradicts the Vercel concern in the skill where the
non-trailing-slash form was the bug — on CF Pages, it's not an issue.

### Section index pages: `.md` not at `<path>.md` but `<path>/index.md`

**Problem:** The initial middleware stripped trailing slash from `/blog/` → `/blog` →
looked for `/blog.md` (doesn't exist) → fell through to HTML. The section index page's
markdown sibling is actually at `/blog/index.md`.

**Fix:** Two-step fallback in the middleware:
1. Try `<stripped-path>.md` (covers post/item pages: `/blog/post-slug.md`)
2. If 404, try `<stripped-path>/index.md` (covers section roots: `/blog/index.md`, `/index.md`)

This also handled the root `/` case cleanly — `/`.replace(/\/$/, '') = `''` →
`/index.md` on the second try.

**Lesson for skill:** The skill's middleware sample only tried `<path>.md`. It needs a
note that section-index pages (directory roots with an `index.html`) require the
`/index.md` fallback pattern. This is a predictable gap in any multi-level site.

### `_routes.json` exclusions

The exclusion list was based on inspecting `dist/` output:
```json
"exclude": ["/_astro/*", "/images/*", "/favicon.ico", "/favicon-16x16.png", ...]
```
The `/images/*` directory and individual favicon files aren't in the skill's example
`_routes.json`. Worth adding to the skill's template as a common pattern.

---

## About page parity gap (acceptable, not fixed)

`markdown-content-parity` FAIL: `/about` has 100% content missing in markdown vs HTML.
Cause: the HTML About page renders career timeline data from the `timeline` collection
(YAML files), but our handwritten `/about.md.ts` stub doesn't include that data.

**Decision:** not fixed. This is an editorial gap, not an infrastructure bug. Adding the
timeline data to `/about.md.ts` would require querying the `timeline` collection from a
non-collection endpoint, which is possible but adds complexity for 1% score gain.
The skill documents this class of issue as "acceptable remaining gaps."

**Note for skill:** Pages that render from multiple data sources (collection entries
+ other data collections like a `timeline`) will always have a parity gap unless the
`.md` endpoint queries all data sources. This is expected and acceptable.

---

## Scanner results log

| Date | After | Score | Notes |
|---|---|---|---|
| 2026-07-07 (pre-work) | — | 0/100 (F) | Zero agent signals present |
| 2026-07-07 | Layer 1 deploy | 94/100 (A) | llms.txt, robots.txt, .md siblings, body directive, _headers |
| 2026-07-07 | Layer 2 deploy (middleware) | 96/100 (A) | Content negotiation live but 4 static pages HTML-only |
| 2026-07-07 | Static page .md endpoints | 98/100 (A) | All pages have .md siblings; middleware still missing /index.md fallback |
| 2026-07-07 | Middleware index.md fallback | 99/100 (A) | Final: only about-page parity gap remains (acceptable) |

---

## Cloudflare Pages middleware: confirmed working design

The `references/cloudflare-pages.md` design was substantively correct. Key confirmations:

- `env.ASSETS.fetch()` works as documented
- Root middleware in `functions/_middleware.ts` intercepts all page requests
- Trailing-slash normalisation happens before middleware — no special-casing needed
- `_routes.json` with `exclude` array correctly bypasses the function for static assets
- `_headers` file `/*.md` pattern correctly sets `Content-Type` for direct `.md` fetches

The one gap in the reference design: missing the `<path>/index.md` fallback for section
roots. The skill's middleware sample should be updated to include this two-step pattern.
