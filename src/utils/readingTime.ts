// Build-time reading-time estimate from a post body (PRD §9.1). Returns whole
// minutes (≥1); the i18n `formatReadingTime` helper turns that into localized
// phrasing ("5 min read" / "5분 분량"). Korean is counted by character because
// it doesn't delimit words with spaces, so a word count would wildly undercount.

const EN_WORDS_PER_MINUTE = 200;
const KO_CHARS_PER_MINUTE = 500;

/** Estimate reading time in whole minutes for `body`, by locale. */
export function readingTimeMinutes(body: string | undefined, lang: 'en' | 'ko' = 'en'): number {
	const text = (body ?? '').trim();
	if (!text) return 1;

	if (lang === 'ko') {
		const chars = text.replace(/\s/g, '').length;
		return Math.max(1, Math.round(chars / KO_CHARS_PER_MINUTE));
	}

	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / EN_WORDS_PER_MINUTE));
}
