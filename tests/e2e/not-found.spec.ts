import { test, expect } from '@playwright/test';

/**
 * Stage 23 — bilingual 404. One static 404.html is served for any unmatched
 * route; an inline script reveals the locale block matching the URL. We check
 * the EN default and the KO swap (content + <html lang>).
 */

test('EN 404 renders the English block', async ({ page }) => {
	const response = await page.goto('/this-route-does-not-exist');
	expect(response?.status()).toBe(404);
	const en = page.locator('.notfound__block[data-locale="en"]');
	await expect(en.locator('h1')).toBeVisible();
	await expect(page.locator('.notfound__block[data-locale="ko"]')).toBeHidden();
});

test('KO 404 swaps to the Korean block', async ({ page }) => {
	const response = await page.goto('/ko/this-route-does-not-exist');
	expect(response?.status()).toBe(404);
	await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
	await expect(page.locator('.notfound__block[data-locale="ko"]').locator('h1')).toBeVisible();
	await expect(page.locator('.notfound__block[data-locale="en"]')).toBeHidden();
});
