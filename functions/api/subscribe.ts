// functions/api/subscribe.ts
// Newsletter signup. Posts the address to Kit's public form endpoint (so Kit still sends its
// double opt-in confirmation), then tags the subscriber lang-en / lang-ko through the Kit API
// so broadcasts can target one language. The Kit API key is a Pages secret (KIT_API_KEY).
//
// Free Kit plans have no automations, which is why tagging happens here.

// Minimal local slice of Cloudflare's PagesFunction type, same reason as _middleware.ts.
type PagesFunction = (context: { request: Request; env: { KIT_API_KEY?: string } }) => Promise<Response>;

type Lang = 'en' | 'ko';

// Separate forms so each language gets its own confirmation email. KO form uid b17854fea3.
const FORM_ID: Record<Lang, number> = { en: 10097710, ko: 10098381 };
const TAG_ID: Record<Lang, number> = { en: 25037510, ko: 25037511 }; // lang-en, lang-ko
const ALLOWED_ORIGINS = new Set(['https://danielkimdev.com', 'https://www.danielkimdev.com']);

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const onRequestPost: PagesFunction = async ({ request, env }) => {
	const origin = request.headers.get('Origin') ?? '';
	if (!ALLOWED_ORIGINS.has(origin) && !origin.endsWith('.pages.dev') && !origin.startsWith('http://localhost')) {
		return json({ ok: false }, 403);
	}
	const data = await request.formData();
	if (data.get('website')) return json({ ok: true }); // honeypot: bots fill it, people can't see it

	const email = String(data.get('email_address') ?? '').trim();
	const lang: Lang = data.get('lang') === 'ko' ? 'ko' : 'en';
	if (email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false }, 400);

	const signup = await fetch(`https://app.kit.com/forms/${FORM_ID[lang]}/subscriptions`, {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body: new URLSearchParams({ email_address: email }),
	});
	if (!signup.ok) return json({ ok: false }, 502);

	// Tag after the form call: the subscriber exists (unconfirmed) by now, and keeps the tag once confirmed.
	const tag = await fetch(`https://api.kit.com/v4/tags/${TAG_ID[lang]}/subscribers`, {
		method: 'POST',
		headers: { 'X-Kit-Api-Key': env.KIT_API_KEY ?? '', 'Content-Type': 'application/json' },
		body: JSON.stringify({ email_address: email }),
	});
	if (!tag.ok) console.error(`kit tag failed: ${tag.status}`); // signup still succeeded; fix the tag by hand
	return json({ ok: true });
};
