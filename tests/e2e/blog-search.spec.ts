import { test, expect } from '@playwright/test';

/**
 * Stage 25 — blog client-side search. Runs against `astro dev`, where the draft
 * placeholders are visible (10 + 2 real = 12 per locale). Search is a substring
 * match over each post's title + summary + tag keys/labels, ANDed with the tag
 * filter and windowed by the Stage-24 pager. The box ships hidden and is revealed
 * by the controller (progressive enhancement). "garden" and "readiness" appear
 * only in the two real posts, so they make reliable narrowing probes.
 */

const visible = '.blog-item:not([hidden])';

test('search box is revealed and narrows results', async ({ page }) => {
	await page.goto('/blog/');

	const input = page.locator('.blog-search__input');
	await expect(input).toBeVisible();

	// "garden" matches only "why this digital garden exists".
	await input.fill('garden');
	await expect(page.locator(visible)).toHaveCount(1);
	await expect(page.locator(visible)).toContainText('digital garden', { ignoreCase: true });
});

test('no-match query shows the no-results message; clear restores the list', async ({ page }) => {
	await page.goto('/blog/');
	const input = page.locator('.blog-search__input');
	const clear = page.locator('.blog-search__clear');

	await input.fill('zzqxnotapost');
	await expect(page.locator(visible)).toHaveCount(0);
	await expect(page.locator('.blog-noresults')).toBeVisible();
	await expect(clear).toBeVisible();

	// Clear resets the query and restores the (windowed) list.
	await clear.click();
	await expect(input).toHaveValue('');
	await expect(page.locator('.blog-noresults')).toBeHidden();
	await expect.poll(async () => page.locator(visible).count()).toBeGreaterThan(0);
});

test('search composes with the tag filter (AND)', async ({ page }) => {
	await page.goto('/blog/');

	// Filter to the real "agent-readiness" post's tag, then a query that excludes
	// it — the AND of the two predicates yields zero, not the filtered set.
	await page.locator('.blog-search__input').fill('readiness');
	await expect(page.locator(visible)).toHaveCount(1);
	await page.locator('.blog-search__input').fill('readiness zzqx');
	await expect(page.locator(visible)).toHaveCount(0);
	await expect(page.locator('.blog-noresults')).toBeVisible();
});

test('KO blog search works against localized content', async ({ page }) => {
	await page.goto('/ko/blog/');
	const input = page.locator('.blog-search__input');
	await expect(input).toBeVisible();

	// "가든" appears in the KO digital-garden post title.
	await input.fill('가든');
	await expect(page.locator(visible)).toHaveCount(1);
});
