# WORKLOG

> **Purpose:** append-only history of every working session. Newest entry on top.
> For the *current* state and what to do next, see [`HANDOFF.md`](HANDOFF.md) instead.
> At the end of each session, add an entry here and refresh `HANDOFF.md`.

## 2026-08-04 — Publish post + portfolio item: Grues in Comic (EN/KO)

Mechanical schema conversion of `content-materials/grues-in-comic-beta-{en,ko}.md` into a live blog
post, plus a new companion portfolio item for the side project the post covers.

**Blog post:**
- Created `src/content/blog/en/grues-in-comic-beta.md` and `src/content/blog/ko/grues-in-comic-beta.md`
- Frontmatter: `pubDate: 2026-08-04`, `draft: false`, `translationKey: grues-in-comic-beta`, `tags: [ai-llm, solopreneur]`
- Dropped non-schema `slug`/`status` fields from the wiki export; stripped leading `# Title` line
- No `---` dividers or em dashes in either file
- No new series (standalone post)
- Deleted source drafts from `content-materials/` per publishing checklist

**Portfolio item:**
- Created `src/content/portfolio/{en,ko}/grues-in-comic.md` — category `side-ai`, tags `[ai-llm, solopreneur]`, `translationKey: grues-in-comic`, `order: 4` (placed right after `whatifclassics`)
- Bumped `order` on `talks-writing-devrel` (4→5), `content-security` (5→6), `career` (6→7) in both locales to keep `career` last
- Links point to `grues.danielkimdev.com` and the new blog post

**Verification:** `npx astro check` (0 new errors — 4 pre-existing unrelated TS errors in `functions/_middleware.ts` / `[slug].md.ts`), `npx astro build` (89 pages, up from 87: +1 blog post + 1 portfolio item × 2 locales each, minus the net from routing — confirmed `/blog/grues-in-comic-beta/`, `/ko/blog/grues-in-comic-beta/`, `/portfolio/grues-in-comic/`, `/ko/portfolio/grues-in-comic/` all present).

**Gameplay screenshot (same session, follow-up):** Daniel dropped `content-materials/grues-in-comic-screenshot.png`. Copied to `public/images/blog/grues-in-comic-beta.png` and `public/images/portfolio/grues-in-comic.png` (same source image, two public paths — matches the existing `whatifclassics` inline-markdown-image convention, plain `![]()` + public path, not the `heroImage`/`thumbnail` content-collection `image()` schema field, which no post/portfolio item uses yet). Embedded in all four files (blog EN/KO, portfolio EN/KO) with locale-matched alt text describing the West of House comic panels + classic Zork text output. Source screenshot deleted from `content-materials/` after copying. Rebuilt — still 89 pages, both image paths present in `dist/`.

**Portfolio pruning + Home featured swap (same session, follow-up):** Daniel asked to remove the `career` portfolio item (the About page timeline already covers career history) and to surface `grues-in-comic` as one of the three featured items on Home.
- Deleted `src/content/portfolio/{en,ko}/career.md`. No other file linked to it (`grep` for `career.md`/`portfolio/career` in `src/` was clean) — safe removal.
- Home's featured section (`HomePage.astro:29-31`) is `getCollection('portfolio', featured===true).sort(order).slice(0,3)`. Before this change the 3 featured items were `ai-knowledge-work`(1), `digital-garden`(2), `content-security`(6). Set `featured: true` on `grues-in-comic` (order 4) and `featured: false` on `content-security` (order 6, both locales) so Home now shows exactly 3: `ai-knowledge-work`, `digital-garden`, `grues-in-comic`. `content-security` stays live and listed on `/portfolio/`, just no longer on Home — judgment call (lowest-priority of the three by `order`); flag to Daniel if he'd rather swap a different one.
- Rebuilt: 85 pages (down 4 from 89 — the deleted `career` EN/KO detail + `.md` endpoint pages). Confirmed via `dist/index.html` / `dist/ko/index.html` grep that Home cards are now AI Knowledge Work → Digital Garden → Grues in Comic (both locales), and `/portfolio/` still lists `content-security` in the full grid.

Deploy: `git push origin main` pending (not yet pushed).

---

## 2026-07-11 — Publish post: ai-memory-tool-removed (EN/KO)

Mechanical schema conversion of `content-materials/blog-draft-ai-memory-{en,ko}.md` into live blog posts.

- Created `src/content/blog/en/ai-memory-tool-removed.md` and `src/content/blog/ko/ai-memory-tool-removed.md`
- Frontmatter: `pubDate: 2026-07-11`, `draft: false`, `translationKey: ai-memory-tool-removed`, `tags: [ai-llm, pkm, solopreneur]`
- Content cleanup: stripped `---` hr dividers; kept all prose verbatim
- No new series (standalone post)
- `astro build` confirmed 3 new routes: `/blog/ai-memory-tool-removed.md`, `/blog/ai-memory-tool-removed/`, `/ko/blog/ai-memory-tool-removed/`
- KO: no em dashes found
- Deleted source drafts from `content-materials/` per publishing checklist
- Deploy: `git push origin main` pending (not yet pushed)

---

## 2026-07-07 — Skill upgrade to v0.2.0 + OSS brief

Second half of the agent-readiness session. After the 99/100 score was confirmed,
updated the skill itself and prepared for a potential open-source project.

**Skill upgrade (`agent-readiness-astro` v0.1.0 → v0.2.0, commit `ba09362`):**
- `SKILL.md`: CF Pages reference updated from "unverified design" to "scanner-verified";
  added CLI-vs-web-UI scanner warning; added `llms.txt` link rule (all links must be
  `.md` URLs); added static-pages-without-collection-entries pattern; added multi-source
  parity gap to acceptable-gaps list; replaced "rolling this out" caveat with "both
  platform refs are now verified"
- `references/cloudflare-pages.md`: status banner flipped; middleware sample replaced
  with two-step `.md` / `index.md` fallback; trailing-slash section updated from
  speculation to confirmed facts; Dead ends section added (single-step lookup failure,
  hardcoded `/` → `/index` anti-pattern)

**OSS project brief (commit `34299c0`):**
- [`agent-readiness-skill-oss-brief.md`](agent-readiness-skill-oss-brief.md) created —
  context doc for starting an open-source multi-framework version of the skill. Covers:
  pre-built-static vs. runtime-conversion architecture clarification, positioning vs.
  Cloudflare's Pro-plan native feature, all five hard-won implementation lessons,
  Astro-specific parts mapped to framework equivalents, acceptable remaining gaps.

**Discussion notes (not actioned, for reference):**
- Cloudflare's native "Markdown for Agents" (Pro-only) does runtime HTML-to-MD
  conversion; the skill's approach is pre-built static files — cleaner output, requires
  a build step.
- OSS motivation: personal documentation + "free platform-agnostic alternative" framing.
  Not aiming to be a widely-adopted standard — sharing because it may be useful.
- Agent-readiness rollout is a candidate blog post (series: `agent-readiness`).
  Before/after screenshots added at root: `isitagentready-result-before-skill.png`
  and `isitagentready-result-after-skill.png`. `TODO(daniel):` draft when ready.

**Files created:** `agent-readiness-skill-oss-brief.md`
**Files updated:** `.opencode/skills/agent-readiness-astro/SKILL.md`,
  `.opencode/skills/agent-readiness-astro/references/cloudflare-pages.md`,
  `HANDOFF.md`, `WORKLOG.md`

---

## 2026-07-07 — Agent readiness (0 → 99/100 afdocs)

Implemented all 7 agent-readiness signals for danielkimdev.com using the
`agent-readiness-astro` skill (v0.1.0). Cloudflare Pages platform. Full rollout
notes and lessons in [`learning-agent-readiness-updates.md`](learning-agent-readiness-updates.md).

**Score progression:** 0/100 (F) → 94 (Layer 1) → 96 (Layer 2) → 98 (static .md pages) → **99/100 (A)**

**Layer 1 — host-agnostic (commit `5c7c9af`):**
- `src/pages/robots.txt.ts` — crawl policy + `Content-Signal: ai-train=no, search=yes, ai-input=yes`
- `src/pages/llms.txt.ts` — EN blog + portfolio + static pages, all linked as `.md` URLs
- `src/pages/blog/[slug].md.ts` — pre-built `.md` sibling for every EN blog post
- `src/pages/portfolio/[slug].md.ts` — pre-built `.md` sibling for every EN portfolio item
- `src/layouts/BaseLayout.astro` — clip-rect hidden `<a href="/llms.txt">` in `<body>` (not `<head>`)
- `public/_headers` — `Link` header on `/`, `/*.md` Content-Type, `Vary: Accept`

