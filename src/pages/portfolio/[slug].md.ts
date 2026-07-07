// src/pages/portfolio/[slug].md.ts
// Pre-generates a plain-markdown sibling of every EN portfolio item at /portfolio/<slug>.md.
// KO items are excluded (fast-follow: src/pages/ko/portfolio/[slug].md.ts).
//
// Portfolio entry IDs follow the same folder-by-locale convention as blog:
// "en/item-slug" → strip "en/" prefix + extension to get the route param.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
	const entries = await getCollection('portfolio');
	return entries
		.filter((e) => e.data.lang === 'en')
		.map((doc) => {
			const slug = doc.id
				.replace(/^en\//, '')   // strip locale prefix
				.replace(/\.mdx?$/, ''); // strip file extension
			return { params: { slug }, props: { doc } };
		});
}

export const GET: APIRoute = async ({ props }) => {
	const { doc } = props;

	const frontmatter = [
		'---',
		`title: "${doc.data.title.replace(/"/g, '\\"')}"`,
		`role: "${doc.data.role.replace(/"/g, '\\"')}"`,
		doc.data.org ? `org: "${doc.data.org.replace(/"/g, '\\"')}"` : null,
		`period: "${doc.data.period}"`,
		`summary: "${doc.data.summary.replace(/"/g, '\\"')}"`,
		`category: "${doc.data.category}"`,
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
