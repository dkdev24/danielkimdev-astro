---
title: "Measuring How Well My Wiki Search Actually Finds Things"
description: "My wiki search scored 0.95 on 20 queries, then 0.70 on 40 harder ones. Here is how I built the evaluation sets, which ideas failed, and which two changes raised the English score from 0.80 to 0.97."
pubDate: 2026-10-21
lang: en
tags:
  - pkm
  - ai-llm
  - ai-knowledge-mgmt
draft: false
translationKey: building-llm-pkm-in-public-ep12
series: building-llm-pkm-in-public
---

**What you'll get from this post**

- A way to build search evaluation sets that don't flatter your system: a dev set, a held-out set you score only once, mixed query types, and expected pages chosen before any search runs.
- Why my score fell from 0.95 to 0.70 once the queries got realistic, and what that says about small, self-written test sets.
- Two nearly free changes that raised English hit@5 (how often the right page lands in the top 5 results) on the 30-query held-out set from 0.80 to 0.97: a page overview chunk and agent query rewriting. The post covers how each works and what it measured.
- Two ideas that didn't pay off, replacing a query with its translation and switching to a bigger embedding model, so you can skip them.

**Good fit:** you run search over a personal wiki or docs repo that agents query, and you want to know whether a change really helps.

**Not for you:** you want a finished Korean search recipe, since Korean is parked.

**Keep in mind:** the held-out set has only 30 queries, so the gaps are small.

In [the last episode](/blog/building-llm-pkm-in-public-ep11/), the local hybrid search I added to my wiki scored 0.95 on 20 queries, meaning the right page landed in the top 5 results 95% of the time (hit@5). But [Claude Code](https://claude.com/product/claude-code) wrote those 20 queries, and many of them reuse the topic words of the target page, so they don't look much like the questions I actually ask. This time I decided to measure more honestly before trying to improve anything.

## Three kinds of evaluation set

I kept the original 20 queries as a dev set and had 20 more written the same way, for 40 in total. I also added a held-out set, which is written once and never tuned against. The idea is to choose settings on the dev set and then check on the held-out set, once, that the choice really helps. If you tune against the same queries you score on, you end up with settings that only fit those queries.

The queries come in several kinds: exact terms, paraphrases of the same idea, loose questions that share almost no words with the answer page, questions with several correct pages, and questions that cross between Korean and English. For example, one loose query was "why the same AI model gives different answers and how designers should handle that". Its answer page is `probabilistic-design`, and the query never uses the word "probabilistic".

For each new query, Claude Code picked a page at random, wrote a question without using the page's title words, and chose the expected pages before running any search. I reviewed all 40 generated queries and found them fine. Then I gave it five Korean questions I really want to ask my wiki. Claude Code proposed the expected pages for those, and I accepted them as they were.

## The first scores were much lower

| Set | Hybrid hit@5 |
|---|---|
| Original 20 queries | 0.95 |
| Dev set, 40 queries | 28/40 (0.70) |
| My own 5 questions | 1/5 (keyword only 2/5, vector only 0/5) |

Exact terms were fine, with 12 of 12 found. Loose queries scored 0 of 4, and Korean-to-English or English-to-Korean queries scored 0 of 3. My own questions did worst, since they are long Korean sentences.

## What didn't work

**Translating queries.** I suggested having the agent translate a Korean query into English, since the embedding model is English-focused. Claude Code wrote the translations and tested them. Replacing the original query with its translation dropped the score from 28/40 to 17/40, because pages are stored in their original language and a Korean page has to be matched with Korean words. Keeping the original query and adding the translation did help. On the held-out set it found three more Korean queries. Translating English queries into Korean added nothing.

**A bigger embedding model.** I tried a retrieval-tuned model ([potion-retrieval-32M](https://huggingface.co/minishlab/potion-retrieval-32M)) that takes 125 MB on disk, against 30 MB for the default. On the dev set it went from 28/40 to 27/40, and the extra size was past the +50 MB limit we had set, so I dropped it and didn't score it on the held-out set.

**Hybrid search on Korean.** On the held-out set, Korean queries with an English translation added got 17 of 19 right with keyword search, 7 with vector search, and 12 with the hybrid. The English-focused model embeds Korean badly, and merging the two lists seems to have buried results the keyword search had found. The dev set pointed the other way, with hybrid slightly ahead, so with this little data I can't draw a firm conclusion.

## Switching to English first

At this point I changed priorities. Most of my questions and most of the wiki are in English, so I decided Korean search quality could wait. On English queries alone (26 from the dev set plus 19 from the held-out set, 45 in total), keyword search found 30, vector search found 30, and the hybrid found 33. For English, merging the two beats either one, so I judged the design sound. The remaining weakness was loose queries.

## The two changes I adopted

I wrote a new English held-out set of 30 queries, froze it before running any experiment, and tested two ideas.

**A page overview chunk.** Each page gets one extra chunk made from its description, aliases, and first 45 words, and that chunk is searched like any other. Body chunks are cut at sentence boundaries, so the gist of a whole page can be missing from them. A variant that prepended the title and description to every chunk's embedding didn't help, and I dropped it.

**Agent query rewriting.** The agent calling the search adds two or three short English keyword queries to the question. A Claude Code subagent (a helper agent spawned separately from the main session) wrote the rewrites. I gave it only the query text and a one-paragraph description of the wiki's topics, and it never saw the pages or the answer keys.

| Setting | Held-out (30 queries), hybrid hit@5 | MRR |
|---|---|---|
| Baseline | 24/30 (0.80) | 0.71 |
| Agent rewrites | 27/30 (0.90) | 0.70 |
| Page overview chunks | 27/30 (0.90) | 0.79 |
| Both | 29/30 (0.97) | 0.80 |

MRR is the mean reciprocal rank, which is higher when the right page ranks nearer the top.

The two changes added up, and the 26 English dev queries showed the same direction (20 correct at baseline, 24 with both). The cost is about 2 MB of extra index and no new dependency. I decided to adopt both. Claude Code made the overview chunk the default and added the rewrite rule to the skill and to [AGENTS.md](https://agents.md).

## Will an agent really add the rewrites?

I had Claude Code open a fresh session and ask a question without mentioning the tool, about how an AI product should treat users waiting for an answer. The agent in that session added two rewrites to its query on its own, opened the top page, and answered with sources. That is one query, so it's too early to say the rule holds reliably.

## Limits

- With 30 held-out queries, one query is worth 3.3 points, so 27/30 versus 29/30 is a small gap.
- This held-out set is spent for these settings. Any further change needs a new set.
- Some answer lists are probably incomplete, so a correct page that wasn't listed counts as a miss. I haven't yet pooled the top results from every setting and judged them again by hand.
- Korean queries are parked, not solved.

## Conclusion

The score dropped from 0.95 to 0.70 because the queries became more realistic, not because the search got worse. Only after building an honest query set could I tell which ideas actually work. The bigger model I tried, which looked like the obvious upgrade, did nothing, and two nearly free changes raised the score. The sample is small, though, so if you ran a similar setup on a wiki or docs repo and got different results, I'd like to hear which settings you used.

That covers how I measured and improved the search in my wiki.
