// Astro's markdown pipeline runs remark-smartypants by default, curling straight
// quotes/apostrophes and collapsing "..." on rendered HTML. The plain-markdown
// .md.ts siblings serve doc.body untouched, so agents diffing markdown against
// HTML see every quote/apostrophe as a mismatch. Mirror that transform here so
// the two stay in parity — skips fenced/inline code so snippets aren't touched.
export function smartQuotes(markdown: string): string {
	return markdown
		.split(/(```[\s\S]*?```|`[^`]*`)/)
		.map((chunk, i) =>
			i % 2 === 1
				? chunk
				: chunk
						.replace(/(^|[\s([{—-])"/g, '$1“')
						.replace(/"/g, '”')
						.replace(/(^|[\s([{—-])'/g, '$1‘')
						.replace(/'/g, '’')
						.replace(/\.\.\./g, '…')
		)
		.join('');
}
