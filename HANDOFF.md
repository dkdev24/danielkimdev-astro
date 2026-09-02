# HANDOFF

> **Purpose:** the one place a new session reads first — present state, not history. Full detail in [`WORKLOG.md`](WORKLOG.md).
> **Max 50 lines.** Edit in place, replace don't append, prune as you add (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-09-02 (session 19)
**Status:** Session 19 bumped `@toonstrip/astro` `0.1.9 → 0.1.10`, verified locally (EN/KO, real 363×309 canvas, all 4 panels clean), committed — **not yet pushed**, pending Daniel's confirmation (Next steps #1). Prior: **LIVE** at https://danielkimdev.com, all P0/P1/P2 shipped. Session 14's homepage pipeline still not visually verified. Sitewide Hallmark reskin (Cobalt/Aurora) live. afdocs 99/100 (A); Lighthouse not re-run since 2026-07-01.

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped (live):** P0 + P1 (22–27) + P2 (30–32), all deployed as of 2026-07-07. Per-stage notes in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **Agent readiness:** afdocs 99/100 (A), all 7 signals live (`llms.txt`, robots content-signal, `.md` siblings, body directive, `_headers`, CF Pages middleware). Gap: `/about.md` parity (timeline data, editorial call). Details: [`learning-agent-readiness-updates.md`](learning-agent-readiness-updates.md).
- **Writing-process field:** blog schema `writingProcess: "ai-assisted" | "human-written"` (default `ai-assisted`, no backfill needed). Badge in `BlogPost.astro`. See WORKLOG 2026-08-06.
- **Architecture:** every page → `BaseLayout.astro`, thin per-locale wrappers around shared `XPage.astro`. 3 collections (`blog`, `portfolio`, `timeline`) under `src/content/`, EN/KO paired by `translationKey`. Tokens in `src/styles/tokens.css` — same semantic variable names as always, values now Cobalt (light)/Aurora (dark).
- **Sitewide theme (Cobalt/Aurora, Hallmark skill):** the former homepage-only pilot is now the whole site. Light = Cobalt (cool-white, cobalt-blue accent, Space Grotesk/Inter/JetBrains Mono). Dark = Aurora (dark cyan-bloom, Fraunces serif — Sentient stand-in, cyan accent). `CobaltHeader.astro` is `BaseLayout`'s default header on every route now; `Header.astro` unused, kept pending explicit deletion. Font components moved to `BaseHead.astro` so every page loads them, not just `/`. Old MiniMax brand blue/pink/DM Sans-Outfit-Poppins retired from the token layer.
- **`toonstrip` balloon-overlap took three rounds (17–19):** blank-render fix (`0.1.6`) → width fix that missed the real 363×309 embed size (`0.1.7`/`0.1.8`) → actual fix (`0.1.9`) → root-caused why panels hit the fallback at all + a neighbour-overlap fix (`0.1.10`, EN+KO re-verified clean). Checklist: `dev-references/toonstrip-sync.md`. `.prose-breakout` fixes the demo at 46rem, pushing Korean under toonstrip's 2-column threshold.

### Invariants — easy to regress silently
- Font preload is locale-specific: DM Sans EN, Pretendard KO. Never preload Pretendard on EN.
- AA contrast: reuse semantic tokens (`--color-text-muted`, `--color-btn-primary-bg`), not raw grays.
- Blog links: always `getPostPath(entry)` (`utils/blog.ts`). CSP (`public/_headers`, only breaks in production): Umami needs **both** `cloud.umami.is`/`gateway.umami.is`; Giscus needs `giscus.app` in all three of script/frame/connect-src.
- i18n keys: add to both `en.json` and `ko.json` (parity compile-enforced).
- Don't fabricate `TODO(daniel)` facts — leave the marker for Daniel to fill.

## Locked decisions (do not re-litigate without Daniel)

- **Domain/deploy:** `danielkimdev.com` on Cloudflare Pages, static `dist/`. Default deploy = `git push origin main`. Fallback: `npm run deploy` (wrangler, `DEPLOY_ALLOW_DIRTY=1`) — never both in one session.
- **i18n routing:** `defaultLocale: "en"`, `prefixDefaultLocale: false` — EN at root, KO under `/ko/`.
- **Design:** [`DESIGN-minimax.md`](dev-references/DESIGN-minimax.md) is superseded (2026-08-26) — kept as historical record only. Live system is Hallmark's Cobalt (light) / Aurora (dark), same token names in `tokens.css`. Dark mode required, WCAG AA both themes.
- **Positioning:** Bridge angle, AI for knowledge work foregrounded. Media-tech/OTT/DRM = career credibility only (About + Portfolio).
- **Contact/social:** LinkedIn + email + GitHub + RSS. No X. GitHub repo is public (added 2026-08-21, required for Giscus/GitHub Discussions comments).
- **Naming in content:** blog posts stay generic (no employer name); portfolio keeps employer name. Author via `daniel-writing-style` skill.

## Next steps (priority order)

1. **Confirm the push with Daniel, then push `main`** — `astro@0.1.10` committed, not deployed. Re-verify on the live domain after (scroll-into-view caveat, `dev-references/toonstrip-sync.md`).
2. **Homepage pipeline section (`/`, `/ko/`) light+dark** — still unconfirmed since session 14.
3. **Cobalt/Aurora polish:** no locked Hallmark token spec for Aurora in this install — palette/fonts reconstructed from scattered refs + a Fraunces sub for Sentient. Worth a design pass; consider a `design.md` to lock it and retire `Header.astro`/`DESIGN-minimax.md`.
4. **Human-written provenance post:** Daniel plans first `writingProcess: human-written` post — remind him to set the field; draft manually, not via `daniel-writing-style`.
5. **Post-deploy Lighthouse / P1 28–29 / P2 33–36:** Lighthouse re-run; OG images, authoring docs + content-lint CI; P2 stages one-line scope.

## Conventions / gotchas

- Dev server: `astro dev --background`. UI testing: Playwright specs in `tests/e2e/*.spec.ts`, run `npm run test:e2e`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Publishing (as of 2026-08-21) runs from the wiki project's own session, straight into `src/content/blog/` — mechanical schema conversion per [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md). Picking up a new `@toonstrip/astro` release: [`dev-references/toonstrip-sync.md`](dev-references/toonstrip-sync.md).
