import { test, expect } from '@playwright/test';

/**
 * Stage 27 — portfolio detail pages (/portfolio/<slug>/ + /ko/). Each entry gets
 * a crawlable page rendering the frontmatter chrome + body + links. Portfolio
 * cards and tag-archive titles now link into these routes; EN/KO pair by shared
 * slug (no translationKey).
 */

test('EN portfolio detail renders chrome, body links, and a back link', async ({ page }) => {
	await page.goto('/portfolio/whatifclassics/');

	await expect(page.locator('.pfd__title')).toBeVisible();
	// External project links are surfaced on the detail page.
	await expect(page.locator('.pfd__links a').first()).toBeVisible();
	// Back link returns to the portfolio index.
	await expect(page.locator('.pfd__back a')).toHaveAttribute('href', '/portfolio/');
});

test('portfolio card title links to the detail page', async ({ page }) => {
	await page.goto('/portfolio/');

	const firstTitle = page.locator('.pf-card__title a').first();
	await expect(firstTitle).toHaveAttribute('href', /^\/portfolio\/[^/]+\/$/);

	await firstTitle.click();
	await expect(page).toHaveURL(/\/portfolio\/[^/]+\/$/);
	await expect(page.locator('.pfd__title')).toBeVisible();
});

test('cross-language link navigates EN → KO at the same slug', async ({ page }) => {
	await page.goto('/portfolio/whatifclassics/');

	await page.locator('.pfd__xlang a').click();
	await expect(page).toHaveURL(/\/ko\/portfolio\/whatifclassics\/$/);
	await expect(page.locator('.pfd__title')).toBeVisible();
});

test('KO career detail has a localized back link and the About-timeline link', async ({ page }) => {
	await page.goto('/ko/portfolio/career/');

	await expect(page.locator('.pfd__back a')).toHaveAttribute('href', '/ko/portfolio/');
	// `category: career` entries surface a link into the About timeline.
	await expect(page.locator('.pfd__timeline a')).toBeVisible();
});
