// src/pages/ko/portfolio/index.md.ts
// KO plain-markdown sibling of the Portfolio index page (/ko/portfolio/index.md).
import type { APIRoute } from 'astro';
import { portfolioIndexMarkdown } from '../../portfolio/index.md';

export const GET: APIRoute = async ({ site }) =>
	new Response(await portfolioIndexMarkdown('ko', site), {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
