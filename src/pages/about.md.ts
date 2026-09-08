// src/pages/about.md.ts
// Plain-markdown sibling of the About page for AI agents. Built from the same
// data (ABOUT / ABOUT_SKILLS / timeline collection) as AboutPage.astro so the
// two can't drift out of parity.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { ABOUT, ABOUT_SKILLS } from '../data/about';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../consts';

export const GET: APIRoute = async () => {
	const bio = ABOUT.en.bio;
	const skills = ABOUT_SKILLS.en;
	const timeline = (
		await getCollection('timeline', (e) => e.data.lang === 'en')
	).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));

	const lines: string[] = [
		'---',
		'title: "About — Daniel Kim"',
		'description: "Background, career, and what Daniel Kim works on — AI for knowledge work, media tech, and building in public."',
		'---',
		'> For the complete index of all posts and pages, see [llms.txt](/llms.txt).',
		'',
		'# About Daniel Kim',
		'',
		...bio,
		'',
		'## Skills & focus',
		'',
	];

	for (const g of skills) {
		lines.push(`### ${g.group}`, '', ...g.items.map((item) => `- ${item}`), '');
	}

	if (timeline.length > 0) {
		lines.push('## Career timeline', '');
		for (const entry of timeline) {
			lines.push(
				`### ${entry.data.role} · ${entry.data.org}`,
				'',
				`${entry.data.start} – ${entry.data.end}`,
				'',
				entry.data.summary,
				''
			);
		}
	}

	lines.push(
		'## Get in touch',
		'',
		`- Email: ${CONTACT_EMAIL}`,
		`- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
		'',
		'## Links',
		'',
		'- [Blog](/blog/) — writing and series',
		'- [Portfolio](/portfolio/) — work history',
		'- [llms.txt](/llms.txt) — complete site index',
	);

	return new Response(lines.join('\n') + '\n', {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
