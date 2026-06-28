// Per-locale RSS feed builder (Stage 18). EN serves at /rss.xml, KO at
// /ko/rss.xml — each feed is single-language so subscribers get a coherent
// stream (PRD §10.3). Drafts are excluded; items link via the canonical
// post path helper so feed links always match the live routes.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION_BY_LOCALE, SITE_TITLE } from '../consts';
import type { Lang } from '../i18n/utils';
import { getPostPath } from './blog';

export async function buildFeed(lang: Lang, context: APIContext) {
	const posts = (
		await getCollection('blog', (e) => e.data.lang === lang && !e.data.draft)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: lang === 'en' ? SITE_TITLE : `${SITE_TITLE} (한국어)`,
		description: SITE_DESCRIPTION_BY_LOCALE[lang],
		site: context.site ?? 'https://danielkimdev.com',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: getPostPath(post),
		})),
		customData: `<language>${lang === 'en' ? 'en-US' : 'ko-KR'}</language>`,
	});
}