**Layer 2 — Cloudflare Pages middleware (commit `70e6795`):**
- `functions/_middleware.ts` — intercepts `Accept: text/markdown`, looks up `.md` asset via `env.ASSETS.fetch()`, falls back to normal serving; adds `Vary: Accept` to all responses
- `public/_routes.json` — excludes `/_astro/*`, `/images/*`, favicons from Function invocation

**Layer 3 — static page .md siblings + llms.txt fix (commit `d9d9807`):**
- `src/pages/index.md.ts`, `src/pages/about.md.ts`, `src/pages/blog/index.md.ts`, `src/pages/portfolio/index.md.ts` — hand-written `.md` endpoints for pages with no collection entry
- Updated `llms.txt` static-page links to point to `.md` URLs (not pretty HTML URLs)

**Layer 4 — middleware index.md fallback (commit `bb4d802`):**
- Fixed middleware: added two-step `.md` lookup: try `<path>.md` first, then `<path>/index.md`. Required for section roots (`/`, `/blog/`, `/portfolio/`)

**Known remaining gap:** `/about.md` has 100% content-parity missing vs HTML (timeline collection data not in .md). Acceptable — editorial decision, not infra bug.

**Files created:** `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`, `src/pages/blog/[slug].md.ts`, `src/pages/portfolio/[slug].md.ts`, `src/pages/index.md.ts`, `src/pages/about.md.ts`, `src/pages/blog/index.md.ts`, `src/pages/portfolio/index.md.ts`, `functions/_middleware.ts`, `public/_routes.json`, `learning-agent-readiness-updates.md`

**Files updated:** `src/layouts/BaseLayout.astro`, `public/_headers`, `HANDOFF.md`, `WORKLOG.md`

---

## 2026-07-06 — Favicon replacement + Cloudflare Pages Git integration

**Did:**

1. **Favicon replacement:** swapped out the default Astro SVG placeholder (`public/favicon.svg`) for a proper favicon.io-generated set. Copied all files from `dev-references/favicon_io/` to `public/`. Filled in blank `name`/`short_name` fields in `site.webmanifest` with `"Daniel Kim"`. Updated `BaseHead.astro` to use the full set of link tags (ICO → 32px PNG → 16px PNG → apple-touch-icon → webmanifest).

2. **Cloudflare Pages Git integration:** connected the GitHub repo to Cloudflare Pages auto-deploy. Confirmed push-to-deploy works (commit `2c1b20f` triggered and deployed successfully). Both `git push` (auto) and `npm run deploy` (wrangler direct-upload) are kept as valid deploy paths.

**Files updated:** `public/favicon.ico` (replaced), `public/favicon.svg` (deleted), `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png`, `public/apple-touch-icon.png`, `public/site.webmanifest`, `src/components/BaseHead.astro`, `dev-references/favicon_io/` (source copies), `HANDOFF.md`, `WORKLOG.md`

---

## 2026-07-06 — whatifclassics portfolio update + Fable-5 revival blog post (EN/KO)

**Did:** Two related tasks in one session.

1. **Portfolio update (`whatifclassics`):** removed the stale "It's on pause now" closing line from both EN/KO `src/content/portfolio/{en,ko}/whatifclassics.md`. Added a paragraph noting the project was resumed in mid-2026 via Claude's Fable 5 free-access weekend, with the full look-and-feel rebuilt in a single weekend. Added two screenshots sourced from the Day 34 blog post (`public/images/portfolio/whatifclassics-{home,storyplay}.jpeg` — downloaded from `whatifclassics.com/blog/revamp-after-{home,card}.jpeg`). Added a third link entry (Day 34 comeback post) to the links list in both EN/KO.

2. **New blog post (`whatifclassics-fable5-revival`, EN/KO):** standalone post (no series, tags `[solopreneur, ai-llm]`, pubDate 2026-07-06) recapping the Fable-5 weekend sprint for danielkimdev.com readers (AI/solopreneur audience — not the whatifclassics community). Content sourced from `whatifclassics.com/blog/building-in-public-day-34/`; both versions re-authored from source using the `daniel-writing-style` skill (Workflow A for KO, en-rendering-guide conventions for EN). Slop pass: zero KO tells (no em-dash, no 게다가/더 나아가, no ~라고 할 수 있습니다), zero EN magic vocab.

**Verification:** `astro check` 0 errors/0 warnings; `astro build` 83 pages (up from 81 before session — +2 for the new post). Both new pages confirmed in dist output.

**Files created:** `src/content/blog/{en,ko}/whatifclassics-fable5-revival.md`, `public/images/portfolio/whatifclassics-home.jpeg`, `public/images/portfolio/whatifclassics-storyplay.jpeg`

**Files updated:** `src/content/portfolio/{en,ko}/whatifclassics.md`, `HANDOFF.md`, `WORKLOG.md`

**Deployed:** 2026-07-06 — this session (includes ep.1–ep.10 from prior session that had not yet been deployed).

---

## 2026-07-06 — Publish ep.4–ep.10 (building-llm-pkm-in-public) + spread pubDates

Published 7 new episodes (EN+KO) of the `building-llm-pkm-in-public` series. Also backdated ep.1–ep.3 pubDates to give the whole series a natural weekly cadence.

**PubDate schedule (all episodes):**
ep1=2026-05-05, ep2=2026-05-12, ep3=2026-05-20, ep4=2026-05-28, ep5=2026-06-04,
ep6=2026-06-11, ep7=2026-06-19, ep8=2026-06-26, ep9=2026-07-02, ep10=2026-07-06

**Files created:** `src/content/blog/{en,ko}/building-llm-pkm-in-public-ep{4..10}.md`
**Files updated:** `src/content/blog/{en,ko}/building-llm-pkm-in-public-ep{1..3}.md` (pubDate only)
**Source files:** deleted from `content-materials/` after verification (wiki project is source of truth)

Schema conversion applied per `dev-references/wiki-to-site-publishing.md`:
stripped title line, italic episode byline, `---` dividers, trailing wiki-link footnotes; dropped `slug`/`episode`/`status`/`daniel_reviewed` fields; set `draft: false`.

Em-dashes noted in KO files — all are structural technical separators (`Stage 1 — 분석`, tool-name bullets) preserved from Daniel's reviewed source, not stray prose punctuation.

Build: `astro check` 0 errors → `astro build` 81 pages (up from 63). Awaiting `git commit` + `npm run deploy`.

---

Entry template:

```
## YYYY-MM-DD — <short title>
**Did:** what changed this session.
**Decisions:** any decisions locked (with why).
**Files touched:** key files.
**Next:** what the next session should pick up.
```

---

## 2026-07-02 — Published `building-llm-pkm-in-public` ep.2 and ep.3 (EN/KO)

**Did:** Converted the ep.2 (`From Data Hoarder to Knowledge Architect`) and ep.3 (`What Insight
Synthesis Actually Looks Like`) drafts from `content-materials/` into 4 live blog files under
`src/content/blog/{en,ko}/` per [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md):
stripped the wiki export's `slug`/`status`/`published_url` fields, the leading `# Title` line, the
italic episode byline, and `---` dividers; set `draft: false`; used `translationKey`/`series`
verbatim (already on-registry: `pkm`/`ai-llm` tags, `building-llm-pkm-in-public` series). `pubDate`
set to 2026-07-02 (ep.2) and 2026-07-03 (ep.3) to keep series/chronological order after ep.1
(2026-07-01) — the wiki export's `published` field was empty, so these are today's actual publish
dates per the checklist, not backfilled. No editorial review requested or performed (Daniel: content
already final upstream). Ran the full verification checklist: `astro check` (0 errors), `astro
build` (63 pages, up from 59 — +4 posts, no new series so no new hub pages), grepped both KO files
for stray em-dashes (none found). Deleted all 4 source files from `content-materials/` after
verification, per the checklist's "not gated on deploying" rule.
**Decisions:** none new — pure mechanical publish per the existing checklist.
**Verification:** `astro check` 0 errors/0 warnings; `astro build` completed, confirmed
`/blog/building-llm-pkm-in-public-ep{2,3}/` and `/ko/blog/...` in the output tree alongside the
existing series hub pages (no new hub needed, series already registered). Did not re-run
`test:e2e` (no code changed, content-only session).
**Files touched:** `src/content/blog/en/building-llm-pkm-in-public-ep{2,3}.md`,
`src/content/blog/ko/building-llm-pkm-in-public-ep{2,3}.md` (new). Deleted (untracked):
`content-materials/building-llm-pkm-in-public-ep{2,3}-{en,ko}.md`.
**Next:** Committed and pushed to `origin/main` (`46dc698`) but **not deployed** — Daniel is running
`npm run deploy` manually this time (direct-upload project, push alone doesn't ship it). Re-run
post-deploy Lighthouse once live (last run predates Stages 30–32, and now also predates ep.2/ep.3).

## 2026-07-01 — Deployed Stages 30–32 + the `--space-5` CSS fix

**Did:** Daniel ran `npm run deploy` (commit `d64f8c8`) and confirmed on `danielkimdev.com` that the
related-post card gap/height fix looks correct live. This ships Stages 30 (post series), 31
(related posts), 32 (reading progress), the first `building-llm-pkm-in-public` post, and the
`--space-5` token fix all together — first deploy since 2026-06-30.
**Decisions:** none new.
**Verification:** Daniel's own visual confirmation on the live site (not re-verified by Claude this
session — no live-Lighthouse or live-DOM re-check was run after this handoff).
**Files touched:** none (deploy-only session).
**Next:** Re-run post-deploy Lighthouse (last one is from 2026-06-29, predates Stages 30–32).
Otherwise pick up P1 Stages 28–29 (OG images, authoring docs/CI) or decide scope for P2 33–36
(webmentions, newsletter, PKM hand-off, hybrid/SSR).

