// src/pages/about.md.ts
// Plain-markdown sibling of the About page for AI agents. Built from the same
// data (ABOUT / ABOUT_SKILLS / timeline collection) as AboutPage.astro so the
// two can't drift out of parity. src/pages/ko/about.md.ts reuses aboutMarkdown() for KO.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { ABOUT, ABOUT_SKILLS } from '../data/about';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../consts';
import ko from '../i18n/ko.json';
import type { Lang } from '../i18n/utils';

const LABELS = {
	en: {
		title: 'About — Daniel Kim',
		description: 'Background, career, and what Daniel Kim works on — AI for knowledge work, media tech, and building in public.',
		h1: 'About Daniel Kim',
		skills: 'Skills & focus',
		timeline: 'Career timeline',
		contact: 'Get in touch',
		links: [
			'- [Blog](/blog/) — writing and series',
			'- [Portfolio](/portfolio/) — work history',
			'- [llms.txt](/llms.txt) — complete site index',
		],
	},
	ko: {
		title: `${ko.about.title} | Daniel Kim`,
		description: 'Daniel Kim의 배경과 경력, 그리고 지금 다루고 있는 AI 기반 지식 작업을 소개합니다.',
		h1: `${ko.about.title}: Daniel Kim`,
		skills: ko.about.skillsTitle,
		timeline: ko.about.timeline,
		contact: ko.about.contact,
		links: [
			'- [블로그](/ko/blog/): 글과 시리즈',
			'- [포트폴리오](/ko/portfolio/): 커리어 작업과 사이드 프로젝트',
			'- [llms.txt](/llms.txt): 사이트 전체 목록',
		],
	},
} as const;

export async function aboutMarkdown(lang: Lang) {
	const l = LABELS[lang];
	const bio = ABOUT[lang].bio;
	const skills = ABOUT_SKILLS[lang];
	const timeline = (
		await getCollection('timeline', (e) => e.data.lang === lang)
	).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));

	const lines: string[] = [
		'---',
		`title: "${l.title}"`,
		`description: "${l.description}"`,
		'---',
		'> For the complete index of all posts and pages, see [llms.txt](/llms.txt).',
		'',
		`# ${l.h1}`,
		'',
		...bio.flatMap((p) => [p, '']), // blank line between paragraphs
		`## ${l.skills}`,
		'',
	];

	for (const g of skills) {
		lines.push(`### ${g.group}`, '', ...g.items.map((item) => `- ${item}`), '');
	}

	if (timeline.length > 0) {
		lines.push(`## ${l.timeline}`, '');
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
		`## ${l.contact}`,
		'',
		`- Email: ${CONTACT_EMAIL}`,
		`- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
		'',
		'## Links',
		'',
		...l.links,
	);

	return lines.join('\n') + '\n';
}

export const GET: APIRoute = async () =>
	new Response(await aboutMarkdown('en'), {
		status: 200,
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
