# Cloudflare Pages: content negotiation and the Link header

> **Status: scanner-verified.** This was validated on danielkimdev.com — an Astro
> static site (no Starlight), bilingual EN/KO, on Cloudflare Pages — scoring 0→99/100
> on `npx afdocs`. The design below is the version that actually shipped. One gap in
> the original design (missing `index.md` fallback for section roots) is documented in
> the Dead ends section and corrected in the middleware sample.

## Why this can't be a static `_headers`/`_redirects` rule

Cloudflare Pages' `_headers` and `_redirects` files are **strictly path-pattern
matched** — there is no way to condition a rule on a request header like `Accept`.
That rules out doing this the way Vercel's `routes` `has: [{type: "header"}]` does it.
The only mechanism on Pages that can inspect a request header and branch is a **Pages
Function**.

## The mechanism: a root `_middleware` function

A Pages Function at `functions/_middleware.ts` (root of the `functions/` directory)
runs in front of **every** request to the project, including static asset requests —
confirmed in Cloudflare's docs: placing middleware at the functions root runs it "in
front of static files" too. This is the equivalent of Vercel's `routes` array winning
against `handle: filesystem`.

Inside it: check `Accept`, and if it asks for markdown, fetch the pre-built `.md` sibling
asset and return it with the right `Content-Type`; otherwise call `context.next()` to
fall through to normal static serving.

**Two-step `.md` lookup (required):** sites have two kinds of pages — content pages
(`/blog/post-slug/` → sibling at `/blog/post-slug.md`) and section-index pages
(`/blog/` → sibling at `/blog/index.md`). Try `<path>.md` first; fall back to
`<path>/index.md`. Without this, section roots return HTML on `Accept: text/markdown`.

```ts
// functions/_middleware.ts
export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const accept = request.headers.get('Accept') ?? '';

  if (accept.includes('text/markdown')) {
    const url = new URL(request.url);
    const base = url.pathname.replace(/\/$/, '') || '';

    // Step 1: try <base>.md  (post/item pages: /blog/post-slug → /blog/post-slug.md)
    let mdResponse = await env.ASSETS.fetch(
      new Request(new URL(`${base}.md`, url.origin).href, { method: 'GET', headers: request.headers })
    );

    // Step 2: try <base>/index.md  (section roots: /blog/ → /blog/index.md, / → /index.md)
    if (!mdResponse.ok) {
      mdResponse = await env.ASSETS.fetch(
        new Request(new URL(`${base}/index.md`, url.origin).href, { method: 'GET', headers: request.headers })
      );
    }

    if (mdResponse.ok) {
      const headers = new Headers(mdResponse.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('Vary', 'Accept');
      return new Response(mdResponse.body, { status: mdResponse.status, headers });
    }
    // No .md sibling — fall through to normal static serving
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.append('Vary', 'Accept');
  return new Response(response.body, { status: response.status, headers });
};
```

Confirmed facts this relies on:

- The binding is `env.ASSETS`, called as `env.ASSETS.fetch(request | url | urlString)`.
  It runs your project's own header/redirect rules on the way, so it's a faithful
  simulation of "what would a direct request for this asset return."
- Cloudflare's docs describe the fetch target as the asset's **pretty path**, not a raw
  file path, for the `.html`-stripping case (`/users/index.html` → request `/users/`).
  That rule is specifically about HTML extension-stripping; a `.md` file has no such
  alternate pretty form, so requesting the literal `/page.md` path (matching whatever
  your build emits) is correct here — just make sure the URL you construct matches the
  build output exactly.

## Scope the Function with `_routes.json` — or pay for every static request

**Without a `_routes.json`, every request invokes your Function by default** — including
images, CSS, and JS, which is pure overhead and (on paid plans) cost for a middleware
that will `next()` through them anyway. Add one that excludes static asset directories
so only page-shaped requests reach the middleware:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/_astro/*", "/img/*", "/favicon.ico", "/*.css", "/*.js"]
}
```

`exclude` always wins over `include` where they overlap. Adjust the excluded paths to
match the target site's actual static asset directories (check `astro.config.mjs`
`build.assets` / the `dist/` output layout).

## What `_headers` is still right for

Keep `_headers` for the pieces that don't need to branch on a request header:

```
/
  Link: </section-a/>; rel="service-doc"; title="Section A"
  Vary: Accept

/*.md
  Content-Type: text/markdown; charset=utf-8
```

Cloudflare's docs confirm `_headers` supports splat wildcards (`/*.md`) and don't
document any restriction on which header names can be set — `Link`, `Vary`, and
`Content-Type` should all work the same as any custom header shown in their examples,
but confirm with a live `curl` once deployed since this isn't explicitly demonstrated in
the docs. Limits: 100 rules per file, 2000 characters per line.

## Trailing-slash handling: confirmed safe on CF Pages

Cloudflare Pages normalises `/about` → `/about/` (redirect) *before* the middleware
sees the request. The `Accept` header is **preserved** across this redirect. So the
middleware always receives the trailing-slash form, and stripping it with
`.replace(/\/$/, '')` is correct and sufficient.

This is different from the Vercel bug described in `references/vercel.md` where the
non-trailing-slash form bypassed content negotiation entirely. On CF Pages that bug
class does not apply — confirmed via curl on the live site:

```sh
# Both forms return text/markdown — the redirect preserves Accept
curl -sI -H "Accept: text/markdown" https://example.pages.dev/some-page/ | grep -i content-type
curl -sI -H "Accept: text/markdown" https://example.pages.dev/some-page | grep -i content-type
```

## Verification checklist

```sh
# Content negotiation — post page (both URL shapes, both should return text/markdown)
curl -sI -H "Accept: text/markdown" https://example.pages.dev/blog/some-post/ | grep -i "content-type\|vary"
curl -sI -H "Accept: text/markdown" https://example.pages.dev/blog/some-post | grep -i "content-type\|vary"

# Content negotiation — section root (/ → /index.md, /blog/ → /blog/index.md)
curl -sI -H "Accept: text/markdown" https://example.pages.dev/ | grep -i content-type
curl -sI -H "Accept: text/markdown" https://example.pages.dev/blog/ | grep -i content-type

# Direct .md access (should return text/markdown without Accept header)
curl -sI https://example.pages.dev/blog/some-post.md | grep -i content-type

# Link header on /
curl -sI https://example.pages.dev/ | grep -i '^link:'

# Confirm static assets are NOT invoking the Function
curl -sI https://example.pages.dev/_astro/some-chunk.js
```

Then run: `npx afdocs check <url> --format scorecard --sampling deterministic`

## Dead ends

**Single-step `.md` lookup for section roots** — the original design used
`url.pathname === '/' ? '/index' : url.pathname.replace(/\/$/, '')` to derive the
`.md` path and only tried one lookup. This correctly served `/index.md` for the root
but failed for all other section roots (`/blog/` → looked for `/blog.md`, not
`/blog/index.md`). The fix is the two-step fallback shown in the middleware sample
above. Single-step is a tempting simplification but breaks any site with section-index
`.md` endpoints.

**Hardcoding `/` → `/index`** — mapping `pathname === '/'` to the literal string
`'/index'` before appending `.md` works for the root case but is a special case that
doesn't generalise. The two-step fallback (try `<base>.md`, then `<base>/index.md`)
handles the root as a natural consequence of `''.replace(/\/$/, '') = ''` → tries
`/.md` (404) → tries `//index.md` which normalises to `/index.md` (200). No special
case needed.
