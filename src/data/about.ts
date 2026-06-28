// About-page prose, per locale (PRD §13.1 / §13.2). Bio paragraphs render on the
// About page (Stage 14). Throughline (locked 2026-06-27): lead with AI for
// knowledge work; the media-tech / DevRel career is *proof*, not a second topic.
//
// EN is the seed draft from §13.1. KO must be authored NATIVELY in Daniel's
// voice (합쇼체, no em-dash) — NOT translated — so it ships as a clearly-marked
// TODO(daniel) stub with the key points to cover.

export const ABOUT = {
	en: {
		bio: [
			"I'm Daniel Kim. I work on AI for knowledge work — how AI reshapes the way we manage knowledge, automate the busywork, and write technical documentation that machines, not just people, can use.",
			'I come at this from a deep technical career: 11+ years building in C/C++ and Java, then moving from writing code to shaping products across Product Ownership, Product Management, and Developer Relations in media & entertainment technology — OTT/streaming and DRM/content security, most recently with DoveRunner / PallyCon.',
			'That background is the point: years of shipping and explaining complex systems and documentation in a hard domain are exactly what keep my take on AI concrete rather than generic.',
			'This site is my digital garden — notes, essays, and experiments from that work, and a record of building toward an independent, solopreneur future.',
		],
	},
	ko: {
		// TODO(daniel): 다니엘 문체 스킬로 직접 집필 (영문 직역 금지, 합쇼체, em-dash 금지).
		// 핵심 줄기: 메인은 AI 기반 지식 작업(지식 관리, 자동화, 기술 문서의 에이전트
		// 준비도). 경력은 신뢰의 토대 — 11년+ C/C++·Java 개발자에서 PO/PM/DevRel로,
		// 미디어·OTT·DRM/콘텐츠 보안(DoveRunner/PallyCon) 경험이 AI 관점을 일반론이
		// 아닌 구체적인 이야기로 만들어 준다는 점. 솔로프리너 지향.
		bio: [
			'TODO(daniel): 위 핵심 줄기를 바탕으로 한국어 자기소개를 네이티브 보이스로 집필하세요. 아래는 페이지가 비지 않도록 둔 임시 자리표시 문단입니다.',
			'저는 Daniel Kim입니다. AI가 지식을 관리하고, 반복 작업을 자동화하며, 기계가 읽을 수 있는 기술 문서를 만드는 방식을 다룹니다. (TODO(daniel): 문체 다듬기)',
		],
	},
} as const;

// Grouped skills / focus areas for the About page (PRD §6.2). Items are drawn
// from Daniel's actual background (bio §13.1) — not invented. Group labels are
// localized; technical proper nouns stay as-is.
export const ABOUT_SKILLS = {
	en: [
		{ group: 'Product', items: ['Product Ownership', 'Product Management', 'Developer Relations', 'Roadmapping'] },
		{ group: 'Domain', items: ['OTT / Streaming', 'DRM / Content Security', 'Anti-Piracy', 'Watermarking'] },
		{ group: 'Technical', items: ['C / C++', 'Java', 'Cloud / SaaS', 'Technical Documentation'] },
		{ group: 'AI', items: ['AI Knowledge Management', 'LLM Tooling', 'Agent-Ready Docs', 'Automation'] },
	],
	ko: [
		{ group: '제품', items: ['프로덕트 오너십', '프로덕트 매니지먼트', '개발자 관계 (DevRel)', '로드맵 수립'] },
		{ group: '도메인', items: ['OTT·스트리밍', 'DRM·콘텐츠 보안', '안티파이러시', '워터마킹'] },
		{ group: '기술', items: ['C / C++', 'Java', '클라우드 / SaaS', '기술 문서'] },
		{ group: 'AI', items: ['AI 지식 관리', 'LLM 도구', '에이전트 준비 문서', '자동화'] },
	],
} as const;