## 2026-07-01 — Fix: invalid `--space-5` token (related-post cards touching, uneven height)

**Did:** After deploying Stage 31, Daniel reported the related-post cards rendering with no gap
between them and inconsistent heights. Root cause: `.post__related-list { gap: var(--space-5); }`
referenced a token that doesn't exist in `tokens.css` (the spacing scale jumps `--space-4` (16px) →
`--space-6` (24px), no `--space-5`) — an undefined custom property makes the whole `gap` declaration
invalid at computed-value time, so it silently fell back to `normal` (0px). Grepped the codebase for
the same typo and found two more live instances: `.post__series-nav`'s `padding: var(--space-5)
var(--space-6)` in `BlogPost.astro` (Stage 30, already deployed — its padding was silently zero too,
though no post currently has 2+ series parts to make that box visible) and `.blog-search`'s
`margin-bottom: var(--space-5)` in `BlogIndexPage.astro`. Fixed all three to valid tokens
(`--space-6` for the two list/box gaps, `--space-4` for the series-nav's vertical padding, matching
`Callout.astro`'s padding convention). Separately, the uneven card heights were a real (unrelated)
layout gap: CSS Grid stretches the `<li>` grid items to equal row height by default, but the `Card`
component inside each `<li>` only sized to its own content — added `.post__related-list :global(.card)
{ height: 100%; }` so the card fills its (already-equal) `<li>`.
**Decisions:** none new.
**Verification:** Confirmed the bug live on `danielkimdev.com` first (`getComputedStyle(...).gap`
read `"normal"`, card heights read 254px vs. 278px) before touching code. After the fix, local dev
shows `columnGap: "24px"` and equal card heights (verified via screenshot + computed styles). Added
a regression test to `tests/e2e/related-posts.spec.ts` (`cards have a real gap between them and
render at equal height`) asserting `columnGap` is a positive pixel value (not `"normal"`) and all
`<li>` heights match — this would have caught the original bug. `astro check` 0 errors, `astro
build` 59 pages, full `npm run test:e2e` 31/31 passing.
**Files touched:** `src/layouts/BlogPost.astro`, `src/components/BlogIndexPage.astro`,
`tests/e2e/related-posts.spec.ts`.
**Next:** Redeploy (`npm run deploy`) to ship this fix along with Stages 30–32.

## 2026-07-01 — Stage 32: reading progress indicator

**Did:** Implemented Stage 32 (P2 backlog) — a thin scroll-progress bar on blog post pages. New
`src/components/ReadingProgress.astro`: a fixed 3px bar at `z-index: 60` (above the sticky header's
`z-index: 50` in `Header.astro`, so it overlays the header's top edge as a full-width line — the
common "reading progress" pattern, chosen over sitting below the header). Width is driven by a CSS
`transform: scaleX()` (compositor-only, no layout reflow) computed from `.post__body`'s bounding
rect against `window.scrollY`/`innerHeight`, throttled via `requestAnimationFrame` off a passive
scroll listener, in an `<script is:inline>` following the same drop-in pattern as `CodeCopy.astro`.
Marked `aria-hidden="true"` rather than a live `role="progressbar"` (per the plan's default — the
TOC already gives structural position, and a continuously-updating live region would be noisy for
AT users) — left the `TODO(daniel)` on that choice unresolved rather than deciding for him. Wired
into `BlogPost.astro` alongside `<CodeCopy />`.
**Decisions:** Skipped adding a component-local `@media (prefers-reduced-motion: no-preference)`
transition gate (which the plan doc suggested) — `global.css` already has a blanket kill-switch
(`transition-duration: 0.01ms !important` under `reduce`) that covers this transition for free;
verified via `page.emulateMedia({ reducedMotion: 'reduce' })` that the computed
`transitionDuration` collapses to `1e-05s`. Adding a redundant local rule would duplicate existing
global behavior for no benefit.
**Verification:** New `tests/e2e/reading-progress.spec.ts` (2 tests) — bar is `aria-hidden` and
reads ~0 (`scaleX(0)`/`none`) before scrolling; scrolling to the post's bottom drives it to ~1
without exceeding it (read via computed `transform` matrix, since the bar uses `scaleX` not
`width`). First test run against the *bottom-of-page* scroll flakily read `scaleX(0.033)` — traced
to a stale-compile race on the dev server's first request after the file changed, not a logic bug;
re-running (and the full suite) passed cleanly. `astro check` 0 errors, `astro build` 59 pages (no
new routes), `npm run test:e2e` 30/30 passing.
**Files touched:** new `src/components/ReadingProgress.astro`, `src/layouts/BlogPost.astro`, new
`tests/e2e/reading-progress.spec.ts`, `dev-references/plans/stage-32-reading-progress.md` (status +
handoff note), `dev-references/plans/00-index.md` (status cell), `HANDOFF.md`.
**Next:** Stages 33–36 (webmentions, newsletter capture, PKM hand-off automation, optional
hybrid/SSR migration) are still one-line scope only — each needs a Daniel decision (provider/scope)
before it can be decomposed into a full plan doc like 28–32 have. Not yet deployed; redeploy
alongside Stages 30–31 when ready.

## 2026-07-01 — Stage 31: related posts

**Did:** Implemented Stage 31 (P2 backlog) — a static "Related posts" block per blog post, ranked
by shared tags. Added `getRelatedPosts(post, localePosts, limit = 3)` to `src/utils/blog.ts`
(shared-tag count desc, `pubDate` desc tiebreak, excludes the post itself and any same-series
sibling since Stage 30's series nav already links those) and wired it into `getBlogPaths`'s
per-path props. Both `src/pages/blog/[...slug].astro` and `src/pages/ko/blog/[...slug].astro`
destructure named props explicitly rather than spreading `Astro.props`, so the first pass silently
dropped `related` — caught by inspecting the built `dist/` HTML (no "Related posts" section
appeared) rather than trusting `astro check`/`astro build` alone, since both passed cleanly either
way. Fixed by adding `related` to both route files' destructuring and the `<BlogPost>` call.
`BlogPost.astro` renders the section (new `blog.relatedPosts` i18n key, EN "Related posts" / KO
"관련 글") above the older/newer pagination, `Card`-based like the Stage 26 tag-archive list.
**Decisions:** none new — followed the existing plan doc's scope as written.
**Verification:** confirmed via built `dist/` output that `agent-readiness` ↔
`building-llm-pkm-in-public-ep1` (share `ai-llm`) and `welcome-digital-garden` ↔ ep1 (share `pkm`)
each surface one another, while `agent-readiness` ↔ `welcome-digital-garden` (zero shared tags)
correctly show no link despite being pagination-adjacent; KO locale renders the localized heading
and only links to KO paths. Added `tests/e2e/related-posts.spec.ts` (4 tests) — assertions check
presence/absence of specific known-post links rather than exact counts, since `astro dev` (which
Playwright drives) includes the Stage 24–26 draft placeholder fixtures that the prod build excludes,
and those skew raw related-post totals. Full suite: `astro check` 0 errors, `astro build` 59 pages
(no new routes — Stage 31 only adds a section to existing post pages), `npm run test:e2e` 28/28
passing.
**Files touched:** `src/utils/blog.ts`, `src/layouts/BlogPost.astro`,
`src/pages/blog/[...slug].astro`, `src/pages/ko/blog/[...slug].astro`, `src/i18n/{en,ko}.json`,
new `tests/e2e/related-posts.spec.ts`, `dev-references/plans/stage-31-related-posts.md` (status +
handoff note), `dev-references/plans/00-index.md` (status cell), `HANDOFF.md`.
**Next:** Stage 32 (reading progress indicator) has a plan doc and is independent of 31 — next
P2 pickup. Not yet deployed; redeploy alongside Stage 30 when ready.

## 2026-07-01 — Drafted root-level cross-project instructions (AGENTS-ROOT.md)

**Did:** Talked through whether to merge this repo and the separate LLM-wiki project into one
monorepo (decided: no — keep repos separate, private wiki vs. public deploy target). Confirmed via
the Claude Code docs that a shared parent-folder session correctly scopes nested `CLAUDE.md`s and
project-level skills per-subdirectory (on-demand, directory-qualified if names collide), but
permissions/git behavior for sibling repos under a non-repo parent is undocumented. Landed on
**lean pipeline by default** (current `content-materials/` export flow), with a shared
parent-folder session as an opt-in for genuine cross-project reasoning — and even then, prefer a
forked/sub-agent for exploratory reads so raw wiki content doesn't bloat the main thread's context
(Daniel is on Claude Pro and is explicitly protecting session/weekly usage).

Drafted [`dev-references/AGENTS-ROOT.md`](dev-references/AGENTS-ROOT.md) — the intended
`CLAUDE.md`/`AGENTS.md` for that future shared parent folder, staged here for version history
until the parent folder actually exists (then copy or symlink it out; sync is manual copy, not a
third git repo). Covers: the two-project relationship, the publishing pipeline (pointer to
`wiki-to-site-publishing.md`, which is the actual steps — this file is policy), the locked
separate-repos/lean-pipeline decisions above, and the skill/config scoping notes. Left
`TODO(daniel)` markers for facts I don't have: the wiki project's actual path/name, and whether it
already has its own `CLAUDE.md`.

**Files touched:** `dev-references/AGENTS-ROOT.md` (new), `dev-references/wiki-to-site-publishing.md`
(added a cross-reference).

**Next:** Daniel to actually set up the parent folder + fill in the TODOs, then copy/symlink this
file into place.

---

## 2026-07-01 — Rule: delete wiki-project source drafts once published

**Did:** Added a "delete the source drafts once verified" rule to
[`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md) and
`HANDOFF.md` — once a `content-materials/<slug>-{en,ko}.md` pair is copied into
`src/content/blog/` and passes the verification checklist, delete the source files. This happens
as soon as the post is verified, not gated on `npm run deploy` (the wiki project is the source of
truth; git history covers "what did the draft look like" if ever needed). Applied it
retroactively: deleted `content-materials/building-llm-pkm-in-public-ep1-{en,ko}.md` since that
post is published and deployed.

