# Agent Readiness Skill — Open-Source Project Brief

Context for starting the open-source version of the `agent-readiness-astro` skill.
Written after completing a full rollout on danielkimdev.com (0→99/100 afdocs score).

---

## What this skill is

A how-to guide and reusable code patterns for making statically-built web sites
legible to AI agents — discoverable index, plain-text sibling of every page, and HTTP
that serves markdown when an agent asks for it.

The current version lives at `.opencode/skills/agent-readiness-astro/` in this repo
(version 0.2.0, Astro-specific). The open-source version would generalise it beyond
Astro to other frameworks and hosting platforms.

---

## How it works (technical architecture)

Understanding this is essential before extending the skill to other frameworks.

### Pre-built static files, not runtime conversion

Every `.md` sibling file is **generated at build time** by the framework's build step
and deployed to the CDN as a static asset alongside the HTML files. The `dist/` folder
after a build contains both:

```
dist/
├── blog/
│   ├── post-slug/
│   │   └── index.html       ← HTML page (pretty URL)
│   └── post-slug.md         ← markdown sibling (pre-built static file)
├── index.html
├── index.md                 ← markdown sibling for the home page
├── about.md
├── llms.txt
└── robots.txt
```

All files — HTML and `.md` — are uploaded to the CDN on deploy. The `.md` files are
inert static assets from the CDN's perspective, no different from images or CSS.

### Runtime routing, not runtime conversion

The edge layer (Vercel routes config or Cloudflare Pages middleware) does **routing
only** — when a request arrives with `Accept: text/markdown`, it points to the
pre-built `.md` file instead of the `.html` file. No markdown generation happens at
request time.

This is different from Cloudflare's native "Markdown for Agents" platform feature,
which does runtime HTML-to-markdown conversion. The skill's approach produces cleaner
output because the markdown comes directly from the original source `.md`/`.mdx` files,
not from parsing rendered HTML. Trade-off: requires a build step that generates `.md`
files; runtime conversion requires no build changes.

### The two-layer pattern

Every platform implementation is the same two layers:

1. **Build layer** (framework-specific): generate `.md` siblings as static files
2. **Routing layer** (host-specific): serve `.md` file when `Accept: text/markdown`
   is present; otherwise fall through to normal static serving

The routing layer is the only part that differs between Vercel and Cloudflare Pages —
and only because of how each platform expresses conditional routing, not because the
underlying logic differs.

---

## The seven agent-readiness signals

These are what scanners check. All are host-agnostic except content negotiation.

| Signal | How implemented |
|---|---|
| `llms.txt` at root | `src/pages/llms.txt.ts` — generated at build time from content collections |
| Body directive pointing at `llms.txt` | Visually-hidden `<a>` in `<body>` (clip-rect), not `<head>` |
| `.md` sibling of every page | `*.md.ts` endpoints in `src/pages/` |
| Content negotiation (`Accept: text/markdown`) | Edge routing (Vercel routes / CF Pages middleware) |
| `Vary: Accept` | Set by edge layer on all responses |
| `robots.txt` content signals | `src/pages/robots.txt.ts` with `Content-Signal` line |
| `Link` header on `/` | `_headers` file (CF Pages) or `vercel.json` routes |

---

## Scanner tooling

**Always use `npx afdocs` CLI, not web-UI scanners.**

Web-UI scanners (Fern Agent Score at fern.dev, isitagentready.com) gate on site type
and reject personal sites/blogs outright. `npx afdocs` has no such gate.

```sh
npx afdocs check https://example.com --format scorecard --sampling deterministic
npx afdocs check https://example.com --verbose   # shows exact failing request URLs
```

Note: isitagentready.com is built by Cloudflare, which also sells a Pro-plan "Markdown
for Agents" feature. The skill is a free, self-hosted alternative.

---

## Positioning of the open-source skill

- **Free alternative** to Cloudflare's Pro-plan native feature
- **Platform-agnostic** — works on any static host
- **Source-quality markdown** — generated from source `.md`/`.mdx`, not parsed from HTML
- **Transparent** — you see exactly what gets deployed and why

Cloudflare's native feature confirms the underlying problem is real infrastructure, not
hype. A major platform building paid tooling for it is a signal of durability, not a
warning sign.

---

## Known-good implementations (as of 2026-07-07)

| Platform | Status | Reference |
|---|---|---|
| Vercel | Scanner-verified (Astro + Starlight) | `references/vercel.md` |
| Cloudflare Pages | Scanner-verified (Astro, no Starlight) | `references/cloudflare-pages.md` |

