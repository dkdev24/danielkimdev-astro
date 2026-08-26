// Home hero content, per locale (PRD §6.1). `tagline` is the Cobalt-pilot hero
// headline (2026-08-26) — a single sentence merging the role + focus, distinct
// from `SITE_TAGLINE` in consts.ts (which stays untouched as the SEO/JSON-LD
// description). focusAreas drives the identity-strip chips (replacing the old
// OTT·DRM·Cloud·AI chips — media-tech now lives in About/Portfolio only).
// Bridge positioning: engineer/product credibility, AI knowledge work foregrounded.
// Korean is authored natively in Daniel's voice (합쇼체, no em-dash), not translated.
// Refine wording with Daniel (PRD §13).

import { SITE_AUTHOR } from '../consts';

export const HOME_HERO = {
	en: {
		name: SITE_AUTHOR,
		tagline: 'Exploring how AI organizes knowledge, automates busywork, and creates documentation machines can read.',
		focusAreas: ['AI Knowledge Management', 'Automation', 'AI-Ready Technical Docs'],
	},
	ko: {
		name: SITE_AUTHOR,
		tagline: 'AI로 지식을 정리하고 반복 작업을 자동화하며 기계가 읽을 수 있는 문서를 만드는 방식을 탐구합니다.',
		focusAreas: ['AI 지식 관리', '자동화', '에이전트 준비도'],
	},
} as const;

export type HomeHero = (typeof HOME_HERO)[keyof typeof HOME_HERO];
