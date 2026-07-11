# HANDOFF

> **Purpose:** the one place a new session reads first. Keep it short and current — it describes the
> *present* state, not history. Full per-session, per-stage detail lives in [`WORKLOG.md`](WORKLOG.md).
> **Budget: ~60 lines / one screen. Edit in place, replace don't append, prune as you add** (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-07-11 (session 3)
**Status:** **LIVE** at https://danielkimdev.com. All P0 (01–21) + P1 (22–27) + P2 (30–32) shipped. **Last deploy 2026-07-07** (agent-readiness + skill upgrade). New post `ai-memory-tool-removed` (EN/KO) committed locally — **deploy pending** (`git push origin main`). Prod is **87 pages** (pre-push); after push will be **90 pages** (+2 HTML + 1 .md endpoint). **afdocs score: 99/100 (A)**. Lighthouse **not yet re-run** since 2026-07-01 — still pending.

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped (live):** P0 complete + P1 Stages 22–27 + P2 Stages 30–32, all deployed. Last deploy 2026-07-07 (agent-readiness, 4 commits on `main`). Prod is **87 pages** (83 HTML + 4 new markdown-only .md pages). Per-stage notes in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **Agent readiness (2026-07-07):** afdocs **99/100 (A)**. All 7 signals live: `llms.txt`, `robots.txt` + content-signal, `.md` siblings for all 23 pages, body directive, `_headers` Link+Vary, CF Pages middleware (`functions/_middleware.ts`) for content negotiation. Only gap: `/about.md` parity (timeline data not in .md — acceptable, editorial). See [`learning-agent-readiness-updates.md`](learning-agent-readiness-updates.md) for rollout notes.
- **Skill upgraded (2026-07-07):** `agent-readiness-astro` bumped to **v0.2.0** — CF Pages reference flipped to scanner-verified, middleware sample fixed (two-step index.md fallback), `llms.txt` link rule added, scanner CLI-vs-web-UI note added. See `.opencode/skills/agent-readiness-astro/`.
- **OSS brief (2026-07-07):** [`agent-readiness-skill-oss-brief.md`](agent-readiness-skill-oss-brief.md) — context doc for starting the open-source version of the skill (multi-framework, multi-platform). Covers architecture, positioning vs. Cloudflare native feature, all hard-won lessons, and Astro-specific parts to replace per framework.
- **Blog post candidate:** the agent-readiness rollout + OSS idea discussion is potential blog material (series: `agent-readiness`). Before/after screenshots saved at root: `isitagentready-result-before-skill.png` and `isitagentready-result-after-skill.png`. `TODO(daniel):` draft when ready.
- **Content (2026-07-11):** standalone post `ai-memory-tool-removed` (EN/KO, tags `[ai-llm, pkm, solopreneur]`, pubDate 2026-07-11) — why Mem0 was added then removed; two-markdown-file system (HANDOFF.md + CHANGELOG.md) as the replacement. No series. Deploy pending.
- **Content (2026-07-06):** `building-llm-pkm-in-public` ep.1–ep.10 (EN/KO) live. PubDates weekly: ep1=2026-05-05 … ep10=2026-07-06. Standalone post `whatifclassics-fable5-revival` (EN/KO, tags `[solopreneur, ai-llm]`, pubDate 2026-07-06) — fully rewritten (2026-07-06) from a technical sprint recap into an AI-knowledge-architect POV piece (decomposition problem, session architecture, delegate vs. direct, frame-as-content). The whatifclassics.com Day 34 post stays as the dev diary; this post is the meta-reflection. Portfolio: `whatifclassics.md` (EN/KO) updated with Fable-5 revival paragraph + two screenshots (`public/images/portfolio/whatifclassics-{home,storyplay}.jpeg`) + Day 34 blog link.
- **Post series (Stage 30):** optional `series` enum on the blog schema (`src/data/series.ts` — 2 slugs: `agent-readiness`, `building-llm-pkm-in-public`). Order is always `pubDate`. `BlogPost.astro` shows "Part N of {total}" badge + series-scoped prev/next. Hubs at `/blog/series/<slug>/` (+`/ko/`), index at `/blog/series/`, builders in `utils/series.ts`.
- **Related posts (Stage 31):** `getRelatedPosts()` in `utils/blog.ts` ranks same-locale siblings by shared-tag count then recency, excluding self + same-series posts. **Post-deploy fix (2026-07-01):** `--space-5` token doesn't exist (scale jumps 4→6) — silently no-ops. **Re-check any new `var(--space-N)` against `tokens.css` scale** (px, 0_5, 1, 1_5, 2, 2_5, 3, 3_5, 4, 6, 8, 10, 12, 16, 20 — no 5, 7, 9, 11...).
- **Reading progress (Stage 32):** fixed 3px bar, `z-index: 60`, tracks `.post__body` via `scaleX` rAF-throttled transform. `aria-hidden` (`TODO(daniel)` on progressbar role).
- **Portfolio detail (Stage 27):** `/portfolio/<slug>/` (+ `/ko/`) via `PortfolioItem.astro`. EN/KO pair by shared slug (no `translationKey` on portfolio — field is stripped by schema). Markdown body supports standard images via `/images/portfolio/<file>` public path.
- **P1 progress:** CF Web Analytics via Automatic Setup (edge-injected). Manual beacon OFF — `CF_ANALYTICS_TOKEN` stays empty in `consts.ts`. CSP (`public/_headers`) allows `'unsafe-inline'` + `static.cloudflareinsights.com` — **don't re-tighten `script-src` to `'self'`** or it kills analytics + the no-flash theme script. Custom 404 live.
- **Architecture quick map:** every page → `BaseLayout.astro`. Thin per-locale page wrappers around shared `XPage.astro` components. 3 collections (`blog`, `portfolio`, `timeline`) under `src/content/`, EN/KO paired by `translationKey`, folder-by-locale + `lang` field. Tokens in `src/styles/tokens.css`.

