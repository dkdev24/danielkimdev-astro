import assert from 'node:assert';
import { parseItems, buildEmail } from './index.js';

const xml = `<rss><channel><item><title><![CDATA[A &amp; B]]></title><link>https://x.com/a/</link><description>Hi &lt;3</description><enclosure url="https://x.com/i.png?a=1&amp;b=2" length="0" type="image/png"/></item><item><title>C</title><link>https://x.com/c/</link></item></channel></rss>`;
const [a, c] = parseItems(xml);
assert.deepStrictEqual(a, { title: 'A & B', link: 'https://x.com/a/', description: 'Hi <3', pubDate: '', image: 'https://x.com/i.png?a=1&b=2' });
assert.strictEqual(c.description, '');
assert.strictEqual(c.image, '');
console.log('ok');

const html = buildEmail({ title: 'A & B', link: 'https://x.com/a/', description: 'Hi <3', pubDate: 'Mon, 26 Oct 2026 00:00:00 GMT' }, 'en', 'https://x.com/i.png');
assert.ok(html.includes('{{ unsubscribe_url }}') && html.includes('{{ address }}'), 'footer tags kept');
assert.ok(html.includes('A &amp; B') && html.includes('October 26') && html.includes('https://x.com/i.png'));
assert.ok(!html.includes('%%'), 'no placeholder left');
console.log('ok email');
