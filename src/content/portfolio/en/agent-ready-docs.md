---
title: Agent-Ready Docs
role: Developer Advocate
org: DoveRunner
period: 2026–present
startDate: 2026-05-28
summary: Making DoveRunner's developer documentation usable by AI coding agents, not just people — a docs audit, agent-ready site infrastructure, and an open-source tool that turns the method into something any team can run.
category: devrel
tags: [ai-ready-docs, ai-llm]
lang: en
featured: true
order: 3
translationKey: agent-ready-docs
links:
  - label: "Blog: Agent Readiness"
    url: https://danielkimdev.com/blog/agent-readiness/
  - label: siteready (GitHub)
    url: https://github.com/dkdev24/siteready
  - label: DoveRunner developer docs
    url: https://docs.doverunner.com
---

Developers increasingly meet our documentation through an AI coding agent, not a browser
tab. This work asks a plain question — can an agent actually use these docs to ship a
working integration? — and then fixes what the answer exposes.

- **Measure.** Scanned the docs site with public agent-readiness scanners and audited the
  content against end-to-end customer integration scenarios, where gaps hide between pages.
- **Fix the infrastructure.** `llms.txt`, a markdown copy of every page, markdown content
  negotiation, and explicit content signals for AI crawlers.
- **Fix the content.** Worked through the audit findings with the product teams that own
  the answers.
- **Generalize it.** Extracted the scan → fix → rescan loop into
  [siteready](https://github.com/dkdev24/siteready), an open-source CLI and agent skill. This
  site is one of its test targets.

The same thread runs into everyday AI-assisted work: I used Claude with the Jira MCP to get
up to speed as a new product owner, turning scattered tickets into usable context
([write-up on Medium](https://medium.com/@danielkim-dev)).
