// Series hub helpers (Stage 30) — mirrors utils/tags.ts's split: a builder here
// produces getStaticPaths params + pre-formatted card props, the route files
// stay thin, and SeriesArchivePage.astro is the dumb renderer. Unlike tag
// archives (reverse-chron), series entries are forward-ordered — a series reads
// front-to-back, oldest part first.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocalizedPath, type Lang } from '../i18n/utils';
import { SERIES, SERIES_SLUGS, type SeriesSlug } from '../data/series';
import { getPostPath } from './blog';

/** Public URL of one series' hub page. */
export function getSeriesPath(slug: SeriesSlug, lang: Lang): string {
	return getLocalizedPath(`/blog/series/${slug}/`, lang);
}

/** Public URL of the all-series index. */
export function getSeriesIndexPath(lang: Lang): string {
	return getLocalizedPath('/blog/series/', lang);
}

async function localeSeriesPosts(lang: Lang): Promise<
	(CollectionEntry<'blog'> & { data: { series: SeriesSlug } })[]
> {
	const all = await getCollection(
		'blog',
		(e) => e.data.lang === lang && (import.meta.env.PROD ? !e.data.draft : true),
	);
	return all.filter(
		(p): p is CollectionEntry<'blog'> & { data: { series: SeriesSlug } } =>
			p.data.series !== undefined,
	);
}

/** All parts of one series, oldest first (a series reads front-to-back). */
export async function getSeriesPosts(slug: SeriesSlug, lang: Lang) {
	const posts = await localeSeriesPosts(lang);
	return posts
		.filter((p) => p.data.series === slug)
		.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}

/** getStaticPaths for one locale's series hub pages — one per slug actually used. */
export async function getSeriesArchivePaths(lang: Lang) {
	const posts = await localeSeriesPosts(lang);
	const usedSlugs = [...new Set(posts.map((p) => p.data.series))];

	return usedSlugs.map((slug) => {
		const meta = SERIES[slug];
		const parts = posts
			.filter((p) => p.data.series === slug)
			.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());

		return {
			params: { slug },
			props: {
				slug,
				title: meta.title[lang],
				description: meta.description[lang],
				entries: parts.map((p, i) => ({
					partIndex: i + 1,
					title: p.data.title,
					href: getPostPath(p),
					summary: p.data.description,
				})),
			},
		};
	});
}

/** Card data for the /blog/series/ index — every registered series with ≥1 published part. */
export async function getSeriesIndexEntries(lang: Lang) {
	const posts = await localeSeriesPosts(lang);
	return SERIES_SLUGS.map((slug) => {
		const meta = SERIES[slug];
		const count = posts.filter((p) => p.data.series === slug).length;
		return {
			slug,
			title: meta.title[lang],
			description: meta.description[lang],
			count,
			href: getSeriesPath(slug, lang),
		};
	}).filter((s) => s.count > 0);
}
