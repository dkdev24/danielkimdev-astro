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
			'I come at this from a deep technical career: 11+ years building in C/C++ and Java, then moving from writing code to shaping products in media & entertainment technology — OTT/streaming and DRM/content security. Currently at DoveRunner in two roles: Developer Advocate (developer docs, technical writing, conference talks) and Product Owner for the Platform Ops team, which owns the consolidated customer console, internal admin, and the backend systems tying together DRM, Watermarking, and App Security.',
			'That background is the point: years of shipping and explaining complex systems and documentation in a hard domain are exactly what keep my take on AI concrete rather than generic.',
			'This site is my digital garden — notes, essays, and experiments from that work, and a record of building toward an independent, solopreneur future.',
		],
	},
	ko: {
		// 초안 (2026-06-28, 프로필 기반). 합쇼체, em-dash 금지. TODO(daniel): 원하면
		// 본인 문체로 다듬으세요. 핵심 줄기: 메인은 AI 기반 지식 작업(지식 관리, 자동화,
		// 기술 문서의 에이전트 준비도), 경력은 신뢰의 토대.
		bio: [
			'저는 Daniel Kim입니다. AI가 지식을 다루는 방식, 즉 지식 관리와 반복 업무 자동화, 그리고 사람뿐 아니라 기계도 활용할 수 있는 기술 문서를 만드는 일에 집중하고 있습니다.',
			'이 관심은 오랜 기술 경력에서 출발했습니다. C/C++와 Java로 11년 넘게 개발을 하다가 코드를 작성하는 일에서 제품을 만드는 일로 옮겨 갔습니다. 미디어·엔터테인먼트 기술 분야에서 OTT·스트리밍과 DRM·콘텐츠 보안을 중심으로 프로덕트 매니지먼트와 개발자 관계 업무를 담당했습니다. 현재 DoveRunner에서 두 가지 역할을 맡고 있습니다. 디벨로퍼 애드보킷으로서 개발자 문서 사이트 운영과 콘퍼런스 발표를 맡고, 플랫폼 옵스 팀의 프로덕트 오너로서 DRM·워터마킹·앱 보안에 걸친 통합 고객 콘솔과 내부 어드민, 백엔드 시스템의 요구사항과 릴리스 계획을 관리합니다.',
			'이 배경이 핵심입니다. 까다로운 분야에서 복잡한 시스템과 문서를 오랫동안 만들고 설명해 온 경험이, AI에 대한 제 시각을 일반론이 아니라 구체적인 이야기로 만들어 줍니다.',
			'이 사이트는 제 디지털 가든입니다. 그 일에서 얻은 메모와 에세이, 실험을 기록하고 독립적인 1인 사업가로 나아가는 과정을 담습니다.',
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
