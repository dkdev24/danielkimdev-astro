// src/pages/portfolio/index.md.ts
// Plain-markdown sibling of the Portfolio index page for AI agents.
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const content = `---
title: "Portfolio — Daniel Kim"
description: "Work history and projects — media tech (OTT/DRM/streaming), AI knowledge work, and developer relations."
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# Portfolio

Work history and projects across media tech, AI knowledge work, and developer relations.

## Categories

- **Content Security** — multi-DRM and forensic watermarking for OTT/streaming
- **OTT Streaming** — product work across the streaming stack
- **AI Knowledge Work** — experiments in AI-assisted knowledge management and agent-ready documentation
- **Developer Relations** — technical writing, documentation, conference talks
- **Side Projects** — building in public

See [llms.txt](/llms.txt) for a complete, machine-readable index of all portfolio items with descriptions and direct markdown links.
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
