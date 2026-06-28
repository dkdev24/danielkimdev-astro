# Build Plan — Index (P0, session-sized stages)

> Decomposition of [`../astro-site-prd.md`](../astro-site-prd.md) into stages each scoped to **one ~20–30 min continuous-work session**. Scope here is **P0 only** (ship v1). P1/P2 are listed as a backlog at the bottom, not yet broken into sessions.

## How to use this

1. Work stages **in numeric order** — later stages assume earlier ones exist (see Depends-on in each file).
2. Open one stage doc, do only that session, check off its task boxes, confirm its **Acceptance criteria**, run its **Verify** step.
3. At session end, follow the project convention: update [`../../HANDOFF.md`](../../HANDOFF.md) and append to [`../../WORKLOG.md`](../../WORKLOG.md). Each stage's **Handoff note** says what to record.
4. Best run in **Claude Code** (local toolchain — Cowork's sandbox can't run `astro build`/`dev` against this repo's macOS `node_modules`).
5. If a stage runs long, stop at the last completed task box and note the cut-line in HANDOFF — the boxes are the natural resume points.

## Conventions for every stage

- Prefer the simplest Astro-native approach; leave `TODO(daniel):` rather than inventing facts (PRD §9 / §13).
- Design **values** come from [`../DESIGN-minimax.md`](../DESIGN-minimax.md); the PRD defines scope, a11y, and i18n. On aesthetic conflict, DESIGN-minimax wins; on scope/a11y/i18n, PRD wins (PRD §8).
- Both locales (EN root, KO `/ko/`) and both themes (light/dark) are first-class — every UI stage covers all four combinations.
- Verify with `astro check` + a local `astro dev`/`astro build`; keep Lighthouse for the dedicated perf stage.

## Stages

**Status legend:** ⬜ Not started · 🟡 In progress · ✅ Done. Update the cell when you pick up / finish a stage.

| # | Stage | Phase (PRD §16) | Depends on | Status |
|---|-------|-----------------|------------|--------|
| 01 | [Foundation config & repo hygiene](stage-01-foundation-config.md) | 1 Foundation | — | ✅ Done |
| 02 | [Design tokens — light](stage-02-design-tokens-light.md) | 1 Foundation | 01 | ✅ Done |
| 03 | [Dark mode token set & theme switching](stage-03-dark-mode.md) | 1 Foundation | 02 | ✅ Done |
| 04 | [Typography & font wiring](stage-04-typography-fonts.md) | 1 Foundation | 02 | ✅ Done |
| 05 | [i18n utilities & UI dictionaries](stage-05-i18n-utilities.md) | 1 Foundation | 01 | ✅ Done |
| 06 | [Base layout shell & landmarks](stage-06-base-layout.md) | 1 Foundation | 03, 04, 05 | ⬜ Not started |
| 07 | [Header: nav + language & theme toggles](stage-07-header-nav-toggles.md) | 1 Foundation | 06 | ⬜ Not started |
| 08 | [Footer & global chrome wiring](stage-08-footer-chrome.md) | 1 Foundation | 07 | ⬜ Not started |
| 09 | [Content collections & schemas](stage-09-content-collections.md) | 2 Content engine | 01 | ⬜ Not started |
| 10 | [Seed content (EN/KO posts, portfolio, timeline)](stage-10-seed-content.md) | 2 Content engine | 09 | ⬜ Not started |
| 11 | [Core components A — Button, Card, Tag](stage-11-components-core-a.md) | 2 Content engine | 03, 04 | ⬜ Not started |
| 12 | [Core components B — Callout, Timeline, Code, TOC](stage-12-components-core-b.md) | 2 Content engine | 11 | ⬜ Not started |
| 13 | [Home page (both locales)](stage-13-home.md) | 3 Pages | 08, 10, 11 | ⬜ Not started |
| 14 | [About page (both locales)](stage-14-about.md) | 3 Pages | 10, 12 | ⬜ Not started |
| 15 | [Portfolio page + filter](stage-15-portfolio.md) | 3 Pages | 10, 11 | ⬜ Not started |
| 16 | [Blog index + filter](stage-16-blog-index.md) | 3 Pages | 10, 11 | ⬜ Not started |
| 17 | [Blog post layout + MDX features](stage-17-blog-post.md) | 3 Pages | 12, 16 | ⬜ Not started |
| 18 | [SEO, feeds, sitemap, structured data](stage-18-seo-feeds.md) | 3 Pages | 13, 17 | ⬜ Not started |
| 19 | [Accessibility pass (WCAG 2.1 AA)](stage-19-accessibility.md) | 4 Polish | 13–18 | ⬜ Not started |
| 20 | [Performance & Lighthouse pass](stage-20-performance.md) | 4 Polish | 13–18 | ⬜ Not started |
| 21 | [Deploy to Cloudflare Pages + README](stage-21-deploy.md) | 5 Ship | 19, 20 | ⬜ Not started |

> **Note:** Stage 01 completed on 2026-06-27 — config finalized (`output: 'static'` added), `.nvmrc` pinned to Node 22.12.0, `consts.ts` populated, `public/_headers` added, starter posts + Atkinson fonts removed. Verified with `astro check` (0 errors) and `npm run build` (succeeds).
>
> **Note:** Stage 02 completed on 2026-06-28 — light design-token layer landed in `src/styles/tokens.css` (color/spacing/radius/shadow/type/motion, every value traced to `DESIGN-minimax.md`); `global.css` now `@import`s it and base resets read tokens only. Legacy Bear Blog vars kept as a deprecated block for un-reworked scaffold (remove in Stages 07/08/16/17). Verified `astro check` (0 errors) + `astro build` (succeeds).
>
> **Note:** Stage 03 completed on 2026-06-28 — dark token set added as a `[data-theme="dark"]` override in `tokens.css` (near-black surfaces, inverted text ramp, lighter brand/link blue, blue-shifted glow, deepened shadows; `color-scheme` per theme). No-flash resolver `src/components/ThemeScript.astro` (is:inline, reads `localStorage.theme` → falls back to `prefers-color-scheme`) wired into `BaseHead` head. Toggle contract documented for Stage 07 (key `theme`, attr `data-theme`, `theme-change` event). All dark text/bg pairs ≥AA (lowest 5.15:1). Verified `astro check` + `astro build`; inline script + dark selector confirmed in `dist`.
>
> **Note:** Stage 05 completed on 2026-06-28 — i18n plumbing landed in `src/i18n/`: `en.json` + `ko.json` UI dictionaries (identical key shape, nested-by-surface: `nav`/`lang`/`theme`/`footer`/`blog`/`portfolio`/`home`/`about`/`notFound`/`common`) and `utils.ts` (`Lang` type, `getLangFromUrl`, `useTranslations`→`t(key, params?)` with dot-path lookup + `{token}` interpolation + EN fallback, `getLocalizedPath` (root for en, `/ko` prefix for ko, idempotent), `getAltLocale`, `formatDate`, `formatReadingTime`). Key parity enforced at compile time via `ko satisfies typeof en`. Verified `astro check` (0 errors) + runtime values via tsx. Next: Stage 06 (base layout shell).
>
> **Note:** Stage 04 completed on 2026-06-28 — fonts wired via Astro's `<Font>` (from `astro:assets`) in `BaseHead`: DM Sans + Pretendard `preload`ed, Outfit/Poppins/Roboto on demand. Each `<Font>` defines its `--font-*` var (consumed by the role vars bound in `tokens.css` back in Stage 02). Korean handled via `:lang(ko)` swapping body/heading roles to Pretendard, plus `body:lang(ko)` reading tweaks (1.7 leading, −0.01em tracking, `word-break: keep-all`). `optimizedFallbacks` emits capsize-metric fallback faces → no CLS. Verified in `dist`: 5 `--font-*` vars resolve to real faces, preloads limited to the two primary faces, `:lang(ko)` rules present. Next: Stage 05 (i18n utilities & UI dictionaries).

**Critical path:** 01 → 02 → 03/04 → 05 → 06 → 07 → 08, then 09 → 10 in parallel with 11 → 12, converging on pages 13–18, finishing with 19/20 → 21.

## Not yet decomposed (P1/P2 backlog — PRD §12)

- **P1:** tag/topic archive pages, blog search, pagination/load-more, portfolio detail pages, auto-generated per-post OG images, 404 polish, Cloudflare Web Analytics, authoring docs + content-lint CI.
- **P2:** newsletter capture, post series/collections, related posts, reading progress, webmentions/external discussion links, optional hybrid/SSR, light PKM→site hand-off automation.

> When P0 ships, run this same decomposition over the P1 list to create `stage-22+`.
