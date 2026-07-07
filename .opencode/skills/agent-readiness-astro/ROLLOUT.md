# Rollout Instructions: Applying This Skill to a New Site

Read this before implementing `agent-readiness-astro` on a site whose hosting platform
reference (currently `references/cloudflare-pages.md`) is marked as unverified design
rather than proven. Its job is to make sure that when the design turns out to be wrong
in some detail, that failure produces a better skill instead of just a working
workaround on one site.

## 1. De-risk the least-proven assumption before building anything else

Before wiring up `llms.txt`, the `.md` endpoint, or anything else, deploy the smallest
possible version of the negotiation layer — the middleware/routing function plus one or
two `.md` files — and confirm the thing the reference file itself flags as untested:
whether the platform's own URL normalization (trailing-slash redirects, extension
stripping, etc.) preserves the `Accept` header and reaches your negotiation code on
**both** the trailing-slash and non-trailing-slash form of a URL.

```sh
curl -sI -H "Accept: text/markdown" https://<target>/some-page/ | grep -i content-type
curl -sI -H "Accept: text/markdown" https://<target>/some-page | grep -i content-type
```

This is worth doing first, not last, because on the Vercel implementation this exact
class of bug (non-trailing-slash URLs silently ignoring `Accept`) was the *last* thing
found — after everything else was built — and it only surfaced via a scanner's
`--verbose` output, not manual testing. Finding it before investing in the rest avoids
redesigning the negotiation approach after the fact.

## 2. Build in layers, validate each before stacking the next

1. Host-agnostic pieces first (`llms.txt.ts`, the `.md` sibling endpoint, the body-level
   directive, `robots.txt` content signals) — these are proven and platform-independent.
   Curl-verify each one on its own.
2. The negotiation layer last, since it's the platform-specific, unproven part.

Don't wire everything up and then debug in aggregate — if content negotiation and the
`llms.txt` index both seem broken at once, it's harder to tell which assumption failed.

## 3. Keep a diagnostic log as you go

For every point where reality diverges from what the reference file assumed — a
binding behaving differently than documented, `_routes.json` scoping something
unexpectedly, a redirect eating the `Accept` header, anything that took more than one
try — write it down as you hit it: what you expected, what actually happened, and the
exact command/output that showed it. Put this in a scratch file
(`cloudflare-rollout-notes.md` next to your work, not inside this skill folder) as you
go rather than trying to reconstruct it from memory afterward.

This log *is* the feedback that turns "it works now" into a better skill — without it,
the only thing that improves is the one site you're working on.

## 4. Re-scan at checkpoints, not just at the end

Run the same scanner this skill was originally validated against, at each checkpoint
(after host-agnostic pieces land, after negotiation lands):

```sh
npx afdocs check https://<target> --format scorecard --sampling deterministic
npx afdocs check https://<target> --verbose   # on any unexpected failure
```

If a check disagrees with a manual curl test, trust the checker and reproduce its exact
request with `--verbose` before assuming the check is wrong — a byte-identical failure
across re-scans is a deterministic bug, not a flaky cache.

## 5. Feed the results back into this skill

When the rollout is done (or you hit a wall worth recording), come back and update:

- **`references/cloudflare-pages.md`**: flip the "Status: design, not yet
  battle-tested" line once the full flow has been scanner-verified end-to-end on a real
  deployment. If something in the design was wrong, correct it in place rather than
  leaving the old (wrong) version alongside a caveat.
- Add a **"Dead ends" section** to `references/cloudflare-pages.md`, modeled on the one
  in `references/vercel.md` — anything you tried that looked reasonable but didn't
  work, with a one-line reason why, so the next site on this platform doesn't repeat it.
- If the `_middleware.ts` shape, `_routes.json` scoping, or the trailing-slash handling
  needed to change from what's currently written, replace the code sample in
  `references/cloudflare-pages.md` with the version that actually worked.
- If anything in `SKILL.md` itself (the host-agnostic parts) turned out to need
  adjustment for a non-Starlight site, update it there — that file is meant to serve
  every future site, not just this one.

Bring the diagnostic log from step 3 to that conversation rather than just "it works" —
that's what makes the update a real second iteration instead of a guess.
