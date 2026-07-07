// src/pages/blog/index.md.ts
// Plain-markdown sibling of the Blog index page for AI agents.
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const content = `---
title: "Blog — Daniel Kim"
description: "Writing on AI for knowledge work, automation, agent-ready documentation, and building in public."
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# Blog

Writing on AI for knowledge work, automation, agent-ready documentation, and building in public.

## Series

- [Building LLM-PKM in Public](/blog/series/building-llm-pkm-in-public/) — documenting the process of building a personal LLM-powered knowledge base from a decade of domain expertise
- [Agent Readiness](/blog/series/agent-readiness/) — writing docs that AI agents can actually use

## All posts

See [llms.txt](/llms.txt) for a complete, machine-readable index of all posts with descriptions and direct markdown links.
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
