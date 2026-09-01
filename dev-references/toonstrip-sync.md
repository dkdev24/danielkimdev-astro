# Picking up a toonstrip release

This site has no comic-rendering code of its own — it consumes the `<ComicStrip>`
component from `@toonstrip/astro` (npm), which pulls in `@toonstrip/element` and
`@toonstrip/core` transitively. The rendering logic itself lives in two other repos,
`../toonstrip` and `../grues-in-comic`, which sync fixes between each other manually —
see `../toonstrip/UPSTREAM_SYNC.md` for that side of the process. This doc is only the
last leg: what to do here once toonstrip has published a new `@toonstrip/astro` version.

## Checklist

1. Bump the version in `package.json`'s `@toonstrip/astro` entry (or run
   `npm install @toonstrip/astro@<new-version>`, which does both).
2. `npm ls @toonstrip/astro @toonstrip/element @toonstrip/core` — confirm a single clean
   chain (no two versions of the same package resolved).
3. `npm run build` — confirm it's clean.
4. **Verify visually before pushing** — this is a deployed site:
   - `npm run preview -- --port <port>` (or reuse a running one).
   - Open the blog post that actually renders a strip —
     `/blog/grues-in-comic-beta/` is the current one — and screenshot it. Check every
     panel: no balloon overlapping a character's head, no clipped text.
   - `<ComicStrip>` mounts as `client:visible` — in a headless/automated check (not a real
     scrolling user) the element can sit empty, `customElements.get('comic-strip')`
     `undefined`, purely because nothing ever intersected it. Force
     `el.scrollIntoView({block:"center"})` and wait ~1s before screenshotting/asserting, or
     you'll misdiagnose a real deploy as broken (happened during the 0.1.8 verification,
     2026-09-01 — the live site looked blank until scrolled).
5. Commit `package.json` + `package-lock.json`, confirm the push with the user (this repo
   deploys to production on push to `main` — see `HANDOFF.md`'s Locked decisions), then push.
6. **Re-verify on the live domain after pushing**, same scroll-into-view caveat as step 4 —
   deploy is fire-and-forget (no build-status check available here), so this is the only
   confirmation that it actually shipped.
7. Update `HANDOFF.md`'s Current state and `WORKLOG.md`, same as any other change here.

## Precedent

Session of 2026-09-01: two toonstrip releases picked up back to back — `@toonstrip/astro`
`0.1.6 → 0.1.7` (balloon-width overlap fix) then `0.1.7 → 0.1.8` (a `panelSeed` hash-
collision fix, no visible change expected, verified anyway). Both followed this checklist.
See `WORKLOG.md` for that date.
