// Global site metadata. Import from anywhere via the `import` keyword.
// Locale-specific strings live in the i18n dictionaries (Stage 05), not here —
// these are language-neutral defaults used for SEO, feeds, and structured data.

export const SITE_TITLE = 'Daniel Kim';

// Positioning line (PRD §8.2). Used as the default meta description / excerpt fallback.
export const SITE_DESCRIPTION =
	'Media-tech product, from the engineer’s side — OTT, DRM, and the AI shift. Notes, essays, and work from a media & entertainment technology product person.';

export const SITE_AUTHOR = 'Daniel Kim';

// Default Open Graph / Twitter card image, served from /public. Per-post images
// override this (PRD §10.4). TODO(daniel): add the real asset at public/og-default.png.
export const DEFAULT_OG_IMAGE = '/og-default.png';

// Social profiles (PRD §4 footer). TODO(daniel): fill in real profile URLs.
export const SOCIAL_LINKS = {
	linkedin: 'TODO(daniel): LinkedIn profile URL',
	twitter: 'TODO(daniel): X (Twitter) profile URL',
	github: 'TODO(daniel): GitHub profile URL',
} as const;
