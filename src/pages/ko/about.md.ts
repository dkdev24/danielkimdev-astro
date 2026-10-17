// src/pages/ko/about.md.ts
// KO plain-markdown sibling of the About page (/ko/about.md).
import type { APIRoute } from 'astro';
import { aboutMarkdown } from '../about.md';

export const GET: APIRoute = async () =>
	new Response(await aboutMarkdown('ko'), {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
