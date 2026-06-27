# Stage 01 — Foundation config & repo hygiene

**Session size:** ~25 min · **Priority:** P0 · **Phase:** 1 Foundation
**Depends on:** — · **Next:** 02
**PRD refs:** §10.1, §10.2 · **Design refs:** —

## Goal
Get the project config production-correct and strip the leftover starter-template cruft so later stages build on a clean base.

## Prerequisites / context
- `astro.config.mjs` was already patched (site, i18n, fonts). This stage verifies it and finishes the rest of the config surface.
- Repo currently still contains the default Astro blog starter (placeholder posts, Atkinson fonts, sample components).

## Tasks
- [ ] Confirm `astro.config.mjs`: `site: 'https://danielkimdev.com'`, i18n (`en` root / `ko`, `prefixDefaultLocale: false`), sitemap i18n, fonts (DM Sans/Outfit/Poppins/Roboto + Pretendard).
- [ ] Add `output: 'static'` explicitly to `astro.config.mjs`.
- [ ] Add `.nvmrc` (Node `22.12.0`) and confirm `package.json` `engines.node` matches.
- [ ] Update `src/consts.ts`: site title, description, author, social URL placeholders (`TODO(daniel):`), default OG image path.
- [ ] Create `public/_headers` with light security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, basic CSP) + long-cache for `/_astro/*` hashed assets.
- [ ] Remove starter placeholder posts (`first-post`, `second-post`, `third-post`, `markdown-style-guide`, `using-mdx`) — real seed content lands in Stage 10.
- [ ] Remove Atkinson `.woff` files in `src/assets/fonts/` (replaced by remote fonts in Stage 04).

## Files to create / edit
- `astro.config.mjs` — add `output: 'static'`.
- `.nvmrc` — new.
- `src/consts.ts` — site metadata + socials.
- `public/_headers` — new.
- `src/content/blog/*` — delete starter posts.
- `src/assets/fonts/atkinson-*.woff` — delete.

## Acceptance criteria
- `astro check` passes with no config errors.
- No references to Atkinson or deleted starter posts remain (grep clean).
- `consts.ts` exports are typed and used nowhere-broken.

## Verify
- `npx astro check` and `npm run build` succeed locally.
- `grep -ri "atkinson\|first-post\|using-mdx" src/ astro.config.mjs` returns nothing.

## Handoff note
Record in HANDOFF that config is finalized and starter cruft removed; note Node version pinned.
