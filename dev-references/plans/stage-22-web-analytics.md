# Stage 22 — Cloudflare Web Analytics (cookieless)

**Session size:** ~15 min · **Priority:** P1 · **Theme:** Measurement
**Depends on:** 21 · **Next:** 23
**PRD refs:** §12 (P1 backlog) · **Design refs:** —

## Goal
Add privacy-friendly, cookieless traffic measurement so Daniel can see pageviews/referrers on the live site — without a cookie banner, third-party tracker weight, or PII.

## Prerequisites / context
- Site is on Cloudflare Pages with a proxied apex (`danielkimdev.com`), so CF Web Analytics is available.
- Two ways to enable: (a) **Automatic Setup** (zero code, edge-injected, works because the apex is proxied), or (b) the **manual JS beacon** snippet with a per-site token. We ship (b) so the integration lives in the repo and is portable to `.pages.dev`/previews — but only one should be active at a time, or pageviews double-count.

## Tasks
- [x] Add `CF_ANALYTICS_TOKEN` to `src/consts.ts` (default `''`, with a `TODO(daniel)` pointing at the dashboard JS snippet and noting the Automatic-Setup alternative).
- [x] Inject the beacon in `BaseHead.astro` via `is:inline` `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'>`, gated on `import.meta.env.PROD && CF_ANALYTICS_TOKEN !== ''` — off in dev/preview, no-op when unset.

## Files to create / edit
- `src/consts.ts` — `CF_ANALYTICS_TOKEN` const + guidance comment.
- `src/components/BaseHead.astro` — import the const, compute `showAnalytics`, render the gated beacon after the JSON-LD block.

## Acceptance criteria
- With an empty token (current state): no beacon request anywhere; `astro check` + `astro build` clean; built HTML contains no `cloudflareinsights` reference.
- After Daniel pastes a token: production HTML includes exactly one beacon `<script>`; dev/preview still emit none.

## Verify
- `astro check` (0 errors) + `astro build`.
- `grep -r cloudflareinsights dist/` → no matches while token is empty (confirms it stays off until configured).

## Handoff note
Stage shipped as a **token-gated no-op**: code is in place but the beacon stays off until Daniel sets `CF_ANALYTICS_TOKEN` (dashboard → Web Analytics → site → JS snippet), or he can instead flip on CF Automatic Setup and leave the token empty. Record which path he picks in HANDOFF when chosen.
