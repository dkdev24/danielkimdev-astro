# danielkimdev.com

Daniel Kim's personal site & blog — a bilingual (EN/KO) Astro static site and
public digital garden for AI-for-knowledge-work, automation, and media-tech /
OTT / DRM topics.

- **Live:** https://danielkimdev.com
- **Stack:** [Astro](https://astro.build) (static output) · TypeScript · content
  collections (Markdown/MDX + Zod) · self-hosted fonts via `astro:assets` ·
  Shiki code highlighting · deployed to **Cloudflare Pages**.
- **Full brief:** [`dev-references/astro-site-prd.md`](dev-references/astro-site-prd.md)
  (goals, IA, i18n model, design system, schemas). Design tokens:
  [`dev-references/DESIGN-minimax.md`](dev-references/DESIGN-minimax.md).

## Develop

Requires Node `>=22.12.0` (see [`.nvmrc`](.nvmrc)).

```sh
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # static build → ./dist
npm run preview    # serve the production build locally
npx astro check    # type-check + content schema validation
```

## Project structure

```
src/
  components/   UI + page components (Header, Footer, Card, Tag, TOC, …;
                shared page bodies HomePage/AboutPage/PortfolioPage/BlogIndexPage)
  layouts/      BaseLayout (canonical shell), BlogPost (post layout)
  pages/        routes — EN at root, KO under /ko/ (+ rss.xml, ko/rss.xml)
  content/      blog/{en,ko}, portfolio/{en,ko}, timeline/ (content collections)
  data/         non-collection content (home hero, about bio/skills)
  i18n/         dictionaries (en.json/ko.json) + utils (t(), localized paths)
  styles/       tokens.css (design tokens, light + dark) + global.css
  utils/        blog routing, reading time, SEO/JSON-LD, RSS
public/         static assets (_headers, favicon, og-default.png, /images)
```

## Internationalization

English is the default locale served at the **root** (no `/en/` prefix); Korean
is served under **`/ko/`**. Every page exists in both locales. UI strings live in
`src/i18n/{en,ko}.json` (key parity is compile-enforced); content strings live in
the collections / `src/data`. See the PRD §7 for the full model.

## Deploy (Cloudflare Pages)

The site is a static build deployed to **Cloudflare Pages** at the apex domain
`danielkimdev.com` (Cloudflare Registrar), no base path.

- **Git integration (recommended):** connect the repo in the Cloudflare dashboard,
  framework preset **Astro** — build command `npm run build`, output dir `dist`.
  Pushes to the default branch deploy automatically.
- **Direct (manual):** `npm run build && npx wrangler pages deploy ./dist`
  (requires `wrangler login`).

Config lives in [`wrangler.toml`](wrangler.toml) (`pages_build_output_dir = "./dist"`).
Security headers + long-cache for hashed assets are in
[`public/_headers`](public/_headers).

## Authoring

See **[`AUTHORING.md`](AUTHORING.md)** for how to add a blog post, portfolio item,
or timeline entry (frontmatter templates + the EN/KO translation-pairing convention).

## Session continuity

[`HANDOFF.md`](HANDOFF.md) holds the current state and next steps;
[`WORKLOG.md`](WORKLOG.md) is the append-only history. The build was executed in
the staged plan under [`dev-references/plans/`](dev-references/plans/).
