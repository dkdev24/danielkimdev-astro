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
