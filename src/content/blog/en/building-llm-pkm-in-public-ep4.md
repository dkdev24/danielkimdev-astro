---
title: "More Plugins, More Power? The Hidden Cost of a Bloated AI Config"
description: "Opening a wiki session, I saw 50,000 tokens already consumed — before touching a single file. A 93 KB development framework had been loading into every session regardless of the task. What I learned about keeping AI context lean."
pubDate: 2026-05-28
lang: en
tags: [pkm, ai-llm]
draft: false
translationKey: building-llm-pkm-in-public-ep4
series: building-llm-pkm-in-public
---

I started the session and read one file. Just HANDOFF.md — nothing else.

[Claude Code](https://claude.ai/code) showed this:

> **50K / 200K tokens used (25%)**

I hadn't written a line of code. Hadn't processed a single document. A quarter of my context window was already gone.

## 50,000 tokens gone before I started

At first I almost let it slide. 200K is a big window.

But I stopped and asked: where did those 50K tokens actually go?

Claude Code auto-loads project configuration files at session start. My global config file, `~/.claude/CLAUDE.md`, contained this:

```
@COMMANDS.md
@FLAGS.md
@PRINCIPLES.md
@RULES.md
@MCP.md
@PERSONAS.md
@ORCHESTRATOR.md
@MODES.md
```

Eight lines, each importing a file via `@`. I checked the actual sizes:

| File | Size |
|---|---|
| ORCHESTRATOR.md | 22.3 KB |
| PERSONAS.md | 20.2 KB |
| MODES.md | 13.5 KB |
| MCP.md | 11.3 KB |
| PRINCIPLES.md | 9.3 KB |
| FLAGS.md | 8.7 KB |
| COMMANDS.md | 5.6 KB |
| RULES.md | 2.4 KB |
| **Total** | **~93 KB** |

93 KB of text — roughly **35,000–40,000 tokens**. The remaining 10K came from Claude Code's own system message, MCP tool definitions, and agent listings injected at startup.

All of it loaded before I'd opened a single file.

## What SuperClaude is — and why it was built

Those eight files belong to a framework called **[SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)** — an open-source orchestration layer that runs on top of Claude Code. Think of it as a plugin system that turns Claude into a more capable development environment.

What it offers:

- **11 specialized personas**: `--persona-architect`, `--persona-security`, `--persona-frontend`, and others. Each switches the AI's reasoning mode to match the task at hand.
- **Wave execution system**: detects task complexity ≥ 0.7, ≥ 20 files in scope, or ≥ 2 distinct task types — and automatically activates multi-stage orchestration.
- **[MCP](https://modelcontextprotocol.io) server routing**: automatically selects and connects [Context7](https://context7.com) (documentation search), Sequential (complex analysis), Magic (UI generation), and [Playwright](https://playwright.dev) (test automation) based on what the work calls for.

For software development, this is genuinely useful. Large-scale refactoring, security audits, deployment pipeline design — SuperClaude can significantly extend what the AI can do.

The problem was that I had it in my **global config**. Global config loads for every project, every session, no exceptions.

## When a tool becomes dead weight

The session I opened that day was for wiki work. The to-do list was simple: read HANDOFF.md, ingest a few sources, update some wiki pages.

Did that work need Wave orchestration? No.
A security threat modeling persona? No.
22 KB of MCP server routing algorithms? Definitely not.

What wiki work actually needs:

- `obsidian:defuddle` — extract clean markdown from URLs
- `obsidian:obsidian-markdown` — write notes in proper Obsidian syntax
- Basic file read/write

Those total a few KB. But I was hauling a 35K-token software development framework into every wiki editing session.

The analogy: going to a café to write, but bringing a full set of welding equipment along. The equipment is excellent. It just has no business being at that table.

The AI plugin and skill ecosystem has a built-in trap here. "More features = more powerful" slides naturally into "keep every feature on all the time." The result is wasted context.

## The fix: 3 lines to get 35K tokens back

The fix was simple.

I removed the `@import` lines from the global `~/.claude/CLAUDE.md` and replaced them with a comment noting where to find the files:

```markdown
# Global Claude Instructions

# SuperClaude framework files are in ~/.claude/ but loaded per-project only.
# To enable SuperClaude in a project, add to that project's CLAUDE.md:
#
# @~/.claude/COMMANDS.md
# @~/.claude/FLAGS.md
# ... (remaining files)
```

The SuperClaude files are still on disk — I didn't delete them. I just cut the auto-load. Any project that actually needs SuperClaude adds those `@import` lines to its own `CLAUDE.md`. On when needed, off everywhere else.

Result: the wiki project now loads only `AGENTS.md` at session start. About 2 KB. Down from 93 KB — a 96% reduction.

## The lesson: Minimum Viable Context

Software security has a concept called the **Principle of Least Privilege**: each component of a system should have the minimum access necessary to do its job, and nothing more.

The same principle applies to AI agent configuration. I think of it as **Minimum Viable Context** — each workflow should load only what it actually needs to function.

"But isn't 200K enough anyway?" Maybe — until it isn't. Context consumed at session start is gone for the rest of the session. For wiki management, which often runs long, starting at 25% capacity means complex ingest batches, multi-file updates, or long original sources near the end of the session get cut off. Beyond that: irrelevant context isn't neutral. When the AI's working space is packed with deployment pipelines and security audit guidelines, that content is still being processed — and the quality of responses for an unrelated task is harder to guarantee.

## Closing

This post isn't a critique of SuperClaude — it's about configuration discipline. "Set it up once and it works everywhere" is a convenience that quietly became "it's always on, even when it shouldn't be."

The Claude Code ecosystem now has no shortage of plugins, skills, MCP servers, and frameworks. Finding and installing them is easy. The harder discipline is knowing which workflow needs what — and loading only that.

What's your global Claude config loading automatically right now?
