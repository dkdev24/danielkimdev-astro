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
// URL normalisation: this site's page URLs all have trailing slashes
// (/blog/post-slug/ → pretty URL for the index.html). The .md siblings are
// emitted WITHOUT trailing slashes (/blog/post-slug.md). We need to handle
// both the trailing-slash form (/blog/post-slug/) and the plain form
// (/blog/post-slug) when building the .md lookup path.
//
// Trailing-slash behaviour on Cloudflare Pages (confirmed):
// Pages normalises directory-index URLs to the trailing-slash form BEFORE
// the middleware sees them. So /blog/post-slug redirects to /blog/post-slug/
// first, and the middleware sees /blog/post-slug/ (with slash). Both forms
// are handled below for safety.

export const onRequest: PagesFunction = async (context) => {
	const { request, env } = context;
	const accept = request.headers.get('Accept') ?? '';

	if (accept.includes('text/markdown')) {
		const url = new URL(request.url);
		let pathname = url.pathname;

		// Strip trailing slash and derive the .md sibling path.
		// / → /index.md (root has no .md sibling in this build — fall through)
		// /blog/post-slug/ → /blog/post-slug.md
		// /blog/post-slug  → /blog/post-slug.md
		const stripped = pathname === '/' ? null : pathname.replace(/\/$/, '');

		if (stripped) {
			const mdUrl = new URL(`${stripped}.md`, url.origin);
			const mdRequest = new Request(mdUrl.href, {
				method: 'GET',
				headers: request.headers,
			});

			const mdResponse = await env.ASSETS.fetch(mdRequest);

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
