# HANDOFF

> **Purpose:** the one place a new session reads first. Keep it short and current — it describes the
> *present* state, not history. Full per-session, per-stage detail lives in [`WORKLOG.md`](WORKLOG.md).
> **Budget: ~60 lines / one screen. Edit in place, replace don't append, prune as you add** (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-06-29
**Status:** **LIVE** at https://danielkimdev.com (custom domain; apex + www→apex 301; `.pages.dev` works). **Deployed 2026-06-29** with content + P1 22–23 (404 verified live). All of P0 (Stages 01–21) shipped; **P1 decomposed into Stages 22–29** (index), **22 (Web Analytics) + 23 (404) + 24 (pagination) done** (24 not yet deployed). Web Analytics runs via CF **Automatic Setup** (edge beacon). Remaining = post-deploy Lighthouse, a couple of content items, P1 Stages 25–29 — none block launch.

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped:** P0 complete + P1 Stages 22–23. Site live, both locales, all routes 200, `astro check` clean, e2e 5 passed. Per-stage notes in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **P1 progress:** Web Analytics live via CF **Automatic Setup** (edge-injected). The repo's manual beacon stays OFF — keep `CF_ANALYTICS_TOKEN` empty in `consts.ts` (a token would double-count). Custom **404** at `src/pages/404.astro` (single static `dist/404.html`, bilingual via inline locale-swap, `noindex`) — verified live.
- **Placeholder blog fixtures:** 10 EN + 10 KO `placeholder-NN-*.md` (`draft: true`) seed Stages 24–26 with volume. **Dev-only** — excluded from prod by draft gating; remove via `rm src/content/blog/{en,ko}/placeholder-*.md`. Don't flip them to `draft: false`.
- **Redeploy:** `npm run deploy` (= `astro build && wrangler pages deploy ./dist --project-name danielkimdev --branch main`). **Direct-upload project — no Git auto-deploy**; run the script to ship. Non-`main` `--branch` → isolated preview URL.
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

1. **Post-deploy Lighthouse** — run on the live URL (`danielkimdev.com`), record in [`plans/stage-21-deploy.md`](dev-references/plans/stage-21-deploy.md). (Local CWV strong: EN home 148KB, CLS 0, LCP ~300ms.)
2. **Redeploy** — only when new local work lands; `npm run deploy`. *(Deployed 2026-06-29 with content + P1 22–23; working tree is in sync with prod aside from this session's doc/decision tweaks.)*
3. **Content** — mostly done. Remaining: `portfolio/{en,ko}/digital-garden.md` "link the tooling write-up" TODO (waits on a future post); confirm whatifclassics `period: 2025–2026`; optional new post seeds. *(Headshot, KO copy, timeline, and all portfolio dates/links are now filled.)*
4. **P1 stages 25–29** ([`plans/00-index.md`](dev-references/plans/00-index.md), in order): 25 blog search · 26 tag/topic archives · 27 `/portfolio/[slug]` detail · 28 per-post OG images · 29 authoring docs + content-lint CI. *(22 Web Analytics + 23 404 + 24 pagination done.)* Stage 25 layers onto the Stage-24 index controller (search = another predicate ANDed with the tag filter + window).

## Open / needs Daniel

- **CF Web Analytics:** done via Automatic Setup. Keep `CF_ANALYTICS_TOKEN` empty — adding a token would double-count. (Edge beacon can take a few minutes to appear in page HTML after enabling.)
- **PRD framing follow-up:** §1 Context, §2 Goal 2, §13.4 still lean media-tech — needs a pass to reflect the AI-knowledge-work positioning shift.

## Conventions / gotchas

- Dev server: `astro dev --background` (manage with `astro dev stop|status|logs`).
- **UI testing:** Playwright MCP removed (token cost). Write specs in `tests/e2e/*.spec.ts`, run `npm run test:e2e` (auto-starts/reuses dev server); read only spec code + filtered logs. Rationale + rule in `AGENTS.md` → Testing.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` rather than inventing facts when a decision is ambiguous.
- `content-materials/` holds Daniel-supplied source drafts (e.g. company-blog versions to rewrite); untracked, not shipped — mine for content, don't use as-is.
