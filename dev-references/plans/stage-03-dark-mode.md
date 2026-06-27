# Stage 03 — Dark mode token set & theme switching

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 02 · **Next:** 06, 11
**PRD refs:** §8.1, §11 · **Design refs:** DESIGN-minimax.md §2 (palette), §8 source-of-truth note

## Goal
Derive a dark token set from the same MiniMax palette and add the theme-switching mechanism (system pref + manual, persisted, no flash). DESIGN-minimax specifies light only — dark is derived here.

## Prerequisites / context
- Near-black surfaces in the `#181e25` / `#18181b` family, inverted text ramp, accent kept legible. Both themes must meet WCAG AA (§11).

## Tasks
- [ ] In `tokens.css`, add a dark override block — `[data-theme="dark"] { … }` re-binding the same variable names to dark values.
- [ ] Map: surfaces → near-black family; text ramp inverted; brand blue adjusted so it stays AA on dark; shadows softened/replaced with subtle borders where shadows read poorly on dark.
- [ ] Decide resolution order: `data-theme` attribute on `<html>` wins; fall back to `prefers-color-scheme`.
- [ ] Add a **no-flash inline script** (runs in `<head>` before paint) that sets `data-theme` from `localStorage` (`theme`) or system pref. (The visible toggle UI is built in Stage 07; this stage provides the mechanism + the setter contract `localStorage.theme = 'light'|'dark'`.)
- [ ] Document the toggle contract (storage key, attribute, event) as a comment for Stage 07.

## Files to create / edit
- `src/styles/tokens.css` — add `[data-theme="dark"]` block.
- `src/components/ThemeScript.astro` (or inline partial) — no-flash setter, new.

## Acceptance criteria
- Toggling `data-theme="dark"` on `<html>` in devtools fully restyles the page with no missing variables.
- No white flash on reload when dark is the stored/preferred theme.
- Spot-check 3 key text/bg pairs in dark meet AA (full audit in Stage 19).

## Verify
- Manually set `localStorage.theme='dark'` and reload — page paints dark immediately.
- Toggle `data-theme` in devtools and scan for any unstyled (default-color) elements.

## Handoff note
Record that dark tokens + no-flash mechanism exist; visible toggle wired in Stage 07.
