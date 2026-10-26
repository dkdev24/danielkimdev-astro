import assert from 'node:assert';
import { parseItems } from './index.js';

const xml = `<rss><channel><item><title><![CDATA[A &amp; B]]></title><link>https://x.com/a/</link><description>Hi &lt;3</description><enclosure url="https://x.com/i.png?a=1&amp;b=2" length="0" type="image/png"/></item><item><title>C</title><link>https://x.com/c/</link></item></channel></rss>`;
const [a, c] = parseItems(xml);
assert.deepStrictEqual(a, { title: 'A & B', link: 'https://x.com/a/', description: 'Hi <3', image: 'https://x.com/i.png?a=1&b=2' });
assert.strictEqual(c.description, '');
assert.strictEqual(c.image, '');
console.log('ok');
