# HANDOFF

> **Purpose:** the one place a new session reads first. Keep it short and current — it describes the
> *present* state, not history. Full per-session, per-stage detail lives in [`WORKLOG.md`](WORKLOG.md).
> **Budget: ~60 lines / one screen. Edit in place, replace don't append, prune as you add** (see AGENTS.md → Session continuity). **Update at the end of every session.**

**Last updated:** 2026-06-29
**Status:** **LIVE** at https://danielkimdev.pages.dev (last deploy 2026-06-28; content below is newer — **needs redeploy**). All of P0 (Stages 01–21) is shipped. Remaining = custom domain (deferred), post-deploy Lighthouse, a couple of content items, and the P1 backlog — none block launch.

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site on Cloudflare Pages. Build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md) (read before substantive work).

## Current state

- **Shipped:** P0 complete. Site live, both locales, all routes 200, `astro check` clean. Per-stage implementation notes are in [`WORKLOG.md`](WORKLOG.md); stage status in [`plans/00-index.md`](dev-references/plans/00-index.md).
- **Redeploy:** `npm run deploy` (= `astro build && wrangler pages deploy ./dist --project-name danielkimdev --branch main`). **Direct-upload project — no Git auto-deploy**; run the script to ship. Non-`main` `--branch` → isolated preview URL.
- **Architecture quick map:** every page renders through `src/layouts/BaseLayout.astro` (sets `<html lang>`, `BaseHead`, header/main/footer). Pages are thin per-locale wrappers (`pages/x.astro` + `pages/ko/x.astro`) around a shared `src/components/XPage.astro`. Content = 3 collections (`blog`, `portfolio`, `timeline`) under `src/content/`, EN/KO paired by `translationKey`, folder-by-locale + `lang` field. Tokens in `src/styles/tokens.css` are the single source of truth (light + `[data-theme="dark"]`).

### Invariants — easy to regress silently, keep them
- **Font preload is locale-specific** (`BaseHead`): DM Sans on EN, Pretendard on KO. **Never preload Pretendard on EN** (~2.3MB). `LanguageToggle` "한국어" label uses a no-webfont system stack — don't switch it to `var(--font-ui)`.
- **AA contrast tokens:** `--color-text-muted` = `--gray-500`; `.btn--primary` fills from `--color-btn-primary-bg`. Reuse these semantic tokens, not raw grays/brand.
- **Blog links:** always build with `getPostPath(entry)` (`utils/blog.ts`). Routes are `/blog/<slug>/` + `/ko/blog/<slug>/`.
- **i18n strings:** add every UI key to BOTH `src/i18n/en.json` and `ko.json` (parity is compile-enforced). Content copy stays in `consts.ts`/`src/data/`, not the dictionaries.
- **Don't fabricate `TODO(daniel)` facts** — leave the marker for Daniel to fill.

## Locked decisions (do not re-litigate without Daniel)

- **Domain:** `danielkimdev.com` (Cloudflare Registrar); `site` already set in `astro.config`. Attach at apex when ready.
- **Deploy:** Cloudflare Pages, `wrangler` CLI, static `dist/`.
- **i18n routing:** `defaultLocale: "en"`, `prefixDefaultLocale: false` — EN at root, KO under `/ko/`.
- **Design:** [`DESIGN-minimax.md`](dev-references/DESIGN-minimax.md) is the visual source of truth; keep tokens centralized/swappable. Dark mode required, both themes WCAG AA.
- **Positioning (2026-06-27):** **Bridge** angle with **AI for knowledge work foregrounded**. Blog leads on AI knowledge management, automation, and Agent Readiness (에이전트 준비도). Media-tech/OTT/DRM = career credibility, kept to About + Portfolio only.
- **Contact/social:** LinkedIn (`linkedin.com/in/junhoster/`) + personal email (`danielkimdev24@gmail.com`) only. **No X/GitHub** — omit entirely (don't scaffold).
- **Taxonomy:** two separate enums — blog tags (AI/PKM) vs. portfolio tags (media-tech + crossover). Off-enum tag fails the build.
- **Title/tagline:** in `consts.ts` (`SITE_TITLE_HOME`/`SITE_TAGLINE`); home hero in `src/data/home.ts`. KO authored natively, no em-dash.
- **Naming in content (2026-06-29):** **blog posts** stay generic — no employer name (DoveRunner/PallyCon) and no DRM-vendor specifics (FairPlay/Widevine/PlayReady/CBCS/CENC); use vendor-neutral examples. **Portfolio** keeps the employer name (career credibility). Author posts via the `daniel-writing-style` skill.

## Next steps (P0 shipped — launch + backlog, priority order)

1. **Attach custom domain** — `danielkimdev.com` at apex in the Pages dashboard. Deferred by Daniel. Canonical/sitemap already point there.
2. **Post-deploy Lighthouse** — run on the live URL, record in [`plans/stage-21-deploy.md`](dev-references/plans/stage-21-deploy.md). (Local CWV strong: EN home 148KB, CLS 0, LCP ~300ms.)
3. **Redeploy** — local content is ahead of production (portfolio + both blog posts rewritten 2026-06-29). Run `npm run deploy` to ship.
4. **Content** — mostly done. Remaining: `portfolio/{en,ko}/digital-garden.md` "link the tooling write-up" TODO (waits on a future post); confirm whatifclassics `period: 2025–2026`; optional new post seeds. *(Headshot, KO copy, timeline, and all portfolio dates/links are now filled.)*
5. **P1 backlog** ([`plans/00-index.md`](dev-references/plans/00-index.md)): Cloudflare Web Analytics (cookieless), blog search + pagination, `/portfolio/[slug]` detail pages.

## Open / needs Daniel

- **PRD framing follow-up:** §1 Context, §2 Goal 2, §13.4 still lean media-tech — needs a pass to reflect the AI-knowledge-work positioning shift.

## Conventions / gotchas

- Dev server: `astro dev --background` (manage with `astro dev stop|status|logs`).
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` rather than inventing facts when a decision is ambiguous.
- `content-materials/` holds Daniel-supplied source drafts (e.g. company-blog versions to rewrite); untracked, not shipped — mine for content, don't use as-is.
