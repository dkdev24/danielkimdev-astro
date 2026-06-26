# HANDOFF

> **Purpose:** the single place a new session reads first to pick up where the last one left off.
> Keep this short and current — it describes the *present* state, not history. Append full
> session history to [`WORKLOG.md`](WORKLOG.md) instead. **Update this file at the end of every session.**

**Last updated:** 2026-06-26
**Last session:** Project setup — PRD finalized against open questions; design system source-of-truth wired in.

---

## Project in one line

Daniel Kim's bilingual (EN/KO) personal site & blog — Astro static site, Cloudflare Pages.
Full build brief: [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md). Read it before substantive work.

## Current state

- **Phase:** Pre-development. PRD is finalized; no site code written yet (still the scaffolded blog template).
- Repo is the scaffolded Astro project. `AGENTS.md` (← `CLAUDE.md` symlink) points to the PRD.
- All architectural open questions resolved (see Decisions). Two non-blocking content/asset items remain.

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

## Next steps (suggested build phasing — PRD §16)

1. **Foundation:** design tokens (light/dark) + layout shell + i18n routing + nav/theme/language toggles.
2. **Content engine:** content collections (blog + portfolio + timeline schemas), one sample post per locale, RSS/sitemap/SEO base.
3. **Pages:** Home → About → Portfolio → Blog index → Blog post.
4. **Polish:** accessibility pass, performance/Lighthouse, OG images, 404.
5. **Ship:** Cloudflare Pages deploy + README notes; then P1 backlog.

> Awaiting Daniel's go-ahead on whether to start Phase 1 or scaffold the full skeleton first.

## Conventions / gotchas

- Dev server runs in background mode: `astro dev --background` (manage with `astro dev stop|status|logs`). See `AGENTS.md`.
- `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`.
- Leave `TODO(daniel):` comments rather than inventing facts when a decision is ambiguous.
