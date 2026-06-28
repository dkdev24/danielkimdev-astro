# Authoring guide

How to add content to the site. All content lives in `src/content/` as Markdown /
MDX / data files validated against Zod schemas in
[`src/content.config.ts`](src/content.config.ts) — a missing or mistyped field
fails `npm run build` (and `npx astro check`), so the build can't ship broken
frontmatter.

## Conventions

- **Locale by folder + field.** Files go in a per-locale folder (`blog/en/`,
  `blog/ko/`, `portfolio/en/`, `portfolio/ko/`) **and** carry an explicit
  `lang: en | ko`. Keep them consistent.
- **Slug = filename.** `blog/en/my-post.md` → `/blog/my-post/`; the KO version
  `blog/ko/my-post.md` → `/ko/blog/my-post/`.
- **Pair translations with `translationKey`.** Give the EN and KO versions of the
  same piece the **same** `translationKey`. That powers the "Read in 한국어 /
  English" cross-link and the hreflang alternates. A post with no counterpart
  simply omits it (it then shows no cross-language link — that's fine).
- **A post can exist in one locale only.** It appears in that locale's blog index
  and feed, and is absent from the other — no empty placeholder needed.
- **Drafts:** `draft: true` hides a post from production builds but keeps it
  visible in `npm run dev`.
- **Tags are enums.** Use only the keys defined in `src/content.config.ts`
  (below) and add a matching label in `src/i18n/{en,ko}.json` under `tags.*` if
  it's new. Blog tags lead on AI-for-knowledge-work; media-tech tags
  (`drm-content-security`, `ott-streaming`, `cloud-saas`) are **portfolio-only**.

## Blog post

Create `src/content/blog/<lang>/<slug>.md` (or `.mdx` for components):

```markdown
---
title: "Writing Docs Machines Can Actually Use"
description: "One-line SEO description + list/feed excerpt."   # required
pubDate: 2026-06-20                                            # required (YYYY-MM-DD)
updatedDate: 2026-07-01                                        # optional
lang: en                                                       # en | ko (match the folder)
tags: [ai-ready-docs, ai-llm]                                  # from BLOG_TAGS (optional)
draft: false                                                   # optional, default false
translationKey: agent-readiness                                # optional — same on EN & KO twins
heroImage: ./hero.jpg                                          # optional, optimized; relative import
ogImage: /og/agent-readiness.png                              # optional, social-card override (path string)
---

Body in Markdown / MDX. `##`/`###` headings auto-generate a sticky table of
contents; fenced code blocks get a language label + copy button; GFM tables and
footnotes[^1] render. In `.mdx` you can import the `Callout` component.

[^1]: Footnote text.
```

**`BLOG_TAGS`:** `ai-knowledge-mgmt`, `automation`, `ai-ready-docs`, `ai-llm`,
`pkm`, `solopreneur`.

## Portfolio item

Create `src/content/portfolio/<lang>/<slug>.md`:

```markdown
---
title: "Multi-DRM Content Security Platform"
role: "Product Lead"                # required
org: "Acme Streaming"               # optional
period: "2021–2023"                 # required
summary: "One-line card summary."   # required
category: product                   # product | talk-writing | side-ai | career
tags: [drm-content-security, ott-streaming]   # from PORTFOLIO_TAGS (optional)
lang: en
featured: true                      # optional — surfaces on the Home page
order: 1                            # optional — lower sorts first
translationKey: multi-drm           # optional — same on EN & KO twins
links:                              # optional — absolute http(s) URLs
  - label: "Case study"
    url: "https://example.com/case-study"
---

Optional longer description (rendered inside the card's expandable details).
```

**`PORTFOLIO_TAGS`:** all `BLOG_TAGS` **plus** `drm-content-security`,
`ott-streaming`, `cloud-saas`. **`PORTFOLIO_CATEGORIES`:** `product`,
`talk-writing`, `side-ai`, `career`.

## Timeline entry (About page)

Create `src/content/timeline/<lang>-NN-<slug>.json` (a data collection):

```json
{
  "role": "Product Lead",
  "org": "Acme Streaming",
  "start": "2021",
  "end": "2023",
  "summary": "What you did, one or two sentences.",
  "lang": "en",
  "order": 2
}
```

`start`/`end` are free strings (year, `YYYY-MM`, or `"present"`). The About page
renders these in `order` automatically — no markup edits needed.

## New UI string

Add the key to **both** `src/i18n/en.json` and `src/i18n/ko.json` (same path).
Parity is compile-enforced, so a key missing from one locale fails `astro check`.
Reference it in components via `t('group.key')`.

## Publish

```sh
npx astro check       # validate schemas + types
npm run build         # confirm a clean static build
git commit && git push   # Cloudflare Pages auto-deploys the default branch
```
