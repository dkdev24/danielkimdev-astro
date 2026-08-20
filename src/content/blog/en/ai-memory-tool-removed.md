---
title: "Why I Added an AI Memory Tool and Then Removed It"
description: "I connected Mem0 to manage context across AI coding agent sessions, then removed it. Here's why two plain markdown files turned out to be enough."
pubDate: 2026-07-11
lang: en
tags: [ai-llm, pkm, solopreneur]
draft: false
translationKey: ai-memory-tool-removed
---

Every day, another "agent memory" solution shows up in my feed. Commercial products, open-source libraries, the pitch is almost always the same: *"Your agent has amnesia."*

The problem is real. Anyone who runs coding agents across multiple devices and sessions eventually hits it. Every new session, the agent has no idea what happened before: which architectural decisions you made, why you abandoned a particular approach, where work stands right now. Doesn't matter whether you're on Claude Code, OpenCode, or Gemini. You start over every time.

I hit the same wall. I connected [Mem0](https://mem0.ai), a dedicated AI memory service, to my workflow. Eventually I removed it. I now handle the problem with two plain markdown files.

## My first attempt: Mem0

I connected Mem0 as an MCP server (the standard interface that lets agents call external tools) and wrote instructions for when the agent should write and read memories. I organized memories by decision type, set up per-agent tagging so Claude and Gemini could keep their memory stores separate, and configured search queries to restore context at the start of each session.

It worked. But it came with friction.

The agent had to remember to write a memory after any significant decision, and to read memories before starting work each session. Miss either step and coverage fell apart. Decisions from one session would go missing in the next, as if they'd never happened. Everything was also stored in an external service, outside the repository and outside version control.

## The system I built instead

I settled on two files inside the repository.

- **HANDOFF.md**: loaded automatically at every session start. Short, always current. It captures what happened last session, the current project state, and next steps. Rewritten each session, not accumulated.
- **WORKLOG.md**: a running session log, newest entries at the top. Never auto-loaded. I read it on demand when I need deeper context.

Two files, no external dependencies, and continuity across sessions, devices, and agents.

**The auto-loading mechanism is straightforward.** AGENTS.md (or CLAUDE.md) is a file where you keep always-on instructions for your agent. Add one line: "Read HANDOFF.md before anything else." Any agent that can read markdown, Claude Code, OpenCode, Gemini, picks this up without a plugin or integration.

## Why Mem0 became redundant

I ran both systems in parallel for a while, partly as a backup and partly out of habit. When I compared what each was actually providing, the picture was clear:

- Everything worth remembering was already in the two markdown files.
- Those files are version-controlled, human-readable, and searchable with standard tools.
- Mem0 still required the agent to write and read on every session. The same coverage problem I'd been trying to solve was now duplicated across two systems.
- The only remaining advantage Mem0 had was semantic search, but `grep` and reading the top of WORKLOG.md covered the vast majority of those cases.

There was no reason to run both.

That said, Mem0 is well-suited to other use cases. Its [official site](https://mem0.ai) lists customer support, healthcare, education, and sales CRM as primary applications: all environments that serve many users and need per-user personalized memory. Remembering each patient's medical history, tracking each learner's progress, maintaining a customer's support history: that's where a dedicated memory service earns its place. Development workflows without a single shared repository fall into this category too. My setup is a single-repo, solo project, so markdown files are enough. Different conditions, different answer.

## Why it works: rewrite vs. accumulate

The design principle is simple:

- **HANDOFF.md stays small** because it's rewritten each session, not appended to.
- **WORKLOG.md can grow without limit** because it's never auto-loaded, so the agent reads only what it needs.

WORKLOG.md is over 4,000 lines now. That's fine. No agent pulls the whole thing into context. To catch up on recent sessions, read the top 150 lines. To find something specific, search for it.

## Conclusion

More tools mean more maintenance surface, not better memory.

Once your notes are structured, versioned, and auto-loaded, a dedicated memory layer just adds complexity. Simple systems are easier to maintain, especially in multi-agent environments where the same state needs to be shared. A plain markdown file works in any agent without special integration.
