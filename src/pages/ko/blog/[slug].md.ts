// src/pages/ko/blog/[slug].md.ts
// KO counterpart of src/pages/blog/[slug].md.ts: pre-generates /ko/blog/<slug>.md for every
// published KO post. Same output builder (GET is re-exported); only the path filter differs.
// The content-negotiation middleware picks these up for /ko/blog/<slug>/ with no changes.
import { getCollection } from 'astro:content';

export { GET } from '../../blog/[slug].md';

export async function getStaticPaths() {
	const entries = await getCollection('blog');
	return entries
		.filter((e) => e.data.lang === 'ko' && !e.data.draft)
		.map((doc) => {
			const slug = doc.id
				.replace(/^ko\//, '')   // strip locale prefix
				.replace(/\.mdx?$/, ''); // strip file extension
			return { params: { slug }, props: { doc } };
		});
}
