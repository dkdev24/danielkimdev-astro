// Wraps a blog post's "what you'll get" opener in <div class="post-summary">
// (styled as a highlighted card in global.css). The opener starts at a paragraph
// that is only a bold label and ends at the paragraph starting with the closing
// bold label. Posts stay plain markdown; no hand-written HTML needed.
const START = /^(what you['’]ll get\b|이 글에서 얻을 수 있는 것)/i;
const END = /^(keep in mind|유의할 점)/i;

// Text of a paragraph when it opens with a bold label, else null.
function strongLead(node) {
	if (node.type !== 'paragraph') return null;
	const first = node.children?.[0];
	if (first?.type !== 'strong') return null;
	return first.children?.map((c) => c.value ?? '').join('').trim() ?? null;
}

export default function remarkPostSummary() {
	return (tree, file) => {
		const nodes = tree.children;
		const start = nodes.findIndex((n) => START.test(strongLead(n) ?? ''));
		if (start === -1) return;
		const end = nodes.findIndex((n, i) => i > start && END.test(strongLead(n) ?? ''));
		if (end === -1) {
			console.warn(
				`[remark-post-summary] ${file.path}: found a "what you'll get" opener but no closing "Keep in mind" paragraph; card not applied.`
			);
			return;
		}
		const card = {
			type: 'post-summary',
			data: { hName: 'div', hProperties: { className: ['post-summary'] } },
			children: nodes.slice(start, end + 1),
		};
		nodes.splice(start, end - start + 1, card);
	};
}
