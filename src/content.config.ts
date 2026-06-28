import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Locale strategy (locked Stage 09): folder-by-locale (`blog/en/`, `blog/ko/`,
// `portfolio/en/`, `portfolio/ko/`) AND an explicit `lang` field on every entry.
// The redundancy is intentional — the folder keeps authoring organized while the
// field makes locale filtering explicit in queries and survives file moves.
const LANGS = ['en', 'ko'] as const;
const lang = z.enum(LANGS);

// ── Taxonomy (PRD §5, positioning locked 2026-06-27) ─────────────────────────
// Two SEPARATE tag enums. The blog leads on AI-for-knowledge-work; media-tech
// (DRM/OTT/cloud) is career credibility that lives in the portfolio only — so
// the media-tech tags are deliberately kept OUT of the blog enum and can never
// surface as a blog topic.
export const BLOG_TAGS = [
	'ai-knowledge-mgmt',
	'automation',
	'ai-ready-docs',
	'ai-llm',
	'pkm',
	'solopreneur',
] as const;

// Portfolio tags = the media-tech/career areas PLUS the blog tags, so an item
// that crosses over (e.g. an AI side-project in streaming) can carry both.
export const PORTFOLIO_TAGS = [
	'drm-content-security',
	'ott-streaming',
	'cloud-saas',
	...BLOG_TAGS,
] as const;

export const PORTFOLIO_CATEGORIES = ['product', 'talk-writing', 'side-ai', 'career'] as const;

export type Lang = (typeof LANGS)[number];
export type BlogTag = (typeof BLOG_TAGS)[number];
export type PortfolioTag = (typeof PORTFOLIO_TAGS)[number];
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

// ── Blog (PRD §9.1) ──────────────────────────────────────────────────────────
const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(), // SEO + excerpt fallback
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			lang,
			tags: z.array(z.enum(BLOG_TAGS)).default([]),
			draft: z.boolean().default(false),
			// Links the EN/KO versions of the same piece (PRD §7.4). A post needs
			// no counterpart; when one exists, both share the same translationKey.
			translationKey: z.string().optional(),
			heroImage: image().optional(),
			// OG image is a path string (resolved to an absolute URL in head, Stage 18),
			// not an optimized asset — social crawlers need a plain URL.
			ogImage: z.string().optional(),
		}),
});

// ── Portfolio (PRD §9.2) ─────────────────────────────────────────────────────
const portfolio = defineCollection({
	loader: glob({ base: './src/content/portfolio', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			role: z.string(),
			org: z.string().optional(),
			period: z.string(), // e.g. "2023–present"
			summary: z.string(),
			category: z.enum(PORTFOLIO_CATEGORIES),
			tags: z.array(z.enum(PORTFOLIO_TAGS)).default([]),
			lang,
			links: z
				.array(
					z.object({
						label: z.string(),
						url: z
							.string()
							.refine((u) => /^https?:\/\//.test(u), 'must be an absolute http(s) URL'),
					}),
				)
				.optional(),
			thumbnail: image().optional(),
			featured: z.boolean().default(false), // surfaces on Home
			order: z.number().optional(),
		}),
});

// ── Timeline (PRD §9.3) ──────────────────────────────────────────────────────
// A data collection (YAML/JSON) so the About page renders the career history
// dynamically. `lang` field + flat folder (no per-locale subfolders needed for
// a handful of data entries).
const timeline = defineCollection({
	loader: glob({ base: './src/content/timeline', pattern: '**/*.{json,yaml,yml}' }),
	schema: z.object({
		role: z.string(),
		org: z.string(),
		start: z.string(), // year or "YYYY-MM"
		end: z.string(), // year, "YYYY-MM", or "present"
		summary: z.string(),
		lang,
		order: z.number().optional(),
	}),
});

export const collections = { blog, portfolio, timeline };
