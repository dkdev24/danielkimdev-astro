# Stage 28 — Auto-generated per-post OG images

**Session size:** ~25–30 min · **Priority:** P1 · **Theme:** SEO
**Depends on:** 17 (blog detail), 18 (SEO/head) · **Next:** 29
**PRD refs:** §11 (SEO/social), §12 (P1 backlog) · **Design refs:** DESIGN-minimax (tokens, palette)

## Goal
Give posts that have no hero image a distinct, branded social card instead of the single
site-wide default — a build-time 1200×630 PNG carrying the post title + site branding, so
links shared on social look intentional. KO titles must render real glyphs.

## Prerequisites / context
- OG precedence already lives in `BaseHead.astro` (and is mirrored in `BlogPost.astro`):
  **explicit `ogImage` → optimized `heroImage`/`image` → `DEFAULT_OG_IMAGE`**. This stage
  inserts a **generated card between hero and default** — it never overrides an author's
  explicit `ogImage` or a real hero.
- `ogImage` is a **path string** resolved to an absolute URL in head (not an optimized asset) —
  a generated `/og/blog/<slug>.png` URL fits that contract directly.
- Must emit **static PNGs at build** (static site, no SSR — locked deploy is static `dist/`).
- **TODO(daniel): confirm integration choice.** Recommended: `astro-og-canvas`
  (`OGImageRoute` helper) — Astro-native, build-time static PNGs, minimal code, themeable.
  Alternative is hand-rolled `satori` + `@resvg/resvg-js`. Pick one before building; the rest
  of the plan assumes the `OGImageRoute` shape.
- Fonts: the generator must be fed **DM Sans** (EN) and **Pretendard** (KO) so Korean titles
  don't tofu — reuse the same families wired in `BaseHead`.

## Tasks
- [ ] Add the chosen dep (e.g. `astro-og-canvas`) to `package.json`.
- [ ] `src/pages/og/[...route].png.ts`: `OGImageRoute` mapping over blog entries (key by the
      same slug as `getPostPath`) → `{ title, description, logo/bgGradient, font }`, branded
      per DESIGN-minimax palette. Optionally cover portfolio entries too.
- [ ] Insert the generated URL into the OG fallback in `BaseHead.astro` **and** `BlogPost.astro`:
      explicit `ogImage` → hero → **generated `/og/blog/<slug>.png`** → `DEFAULT_OG_IMAGE`.
      Consider a small `utils/og.ts` helper so both sites compute the URL identically.
- [ ] Verify KO glyphs render (load Pretendard into the generator).

## Files to create / edit
- New: `src/pages/og/[...route].png.ts` (+ optional `src/utils/og.ts`).
- Edit: `src/components/BaseHead.astro`, `src/layouts/BlogPost.astro`, `package.json`.

## Acceptance criteria
- Each hero-less post gets a unique 1200×630 PNG with title + branding; KO titles show real glyphs.
- That post's `<meta property="og:image">` points to the generated PNG; posts with an explicit
  `ogImage` or a real hero are unchanged; non-post pages still use `DEFAULT_OG_IMAGE`.
- PNGs are present under `dist/og/` after build; `astro check` + `astro build` clean.

## Verify
- `astro build`, then inspect `dist/og/` output and a hero-less post's emitted `og:image` meta.
- Optional e2e: assert a post's `og:image` URL resolves 200 and is a PNG.

## Handoff note
Record the integration chosen and how to theme the card (palette/logo/fonts). If portfolio
detail (Stage 27) shipped, note whether portfolio entries are covered too — its layout's OG
precedence can adopt the same generated-card slot ahead of `thumbnail`.
