// Global site metadata. Import from anywhere via the `import` keyword.
// Locale-specific strings live in the i18n dictionaries (Stage 05), not here —
// these are language-neutral defaults used for SEO, feeds, and structured data.

// Brand mark — the name carries the brand; the descriptor lives in SITE_TITLE_HOME / SITE_TAGLINE.
// Inner pages render their title as `${Page} — ${SITE_TITLE}`.
export const SITE_TITLE = 'Daniel Kim';

// Home <title> / brand descriptor, per locale (PRD §10.4). The home page uses these;
// inner pages fall back to `${Page} — ${SITE_TITLE}`.
export const SITE_TITLE_HOME = {
	en: 'Daniel Kim — Product & DevRel, working on AI for knowledge work',
	ko: 'Daniel Kim | 제품·DevRel, AI 기반 지식 관리 탐구',
} as const;

// Positioning line / hero tagline, per locale (PRD §6.1, §8.2, §13.3).
// Bridge angle: engineer/product credibility, with AI knowledge work foregrounded as the
// current focus (AI knowledge management, automation, AI-ready technical docs). Media-tech
// background lives in About/Portfolio, not the headline. KO authored natively in Daniel's
// voice (합쇼체, no em-dash) — not a translation.
export const SITE_TAGLINE = {
	en: 'An engineer-turned-product person exploring AI knowledge management, automation, and AI-ready technical docs.',
	ko: '개발자로 출발한 제품 전문가가 AI 기반 지식 관리와 자동화, 그리고 기술 문서의 에이전트 준비도를 다룹니다.',
} as const;

// Default meta description / excerpt fallback, per locale (PRD §10.4, §7.5).
// Kept alongside the legacy scalar SITE_DESCRIPTION below until Stage 18 rewires SEO.
export const SITE_DESCRIPTION_BY_LOCALE = {
	en: "An engineer-turned-product person exploring AI knowledge management, automation, and AI-ready technical documentation — notes, essays, and experiments from Daniel Kim's digital garden.",
	ko: '개발자로 출발한 제품 전문가가 AI 기반 지식 관리와 자동화, 그리고 기술 문서의 에이전트 준비도(Agent Readiness)를 다루는 디지털 가든입니다.',
} as const;

// Legacy language-neutral default (EN). Starter files still import this; Stage 18 will
// switch SEO/feeds to the per-locale exports above.
export const SITE_DESCRIPTION = SITE_DESCRIPTION_BY_LOCALE.en;

export const SITE_AUTHOR = 'Daniel Kim';

// Default Open Graph / Twitter card image, served from /public. Per-post images
// override this (PRD §10.4). TODO(daniel): add the real asset at public/og-default.png.
export const DEFAULT_OG_IMAGE = '/og-default.png';

// Public contact email — the site's contact address (PRD §4). Personal Gmail by
// design (this is a personal blog/portfolio); the company-domain work email is
// intentionally NOT used here.
export const CONTACT_EMAIL = 'danielkimdev24@gmail.com';

// Social profiles (PRD §4 footer). Locked 2026-06-28: LinkedIn + email only —
// no X (Twitter) or GitHub accounts to show yet, so those are omitted entirely
// (don't scaffold placeholders). Revisit only if Daniel creates them.
export const SOCIAL_LINKS = {
	linkedin: 'https://www.linkedin.com/in/junhoster/',
} as const;
