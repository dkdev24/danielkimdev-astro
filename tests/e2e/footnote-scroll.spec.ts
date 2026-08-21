import { test, expect } from '@playwright/test';

test('footnote jump and back-link clear the sticky header', async ({ page }) => {
	await page.goto('/blog/ai-assisted-vs-human-written-tags/');

	const headerBottom = await page
		.locator('header, .site-header, [class*="header"]')
		.first()
		.evaluate((el) => el.getBoundingClientRect().bottom);

	await page.locator('a[href="#user-content-fn-1"]').click();
	await page.waitForTimeout(300);
	const fnTop = await page.locator('#user-content-fn-1').evaluate((el) => el.getBoundingClientRect().top);
	expect(fnTop).toBeGreaterThanOrEqual(headerBottom);

	await page.locator('a[href="#user-content-fnref-1"]').first().click();
	await page.waitForTimeout(300);
	const refTop = await page
		.locator('#user-content-fnref-1')
		.evaluate((el) => el.getBoundingClientRect().top);
	expect(refTop).toBeGreaterThanOrEqual(headerBottom);
});
