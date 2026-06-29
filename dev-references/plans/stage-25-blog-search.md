# Stage 25 — Blog client-side search

**Session size:** ~25 min · **Priority:** P1 · **Theme:** Blog scale
**Depends on:** 16 (blog index), 24 (load-more controller) · **Next:** 26
**PRD refs:** §12 (P1 backlog) · **Design refs:** DESIGN-minimax (tokens)
**Status:** ✅ Done (2026-06-29) — see [`../../WORKLOG.md`](../../WORKLOG.md).

## Goal
Let readers find a post by typing, without a server or a heavy client lib — a client-side
filter layered onto the existing index controller, degrading to the full list with no JS.

## Prerequisites / context
- Stage 24 left a **unified client-side controller** on `BlogIndexPage.astro` where item
  visibility = `matchesTag && withinWindow`. Search is just a **third predicate** ANDed in —
  not a new mechanism.
- Progressive enhancement is the rule: the search box ships `hidden` and is revealed by JS, so
  a no-JS visitor never sees a dead input (same pattern as the load-more block).
- No route changes — URL stays `/blog/` (+ `/ko/blog/`).

## Tasks
- [x] Add a search box (label + input + clear button) to `BlogIndexPage.astro`, `hidden` by
      default, revealed by the controller script on load.
- [x] Precompute a `data-search` attribute per item = title + summary + tag keys + localized
      tag labels, lowercased; match is **case-insensitive substring** over it.
- [x] Extend the unified controller: visibility = `matchesTag && matchesQuery && withinWindow`.
      Typing resets the pager window to `PAGE_SIZE`; the clear button empties the query.
- [x] Add a no-results message (`.blog-noresults`, `aria-live`) distinct from the zero-posts
      `.blog-empty` empty state.
- [x] Add 4 i18n keys to BOTH dicts: `searchLabel`, `searchPlaceholder`, `searchClear`, `noResults`.

## Files to create / edit
- `src/components/BlogIndexPage.astro` (markup + scoped CSS + controller script).
- `src/i18n/en.json`, `src/i18n/ko.json` (4 search keys).

## Acceptance criteria
- Typing filters the visible posts live; clear restores the full (paged) list.
- Search composes with the tag filter and the pager window (all three AND together).
- No JS → no search box, full list visible. `astro check` clean.
- Empty query shows the normal list; a query matching nothing shows `.blog-noresults`.

## Verify
- `astro check` + `astro build`.
- `tests/e2e/blog-search.spec.ts` (4): box revealed by JS, query filters, clear restores,
  no-results message shows. Full suite **15 passed** after Stage 26.

## Handoff note
Search reads only what's in `data-search` — to make a field searchable, add it there. Stage 26
(tag archives) is the crawlable counterpart to this interactive filter; both can coexist.
