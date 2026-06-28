# Stage 19 — Accessibility pass (WCAG 2.1 AA)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 4 Polish
**Depends on:** 13–18 · **Next:** 21
**PRD refs:** §11 · **Design refs:** DESIGN-minimax.md §2 (contrast)

## Goal
Verify and fix accessibility to WCAG 2.1 AA across both themes and locales, on Home + a representative post (and the shared chrome that propagates everywhere).

## Prerequisites / context
- Run the design plugin's `/design:accessibility-review` on Home + a post as the structured pass (PRD §11 verification step).

## Tasks
- [x] **Contrast:** audited text/UI pairs in light AND dark via axe-core (wcag2a/2aa/21a/21aa). Found + fixed 2 AA fails: light muted meta text `--color-text-muted` (gray-400 #8e8e93 → 3.26, now **gray-500 #5f5f5f ~6.4:1**) and the dark primary CTA (white on brand #3b82f6 → 3.67, now a dedicated `--color-btn-primary-bg` = primary-600 #2563eb, **5.17:1**). Re-verified 0 violations.
- [x] **Keyboard:** verified by code review — Header mobile menu has full focus-trap + Escape + focus-return + click-outside; both toggles + filter chips are real `<button>`s; TOC + expandable cards use native `<details>`; copy button is a focusable button; skip link present (BaseLayout). Global `:focus-visible` ring in global.css. axe found no missing-name/role issues.
- [x] **Semantics:** single `h1` per page (verified in dist), landmarks (header/main#main/footer + labelled `nav`), `lang` per locale (html lang=ko on /ko/), decorative images carry empty `alt` (hero/headshot).
- [x] **Toggles:** theme toggle syncs `aria-pressed` + swaps `aria-label`; language toggle has `aria-label`; nav hamburger toggles `aria-expanded` + label.
- [x] **Targets:** nav links, both toggles, hamburger, and footer social links are ≥44×44px (min-height/explicit sizes).
- [x] **Motion:** global `@media (prefers-reduced-motion: reduce)` kill-switch in global.css neutralizes all animation/transition/scroll.

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

**Result (2026-06-28):** axe-core (wcag2a/2aa/21a/21aa) on Home, a post, Portfolio, and KO home in BOTH themes → **0 violations** after the 2 contrast fixes (20 passing checks on the post). `/design:accessibility-review` skill wasn't available in this environment; axe-core was used as the equivalent automated audit. A holistic Lighthouse run (incl. the a11y score) is folded into Stage 20. **Deferred (P1):** screen-reader manual spot-check (NVDA/VoiceOver) — automated + code review only here; the language toggle on a hypothetical orphan (counterpart-less) post links to a 404 (Stage 07 scope, moot for the all-paired seed content).
