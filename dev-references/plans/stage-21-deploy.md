# Stage 21 — Deploy to Cloudflare Pages + README

**Session size:** ~25 min · **Priority:** P0 · **Phase:** 5 Ship
**Depends on:** 19, 20 · **Next:** P1 backlog (see 00-index)
**PRD refs:** §10.2, §14 · **Design refs:** —

## Goal
Ship v1: confirm the static build, finalize deploy config, deploy to Cloudflare Pages, and document the deploy + authoring flow in the README.

## Prerequisites / context
- Domain `danielkimdev.com` (Cloudflare Registrar); target is Cloudflare Pages, configured via `wrangler`. `wrangler.toml` already has `pages_build_output_dir = "./dist"`.

## Tasks
- [ ] Confirm `output: 'static'`, build `npm run build` → `dist/`, Node version pinned (`.nvmrc`/engines).
- [ ] Confirm `public/_headers` ships (security headers + asset caching).
- [ ] Deploy via Cloudflare Pages (connect repo → framework preset "Astro", or `wrangler pages deploy ./dist`); attach the custom domain at root (no base path).
- [ ] Verify production: both locales, language/theme toggles, RSS, sitemap, hreflang, no broken links.
- [ ] README: one-line deploy note (repo → Cloudflare Pages → preset "Astro") + `AUTHORING.md` snippet (how to add a post / portfolio item with frontmatter template).
- [ ] Confirm leading success metrics (PRD §14): all P0 pages live in both locales, Lighthouse targets met, zero broken links / missing frontmatter at build.

## Files to create / edit
- `README.md` — deploy note.
- `AUTHORING.md` — frontmatter templates + publish steps.
- `wrangler.toml` / Pages settings as needed.

## Acceptance criteria
- Production site live at the custom domain, both locales correct.
- Build is clean (no broken links / missing frontmatter); Lighthouse targets hold in prod.
- README/AUTHORING document deploy + publishing.

## Verify
- Hit production URLs for `/`, `/ko/`, a post, `/rss.xml`, `/sitemap-index.xml`.
- Re-run Lighthouse against production.

## Handoff note
**P0 / v1 shipped.** Record the live URL and Lighthouse scores; then run the index's P1 decomposition for `stage-22+`.
