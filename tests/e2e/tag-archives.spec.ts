import { test, expect } from '@playwright/test';

/**
 * Stage 26 — tag/topic archive pages. One static page per taxonomy tag, per
 * collection, per locale: /blog/tags/<tag>/ and /portfolio/tags/<tag>/ (+ /ko/).
 * The blog index/portfolio page own the interactive filters; these are the
 * crawlable counterpart. Item tag chips link into the archive set.
 */

const item = '.archive-item';

test('EN blog tag archive lists posts and links back', async ({ page }) => {
	await page.goto('/blog/tags/pkm/');

	await expect(page.locator('.archive__head h1')).toContainText('PKM');
	await expect(page.locator(item).first()).toBeVisible();

	// Each post links to its detail page.
	await expect(page.locator('.archive-item__title a').first()).toHaveAttribute(
		'href',
		/^\/blog\/[^/]+\/$/,
	);

	// Back link returns to the full blog index.
	await expect(page.locator('.archive__back a')).toHaveAttribute('href', '/blog/');
});

test('tag chips cross-link between archives; current tag is marked', async ({ page }) => {
	await page.goto('/blog/tags/pkm/');

	// The chip for this archive's own tag is marked as the current page.
	await expect(page.locator('.archive-item__tags .tag[aria-current="page"]').first()).toBeVisible();

	// A different tag chip navigates to that tag's archive.
	const other = page
		.locator('.archive-item__tags a.tag:not([aria-current="page"])')
		.first();
	await other.click();
	await expect(page).toHaveURL(/\/blog\/tags\/[^/]+\/$/);
});

test('blog index item tags link into the archive', async ({ page }) => {
	await page.goto('/blog/');
	await page.locator('.blog-item__tags a.tag').first().click();
	await expect(page).toHaveURL(/\/blog\/tags\/[^/]+\/$/);
	await expect(page.locator('.archive-item').first()).toBeVisible();
});

test('KO portfolio tag archive renders localized heading', async ({ page }) => {
	await page.goto('/ko/portfolio/tags/drm-content-security/');
	await expect(page.locator('.archive__head h1')).toContainText('태그가 달린 작업');
	await expect(page.locator(item).first()).toBeVisible();
	// Portfolio detail pages exist since Stage 27 — titles link to /ko/portfolio/<slug>/.
	await expect(page.locator('.archive-item__title a').first()).toHaveAttribute(
		'href',
		/^\/ko\/portfolio\/[^/]+\/$/,
	);
	await expect(page.locator('.archive__back a')).toHaveAttribute('href', '/ko/portfolio/');
});
