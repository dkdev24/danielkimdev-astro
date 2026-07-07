---
name: agent-readiness-astro
version: 0.2.0
description: Make an Astro-based static site (with or without Starlight) discoverable and cleanly parseable by AI coding agents and LLM crawlers — llms.txt index, per-page markdown siblings, HTTP content negotiation on Accept:text/markdown, robots.txt content signals, and structural Link headers. Use this whenever the user mentions agent-readiness or AI-readiness, "making docs agent-friendly / LLM-friendly", llms.txt, AFDocs or isitagentready.com scores/scans, markdown content negotiation, or wants AI agents/crawlers (Claude, ChatGPT, coding assistants, Perplexity) to read a site's pages cleanly — even phrased loosely, e.g. "why did we score an F on this readiness scanner" or "make our docs crawlable by AI tools". Covers both Vercel and Cloudflare Pages hosting for Astro static-output (`output: 'static'`) sites; also applies if the site happens to use Starlight, but does not require it.
---

# Agent Readiness for Astro Static Sites

Make a statically-built Astro site legible to AI agents the same way it's legible to
a browser: a discoverable index, a plain-text sibling of every page, and HTTP that
gives an agent markdown when it asks for markdown. This skill distills a working,
scanner-verified implementation (scored 0→99/100 on [AFDocs](https://afdocs.dev/)) plus
the real bugs hit along the way, so the next site doesn't have to rediscover them.

## The mental model

An AI agent fetching docs is not a browser. It doesn't execute JavaScript, doesn't
want navigation chrome, and often announces what it wants via `Accept: text/markdown`.
"Agent readiness" scanners (AFDocs, isitagentready.com) check for a specific set of
signals that make a site legible to that kind of client:

| Signal | What it proves |
|---|---|
| `llms.txt` at the site root | An agent can find the full page list in one request instead of crawling |
| A directive pointing at `llms.txt`, in HTML **and** markdown | An agent landing on any single page can discover the index |
| A `.md` sibling of every page | An agent can get clean text without stripping nav/JS chrome |
| Content negotiation (`Accept: text/markdown` → markdown response at the *same* URL) | An agent that asks correctly gets served correctly, without needing to guess a `.md` URL |
| `Vary: Accept` on negotiated routes | Caches don't hand one visitor's variant to everyone |
| `robots.txt` content signals | Site owner's AI-training/AI-input/search policy is machine-readable |
| `Link` header on `/` | Major sections are discoverable without crawling |

Everything above is **host-agnostic** — it's about what bytes go over the wire. Only
*how you make the webserver do it* differs by hosting platform, because static hosts
don't all support the same conditional-routing primitives. That's the one place this
skill forks.

## Before you start: does the target site use Starlight?

The reference implementation this skill is drawn from uses Starlight, which supplies a
`docs` content collection and a `Banner` component slot. A plain Astro site (no
Starlight) has neither — adapt accordingly:

- **Page source**: Starlight → `getCollection('docs')`. Plain Astro → whatever the site
  already uses to enumerate pages (a custom content collection, `import.meta.glob` over
  `src/pages/**/*.{md,mdx}`, or the same data your sitemap integration already walks —
  check `astro.config.mjs` for an existing sitemap integration and reuse its source of
  truth rather than inventing a second one).
- **Body-directive injection point**: Starlight → override `Banner.astro` (shown below).
  Plain Astro → inject the same hidden element directly into the root `Layout.astro`,
  immediately inside `<body>`, so it appears on every page.

## Implementation (host-agnostic)

These four files/snippets don't change based on hosting platform. Build them first,
then jump to the platform-specific reference for the routing layer.

### 1. `llms.txt` index — `src/pages/llms.txt.ts`

Do **not** reach for the `starlight-llms-txt` plugin (or any similar plugin) as a
default. It's the "obvious" answer, but it pulls a nontrivial dependency tree, can
version-conflict with other Starlight/Astro plugins already in the project, and — its
main feature, generating `.md` pages — is something this skill already gives you for
free in step 2. A plugin that bundles several features is a bad trade when the site
only needs one of them and builds the others itself. Prefer the endpoint below: it's
~50 lines, has zero new dependencies, mirrors the shape of `robots.txt.ts` the project
likely already has, and regenerates on every build so it can never drift out of sync
with the actual pages (which is also what keeps `llms-txt-coverage` and
`markdown-content-parity` scanner checks passing for free).

```ts
// src/pages/llms.txt.ts
import { getCollection } from 'astro:content'; // swap for the site's actual page source
import type { APIRoute } from 'astro';

const toMdPath = (id: string) =>
    id.replace(/\.(mdx?|md)$/, '').replace(/\/index$/, '');

export const GET: APIRoute = async ({ site }) => {
    const pages = await getCollection('docs'); // or your equivalent
    const sorted = pages
        .filter((p) => /* exclude other-locale trees if bilingual, e.g. !p.id.startsWith('ko/') */ true)
        .sort((a, b) => a.id.localeCompare(b.id));

    const lines: string[] = [
        '# Site Name',
        '',
        '> One-line description of what this site documents.',
        '',
    ];

    // Group by top-level section if the site has natural sections; otherwise a flat
    // list is fine for smaller sites.
    for (const doc of sorted) {
        const url = new URL(`/${toMdPath(doc.id)}.md`, site).href;
        const desc = doc.data.description ? `: ${doc.data.description}` : '';
        lines.push(`- [${doc.data.title}](${url})${desc}`);
    }

    return new Response(lines.join('\n'), {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};
```

Spec: [llmstxt.org](https://llmstxt.org/). If the site is multilingual, scope the first
version to one locale (simpler to validate) and add other locales as a fast follow —
don't try to interleave locales in one index.

**Critical: every link in `llms.txt` must point to a `.md` URL, not a pretty HTML URL.**
The scanner fetches each link and expects `text/markdown` back. Linking to `/about/`
(HTML) instead of `/about.md` will fail `llms-txt-links-markdown` even if the page has
a working `.md` sibling. For pages that have content-collection entries, the `.md` URL
is generated by step 2. For static pages that don't (home, section indexes, custom
pages), you need hand-written `*.md.ts` endpoints (see step 2 below) and must link to
those `.md` URLs explicitly in `llms.txt`.

### 2. Markdown sibling pages — `src/pages/[...slug].md.ts`

Pre-generates a `.md` version of every page at build time.

```ts
// src/pages/[...slug].md.ts
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
    const pages = await getCollection('docs');
    return pages.map((doc) => {
        const slug =
            doc.id
                .replace(/\.(mdx?|md)$/, '')
                .replace(/\/index$/, '') || undefined;
        return { params: { slug }, props: { doc } };
    });
}

export const GET: APIRoute = async ({ props }) => {
    const { doc } = props;
    const frontmatter = [
        '---',
        `title: "${doc.data.title}"`,
        `description: "${doc.data.description ?? ''}"`,
        '---',
        '',
    ].join('\n');
    const directive = '> For the complete documentation index, see [llms.txt](/llms.txt).\n\n';
    return new Response(frontmatter + directive + (doc.body ?? ''), {
        status: 200,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
};
```

**Slug gotcha (a real regression we hit and fixed):** strip the file extension and a
trailing `/index`, but do **not** also collapse a bare top-level `index` down to an
empty string with something like `.replace(/^index$/, '')`. Astro does not generate a
route for an `undefined` param at the root, so that extra rule silently deletes
`/index.md` — the root page's markdown sibling — from the build. Keep `slug` as the
literal string `'index'` for the root case; the `|| undefined` at the end already
handles the *actual* undefined-params case Astro needs for the catch-all root route.

**MDX component caveat:** if pages use MDX components (cards, tabs, embeds), this
endpoint serves raw source (`doc.body`) while the HTML page renders those components —
scanners may flag this as a markdown/HTML parity gap of a few percent. That's usually
fine (it's component chrome, not missing prose); only invest in rendering components to
text here if parity becomes a real priority.

**Static pages without collection entries** (home page, section indexes, custom `.astro`
pages) have no `doc.body` to serve from a collection-based endpoint. For each such page
that you want to include in `llms.txt`, create a hand-written `*.md.ts` endpoint that
returns a manually-maintained markdown summary. Name these to match the URL structure:
`src/pages/index.md.ts` → `/index.md`, `src/pages/about.md.ts` → `/about.md`,
`src/pages/blog/index.md.ts` → `/blog/index.md`. Keep them short — their purpose is
to give agents a markdown entry point, not to duplicate the full rendered page. The
`llms.txt` link for these pages must point to the `.md` URL (e.g. `/about.md`), not
the HTML pretty URL (`/about/`).

### 3. Body-level agent directive (not `<head>`)

A `<link rel="alternate">` in `<head>` feels like the right place, and having one there
doesn't hurt — but agent-readiness scanners (confirmed with AFDocs) check the rendered
page **body**, not `<head>`, for the "this site has an llms.txt" directive. Put a
visually-hidden element near the top of the body instead. Use clip-rect hiding, not
`display:none` — some scanners and assistive tech treat `display:none` content as not
present at all, which defeats the purpose.

Starlight site — override the `Banner` component (it renders at the very top of every
page body already):

```astro
---
// src/components/Banner.astro
import Default from '@astrojs/starlight/components/Banner.astro';
---
<Default {...Astro.props} />
<a
    href="/llms.txt"
    style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
>
    This documentation is also available as markdown. For a complete index of all
    pages, see llms.txt at /llms.txt
</a>
```

Register it in `astro.config.mjs`: `starlight({ components: { Banner: './src/components/Banner.astro' } })`.

Plain Astro (no Starlight) — put the same `<a>` element directly in the shared root
layout, immediately after the opening `<body>` tag (or the top of whatever wrapper
renders on every page), so it's present site-wide without a component-slot mechanism.

A `<link rel="alternate" type="text/markdown">` and a link to `llms.txt` in `<head>`
are still worth keeping for browsers/tools that do check head metadata — just don't
rely on them to satisfy the *body*-directive check.

### 4. `robots.txt` content signals — `src/pages/robots.txt.ts`

Platform-agnostic Astro endpoint. Add a `Content-Signal` line next to the standard
directives, stating the site owner's policy on AI training vs. AI input (RAG/agent use)
vs. search indexing:

```ts
const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}

Content-Signal: ai-train=no, search=yes, ai-input=yes
`;
```

Adjust the `ai-train` / `search` / `ai-input` values to match the actual policy the site
owner wants — this example opts out of training data use while explicitly allowing
search indexing and agent/RAG consumption.

## Content negotiation and the `Link` header: pick your platform

The requirement (serve markdown at the *same pretty URL* when `Accept: text/markdown`
is present, plus a structural `Link` header on `/`) is host-agnostic, but the
*mechanism* is not — static hosts don't share a routing config format. Read the file
for whichever platform the target site deploys to:

- **Vercel** → `references/vercel.md` — a proven, scanner-verified config plus two dead
  ends that look reasonable but don't work.
- **Cloudflare Pages** → `references/cloudflare-pages.md` — scanner-verified on a live
  Astro (no Starlight) + Cloudflare Pages site. The design was correct; the one gap in
  the original reference (missing `index.md` fallback for section roots) is now fixed.

## Validate against a real scanner, not just curl

**Important: use the CLI, not a web-UI scanner.** Web-UI scanners (Fern Agent Score,
isitagentready.com) may gate on site type and reject personal sites or blogs outright.
The `npx afdocs` CLI has no such gate — it runs on any publicly-accessible URL.

Three real bugs in validated implementations hid behind manual testing that looked
successful:

1. A `<link>` in `<head>` looked like a correct directive — until the scanner (which
   checks the body) flagged it as missing.
2. Every manual `curl` test used trailing-slash URLs (`/page/`) and passed. The scanner
   requests the **non**-trailing-slash form (`/page`, no slash) — exactly what you get
   by stripping `.md` off an `llms.txt` link — and that shape was silently served as
   HTML, ignoring `Accept` entirely. (Vercel-specific; see `references/vercel.md`.)
3. `llms.txt` links to HTML pretty URLs (`/about/`) failed `llms-txt-links-markdown`
   even though those pages had `.md` siblings — the scanner fetches each link and
   expects `text/markdown` back. Every link in `llms.txt` must point directly to a
   `.md` URL, not a pretty HTML URL.

The general lesson: **when a check disagrees with a manual test, reproduce the
checker's exact request before assuming the checker is wrong.** A byte-identical
failure across repeated re-scans is a deterministic bug, not a flaky cache — don't
dismiss it as one.

Recommended scanners:

```sh
npx afdocs check https://example.com --format scorecard --sampling deterministic
npx afdocs check https://example.com --verbose   # prints the exact failing request URLs
```

## Known, acceptable remaining gaps

Once the above is in place, the only things a scanner is likely to still flag are
content-authoring issues, not infrastructure:

- **Oversized pages** (a page whose markdown exceeds ~50K characters risks truncation
  by an agent). Fix by splitting the page, not by changing infra.
- **High boilerplate ratio** on a few pages (large HTML-to-markdown delta) — usually the
  same oversized pages amplified by nav/sidebar chrome; the `.md` endpoint is already
  the lean path, so this mostly resolves itself once the oversized pages are split.
- **Multi-source page parity** — pages that render data from more than one source (e.g.
  a content-collection entry *plus* a separate YAML data collection like a career
  timeline) will have a `markdown-content-parity` gap if the `.md` endpoint only
  serves one source. This is acceptable unless the omitted data is substantive prose.

Don't chase these to "perfect" as an infrastructure task — they're editorial calls for
whoever owns the content.

## Rolling this out: both platform references are now verified

Both `references/vercel.md` and `references/cloudflare-pages.md` are scanner-verified
on real deployments. Read the relevant reference file before implementing the
platform-specific layer — each one includes a "Dead ends" section of things that
looked reasonable but didn't work.

## Version history

Bump the `version` field in this file's frontmatter whenever a reference file's status
changes (e.g. a platform reference moves from design to scanner-verified) or the
host-agnostic guidance above changes. Record what changed and why here so it's clear
what "verified" means as of a given version, without digging through git history.

- **0.2.0** — Cloudflare Pages reference (`references/cloudflare-pages.md`) is now
  scanner-verified: validated on danielkimdev.com (Astro, no Starlight, Cloudflare Pages)
  scoring 0→99/100. Three host-agnostic additions: (1) scanner CLI note — web-UI scanners
  gate on site type, always use `npx afdocs`; (2) `llms.txt` links must be `.md` URLs,
  not HTML pretty URLs; (3) multi-source page parity gap added to acceptable-gaps list.
  The "rolling this out" caveat section replaced with a note that both platform refs are
  now verified. Full rollout notes: `learning-agent-readiness-updates.md` in the project.
- **0.1.0** — Initial version. Host-agnostic guidance and `references/vercel.md` are
  proven (scanner-verified on a live Astro+Starlight+Vercel site).
  `references/cloudflare-pages.md` was an unverified design.
