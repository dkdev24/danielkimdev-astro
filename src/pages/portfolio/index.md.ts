// src/pages/portfolio/index.md.ts
// Plain-markdown sibling of the Portfolio index page for AI agents. Mirrors the
// page's two sections (career work / side projects) from the locale's collection.
// src/pages/ko/portfolio/index.md.ts reuses portfolioIndexMarkdown() for KO.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { getPortfolioGroup, getPortfolioSlug } from '../../utils/portfolio';
import ko from '../../i18n/ko.json';
import type { Lang } from '../../i18n/utils';

const LABELS = {
	en: {
		title: 'Portfolio — Daniel Kim',
		description: 'Career work in content security, developer relations, and agent-ready docs — plus personal side projects.',
		h1: 'Portfolio',
		career: 'Career work',
		careerIntro: 'Products, docs, and developer programs owned at DoveRunner (formerly PallyCon).',
		side: 'Side projects',
		sideIntro: 'Personal builds — experiments in AI, knowledge management, and games, made in public.',
	},
	ko: {
		title: `${ko.portfolio.title} | Daniel Kim`,
		description: ko.portfolio.intro,
		h1: ko.portfolio.title,
		career: ko.portfolio.groups.career,
		careerIntro: ko.portfolio.groups.careerIntro,
		side: ko.portfolio.groups.side,
		sideIntro: ko.portfolio.groups.sideIntro,
	},
} as const;

export async function portfolioIndexMarkdown(lang: Lang, site: URL | undefined) {
	const l = LABELS[lang];
	const prefix = lang === 'ko' ? '/ko' : '';
	const items = (await getCollection('portfolio', (e) => e.data.lang === lang)).sort(
		(a, b) => (a.data.order ?? 99) - (b.data.order ?? 99),
	);
	const list = (group: 'career' | 'side') =>
		items
			.filter((e) => getPortfolioGroup(e.data.category) === group)
			.map((e) => {
				const url = new URL(`${prefix}/portfolio/${getPortfolioSlug(e.id).replace(/\.mdx?$/, '')}.md`, site).href;
				return `- [${e.data.title}](${url}): ${e.data.summary}`;
			})
			.join('\n');

	return `---
title: "${l.title}"
description: "${l.description}"
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# ${l.h1}

## ${l.career}

${l.careerIntro}

${list('career')}

## ${l.side}

${l.sideIntro}

${list('side')}
`;
}

export const GET: APIRoute = async ({ site }) =>
	new Response(await portfolioIndexMarkdown('en', site), {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
