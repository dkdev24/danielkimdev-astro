import { test, expect } from '@playwright/test';

/**
 * Stage 32 — reading progress indicator. A thin fixed bar (`.reading-progress__bar`,
 * `aria-hidden`) tracks scroll through `.post__body` only, via a CSS `scaleX`
 * transform driven by an rAF-throttled scroll listener.
 */

function readScaleX(transform: string): number {
	// "none" (0%) or "matrix(sx, 0, 0, 1, 0, 0)".
	if (transform === 'none') return 0;
	const match = transform.match(/matrix\(([^,]+),/);
	return match ? parseFloat(match[1]) : NaN;
}

test('bar is aria-hidden and starts at 0 before scrolling', async ({ page }) => {
	await page.goto('/blog/agent-readiness/');

	const bar = page.locator('.reading-progress__bar');
	await expect(page.locator('.reading-progress')).toHaveAttribute('aria-hidden', 'true');

	const transform = await bar.evaluate((el) => getComputedStyle(el).transform);
	expect(readScaleX(transform)).toBeCloseTo(0, 1);
});

test('bar fills toward 1 (never past it) when scrolled to the bottom of the post', async ({
	page,
}) => {
	await page.goto('/blog/agent-readiness/');

	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	// Let the rAF-throttled listener run.
	await page.waitForTimeout(100);

	const bar = page.locator('.reading-progress__bar');
	const transform = await bar.evaluate((el) => getComputedStyle(el).transform);
	const scaleX = readScaleX(transform);
	expect(scaleX).toBeLessThanOrEqual(1.001);
	expect(scaleX).toBeGreaterThan(0.9);
});
