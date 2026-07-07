# Agent Readiness Implementation Log

Running log of findings, surprises, and deviations from the skill template during
the danielkimdev.com rollout. This feeds back into upgrading the skill.

**Site:** danielkimdev.com  
**Platform:** Cloudflare Pages (static)  
**Stack:** Astro (no Starlight), bilingual EN/KO, `output: 'static'`  
**Started:** 2026-07-07  
**Skill version used:** 0.1.0

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
- Static pages (Home, About, Blog index, Portfolio index) don't have a content
  collection entry, so no `.md` sibling is generated for them in Layer 1

### Body directive location
- No Starlight `Banner` slot — injected directly in `BaseLayout.astro` after the
  existing skip link (`<a class="skip-link">`)

### llms.txt page source
- EN blog posts only (Layer 1 scope)
- Static pages listed as a flat section (no collection entry available)
- KO locale deferred as a fast-follow

---

## Layer 1 findings

_(filled in as work progresses)_

---

## Layer 2 findings (Cloudflare Pages middleware)

_(filled in as work progresses)_

---

## Scanner results log

| Date | Layer | Score | Notes |
|---|---|---|---|
| 2026-07-07 (pre-work) | 0 | 0/100 (F) | Zero agent signals present |
