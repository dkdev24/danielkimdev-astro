import { test, expect } from '@playwright/test';

/**
 * Stage 24 — blog load-more pagination. Runs against `astro dev`, where the
 * draft placeholder posts are visible (10 + 3 real = 13 per locale), so the
 * pager actually triggers. The controller caps the visible window at PAGE_SIZE
 * (6) and a "Load more" button reveals the next batch; it composes with the tag
 * filter (changing the filter resets the pager).
 */

const PAGE_SIZE = 6;
const TOTAL_POSTS = 13;
const visible = '.blog-item:not([hidden])';

test('EN blog index paginates with load-more', async ({ page }) => {
	await page.goto('/blog/');

	// First page: exactly PAGE_SIZE visible, button + status shown.
	await expect(page.locator(visible)).toHaveCount(PAGE_SIZE);
	const loadMore = page.locator('#blog-load-more');
	await expect(loadMore).toBeVisible();
	await expect(page.locator('.blog-more__status')).toContainText('6');

	// Load more reveals PAGE_SIZE more per click (13 total in dev) — two clicks
	// needed since 13 isn't an exact multiple of 6 — and the button disappears
	// once every post is shown.
	await loadMore.click();
	await expect(page.locator(visible)).toHaveCount(PAGE_SIZE * 2);
	await loadMore.click();
	await expect(page.locator(visible)).toHaveCount(TOTAL_POSTS);
	await expect(loadMore).toBeHidden();
});

test('changing the tag filter resets the pager', async ({ page }) => {
	await page.goto('/blog/');
	await page.locator('#blog-load-more').click();
	await page.locator('#blog-load-more').click();
	await expect(page.locator(visible)).toHaveCount(TOTAL_POSTS);

	// Pick the first real tag chip (not "All"); the window resets, so the visible
	// count is capped at PAGE_SIZE again (a tag may match fewer, never more).
	await page.locator('.blog-filters [data-filter]:not([data-filter="all"])').first().click();
	await expect
		.poll(async () => page.locator(visible).count())
		.toBeLessThanOrEqual(PAGE_SIZE);
});
