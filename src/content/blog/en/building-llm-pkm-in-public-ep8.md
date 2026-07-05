---
title: "Ten of Twelve Were Guesses: Auditing the Seeds of a Deterministic Registry"
description: "Twelve entries seeded the source registry. Two had real evidence behind them. Ten were AI guesses stored in a file that looked like confirmed facts. How I reconstructed evidence from the ingest history — and what it means when confirmed and unconfirmed data look identical in a system you built to prevent guessing."
pubDate: 2026-06-26
lang: en
tags: [pkm, ai-llm, automation]
draft: false
translationKey: building-llm-pkm-in-public-ep8
series: building-llm-pkm-in-public
---

One question started it.

*"Where did these registry entries actually come from?"*

A quick recap: every time I ingest a source, the system assigns it a trust tier — S1 through S4, based on the outlet's track record. The registry (`schema/source_registry.yml`) stores those assignments so future sessions don't have to re-derive them from scratch. Once an outlet is confirmed, it's confirmed. The judgment persists.

That was the design. Then I asked about the twelve entries I'd seeded the registry with when I first built it.

## "I made those up."

The agent's answer was honest.

"Those entries were based on general knowledge at the time of registry creation. None of them have been verified by you directly."

Twelve entries. Two had real evidence behind them. The other ten were the agent's best guesses about what those outlets were probably worth — stored in a file that looked, for all practical purposes, like confirmed facts.

The problem went deeper than data quality. The entire point of the registry was to stop re-guessing things that had already been confirmed. But the registry's own seed data was exactly the kind of unconfirmed guessing the registry was meant to replace. **The system I built to prevent this problem had this problem baked in from the start.**

## Reconstructing evidence from what already existed

Manually re-verifying ten outlets from scratch wasn't realistic. So I tried a different approach.

The wiki already held ingest records for over 300 sources. Each had a domain and a recorded trust tier. The tier is a function of both source type (S-axis, fixed per outlet) and verifiability (V-axis, varies per article). If a single outlet appeared across multiple ingested sources, the pattern of tiers across those appearances would be consistent only with one S-axis value — the right one. That's real evidence, derived from actual usage history, not a fresh guess.

I wrote `tools/backfill_registry.py` to run that check automatically: scan the full ingest history, find outlets with enough historical appearances to produce a unique S-axis match, and flag or correct the registry accordingly.

One correction came back immediately. `uxdesign.cc` was recorded as S3. Across its 7 historical sources, the tier pattern matched only S2. My original guess had been wrong, and the data showed it directly. Six other outlets got new or updated entries that the backfill could confirm. The remaining four stayed marked "insufficient evidence" — and that's the right outcome. An honest "we don't know yet" is better than a confident wrong answer.

## What I actually learned

The lesson here isn't about YAML files or tier systems.

When you build a system with an AI agent, the data the agent generates and the data a human has verified tend to look identical on the surface. Same file format, same structure, same apparent confidence. If you don't explicitly distinguish between the two, they get treated as the same — and the whole system's reliability settles at the level of the unverified entries.

**Without a clear "confirmed" versus "unconfirmed" distinction, system-wide trust can only be as good as the weakest unverified entry.**

The registry now tracks that distinction explicitly. It keeps improving with use: each new ingest either reinforces an existing entry or adds evidence to an unconfirmed one. What's confirmed stays confirmed; what's uncertain stays marked as uncertain until it isn't.

## Next episode

Sources started piling up in the inbox. One at a time, I was careful. But the moment several queued up together, something predictable happened. Next episode, I'll describe what that looked like and how I designed around it.
