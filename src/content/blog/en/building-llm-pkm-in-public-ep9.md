---
title: "Five Sources In, I Was Rubber-Stamping: Breaking the Browse-and-Accept Pattern"
description: "One source at a time, I reviewed carefully. Seven at once, and by the fifth I was scanning titles and rubber-stamping. How I recognized the browse-and-accept failure mode, and why splitting ingest into three separate stages fixed it."
pubDate: 2026-07-02
lang: en
tags: [pkm, ai-llm, automation]
draft: false
translationKey: building-llm-pkm-in-public-ep9
series: building-llm-pkm-in-public
---

In the beginning, it worked well.

When one or two sources arrived in the inbox, I'd review them carefully: reject the ones from outlets I didn't trust, conditionally pass the ones worth keeping with caveats, give genuine attention to each decision.

Then one day there were seven sources queued up.

I reviewed the first two carefully. By the third, I was moving faster. By the fifth, I was effectively scanning titles and approving. By the seventh, I couldn't have told you what it was actually about.

This was the result of batching everything into a single "ingest session."

## The browse-and-accept trap

The intuition behind batching makes sense: review everything at once, stay in the same mental mode, get it all done in one go.

But human attention doesn't scale that way. The focus I brought to the first source and the focus I brought to the seventh weren't the same thing. When the first six all ended in approval, the seventh carried a subtle pull toward approval too, not from any deliberate decision but from accumulated inertia.

I started calling this the **Browse-and-Accept** pattern: going through the motions of review without the substance of it. The outward form was review. The actual cognitive work wasn't there.

What made this harder to catch was that I genuinely felt like I was reviewing. The gap between what I thought I was doing and what I was actually doing was the problem, not laziness or carelessness.

## The fix: separate the stages

The solution was to split what had been a single activity into three distinct phases, each handled differently.

**Stage 1: Analysis.** The AI agent works through every source on its own. Duplicate checks, S/V-tier classification, draft wiki updates. I'm not involved. The agent handles it all.

**Stage 2: Review.** I go through the agent's analysis alone, one source at a time, with no time pressure. If I want to review three sources today and save the rest for tomorrow, that's fine. The agent doesn't participate in this stage.

**Stage 3: Write.** The approved sources go back to the agent, which updates the wiki in bulk. Mechanical execution again.

Two things improved immediately.

First, review became actual review. One source at a time, no queue pressure bearing down, no previous approvals building momentum toward the next one.

Second, errors became traceable. When everything happened in one pass, it was hard to tell whether a problem came from how the agent analyzed the source or from how I evaluated it. With the stages separated, the distinction became clear. This was a Stage 1 mistake. That was a Stage 2 misjudgment.

## What this taught me about system design

Looking back, treating "ingest" as a single unified activity was the seed of the problem.

Analysis is work the AI can do well unattended. Review is work that requires a human, fully present, without competing pressures. Writing is mechanical execution the AI can handle again. Three different kinds of work. Putting them in the same box guaranteed that review, the one requiring the most care, would eventually get squeezed out by the other two.

**The key is identifying precisely where human attention is needed, and protecting only that moment.** Everything else can be automated. But if the boundary between the two is blurry, human attention ends up getting applied to the wrong things, or not applied at all, while still appearing like it was.

*I wrote this post with ten sources queued in the inbox. Processed them in three stages.*
