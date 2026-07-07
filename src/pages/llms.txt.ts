// src/pages/llms.txt.ts
// Agent-readable index of all English content on danielkimdev.com.
// Spec: https://llmstxt.org/
// Scope: EN locale only (KO deferred as fast-follow).
// Format: H1 title + blockquote summary + grouped markdown links.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Strip leading locale prefix (e.g. "en/post-slug" → "post-slug")
// The blog content collection uses folder-by-locale so every ID starts with "en/" or "ko/".
const stripLocale = (id: string) => id.replace(/^(en|ko)\//, '');

export const GET: APIRoute = async ({ site }) => {
	const [blogEntries, portfolioEntries] = await Promise.all([
		getCollection('blog'),
		getCollection('portfolio'),
	]);

	// EN-only, published posts, sorted by pubDate descending (newest first)
	const posts = blogEntries
		.filter((p) => p.data.lang === 'en' && !p.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	// EN-only portfolio items, sorted by order then title
	const portfolioItems = portfolioEntries
		.filter((p) => p.data.lang === 'en')
		.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));

	const lines: string[] = [
		'# Daniel Kim',
		'',
		'> Personal site and blog by Daniel Kim — AI for knowledge work, media tech (OTT/DRM/streaming),',
		'> and building in public. Bilingual EN/KO. This index covers the English content.',
		'',
		'## Static pages',
		'',
	];

	// Static pages that have no content-collection entry
	const staticPages = [
		{ title: 'Home', path: '/', desc: 'Overview and featured work' },
		{ title: 'About', path: '/about/', desc: 'Background, career, and what I work on' },
		{ title: 'Blog', path: '/blog/', desc: 'All blog posts' },
		{ title: 'Portfolio', path: '/portfolio/', desc: 'Work portfolio' },
	];

	for (const page of staticPages) {
		const url = new URL(page.path, site).href;
		lines.push(`- [${page.title}](${url}): ${page.desc}`);
	}

	lines.push('', '## Blog posts', '');

	for (const post of posts) {
		const slug = stripLocale(post.id).replace(/\.mdx?$/, '');
		const url = new URL(`/blog/${slug}.md`, site).href;
		const desc = post.data.description ? `: ${post.data.description}` : '';
		lines.push(`- [${post.data.title}](${url})${desc}`);
	}

	lines.push('', '## Portfolio', '');

	for (const item of portfolioItems) {
		const slug = stripLocale(item.id).replace(/\.mdx?$/, '');
		const url = new URL(`/portfolio/${slug}.md`, site).href;
		const desc = item.data.summary ? `: ${item.data.summary}` : '';
		lines.push(`- [${item.data.title}](${url})${desc}`);
	}

	return new Response(lines.join('\n') + '\n', {
		status: 200,
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
