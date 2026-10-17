---
title: "What Coding Agents Actually Did With Our Agent-Ready Docs"
description: "I checked the session logs to see how coding agents actually read our agent-ready docs during real integration work. They never requested the Markdown pages we built for them, and the scanners we relied on missed the server bug that kept them away."
lang: en
translationKey: agent-ready-docs-real-world-test
tags: [ai-ready-docs, ai-llm]
pubDate: 2026-10-17
draft: false
---

Since the first half of this year I've been making our product documentation easier for AI agents to use. I work on developer experience at [DoveRunner](https://doverunner.com/), a security company (DRM, forensic watermarking, mobile app security), and our [docs site](https://docs.doverunner.com) is where developers learn to integrate those products. I hand more and more of my own integration work to a coding agent, and developers reading our docs are likely doing the same, so making our docs easy for agents to find and read will only matter more from here.

By late summer the work looked finished. Every page had a clean Markdown version, the site told agents where to find them, and our scores on the readiness scanners had gone up.

Then I had coding agents do real integration work with the docs. They never once requested the Markdown pages we'd built for them, and when they needed exact specs, they ended up downloading HTML and pulling the values out by hand. This post covers what I found in their session logs, why none of the scanners caught it, whether the Markdown was worth building at all, what we fixed, and what to check if you're doing the same work.

## A short primer on agent-ready docs

How well AI agents can find and use a site's docs is often called agent readiness. Three ideas are enough for this post.

