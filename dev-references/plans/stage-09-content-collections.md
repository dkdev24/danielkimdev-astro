# Stage 09 — Content collections & schemas

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 2 Content engine
**Depends on:** 01 · **Next:** 10
**PRD refs:** §9.1, §9.2, §9.3 · **Design refs:** —

## Goal
Define the typed content model — blog, portfolio, and timeline collections with Zod schemas — so adding content is "drop a file in" with build-time validation.

## Prerequisites / context
- Current `src/content.config.ts` has only a minimal blog schema. Replace it with the full model.
- Decide one consistent locale strategy: folder-by-locale (`blog/en/`, `blog/ko/`) **and** a `lang` field — pick folder-by-locale + `lang` field for redundancy/clarity.

## Tasks
- [ ] Rewrite `src/content.config.ts` blog schema (§9.1): `title, description, pubDate, updatedDate?, lang, tags[], draft(default false), translationKey?, heroImage?, ogImage?`.
- [ ] Add `portfolio` collection (§9.2): `title, role, org?, period, summary, category(enum), tags[], lang, links[]?, thumbnail?, featured(default false), order?`.
- [ ] Add `timeline` data collection (§9.3): `role, org, start, end, summary, lang`.
- [ ] Constrain `tags` / `category` to the canonical taxonomy (§5): `ott-streaming, drm-content-security, cloud-saas, ai-llm, solopreneur, pkm`; categories `product | talk-writing | side-ai | career`.
- [ ] Create folder structure: `src/content/blog/{en,ko}/`, `src/content/portfolio/{en,ko}/`, `src/content/timeline/`.
- [ ] Add a reading-time utility (compute at build from body) for use by index/post stages.

## Files to create / edit
- `src/content.config.ts` — full rewrite.
- `src/content/{blog,portfolio,timeline}/...` — folders (with `.gitkeep` until Stage 10).
- `src/utils/readingTime.ts` — new (or in i18n utils).

## Acceptance criteria
- `astro check` validates all three collection schemas.
- Invalid frontmatter (e.g., off-taxonomy tag) fails the build with a clear error.
- Reading-time util returns localizable minutes.

## Verify
- Add one throwaway valid + one invalid entry; confirm the invalid one errors, then delete both (real seed in Stage 10).

## Handoff note
Record the locale strategy chosen (folder + `lang` field) and the taxonomy enum location.
