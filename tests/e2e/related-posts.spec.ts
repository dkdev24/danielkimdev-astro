import { test, expect } from '@playwright/test';

/**
 * Stage 31 — related posts. A static, same-locale "Related posts" block
 * ranked by shared tags, excluding same-series siblings (covered by Stage 30's
 * series nav instead). `astro dev` includes the draft placeholder fixtures
 * (Stage 24-26) unlike prod, so assertions check for known real-post links
 * being present/absent rather than exact totals, which draft volume would skew.
 */

test('EN post surfaces a tag-sharing sibling, excludes itself', async ({ page }) => {
	await page.goto('/blog/agent-readiness/');

	const related = page.locator('.post__related-list .post__related-title a');
	await expect(related.first()).toBeVisible();
	// ep1 shares the ai-llm tag with agent-readiness — must appear.
	await expect(page.locator('.post__related-list a[href="/blog/building-llm-pkm-in-public-ep1/"]')).toBeVisible();
	// A post never lists itself as related.
	await expect(page.locator('.post__related-list a[href="/blog/agent-readiness/"]')).toHaveCount(0);
});

test('EN post with no tag-sharing real siblings excludes an unrelated real post', async ({
	page,
}) => {
	await page.goto('/blog/welcome-digital-garden/');

	// Shares "pkm" with ep1 — must appear.
	await expect(
		page.locator('.post__related-list a[href="/blog/building-llm-pkm-in-public-ep1/"]'),
	).toBeVisible();
	// No shared tags with agent-readiness — must not appear in the related block
	// (it may still appear elsewhere on the page via the chronological pagination nav).
	await expect(page.locator('.post__related-list a[href="/blog/agent-readiness/"]')).toHaveCount(0);
});

test('related links stay same-locale (no cross-language links in the block)', async ({ page }) => {
	await page.goto('/blog/agent-readiness/');

	const hrefs = await page.locator('.post__related-list .post__related-title a').evaluateAll(
		(els) => els.map((el) => el.getAttribute('href')),
	);
	for (const href of hrefs) {
		expect(href).toMatch(/^\/blog\//);
	}
});

test('KO post renders the localized "Related posts" heading and same-locale links', async ({
	page,
}) => {
	await page.goto('/ko/blog/agent-readiness/');

	await expect(page.locator('.post__related-heading')).toHaveText('관련 글');
	await expect(
		page.locator('.post__related-list a[href="/ko/blog/building-llm-pkm-in-public-ep1/"]'),
	).toBeVisible();
});
