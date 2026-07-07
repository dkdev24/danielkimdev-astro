// src/pages/index.md.ts
// Plain-markdown sibling of the Home page for AI agents.
// Serves static descriptive content since the home page has no content collection entry.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
	const content = `---
title: "Daniel Kim"
description: "Personal site and blog by Daniel Kim — AI for knowledge work, media tech (OTT/DRM/streaming), and building in public."
---
> For the complete index of all posts and pages, see [llms.txt](/llms.txt).

# Daniel Kim

Personal site and blog by Daniel Kim — independent researcher and builder working on AI for knowledge work, media tech (OTT/DRM/streaming), and building in public.

## What I work on

- **AI for knowledge work** — using AI to capture, organise, and surface knowledge from a decade of domain experience
- **Media tech / OTT / DRM** — 11+ years in content security, multi-DRM, streaming, and developer relations
- **Building in public** — documenting the process of building this digital garden as a public series

## Where to go

- [Blog](/blog/) — writing on AI knowledge management, automation, and agent-ready documentation
- [Portfolio](/portfolio/) — work history and projects
- [About](/about/) — background and what I'm working on
- [llms.txt](/llms.txt) — complete index of all pages on this site (machine-readable)
`;

	return new Response(content, {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
