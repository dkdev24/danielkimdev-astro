# Publishing a wiki-project post to this site

**Audience:** whoever (or whatever) turns a "ready to publish" draft from the LLM-wiki project
into a live post here — Daniel, or a future Claude Code session in this repo.

**Scope:** purely mechanical. Voice/content review already happened upstream in the wiki
project (`daniel-writing-style` + `draft-review-kit`); by the time a draft lands in this repo's
`content-materials/` folder it is content-final. **Do not re-run `daniel-writing-style` in this
project** — the job here is schema conversion and formatting, not another editing pass.

For the broader cross-project relationship (repo boundary, when a shared/parent-folder session is
worth it, context-usage guardrails) see [`AGENTS-ROOT.md`](AGENTS-ROOT.md) — that's policy, this
doc is the actual publishing steps.

## Source format (wiki project export)

Drafts arrive as a pair of files in `content-materials/`, e.g.
`<slug>-en.md` / `<slug>-ko.md`, each with YAML frontmatter:

```yaml
title: "..."
slug: building-llm-pkm-in-public-ep1
lang: en # or ko
translation_of: building-llm-pkm-in-public-ep1-ko # the other file's slug
platform: danielkimdev.com
domain: [pkm, ai-llm]
series: Building LLM-PKM in Public # freeform display name, English
episode: 1
status: ready # or draft / under-review — only `ready` gets published
created: 2026-04-20
published: "" # empty until it actually goes live
published_url: ""
```

(An older export format exists too — a plain `# Title` + a `> **Series:** / **Published:** /
**Status:**` metadata block instead of YAML frontmatter, e.g.
`content-materials/2026-06-0{1,2}-*-agent-readiness.en.md`. That's a pre-YAML draft from before
the wiki project's export format settled; if you ever encounter that shape again, do the same
field mapping by hand — there's no `domain`/`series-slug`/`translation_of` to read mechanically,
so it needs a judgment pass, not this checklist.)

## Target format (this site's blog schema)

`src/content.config.ts`'s blog collection (see it for the authoritative shape):

```ts
title: string
description: string        // SEO + excerpt — see "Field mapping" below, this is NOT in the wiki export
pubDate: date
lang: 'en' | 'ko'
tags: BlogTag[]             // enum — see "Tag mapping"
draft: boolean
translationKey: string      // optional; shared by the EN/KO pair
series: SeriesSlug          // optional — see "Series mapping"
```

Files live at `src/content/blog/{en,ko}/<slug>.md` — same filename in both locale folders.

## Field mapping

| Wiki field | Site field | Rule |
|---|---|---|
| `title` | `title` | Copy verbatim. Don't "fix" style/punctuation — it already passed review upstream. |
| `slug` | filename | `src/content/blog/{en,ko}/<slug>.md`. Same slug both locales. |
| `lang` | `lang` | Copy verbatim (`en`/`ko`). |
| `translation_of` | `translationKey` | Use the slug **without** a trailing `-en`/`-ko` (e.g. both files get `translationKey: building-llm-pkm-in-public-ep1`, not `...-ep1-ko`). |
| `platform` | — | Drop. Not part of this schema. |
| `domain` | `tags` | See "Tag mapping" below — not a 1:1 free copy. |
| `series` | `series` | Freeform display name → registry **slug**. See "Series mapping" below. |
| `episode` | — | Not stored as a field. Sanity-check it matches chronological order (episode order = `pubDate` order, enforced by `utils/blog.ts`), but don't add an `episode` field to the schema for it. |
| `status` | `draft` | `status: ready` → `draft: false`. Anything else → don't publish yet (leave the file out of `src/content/`, or set `draft: true` if you want it visible only in `astro dev`). |
| `created` | — | Drop. That's the wiki project's authoring date, not this site's. |
| `published` | `pubDate` | If empty (it will be, pre-publish), use **today's actual publish date** — not `created`. `pubDate` drives sort order and the "Published on" display. |
| `published_url` | — | Drop. The site derives its own URL from the slug. |
| *(none)* | `description` | **Missing from the wiki export today.** See "The one gap" below. |

## Tag mapping

`domain` values must land on valid `BLOG_TAGS` (`src/content.config.ts`) — an off-enum tag fails
the build:

