// src/pages/blog/[slug].md.ts
// Pre-generates a plain-markdown sibling of every EN blog post at /blog/<slug>.md.
// KO posts are excluded from this endpoint (they live at /ko/blog/<slug>/ and would
// need a separate endpoint at src/pages/ko/blog/[slug].md.ts as a fast-follow).
//
// SLUG NOTE: blog entry IDs are "en/post-slug" (folder-by-locale convention).
// We strip the "en/" prefix and the file extension to get the route param.
// We do NOT strip a trailing "index" or collapse to undefined — Astro needs the
// literal string for catch-all params; the [slug] (non-spread) param handles
// top-level slugs cleanly without that concern.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
	const entries = await getCollection('blog');
	return entries
		.filter((e) => e.data.lang === 'en' && !e.data.draft)
		.map((doc) => {
			const slug = doc.id
				.replace(/^en\//, '')   // strip locale prefix
				.replace(/\.mdx?$/, ''); // strip file extension
			return { params: { slug }, props: { doc } };
		});
}

export const GET: APIRoute = async ({ props }) => {
	const { doc } = props;

	const updatedLine = doc.data.updatedDate
		? `\nupdatedDate: "${doc.data.updatedDate.toISOString().slice(0, 10)}"`
		: '';

	const frontmatter = [
		'---',
		`title: "${doc.data.title.replace(/"/g, '\\"')}"`,
		`description: "${(doc.data.description ?? '').replace(/"/g, '\\"')}"`,
		`pubDate: "${doc.data.pubDate.toISOString().slice(0, 10)}"${updatedLine}`,
		`lang: "${doc.data.lang}"`,
		doc.data.tags.length ? `tags: [${doc.data.tags.map((t) => `"${t}"`).join(', ')}]` : null,
		'---',
		'',
	]
		.filter((l) => l !== null)
		.join('\n');

	const directive =
		'> For the complete index of all posts and pages, see [llms.txt](/llms.txt).\n\n';

	return new Response(frontmatter + directive + (doc.body ?? ''), {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
