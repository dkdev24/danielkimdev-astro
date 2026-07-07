// src/pages/robots.txt.ts
// Robots policy + AI content signals for danielkimdev.com.
// Content-Signal: ai-train=no, search=yes, ai-input=yes
// Meaning: opt out of training data, allow search indexing, allow agent/RAG use.
import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}

# AI content signals
# ai-train: this site's content may not be used for LLM training data
# search: standard search-engine indexing is allowed
# ai-input: agents and RAG pipelines may read and use this content
Content-Signal: ai-train=no, search=yes, ai-input=yes
`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site);
	return new Response(getRobotsTxt(sitemapURL), {
		status: 200,
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