### Invariants — easy to regress silently, keep them
- **Font preload is locale-specific** (`BaseHead`): DM Sans on EN, Pretendard on KO. **Never preload Pretendard on EN** (~2.3MB).
- **AA contrast tokens:** `--color-text-muted` = `--gray-500`; `.btn--primary` fills from `--color-btn-primary-bg`. Reuse semantic tokens, not raw grays/brand.
- **Blog links:** always build with `getPostPath(entry)` (`utils/blog.ts`). Routes are `/blog/<slug>/` + `/ko/blog/<slug>/`.
- **i18n strings:** add every UI key to BOTH `src/i18n/en.json` and `ko.json` (parity is compile-enforced).
- **Don't fabricate `TODO(daniel)` facts** — leave the marker for Daniel to fill.

## Locked decisions (do not re-litigate without Daniel)

- **Domain:** `danielkimdev.com` live — proxied apex CNAME → `danielkimdev.pages.dev`; `www` 301-redirects to apex. Wrangler OAuth token is zone read-only; rule edits need a scoped API token (`.env` → `cloudflare-api-token`, gitignored).
- **Deploy:** Cloudflare Pages, static `dist/`. **Default (unqualified "deploy"): `git push origin main`** — triggers auto-deploy via GitHub integration. Fallback only: `npm run deploy` (wrangler direct-upload, `DEPLOY_ALLOW_DIRTY=1`) — use when explicitly asked or when pushing isn't possible. Never run both in the same session; that causes duplicate CF Pages builds.
- **i18n routing:** `defaultLocale: "en"`, `prefixDefaultLocale: false` — EN at root, KO under `/ko/`.
- **Design:** [`DESIGN-minimax.md`](dev-references/DESIGN-minimax.md) is the visual source of truth; tokens centralized/swappable. Dark mode required, WCAG AA both themes.
- **Positioning (2026-06-27):** Bridge angle, AI for knowledge work foregrounded. Blog leads on AI/PKM/automation. Media-tech/OTT/DRM = career credibility, About + Portfolio only.
- **Contact/social:** LinkedIn + personal email only. No X/GitHub.
- **Taxonomy:** two separate enums — blog tags vs. portfolio tags. Off-enum tag fails the build.
- **Naming in content:** blog posts stay generic (no employer name, no DRM-vendor specifics). Portfolio keeps employer name. Author posts via `daniel-writing-style` skill.

## Next steps (priority order)

1. **Deploy `ai-memory-tool-removed`** — `git push origin main` to trigger CF Pages auto-deploy.
2. **Post-deploy Lighthouse** — not re-run since 2026-07-01. Baseline was Perf 97–100 / A11y 100 / BP 100 / SEO 100. The new `functions/_middleware.ts` adds a CF Pages Function — verify scores haven't regressed.
3. **P1 stages 28–29** ([`plans/00-index.md`](dev-references/plans/00-index.md)): 28 per-post OG images · 29 authoring docs + content-lint CI. P2 33–36 still one-line scope.
4. **Agent readiness fast-follows:** KO locale `.md` endpoints + KO section in `llms.txt`; `/about.md` parity (add timeline data).
5. **OSS skill project:** start from [`agent-readiness-skill-oss-brief.md`](agent-readiness-skill-oss-brief.md) — multi-framework, multi-platform open-source version of `agent-readiness-astro`.
6. **PRD framing follow-up:** §1 Context, §2 Goal 2, §13.4 still lean media-tech — needs a pass to reflect the AI-knowledge-work shift.

## Conventions / gotchas

- Dev server: `astro dev --background` (manage with `astro dev stop|status|logs`).
- **UI testing:** Playwright MCP removed. Write specs in `tests/e2e/*.spec.ts`, run `npm run test:e2e`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` rather than inventing facts when a decision is ambiguous.
- `content-materials/` holds Daniel-supplied source drafts; untracked, not shipped. Blog-post drafts arrive voice/content-final — publishing is a mechanical schema conversion per [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md).
