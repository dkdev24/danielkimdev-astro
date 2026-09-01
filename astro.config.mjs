// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { toonstrip } from '@toonstrip/astro';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Locked: production domain (Cloudflare Registrar). Drives canonical URLs, sitemap, RSS.
	site: 'https://danielkimdev.com',

	// Static site (no SSR) — deployed to Cloudflare Pages as prebuilt assets (PRD §10.1).
	output: 'static',

	// Locked (HANDOFF / PRD §5, §7.1): English (default) at root with NO /en/ prefix;
	// Korean under /ko/.
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'ko'],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	// Markdown / MDX code highlighting (Stage 12). Dual Shiki themes: github-light
	// for light mode, github-dark swapped in via CSS under [data-theme="dark"]
	// (see global.css). `wrap` avoids horizontal scroll on long lines. The
	// transformer stamps each <pre> with `data-language` so the CodeCopy enhancer
	// can show a language label.
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			wrap: true,
			transformers: [
				{
					name: 'data-language',
					pre(node) {
						if (this.options.lang) node.properties['data-language'] = this.options.lang;
					},
				},
			],
		},
	},

	integrations: [
		mdx(),
		// Embeds a live toonstrip <ComicStrip> in the grues-in-comic-beta post.
		toonstrip({ packs: ['@toonstrip/pack-comic-chat'] }),
		// Emit hreflang alternates so EN/KO pages cross-reference each other for SEO.
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en', ko: 'ko' },
			},
		}),
	],

	// Locked font system (PRD §7.6 / DESIGN-minimax.md §3).
	// Latin/UI: DM Sans (body/UI), Outfit (display), Poppins (mid-tier), Roboto (data).
	// Korean: Pretendard. Preload the primary body fonts (DM Sans EN, Pretendard KO)
	// in the layout via the <Font /> component.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'DM Sans',
			cssVariable: '--font-dm-sans',
			weights: [400, 500, 700],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Outfit',
			cssVariable: '--font-outfit',
			weights: [400, 600, 700],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Poppins',
			cssVariable: '--font-poppins',
			weights: [500, 600],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Roboto',
			cssVariable: '--font-roboto',
			weights: [400, 500],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		{
			// Pretendard is served via Fontsource; Noto Sans KR is the system fallback.
			provider: fontProviders.fontsource(),
			name: 'Pretendard',
			cssVariable: '--font-pretendard',
			weights: [400, 500, 700],
			subsets: ['latin', 'korean'],
			fallbacks: ['Noto Sans KR', 'sans-serif'],
			display: 'swap',
		},
		// Cobalt pilot (homepage only, 2026-08-26): Space Grotesk / Inter / JetBrains
		// Mono. Scoped to the homepage's .cobalt-pilot wrapper — additive, does not
		// replace the locked font system above.
		{
			provider: fontProviders.google(),
			name: 'Space Grotesk',
			cssVariable: '--font-space-grotesk',
			weights: [500, 600],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: [400, 500],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			weights: [400, 500],
			subsets: ['latin'],
			fallbacks: ['monospace'],
			optimizedFallbacks: true,
			display: 'swap',
		},
		// Aurora dark theme (2026-08-26): Sentient is Fontshare-only and can't be
		// self-served via the Google/Fontsource providers wired here, so Fraunces
		// stands in as the closest free warm contemporary serif for display + body.
		{
			provider: fontProviders.google(),
			name: 'Fraunces',
			cssVariable: '--font-fraunces',
			weights: [400, 500, 600],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
			optimizedFallbacks: true,
			display: 'swap',
		},
	],
});
