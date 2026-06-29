import { test, expect } from '@playwright/test';

/**
 * Stage 24 — blog load-more pagination. Runs against `astro dev`, where the
 * draft placeholder posts are visible (10 + 2 real = 12 per locale), so the
 * pager actually triggers. The controller caps the visible window at PAGE_SIZE
 * (6) and a "Load more" button reveals the next batch; it composes with the tag
 * filter (changing the filter resets the pager).
 */

const PAGE_SIZE = 6;
const visible = '.blog-item:not([hidden])';

test('EN blog index paginates with load-more', async ({ page }) => {
	await page.goto('/blog/');

	// First page: exactly PAGE_SIZE visible, button + status shown.
	await expect(page.locator(visible)).toHaveCount(PAGE_SIZE);
	const loadMore = page.locator('#blog-load-more');
	await expect(loadMore).toBeVisible();
	await expect(page.locator('.blog-more__status')).toContainText('6');

	// Load more reveals the rest (12 total in dev) and the button disappears.
	await loadMore.click();
	await expect(page.locator(visible)).toHaveCount(12);
	await expect(loadMore).toBeHidden();
});

test('changing the tag filter resets the pager', async ({ page }) => {
	await page.goto('/blog/');
	await page.locator('#blog-load-more').click();
	await expect(page.locator(visible)).toHaveCount(12);

	// Pick the first real tag chip (not "All"); the window resets, so the visible
	// count is capped at PAGE_SIZE again (a tag may match fewer, never more).
	await page.locator('.blog-filters [data-filter]:not([data-filter="all"])').first().click();
	await expect
		.poll(async () => page.locator(visible).count())
		.toBeLessThanOrEqual(PAGE_SIZE);
});
