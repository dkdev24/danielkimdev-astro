// Hourly: for each feed, draft a Kit broadcast per new post. First run only seeds KV (no drafts).
const KIT = 'https://api.kit.com/v4/broadcasts';

const unesc = (s) =>
	s.replace(/^<!\[CDATA\[|\]\]>$/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function parseItems(xml) {
	return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, b]) => {
		const tag = (t) => unesc((b.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) || [, ''])[1].trim());
		return { title: tag('title'), link: tag('link'), description: tag('description'),
			image: unesc((b.match(/<enclosure[^>]*url="([^"]+)"/) || [, ''])[1]) };
	}).filter((i) => i.title && i.link);
}

async function draft(env, p) {
	const res = await fetch(KIT, {
		method: 'POST',
		headers: { 'X-Kit-Api-Key': env.KIT_API_KEY, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			subject: p.title,
			content: `<p>${esc(p.description)}</p><p><a href="${esc(p.link)}">${esc(p.title)}</a></p>`,
			public: false,
			email_template_id: 5639223, // My Escape (saved copy of Escape; the stock one 422s until migrated)
			thumbnail_url: p.image || env.DEFAULT_THUMB,
			thumbnail_alt: p.title,
		}),
	});
	if (!res.ok) throw new Error(`Kit ${res.status}: ${await res.text()}`);
}

export default {
	async scheduled(_event, env) {
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
				await draft(env, p);
				seen.add(p.link);
				await env.SEEN.put(key, JSON.stringify([...seen]));
			}
			if (!stored) await env.SEEN.put(key, JSON.stringify([...seen]));
		}
	},
};
