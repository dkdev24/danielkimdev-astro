// src/pages/ko/index.md.ts
// KO plain-markdown sibling of the Home page (/ko/index.md), built from the same
// locale data the KO home page uses (consts.ts, data/home.ts).
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION_BY_LOCALE } from '../../consts';
import { HOME_HERO } from '../../data/home';

export const GET: APIRoute = () => {
	const hero = HOME_HERO.ko;
	const content = `---
title: "Daniel Kim"
description: "${SITE_DESCRIPTION_BY_LOCALE.ko}"
lang: "ko"
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# Daniel Kim

${hero.tagline}

## 지금 다루는 주제

${hero.focusAreas.map((a) => `- ${a}`).join('\n')}

## 둘러보기

- [블로그](/ko/blog/): 지식 노동을 위한 AI, 자동화, 기술 문서의 에이전트 준비도에 대한 글
- [포트폴리오](/ko/portfolio/): 커리어 작업과 사이드 프로젝트
- [소개](/ko/about/): 배경과 경력
- [llms.txt](/llms.txt): 사이트 전체 페이지 목록 (기계 판독용)
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
