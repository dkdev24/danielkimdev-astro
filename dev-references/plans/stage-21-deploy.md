# Stage 21 — Deploy to Cloudflare Pages + README

**Session size:** ~25 min · **Priority:** P0 · **Phase:** 5 Ship
**Depends on:** 19, 20 · **Next:** P1 backlog (see 00-index)
**PRD refs:** §10.2, §14 · **Design refs:** —

## Goal
Ship v1: confirm the static build, finalize deploy config, deploy to Cloudflare Pages, and document the deploy + authoring flow in the README.

## Prerequisites / context
- Domain `danielkimdev.com` (Cloudflare Registrar); target is Cloudflare Pages, configured via `wrangler`. `wrangler.toml` already has `pages_build_output_dir = "./dist"`.

## Tasks
- [x] Confirmed `output: 'static'`, `npm run build` → `dist/` clean, Node pinned (`.nvmrc` 22.12.0 + `engines.node >=22.12.0`).
- [x] Confirmed `public/_headers` ships (security headers + `/_astro/*` immutable caching).
- [ ] **Deploy via Cloudflare Pages** (connect repo → preset "Astro", or `wrangler pages deploy ./dist`); attach the custom domain at root. — **needs Daniel's Cloudflare auth (`wrangler login` / dashboard); not run autonomously.**
- [ ] **Verify production** (both locales, toggles, RSS, sitemap, hreflang, no broken links). — after deploy.
- [x] README rewritten (overview, dev, structure, i18n, Cloudflare Pages deploy note) + **`AUTHORING.md`** created (blog/portfolio/timeline frontmatter templates, tag enums, translationKey pairing, publish steps).
- [x] Build-time success metrics confirmed: all P0 pages build in both locales, `astro check` 0 errors (no missing frontmatter); Lighthouse-vs-prod is the post-deploy step. (CWV measured locally in Stage 20.)

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

**Status (2026-06-28):** everything that doesn't need Cloudflare auth is done — config verified, `README.md` rewritten, `AUTHORING.md` created, build clean. **Remaining (Daniel):** (1) deploy — either connect the repo in the Cloudflare Pages dashboard (framework preset **Astro**, build `npm run build`, output `dist`) so the default branch auto-deploys, or run `npm run build && npx wrangler pages deploy ./dist` after `wrangler login`; (2) attach `danielkimdev.com` at the apex (no base path); (3) verify the production URLs (`/`, `/ko/`, a post, `/rss.xml`, `/sitemap-index.xml`, toggles, hreflang); (4) run Lighthouse against the live URL and record the scores here. Once live, record the URL + scores and start the P1 backlog.
