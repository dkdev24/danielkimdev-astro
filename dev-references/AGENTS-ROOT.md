# Root-level instructions (draft — staged here, lives at the parent-workspace level)

> **This file is not active yet.** It's staged in this repo (`dev-references/AGENTS-ROOT.md`) so
> it gets version history and rides along on git syncing this repo already has. Once the shared
> parent folder (containing this repo and the wiki project as siblings) is actually set up, copy
> (or symlink, same-OS devices) this file out to `<parent-folder>/CLAUDE.md` (or `AGENTS.md` —
> naming can change later, that's independent of the content). Until then it's just a draft.
>
> **Sync model:** this repo is the single canonical source. Edit it here, let it ride along on
> normal git push/pull across devices, then manually copy/symlink it out to the parent folder.
> No separate git repo for the parent folder itself.

## The two projects

- **Website** (this repo, `danielkimdev-astro`) — bilingual (EN/KO) Astro static site on
  Cloudflare Pages. Public-facing: personal-brand hub, portfolio, and blog. Own instructions:
  [`AGENTS.md`](../AGENTS.md) (symlinked from `CLAUDE.md`).
- **Wiki** — TODO(daniel): fill in the actual project name/path once the parent folder exists.
  Private LLM-wiki / PKM system (Karpathy-style) where knowledge and post ideas actually grow —
  raw sources get ingested, curated into wiki pages, and drafted into posts there, using
  `daniel-writing-style` + a `draft-review-kit`. TODO(daniel): confirm whether it has its own
  `CLAUDE.md`/`AGENTS.md` and link it here once known.

## How they work together

The wiki is upstream and produces **voice/content-final** drafts. The website is downstream and
does a **mechanical** schema conversion, nothing more:

1. Draft gets written and reviewed in the wiki project (voice pass + review already done there).
2. Wiki exports the "ready to publish" draft as an EN/KO pair into this repo's
   `content-materials/` (gitignored, disposable).
3. This repo converts it into the actual blog post — field mapping, tag/series rules, and the
   full checklist live in
   [`dev-references/wiki-to-site-publishing.md`](wiki-to-site-publishing.md). **Read that doc
   before publishing anything, not this one** — this file is cross-project policy, not the
   publishing steps.
4. Once verified, the `content-materials/` source pair is deleted. The wiki project remains the
   source of truth for what the draft looked like.

## Locked decisions (do not re-litigate without Daniel)

- **Repos stay separate.** No monorepo merge — the wiki is a private knowledge base, the website
  deploys publicly; merging git histories risks that boundary and blends two unrelated toolchains
  for no real benefit over the alternative below.
- **Lean pipeline is the default**, not a permanently-open cross-project session. Work each
  project in its own scoped session/cwd normally.
- **The shared parent-folder session is opt-in**, used only when a task genuinely needs
  cross-project reasoning (e.g. "does related wiki content already exist for this post idea").
  Even then, prefer a forked/sub-agent for the exploratory reads (grepping wiki notes, etc.) so
  that raw exploration doesn't land in the main thread's context — Daniel is on a Claude Pro plan
  and is deliberately protecting session/weekly usage against unnecessary context growth.
- **`daniel-writing-style` runs in the wiki project only.** Never re-invoke it in the website
  project — voice/content review already happened upstream; re-running it here risks "improving"
  text that already passed review. (Also stated in `website/AGENTS.md`.)

## Skill/config scoping notes (from Claude Code docs, verified 2026-07-01)

- `CLAUDE.md`/`AGENTS.md` files in each subproject load on-demand once Claude reads/edits a file
  in that subdirectory — not all loaded upfront just because cwd is the shared parent.
- Project-scoped skills work the same way: each project's own `.claude/skills/` surface once
  Claude touches files there. If both projects happen to have a same-named skill, they stay
  distinguishable as `website:<skill>` / `wiki:<skill>` (directory-qualified) — no collision.
- Permission settings (`.claude/settings.json`) and git behavior across sibling repos from a
  non-repo parent folder are **not clearly documented** — treat as untested until tried.

## Open TODOs

- TODO(daniel): actual parent-folder path/name, and the wiki project's path/name inside it.
- TODO(daniel): confirm the wiki project's own CLAUDE.md/AGENTS.md exists and link it above.
- TODO(daniel): decide the final filename (`CLAUDE.md` vs `AGENTS.md`) once the parent folder is
  actually set up — content here doesn't depend on that choice.
