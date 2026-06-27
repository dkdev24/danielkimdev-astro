# Stage 07 — Header: nav + language & theme toggles

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 06 · **Next:** 08
**PRD refs:** §5 (nav), §7.3 (lang toggle), §8.2 (components), §11 (keyboard/aria) · **Design refs:** DESIGN-minimax.md §4 (pill nav)

## Goal
Build the sticky responsive header: pill nav with current-page state, mobile menu, and the language + theme toggles — all keyboard-operable and screen-reader-correct.

## Prerequisites / context
- Theme contract from Stage 03 (`localStorage.theme`, `data-theme` on `<html>`). Lang routing/helpers from Stage 05.

## Tasks
- [ ] Create `src/components/Header.astro` (sticky pill nav per DESIGN-minimax §4): Home · About · Portfolio · Blog, labels from i18n dict, links via `getLocalizedPath`.
- [ ] Current-page indicated (aria-current="page") and styled.
- [ ] Responsive: collapse to mobile menu < 768px; menu button is keyboard-operable, focus-trapped while open, Esc closes.
- [ ] Create `src/components/LanguageToggle.astro`: switches to the current page's counterpart locale if it exists, else the locale's equivalent section (never a 404); persists choice; `aria-pressed`/clear label.
- [ ] Create `src/components/ThemeToggle.astro`: toggles `data-theme` + writes `localStorage.theme`; `aria-pressed`, announces state; respects the Stage 03 no-flash setter.
- [ ] All interactive targets ≥ 44×44px; visible `focus-visible` styles.

## Files to create / edit
- `src/components/Header.astro` — replace starter header.
- `src/components/LanguageToggle.astro`, `src/components/ThemeToggle.astro` — new.

## Acceptance criteria
- Keyboard-only: tab through nav, open/close mobile menu, operate both toggles.
- Language toggle never lands on a 404; choice persists across reload.
- Theme toggle flips light/dark and persists; no flash.

## Verify
- Manual keyboard pass + screen-reader label check on toggles.
- Resize to 375px: mobile menu works.

## Handoff note
Record that header chrome + both toggles are live and a11y-checked (full audit Stage 19).
