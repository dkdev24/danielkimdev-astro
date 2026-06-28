When using the **Playwright MCP server** directly within Claude Code, token consumption spikes because the model reads extensive accessibility snapshots and DOM structures on *every single turn* or tool interaction.

To drastically reduce token overhead while testing web UIs and content, you can implement the following strategies:

---

## 1. Shift from "Agentic Driving" to "Local Script Execution"

Instead of letting Claude drive the browser live via step-by-step MCP commands (which sends a massive state snapshot back to Claude with every click), change your workflow:

* **How it works:** Ask Claude to write standard, standalone Playwright test scripts (`.spec.ts`) locally in your repository.
* **The command:** Have Claude execute them using the native terminal tool:
```bash
claude "Run npx playwright test tests/login.spec.ts and fix any failures"

```


* **Token Savings:** **80% - 90%+.** Claude only reads the test code and the terminal error logs, completely bypassing the massive overhead of continuous DOM/accessibility tree analysis.

## 2. Use Firecrawl for Content & Scraping Verification

If your goal is verifying text, layouts, or content pages, feeding raw HTML or full DOM snapshots into Claude is incredibly wasteful (a single page easily costs 30,000+ tokens in boilerplate code, headers, and footers).

* **The solution:** Integrate an MCP scraper like **Firecrawl**. Firecrawl strips web pages down into clean, semantic Markdown before it ever hits Claude Code.
* **Token Savings:** Up to **94% fewer input tokens** per page (reducing a typical 38,000-token HTML soup down to a ~2,500-token Markdown file).

## 3. Leverage Claude Code’s Native "Computer Use"

If you are doing heavy visual testing, layout regression checks, or testing local apps, you can use Claude Code's native **Computer Use** capability instead of Playwright MCP.

* **How it works:** Computer Use captures screenshots of your screen/browser, automatically downscales them, and allows Claude to visually interact with the UI.
* **Token Savings:** It relies on image tokens rather than thousands of lines of text DOM elements, which is often significantly cheaper for complex single-page apps.

## 4. Control Session State and Context Bloat

Because Claude Code accumulates context throughout a session, running browser tests repeatedly will rapidly blow past your prompt-caching window.

* **Use `/clear` or `/compact`:** When a test passes or you switch from writing a test to debugging a completely different UI element, run `/clear` to reset the token floor. Stale browser snapshots from previous turns will otherwise be resubmitted on every new prompt.
* **Strictly Scope Tool Output:** If you run local tests that output thousands of lines of logs, filter them before Claude reads them (e.g., `npx playwright test | grep -A 5 "Error"`).

---

### Summary Checklist for Efficiency

| Goal | Avoid | Use Instead |
| --- | --- | --- |
| **Functional UI Testing** | Interactive Playwright MCP clicks | Code generation + local `npx playwright test` |
| **Content/Text Verification** | Fetching raw page source/DOM | Firecrawl MCP (Clean Markdown) |
| **Visual/Layout Bug Checks** | Sifting through CSS/HTML trees | Native Computer Use (Visual screenshots) |