- **Markdown versions of pages.** A docs page's HTML is mostly navigation, scripts and styling, and an agent only needs the text. So sites publish each page as Markdown too, usually at the same URL with `.md` on the end (`/guide/setup/` and `/guide/setup.md`).
- **[`llms.txt`](https://llmstxt.org).** A plain-text table of contents for agents at the root of a site, listing its pages and their Markdown versions.
- **Content negotiation.** If an agent sends an `Accept: text/markdown` header, the server can answer a normal page URL with Markdown instead of HTML, so the agent gets Markdown without knowing the `.md` URL exists.

There are also free scanners that grade a site on these things. We used [isitagentready.com](https://isitagentready.com), Vercel's [is-agentic.com](https://is-agentic.com/), and [afdocs](https://afdocs.dev/), an open-source docs checker, along with [Fern Agent Score](https://buildwithfern.com/agent-score), which runs afdocs on the web. Our scores went up steadily as the work progressed.

## The real-world test

In September and October I used [Claude Code](https://claude.com/product/claude-code), Anthropic's coding agent, for two projects that lean hard on our docs. One was building hands-on courses for [DoveRunner Lab](https://lab.doverunner.com), our developer site, which meant actually integrating our products: generating DRM license tokens, calling the watermarking session API, packaging video. The other was producing tutorial videos for those courses as code with a tool called [HyperFrames](https://github.com/heygen-com/hyperframes), where every on-screen step and line of narration had to match the real API.

The goal of both projects was to build courses and videos. But both had an agent reading our docs to get exact technical details right, over three weeks and dozens of sessions. That made a better test than the experiment I'd been planning to design, so afterward I went through the session logs.

## What the agents did

The agents fetched pages from our docs 47 times. Every request was for a normal HTML page URL, and none was for a `.md` URL.

| How they fetched | Calls | What they asked for |
|---|---|---|
| Claude Code's WebFetch tool | 40 | The normal HTML page URL |
| [curl](https://curl.se), a command-line tool | 7 | The normal HTML page URL |
| A `.md` URL | 0 | |

The 40 WebFetch requests actually got Markdown back, because content negotiation worked for page URLs. But WebFetch runs what it fetches through a small model and hands the agent a summary, so what the agent read was a summary of the Markdown, not the Markdown itself.

The agent took a sensible path. In one session it started at `/llms.txt`, followed it to the index for our content security products, then to a machine-readable list of every URL on the site, and took the page addresses from there. For the specs it couldn't afford to get wrong (the license token's fields, the hash format, values like the encryption key) it then downloaded the raw HTML with curl, a command-line tool that requests a URL and saves whatever comes back, and pulled the values out with regular expressions, text patterns that find the parts it wanted. Its notes explain why. It wanted the exact text, not a summary.

So the agent wanted exactly what our Markdown pages offered, went looking for the index that pointed to them, and still ended up scraping 250 KB HTML pages. The work got done. It just didn't go the way we'd designed.

## Why the agent couldn't reach the Markdown itself

The cause was a small piece of server code that decides when to answer with Markdown. Claude Code's WebFetch sends `Accept: text/markdown, text/html, */*`, and our server treated every request with that header as a request for a docs page and added `.md` to whatever was requested. Page URLs, which end in a slash like `/guide/setup/`, worked. File URLs, which end in an extension like `llms.txt` or `setup.md`, broke. A request for `setup.md` went looking for a `setup.md.md` that doesn't exist.

| What the agent requested, preferring Markdown | What it got |
|---|---|
| The content security index (`/content-security/llms.txt`) | A redirect (an automatic forward to another URL) to the content security landing page |
| The full index (`/llms-full.txt`) | "Page not found" |
| Any `.md` page | "Page not found", because the server looked for `page.md.md` |
| A URL that doesn't exist | A redirect to the nearest section page, which looked like success |

That meant the clients we built all this for couldn't reach the index that lists the Markdown URLs, and the Markdown URLs themselves returned errors. The root `/llms.txt` only worked because, for unrelated reasons, it was set up to skip that server code.

One more thing sent the agent back to HTML. The one line in `llms.txt` explaining the `.md` convention never made it into WebFetch's summaries, so the agent didn't know the `.md` URLs existed when it switched to curl. And curl doesn't ask for Markdown, so it got HTML.

## Why the scanners missed it

What bothered me most was that no scanner caught it. Reading afdocs' check code, I found that each check tests one combination at a time. One sends a Markdown-preferring request to a page URL. Others fetch `.md` URLs and the links in `llms.txt` without asking for Markdown. Both of those worked. The combination that broke, a Markdown-preferring request to a URL that isn't a page, is exactly what real agents send. No check sends it. Vercel's is-agentic.com runs its checks on its own servers, so I can't see them, but it scored our docs in September while the bug was live and didn't flag it. Our isitagentready.com scans were in June, before the bug existed.

One afdocs check even turned the bug into a pass. It requested the content security index while preferring Markdown, followed the redirect to the landing page, got a Markdown response, and counted that as a pass.

Scanners test URLs one at a time against a spec. This kind of failure only shows up when an agent walks the path your docs advertise, from the root index to a section index to a `.md` page, with its real headers at every step.

## Does the Markdown matter at all?

The agents finished the work without ever opening a `.md` page directly, which makes it fair to ask whether the Markdown was worth building. Part of the answer is that the pages WebFetch fetched were already Markdown, which helped the summaries give the agent the gist of each page.

The rest comes from measuring what an agent gets when there's no Markdown. I converted three of our spec pages from HTML to Markdown with [turndown](https://github.com/mixmark-io/turndown), the converter checkers like afdocs also use, and compared the result with our own `.md` versions.

| Page | Raw HTML | HTML converted | Our `.md` | Code blocks kept (converted / `.md`) |
|---|---|---|---|---|
| License Token | 247 KB | 54 KB | 36 KB | 0 of 13 |
| Session Manager | 189 KB | 44 KB | 37 KB | 0 of 15 |
| HTML5 Player | 148 KB | 30 KB | 14 KB | 0 of 3 |

The converted pages cost 1.2 to 2.2 times as many tokens, the units AI models read and bill by. The bigger problem is what conversion does to content. Every code block collapses into a single line, so our license token template comes out as `{    "drm_type": "<drm type string>",    "site_id": …` with no line breaks. For JSON that's only hard to read. For Python or a YAML config it stops working. Exact values change too. Our DRM type names, which the docs say are case sensitive, come out wrapped in curly quotes. In code, `"Widevine"` and `“Widevine”` are different values, so copying the converted one breaks.

So it depends on the task. When an agent only needs the gist of a page, the format barely matters, and that's why everything looked fine. When it needs exact field names, formulas or code it can run, the Markdown version is the difference between copying a spec and reconstructing one. Our agent got the specs right, but not because of the Markdown. It paid for them in effort and tokens by scraping the HTML, as described above. Not every agent or tool will dig for the original like that. A tool that fetches HTML and converts it gets the converted column above, and the collapsed code and changed quotes go straight into its work.

## What we fixed

On the docs site, the server now serves anything that already has a file extension as it is, so the indexes and `.md` pages reach every client. URLs that don't exist return a real "not found". We also fixed Markdown conversion problems that a new version of afdocs found, which took the site's afdocs score from 94 with three failing checks to 100.

I also had to fix my own tool. [siteready](https://github.com/dkdev24/siteready) is an open-source scanner and fixer I extracted from this work, and it generated the same server code for other sites, so it shipped the same bug. It now has a check that requests every kind of URL in `llms.txt` with real agent headers and without following redirects. Pointed at our old server code, it scores 50 out of 100. None of the existing scanners' checks covered this case.

What we'd built wasn't equally useful, though. The plain Markdown pages and `llms.txt` were cheap and did their job. The clever parts, like redirects that guess what a wrong URL meant, were added mostly to score better on scanners, and every bug in this post lived in them.

## What I'd tell anyone doing this

- **Request your own files the way an agent does.** Two lines catch the core problem in this post:

  ```bash
  curl -sI -H "Accept: text/markdown" https://your-docs.example/llms.txt
  curl -sI -H "Accept: text/markdown" https://your-docs.example/some/page.md
  ```

  The `-I` option checks only the response status, not the content. Both should return `200`, meaning OK. If either redirects or returns `404`, meaning not found, agents that prefer Markdown can't reach it.
- **Treat scanner scores as a floor.** A top grade means the site passes those checks. Whether agents can use it is a separate question.
- **Log a real agent's work and grade exact answers.** Record which URLs it requested, with which headers, and whether it ever reached your Markdown. Check that field names, formulas and code are right, not only that it produced an answer. Without that trace we'd have seen the work succeed and learned nothing.

## Closing

The agents did finish the integration work, but our site's agent readiness wasn't working the way we intended. If we'd trusted the scanner results and never tried real agent work, we wouldn't have found these problems.

What I took from it is that a scanner can only tell you about the checks it runs. You only find out whether agents take the path you built by watching one work. Next, I'm planning an [MCP](https://modelcontextprotocol.io) server, the standard way for assistants like ChatGPT and Claude to connect to a company's content, so they can search our docs directly.

If you've found something similar in your own docs, or tried siteready, I'd like to hear about it.
