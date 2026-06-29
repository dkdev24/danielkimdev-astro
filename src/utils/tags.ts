// Tag/topic archive helpers (Stage 26). Each taxonomy tag gets a static archive
// page per collection per locale — blog: /blog/tags/<tag>/ (+ /ko/...), and
// portfolio: /portfolio/tags/<tag>/ (+ /ko/...). The blog index/portfolio page
// own the interactive filters; these pages are the crawlable, deep-linkable
// counterpart (one URL per topic). The route files stay thin — these builders
// produce both the getStaticPaths params and the fully-formatted card props.
import { getCollection } from 'astro:content';
import {
	formatDate,
	formatReadingTime,
	getLocalizedPath,
	useTranslations,
	type Lang,
	type TranslationKey,
} from '../i18n/utils';
import { readingTimeMinutes } from './readingTime';
import { getPostPath } from './blog';
import { getPortfolioPath } from './portfolio';

/** A pre-formatted card for the archive list (collection-agnostic). */
export interface ArchiveEntry {
	title: string;
	href?: string; // omitted when there's no detail page (portfolio, pre-Stage 27)
	summary: string;
	meta: string;
	datetime?: string; // ISO string → <time> on blog cards
	tags: string[];
}

/** Localized tag label, falling back to the raw key (mirrors Tag.astro). */
function tagLabel(t: ReturnType<typeof useTranslations>, tag: string): string {
	const key = `tags.${tag}` as TranslationKey;
	const resolved = t(key);
	return resolved === key ? tag : resolved;
}

/** getStaticPaths for one locale's blog tag archives. */
export async function getBlogTagPaths(lang: Lang) {
	const t = useTranslations(lang);
	const posts = (
		await getCollection(
			'blog',
			(e) => e.data.lang === lang && (import.meta.env.PROD ? !e.data.draft : true),
		)
	).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
	return tags.map((tag) => ({
		params: { tag },
		props: {
			tag,
			tagLabel: tagLabel(t, tag),
			entries: posts
				.filter((p) => p.data.tags.includes(tag))
				.map<ArchiveEntry>((p) => ({
					title: p.data.title,
					href: getPostPath(p),
					summary: p.data.description,
					meta: `${formatDate(p.data.pubDate, lang)} · ${formatReadingTime(
						readingTimeMinutes(p.body, lang),
						lang,
					)}`,
					datetime: p.data.pubDate.toISOString(),
					tags: p.data.tags,
				})),
		},
	}));
}

/** getStaticPaths for one locale's portfolio tag archives. */
export async function getPortfolioTagPaths(lang: Lang) {
	const t = useTranslations(lang);
	const items = (await getCollection('portfolio', (e) => e.data.lang === lang)).sort(
		(a, b) => (a.data.order ?? 99) - (b.data.order ?? 99),
	);

	const tags = [...new Set(items.flatMap((i) => i.data.tags))];
	return tags.map((tag) => ({
		params: { tag },
		props: {
			tag,
			tagLabel: tagLabel(t, tag),
			entries: items
				.filter((i) => i.data.tags.includes(tag))
				.map<ArchiveEntry>((i) => ({
					title: i.data.title,
					href: getPortfolioPath(i),
					summary: i.data.summary,
					meta: [i.data.role, i.data.org, i.data.period].filter(Boolean).join(' · '),
					tags: i.data.tags,
				})),
		},
	}));
}

/** Public URL of a tag archive (used to link tags from index/cards). */
export function getTagPath(kind: 'blog' | 'portfolio', tag: string, lang: Lang): string {
	return getLocalizedPath(`/${kind}/tags/${tag}/`, lang);
}
