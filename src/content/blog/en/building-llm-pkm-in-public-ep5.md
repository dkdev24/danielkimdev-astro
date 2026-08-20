---
title: "One Space, Three Roles: When Different Audiences Need Different Rules"
description: "Personal notes, reusable templates, and public writing lived in the same space, and an AI agent had no reliable way to know which rules applied where. Why I split the vault into four explicit layers, and what the separation made visible."
pubDate: 2026-06-04
lang: en
tags: [pkm, ai-llm, solopreneur]
draft: false
translationKey: building-llm-pkm-in-public-ep5
series: building-llm-pkm-in-public
---

Every session ended with a quiet sense of progress.

Things that had been scattered in my head were finding a place on the page. But somewhere along the way, a different kind of discomfort crept in.

*"What if someone else saw this?"*

The wiki held work-related notes alongside personal reflections alongside draft posts that weren't ready for anyone. All of it in the same space, mixed together.

## One space, three purposes

The original goal was simple: build a second brain. A personal space, just for me.

But as the project moved forward, new purposes took shape.

First, I wanted a separate layer for the system's own structure. I called it the **Kit** folder, meant to hold templates and configurations cleanly apart from my personal content, a space where my specific context didn't belong.

Second, I wanted to document this journey publicly. This series is exactly that.

The problem is that those three purposes operate under fundamentally different rules.

- The personal wiki may contain client names, financial notes, things that must never be public.
- The Kit layer needs to stay free of personal context. The moment it bleeds in, the layer loses its purpose.
- The blog can tell the honest story of this project, but specific client or business details aren't its to tell.

When all three lived in the same undivided space, an AI agent running a session had no way to honor distinctions that weren't explicitly stated.

**Rules have to be written down.**

## The solution: physical layer separation

The fix was architectural. Instead of relying on the agent to infer the right context for each task, I split the vault into explicit layers:

- **Personal** (`wiki/`, `raw/`, `index.md`): completely private. The core PKM.
- **Kit** (`kit/`): a structural layer for templates and system configuration. No personal context.
- **Story** (`story/`): public narrative. No financial or private details.
- **Meta** (`meta/`): internal planning and operations.

Each layer's rules are documented in `AGENTS.md`. When an agent starts a session, it knows which layer it's working in and what rules apply there.

This matters for a reason that isn't technical. I occupy multiple roles simultaneously, and the boundaries between them need to be enforced. Trusting an AI agent to figure out, from context alone, where one role ends and another begins is a risk that's easy to avoid and hard to recover from once something slips through.

## What the separation revealed

Something unexpected came out of creating the Kit layer.

To define what belonged there, I had to seriously ask: which parts of this system are genuinely transferable principles, and which parts only work because of my specific situation? In the personal wiki, that distinction never needed to be sharp. I know my own context, so the two could mix freely. But the moment I needed a layer that excluded personal context, I had to actually separate them.

And I found things I'd assumed were universal principles that were, in fact, just patterns that happened to fit my circumstances. The Kit layer forced that distinction into the open.

There's a saying that you learn the most about a system when you try to explain it to someone else. Layer separation created that effect structurally, not as a communication exercise but as a design constraint.

## Next episode

After the split, I started ingesting sources faster. More volume, less friction. And somewhere in that acceleration, I noticed something uncomfortable: an AI agent was quietly eroding my ability to form my own judgments. Next episode, I'll name that failure mode and explain why it's especially dangerous in an AI-assisted PKM system.
