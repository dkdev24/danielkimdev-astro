# WORKLOG

> **Purpose:** append-only history of every working session. Newest entry on top.
> For the *current* state and what to do next, see [`HANDOFF.md`](HANDOFF.md) instead.
> At the end of each session, add an entry here and refresh `HANDOFF.md`.

Entry template:

```
## YYYY-MM-DD — <short title>
**Did:** what changed this session.
**Decisions:** any decisions locked (with why).
**Files touched:** key files.
**Next:** what the next session should pick up.
```

---

## 2026-06-27 — Positioning pivot to AI-for-knowledge-work; title/tagline set

**Did:**
- Recommended and set the site **title + tagline** (EN + KO) in `src/consts.ts` (`SITE_TITLE_HOME`, `SITE_TAGLINE`, `SITE_DESCRIPTION_BY_LOCALE`; legacy scalar `SITE_DESCRIPTION` retained, derived from EN) and seeded the home hero in new `src/data/home.ts` (`HOME_HERO` with name/tagline/subhead/`focusAreas`). KO authored natively via the `daniel-writing-style` skill (합쇼체, no em-dash), not translated.
- **Repositioned the site** per Daniel: blog now leads on **AI for knowledge work** — AI knowledge management, automation, and AI-readiness ("Agent Readiness" / 에이전트 준비도) of technical docs. Media-tech/OTT/DRM demoted from the headline to **credibility substrate in About/Portfolio only** ("career as proof, not a second topic" — Bridge angle).
- Swapped KO term to **에이전트 준비도** (with `(Agent Readiness)` 병기 in the description) per the style profile; updated the home focus chip.
- Realigned the PRD: **§5** taxonomy split into blog tags (`ai-knowledge-mgmt`, `automation`, `ai-ready-docs`, `ai-llm`, `pkm`, `solopreneur`) vs. portfolio tags (`drm-content-security`, `ott-streaming`, `cloud-saas` + crossover); **§6.1** identity strip rewritten to the AI pillars; **§1/§2/§13** rewritten to encode the throughline (AI focus, career as proof) incl. a tightened §13.1 About bio and reordered §13.4 portfolio (AI/agent-ready-docs lead item first); **§15** logs the decision.
- Updated plan **Stage 09** to define the two-enum (blog vs portfolio) taxonomy.

**Decisions (locked):**
- **Positioning:** Bridge angle — AI-for-knowledge-work foregrounded; media-tech career as credibility substrate (About/Portfolio only).
- **Taxonomy:** split blog vs portfolio tag sets (two enums in the content schema).
- **Title/tagline (EN/KO):** recorded in `HANDOFF.md` Locked decisions.

**Verify:** Korean strings em-dash-free; old "AI-for-media / senior media-tech operator" framing cleared; legacy `SITE_DESCRIPTION` export intact (starter imports unbroken). Full `astro check`/`build` to be run locally (sandbox arch mismatch).

**Files touched:** `src/consts.ts`, `src/data/home.ts` (new), `dev-references/astro-site-prd.md` (§1, §2, §5, §6.1, §13, §15), `dev-references/plans/stage-09-content-collections.md`, `HANDOFF.md`.

**Next:** Daniel to confirm KO register choices (디지털 가든 loanword; 프로덕트 vs 제품) and optionally have the style skill finish the §13.2 KO About draft. Build continues at Stage 02 (design tokens).

---

## 2026-06-27 — Stage 01 complete: foundation config & repo hygiene

**Did:**
- Added `output: 'static'` to `astro.config.mjs` (explicit static build for Cloudflare Pages); confirmed the already-locked `site`, i18n, sitemap-i18n, and font config.
- Pinned Node with `.nvmrc` = `22.12.0`; `package.json` `engines.node` (`>=22.12.0`) is satisfied by the pin.
- Rewrote `src/consts.ts`: `SITE_TITLE` ("Daniel Kim"), `SITE_DESCRIPTION` (PRD §8.2 positioning line), `SITE_AUTHOR`, `DEFAULT_OG_IMAGE` (`/og-default.png`, asset TODO), and `SOCIAL_LINKS` (LinkedIn/X/GitHub placeholders, `TODO(daniel)`).
- Created `public/_headers` (Cloudflare Pages): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, a `Permissions-Policy`, a baseline CSP, and `immutable` long-cache for `/_astro/*`.
- Removed the 5 starter posts (`first-post`, `second-post`, `third-post`, `markdown-style-guide`, `using-mdx`) and the Atkinson `.woff` files. Cleared the leftover `--font-atkinson` references in `BaseHead.astro` (removed the `<Font>` preload + unused import) and `global.css` (now `var(--font-dm-sans)`), both with `TODO(stage-04)` notes — grep for `atkinson`/`first-post`/`using-mdx` is now clean.
- Installed `@astrojs/check` + `typescript` (devDeps) to run `astro check`.

