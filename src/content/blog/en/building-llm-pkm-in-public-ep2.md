---
title: "From Data Hoarder to Knowledge Architect: Bad Sources Make a Bad Wiki"
description: "I used to think feeding articles to AI and letting it fill my wiki counted as building knowledge. Here's how bad sources turned that into a well-organized trash can, and the three-part quality check I built to stop it."
pubDate: 2026-07-02
lang: en
tags: [pkm, ai-llm]
draft: false
translationKey: building-llm-pkm-in-public-ep2
series: building-llm-pkm-in-public
---

I'm a self-admitted, and widely acknowledged, data hoarder.

Every morning I open my inbox to a pile of newsletters. Matter, my read-it-later app, holds thousands of articles saved over the years. Every time I hit save telling myself "I'll need this someday," I let myself believe I was learning something.

Let's be honest, though: **saving isn't reading, and reading is even further from understanding.**

The first wall I hit when I started building the LLM-Wiki system was this hoarding habit itself.

## AI Will Summarize Garbage Just as Nicely

I was thrilled when I first built the system. I'd hand Claude a full article, and ten seconds later it had the key points summarized into a tagged wiki page (a markdown note). That was the entire workflow back then: hand over a source, let Claude summarize it, and drop it straight into the wiki.

A few days later, though, rereading the wiki, something felt off. Some pages were sharp and well-reasoned; others didn't hold together, or read as pure opinion. Tracing the problem back, the real issue was the sources I'd fed in:

- Technical docs written in 2019 that are now simply wrong
- Marketing articles written to sell a specific solution, bias built in
- LinkedIn posts dressing up one person's passing impression as universal truth

I'd saved these based on a headline, and Claude summarized them into clean, readable structure regardless of quality, then filed them straight into my knowledge base. Put bluntly, I was building a **well-organized trash can.**

## Ingest 2.0: Grading Information Before It Gets In

So I tore the workflow down and rebuilt it. I call this **Ingest 2.0.** Now, before any new source goes into the wiki, Claude and I run a quality check on it first.

### 1. A Source Tier System (Tier 1–Tier 4)

I decided not to treat every article equally.

- **Tier 1 (the top of trust):** official docs, papers, industry standards
- **Tier 2 (proven experts):** analysis from people who've built years of credibility in their field
- **Tier 3 (general information):** news articles, well-written tutorials
- **Tier 4 (reference only):** short personal takes, unverified social posts

When I search the wiki, just knowing whether a claim traces back to a Tier 1 source or a Tier 4 one changes how much weight I give it.

### 2. Checking the Expiration Date (Temporal Sensitivity)

AI and cloud, in particular, move fast: information that was true six months ago is routinely wrong today. So every source gets tagged **Evergreen**, **Dated**, or **Timely**. It's a device for the me of a year from now: on rereading a page, I can tell at a glance that a claim needs to be discounted for its age.

### 3. Classifying the Kind of Claim

I separate whether a piece is stating a **technical fact** or recounting the author's **personal experience**. "Technology A works by doing B" is a fact; "Technology A will win the market" is an opinion. Mixing the two together in storage is exactly what causes confusion down the line.

## Now the System Tells Me "Don't Put This In"

The biggest change is in how I talk to Claude. It no longer summarizes every link I hand it on reflex.

> "Daniel, this article is from 2021, and a lot of it no longer matches current LLM trends. It also reads as Tier 4-level personal speculation. Do you actually want this in the wiki, or should we just archive it for reference?"

The moment that question lands, I drop the data hoarder in me and pick up the knowledge architect instead. Instead of obsessing over volume, I've started managing **the quality bar for what's allowed into my knowledge base.**

## What Escaping Data Hoarding Actually Produced

Here's where the wiki stands right now:

- **Raw sources ingested:** 42
- **Wiki pages generated:** 26

If I'd simply summarized everything, I'd be well past 40 pages by now. Strict filtering and synthesizing insights across sources compressed that number. The volume dropped, but the density rose far more.

The wiki isn't just a pile of articles anymore. It's becoming my own verified knowledge engine, holding only what I've judged worth trusting.

## Coming Up Next

Once the right information is in, what comes next? The moment separate domains collide and throw off a spark.

Next time, I'll share a real example of **insight synthesis** in action: working through a question like "what business models open up when OTT security technology meets AI agents?"

*How many tabs are open in your browser right now? And how many of them will actually become your knowledge?*
