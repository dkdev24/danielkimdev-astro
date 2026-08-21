# HANDOFF

> **Purpose:** the one place a new session reads first — present state, not history. Full detail in [`WORKLOG.md`](WORKLOG.md).
> **Max 50 lines.** Edit in place, replace don't append, prune as you add (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-08-21 (session 9)
**Status:** **LIVE** at https://danielkimdev.com. All P0 (01–21) + P1 (22–27) + P2 (30–32) shipped and pushed. Session 8's new post ("AI-assisted, but where does 'assisted' actually start", EN+KO, `ai-assisted-vs-human-written-tags`) and session 9's footnote scroll-offset fix are committed and pushed. afdocs score: 99/100 (A). Lighthouse not re-run since 2026-07-01.

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped (live):** P0 + P1 (22–27) + P2 (30–32), all deployed as of 2026-07-07. Per-stage notes in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **Agent readiness:** afdocs 99/100 (A), all 7 signals live (`llms.txt`, robots content-signal, `.md` siblings, body directive, `_headers`, CF Pages middleware). Gap: `/about.md` parity (timeline data, editorial call). Details: [`learning-agent-readiness-updates.md`](learning-agent-readiness-updates.md).
- **Writing-process field:** blog schema `writingProcess: "ai-assisted" | "human-written"` (default `ai-assisted`, no backfill needed). Badge in `BlogPost.astro`. See WORKLOG 2026-08-06.
- **Architecture:** every page → `BaseLayout.astro`, thin per-locale wrappers around shared `XPage.astro`. 3 collections (`blog`, `portfolio`, `timeline`) under `src/content/`, EN/KO paired by `translationKey`. Tokens in `src/styles/tokens.css`.

### Invariants — easy to regress silently
- Font preload is locale-specific: DM Sans EN, Pretendard KO. Never preload Pretendard on EN.
- AA contrast: reuse semantic tokens (`--color-text-muted`, `--color-btn-primary-bg`), not raw grays.
- Blog links: always `getPostPath(entry)` (`utils/blog.ts`).
- Umami CSP needs **both** `cloud.umami.is` (script-src) and `gateway.umami.is` (connect-src).
- i18n keys: add to both `en.json` and `ko.json` (parity compile-enforced).
- Don't fabricate `TODO(daniel)` facts — leave the marker for Daniel to fill.

## Locked decisions (do not re-litigate without Daniel)

- **Domain/deploy:** `danielkimdev.com` on Cloudflare Pages, static `dist/`. Default deploy = `git push origin main`. Fallback: `npm run deploy` (wrangler, `DEPLOY_ALLOW_DIRTY=1`) — never both in one session.
- **i18n routing:** `defaultLocale: "en"`, `prefixDefaultLocale: false` — EN at root, KO under `/ko/`.
- **Design:** [`DESIGN-minimax.md`](dev-references/DESIGN-minimax.md) is visual source of truth. Dark mode required, WCAG AA both themes.
- **Positioning:** Bridge angle, AI for knowledge work foregrounded. Media-tech/OTT/DRM = career credibility only (About + Portfolio).
- **Contact/social:** LinkedIn + personal email only. No X/GitHub.
- **Naming in content:** blog posts stay generic (no employer name); portfolio keeps employer name. Author via `daniel-writing-style` skill.

## Next steps (priority order)

1. **Human-written provenance post:** Daniel plans first `writingProcess: human-written` post. Remind him to set that field explicitly; draft manually, not via `daniel-writing-style`.
2. **Post-deploy Lighthouse** — re-run, verify no regression from `functions/_middleware.ts`.
3. **P1 stages 28–29:** OG images, authoring docs + content-lint CI. P2 33–36 still one-line scope.
4. **Agent readiness fast-follows:** KO `.md` endpoints + KO `llms.txt` section; `/about.md` parity.

## Conventions / gotchas

- Dev server: `astro dev --background`.
- UI testing: Playwright specs in `tests/e2e/*.spec.ts`, run `npm run test:e2e`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Publishing (as of 2026-08-21) runs from the wiki project's own session, straight into `src/content/blog/`, no `content-materials/` staging — mechanical schema conversion per [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md).
