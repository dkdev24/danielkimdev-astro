// src/pages/portfolio/index.md.ts
// Plain-markdown sibling of the Portfolio index page for AI agents. Mirrors the
// page's two sections (career work / side projects) from the EN collection.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { getPortfolioGroup, getPortfolioSlug } from '../../utils/portfolio';

export const GET: APIRoute = async ({ site }) => {
	const items = (await getCollection('portfolio', (e) => e.data.lang === 'en')).sort(
		(a, b) => (a.data.order ?? 99) - (b.data.order ?? 99),
	);
	const list = (group: 'career' | 'side') =>
		items
			.filter((e) => getPortfolioGroup(e.data.category) === group)
			.map((e) => {
				const url = new URL(`/portfolio/${getPortfolioSlug(e.id).replace(/\.mdx?$/, '')}.md`, site).href;
				return `- [${e.data.title}](${url}): ${e.data.summary}`;
			})
			.join('\n');

	const content = `---
title: "Portfolio — Daniel Kim"
description: "Career work in content security, developer relations, and agent-ready docs — plus personal side projects."
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# Portfolio

## Career work

Products, docs, and developer programs owned at DoveRunner (formerly PallyCon).

${list('career')}

## Side projects

Personal builds — experiments in AI, knowledge management, and games, made in public.

${list('side')}
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
