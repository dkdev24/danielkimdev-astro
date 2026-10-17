// src/pages/ko/blog/index.md.ts
// KO plain-markdown sibling of the Blog index page (/ko/blog/index.md).
// Intro and series text come from ko.json and data/series.ts, same as the KO page.
import type { APIRoute } from 'astro';
import ko from '../../../i18n/ko.json';
import { SERIES, SERIES_SLUGS } from '../../../data/series';

export const GET: APIRoute = () => {
	const series = SERIES_SLUGS.map(
		(slug) => `- [${SERIES[slug].title.ko}](/ko/blog/series/${slug}/): ${SERIES[slug].description.ko}`,
	).join('\n');

	const content = `---
title: "${ko.blog.title} | Daniel Kim"
description: "${ko.blog.intro}"
lang: "ko"
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# ${ko.blog.title}

${ko.blog.intro}

## 시리즈

${series}

## ${ko.blog.allPosts}

설명과 마크다운 링크가 포함된 전체 글 목록은 [llms.txt](/llms.txt)에서 확인할 수 있습니다.
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
