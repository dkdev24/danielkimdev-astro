// Blog routing helpers (Stage 17). The blog entry id includes its locale folder
// (e.g. "en/agent-readiness") because of the folder-by-locale content layout
// (Stage 09). Posts are served on the site-wide i18n scheme — EN at the root
// (`/blog/<slug>/`) and KO under `/ko/` (`/ko/blog/<slug>/`) — so we strip the
// locale folder to get the route slug and rebuild the path via getLocalizedPath.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocalizedPath, type Lang } from '../i18n/utils';

/** Strip the leading locale folder from a blog entry id → the route slug. */
export function getPostSlug(id: string): string {
	return id.replace(/^(en|ko)\//, '');
}

/** Localized public URL for a post (EN: /blog/<slug>/, KO: /ko/blog/<slug>/). */
export function getPostPath(entry: CollectionEntry<'blog'>): string {
	return getLocalizedPath(`/blog/${getPostSlug(entry.id)}/`, entry.data.lang as Lang);
}

/**
 * getStaticPaths data for one locale's posts. Drafts are dropped from production
 * builds but reachable in `astro dev` (matches the index's draft gating). Each
 * path carries its neighbours for prev/next (same locale, reverse-chron), its
 * cross-language counterpart resolved via `translationKey`, and — when
 * `series` is set (Stage 30) — its position within that series (oldest-first,
 * since a series reads front-to-back rather than reverse-chron).
 */
export async function getBlogPaths(lang: Lang) {
	const all = await getCollection('blog', (e) =>
		import.meta.env.PROD ? !e.data.draft : true,
	);
	const localePosts = all
		.filter((e) => e.data.lang === lang)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	// Group series parts oldest-first. A Map (not a plain object) so a series
	// slug can never collide with an inherited Object.prototype key.
	const seriesGroups = new Map<string, CollectionEntry<'blog'>[]>();
	for (const post of localePosts) {
		const slug = post.data.series;
		if (!slug) continue;
		const group = seriesGroups.get(slug) ?? [];
		group.push(post);
		seriesGroups.set(slug, group);
	}
	for (const group of seriesGroups.values()) {
		group.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
	}

	return localePosts.map((post, i) => {
		const slug = post.data.series;
		const group = slug ? seriesGroups.get(slug) : undefined;
		const seriesPos = group ? group.findIndex((p) => p.id === post.id) : -1;

		return {
			params: { slug: getPostSlug(post.id) },
			props: {
				post,
				// Reverse-chron list: index-1 is more recent (newer), index+1 is older.
				newer: localePosts[i - 1],
				older: localePosts[i + 1],
				counterpart: post.data.translationKey
					? all.find(
							(e) =>
								e.data.lang !== lang && e.data.translationKey === post.data.translationKey,
						)
					: undefined,
				// Series nav (Stage 30) — undefined unless `series` is set.
				seriesIndex: group ? seriesPos + 1 : undefined,
				seriesTotal: group ? group.length : undefined,
				seriesPrev: group && seriesPos > 0 ? group[seriesPos - 1] : undefined,
				seriesNext: group && seriesPos < group.length - 1 ? group[seriesPos + 1] : undefined,
			},
		};
	});
}
