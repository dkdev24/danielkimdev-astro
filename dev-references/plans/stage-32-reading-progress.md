# Stage 32 — Reading progress indicator

**Session size:** ~15–20 min · **Priority:** P2 · **Theme:** Polish
**Depends on:** 17 (blog post layout) · **Next:** 33
**PRD refs:** §12 (P2 backlog) · **Design refs:** DESIGN-minimax (tokens)
**Status:** ⬜ Not started

## Goal
A thin scroll-progress bar on post pages so a reader can gauge how far through a (sometimes long,
TOC-bearing) article they are. Small, purely cosmetic enhancement — must not regress the Stage 19
accessibility pass or Stage 20 performance scores. Independent of Stages 30/31 — no ordering
constraint with either.

## Prerequisites / context
- `BlogPost.astro` already has a client-side enhancer pattern to follow: `CodeCopy.astro` is
  dropped into the layout as a small self-contained component with its own `<script>`. Do the same
  here rather than adding scroll logic inline in `BlogPost.astro`.
- The bar tracks scroll progress through `.post__body` (the prose column), not the whole document
  — the header/hero/TOC shouldn't count toward "0%", and the footer/pagination/back-link shouldn't
  count toward "100%" landing early.
- **Respects `prefers-reduced-motion`** (explicit requirement): the bar's *width updates* should
  still happen (it's information, not decoration), but any CSS `transition` smoothing that width
  change should be skipped under reduced motion — instant snap instead of an animated fill. Gate
  the transition in CSS with `@media (prefers-reduced-motion: no-preference)`, not in JS.
- **Accessibility:** this is a supplementary visual affordance, not the primary way to gauge
  position (the TOC already gives structural position). Mark the bar `aria-hidden="true"` rather
  than wiring it as a live `role="progressbar"` — a continuously-updating live region would be
  noisy for AT users for very little value. **TODO(daniel):** flag if you'd rather it be exposed
  to assistive tech instead.
- Must not shift layout (no CLS): fixed/sticky positioning, reserved height, no reflow of content
  under it.

## Tasks
- [ ] New `src/components/ReadingProgress.astro`: a fixed, thin (~3px) bar pinned to the top of
      the viewport (below any sticky header, or check z-index/stacking against `BaseLayout`'s
      header), `aria-hidden="true"`, width driven by scroll fraction through `.post__body`.
- [ ] `<script>` in that component: compute `(scrollY - bodyTop) / bodyHeight`, clamp `[0, 1]`,
      set `--progress` as a CSS custom property (or width directly); throttle with
      `requestAnimationFrame`, not a raw scroll-event handler.
- [ ] CSS: base fill color from an existing token (e.g. `--color-brand` / `--color-link`); wrap
      the width `transition` in `@media (prefers-reduced-motion: no-preference)`.
- [ ] Include `<ReadingProgress />` in `BlogPost.astro` alongside `<CodeCopy />`.

## Files to create / edit
- New: `src/components/ReadingProgress.astro`.
- Edit: `src/layouts/BlogPost.astro`.

## Acceptance criteria
- Bar fills 0→100% smoothly scrolling through a post body; near-0 at the top, at/near 100% at the
  end of the prose (before pagination/back-link), never overshoots past 100% or sticks below 0%.
- No layout shift on load (check CLS doesn't regress from the Stage 20 baseline).
- Under `prefers-reduced-motion: reduce`, the bar still reflects position but without an animated
  fill transition.
- `astro check` + `astro build` clean; works both themes, both locales.

## Verify
- Manual scroll test on a long post (e.g. `agent-readiness`) and a short one (no post should be
  able to make the bar exceed 100% or leave it stuck mid-way after reaching the end).
- Re-run the Stage 20 Lighthouse check (or at least CLS) on a post page to confirm no regression.

## Handoff note
Note the z-index/stacking decision relative to the sticky header, and whether the AT-exposure
`TODO(daniel)` above was resolved one way or the other.
