// Portfolio routing helpers (Stage 27), mirroring utils/blog.ts. Portfolio
// entry ids include the locale folder (e.g. "en/whatifclassics") because of the
// folder-by-locale content layout (Stage 09), so we strip it to get the route
// slug and rebuild the path via getLocalizedPath. Unlike blog, EN/KO entries
// pair by their SHARED slug (filename) — portfolio has no `translationKey` — so
// the cross-language counterpart is just the same slug in the other locale.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocalizedPath, type Lang } from '../i18n/utils';

/** Strip the leading locale folder from a portfolio entry id → the route slug. */
export function getPortfolioSlug(id: string): string {
	return id.replace(/^(en|ko)\//, '');
}

/** Localized public URL (EN: /portfolio/<slug>/, KO: /ko/portfolio/<slug>/). */
export function getPortfolioPath(entry: CollectionEntry<'portfolio'>): string {
	return getLocalizedPath(`/portfolio/${getPortfolioSlug(entry.id)}/`, entry.data.lang as Lang);
}

/**
 * getStaticPaths data for one locale's portfolio items, ordered by `order` to
 * match the portfolio index. Each path carries its cross-language counterpart
 * (same slug, other locale) when one exists. No draft gating — portfolio has no
 * `draft` field; every entry publishes.
 */
export async function getPortfolioPaths(lang: Lang) {
	const all = await getCollection('portfolio');
	const localeItems = all
		.filter((e) => e.data.lang === lang)
		.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));

	return localeItems.map((item) => {
		const slug = getPortfolioSlug(item.id);
		return {
			params: { slug },
			props: {
				item,
				counterpart: all.find((e) => e.data.lang !== lang && getPortfolioSlug(e.id) === slug),
			},
		};
	});
}
