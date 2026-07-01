# Stage 31 — Related posts

**Session size:** ~20–25 min · **Priority:** P2 · **Theme:** Blog
**Depends on:** 17 (blog post layout), 26 (tag archives / `utils/tags.ts`), 30 (series — for the
same-series exclusion below) · **Next:** 32
**PRD refs:** §12 (P2 backlog) · **Design refs:** DESIGN-minimax (tokens, Card component)
**Status:** ⬜ Not started

## Goal
Surface a small "related posts" block on each post, computed statically from shared tags — no
client JS, no external recommendation service. Helps readers find the next thing to read, distinct
from the series prev/next nav Stage 30 already provides for series posts.

## Prerequisites / context
- Tag data already lives on every `CollectionEntry<'blog'>` (`post.data.tags`); Stage 26's
  `utils/tags.ts` shows the established pattern for tag-driven grouping but builds *archive*
  pages, not a per-post ranked list — this stage needs a new, small helper, not a reuse of that
  one directly.
- Must respect the same draft-gating as `getBlogPaths` (`utils/blog.ts`): production build drops
  `draft: true` entries, dev shows them.
- Scope is **same-locale only** — don't cross EN/KO in the related set (that's what the existing
  `counterpart`/`translationKey` link on the post header already covers).
- **Built after Stage 30 (series):** exclude same-series posts from the related block — Stage
  30's series prev/next nav already links them, so showing them again here would duplicate the
  same link under a second heading on the same page.

## Tasks
- [ ] `utils/blog.ts` (or new `utils/related.ts`): `getRelatedPosts(post, allLocalePosts, limit = 3)`
      — score candidates by count of shared tags (descending), tie-break by `pubDate` (descending),
      exclude the post itself, cap at `limit`. Return `CollectionEntry<'blog'>[]`.
- [ ] Exclude candidates that share `post.data.series` with the current post (when set) — those
      are already covered by Stage 30's series nav.
- [ ] Wire the call into `getBlogPaths(lang)` (`utils/blog.ts`) so `BlogPost.astro` receives
      `related` as a prop alongside `newer`/`older`/`counterpart` — keeps the static-build shape
      consistent with the existing pagination data.
- [ ] `BlogPost.astro`: render a "Related posts" section (reuse `Card.astro`, same card shape as
      the tag archive list) when `related.length > 0`; place it above the existing older/newer
      pagination nav so series/related context comes before generic chronological nav.
- [ ] i18n: add `blog.relatedPosts` (heading) to both `en.json`/`ko.json`.

## Files to create / edit
- New: `utils/related.ts` (or a function added to existing `utils/blog.ts` — prefer folding into
  `utils/blog.ts` unless it grows large, to avoid a one-function file).
- Edit: `src/utils/blog.ts`, `src/layouts/BlogPost.astro`, `src/i18n/{en,ko}.json`.

## Acceptance criteria
- Every non-draft post with at least one tag-sharing sibling in the same locale (excluding
  same-series siblings) shows up to 3 related posts, most-shared-tags first, ties broken by
  recency.
- A post with zero eligible siblings renders no related section (no empty heading).
- Related links point at real, published posts only (drafts excluded in prod); `astro check` +
  `astro build` clean; both locales and themes look correct.

## Verify
- `astro build`, spot-check a post with several shared-tag siblings (e.g. an `ai-llm`-tagged one)
  and one with a rare tag combination (should show fewer or none).
- Check a series post (e.g. `agent-readiness`): confirm its series-mate does **not** also appear
  in the related block.
- Optional e2e: assert the related block renders for a known-populated post and is absent on one
  with a unique tag set.

## Handoff note
Confirm the same-series exclusion is live and that no post shows a link twice (once under
"Related", once under series nav).
