# Stage 19 — Accessibility pass (WCAG 2.1 AA)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 4 Polish
**Depends on:** 13–18 · **Next:** 21
**PRD refs:** §11 · **Design refs:** DESIGN-minimax.md §2 (contrast)

## Goal
Verify and fix accessibility to WCAG 2.1 AA across both themes and locales, on Home + a representative post (and the shared chrome that propagates everywhere).

## Prerequisites / context
- Run the design plugin's `/design:accessibility-review` on Home + a post as the structured pass (PRD §11 verification step).

## Tasks
- [ ] **Contrast:** audit text/UI pairs in light AND dark for AA (4.5:1 text, 3:1 large/UI); fix token values where short.
- [ ] **Keyboard:** every interactive element (nav, mobile menu, both toggles, filters, TOC, copy button, expandable cards) reachable/operable; logical tab order; visible `focus-visible`; skip link works.
- [ ] **Semantics:** landmarks correct, single `h1` per page, ordered headings, `lang` per locale, meaningful `alt` (empty alt on decorative).
- [ ] **Toggles:** language + theme announce state (`aria-pressed`/labels).
- [ ] **Targets:** interactive ≥ 44×44px on touch.
- [ ] **Motion:** `prefers-reduced-motion` honored everywhere animations exist.

## Files to create / edit
- Token/style fixes across `tokens.css` and component files as the audit surfaces issues.

## Acceptance criteria
- `/design:accessibility-review` on Home + a post returns no AA violations (or all flagged items fixed).
- Full keyboard-only traversal of both locales succeeds.
- Both themes pass contrast.

## Verify
- Automated: axe / Lighthouse a11y ≥ 95.
- Manual: keyboard-only pass + screen-reader spot check on toggles and nav.

## Handoff note
Record a11y pass complete with the audit result; list any P1 a11y nice-to-haves deferred.
