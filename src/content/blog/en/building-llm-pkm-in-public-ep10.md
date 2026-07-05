---
title: "The Myth That You Have to Read Everything: Weekly Review and a Slack Safety Net"
description: "Of 128 wiki pages, I had personally read almost none. When AI builds every connection, the knowledge graph belongs to the AI — it just lives under your name. How I built a weekly review workflow and a Slack safety net to keep my own thinking in the loop."
pubDate: 2026-07-06
lang: en
tags: [pkm, ai-llm, automation]
draft: false
translationKey: building-llm-pkm-in-public-ep10
series: building-llm-pkm-in-public
---

Ten sources were waiting in the inbox. One of them was a short blog post — the kind that almost gets skimmed past. But the title stopped me.

The argument: when you let AI handle the summarizing and linking in a PKM system, you lose the "germane load" — the productive cognitive effort that actually builds your mental schema. Note-linking isn't administrative overhead. It's the moment you retrieve something from long-term memory and re-encode it in relation to something new. Hand that process to an AI and the knowledge graph looks well-connected, but nothing lands in your head.

I stopped mid-summary. This wasn't about someone else.

I tried to count how many of my own wiki pages I'd actually read since starting this project. The synthesis notes, maybe a handful of post ideas — but of the 128 pages, the vast majority had never been opened by me. Pages I'd approved, pages the agent had linked to other pages, pages that had accumulated into what looked like a coherent knowledge base. Almost none of which had actually passed through my own thinking.

## The worry had a legitimate basis

The problem with this wiki is structural. The ingest pipeline reads sources, assigns trust tiers, writes summaries, and drafts wiki page updates. My role is to approve those drafts. Approval is not internalization.

For a second brain to function as an actual extension of your own cognition, it needs to connect to the brain it's extending. If the AI makes every connection, the graph is the AI's — it just lives under my name.

## The constraint is also real

What I couldn't do was respond to this by reading all 128 pages. On a good day, I have about an hour for this project. Trying to deeply internalize every page would guarantee that I burned out and stopped using the system entirely.

So I shifted the question. Not "how do I reduce AI involvement" but "where should I actually spend my limited time?"

## A narrower scope: 3–5 pages per week

I built a new workflow that selects 3–5 pages each week, filtered by two conditions:

| Condition | Criteria |
|---|---|
| **High-leverage pages** | Sourced from T1/T2 materials, type `synthesis`, or marked `resonance: high` in the ingest summary |
| **Not yet personally reviewed** | The new `daniel_reviewed` field is `no` or absent |

T3/T4 bulk reference sources are excluded by design. It would be dishonest to pretend I'll personally internalize everything a content-aggregation source contributed. That material stays as AI-managed reference. My time goes to the pages where my own judgment matters.

The output accumulates in `meta/weekly-review-queue.md` — an append-only log, dated by week. If a page keeps getting pushed back, that shows up eventually.

## The safety net: what happens when I forget

Once the workflow existed, a different question surfaced: what happens when I don't run it?

Every workflow in this project that requires a manual trigger is one I can fail to run. I'd already seen this happen. The workflow would exist in the docs, and a week later I'd look up and realize I hadn't touched it.

I considered a session-level cron, but two problems ruled it out: it disappears when the session closes, and even while running, it expires after seven days. Not the right tool for a once-a-week reminder.

Instead I used a scheduled cloud routine in [claude.ai](https://claude.ai) — it runs independently of any active session. The routine has one job: every Monday at 9 AM, check whether `meta/weekly-review-queue.md` has been updated in the past seven days. If it has, do nothing. If it hasn't, send me a Slack DM. No alarm every week — only when I've actually fallen behind.

Setting up the Slack channel for this project required connecting a new MCP connector I hadn't configured yet. That came first.

## The first test failed immediately

I ran it as soon as it was set up, rather than waiting until Monday to find out something was broken.

First run: failed. GitHub repository access blocked. I re-authorized and ran it again. Same error. The re-auth had worked at the account level, but the routine's app still didn't have access to this specific repository — a separate permission. Added the repository, ran again. Third attempt succeeded. The Slack DM arrived.

The timing was good: the review queue had no entries at all yet, so the routine correctly flagged the condition and sent the message. I got to verify the full end-to-end path on the first real test.

## Conclusion: the boundary is a decision, not a failure

Running this didn't make the underlying worry disappear. Most of those 128 pages are still AI-built connections that I haven't personally internalized. That's still true.

What changed is that I stopped pretending otherwise. There's now an explicit boundary between what's mine — the pages I've actually engaged with — and what's the AI's. That boundary is maintained, not hidden. Whether it actually holds is something I'll find out in a few weeks, not from a single successful Monday morning Slack message, but from whether I'm still opening those pages when the next one arrives.