Both verified at 99/100 on `npx afdocs`.

---

## Hard-won implementation lessons

These were discovered during the danielkimdev.com rollout and are now in the skill.
Any new framework/platform port should verify these don't reappear.

### 1. All `llms.txt` links must be `.md` URLs

The scanner fetches each link in `llms.txt` and expects `text/markdown` back. Linking
to `/about/` (HTML pretty URL) fails `llms-txt-links-markdown` even if `/about.md`
exists. Every link must point directly to the `.md` URL. This includes static/non-collection
pages — they need hand-written `.md` endpoints too.

### 2. The body directive must be in `<body>`, not `<head>`

Scanners check the rendered page body for the llms.txt directive. A `<link rel="alternate">`
in `<head>` is invisible to them. Use a clip-rect visually-hidden `<a>` element near
the top of `<body>`.

### 3. Section roots need a two-step `.md` lookup in the edge layer

Content pages: `/blog/post-slug/` → sibling at `/blog/post-slug.md` (strip trailing
slash, append `.md`).

Section-index pages: `/blog/` → sibling at `/blog/index.md` (strip trailing slash,
append `.md` → 404, then try `/blog/index.md` → 200).

A single-step lookup breaks all section roots. The middleware must try `<path>.md`
first, then fall back to `<path>/index.md`.

### 4. Static pages without collection entries need hand-written `.md` endpoints

Pages built from `.astro` files (home, about, section indexes) have no collection
entry to serve `doc.body` from. Create explicit `*.md.ts` endpoints for each:
`src/pages/index.md.ts` → `/index.md`, `src/pages/about.md.ts` → `/about.md`, etc.

### 5. Trailing-slash and `Accept` header preservation varies by platform

- **Cloudflare Pages**: the `/page` → `/page/` redirect happens *before* the
  middleware sees the request, and CF Pages preserves the `Accept` header across it.
  No special-casing needed in the middleware.
- **Vercel**: the non-trailing-slash form bypassed content negotiation entirely —
  required explicit route patterns for both `/page/` and `/page` shapes.

Always test both URL shapes after deployment:
```sh
curl -sI -H "Accept: text/markdown" https://example.com/some-page/
curl -sI -H "Accept: text/markdown" https://example.com/some-page
```

---

## Scope of the current skill (Astro-specific parts)

When porting to other frameworks, these are the Astro-specific pieces to replace:

| Astro concept | What it does | Framework equivalent to find |
|---|---|---|
| `src/pages/llms.txt.ts` (APIRoute) | Generates `llms.txt` at build time | Next.js: `app/llms.txt/route.ts`; SvelteKit: `src/routes/llms.txt/+server.ts` |
| `src/pages/[slug].md.ts` (APIRoute + getStaticPaths) | Pre-builds `.md` siblings | Next.js: `generateStaticParams` + route handler; SvelteKit: `entries()` + `+server.ts` |
| `getCollection('blog')` | Fetches content entries | Each framework's own content API |
| `doc.body` | Raw markdown source | Framework-dependent — may need to read source file directly |
| `src/pages/robots.txt.ts` | Generates `robots.txt` | Same pattern as `llms.txt` above |

The routing layer (`vercel.json` / `functions/_middleware.ts` / `_headers`) is
framework-independent — it only cares about what files are in the output directory,
not how they got there.

---

## Acceptable remaining gaps (don't over-engineer)

- **Pages rendering from multiple data sources** (e.g. a content-collection entry +
  a separate YAML data collection): the `.md` endpoint will have a parity gap for the
  data-collection content. Acceptable unless the omitted content is substantive prose.
- **KO/other locale `.md` siblings**: EN-first is a reasonable scope for v1. Add other
  locales as a fast-follow once EN is scanner-verified.
- **`content-start-position` warnings**: caused by nav/sidebar markup preceding content
  in the HTML-to-markdown conversion. The `.md` endpoint already bypasses this — it's
  a cosmetic score issue, not a real agent-legibility problem.

---

## Files to read before starting

- `.opencode/skills/agent-readiness-astro/SKILL.md` — current skill (v0.2.0)
- `.opencode/skills/agent-readiness-astro/references/cloudflare-pages.md` — verified CF Pages implementation
- `.opencode/skills/agent-readiness-astro/references/vercel.md` — verified Vercel implementation
- `learning-agent-readiness-updates.md` — full rollout notes from danielkimdev.com
- `src/pages/llms.txt.ts`, `src/pages/blog/[slug].md.ts`, `functions/_middleware.ts` — working Astro implementations to reference
