## Project

Daniel Kim's personal site and blog — an Astro static site, bilingual (EN/KO), serving as a personal-brand hub and public digital garden for media-tech / OTT / DRM / AI topics.

The full build brief lives in [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md). **Read it before doing substantive work** — it covers goals, information architecture, i18n model, design system, content schemas (Astro content collections + Zod), tech stack, and priority tags (P0 → P1 → P2). When a decision is ambiguous, prefer the simplest Astro-native approach and leave a `TODO(daniel):` comment rather than inventing facts.

## Session continuity

At the **start** of a session, read [`HANDOFF.md`](HANDOFF.md) — it holds the current state, locked decisions, and next steps. At the **end** of a session, update `HANDOFF.md` to reflect the new present state and append a dated entry to [`WORKLOG.md`](WORKLOG.md) (append-only history, newest on top).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