```
ai-knowledge-mgmt, automation, ai-ready-docs, ai-llm, pkm, solopreneur
```

If a wiki `domain` value already matches one of these, copy it straight across (this has been
true for both series published so far — `pkm`/`ai-llm` and `ai-ready-docs`/`ai-llm`). If a future
domain doesn't map cleanly, pick the closest existing tag rather than inventing a new one on the
spot — adding a genuinely new tag is a schema decision (edit the `BLOG_TAGS` array), not a
per-post workaround.

## Series mapping

The wiki's `series:` field is a freeform display string; the site needs a **slug** registered in
`src/data/series.ts` (`SERIES_SLUGS` feeds the schema enum, same off-enum-fails-build guarantee as
tags).

1. Check `src/data/series.ts` for an existing entry whose English title matches the wiki's
   `series:` string.
2. **Existing series:** use its slug for this post's `series:` field. Done — series metadata
   (title/description) is per-series, not per-post, so nothing else to add.
3. **New series:** add an entry to the `SERIES` record — kebab-case slug derived from the English
   name (e.g. "Building LLM-PKM in Public" → `building-llm-pkm-in-public`), plus `title.en`/
   `title.ko` and a one-to-two-sentence `description.en`/`description.ko` (shown on the series hub
   page). The wiki export only gives you the English name — write the Korean title/description
   yourself, matching the tone of the existing entries in that file.

## Content-body cleanup

The wiki export includes structural scaffolding this site's layout already provides — strip it,
keep everything else (headings, bullets, blockquotes, bold, links, body prose) exactly as
authored:

- **Remove** the leading `# Title` line — the site renders the title from frontmatter
  (`BlogPost.astro` already outputs `<h1>{title}</h1>`).
- **Remove** the italic episode byline (e.g. `*Series Name — Episode N*`) — redundant with the
  site's auto-rendered "Part N of {total} · {series}" badge (Stage 30).
- **Remove** `---` horizontal-rule dividers used as section separators — this site's posts (see
  `agent-readiness.md`) rely on `##` headings alone for structure, no dividers.
- **Remove** a trailing italic "next episode" teaser line if it just repeats content already
  covered in a "What's coming" section in the body — keep the section, drop the redundant
  one-liner.
- **Do not** rewrite, retitle, or otherwise "improve" the remaining prose. It already passed the
  wiki project's own review.

## The one gap: `description`

The site schema requires `description` (SEO meta + excerpt fallback) and the wiki export doesn't
produce one. Until the wiki project's template is updated to emit it:

- **Preferred fix (do this in the wiki project, not here):** add a `description` field to the
  wiki's export template/`draft-review-kit` output — a 1–2 sentence EN/KO excerpt, written with
  the same voice pass the rest of the draft already gets. Once that ships, this becomes a
  straight copy like every other field and closes this gap for good.
- **Until then:** it has to be authored at copy time in this repo, which is the one place this
  checklist can't be fully mechanical yet.

## Verification checklist

After copying the files into `src/content/blog/{en,ko}/`:

1. `npx astro check` — 0 errors (catches off-enum tags/series, missing required fields, bad
   `pubDate` values).
2. `npx astro build` — confirm it completes and the page count grew by the expected amount
   (1 new post × 2 locales, +1 new series hub × 2 locales if it's a new series).
3. Korean file: grep for `—` (em dash) — Korean doesn't use it, and it has slipped through the
   wiki project's own review before (an episode-1 draft had one, since fixed). A stray em-dash is
   the one voice-adjacent thing worth a mechanical check here, since it's a simple grep, not a
   judgment call.
4. If a new series was registered, spot-check `/blog/series/<slug>/` and `/blog/series/` render
   (both locales).

## Delete the source drafts once verified

Once the checklist above passes, **delete both source files from `content-materials/`**
(`<slug>-en.md` / `<slug>-ko.md`). The wiki project is the source of truth for the draft; once
it's copied into `src/content/blog/` and verified, the copy in `content-materials/` has no reason
to exist — git history covers "what did the wiki version look like" if it's ever needed.

This happens **as soon as the post is verified, not gated on deploying the site.**
`npm run deploy` is a separate, later step — the source files should already be gone by the time
that runs.

