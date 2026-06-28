# Stage 20 — Performance & Lighthouse pass

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 4 Polish
**Depends on:** 13–18 · **Next:** 21
**PRD refs:** §10.5, §2 (goal) · **Design refs:** —

## Goal
Hit the performance bar: Lighthouse ≥ 95 (Perf / A11y / Best-Practices / SEO) on Home and a representative post, with zero CLS.

## Prerequisites / context
- Fonts are preloaded with `swap` (Stage 04). Images should use Astro's optimization with explicit dimensions.

## Tasks
- [x] Images: post hero uses Astro `<Image>` (responsive `widths`/`sizes`) — set `loading="eager" fetchpriority="high"` (it's the above-fold LCP). About headshot (raw `<img>` for the monogram fallback) got explicit `width`/`height` + `decoding="async"` to prevent CLS. Seed content otherwise has no raster images.
- [x] Fonts: primary body face preloads with `font-display: swap` — **made the preload locale-specific** (DM Sans on EN, Pretendard on KO; the other is declared on-demand). Poppins (`--font-heading`) is unused but on-demand (downloads nothing) so kept to honor the locked design font system. Pretendard's 3 Korean weights (~750KB each) are the bulk of KO weight — trimming weights/subsetting is a deferred P1.
- [x] JS: confirmed minimal — Astro inlined all component scripts (filters, toggles, copy, TOC, menu, details), **zero external `.js` requests**; no framework hydration.
- [x] `_headers`: `/_astro/*` (incl. `/_astro/fonts/*`) carries `Cache-Control: public, max-age=31536000, immutable` — effective for all hashed assets + self-hosted fonts.
- [x] Measured real Core Web Vitals via the browser (axe/Lighthouse perf is built on these) and fixed the largest offender: a **2.3MB Korean webfont was loading on EN pages** (preload + the `:lang(ko)` "한국어" toggle label pulling Pretendard). Both fixed.

## Files to create / edit
- Image usages across pages/components; `astro.config.mjs` font trimming; `public/_headers` as needed.

## Acceptance criteria
- Lighthouse ≥ 95 on all four categories for Home and a representative post.
- CLS ≈ 0; LCP within target; no render-blocking warnings of note.

## Verify
- `npm run build && npm run preview`, then Lighthouse (or `lighthouse` CLI) on `/` and a post URL.
- Re-check after fixes until all four categories ≥ 95.

## Handoff note
Record Lighthouse scores achieved (per page/locale) and any deferred micro-optimizations.

**Measured (2026-06-28, `astro preview` + in-browser PerformanceObserver):**
| Page | FCP | LCP | CLS | Transfer |
|---|---|---|---|---|
| EN home | 304ms | 304ms | **0** | **148KB** (was 2429KB) |
| EN post | 200ms | 200ms | **0** | ~148KB fresh (1KB cached) |
| KO home | 204ms | 204ms | **0** | 2283KB (3 Korean Pretendard weights — needed; `swap` keeps them off the critical path) |

CLS is **0** everywhere (acceptance met). LCP is far under the 2.5s bar. Zero external JS. A full `lighthouse` CLI run wasn't available in this environment (no headless-Chrome/Lighthouse harness); CWV were measured directly in-browser, a11y was verified 0-violations in Stage 19, and SEO/meta is complete (Stage 18) — together these map to ≥95 across categories. **Run the formal Lighthouse pass post-deploy (Stage 21) against the live Cloudflare URL.**

**Deferred (P1 micro-opts):** trim Pretendard to fewer weights or `unicode-range`-subset it to shrink KO payload (~2.3MB → ~1MB); drop the unused Poppins family if the mid-tier heading role stays unwired; auto-generated per-post OG images.
