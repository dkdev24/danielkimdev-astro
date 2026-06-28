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
- [x] **Deploy via Cloudflare Pages** — `wrangler pages deploy ./dist --project-name danielkimdev --branch main` (direct upload to existing `danielkimdev` project; account Knowledgebuilderkim@gmail.com). Live at `https://danielkimdev.pages.dev`. Custom-domain attach deferred (Daniel — `danielkimdev.com` ready but not yet connected).
- [x] **Verify production** — all routes 200 on `danielkimdev.pages.dev`: `/`, `/ko/`, `/blog/`, `/ko/blog/`, both posts in both locales, `/about/`, `/portfolio/`, `/ko/portfolio/`, `/rss.xml`, `/ko/rss.xml`, `/sitemap-index.xml`, `/sitemap-0.xml`. EN/KO titles render correctly. (Sitemap `<loc>`s point at `danielkimdev.com` per configured `site` — correct once the domain is attached.)
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

**Status (2026-06-28):** **DEPLOYED.** Site live at `https://danielkimdev.pages.dev` (direct upload via `wrangler pages deploy ./dist --project-name danielkimdev --branch main`; 33 files, `_headers` applied). A `deploy` script (`astro build && wrangler pages deploy …`) was added to `package.json` for one-command redeploys. All production URLs verified 200 in both locales (see Tasks). **Remaining (Daniel):** (1) attach `danielkimdev.com` at the apex (no base path) when ready — domain is in hand but intentionally deferred; (2) run Lighthouse against the live URL and record the scores here. Then start the P1 backlog. Note: the project is **direct-upload** (no Git integration) — redeploy with `npm run deploy`.
