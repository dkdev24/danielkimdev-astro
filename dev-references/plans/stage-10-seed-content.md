# Stage 10 — Seed content (EN/KO posts, portfolio, timeline)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 2 Content engine
**Depends on:** 09 · **Next:** 13, 14, 15, 16
**PRD refs:** §13 (seed content), §9, §6.2 · **Design refs:** —

## Goal
Populate the collections with real seed entries so pages have something to render and the "drop a file in" workflow is proven end-to-end.

## Prerequisites / context
- Seed drafts live in PRD §13. Korean must be authored natively (Daniel's writing-style voice), **not** translated — leave `TODO(daniel):` where native KO copy is needed.

## Tasks
- [ ] About prose: place EN draft (§13.1) into the About content/data source; add KO `TODO(daniel):` stub (§13.2) — native voice, no MT.
- [ ] Positioning one-liners (§13.3) into `consts.ts` or a home-content data file (EN ready; KO `TODO(daniel):`).
- [ ] Portfolio entries (§13.4): one file each — Multi-DRM (product), Watermarking/Anti-Piracy (product), Talks/DevRel (talk-writing), this digital-garden/AI experiments (side-ai), Career timeline (career). Fill known fields; `TODO(daniel):` for metrics/specifics. Mark 3 as `featured: true` for Home.
- [ ] Timeline entries: map the 11+yr dev → PO/PM/DevRel arc into `timeline/` data (`TODO(daniel):` exact dates/orgs).
- [ ] One sample blog post per locale (`blog/en/`, `blog/ko/`) with full valid frontmatter to exercise the schema and post layout; one demonstrates `translationKey` linkage.
- [ ] Ensure at least one post per locale is non-draft so indexes aren't empty.

## Files to create / edit
- `src/content/portfolio/{en,ko}/*.md` — seed entries.
- `src/content/timeline/*` — timeline data.
- `src/content/blog/{en,ko}/*.md(x)` — one sample post each.
- About/home content source — bio + one-liners.

## Acceptance criteria
- Build validates all seed entries against Stage 09 schemas.
- 3 featured portfolio items exist; ≥1 non-draft post per locale; one EN/KO pair shares a `translationKey`.
- Every invented-fact gap is a `TODO(daniel):`, not fabricated.

## Verify
- `npm run build` succeeds; `astro check` clean.
- Grep for `TODO(daniel)` to confirm gaps are flagged, not guessed.

## Handoff note
List which `TODO(daniel):` content gaps remain (metrics, KO native copy, dates, social URLs) so Daniel can fill them.
