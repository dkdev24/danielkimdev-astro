# HANDOFF

> **Purpose:** the single place a new session reads first to pick up where the last one left off.
> Keep this short and current — it describes the *present* state, not history. Append full
> session history to [`WORKLOG.md`](WORKLOG.md) instead. **Update this file at the end of every session.**

**Last updated:** 2026-06-28
**Last session:** Completed **Stage 08** (footer & global chrome) — **Phase 1 complete.** Rewrote `Footer.astro` as the MiniMax dark footer (charcoal in both themes, verified via Playwright): i18n tagline, social row (LinkedIn + email + RSS), dynamic © year, secondary lang/theme toggles. Wired real contact into `consts.ts` (`CONTACT_EMAIL` + real LinkedIn; dropped X/GitHub placeholders). Both Header + Footer now render via BaseLayout slots. `astro check` 0 errors, build passes. **Stage 09 (content collections & schemas) next — start of Phase 2.**

---

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site, Cloudflare Pages.
Full build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md). Read it before substantive work.

## Current state

- **Phase:** **Phase 1 (Foundation) COMPLETE — Stages 01–08 done.** Now entering Phase 2 (Content engine); **Stage 09 next.** PRD finalized; build is broken into executable stages.
- **Design tokens (Stage 02):** light-theme token layer lives in `src/styles/tokens.css` and is the single source of truth — color, spacing (8px scale), radius, shadows (≤0.16 opacity, brand purple glow), typography (font-role vars → `--font-*`, compact size scale, 1.5 leading, 500 default weight), motion. `global.css` `@import`s it ahead of resets; base element styles reference tokens only. Legacy Bear Blog `:root` vars (`--accent`/`--black`/`--gray*`/`--box-shadow`) remain as a **deprecated** block still used by un-reworked scaffold (Header/Footer/BlogPost/blog-index) — delete in Stages 07/08/16/17. Status hues (warning/error/info) are placeholders pending Daniel.
- **Dark mode (Stage 03):** dark values live as a `[data-theme="dark"]` override of the same semantic var names in `tokens.css` (derived from the light palette — DESIGN-minimax is light-only — so they're swappable on redesign). Theme is resolved by `src/components/ThemeScript.astro` (`is:inline`, in `BaseHead` head, before paint): `localStorage.theme` (`'light'|'dark'`) wins, else `prefers-color-scheme`, written to `<html data-theme>`. No-JS degrades to light. **Toggle contract for Stage 07:** set `localStorage.theme` + `data-theme` attr, then dispatch `CustomEvent('theme-change', { detail: { theme } })` on `window`. All dark text/bg pairs verified ≥AA. **The visible toggle UI is still TODO — Stage 07.**
- **Fonts (Stage 04):** wired in `BaseHead` via Astro `<Font>` (`astro:assets`) — DM Sans + Pretendard `preload`ed, Outfit/Poppins/Roboto on demand. Each `<Font>` defines its `--font-*` var; the role vars (`--font-ui/display/heading/data/korean/body`) in `tokens.css` reference those (mapping per DESIGN-minimax §3). **Any new font referenced in tokens must also get a `<Font>` tag in `BaseHead`, or its var falls back to Helvetica.** Korean: `:lang(ko)` swaps body/heading roles to Pretendard; `body:lang(ko)` adds 1.7 leading / −0.01em tracking / `word-break: keep-all`. `optimizedFallbacks` (config) emits capsize fallback faces → no CLS. KO computed-style not yet eyeballed (no `/ko/` routes until Stage 13+).
- **i18n (Stage 05):** all UI plumbing lives in `src/i18n/`. **Dictionaries** `en.json`/`ko.json` are nested-by-surface objects (`nav`/`lang`/`theme`/`footer`/`blog`/`portfolio`/`home`/`about`/`notFound`/`common`); components look strings up by **dot path** (`t('nav.blog')`) — this is the namespace convention for all downstream stages. `utils.ts` exports `type Lang = 'en'|'ko'`, `getLangFromUrl(url)`, `useTranslations(lang)`→`t(key, params?)` (typed key union via `NestedKeyOf`; `{token}` interpolation; falls back to EN then raw key), `getLocalizedPath(path, lang)` (en→root, ko→`/ko` prefix, idempotent, passes through external/anchor links), `getAltLocale`, `formatDate`, `formatReadingTime` (1-min floor). **Adding a UI string = add the key to BOTH json files** (parity is compile-enforced by `ko satisfies typeof en`, so a missing key fails `astro check`). Content strings (post bodies, hero copy) stay in `consts.ts`/`src/data/`, not the dictionaries.
- **Layout shell (Stage 06):** `src/layouts/BaseLayout.astro` is the canonical shell — **every page renders through it.** Props: `title`, `description`, `lang` (`'en'|'ko'`), `ogImage?`, `noindex?`. It sets `<html lang>`, renders `BaseHead` (which carries the no-flash `ThemeScript` + fonts), a skip link (first focusable → `#main`), and `header`/`main#main`/`footer` landmarks. **Header & footer are placeholder named slots** (`<slot name="header"/>` / `name="footer"`) — Stage 07/08 fill them; until then empty landmark elements keep the doc valid. Pages are **full-bleed by default**: wrap content in `.container` (max `--container-max` 1200px + gutter) or `.container--prose` (720px) — don't rely on `main` for width. One global `:focus-visible` ring lives in `global.css`. `BaseHead` now takes `noindex` and has an hreflang TODO hook for Stage 18. `index.astro` is a minimal placeholder on the shell (full build Stage 13); `about.astro` + `blog/*` still use the legacy `BlogPost` layout (reworked Stages 14/16/17).
- **Footer chrome (Stage 08):** `Footer.astro` (MiniMax dark footer, DESIGN §2) renders via BaseLayout's `footer` slot — **always charcoal `#181e25` + light text in BOTH themes** (pinned to fixed brand tokens, not theme-flipping vars). Holds the i18n tagline, a social `<nav>` (**LinkedIn + email + RSS only** — no X/GitHub), a dynamic © year, and a secondary lang/theme toggle. Contact lives in `consts.ts`: `CONTACT_EMAIL` + `SOCIAL_LINKS.linkedin` (X/GitHub keys removed — re-add only if Daniel creates accounts). RSS → root `/rss.xml` with a Stage-18 TODO for per-locale feeds. Header + footer are now consistent across both locales/themes (Phase 1 chrome done).
- **Header chrome (Stage 07):** `Header.astro` (sticky pill nav, DESIGN §4) is rendered by BaseLayout's `header` slot — nav labels from the i18n dict, links via `getLocalizedPath`, active via `aria-current`. Below 768px it collapses to a hamburger (focus-trapped menu, Esc closes, focus returns). `ThemeToggle.astro` + `LanguageToggle.astro` live in the header. **Theme toggle** = a `<button>` following the Stage 03 contract; its script targets *all* `.theme-toggle` instances and listens for `theme-change`, so the Stage 08 footer can drop in another toggle with zero extra JS. **Language toggle** = a real link to the mirrored counterpart path; pass an explicit `href` for pages without a 1:1 translation (Stage 16/17 posts). **GOTCHA:** the lang toggle target `/ko/...` 404s until **Stage 13** builds the KO routes — the logic is correct, the destinations just don't exist yet. The old `HeaderLink.astro` is now unused (safe to delete in a cleanup). Theme + mobile-menu behavior was verified live in a real browser (Playwright).
- **Build plan:** P0 decomposed into 21 session-sized (~20–30 min) stage docs in [`dev-references/plans/`](dev-references/plans/) — start at [`plans/00-index.md`](dev-references/plans/00-index.md) (has dependency order, critical path, and a per-stage status column). P1/P2 parked as a backlog there.
- **`astro.config.mjs` finalized:** `site: 'https://danielkimdev.com'`, `output: 'static'`, i18n (`en` root / `ko`, `prefixDefaultLocale: false`), sitemap i18n (hreflang), locked font stack (DM Sans/Outfit/Poppins/Roboto via Google + Pretendard via Fontsource). `astro check` + `npm run build` both pass locally.
- **Repo hygiene done:** `.nvmrc` = `22.12.0`; `src/consts.ts` populated (title/description/author/socials placeholders/default OG path); `public/_headers` added (security headers + `/_astro/*` immutable cache); starter posts and Atkinson `.woff` files removed; lingering `--font-atkinson` refs cleared from `BaseHead.astro` + `global.css`.
- Installed `@astrojs/check` + `typescript` as devDependencies (needed to run `astro check`).
- The scaffold's blog pages (`pages/blog/*`, `rss.xml.js`, `layouts/BlogPost.astro`) and core components (`BaseHead`, `Header`, `Footer`) **remain** — they'll be reworked in later stages. `src/content/blog/` is now empty (Stage 10 seeds real content), so the build logs a harmless "collection blog is empty" warning.
- `AGENTS.md` (← `CLAUDE.md` symlink) points to the PRD. All architectural open questions resolved (see Decisions).
- **Recommended dev tool:** Claude Code (local toolchain). Cowork edits files fine but can't run `astro build`/`dev` against this repo's macOS `node_modules`.

## Locked decisions (do not re-litigate without Daniel)

- **Domain:** `danielkimdev.com` (Cloudflare Registrar). Set `site` in `astro.config`.
- **Deploy:** Cloudflare Pages, configured via `wrangler` CLI. Static output, build `npm run build` → `dist/`.
- **i18n routing:** `defaultLocale: "en"`, **`prefixDefaultLocale: false`** — English at root (`/`, `/about/`, `/blog/...`), Korean under `/ko/...`. (PRD §5, §7.1.)
- **Design system:** [`dev-references/DESIGN-minimax.md`](dev-references/DESIGN-minimax.md) is the visual source of truth (MiniMax-inspired). Keep tokens centralized/swappable — Daniel may redesign later.
- **Dark mode:** required; derive a dark token set from the MiniMax light palette. Both themes WCAG AA.
- **Fonts:** DM Sans (UI/body), Outfit (display), Poppins (mid-tier), Roboto (data) for Latin; Pretendard for Korean.
- **Analytics (P1):** Cloudflare Web Analytics (cookieless).
- **Portfolio detail (v1):** inline expandable cards; dedicated `/portfolio/[slug]` pages stay P1.
- **Contact / social (provided 2026-06-28, confirmed):**
  - LinkedIn: `https://www.linkedin.com/in/junhoster/` — use in Footer/social row **and** as the career link in About.
  - Public email: `danielkimdev24@gmail.com` — the site contact address. Personal Gmail by design (this is a personal blog/portfolio); do **not** use the company-domain work email here.
  - **No X (Twitter) or GitHub** accounts to show yet — omit those icons/links entirely (don't scaffold placeholders). Revisit only if Daniel creates them later.
  - Wire into `src/consts.ts` socials when building Footer (Stage 08) / About (Stage 14) / Home (Stage 13) — LinkedIn + email only for now.
- **Positioning (2026-06-27):** **Bridge** angle — engineer/product credibility, with **AI for knowledge work foregrounded** as the current focus. The blog leads on **AI knowledge management, automation, and AI-readiness ("Agent Readiness" / 에이전트 준비도) of technical docs**. Media-tech/OTT/DRM is career credibility kept to **About + Portfolio only**, not the blog.
- **Taxonomy split (PRD §5):** blog tags = `ai-knowledge-mgmt`, `automation`, `ai-ready-docs`, `ai-llm`, `pkm`, `solopreneur`; portfolio tags = `drm-content-security`, `ott-streaming`, `cloud-saas` (+ crossover). Two separate enums in the schema (Stage 09).
- **Title / tagline** (in `src/consts.ts` `SITE_TITLE_HOME` / `SITE_TAGLINE`; home hero in `src/data/home.ts`):
  - EN title: "Daniel Kim — Product & DevRel, working on AI for knowledge work"; EN tagline: "An engineer-turned-product person exploring AI knowledge management, automation, and AI-ready technical docs."
  - KO title: "Daniel Kim | 제품·DevRel, AI 기반 지식 관리 탐구"; KO tagline: "개발자로 출발한 제품 전문가가 AI 기반 지식 관리와 자동화, 그리고 기술 문서의 에이전트 준비도를 다룹니다." (KO authored natively, no em-dash.)

## Open / blocked items

- Contact/social resolved (see Locked decisions → Contact / social): LinkedIn + personal Gmail only; no X/GitHub. Nothing outstanding here.
- `TODO(daniel)`: headshot at `/public/images/daniel.jpg` (About has a graceful fallback — not blocking).
- `TODO(daniel)`: which PKM pieces seed the first 3–5 posts per locale (can scaffold with placeholder samples).
- **PRD follow-up from the 2026-06-27 positioning shift:** §5 taxonomy, §6.1 identity strip, and plan Stage 09 are realigned, but the deeper framing still leans media-tech and needs Daniel's pass — **§1 Context**, **§2 Goal 2** ("make expertise discoverable in OTT/streaming, DRM…"), and **§13.4 seed portfolio/positioning**. Decide how much AI-knowledge-work framing replaces media-tech in those.

## Next steps

1. Open [`dev-references/plans/00-index.md`](dev-references/plans/00-index.md) and work stages in numeric order, one per session.
2. **Resume point:** **Stage 09 — content collections & schemas** ([`plans/stage-09-content-collections.md`](dev-references/plans/stage-09-content-collections.md)) — first stage of Phase 2. Define the blog + portfolio (+ timeline) content collections and their Zod schemas in `src/content.config.ts`: the **two separate tag enums** (blog = `ai-knowledge-mgmt`/`automation`/`ai-ready-docs`/`ai-llm`/`pkm`/`solopreneur`; portfolio = `drm-content-security`/`ott-streaming`/`cloud-saas` + crossover) per the locked taxonomy split, per-locale content with a shared `translationKey` for i18n linkage (PRD §7.4), and draft/pubDate/updatedDate/heroImage fields. Depends only on 01.
3. Update the status column in `00-index.md` and each stage's task checkboxes as you go; refresh this file + `WORKLOG.md` at each session end.

## Conventions / gotchas

- Dev server runs in background mode: `astro dev --background` (manage with `astro dev stop|status|logs`). See `AGENTS.md`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` comments rather than inventing facts when a decision is ambiguous.
