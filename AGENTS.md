## Project

Daniel Kim's personal site and blog — an Astro static site, bilingual (EN/KO), serving as a personal-brand hub and public digital garden for media-tech / OTT / DRM / AI topics.

The full build brief lives in [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md). **Read it before doing substantive work** — it covers goals, information architecture, i18n model, design system, content schemas (Astro content collections + Zod), tech stack, and priority tags (P0 → P1 → P2). When a decision is ambiguous, prefer the simplest Astro-native approach and leave a `TODO(daniel):` comment rather than inventing facts.

Blog post drafts are voice/content-final before they ever reach this repo — Daniel drafts them in a separate LLM-wiki project (through `daniel-writing-style` + a `draft-review-kit`). As of 2026-08-21, publishing runs **from that wiki project's own session**, writing directly into this repo's `src/content/blog/{en,ko}/` — no separate session started here, no `content-materials/` staging folder. (Older WORKLOG entries describe the retired `content-materials/` flow; historical, not current process.) **Do not run `daniel-writing-style` in this project for first-draft authoring** — turning a wiki-project draft into a live post here is a mechanical schema/format conversion, not an editing pass. Follow [`dev-references/wiki-to-site-publishing.md`](dev-references/wiki-to-site-publishing.md) for the field-by-field mapping, tag/series rules, and cleanup checklist. **Exception:** a retroactive audit of already-published posts against a *changed* skill version, run only when Daniel explicitly asks — the wiki project has no way to re-verify content it no longer holds as a draft. See WORKLOG 2026-08-20 for the precedent.

## Session continuity

At the **start** of a session, read [`HANDOFF.md`](HANDOFF.md) — it holds the current state, locked decisions, and next steps. At the **end** of a session, update `HANDOFF.md` to reflect the new present state and append a dated entry to [`WORKLOG.md`](WORKLOG.md) (append-only history, newest on top).

**HANDOFF.md: max 50 lines.** It is a *snapshot of the present*, not a log. When updating it:

- **Edit in place; replace, don't append.** Never stack `Last session` / `Prior session` / `Earlier this session` narratives — that history goes in `WORKLOG.md` only.
- **Prune as you add.** Drop anything now done, historical, or superseded; per-stage implementation write-ups belong in `WORKLOG.md`, with HANDOFF linking to it.
- **Keep the fixed sections** (Status · Project · Current state + Invariants · Locked decisions · Next steps · Open · Conventions) — add facts within them, don't grow new narrative sections.
- Before saving, check the line count. Anything pushing it over 50 lines gets moved into a new `WORKLOG.md` entry instead of staying in the snapshot.

**AGENTS.md: max 80 lines.** Keep only what's needed at session start — project orientation, HANDOFF/WORKLOG rules, core working agreements. Rarely-needed detail belongs in another doc, not inline here.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Testing & browser debugging

The Playwright **MCP server is intentionally removed** — driving a browser live via MCP burns tokens because a full DOM/accessibility snapshot is sent back on every turn. See [`dev-references/web-browswer-test.md`](dev-references/web-browswer-test.md) for the rationale and strategies.

**Rule: never test UIs by agentic browser driving. Write standalone Playwright specs and run them locally.**

- Specs live in `tests/e2e/*.spec.ts`; config is `playwright.config.ts` (chromium, `baseURL` `http://localhost:4321`, auto-starts/reuses `astro dev`).
- Run with `npm run test:e2e` (compact `line` reporter) or `npm run test:e2e:ui` for the interactive runner.
- Only read the spec code and filtered terminal logs — e.g. `npm run test:e2e 2>&1 | grep -A 5 -i error`. Don't pull raw DOM/HTML into context.
- For visual/layout checks, prefer native Computer Use (screenshots) over sifting CSS/HTML; browsers are granted at "read" tier, so use the claude-in-chrome MCP for any clicking/typing.
- Keep assertions generic (status + title + visible heading) for smoke coverage; tighten per-page when testing a specific feature.
- Run `/clear` or `/compact` when switching between unrelated UI tasks so stale browser snapshots aren't resubmitted.

## Tool usage

### Fetching web content
Use the **defuddle CLI** to retrieve content from URLs — it strips navigation, ads, and clutter and returns clean markdown, saving tokens vs. raw HTML.

```bash
defuddle parse <url> --md
```

If not installed: `npm install -g defuddle`

### Converting documents to markdown
Use the **markitdown CLI** to convert PDFs, Word docs, spreadsheets, PowerPoints, images, and other non-text formats to markdown before processing them.

```bash
markitdown <file>
```

If not installed: `pip install markitdown`

### Install missing tools before use
If either CLI is not on `PATH`, install it first (commands above), then proceed. Do not fall back to WebFetch or raw file reads when the appropriate CLI is available.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
