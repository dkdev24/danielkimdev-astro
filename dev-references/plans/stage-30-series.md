# Stage 30 — Post series / collections

**Session size:** ~35–40 min · **Priority:** P2 · **Theme:** Content model
**Depends on:** 09 (content collections & schemas), 16 (blog index) — also touches 17's
`BlogPost.astro` and reuses 26's tag-archive pattern · **Next:** 31
**PRD refs:** §9 (content model), §12 (P2 backlog) · **Design refs:** DESIGN-minimax (tokens, Card)
**Status:** ✅ Done (2026-07-01) — see [`../../WORKLOG.md`](../../WORKLOG.md).

## Goal
Let multi-part posts be grouped into an ordered series: a badge + prev/next nav on each part, and
a static hub page per series for discovery — without disturbing the existing chronological blog
index or the (separate, topical) tag system.

## Prerequisites / context
- **Series ≠ tags.** Tags stay topical ("everything about `ai-ready-docs`"); series is an
  editorial arc ("read these in order"). Both apply independently to a post — don't collapse one
  into the other or remove tags from series posts.
- **Ordering = `pubDate`.** No manual order field — posts in a series publish in sequence, so the
  existing chronological sort is already the correct series order. Adding a separate order field
  would be an unused knob (AGENTS.md: don't build for hypothetical needs).
- **Two series exist today**, both real (not hypothetical):
  - `building-llm-pkm-in-public` (slug finalized 2026-07-01 once Daniel's draft named it "Building
    LLM-PKM in Public" — was provisionally `llm-wiki-in-public` when this doc was first written) —
    new, multi-part from the start.
  - `agent-readiness` — retrofits the existing `agent-readiness.md` as Part 1; a natural Part 2
    is already sitting in `content-materials/2026-06-02-how-to-measure-agent-readiness.en.md`,
    so this is genuinely ongoing, not a single post dressed up as a series.
- Mirrors Stage 26's tag-archive split: a small builder in `utils/`, a shared dumb-renderer
  component, thin per-locale route files. Reuse that shape rather than inventing a new one.
- The series **badge should show even for a single published part** — it signals "more is
  coming" without fabricating posts that don't exist yet. Only the prev/next nav is conditional
  on an adjacent part actually existing.
- **Do this before Stage 31 (related posts).** Stage 31 needs to exclude same-series posts from
  its "related" block (this stage's series nav already covers them), so building series first
  avoids reworking Stage 31 after the fact.

## Tasks
- [x] `content.config.ts`: add `series: z.enum(SERIES_SLUGS).optional()` to the blog schema,
      same enforcement pattern as `BLOG_TAGS` (off-enum value fails the build).
- [x] New `src/data/series.ts` (mirrors `src/data/home.ts`): registry of
      `{ slug, title: { en, ko }, description: { en, ko } }` — seeded with `agent-readiness` and
      `building-llm-pkm-in-public`. `SERIES_SLUGS` (the enum tuple consumed by `content.config.ts`)
      is derived from this registry, not duplicated by hand.
- [x] `utils/blog.ts`: extended `getBlogPaths` to compute, per post, `seriesIndex`/`seriesTotal`/
      `seriesPrev`/`seriesNext` when `post.data.series` is set (grouped oldest-first per slug).
      `getSeriesPosts(slug, lang)` lives in the new `utils/series.ts` instead (see below) — the
      series hub builder needed it directly, so it wasn't duplicated into `utils/blog.ts` too.
- [x] `BlogPost.astro`: series badge ("Part N of {total} · Series Title", linking to the series
      hub) rendered under the title whenever `series` is set — including 1/1 today. A
      series-scoped prev/next block (`.post__series-nav`, visually distinct tinted box with its
      own heading), rendered only when `seriesPrev`/`seriesNext` exists.
- [x] New `src/utils/series.ts` + `SeriesArchivePage.astro` (shared renderer, same shape as
      `TagArchivePage.astro` but forward-ordered — a series reads front-to-back).
- [x] Route files: `/blog/series/[slug]` (+ `/ko/`) using that renderer.
- [x] `/blog/series/` index page (+ `/ko/`) via new `SeriesIndexPage.astro`: lists every
      registered series with ≥1 published part (title, description, part count). Also linked from
      the blog index header ("All series →") whenever any listed post belongs to a series.
- [x] i18n: `blog.seriesPartLabel` ("Part {n} of {total} · {series}"), `blog.seriesNav`,
      `blog.seriesPrev`, `blog.seriesNext`, `blog.allSeries`, `blog.seriesPartsCount` +
      `blog.seriesPartsCountOne` (English pluralization) — both `en.json`/`ko.json`.
- [x] Content: added `series: agent-readiness` to `src/content/blog/{en,ko}/agent-readiness.md`.
      2026-07-01: Episode 1 of the second series shipped —
      `src/content/blog/{en,ko}/building-llm-pkm-in-public-ep1.md`, `series:
      building-llm-pkm-in-public`, adapted from Daniel's drafts in `content-materials/`.

## Files to create / edit
- New: `src/data/series.ts`, `src/utils/series.ts` (or extend `utils/blog.ts`),
  `src/components/SeriesArchivePage.astro`,
  `src/pages/{blog,ko/blog}/series/[slug].astro`, `src/pages/{blog,ko/blog}/series/index.astro`.
- Edit: `src/content.config.ts`, `src/utils/blog.ts`, `src/layouts/BlogPost.astro`,
  `src/i18n/{en,ko}.json`, `src/content/blog/{en,ko}/agent-readiness.md`.

## Acceptance criteria
- A post with `series` set shows a "Part N · Series Title" badge linking to
  `/blog/series/<slug>/`, even when N/total = 1/1 today.
- Series-scoped prev/next appears only when an adjacent part exists; it's visually distinct from
  the existing chronological older/newer pagination (both can appear on the same post without
  confusion).
- `/blog/series/<slug>/` (+ `/ko/`) lists all parts of that series in publish order (oldest
  first); `/blog/series/` lists both registered series.
- Off-enum `series` values fail the build (schema-enforced, same as tags).
- `astro check` + `astro build` clean; both locales, both themes.

## Verify
- `astro check` + `astro build` — 0 errors, prod build grew 51 → 55 pages (4 new: EN/KO ×
  series hub + series index).
- `npm run test:e2e` — all 24 specs pass, including 5 new ones in `tests/e2e/series.spec.ts`
  (badge + no-prev/next on a lone part, hub listing, series index, blog-index discovery link,
  KO localization).
- Manually confirmed via built `dist/` output: `agent-readiness` shows "Part 1 of 1 · Agent
  Readiness for Tech Docs" with no `.post__series-nav` block; `/blog/series/agent-readiness/`
  and `/blog/series/` (+ `/ko/`) render correctly, including English/Korean part-count
  pluralization ("1 part" vs "N parts").

## Handoff note
Two series are live: `agent-readiness` (1 published part — `agent-readiness.md`, retrofitted)
and `building-llm-pkm-in-public` (renamed from the placeholder `llm-wiki-in-public` slug once
Daniel's actual draft arrived — 1 published part as of 2026-07-01, `building-llm-pkm-in-public-ep1`;
see [`WORKLOG.md`](../../WORKLOG.md)). This stage is a prerequisite for Stage 31's related-posts
exclusion — it's shipped, so 31 can be picked up without the "if 30 hasn't shipped yet"
conditional in its doc.
