# HANDOFF

> **Purpose:** the one place a new session reads first. Keep it short and current — it describes the
> *present* state, not history. Full per-session, per-stage detail lives in [`WORKLOG.md`](WORKLOG.md).
> **Budget: ~60 lines / one screen. Edit in place, replace don't append, prune as you add** (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-07-01
**Status:** **LIVE** at https://danielkimdev.com (custom domain; apex + www→apex 301; `.pages.dev` works). All of P0 (Stages 01–21) shipped; **P1 (22–29) fully decomposed**, **P2 stage 30 (series) + 31 (related posts) built** (local, not yet deployed), 32–36 decomposed with a plan doc for 32. **Stages 22–27 deployed** (last deploy 2026-06-30: career timeline + DoveRunner dual-role content update). **Post-deploy Lighthouse done** (live: Perf 97–100, A11y 100, BP 100, SEO 100 — see [`plans/stage-21-deploy.md`](dev-references/plans/stage-21-deploy.md)). Nothing here blocks launch (already live).

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped (live):** P0 complete + P1 Stages 22–27 deployed; last deploy 2026-06-30 (commit `4aadae0`) — career timeline + role update. Prod build **51 pages**, still `origin/main`'s deployed state. Per-stage notes in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **Not yet deployed:** Stage 30 (post series) + the first `building-llm-pkm-in-public` post + Stage 31 (related posts) built locally 2026-07-01 — local build is still **59 pages** (Stage 31 adds no new routes, just a section on existing post pages). Redeploy when ready.
- **Related posts (Stage 31):** `getRelatedPosts()` in `utils/blog.ts` ranks same-locale siblings by shared-tag count then recency, excluding self + same-series posts; wired through `getBlogPaths` → **both** locale route files (they destructure named props, so a new prop needs adding in three places, not just the layout) → a `Related posts`/`관련 글` section in `BlogPost.astro`. Details: [`plans/stage-31-related-posts.md`](dev-references/plans/stage-31-related-posts.md).
- **Post series (Stage 30):** blog schema gained an optional `series` enum (`src/data/series.ts` is the registry — 2 slugs: `agent-readiness` [1 published part, retrofitted onto `agent-readiness.md`] and `building-llm-pkm-in-public` [1 published part as of 2026-07-01: `building-llm-pkm-in-public-ep1`, adapted from Daniel's drafts in `content-materials/`]). Series order is always `pubDate`, no manual order field. `BlogPost.astro` shows a "Part N of {total} · {series}" badge (even at 1/1) + series-scoped prev/next distinct from the regular older/newer pagination. Hub pages at `/blog/series/<slug>/` (+ `/ko/`), index at `/blog/series/` (+ `/ko/`), builders in `utils/series.ts` (mirrors `utils/tags.ts`'s split). Plan doc + tests: [`plans/stage-30-series.md`](dev-references/plans/stage-30-series.md), `tests/e2e/series.spec.ts`.
- **Portfolio detail (Stage 27):** `/portfolio/<slug>/` (+ `/ko/`) via `PortfolioItem.astro` + `utils/portfolio.ts` (mirrors `BlogPost`/`utils/blog.ts`). EN/KO pair by **shared slug** (no `translationKey` on portfolio — the field is in the `.md` files but stripped by the schema). Index cards + tag-archive titles now **link to detail**; the Stage-15 inline `<details>` expander was replaced by a "View details →" link (detail page owns the body/links).
- **Blog index controller** (`BlogIndexPage.astro`): one render pass composes search (substring over `data-search`) AND tag filter AND the pager window. Search box + load-more ship `hidden`, revealed by JS (no-JS shows the full list). **Tag archives** (Stage 26): static `/blog/tags/<tag>/` + `/portfolio/tags/<tag>/` (+ `/ko/`), shared `TagArchivePage.astro` fed by `src/utils/tags.ts`. Both blog and portfolio archive titles **link to detail pages** (portfolio since Stage 27). Item tag chips link into the archives.
- **P1 progress:** Web Analytics via CF **Automatic Setup** (edge-injected). The repo's manual beacon stays OFF — keep `CF_ANALYTICS_TOKEN` empty in `consts.ts` (a token would double-count). **NB:** the beacon (and the inline no-flash theme script) were silently blocked by the prod CSP until 2026-06-29 — `script-src` now allows `'unsafe-inline'` + `static.cloudflareinsights.com`, `connect-src` allows `cloudflareinsights.com`. **Don't re-tighten `public/_headers` `script-src` back to `'self'`** or you'll kill both again (dev doesn't apply `_headers`, so e2e won't catch it). Custom **404** at `src/pages/404.astro` (single static `dist/404.html`, bilingual via inline locale-swap, `noindex`) — verified live.
- **Placeholder blog fixtures:** 10 EN + 10 KO `placeholder-NN-*.md` (`draft: true`) seed Stages 24–26 with volume. **Dev-only** — excluded from prod by draft gating; remove via `rm src/content/blog/{en,ko}/placeholder-*.md`. Don't flip them to `draft: false`.
- **Redeploy:** `npm run deploy` (= `astro build && wrangler pages deploy ./dist --project-name danielkimdev --branch main`). **Direct-upload project — no Git auto-deploy**; run the script to ship. Non-`main` `--branch` → isolated preview URL. A `predeploy` guard (`scripts/predeploy-guard.mjs`, **Node — not a shell script**, since npm on Windows runs scripts via `cmd.exe`, whose PATH usually lacks `sh`/`bash` even with Git installed) warns on a dirty tree / non-`main` / origin drift and prompts `[y/N]`; override with `DEPLOY_ALLOW_DIRTY=1 npm run deploy`.
- **Architecture quick map:** every page renders through `src/layouts/BaseLayout.astro` (sets `<html lang>`, `BaseHead`, header/main/footer). Pages are thin per-locale wrappers (`pages/x.astro` + `pages/ko/x.astro`) around a shared `src/components/XPage.astro`. Content = 3 collections (`blog`, `portfolio`, `timeline`) under `src/content/`, EN/KO paired by `translationKey`, folder-by-locale + `lang` field. Tokens in `src/styles/tokens.css` are the single source of truth (light + `[data-theme="dark"]`).

### Invariants — easy to regress silently, keep them
- **Font preload is locale-specific** (`BaseHead`): DM Sans on EN, Pretendard on KO. **Never preload Pretendard on EN** (~2.3MB). `LanguageToggle` "한국어" label uses a no-webfont system stack — don't switch it to `var(--font-ui)`.
- **AA contrast tokens:** `--color-text-muted` = `--gray-500`; `.btn--primary` fills from `--color-btn-primary-bg`. Reuse these semantic tokens, not raw grays/brand.
- **Blog links:** always build with `getPostPath(entry)` (`utils/blog.ts`). Routes are `/blog/<slug>/` + `/ko/blog/<slug>/`.
- **i18n strings:** add every UI key to BOTH `src/i18n/en.json` and `ko.json` (parity is compile-enforced). Content copy stays in `consts.ts`/`src/data/`, not the dictionaries.
- **Don't fabricate `TODO(daniel)` facts** — leave the marker for Daniel to fill.

## Locked decisions (do not re-litigate without Daniel)

- **Domain (connected 2026-06-29):** `danielkimdev.com` live on the `danielkimdev` Pages project — proxied apex CNAME → `danielkimdev.pages.dev`; `www` 301-redirects to apex (dynamic-redirect ruleset, path+query preserved). Zone is in the same CF account. Wrangler OAuth token can't write rules (zone read-only); rule edits need a scoped API token (`.env` → `cloudflare-api-token`, gitignored — rotate when done).
- **Deploy:** Cloudflare Pages, `wrangler` CLI, static `dist/`.
- **i18n routing:** `defaultLocale: "en"`, `prefixDefaultLocale: false` — EN at root, KO under `/ko/`.
- **Design:** [`DESIGN-minimax.md`](dev-references/DESIGN-minimax.md) is the visual source of truth; keep tokens centralized/swappable. Dark mode required, both themes WCAG AA.
- **Positioning (2026-06-27):** **Bridge** angle with **AI for knowledge work foregrounded**. Blog leads on AI knowledge management, automation, and Agent Readiness (에이전트 준비도). Media-tech/OTT/DRM = career credibility, kept to About + Portfolio only.
- **Contact/social:** LinkedIn (`linkedin.com/in/junhoster/`) + personal email (`danielkimdev24@gmail.com`) only. **No X/GitHub** — omit entirely (don't scaffold).
- **Taxonomy:** two separate enums — blog tags (AI/PKM) vs. portfolio tags (media-tech + crossover). Off-enum tag fails the build.
- **Title/tagline:** in `consts.ts` (`SITE_TITLE_HOME`/`SITE_TAGLINE`); home hero in `src/data/home.ts`. KO authored natively, no em-dash.
- **Naming in content (2026-06-29):** **blog posts** stay generic — no employer name (DoveRunner/PallyCon) and no DRM-vendor specifics (FairPlay/Widevine/PlayReady/CBCS/CENC); use vendor-neutral examples. **Portfolio** keeps the employer name (career credibility). Author posts via the `daniel-writing-style` skill.

## Next steps (P0 shipped — launch + backlog, priority order)

1. **Post-deploy Lighthouse** — ✅ done 2026-06-29 (live scores Perf 97–100 / A11y 100 / BP 100 / SEO 100; recorded in [`plans/stage-21-deploy.md`](dev-references/plans/stage-21-deploy.md), incl. the CSP fix that took BP 93→100). Re-run after major changes.
2. **Redeploy** — `npm run deploy` when new local work lands (predeploy guard prompts on a dirty/non-`main`/drifted tree). **Note:** the guard is Node (fixed 2026-07-01 — was a `sh` script that failed on plain Windows PowerShell/cmd, where Git's `usr/bin`/`bin` aren't on PATH even though `git` itself resolves); `npm run deploy` still wants an interactive terminal for the `[y/N]` prompt and `wrangler login` if not already authenticated. On a fresh machine run `npm install` first. *(Last deploy 2026-06-30 = content update; prod in sync with `origin/main`.)*
3. **Content** — mostly done. `building-llm-pkm-in-public-ep1` shipped 2026-07-01 (not yet deployed); resolved the `portfolio/{en,ko}/digital-garden.md` "link the tooling write-up" TODO by linking to it. Remaining: confirm whatifclassics `period: 2025–2026`. *(Full career timeline 2000–present live; DoveRunner dual role reflected across timeline, bio, and portfolio.)*
4. **P1 stages 28–29** ([`plans/00-index.md`](dev-references/plans/00-index.md)): 28 per-post OG images · 29 authoring docs + content-lint CI. *(22–27 done.)* **P2 stages 30 (series) + 31 (related posts) done** (2026-07-01, not yet deployed — see above); **32 (reading progress)** has a plan doc and can be picked up next, independent of 31. 33–36 still just one-line scope in the index.

## Open / needs Daniel

- **CF Web Analytics** — ✅ resolved 2026-06-30. Was showing zero visitors; just needed time to populate after setup. Automatic Setup (edge-injected) is working on `danielkimdev.com`.
- **PRD framing follow-up:** §1 Context, §2 Goal 2, §13.4 still lean media-tech — needs a pass to reflect the AI-knowledge-work positioning shift.

## Conventions / gotchas

- Dev server: `astro dev --background` (manage with `astro dev stop|status|logs`).
- **UI testing:** Playwright MCP removed (token cost). Write specs in `tests/e2e/*.spec.ts`, run `npm run test:e2e` (auto-starts/reuses dev server); read only spec code + filtered logs. Rationale + rule in `AGENTS.md` → Testing.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` rather than inventing facts when a decision is ambiguous.
- `content-materials/` holds Daniel-supplied source drafts; untracked, not shipped. Blog-post drafts arrive **voice/content-final** from a separate LLM-wiki project (already through `daniel-writing-style` + a `draft-review-kit` there) — **don't re-run `daniel-writing-style` here**, publishing is a mechanical schema conversion. Follow [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md) (field mapping, tag/series rules, cleanup checklist). **Delete the source `-en`/`-ko` pair from `content-materials/` once the post is verified** (not gated on deploying — the wiki project is the source of truth, this repo's copy is disposable once it's in `src/content/blog/`). Non-blog source drafts (e.g. company-blog versions to rewrite) still need mining/adaptation as before.
