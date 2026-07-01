import { test, expect } from '@playwright/test';

/**
 * Stage 30 — post series / collections. A `series` post gets a badge + hub
 * link on its own page; the hub (`/blog/series/<slug>/`) lists all parts
 * forward-ordered; `/blog/series/` is the peer discovery index. Series-scoped
 * prev/next only renders when an adjacent part actually exists — today's only
 * series post (agent-readiness) is a lone part, so that nav should be absent.
 */

test('EN post with a series shows the badge and links to its hub; no prev/next yet', async ({
	page,
}) => {
	await page.goto('/blog/agent-readiness/');

	const badge = page.locator('.post__series a');
	await expect(badge).toBeVisible();
	await expect(badge).toHaveText(/Part 1 of 1/);
	await expect(badge).toHaveAttribute('href', '/blog/series/agent-readiness/');

	// Single published part — the series-scoped prev/next block must be absent.
	await expect(page.locator('.post__series-nav')).toHaveCount(0);
});

test('EN series hub lists the part and links back to the series index', async ({ page }) => {
	await page.goto('/blog/series/agent-readiness/');

	await expect(page.locator('.archive__head h1')).toContainText('Agent Readiness for Tech Docs');
	await expect(page.locator('.series-item').first()).toBeVisible();
	await expect(page.locator('.series-item__title a').first()).toHaveAttribute(
		'href',
		/^\/blog\/[^/]+\/$/,
	);
	await expect(page.locator('.archive__back a')).toHaveAttribute('href', '/blog/series/');
});

test('EN series index lists the registered series and links to its hub', async ({ page }) => {
	await page.goto('/blog/series/');

	await expect(page.locator('.archive__head h1')).toContainText('All series');
	const link = page.locator('.series-index-item__title a').first();
	await link.click();
	await expect(page).toHaveURL(/\/blog\/series\/[^/]+\/$/);
});

test('blog index surfaces an "All series" link to the hub', async ({ page }) => {
	await page.goto('/blog/');

	const link = page.locator('.blog__series-link a');
	await expect(link).toBeVisible();
	await link.click();
	await expect(page).toHaveURL('/blog/series/');
});

test('KO series hub renders the localized title', async ({ page }) => {
	await page.goto('/ko/blog/series/agent-readiness/');
	await expect(page.locator('.archive__head h1')).toContainText('기술 문서의 에이전트 준비도');
	await expect(page.locator('.archive__back a')).toHaveAttribute('href', '/ko/blog/series/');
});