**Verify:**
- `npx astro check` → **0 errors, 0 warnings, 0 hints** (15 files).
- `npm run build` → **succeeds**, 3 pages + sitemap, fonts copied (12 files). The "collection blog is empty" log is expected/harmless until Stage 10 seeds content.
- `grep -ri "atkinson\|first-post\|using-mdx" src/ astro.config.mjs` → no matches.

**Files touched:** `astro.config.mjs`, `.nvmrc` (new), `src/consts.ts`, `public/_headers` (new), `src/components/BaseHead.astro`, `src/styles/global.css`, deleted `src/content/blog/*` + `src/assets/fonts/atkinson-*.woff`, `package.json`/lockfile (check deps). Plan/status: `plans/00-index.md`, `plans/stage-01-foundation-config.md`.

**Next:** Stage 02 — Design tokens (light), per `plans/stage-02-design-tokens-light.md` (values from `DESIGN-minimax.md`).

---

## 2026-06-27 — astro.config patched; P0 build plan decomposed into stage docs

**Did:**
- Patched `astro.config.mjs` to the locked decisions: `site: 'https://danielkimdev.com'`, Astro i18n (`defaultLocale: 'en'`, `locales: ['en','ko']`, `prefixDefaultLocale: false`), `@astrojs/sitemap` i18n config for hreflang, and the locked font stack — DM Sans/Outfit/Poppins/Roboto via `fontProviders.google()` and Pretendard via `fontProviders.fontsource()` (Noto Sans KR fallback), each exposed as a `--font-*` CSS variable. Replaced the scaffold's local Atkinson setup.
- Verified config syntax + field names against the Astro 7 font/i18n schema. Could not run a full `astro build` (sandbox is linux-arm64; repo `node_modules` are macOS — rolldown native binary mismatch). Builds fine locally.
- Reviewed `dev-references/astro-site-prd.md` and decomposed **P0** into **21 session-sized (~20–30 min) stage docs** + a master index in `dev-references/plans/` (`00-index.md` + `stage-01`…`stage-21`). Each stage has goal, depends-on, PRD/DESIGN refs, task checkboxes, files-to-touch, acceptance criteria, verify step, handoff note. Index has dependency table, critical path, P1/P2 backlog, and a per-stage status column.

**Decisions (locked/confirmed):**
- Content-collection locale strategy (recommended in plan): folder-by-locale (`blog/en`, `blog/ko`, …) **plus** a `lang` field.
- Primary dev tool going forward: **Claude Code** (local toolchain) — Cowork can edit but not build/run this repo.
- Plan scope is **P0 only** for now; P1/P2 to be decomposed after v1 ships.

**Files touched:** `astro.config.mjs`, `dev-references/plans/` (new: `00-index.md` + 21 stage docs), `HANDOFF.md`, `WORKLOG.md`.

**Next:** Finish Stage 01's remaining items (`output: 'static'`, `.nvmrc`, `consts.ts`, `public/_headers`, remove starter posts/fonts), then Stage 02 (light design tokens). Outstanding `TODO(daniel)`: social URLs, headshot, seed-post selection, native KO copy.

## 2026-06-26 — Project setup: PRD finalized, handoff docs created

**Did:**
- Added a "Project" overview section to `AGENTS.md` pointing future sessions to the PRD (`dev-references/astro-site-prd.md`).
- Wired `dev-references/DESIGN-minimax.md` into the PRD as the visual design source of truth (PRD §8): set precedence rules, mapped color/typography/radius/shadow tokens, resolved the accent-color question to MiniMax brand blue, and updated fonts (§7.6) to DM Sans / Outfit / Poppins / Roboto + Pretendard for Korean.
- Folded Daniel's open-question answers into the PRD and resolved §15 items.

**Decisions (locked):**
- Domain `danielkimdev.com` (Cloudflare Registrar); deploy via Cloudflare Pages (`wrangler` configured).
- i18n: `defaultLocale: "en"`, `prefixDefaultLocale: false` — English at root, Korean under `/ko/`. Updated IA (§5), routing (§7.1), hreflang (§7.5) accordingly.
- Dark mode derived from MiniMax light palette; tokens kept centralized/swappable (Daniel may redesign later).
- Analytics: Cloudflare Web Analytics. Portfolio detail: inline expandable cards (v1). Social: LinkedIn, X, GitHub.

**Files touched:** `AGENTS.md`, `dev-references/astro-site-prd.md`, `HANDOFF.md` (new), `WORKLOG.md` (new).

**Next:** Awaiting go-ahead to start Phase 1 (tokens + layout shell + i18n routing + nav/toggles) vs. scaffolding the full skeleton first. Outstanding `TODO(daniel)`: social URLs, headshot, seed-post selection.
