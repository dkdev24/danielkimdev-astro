// i18n plumbing — locale detection, translation lookup, localized routing, and
// localized date / reading-time formatting (PRD §7.1–7.3, Stage 05).
//
// Key namespace convention: dictionaries are nested objects grouped by surface
// (`nav`, `footer`, `blog`, …). Components look strings up by dot path, e.g.
// `t('nav.blog')` or `t('blog.readingTime', { minutes: 5 })`. en.json is the
// canonical shape; ko.json is type-checked against it so the two can never drift
// out of key parity.

import en from './en.json';
import ko from './ko.json';

export type Lang = 'en' | 'ko';

export const defaultLang: Lang = 'en';

// Display labels for each locale (used by the language toggle).
export const languages: Record<Lang, string> = {
	en: 'English',
	ko: '한국어',
};

// en.json is the source of truth for the dictionary shape. Asserting ko against
// `typeof en` makes a missing/extra key in ko.json a compile error (`astro check`).
const dictionaries = {
	en,
	ko: ko satisfies typeof en,
} as const;

// Recursively flattens the nested dictionary into the union of dot-path keys,
// so `t()` only accepts strings that actually exist (e.g. 'blog.readingTime').
type NestedKeyOf<T> = {
	[K in keyof T & string]: T[K] extends Record<string, unknown>
		? `${K}.${NestedKeyOf<T[K]>}`
		: K;
}[keyof T & string];

export type TranslationKey = NestedKeyOf<typeof en>;

// Values interpolated into a string's `{token}` placeholders.
type TranslationParams = Record<string, string | number>;

/**
 * Derive the active locale from a URL pathname. English serves from the root
 * (no prefix); Korean lives under `/ko/`. Anything else falls back to default.
 */
export function getLangFromUrl(url: URL): Lang {
	const [, maybeLang] = url.pathname.split('/');
	if (maybeLang === 'ko') return 'ko';
	return defaultLang;
}

/** The other locale — handy for the language toggle and hreflang alternates. */
export function getAltLocale(lang: Lang): Lang {
	return lang === 'en' ? 'ko' : 'en';
}

/**
 * Returns a `t(key, params?)` bound to `lang`. Looks the dot-path key up in the
 * locale dictionary, falls back to English, then to the raw key, and substitutes
 * any `{token}` placeholders from `params`.
 */
export function useTranslations(lang: Lang) {
	return function t(key: TranslationKey, params?: TranslationParams): string {
		const resolved = lookup(dictionaries[lang], key) ?? lookup(dictionaries[defaultLang], key);
		if (resolved == null) return key;
		return params ? interpolate(resolved, params) : resolved;
	};
}

function lookup(dict: unknown, key: string): string | undefined {
	const value = key.split('.').reduce<unknown>((node, part) => {
		if (node && typeof node === 'object' && part in node) {
			return (node as Record<string, unknown>)[part];
		}
		return undefined;
	}, dict);
	return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, params: TranslationParams): string {
	return template.replace(/\{(\w+)\}/g, (match, token: string) =>
		token in params ? String(params[token]) : match,
	);
}

/**
 * Localizes an in-site path for `lang`. English paths are returned untouched
 * (served from root); Korean paths get a `/ko` prefix. Idempotent — a path that
 * already carries the right prefix is returned unchanged. External/anchor links
 * (`http`, `#`, `mailto:`) pass through.
 */
export function getLocalizedPath(path: string, lang: Lang): string {
	if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;

	// Strip any existing locale prefix so we start from a locale-neutral path.
	let normalized = path.replace(/^\/ko(?=\/|$)/, '');
	if (!normalized.startsWith('/')) normalized = `/${normalized}`;
	if (normalized === '') normalized = '/';

	if (lang === 'en') return normalized;

	// Korean: prefix with /ko, avoiding a trailing-slash-only "/ko/" → "/ko/".
	return normalized === '/' ? '/ko/' : `/ko${normalized}`;
}

// Intl locale tags for date/number formatting.
const intlLocale: Record<Lang, string> = {
	en: 'en-US',
	ko: 'ko-KR',
};

/** Locale-aware long date, e.g. "June 28, 2026" / "2026년 6월 28일". */
export function formatDate(date: Date, lang: Lang): string {
	return new Intl.DateTimeFormat(intlLocale[lang], {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}

/**
 * Locale-aware reading-time phrasing, e.g. "5 min read" / "5분 분량".
 * Clamps to a 1-minute floor so very short posts don't read "0 min".
 */
export function formatReadingTime(minutes: number, lang: Lang): string {
	const safe = Math.max(1, Math.round(minutes));
	return useTranslations(lang)('blog.readingTime', { minutes: safe });
}
