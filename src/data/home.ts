// Home hero content, per locale (PRD §6.1). Title + tagline come from consts.ts so SEO,
// feeds, and the hero stay in sync; the subhead is the 1–2 sentence elaboration under the
// tagline; focusAreas drives the identity-strip chips (replacing the old OTT·DRM·Cloud·AI
// chips — media-tech now lives in About/Portfolio only).
// Bridge positioning: engineer/product credibility, AI knowledge work foregrounded.
// Korean is authored natively in Daniel's voice (합쇼체, no em-dash), not translated.
// Refine wording with Daniel (PRD §13).

import { SITE_AUTHOR, SITE_TAGLINE } from '../consts';

export const HOME_HERO = {
	en: {
		name: SITE_AUTHOR,
		tagline: SITE_TAGLINE.en,
		subhead:
			"I'm digging into how AI changes the way we capture knowledge, automate the busywork, and write documentation that machines can actually use. This is my digital garden.",
		focusAreas: ['AI Knowledge Management', 'Automation', 'AI-Ready Technical Docs'],
	},
	ko: {
		name: SITE_AUTHOR,
		tagline: SITE_TAGLINE.ko,
		subhead:
			'AI가 지식을 정리하고, 반복 작업을 자동화하며, 기계가 읽을 수 있는 문서를 만드는 방식을 탐구합니다. 그 과정을 기록하는 디지털 가든입니다.',
		focusAreas: ['AI 지식 관리', '자동화', '에이전트 준비도'],
	},
} as const;

export type HomeHero = (typeof HOME_HERO)[keyof typeof HOME_HERO];
