# Stage 11 — Core components A (Button, Card, Tag/Chip)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 2 Content engine
**Depends on:** 03, 04 · **Next:** 12, 13, 15, 16
**PRD refs:** §8.2 · **Design refs:** DESIGN-minimax.md §4 (components), §5–6 (radius/elevation)

## Goal
Build the three highest-reuse UI primitives — Button, Card, Tag/Chip — each fully tokenized with documented variants, states, and focus-visible behavior.

## Prerequisites / context
- Tokens (Stage 02/03) and fonts (Stage 04) exist; components read variables only, no literals.

## Tasks
- [ ] `Button.astro`: variants primary / secondary / ghost; states default·hover·active·focus-visible·disabled; renders as `<a>` or `<button>` per props; ≥44px target.
- [ ] `Card.astro`: base card (generously rounded 20–24px, light shadow) + a `featured` variant with the brand purple-tinted glow (§6); slot-based for portfolio/post/featured reuse.
- [ ] `Tag.astro` (chip): topic display + selectable/filter state (`aria-pressed` when interactive); maps tag key → localized label.
- [ ] Document each component's variants/states/a11y in a short comment block at top of file.
- [ ] Verify all render correctly in light + dark.

## Files to create / edit
- `src/components/Button.astro`, `src/components/Card.astro`, `src/components/Tag.astro` — new.

## Acceptance criteria
- Every variant/state visible and on-brand in both themes.
- focus-visible styling present on Button and interactive Tag.
- No hardcoded colors/spacing — tokens only.

## Verify
- Temporary gallery page rendering all variants/states in both themes; keyboard-focus each; delete after.
- `astro check` clean.

## Handoff note
Record the component API (props) for Button/Card/Tag so pages consume them consistently.
