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

**Status (2026-06-28):** **DEPLOYED.** Site live at `https://danielkimdev.pages.dev` (direct upload via `wrangler pages deploy ./dist --project-name danielkimdev --branch main`; 33 files, `_headers` applied). A `deploy` script (`astro build && wrangler pages deploy …`) was added to `package.json` for one-command redeploys. All production URLs verified 200 in both locales (see Tasks). Note: the project is **direct-upload** (no Git integration) — redeploy with `npm run deploy`.

## Post-deploy Lighthouse (2026-06-29, live `danielkimdev.com`)

Hosted Lighthouse (PSI) anonymous quota was exhausted (429), so these are **local Lighthouse 12** runs (Chrome, mobile preset, simulated throttling) against production. Perf is indicative (runner-dependent); A11y/BP/SEO are deterministic.

| Page | Perf | A11y | Best-Pr | SEO | LCP | CLS |
|------|:----:|:----:|:-------:|:---:|----:|----:|
| `/` (home EN) | 97 | 100 | 93 | 100 | 2.2 s | 0 |
| `/ko/` (home KO) | 100 | 100 | 93 | 100 | 1.7 s | 0 |
| `/portfolio/` | 100 | 100 | 93 | 100 | 1.6 s | 0 |
| `/portfolio/whatifclassics/` (Stage 27) | 99 | 100 | 93 | 100 | 1.9 s | 0 |
| `/blog/agent-readiness/` | 99 | 100 | 93 | 100 | 1.6 s | 0 |

TBT 0 ms everywhere; FCP ~1.7 s. **Excellent across the board** — meets the PRD perf targets.

### ⚠️ Finding: production CSP is blocking inline scripts + the analytics beacon
The only thing docking **Best Practices (93)** is `errors-in-console` + `inspector-issues`, both caused by the `Content-Security-Policy` in `public/_headers` (`script-src 'self'`, a Stage-01 baseline whose own comment said to revisit it "once analytics origins are final" — never done). It is **enforced in prod** and blocks:
1. **The no-flash inline theme script** (`ThemeScript.astro`, `is:inline`) → defeats Stage-03 no-flash dark mode (FOUC on first paint).
2. **The Cloudflare Web Analytics beacon** (`static.cloudflareinsights.com/beacon.min.js`) → **analytics has been collecting nothing** despite HANDOFF marking it live.

**Fix:** loosen `script-src` to permit the inline bootstrap + the CF beacon origin, and allow the beacon's report endpoint in `connect-src`, e.g.:
`script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com;`
(Or replace `'unsafe-inline'` with the per-script sha256 hashes for a tighter policy — but Astro's inline bootstrap hash can change across builds, so for a no-auth static site `'unsafe-inline'` is the pragmatic call.) Redeploy, then re-run to confirm BP → 100 and the beacon loads.
