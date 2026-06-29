# Stage 29 — Authoring docs + content-lint CI

**Session size:** ~25–30 min · **Priority:** P1 · **Theme:** DX
**Depends on:** 09 (content schemas), 10 (content authoring) · **Next:** — (last numbered stage)
**PRD refs:** §9 (content model), §13 (conventions) · **Design refs:** —

## Goal
Lower the barrier to adding content and guard the easy-to-regress invariants in CI: a short
authoring guide for both collections, plus a content-lint that fails on the drift Zod can't
catch. Closes the numbered P0+P1 plan.

## Prerequisites / context
- The Zod schemas in `content/config.ts` already enforce **required frontmatter + tag enums**
  at build (`astro check`), and HANDOFF notes **i18n EN/KO key parity is compile-enforced**.
  So content-lint should target what those *don't* cover — don't re-implement them.
- **Gaps worth linting:** (1) blog `translationKey` pairs cleanly (≤1 per locale, both sides
  present); (2) portfolio EN/KO **slug pairing** (shared-filename model from Stage 27);
  (3) belt-and-suspenders off-enum tag check with a friendly message; (4) required frontmatter
  presence with a human-readable error; (5) optional image-alt / draft hygiene.
- Repo currently has **no `.github/workflows/`** and one script (`scripts/predeploy-guard.sh`).
  Deploy is manual (`npm run deploy`) — CI here is **gate-only** (check/lint/build/test), not
  auto-deploy (Direct-upload Pages project, locked decision).
- **TODO(daniel): confirm CI scope** — minimal (`astro check` + content-lint + `astro build`)
  vs. also running `npm run test:e2e` (slower, needs a browser in CI).

## Tasks
- [ ] `dev-references/authoring.md`: step-by-step "add a blog post" and "add a portfolio item" —
      frontmatter reference per collection, locale pairing rules (blog `translationKey`;
      portfolio **shared slug**), tag enums, draft workflow, image guidance, and a pointer to
      the `daniel-writing-style` skill for KO/EN voice.
- [ ] `scripts/content-lint.mjs`: load the markdown frontmatter and assert the gaps above;
      exit non-zero with a clear per-file message on violation.
- [ ] `package.json`: add `lint:content` script (optionally a `prebuild` hook).
- [ ] `.github/workflows/ci.yml`: on push/PR — install, `astro check`, `npm run lint:content`,
      `astro build` (+ `test:e2e` if Daniel opts in). **No deploy step.**

## Files to create / edit
- New: `dev-references/authoring.md`, `scripts/content-lint.mjs`, `.github/workflows/ci.yml`.
- Edit: `package.json` (script).

## Acceptance criteria
- Authoring doc covers both collections and the locale-pairing rules end to end.
- `npm run lint:content` passes on the clean tree and **fails** on a deliberate violation
  (unpaired `translationKey`, missing portfolio counterpart, off-enum tag).
- CI workflow runs the gates on push/PR and is green on a clean branch; `astro check` stays clean.

## Verify
- Run `npm run lint:content` clean (pass) → introduce a temp violation (fail) → revert.
- Push a throwaway branch and confirm the Actions run goes green.

## Handoff note
**This is the last numbered stage.** With 27–29 done, the P0+P1 plan is complete; what remains
is the **undecomposed P2 backlog** (PRD §12 — newsletter capture, series/collections, related
posts, reading progress, webmentions, optional hybrid/SSR, PKM→site automation). If Daniel
wants to continue, the next planning step is decomposing P2 into stages 30+.
