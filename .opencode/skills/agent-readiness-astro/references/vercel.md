# Vercel: content negotiation and the Link header

This is a proven, scanner-verified `vercel.json` shape — it took several wrong turns to
get here (documented below so they aren't repeated), and the final version is what
carried the reference site from a 0 to a 99/100 AFDocs score's worth of infrastructure
checks.

## Why `routes`, not `rewrites` or a post-build script

Two approaches look reasonable and both fail:

- **`rewrites` in `vercel.json`**: Vercel's Build Output API pipeline inserts `rewrites`
  entries *after* `handle: filesystem`. Since the static HTML file already exists on
  disk at that URL, filesystem serving wins and the rewrite never fires — every request
  gets HTML regardless of `Accept`.
- **A post-build script patching `.vercel/output/config.json`** (e.g. wired into
  `package.json`'s `build` script as `astro build && node scripts/inject-routes.mjs`):
  Vercel generates `.vercel/output/config.json` from its *own* build step, which runs
  **after** your `build` command finishes. A script inside `build` hits that file before
  it exists and fails with `ENOENT`.

The fix is `vercel.json`'s **`routes`** array, which Vercel *prepends* before
`handle: filesystem`, so a matching route can win against a static file at the same
path.

One structural constraint: `routes` and a top-level `headers` array cannot coexist in
`vercel.json`. Fold anything that would have been a `headers` rule into a `routes` entry
with `"continue": true` and no `dest` — it applies the header and then falls through to
normal handling.

## Content-Type must live on the same route object as `dest`

A route that rewrites the destination, followed by a *separate* later route that only
sets `Content-Type`, does not work — Vercel derives the response's `Content-Type` from
the **original** request URL, not the rewritten one. Setting `headers` and `dest` in the
same route object is the only way that's confirmed to work.

## Cover both trailing-slash and non-trailing-slash URL shapes

If the site's `trailingSlash` config doesn't force one canonical shape everywhere (or
even if it does — scanners often construct URLs by stripping `.md` off an `llms.txt`
link, which produces the **non**-slash form regardless of site config), add routes for
both:

- Trailing slash: `^/(.+)/$`
- Non-trailing-slash / extensionless: `^/((?:.+/)?[^/.]+)$` (matches a path segment with
  no dot in it, so it doesn't collide with the direct-`.md`-file route below)

Missing the non-slash pattern is a real bug that was caught only by a scanner's
`--verbose` output showing the exact failing request — every hand-written `curl` test
during development used trailing slashes and passed.

## The working shape

```json
{
  "routes": [
    {
      "src": "^/$",
      "headers": {
        "Link": "</section-a/>; rel=\"service-doc\"; title=\"Section A\", </sitemap-index.xml>; rel=\"sitemap\"",
        "Vary": "Accept"
      },
      "continue": true
    },
    {
      "src": "^/(.+)/$",
      "headers": { "Vary": "Accept" },
      "continue": true
    },
    {
      "src": "^/((?:.+/)?[^/.]+)$",
      "headers": { "Vary": "Accept" },
      "continue": true
    },
    {
      "src": "^/$",
      "has": [{ "type": "header", "key": "accept", "value": "(.*)text/markdown(.*)" }],
      "headers": { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept" },
      "dest": "/index.md"
    },
    {
      "src": "^/(.+)/$",
      "has": [{ "type": "header", "key": "accept", "value": "(.*)text/markdown(.*)" }],
      "headers": { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept" },
      "dest": "/$1.md"
    },
    {
      "src": "^/((?:.+/)?[^/.]+)$",
      "has": [{ "type": "header", "key": "accept", "value": "(.*)text/markdown(.*)" }],
      "headers": { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept" },
      "dest": "/$1.md"
    },
    {
      "src": "^/.*\\.md$",
      "headers": { "Content-Type": "text/markdown; charset=utf-8" },
      "continue": true
    }
  ]
}
```

Route order matters: the unconditional `Vary: Accept` + `Link`-header routes go first
(with `continue: true` so they don't short-circuit), then the three negotiation routes
(one per URL shape) that actually rewrite to `.md`, and finally a catch-all that forces
the right `Content-Type` when an agent requests a `.md` URL directly (e.g.
`/page.md`) rather than negotiating via `Accept`.

Adjust the `Link` header value's `service-doc` entries to the target site's actual
top-level sections.

## Verification

```sh
# Content negotiation on both URL shapes
curl -sI -H "Accept: text/markdown" https://example.com/ | grep -i content-type
curl -sI -H "Accept: text/markdown" https://example.com/some-page/ | grep -i content-type
curl -sI -H "Accept: text/markdown" https://example.com/some-page | grep -i content-type   # no trailing slash — the one that's easy to miss

# Direct .md access
curl -sI https://example.com/some-page.md | grep -i content-type

# Link header
curl -sI https://example.com/ | grep -i '^link:'
```
