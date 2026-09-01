# HANDOFF

> **Purpose:** the one place a new session reads first — present state, not history. Full detail in [`WORKLOG.md`](WORKLOG.md).
> **Max 50 lines.** Edit in place, replace don't append, prune as you add (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-09-01 (session 18)
**Status:** **LIVE** at https://danielkimdev.com. All P0 (01–21) + P1 (22–27) + P2 (30–32) shipped. Session 18 bumped `@toonstrip/astro` twice (`0.1.6→0.1.7→0.1.8`, upstream balloon-overlap + hash-collision fixes; see Current state), pushed both, and **confirmed live** on the real domain. Session 14's homepage pipeline section still not visually verified. Sitewide Hallmark reskin (Cobalt/Aurora, session 13) live. afdocs 99/100 (A); Lighthouse not re-run since 2026-07-01.

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped (live):** P0 + P1 (22–27) + P2 (30–32), all deployed as of 2026-07-07. Per-stage notes in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **Agent readiness:** afdocs 99/100 (A), all 7 signals live (`llms.txt`, robots content-signal, `.md` siblings, body directive, `_headers`, CF Pages middleware). Gap: `/about.md` parity (timeline data, editorial call). Details: [`learning-agent-readiness-updates.md`](learning-agent-readiness-updates.md).
- **Writing-process field:** blog schema `writingProcess: "ai-assisted" | "human-written"` (default `ai-assisted`, no backfill needed). Badge in `BlogPost.astro`. See WORKLOG 2026-08-06.
- **Architecture:** every page → `BaseLayout.astro`, thin per-locale wrappers around shared `XPage.astro`. 3 collections (`blog`, `portfolio`, `timeline`) under `src/content/`, EN/KO paired by `translationKey`. Tokens in `src/styles/tokens.css` — same semantic variable names as always, values now Cobalt (light)/Aurora (dark).
- **Sitewide theme (Cobalt/Aurora, Hallmark skill):** the former homepage-only pilot is now the whole site. Light = Cobalt (cool-white, cobalt-blue accent, Space Grotesk/Inter/JetBrains Mono). Dark = Aurora (dark cyan-bloom, Fraunces serif — Sentient stand-in, cyan accent). `CobaltHeader.astro` is `BaseLayout`'s default header on every route now; `Header.astro` unused, kept pending explicit deletion. Font components moved to `BaseHead.astro` so every page loads them, not just `/`. Old MiniMax brand blue/pink/DM Sans-Outfit-Poppins retired from the token layer.
- **`toonstrip` deployed-blank bug fixed (session 17), two more upstream fixes picked up (session 18):** session 17 fixed the demo rendering blank in production (CSP `unsafe-eval`, `astro@0.1.6`) and pushed. Session 18 picked up `astro@0.1.7` (a narrow first-balloon width roll was pushing the second speaker's balloon into their own head — found on this repo's own `grues-in-comic-beta` post) and `astro@0.1.8` (a `panelSeed` hash-collision fix, no visible change expected). Verified each locally via `astro preview` + screenshot before pushing; see `dev-references/toonstrip-sync.md` for the checklist now codifying this. Separately, `.prose-breakout` (`src/styles/global.css`) wraps the demo (EN/KO) at a fixed 46rem width since `max-width: 72ch` differs per body font (Pretendard vs Latin), pushing Korean under toonstrip's 2-column threshold.

### Invariants — easy to regress silently
- Font preload is locale-specific: DM Sans EN, Pretendard KO. Never preload Pretendard on EN.
- AA contrast: reuse semantic tokens (`--color-text-muted`, `--color-btn-primary-bg`), not raw grays.
- Blog links: always `getPostPath(entry)` (`utils/blog.ts`).
- CSP (`public/_headers`, only breaks in production, dev server has none): Umami needs **both** `cloud.umami.is` (script-src) and `gateway.umami.is` (connect-src); Giscus needs `giscus.app` in **all three** of script-src, frame-src, connect-src.
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

1. **Homepage pipeline section (`/`, `/ko/`) light+dark** — still unconfirmed since session 14. (Session 18's toonstrip push confirmed live on `/blog/grues-in-comic-beta/`, both panels correct — but note: `<ComicStrip>` is `client:visible`, so a headless/automated check must scroll it fully into view or it reads as blank even when working. See `dev-references/toonstrip-sync.md`.)
2. **Cobalt/Aurora polish:** no locked Hallmark token spec exists for Aurora in this install (only Cobalt/Lumen have `.md` theme files) — its palette/fonts were reconstructed from scattered references and Fraunces subs for the Fontshare-exclusive Sentient. Worth a design pass to confirm exact hues/type read as intended. Consider producing a `design.md` at the project root to lock the now-sitewide system (Hallmark's convention for system-managed projects) and formally retire `Header.astro`/`DESIGN-minimax.md`.
3. **Human-written provenance post:** Daniel plans first `writingProcess: human-written` post. Remind him to set that field explicitly; draft manually, not via `daniel-writing-style`.
4. **Post-deploy Lighthouse / P1 28–29 / P2 33–36:** Lighthouse re-run (verify no `functions/_middleware.ts` regression); OG images, authoring docs + content-lint CI; P2 stages still one-line scope.

## Conventions / gotchas

- Dev server: `astro dev --background`. UI testing: Playwright specs in `tests/e2e/*.spec.ts`, run `npm run test:e2e`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Publishing (as of 2026-08-21) runs from the wiki project's own session, straight into `src/content/blog/` — mechanical schema conversion per [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md). Picking up a new `@toonstrip/astro` release: [`dev-references/toonstrip-sync.md`](dev-references/toonstrip-sync.md).
