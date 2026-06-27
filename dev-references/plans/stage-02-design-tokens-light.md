# Stage 02 — Design tokens (light theme)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** 01 · **Next:** 03, 04
**PRD refs:** §8.1 · **Design refs:** DESIGN-minimax.md §2 (color), §3 (type), §5 (spacing/radius), §6 (elevation)

## Goal
Stand up the centralized, swappable token layer as CSS custom properties — the single source every component reads from. **Light theme only** this session (dark is Stage 03).

## Prerequisites / context
- Daniel may redesign later, so tokens must be centralized and easy to swap — no hardcoded values in components downstream.

## Tasks
- [ ] Create `src/styles/tokens.css` with `:root { … }` custom properties.
- [ ] **Color:** neutrals (ink `#222222`, bg `#ffffff`, gray ramp), brand blue (`#1456f0` brand / `#3b82f6` primary-500 / `#2563eb` hover), decorative pink (`#ea5ec1`, logo-only — comment "never text/buttons"), semantic success/warning/error/info — all from DESIGN-minimax §2.
- [ ] **Spacing:** 8px-based step scale (DESIGN-minimax §5) as `--space-*`.
- [ ] **Radius:** 8px UI → 20–24px cards → 9999px pills as `--radius-*` (§5).
- [ ] **Shadows/elevation:** light shadows (≤0.16 opacity) + brand purple-tinted glow for featured cards (§6) as `--shadow-*`.
- [ ] **Typography:** font-family role variables mapped to the `--font-*` CSS vars from `astro.config.mjs`; size/weight/line-height scale (§3), universal `1.5` line-height, weight `500` default emphasis.
- [ ] **Motion:** `--motion-fast: 150ms`, `--motion-base: 250ms` with ease; document `prefers-reduced-motion` usage for later.
- [ ] Import `tokens.css` from `src/styles/global.css` (ahead of resets).

## Files to create / edit
- `src/styles/tokens.css` — new (the token source of truth).
- `src/styles/global.css` — import tokens; base resets reference tokens only.

## Acceptance criteria
- Every value traces to a DESIGN-minimax section (leave a comment per group).
- No component-level color/space literals introduced — only variables.
- Page renders with light palette and correct base type.

## Verify
- Add a temporary swatch/typography test page (or Storybook-style `.astro`) and eyeball against DESIGN-minimax; delete after.
- `astro check` clean.

## Handoff note
Record that the light token layer exists in `tokens.css`; dark set pending Stage 03.