**Left alone (flagged, not deleted):** `content-materials/2026-06-0{1,2}-*-agent-readiness.en.md`
— these are the pre-YAML export format, explicitly DoveRunner-branded, and don't match what's
actually live (`agent-readiness.md` is de-branded/restructured, and there's no Part 2 on the site
yet). Unclear whether these were ever mechanically "published" under this rule or predate it
entirely — needs a Daniel decision, not an assumption.

**Files touched:** `dev-references/wiki-to-site-publishing.md`, `HANDOFF.md`; deleted
`content-materials/building-llm-pkm-in-public-ep1-{en,ko}.md`.

**Next:** none blocking. Daniel to confirm whether the two agent-readiness content-materials
files should be deleted too.

---

## 2026-07-01 — Documented the wiki-project → site publishing workflow

**Did:** Daniel clarified that blog-post drafts arrive **voice/content-final** — he drafts them in
a separate LLM-wiki project through `daniel-writing-style` + a `draft-review-kit` there, and only
drops the "ready to publish" result into this repo's `content-materials/`. So `daniel-writing-style`
should never run again in *this* project; publishing a draft here is purely a mechanical schema
conversion. Wrote [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md):
the wiki export's YAML frontmatter shape, a field-by-field mapping to this site's blog schema,
tag-enum and series-slug-registration rules, a content-body cleanup checklist (strip the redundant
H1/byline/dividers/next-episode teaser this site's layout already renders, don't touch the prose
otherwise), and the one real gap — the wiki export has no `description` (SEO excerpt) field yet,
so that's the one thing this repo still has to author until the wiki project's template adds it.
Linked the doc from `AGENTS.md` (new paragraph in "Project") and `HANDOFF.md` (Conventions
bullet), both now stating **don't re-run `daniel-writing-style` here**.

**Decisions:** Publishing = mechanical from here on. The only voice-adjacent check left on this
side is a plain `grep` for stray em-dashes in Korean output (found one in episode 1 despite it
being marked "ready" upstream) — not a reason to re-invoke the skill, just a cheap sanity check.

**Files touched:** `dev-references/wiki-to-site-publishing.md` (new), `AGENTS.md`, `HANDOFF.md`.

**Next:** none — reference doc, not blocking anything in flight.

---

## 2026-07-01 — Fixed predeploy guard on plain Windows shells (sh → Node)

**Did:** `scripts/predeploy-guard.sh` (bash/POSIX `sh`) failed with "sh not found" when
`npm run deploy` (and its `predeploy` hook) ran from a native Windows PowerShell/cmd session —
the standard Git-for-Windows installer only adds `Git\cmd` (has `git.exe`) to PATH, not
`Git\bin`/`Git\usr\bin` (has `bash.exe`/`sh.exe`), so `git` resolves but `sh` doesn't. Rewrote the
guard as `scripts/predeploy-guard.mjs` (plain Node, using `child_process.execFileSync` for the
git calls and `readline` for the `[y/N]` prompt) — identical behavior (branch/dirty-tree/origin-drift
checks, `DEPLOY_ALLOW_DIRTY=1` override, non-TTY abort), but Node is already a hard requirement
for this project so it runs the same on Windows, macOS, and Linux regardless of shell. Deleted the
old `.sh`; `package.json`'s `predeploy` script now runs `node scripts/predeploy-guard.mjs`.
Verified via `npm run predeploy` from an actual PowerShell session (not just Git Bash).

**Files touched:** `scripts/predeploy-guard.mjs` (new, replaces `.sh`), `package.json`,
`HANDOFF.md`.

**Next:** none — this was a standalone fix, not blocking anything else in flight.

---

## 2026-07-01 — Published Episode 1 of "Building LLM-PKM in Public"

**Did:**
- **Adapted Daniel's drafts** (`content-materials/building-llm-pkm-in-public-ep1-{en,ko}.md`) into
  the site's blog schema: `src/content/blog/{en,ko}/building-llm-pkm-in-public-ep1.md`. Kept his
  authored prose/title as-is; stripped platform-specific scaffolding that doesn't fit this site
  (duplicate H1, italic episode byline, `---` dividers, `domain`/`status`/`created`/`published`
  meta fields) since those are redundant with what `BlogPost.astro` already renders (title, series
  badge) or aren't part of this schema. Wrote new EN/KO SEO descriptions (not supplied in the
  drafts) via the `daniel-writing-style` skill. `tags: [pkm, ai-llm]` mapped 1:1 from his own
  `domain:` field — both already valid `BLOG_TAGS`. `pubDate: 2026-07-01` (today, not the
  `created: 2026-04-20` draft date). One stray em-dash in the Korean body (not in his title) was
  converted to a comma per the skill's Korean-voice rule against em-dashes.
- **Renamed the series slug** from the Stage 30 placeholder `llm-wiki-in-public` to
  `building-llm-pkm-in-public` (`src/data/series.ts`) to match the name Daniel actually gave it in
  his draft frontmatter (`series: Building LLM-PKM in Public`). Wrote a Korean series title/
  description to match (`LLM-PKM 공개 구축기`) since his draft only specified the English series
  name. Updated the stale slug references in `stage-30-series.md`/`HANDOFF.md` left over from
  before this post existed.
- **Resolved the `digital-garden.md` portfolio TODO** ("link the tooling write-up") — this post
  *is* that write-up, so both EN/KO portfolio items now link to it instead of carrying a
  `TODO(daniel)` marker.
