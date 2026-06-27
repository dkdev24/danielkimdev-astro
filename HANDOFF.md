# HANDOFF

> **Purpose:** the single place a new session reads first to pick up where the last one left off.
> Keep this short and current — it describes the *present* state, not history. Append full
> session history to [`WORKLOG.md`](WORKLOG.md) instead. **Update this file at the end of every session.**

**Last updated:** 2026-06-27
**Last session:** Completed **Stage 01** (foundation config & repo hygiene): added `output: 'static'`, `.nvmrc` (Node 22.12.0), populated `src/consts.ts`, added `public/_headers`, removed starter posts + Atkinson fonts. Verified with `astro check` (0 errors) and `npm run build` (succeeds locally).

---

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site, Cloudflare Pages.
Full build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md). Read it before substantive work.

## Current state

- **Phase:** Early development (Phase 1; **Stage 01 done**, Stage 02 next). PRD finalized; build is broken into executable stages.
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
- **Social links:** LinkedIn, X (Twitter), GitHub — URLs still TODO.

## Open / blocked items

- `TODO(daniel)`: social profile URLs (LinkedIn / X / GitHub).
- `TODO(daniel)`: headshot at `/public/images/daniel.jpg` (About has a graceful fallback — not blocking).
- `TODO(daniel)`: which PKM pieces seed the first 3–5 posts per locale (can scaffold with placeholder samples).

## Next steps

1. Open [`dev-references/plans/00-index.md`](dev-references/plans/00-index.md) and work stages in numeric order, one per session.
2. **Resume point:** **Stage 02 — Design tokens (light)** ([`plans/stage-02-design-tokens-light.md`](dev-references/plans/stage-02-design-tokens-light.md)). Values come from [`dev-references/DESIGN-minimax.md`](dev-references/DESIGN-minimax.md).
3. Update the status column in `00-index.md` and each stage's task checkboxes as you go; refresh this file + `WORKLOG.md` at each session end.

## Conventions / gotchas

- Dev server runs in background mode: `astro dev --background` (manage with `astro dev stop|status|logs`). See `AGENTS.md`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` comments rather than inventing facts when a decision is ambiguous.
