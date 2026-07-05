---
title: "The Fix I Trusted Had the Same Flaw: Giving Source Judgment a Real Memory"
description: "Source trust judgments kept drifting between sessions, so I built a registry to make them persistent. The two-axis framework behind that design, the author-level extension that strengthened it — and the uncomfortable thing I found in the seed data I'd used to populate it."
pubDate: 2026-06-19
lang: en
tags: [pkm, ai-llm, automation]
draft: false
translationKey: building-llm-pkm-in-public-ep7
series: building-llm-pkm-in-public
---

Every time I add a new source to the wiki, the AI's first job is deciding how much to trust it. Is this a primary research paper, or someone's hot take? That judgment changes how the source gets cited and how strongly it gets folded into the wiki.

I'd been reviewing that judgment every session and moving on. But one question kept nagging at me.

> "Couldn't this classification just change depending on which model happens to run the session that day?"

This post walks through what came out of that question: actually giving source-trust judgment a memory, and discovering along the way that the fix I built had quietly inherited the exact same flaw as the original problem.

## The judgment was really two separate axes

The first thing I found was that "trust tier" looks like a single score, but it's actually two axes with very different natures stacked together.

- **Source Type (S-axis):** is this outlet or author a primary producer, a practitioner with a demonstrated track record, trade press, or a content farm? This is a fixed property of the outlet or person. Once it's confirmed, it doesn't change.
- **Verifiability (V-axis):** does this specific piece actually back its claims with evidence? This varies article by article and has to be judged fresh every time.

The problem was that only the V-axis genuinely needed fresh judgment. The S-axis was being re-guessed from scratch every single session anyway, even for outlets and authors I'd already confirmed more than once.

## Giving judgment a memory

So I built a registry file, `schema/source_registry.yml`, that the AI checks before guessing. Once an outlet or author has been confirmed, it's recorded there, and future sessions don't need to re-derive the same judgment.

The lookup itself runs through `tools/classify_source.py`. Feed it a source URL, and it returns the registered value if one exists, or tells you a fresh judgment is needed if it doesn't.

I tested it live on two new sources during an actual ingest session. It worked.

## The fix had the same problem

Here's where it got uncomfortable. When I first seeded the registry, I filled in 12 starting entries. Ten of those were just my own general knowledge about who's reputable — guesses I'd never actually had confirmed. Calling the file a "registry" didn't make those judgments any more verified than they'd been before. It just looked more authoritative, wrapped in a file that implied it had already been checked.

How I fixed that — reconstructing real evidence from the ingest history — is the subject of the next episode.

## Extending it to the author level

The next question mattered more: did this track by person, not just by outlet? It didn't.

One real example made that obvious. A writer named Rost Glukhov was already confirmed as S2 based on 11 sources on `medium.com/@rosgluk`. But the same person's own domain, `glukhov.org`, sat completely unresolved. Same person, but the registry treated the two as unrelated unknowns.

Digging further turned up a second problem: his own byline had been recorded four inconsistent ways across his past summaries, wikilinked, plain text, surname only, and once simply as "Unknown." Before author-level trust could work at all, that naming inconsistency needed cleaning up first.

So I added a separate author layer. Venue is checked first; the author is a fallback only when the venue itself is unresolved. Names are matched exactly, never fuzzily, and a partial match gets flagged as a possible alias for manual confirmation rather than merged automatically, so two different people who happen to share a name never get silently conflated.

Re-pooling the historical data by author instead of by venue produced much stronger evidence: Rost Glukhov's sources, spread across 4 venues, totaled 19; Theo James's, across 2 venues, totaled 15. Six authors in total were confirmed this way, each with a tier pattern that fit exactly one value.

## Where this leaves things

Before this work, every session re-derived S-axis judgments from scratch. Now they accumulate. Extending to the author layer made that accumulation much stronger — Rost Glukhov's sources across four venues totaled 19; Theo James's across two venues totaled 15. Six authors confirmed this way, each with a tier pattern that fit exactly one value.

The system gets more precise the more it's used. What's confirmed stays confirmed.

There's one assumption underlying all of that: that the seed data the registry started with was actually verified. That story is next.

Thanks for reading. If you're running a similar wiki or personal knowledge system, I'd genuinely like to hear how you're handling this.
