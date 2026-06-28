import { defineConfig, devices } from '@playwright/test';

/**
 * Minimal Playwright config for local UI/smoke testing of the Astro site.
 *
 * Workflow (see dev-references/web-browswer-test.md): run standalone specs
 * locally with `npm run test:e2e` instead of driving a browser live via MCP.
 * Claude only reads the spec code + terminal logs — no continuous DOM/a11y
 * snapshots — which keeps token usage low.
 *
 * `webServer` auto-starts `astro dev` and reuses an already-running server,
 * so tests work whether or not a background dev server is up.
 */
export default defineConfig({
	testDir: './tests/e2e',
	// Compact terminal output; pair with `| grep -A 5 Error` when logs are noisy.
	reporter: 'line',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	use: {
		baseURL: 'http://localhost:4321',
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
