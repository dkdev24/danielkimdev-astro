import { test, expect } from '@playwright/test';

/**
 * Minimal smoke test: confirms the core bilingual routes render.
 * Assertions are kept generic (status + title + a visible heading) so they
 * survive copy changes; tighten them per-page when testing specific features.
 */

test('EN homepage renders', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(/.+/);
	await expect(page.locator('h1').first()).toBeVisible();
});

test('KO homepage renders', async ({ page }) => {
	const response = await page.goto('/ko/');
	expect(response?.status()).toBe(200);
	await expect(page.locator('html')).toHaveAttribute('lang', /ko/);
	await expect(page.locator('h1').first()).toBeVisible();
});

test('blog index renders', async ({ page }) => {
	const response = await page.goto('/blog/');
	expect(response?.status()).toBe(200);
	await expect(page.locator('h1').first()).toBeVisible();
});