- **Fixed two now-stale e2e assertions** in `tests/e2e/blog-pagination.spec.ts` that hardcoded a
  dev-mode post count of 12 (10 placeholders + 2 real posts) — now 13, and since 13 isn't an exact
  multiple of `PAGE_SIZE` (6), the "load more" flow needed a second click to reach the end (it
  didn't when the count was an exact multiple).
- **Verified:** `astro check` clean (71 files), `astro build` clean (51 → 59 pages locally — 8 new:
  the new post × EN/KO, its series hub × EN/KO, `agent-readiness`'s hub × EN/KO now that a second
  series exists, and the series index × EN/KO with real content instead of one entry). All 24 e2e
  specs pass (including the two fixed pagination ones).

**Decisions:** Preserve Daniel's own authored title/prose verbatim (including his title's em-dash)
rather than "correcting" it — the anti-slop/anti-em-dash rules in `daniel-writing-style` target
*newly generated* prose, not literal edits to his own supplied text.

**Files touched:** `src/data/series.ts`, `src/content/blog/{en,ko}/building-llm-pkm-in-public-ep1.md`
(new), `src/content/portfolio/{en,ko}/digital-garden.md`, `tests/e2e/blog-pagination.spec.ts`,
`dev-references/plans/stage-30-series.md`, `HANDOFF.md`.

**Next:** Not deployed yet — run `npm run deploy` to publish. Stage 31 (related posts) is next up
whenever picked up.

---

## 2026-07-01 — Plan docs for P2 stages 30–32 · Stage 30 (post series) built

**Did:**
- **Decomposed and wrote plan docs for the three unstarted P2 stages** (`dev-references/plans/`):
  `stage-30-series.md`, `stage-31-related-posts.md`, `stage-32-reading-progress.md` — linked
  from `00-index.md`. Renumbered so the doc order matches build order: series (30) ships before
  related posts (31), since 31's same-series exclusion depends on 30 existing; reading progress
  (32) is independent and unordered relative to either.
- **Built Stage 30 (post series / collections).** New `series` optional enum field on the blog
  schema (`content.config.ts`), enum sourced from a new `src/data/series.ts` registry (seeded with
  `llm-wiki-in-public` and `agent-readiness` — no manual order field, series order is always
  `pubDate`). `getBlogPaths` (`utils/blog.ts`) now computes `seriesIndex`/`seriesTotal`/
  `seriesPrev`/`seriesNext` per post. New `utils/series.ts` (mirrors `utils/tags.ts`'s builder
  split) + `SeriesArchivePage.astro` (forward-ordered hub, `/blog/series/<slug>/` + `/ko/`) +
  `SeriesIndexPage.astro` (`/blog/series/` + `/ko/`, only series with ≥1 published part).
  `BlogPost.astro` renders a "Part N of {total} · {series}" badge under the title whenever
  `series` is set (even 1/1 — signals more is coming without fabricating posts) and a visually
  distinct `.post__series-nav` tinted box for series-scoped prev/next, separate from the existing
  reverse-chron older/newer pagination. Blog index shows an "All series →" link when applicable.
  `agent-readiness.md` (EN+KO) tagged `series: agent-readiness` as its retrofitted Part 1.
