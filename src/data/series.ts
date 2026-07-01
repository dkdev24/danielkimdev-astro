// Post-series registry (Stage 30) — a small, hand-maintained list of multi-part
// series. `content.config.ts` derives its `series` enum from SERIES_SLUGS so an
// off-registry slug fails the build, the same guarantee the tag enums give.
// Ordering within a series is NOT stored here — it's always `pubDate` order
// (utils/blog.ts, utils/series.ts), so adding a part is just publishing a post.

export const SERIES_SLUGS = ['building-llm-pkm-in-public', 'agent-readiness'] as const;

export type SeriesSlug = (typeof SERIES_SLUGS)[number];

interface SeriesMeta {
	title: { en: string; ko: string };
	description: { en: string; ko: string };
}

export const SERIES: Record<SeriesSlug, SeriesMeta> = {
	'building-llm-pkm-in-public': {
		title: {
			en: 'Building LLM-PKM in Public',
			ko: 'LLM-PKM 공개 구축기',
		},
		description: {
			en: 'Notes from building a personal LLM-PKM (knowledge management) system in the open — turning a decade of OTT/DRM experience into a structured, AI-assisted wiki, one episode at a time.',
			ko: '10년간 쌓아온 OTT·DRM 경험을 AI와 함께 구조화된 위키로 정리해가는 과정을 공개로 기록하는 시리즈입니다.',
		},
	},
	'agent-readiness': {
		title: {
			en: 'Agent Readiness for Tech Docs',
			ko: '기술 문서의 에이전트 준비도',
		},
		description: {
			en: 'What it takes for technical documentation to work for AI agents, not just human readers — definitions, failure modes, and how to measure it.',
			ko: '기술 문서가 사람뿐 아니라 AI 에이전트 앞에서도 통하려면 무엇이 필요한지 다룹니다. 정의, 실패 유형, 측정 방법까지 이어집니다.',
		},
	},
};
