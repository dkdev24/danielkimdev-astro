// src/pages/ko/portfolio/[slug].md.ts
// KO counterpart of src/pages/portfolio/[slug].md.ts: /ko/portfolio/<slug>.md for every KO item.
// Same output builder (GET is re-exported); only the path filter differs.
import { getCollection } from 'astro:content';

export { GET } from '../../portfolio/[slug].md';

export async function getStaticPaths() {
	const entries = await getCollection('portfolio');
	return entries
		.filter((e) => e.data.lang === 'ko')
		.map((doc) => {
			const slug = doc.id
				.replace(/^ko\//, '')   // strip locale prefix
				.replace(/\.mdx?$/, ''); // strip file extension
			return { params: { slug }, props: { doc } };
		});
}
