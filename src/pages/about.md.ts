// src/pages/about.md.ts
// Plain-markdown sibling of the About page for AI agents.
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const content = `---
title: "About — Daniel Kim"
description: "Background, career, and what Daniel Kim works on — AI for knowledge work, media tech, and building in public."
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# About Daniel Kim

11+ years in media tech — from C/C++ and Java development to product management and developer relations in the OTT and DRM space. Now an independent researcher and builder focused on AI for knowledge work.

## Background

- Owned multi-DRM and forensic-watermarking products (PallyCon SaaS) at DoveRunner for global OTT customers
- Developer-facing technical writing, documentation, and conference talks in media tech
- Currently exploring AI-assisted personal knowledge management and agent-ready documentation

## What I'm building now

A public experiment in using AI to organise a decade of domain knowledge — documented in the [Building LLM-PKM in Public](/blog/series/building-llm-pkm-in-public/) series.

## Links

- [Blog](/blog/) — writing and series
- [Portfolio](/portfolio/) — work history
- [llms.txt](/llms.txt) — complete site index
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
