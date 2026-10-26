// Hourly: for each feed, draft a Kit broadcast per new post. First run only seeds KV (no drafts).
import TEMPLATE from './email-template.js';

const KIT = 'https://api.kit.com/v4/broadcasts';
const TAG = { en: 25037510, ko: 25037511 }; // Kit tags lang-en / lang-ko
const FORM = { en: 10097710, ko: 10098381 }; // one Kit form per language; the form a subscriber joined decides the tag

const unesc = (s) =>
	s.replace(/^<!\[CDATA\[|\]\]>$/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function parseItems(xml) {
	return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, b]) => {
		const tag = (t) => unesc((b.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) || [, ''])[1].trim());
		return { title: tag('title'), link: tag('link'), description: tag('description'), pubDate: tag('pubDate'),
			image: unesc((b.match(/<enclosure[^>]*url="([^"]+)"/) || [, ''])[1]) };
	}).filter((i) => i.title && i.link);
}

const P = 'font-family:-apple-system,BlinkMacSystemFont,Roboto,sans-serif;font-size:18px;color:#000000;font-weight:400;line-height:1.5';

// Fills the My Escape skeleton. Kit takes the whole email as `content`, footer and unsubscribe link included.
export function buildEmail(p, lang, image) {
	const ko = lang === 'ko';
	const date = p.pubDate && !isNaN(Date.parse(p.pubDate))
		? new Date(p.pubDate).toLocaleDateString(ko ? 'ko-KR' : 'en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
		: '';
	const img = `<img src="${esc(image)}" alt="${esc(p.title)}" width="568" style="display:block;width:100%;max-width:568px;height:auto;margin:0 0 24px 0"/>`;
	const body = `<p style="${P}">${esc(p.description)}</p><p style="${P}"><a href="${esc(p.link)}" style="color:#0000ff">${ko ? '글 읽기' : 'Read the post'}</a></p>`;
	return TEMPLATE.replace('%%DATE%%', () => date).replace('%%TITLE%%', () => esc(p.title))
		.replace('%%IMAGE%%', () => img).replace('%%BODY%%', () => body);
}

async function kitIds(env, path) {
	const ids = [];
	for (let after = ''; ; ) {
		const res = await fetch(`https://api.kit.com${path}&per_page=500${after}`, { headers: { 'X-Kit-Api-Key': env.KIT_API_KEY } });
		if (!res.ok) throw new Error(`Kit ${res.status} ${path}`);
		const { subscribers, pagination } = await res.json();
		ids.push(...subscribers.map((s) => s.id));
		if (!pagination.has_next_page) return ids;
		after = `&after=${pagination.end_cursor}`;
	}
}

// Free Kit plans have no automations, so tag here: whoever joined the KO form gets lang-ko, the EN form lang-en.
// Subscribers who already have either tag are left alone (manual choices win). Unconfirmed ones appear once they confirm.
export async function tagByForm(env) {
	const tagged = new Set((await Promise.all(Object.values(TAG).map((t) => kitIds(env, `/v4/tags/${t}/subscribers?status=all`)))).flat());
	for (const lang of Object.keys(FORM)) {
		for (const id of await kitIds(env, `/v4/forms/${FORM[lang]}/subscribers?status=all`)) {
			if (tagged.has(id)) continue;
			const res = await fetch(`https://api.kit.com/v4/tags/${TAG[lang]}/subscribers/${id}`, { method: 'POST', headers: { 'X-Kit-Api-Key': env.KIT_API_KEY } });
			if (!res.ok) throw new Error(`Kit tag ${res.status} for ${id}`);
			tagged.add(id);
		}
	}
}

async function draft(env, p, lang) {
	const image = p.image || env.DEFAULT_THUMB;
	const res = await fetch(KIT, {
		method: 'POST',
		headers: { 'X-Kit-Api-Key': env.KIT_API_KEY, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			subject: p.title,
			content: buildEmail(p, lang, image),
			public: false,
			subscriber_filter: [{ all: [{ type: 'tag', ids: [TAG[lang]] }] }], // only that language's subscribers
			email_template_id: 5639223, // My Escape (saved copy of Escape; the stock one 422s until migrated)
			thumbnail_url: image,
			thumbnail_alt: p.title,
		}),
	});
	if (!res.ok) throw new Error(`Kit ${res.status}: ${await res.text()}`);
}

export default {
	async scheduled(_event, env) {
		try { await tagByForm(env); } catch (e) { console.error(`tagByForm: ${e.message}`); } // never block drafting
		for (const feed of env.FEEDS.split(',')) {
			const res = await fetch(feed);
			if (!res.ok) { console.error(`feed ${feed}: ${res.status}`); continue; }
			const items = parseItems(await res.text());
			const key = `seen:${feed}`;
			const stored = await env.SEEN.get(key, 'json');
			const seen = new Set(stored ?? items.map((i) => i.link)); // ponytail: first run seeds only
			const fresh = items.filter((i) => !seen.has(i.link));
			// Record each link only after its draft succeeds, so a Kit failure retries next hour.
			for (const p of fresh.reverse()) {
				await draft(env, p, feed.includes('/ko/') ? 'ko' : 'en');
				seen.add(p.link);
				await env.SEEN.put(key, JSON.stringify([...seen]));
			}
			if (!stored) await env.SEEN.put(key, JSON.stringify([...seen]));
		}
	},
};
