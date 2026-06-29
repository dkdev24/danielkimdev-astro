# Stage 24 — Blog pagination / load-more

**Session size:** ~25 min · **Priority:** P1 · **Theme:** Blog scale
**Depends on:** 16 (blog index) · **Next:** 25
**PRD refs:** §12 (P1 backlog) · **Design refs:** DESIGN-minimax (tokens)

## Goal
Keep the blog index usable as the post count grows — cap the initial render and let readers reveal more, without breaking the existing tag filter or the no-JS experience.

## Prerequisites / context
- The index (`BlogIndexPage.astro`) already renders the full locale list and has a **client-side tag filter** that toggles `[hidden]` per item (progressive enhancement). Pagination must compose with it, not fight it.
- Chose **load-more** (not paginated `/blog/[page]` routes): one client-side controller is simpler, keeps the tag filter operating over the whole set, and degrades to the full list with no JS. PRD explicitly allows "pagination/load-more".
- Draft placeholder posts (Stage placeholder fixtures) give dev a 12-post locale so the pager actually triggers; prod still has the 2 real posts.

## Tasks
- [x] Add `blog.loadMore` + `blog.showingCount` to both i18n dictionaries (parity-enforced).
- [x] Add a `.blog-more` control block (status `aria-live` line + secondary `Button#blog-load-more` carrying `data-page-size="6"`), `hidden` by default so no-JS hides it.
- [x] Replace the filter-only script with a unified controller: item visibility = `matches(activeTag) && withinWindow(visible)`. Filter click resets `visible` to `PAGE_SIZE`; load-more adds `PAGE_SIZE`; block hides when a (filtered) set fits one page.
- [x] Fix the `[hidden]` override traps: `.blog-more[hidden]{display:none}` (its flex display beat the UA rule); toggle the **button** via inline `style.display` (it's Button-scoped, unreachable from this component's CSS).

## Files to create / edit
- `src/components/BlogIndexPage.astro` (markup + scoped CSS + script).
- `src/i18n/en.json`, `src/i18n/ko.json` (`blog.loadMore`, `blog.showingCount`).

## Acceptance criteria
- With > PAGE_SIZE posts: first render shows exactly PAGE_SIZE, status reads "Showing 6 of N", load-more reveals the next batch and hides itself when exhausted.
- Tag filter still works and resets the window; both compose.
- No JS → full list visible, no control block. `astro check` clean.
- Single page (e.g. prod's 2 posts) → no control block at all.

## Verify
- `astro check` + `astro build`.
- `tests/e2e/blog-pagination.spec.ts` (runs against `astro dev` with the draft fixtures): first-page count, load-more reveal, button hides, filter resets the pager. Full suite **7 passed**.

## Handoff note
PAGE_SIZE is a single constant (`data-page-size` on the button, default 6) — change it there. Stage 25 (search) layers onto this same controller: search will be another predicate ANDed with `matches()` + the window. No routes added; URL stays `/blog/` (+ `/ko/blog/`).
