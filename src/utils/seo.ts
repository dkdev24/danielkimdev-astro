// Structured-data (JSON-LD) builders (Stage 18). Kept framework-free and typed
// loosely as plain records — BaseHead serializes whatever it's handed into a
// <script type="application/ld+json"> block. Person goes on Home + About;
// BlogPosting on each post (PRD §10.3).
import { SITE_AUTHOR, SITE_TAGLINE, SOCIAL_LINKS } from '../consts';
import type { Lang } from '../i18n/utils';

type JsonLd = Record<string, unknown>;

/** schema.org Person for the site owner — the brand subject (Home + About). */
export function personJsonLd(siteUrl: URL, lang: Lang): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_AUTHOR,
		url: new URL('/', siteUrl).href,
		description: SITE_TAGLINE[lang],
		sameAs: Object.values(SOCIAL_LINKS),
	};
}

/** schema.org BlogPosting for a single post. */
export function blogPostingJsonLd(opts: {
	siteUrl: URL;
	url: URL;
	title: string;
	description: string;
	datePublished: Date;
	dateModified?: Date;
	image?: string;
	lang: Lang;
	tags?: string[];
}): JsonLd {
	const { siteUrl, url, title, description, datePublished, dateModified, image, lang, tags } = opts;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		datePublished: datePublished.toISOString(),
		dateModified: (dateModified ?? datePublished).toISOString(),
		inLanguage: lang === 'en' ? 'en-US' : 'ko-KR',
		mainEntityOfPage: url.href,
		url: url.href,
		...(image ? { image } : {}),
		...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
		author: {
			'@type': 'Person',
			name: SITE_AUTHOR,
			url: new URL('/', siteUrl).href,
		},
	};
}
