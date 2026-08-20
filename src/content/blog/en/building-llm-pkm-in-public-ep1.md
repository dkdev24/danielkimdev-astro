---
title: "I Started Organizing a Decade of Knowledge with AI: Why, and Where to Begin"
description: "Starting a public series on building a personal LLM-Wiki out of a decade of OTT and DRM experience. Why AI can summarize but not reflect, and what the system looks like a few weeks in."
pubDate: 2026-05-05
lang: en
tags: [pkm, ai-llm]
draft: false
translationKey: building-llm-pkm-in-public-ep1
series: building-llm-pkm-in-public
---

Not long ago, I ran into an uncomfortable question.

> "Where is everything I've built up over the past ten years?"

Working in OTT streaming and content security, I'd read hundreds of articles, shipped many projects, and solved a lot of problems. But most of that knowledge was sitting in internal docs, tech blog posts, read-later bookmarks, and my own head, with nothing linking it together.

## What AI Can't Fill In

When AI tools started flooding the market, my first reaction was simple: productivity boost. They summarize, draft, write code.

Then I hit a realization.

**There's one thing AI can't fill in: the reflection that comes from your own experience.**

Ask ChatGPT what the most common mistakes are in DRM implementation on an OTT platform and you'll get a plausible answer. But that answer doesn't carry the weight of a specific failure I've lived through, the lesson from a particular conversation with a customer, or the intuition those experiences built into me. That part I have to surface myself.

## Starting to Build an LLM-Wiki

Over the past few days I've been building a personal knowledge management system around the **LLM-Wiki** approach.

This isn't a concept I invented. It was developed and shared by Andrej Karpathy, an AI researcher who came out of OpenAI. ([See the original](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)) The original is personal-note-centric; I've added domain-specific structure and an AI-agent collaboration layer on top.

The concept is simple:

- I collect articles, papers, and experiences as **raw sources**.
- An AI agent (Claude Code) analyzes them and extracts the key points.
- I curate the output into wiki pages: concept definitions, entities (people, companies, technologies), and synthesized insights.
- As each new source comes in, the AI agent cross-references it against existing wiki pages and surfaces connections. Each session, the knowledge compounds.

The process matters more than the tools.

AI handles the mechanical work: summarizing, indexing, cross-referencing. I focus on judgment and reflection. When you can't carve out long stretches of time for this, splitting the roles makes limited time go much further.

## A Few Weeks In

As of when I'm writing this, the system contains:

- **5 domains** (OTT/streaming, DRM/content security, cloud/SaaS, AI/LLM, solopreneurship)
- **24 wiki pages**: concept definitions, entities, synthesized insights
- **49 sources**: read, analyzed, and registered in the system (I'll call this process "ingesting" throughout this series)

But there's a result that matters more than any number on that list.

Last week someone asked me how to approach key rotation strategy in a multi-DRM environment. I didn't scan my memory. I opened the wiki, pulled up the structured entry, and walked them through my thinking far more clearly than I could have before. The difference between reaching for the wiki and searching your memory seems small. It compounds.

## Why I'm Documenting This in Public

I see plenty of people around me in the same situation: deep expertise that hasn't been organized. An interest in using AI, but no clear sense of where to connect it.

I'm writing this publicly for two reasons. First, **accountability**: writing forces more precise thinking. Second, **to be useful to someone on a similar path**: the trial and error I've gone through can save someone else time.

## What's Coming in This Series

Topics ahead:

- How I select and ingest sources
- The actual workflow for collaborating with an AI agent
- The moment disconnected sources start connecting
- How a knowledge wiki becomes raw material for writing and eventually an ebook

At the end, I plan to cover packaging the methodology into something others can use.

If you have deep experience in a field but haven't worked out how to organize and use it, I'd love to have you follow along.

Comments and DMs are always welcome.