- **Tests:** new `tests/e2e/series.spec.ts` (5 specs) — badge + hub link, no prev/next on a lone
  part, hub listing, series index navigation, blog-index discovery link, KO localization. Had to
  `npx playwright install chromium` (browser binary wasn't present in this environment). All 24
  e2e specs pass; `astro check` clean; prod build 51 → 55 pages.

**Decisions:** Series is orthogonal to tags (kept both on `agent-readiness.md`) — series is an
editorial "read in order" arc, tags stay topical. Ordering is always `pubDate`, no manual order
field (YAGNI). The part badge shows even at 1/1 rather than waiting for a second part to exist.

**Files touched:** `dev-references/plans/{00-index,stage-30-series,stage-31-related-posts,
stage-32-reading-progress}.md`, `src/content.config.ts`, `src/data/series.ts` (new),
`src/utils/{blog,series}.ts`, `src/layouts/BlogPost.astro`, `src/components/{SeriesArchivePage,
SeriesIndexPage,BlogIndexPage}.astro`, `src/pages/{blog,ko/blog}/series/{[slug],index}.astro`
(new), `src/pages/{blog,ko/blog}/[...slug].astro`, `src/i18n/{en,ko}.json`,
`src/content/blog/{en,ko}/agent-readiness.md`, `tests/e2e/series.spec.ts` (new).

**Next:** Stage 31 (related posts) — series-exclusion prerequisite is now satisfied. `llm-wiki-in-public`
series is registered but has zero published parts — won't surface anywhere until its first post
ships with `series: llm-wiki-in-public`. Redeploy (`npm run deploy`) when ready to ship this.

---

## 2026-06-30 — Career timeline (2000–2010) + DoveRunner dual-role update

**Did:**
- **Timeline: added early-career entries (2000–2010).** Three new EN+KO pairs sourced from `dev-references/Profile.pdf` (extracted via `markitdown` CLI):
  - Netz Communications, Software Developer, 2000–2002 (VoIP internet call center solution)
  - ACTSoft, Software Developer, 2002–2007 (enterprise PC management + online game billing; domestic/international project management)
  - Ubitrotech, Senior Engineer, 2007–2010 (GPS navigation for North American PND market + Korean iPhone App Store nav app)
  Renumbered existing entries order 1–3 → 4–6 to preserve chronological ascending sort.
- **DoveRunner role updated to dual title: Developer Advocate & Product Owner.** Context from Daniel: DevRel = maintaining docs.doverunner.com + occasional conference sessions; PO = Platform Ops team, which owns the consolidated customer console, internal admin console, and backend systems linking DRM, Watermarking, and App Security product lines. Propagated across: `timeline/en-03-devrel.json` + `ko-03-devrel.json` (role + summary), `data/about.ts` bio para 2 (EN + KO), `portfolio/{en,ko}/talks-writing-devrel.md` (title, role, summary, added PO bullet), `portfolio/{en,ko}/career.md` (DoveRunner description).
- **Deployed.** `npm install` was needed (node_modules absent on this machine). Wrangler required interactive `wrangler login` (non-interactive PowerShell returned auth error). Build: 51 pages clean. Upload: 18 new/changed files (54 already cached). Live at apex `danielkimdev.com` (preview: https://6bc2b97d.danielkimdev.pages.dev).

**Decisions:** `npm run deploy` requires an interactive terminal with `sh` on PATH (predeploy guard) and Node-resolved `astro`. On environments where that fails, run `node_modules\.bin\astro build` then `node_modules\.bin\wrangler pages deploy ./dist --project-name danielkimdev --branch main` separately, after `wrangler login`. Added note to HANDOFF.

**Files touched:** `src/content/timeline/en-early-01-netz.json`, `en-early-02-actsoft.json`, `en-early-03-ubitrotech.json` (new ×3), `ko-early-01-netz.json`, `ko-early-02-actsoft.json`, `ko-early-03-ubitrotech.json` (new ×3), `src/content/timeline/en-0{1,2,3}-*.json` + `ko-0{1,2,3}-*.json` (order bumped to 4–6), `src/data/about.ts`, `src/content/portfolio/en/{career,talks-writing-devrel}.md`, `src/content/portfolio/ko/{career,talks-writing-devrel}.md`.

**Next:** Stage 28 (per-post OG images), Stage 29 (authoring docs + content-lint CI). CF Web Analytics still showing zero (see HANDOFF open items).

---

## 2026-06-29 — CF plugin cleanup · plan docs (25–29, P2 30–36) · Stage 27 (portfolio detail)
**Did:**
- **Cloudflare cleanup.** No CF code work remains beyond deploy (Web Analytics = Automatic Setup, domain connected). Disabled the `cloudflare@claude-plugins-official` plugin in `.claude/settings.json` and deleted 4 global user skills (`cloudflare`, `cloudflare-one`, `cloudflare-one-migrations`, `turnstile-spin`); kept `wrangler` (deploy) + `daniel-writing-style`.
- **Plan docs backfilled.** Wrote the missing per-stage docs `stage-25-blog-search.md`, `stage-26-tag-archives.md` (retroactive, ✅ Done) and `stage-27/28/29` (forward plans), linked them all in `plans/00-index.md`. **Decomposed P2** (PRD §12) into a new **Stages 30–36** table (related posts · reading progress · series/collections · webmentions · newsletter · PKM→site hand-off · optional SSR), ordered static-value-first; 33/34 carry `TODO(daniel)` provider calls. Fixed the index intro (claimed P1/P2 weren't decomposed).
- **Stage 27 — portfolio detail pages.** New `/portfolio/<slug>/` (+ `/ko/`) via thin routes → `PortfolioItem.astro` layout fed by new `utils/portfolio.ts` (`getPortfolioSlug`/`getPortfolioPath`/`getPortfolioPaths`), mirroring `utils/blog.ts` + `BlogPost.astro`. Renders category badge · period · locale, title, role · org, tags, optional thumbnail, prose body, external links, `career`→About-timeline link, back link. Not an article (no prev/next, no BlogPosting JSON-LD). EN/KO pair by **shared slug** — portfolio has **no `translationKey`** (the field is in the `.md` files but stripped by the Zod schema). Wired index card titles + tag-archive titles to link to detail (`utils/tags.ts` `getPortfolioTagPaths` now sets `href`).
- **Tests.** New `tests/e2e/portfolio-detail.spec.ts` (4); updated `tag-archives.spec.ts` (portfolio titles now link, no longer plain text). `astro check` 0 errors; build clean **39 → 51 pages** (+12); full suite **19 passed**.
- **Shipped Stage 27.** Committed (`e059370`), pushed `origin/main`, `npm run deploy` → all new `/portfolio/<slug>/` routes verified 200 on the apex in both locales.
- **Post-deploy Lighthouse + CSP fix.** Ran local Lighthouse 12 against live `danielkimdev.com` (PSI anon quota was 429). Scores excellent (Perf 97–100, A11y 100, SEO 100), recorded in `plans/stage-21-deploy.md`. **Found a real bug:** the prod CSP `script-src 'self'` (a never-revisited Stage-01 baseline) was **blocking the `is:inline` no-flash theme script (FOUC) and the CF Web Analytics beacon (analytics collecting nothing)** — e2e missed it because dev doesn't apply `_headers`. Fixed `public/_headers` → `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com` (commit `130e575`), redeployed, re-ran: **BP 93→100**, zero console errors, beacon loads.
**Decisions:** Replaced the Stage-15 inline `<details>` expander on portfolio cards with a "View details →" link — the detail page is now the canonical home for body/links, so the duplicate inline `render()` was dropped from `PortfolioPage`. (Revert by restoring the expander if Daniel prefers inline peek.) Portfolio counterpart resolution uses shared slug, not the (stripped) `translationKey`.
**Files touched:** `src/utils/portfolio.ts` (new), `src/layouts/PortfolioItem.astro` (new), `src/pages/portfolio/[...slug].astro` + `src/pages/ko/portfolio/[...slug].astro` (new), `src/components/{PortfolioPage,TagArchivePage}.astro`, `src/utils/tags.ts`, `src/i18n/{en,ko}.json`, `tests/e2e/{portfolio-detail,tag-archives}.spec.ts`, `dev-references/plans/{00-index,stage-25..29}.md`, `.claude/settings.json`, `~/.claude/skills/*` (removed).
**Next:** Stage 28 (per-post OG images), 29 (authoring docs + content-lint CI); P2 30–36 ready à la carte. Watch the CF Analytics dashboard over the next day to confirm hits now register (beacon was blocked until today's CSP fix).

## 2026-06-29 — Deploy guardrail + Stage 25 (blog search) & Stage 26 (tag archives)
**Did:**
- **Deploy guardrail.** Added `scripts/predeploy-guard.sh`, wired as the npm `predeploy` lifecycle hook (runs automatically before `npm run deploy`). Warns (doesn't hard-block — Daniel sometimes ships a quick uncommitted tweak) on: not on `main`, dirty working tree, or drift vs `origin/main`. Interactive `[y/N]` confirm; aborts in non-interactive shells; override with `DEPLOY_ALLOW_DIRTY=1`. Verified both abort and override paths.
- **Stage 25 — blog client-side search.** Added a search box to `BlogIndexPage.astro` that layers onto the Stage-24 unified controller: visibility of an item = matchesTag AND matchesQuery AND within the pager window. Search box ships `hidden` and is revealed by JS (progressive enhancement — a no-JS visitor never sees a dead input). Match is case-insensitive substring over a precomputed `data-search` attr per item (title + summary + tag keys + localized tag labels). Clear button + `aria-live`-friendly no-results message (`.blog-noresults`, distinct from the zero-posts `.blog-empty`). 4 i18n keys added to both dicts.
- **Stage 26 — tag/topic archive pages.** New static routes (one page per tag, per collection, per locale): `/blog/tags/<tag>/`, `/portfolio/tags/<tag>/` (+ `/ko/...`). Shared dumb renderer `TagArchivePage.astro` fed by builders in new `src/utils/tags.ts` (`getBlogTagPaths`/`getPortfolioTagPaths`/`getTagPath`). Blog archive cards link to the post; **portfolio cards are self-contained (no detail route until Stage 27)** — `href` omitted, title is plain text. Item tag chips on the blog index and portfolio page now link into the archive set; the current tag's chip carries `aria-current="page"`. Localized headings via `{kind}.taggedTitle`. Build went 13 → 39 pages.
- **Tag.astro fix.** The `<a>` (href) branch didn't forward `{...rest}`, so attributes like `aria-current` were silently dropped — only the `<button>` branch spread rest. Added `{...rest}` to the link branch (no regression: existing href callers pass no extra attrs).
- **Tests.** New `tests/e2e/blog-search.spec.ts` (4) + `tests/e2e/tag-archives.spec.ts` (4). Full suite **15 passed**; `astro check` 0 errors; prod build clean (39 pages). Note: scope heading locators to the page (e.g. `.archive__head h1`) — the Astro dev toolbar injects its own `<h1>`s and trips strict mode otherwise.
**Decisions:** Deploy guardrail is a *warning* gate, not a block (preserves the ship-a-tweak workflow). Portfolio tag archives intentionally ship before portfolio detail pages (Stage 27) with self-contained, non-linking cards rather than dead links.
**Files touched:** `scripts/predeploy-guard.sh` (new), `package.json` (predeploy hook), `src/components/{BlogIndexPage,TagArchivePage,Tag,PortfolioPage}.astro`, `src/utils/tags.ts` (new), `src/pages/{blog,ko/blog,portfolio,ko/portfolio}/tags/[tag].astro` (new), `src/i18n/{en,ko}.json`, `tests/e2e/{blog-search,tag-archives}.spec.ts` (new), `dev-references/plans/00-index.md`.
**Next:** Stage 27 (`/portfolio/[slug]` detail pages) — then revisit portfolio archive cards to link titles to the new detail route. Then 28 (per-post OG images), 29 (authoring docs + content-lint CI).

## 2026-06-29 — P1 kickoff: backlog decomposed + Stage 22 (Web Analytics) & 23 (404)

**Did:**
- **Decomposed the P1 backlog into stages 22–29** in [`plans/00-index.md`](dev-references/plans/00-index.md) (new "P1 Stages" table; P2 stays as the undecomposed backlog). Order is priority-weighted (Daniel's stated order — Web Analytics → blog search/pagination → portfolio detail) and front-loads value at the current low post count.
- **Stage 22 — Cloudflare Web Analytics (cookieless):** added `CF_ANALYTICS_TOKEN` to `consts.ts` (default `''`, `TODO(daniel)`) and a token-gated, **prod-only** beacon in `BaseHead.astro` (`import.meta.env.PROD && token !== ''`). Ships as a safe no-op until Daniel pastes the token (or uses CF Automatic Setup instead — not both). Verified: empty token → zero `cloudflareinsights` refs in `dist/`. Doc: [`stage-22-web-analytics.md`](dev-references/plans/stage-22-web-analytics.md).
- **Stage 23 — bilingual 404:** new `src/pages/404.astro` (→ one static `dist/404.html` CF Pages serves for all unmatched routes). Renders both locale blocks (EN visible, KO hidden); an `is:inline` script reveals the KO block + fixes `<html lang>`/`title` on `/ko/…` paths. `noindex`, no hreflang, no-JS degrades to EN. Reuses existing `notFound.*` i18n keys. Doc: [`stage-23-not-found.md`](dev-references/plans/stage-23-not-found.md).
- **Tests:** `tests/e2e/not-found.spec.ts` (EN block + KO swap). `astro check` 0/0/0; `astro build` emits `dist/404.html` with both `data-locale` blocks and excludes it from the sitemap; full e2e suite **5 passed**.
- **Placeholder blog fixtures (draft, dev-only):** generated 10 EN + 10 KO paired posts (`src/content/blog/{en,ko}/placeholder-NN-*.md`, shared `translationKey`), `draft: true`, tags from `BLOG_TAGS`, pubDates spread Jan–Jun 2026. Give Stages 24–26 (pagination/search/archives) realistic volume. **Excluded from production** by the existing draft gating (`utils/blog.ts:25`) — verified prod `dist/blog` has 0 placeholder routes; dev serves all 12 EN posts + 200 on placeholder routes both locales. Each body is clearly marked placeholder, makes no factual claims. Remove later with `rm src/content/blog/{en,ko}/placeholder-*.md`. Gotcha: a long-running `astro dev` needs a restart to pick up newly-added content files in `getStaticPaths`.

**Decisions:**
- P1 stage order locked as 22→29 (see index). 404 keeps Header/Footer chrome in build-time locale (EN) even for KO visitors — accepted compromise for a single static error page; only `<main>` content swaps.
- Web Analytics: repo ships a token-gated manual beacon (portable fallback), but **Daniel enabled CF Automatic Setup** (edge-injected) in the dashboard — so `CF_ANALYTICS_TOKEN` stays **empty** and the manual beacon stays off. Adding a token now would double-count. Locked the decision in the `consts.ts` comment.
- **Deployed 2026-06-29** (`npm run deploy`, Daniel) with content + Stages 22–23; 404 verified live (both locale blocks, 404 status). Edge analytics beacon not yet visible in page HTML — normal propagation delay after enabling Automatic Setup.

**Files touched:** `dev-references/plans/00-index.md`, `dev-references/plans/stage-22-web-analytics.md`, `dev-references/plans/stage-23-not-found.md`, `src/consts.ts`, `src/components/BaseHead.astro`, `src/pages/404.astro`, `tests/e2e/not-found.spec.ts`.

- **Stage 24 — blog pagination (load-more):** unified the blog index into one client-side controller where item visibility = `matches(activeTag) && withinWindow(visible)`. Added a `.blog-more` block (aria-live status + secondary `Button#blog-load-more`, `data-page-size="6"`); filter-change resets the window, load-more grows it, block hides for single-page sets. Chose load-more over `/blog/[page]` routes so it composes with the existing tag filter and degrades to the full list with no JS. Hit (and documented) two `[hidden]`-override traps: `.blog-more`'s flex display, and the Button being scoped out of this component's CSS (toggle via inline `style.display`). New i18n `blog.loadMore`/`blog.showingCount` (both locales). `tests/e2e/blog-pagination.spec.ts` added → **full suite 7 passed**; `astro check` 0/0/0; prod build ok. Doc: [`stage-24-blog-pagination.md`](dev-references/plans/stage-24-blog-pagination.md).

**Next:** Stage 25 (search — layers onto the Stage-24 controller as another predicate) → 26 (tag archives) → 27 (`/portfolio/[slug]`) → 28 (OG images) → 29 (authoring docs + content-lint CI). Redeploy when ready (24 not yet on prod; behaves as no-op there until real posts exceed the page size).

---

## 2026-06-29 — Custom domain connected (apex + www redirect) + Playwright scaffold

**Did:**
- **Connected `danielkimdev.com`** to the `danielkimdev` Pages project (zone is in the same Cloudflare account, `Knowledgebuilderkim@gmail.com`):
  - Registered apex `danielkimdev.com` as a Pages custom domain (Pages API) and created a proxied apex `CNAME danielkimdev.com → danielkimdev.pages.dev` (CNAME flattening). Zone DNS was previously empty. Apex serves the site over HTTPS (Google-CA cert), verified 200 + correct `<title>`.
  - **www → apex redirect:** proxied `CNAME www → danielkimdev.com`, plus a Single Redirect (dynamic-redirect ruleset) 301ing `http.host eq "www.danielkimdev.com"` to `concat("https://danielkimdev.com", http.request.uri.path)`, preserve-query-string on. Verified path + query preserved, ends at 200.
  - **Auth note:** the wrangler OAuth token is `zone (read)` only — it can write DNS + Pages but **not** rulesets/page-rules. Daniel created the redirect rule in the dashboard, but it had a stray leading space in the hostname value (`eq " www.danielkimdev.com"`) so it never matched (www returned 522). Fixed via a scoped API token Daniel placed in `.env` (`cloudflare-api-token`) — fetched the entrypoint ruleset, stripped the space, PUT it back. **`.env` is gitignored; token is a live credential — rotate/revoke when done.**
- **Playwright test scaffold** (Playwright MCP was removed to save tokens; see `dev-references/web-browswer-test.md`): added `playwright.config.ts` (chromium, `baseURL` :4321, `line` reporter, auto-start/reuse `astro dev`), `tests/e2e/smoke.spec.ts` (EN/KO home + blog index — status + visible h1 + KO `lang`), `test:e2e`/`test:e2e:ui` scripts, gitignore entries. `npm run test:e2e` → 3 passed. Added a **"Testing & browser debugging"** rule section to `AGENTS.md`: no agentic browser driving — write specs, run locally, read only spec code + filtered logs.

**Decisions:**
- Apex is canonical (matches `site:` in `astro.config`); www **301-redirects** to apex (not served as a second domain) — preserves path + query.

**Files touched:** `playwright.config.ts` ✚, `tests/e2e/smoke.spec.ts` ✚, `package.json` (test scripts + `@playwright/test`), `.gitignore` (playwright + already had `.env`), `AGENTS.md` (Testing section). Cloudflare-side changes (DNS, Pages domain, redirect ruleset) are infra, not in-repo.

**Next:** Sitemap/canonical `<loc>`s already point at `danielkimdev.com` — now correct in production. Redeploy still pending (local content ahead of prod). Optionally trim the harmless leading space in the redirect's target_url expression.

---

## 2026-06-29 — Blog layout fix + portfolio consolidation + post elaboration

**Did:** Post-launch content/UX pass. All bilingual, `astro check` clean throughout.
- **Blog post width fix** (`BlogPost.astro`): post body was wrapped in `.container container--prose` (720px) with the TOC sidebar carved out of *that*, squeezing the article to ~460px on desktop. Switched the wrapper to the full `.container` (1200px), capped header/hero at `72ch`, and made the TOC layout `grid-template-columns: minmax(0, 1fr) 14rem` + `align-items: start`. Body now reads at ~72ch with the TOC in a real right sidebar — uses the screen like the portfolio page. (Blog *index* already used the wide container.)
- **Portfolio consolidation + real content** (from `dev-references/Profile.pdf`, Medium, docs site):
  - **Merged** `multi-drm` + `watermarking-anti-piracy` → new **`content-security`** (EN+KO, featured, order 4→5). Deleted the four old files; no external refs.
  - **New `whatifclassics`** entry (EN+KO, `side-ai`, tags automation/ai-llm/solopreneur, not featured): generative-AI pipelines side project, links to site + `/blog`. period `2025–2026` (inferred — flagged for Daniel).
  - Filled real **periods** from the profile: content-security `2015–2025`, career `2000–present`, talks `2020–present`. Cleared the stale `TODO(daniel): dates` markers (one was rendering literally on the card).
  - **`ai-knowledge-work`**: added the Claude + Jira MCP onboarding example + Medium link.
  - **`talks-writing-devrel`**: retitled (dropped "Talks" — no talks material), real body (Medium blog + DoveRunner docs on Astro+Starlight), links to both.
  - New order: ai-knowledge-work · digital-garden · whatifclassics · talks · content-security · career.
- **Blog posts rewritten** (used the `daniel-writing-style` skill; KO authored natively, 합쇼체, zero em-dashes, EN em-dash-disciplined, slop pass run):
  - **welcome-digital-garden**: elaborated from 3 paragraphs to a full intro; retitled **"Why This Digital Garden Exists" / "이 디지털 가든을 가꾸는 이유"**; adds the bridge (25-yr arc) + agent-readiness thread + 3-thread list.
  - **agent-readiness**: completely rewritten by **combining the two source drafts** in `content-materials/` (Part 1 "what is" + Part 2 "two-layer framework"). Stripped all company specifics (DoveRunner/PallyCon, product lines, docs URL, series scaffolding). Per Daniel: **genericized the DRM worked example** (now vendor-neutral "mode A / mode B") and the **company name in bios** (→ "a content-security company"). Personal soft close, no product CTA.

**Decisions:**
- Portfolio **keeps** the employer name (DoveRunner/PallyCon) — career credibility belongs there. Blog posts do **not** name the employer or DRM vendors (Daniel's call, this session).
- whatifclassics **not featured** (hobby project, off-domain) — Home stays focused on the AI-knowledge-work positioning.

**Files touched:** `src/layouts/BlogPost.astro`; `src/content/portfolio/{en,ko}/` (content-security ✚, whatifclassics ✚, ai-knowledge-work, career, talks-writing-devrel; multi-drm ✖, watermarking-anti-piracy ✖); `src/content/blog/{en,ko}/{welcome-digital-garden,agent-readiness}.md`; `content-materials/` (Daniel-supplied source drafts, untracked).

**Next:** Remaining content = `digital-garden` "link the tooling write-up" TODO (waits on a future post) + optional new post seeds. Confirm whatifclassics period `2025–2026`. PRD framing follow-up (§1/§2/§13.4) still open. Then redeploy (`npm run deploy`).

---

## 2026-06-28 — Stage 21 complete: DEPLOYED to Cloudflare Pages 🚀

**Did:** Shipped P0 v1. Site is **live at https://danielkimdev.pages.dev**.
- **Deploy:** built locally (`npm run build`) then direct-uploaded `dist/` via `wrangler pages deploy ./dist --project-name danielkimdev --branch main`. Used the pre-existing `danielkimdev` Pages project on account Knowledgebuilderkim@gmail.com (OAuth, already logged in). 33 files uploaded; `_headers` applied. Production branch is `main`.
- **`package.json`:** added `"deploy": "astro build && wrangler pages deploy ./dist --project-name danielkimdev --branch main"` for one-command redeploys. Project is direct-upload (no Git integration), so `npm run deploy` is the ship path; non-`main` `--branch` values yield isolated preview URLs.
- **Verified production:** all routes 200 on `danielkimdev.pages.dev` — `/`, `/ko/`, `/blog/`, `/ko/blog/`, both posts × both locales, `/about/`, `/portfolio/`, `/ko/portfolio/`, `/rss.xml`, `/ko/rss.xml`, `/sitemap-index.xml`, `/sitemap-0.xml`. EN/KO `<title>`s render correctly (incl. Hangul). Sitemap `<loc>`s point at `danielkimdev.com` (the configured `site`) — correct once the domain is attached.
- **Docs:** updated `HANDOFF.md` (deploy done, redeploy instructions, refreshed Next steps), `stage-21-deploy.md` (tasks checked, status → DEPLOYED).

**Decisions:** Deployed via **direct upload to the existing `danielkimdev` project** rather than wiring Git integration — matches how the project was already set up and keeps the local-build→deploy flow. Custom domain (`danielkimdev.com`) **intentionally deferred** by Daniel; it's in hand and attaches cleanly later with no code changes.

**Files touched:** `package.json` (deploy script), `HANDOFF.md`, `WORKLOG.md`, `dev-references/plans/stage-21-deploy.md`.

**Next:** Daniel to attach `danielkimdev.com` at the apex when ready; run Lighthouse against the live URL and record scores in `stage-21-deploy.md`. Then content `TODO(daniel)` items and the P1 backlog (analytics, blog search/pagination, portfolio detail pages).

---

## 2026-06-28 — Stage 21 (partial): deploy docs + config (deploy itself pending Daniel's CF auth)

**Did:** Completed every part of Stage 21 that doesn't require Cloudflare authentication.
- **Verified deploy config:** `output: 'static'`, clean `npm run build` → `dist/`, Node pinned (`.nvmrc` 22.12.0 + `engines.node >=22.12.0`), `wrangler.toml` (`pages_build_output_dir = "./dist"`), and `public/_headers` (security headers + `/_astro/*` immutable cache) all present and correct from earlier stages.
- **`README.md`:** replaced the leftover Astro "Starter Kit: Blog" boilerplate with a real project README — overview, stack, dev commands, project structure, the EN-root/KO-`/ko/` i18n model, the Cloudflare Pages deploy note (git-integration preset "Astro" + the `wrangler pages deploy` fallback), and links to AUTHORING/HANDOFF/PRD.
- **`AUTHORING.md` (new):** how to add a blog post / portfolio item / timeline entry — accurate frontmatter templates pulled from `content.config.ts`, the full `BLOG_TAGS` / `PORTFOLIO_TAGS` / `PORTFOLIO_CATEGORIES` enums, the folder-by-locale + `lang` + `translationKey` pairing convention, draft behavior, the "add a UI string to both dicts" rule, and the publish/commit→auto-deploy flow.
- Confirmed build-time success metrics: all P0 pages build in both locales, `astro check` 0 errors (Zod guarantees no missing frontmatter).

**Decisions:** did **not** run the actual deploy — it's outward-facing/production and requires Daniel's `wrangler login` / Cloudflare dashboard auth, so it's intentionally left to him (with step-by-step instructions in the stage doc + HANDOFF). Marked Stage 21 🟡 in the index rather than ✅: docs/config done, deploy + prod-verification + live-URL Lighthouse outstanding.

**Verify:** `npm run build` clean; `npx astro check` 0 errors. README + AUTHORING render (Markdown).

**Files touched:** `README.md` (rewritten), `AUTHORING.md` (new), `dev-references/plans/00-index.md`, `dev-references/plans/stage-21-deploy.md`, `HANDOFF.md`.

**Next (Daniel, needs CF auth):** deploy to Cloudflare Pages (repo connect, preset Astro — or `wrangler pages deploy ./dist`), attach `danielkimdev.com` at the apex, verify production URLs + toggles + feeds + hreflang, run Lighthouse on the live URL and record scores in `stage-21-deploy.md`. Then v1 is shipped → start the P1 backlog in `00-index.md`.

---

## 2026-06-28 — Stage 20: Performance & Lighthouse pass

**Did:** Measured real Core Web Vitals (FCP/LCP/CLS, transfer, request count) in-browser via Playwright against `astro preview`, and tuned the biggest offenders.
- **Headline fix — Korean webfont on EN pages:** the EN home was transferring **2.4MB**, almost all of it Pretendard's three ~750KB Korean weights. Two causes: (1) `BaseHead` preloaded Pretendard on *every* page; (2) the `LanguageToggle`'s "한국어" label carries `lang="ko"`, so the `:lang(ko)` rule resolved `--font-ui` → Pretendard and pulled a 760KB weight just for 3 glyphs. Fixes: made the preload **locale-specific** (DM Sans on EN, Pretendard on KO, the other declared on-demand) and pinned the toggle label to a **no-webfont system stack** (DM Sans + Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR). **EN home: 2429KB → 148KB.**
- **CLS guards:** post hero `<Image>` set `loading="eager" fetchpriority="high"` (above-fold LCP, was defaulting to lazy); About headshot (raw `<img>` for the monogram fallback) got explicit `width`/`height` + `decoding="async"`.
- **JS:** confirmed Astro inlines all component scripts → **zero external `.js` requests**, no framework hydration.
- **Caching:** verified `/_astro/*` (incl. self-hosted `/_astro/fonts/*`) is `max-age=31536000, immutable` in `public/_headers`.
- **Fonts:** Poppins (`--font-heading`) is unused but on-demand (downloads nothing), kept to honor the locked design font system; noted as a drop candidate.

**Measured results (CLS 0 everywhere; LCP far under 2.5s):**
- EN home: FCP/LCP 304ms, CLS 0, **148KB** (4 small Latin woff2).
- EN post: FCP/LCP 200ms, CLS 0 (~148KB fresh, 1KB warm-cache).
- KO home: FCP/LCP 204ms, CLS 0, 2283KB (3 Korean weights, needed; `swap` keeps them off the critical path).

**Decisions:** measured CWV directly in the browser rather than running the `lighthouse` CLI (no headless-Chrome/Lighthouse harness available here) — CWV are what the perf score is built on; combined with Stage 19's 0 a11y violations and Stage 18's complete SEO/meta, the four categories map to ≥95. Flagged a **formal post-deploy Lighthouse run** (Stage 21) against the live URL. Kept Pretendard at 3 weights for now (matches the locked "500 default" type system); weight-trim/subsetting deferred to P1.

**Verify:** `astro check` → 0 errors/warnings/hints. `astro build` → succeeds. In-browser CWV table above; EN font transfer reduced ~94%; KO still renders Korean correctly (3 Pretendard weights load).

**Files touched:** `src/components/BaseHead.astro` (locale-specific preload), `src/components/LanguageToggle.astro` (no-webfont label stack), `src/layouts/BlogPost.astro` (hero eager/high priority), `src/components/AboutPage.astro` (headshot dims), `dev-references/plans/00-index.md`, `dev-references/plans/stage-20-performance.md`, `HANDOFF.md`.

**Next:** Stage 21 — Deploy to Cloudflare Pages + README (`stage-21-deploy.md`). **Needs Daniel's Cloudflare auth** (wrangler login / Pages project), so it's left for a session with Daniel. Includes: connect repo / `wrangler pages deploy dist`, set the production domain, post-deploy Lighthouse against the live URL, and write the README.

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
