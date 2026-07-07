// functions/_middleware.ts
// Cloudflare Pages middleware for content negotiation.
//
// When a request carries `Accept: text/markdown`, serve the pre-built `.md`
// sibling of the page (generated at build time by src/pages/blog/[slug].md.ts
// and src/pages/portfolio/[slug].md.ts) and add `Vary: Accept` so caches don't
// collapse the two variants.
//
// All other requests fall through to normal static serving — this middleware
// adds `Vary: Accept` to those responses too, so that CDN/proxy caches know
// the response can vary by Accept header even for the HTML variant.
//
// URL normalisation: this site uses two kinds of .md sibling paths:
// - Post/item pages: /blog/post-slug/ → /blog/post-slug.md
// - Section index pages: /blog/ → /blog/index.md, / → /index.md
// The middleware tries <base>.md first, then <base>/index.md as a fallback,
// so both cases are covered without special-casing individual routes.

export const onRequest: PagesFunction = async (context) => {
	const { request, env } = context;
	const accept = request.headers.get('Accept') ?? '';

	if (accept.includes('text/markdown')) {
		const url = new URL(request.url);
		const pathname = url.pathname;

		// Derive the .md sibling path. Strategy:
		// 1. Strip trailing slash to get the base path
		// 2. Try <base>.md first (the common case: /blog/post-slug → /blog/post-slug.md)
		// 3. If that 404s, try <base>/index.md (for section index pages:
		//    /blog/ → /blog/index.md, / → /index.md)
		// This two-step fallback covers both post pages and section-index pages
		// without needing to special-case every route.

		const base = pathname.replace(/\/$/, '') || '';

		// Try the direct .md sibling first
		const mdUrl = new URL(`${base}.md`, url.origin);
		let mdResponse = await env.ASSETS.fetch(new Request(mdUrl.href, { method: 'GET', headers: request.headers }));

		// If not found, try the index.md variant (/ → /index.md, /blog/ → /blog/index.md)
		if (!mdResponse.ok) {
			const indexMdUrl = new URL(`${base}/index.md`, url.origin);
			mdResponse = await env.ASSETS.fetch(new Request(indexMdUrl.href, { method: 'GET', headers: request.headers }));
		}

		if (mdResponse.ok) {
			const headers = new Headers(mdResponse.headers);
			headers.set('Content-Type', 'text/markdown; charset=utf-8');
			headers.set('Vary', 'Accept');
			return new Response(mdResponse.body, {
				status: mdResponse.status,
				headers,
			});
		}
		// No .md sibling found — fall through to normal static serving
	}

	// Normal static serving: call next() and append Vary: Accept so caches
	// know this URL's response can differ by Accept header.
	const response = await context.next();
	const headers = new Headers(response.headers);
	headers.append('Vary', 'Accept');
	return new Response(response.body, {
		status: response.status,
		headers,
	});
};
