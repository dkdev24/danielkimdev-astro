---
title: "Adding a Lightweight Local Search to a 2-Million-Word Wiki"
description: "My wiki's raw sources passed 2 million words, and reading whole index files started to break down. Here is how I built hybrid search on SQLite and static embeddings after ruling out a heavier tool, and how I got agents to use it without being told the command."
pubDate: 2026-10-21
lang: en
tags:
  - pkm
  - ai-llm
  - ai-knowledge-mgmt
draft: false
translationKey: building-llm-pkm-in-public-ep11
series: building-llm-pkm-in-public
---

**What you'll get from this post**

- A hybrid search setup for a markdown wiki or docs repo that runs locally with no API key. It combines SQLite FTS5 keyword search with static embeddings for semantic search (vectors looked up in a precomputed table instead of running a transformer), and the whole index is a single file of about 16 MB.
- Measured costs for build time, index size, memory and query time, so you can check them against your own machine.
- Why I ruled out qmd (over 2 GB of models) and bm25s, so you can judge the same trade-offs at your corpus size.
- Three ways to get an AI agent to use a search tool without being told the command: an [AGENTS.md](https://agents.md) rule, a project skill and a forgiving script.

**Good fit:** you keep a growing markdown knowledge base that agents read, and whole-file reading or grep is starting to fail.

**Not for you:** your notes still fit in one context window, or you need search at production scale.

**Keep in mind:** the quality check here is only 20 queries, so treat the scores as early.

The `raw/` folder in my wiki has passed 2 million words. It holds about 760 clipped articles, and 761 summary files built from them. Until now, an agent looking for something in this wiki had two options: read `index.md` and `raw-index.md` in full, or grep for keywords.

The trouble is that `raw-index.md` is already close to 15,000 words, and every ingest session, where I add new sources to the wiki, adds another 15 to 20. Soon it won't fit in a context window. Grep can't answer a question like "is there evidence that llms.txt actually helps agents?", because it only finds pages that contain the exact keywords.

## The constraint: light, and runnable anywhere

I work on this wiki from Windows, a MacBook, and a cloud Linux VM, and none of them has much storage or memory to spare. So when I asked [Claude Code](https://claude.com/product/claude-code) to research search tools, I gave it a few conditions.

- It runs locally and needs no API key.
- It handles both keyword queries and natural-language questions.
- It handles Korean, since some of my sources are in Korean.
- The index is a derived artifact. It stays out of git and can be rebuilt from the markdown at any time.

## How I narrowed the options

The first tool Claude Code recommended was [qmd](https://github.com/tobi/qmd). It's a markdown search tool that combines BM25 keyword search, vector search and LLM reranking, and it ships an [MCP](https://modelcontextprotocol.io) server. On features it was a good match for this wiki. But it downloads three GGUF models (about 300 MB for embeddings, 640 MB for reranking and 1.1 GB for query expansion), which adds up to more than 2 GB. I judged that too heavy for a handful of wiki lookups on my machines and asked for lighter alternatives.

Claude Code's lighter proposal has three parts. Keyword search uses [FTS5](https://www.sqlite.org/fts5.html), which is built into SQLite and ranks with BM25. Semantic search uses static embeddings from [Model2Vec](https://github.com/MinishLab/model2vec). Instead of running a transformer, Model2Vec looks vectors up in a precomputed table. According to the project, that keeps the model to a few MB or a few tens of MB and lets it run on a CPU. The two ranked lists are merged with Reciprocal Rank Fusion (RRF), which uses only rank positions and needs no score calibration.

I asked whether [bm25s](https://github.com/xhluca/bm25s) could replace FTS5 for the keyword stage. Claude Code checked its documentation. Its speed and memory advantages matter at millions of documents, and my wiki has about 5,000 chunks (the pieces pages are split into). Claude Code also couldn't confirm incremental updates or metadata filtering in its documentation, so we stayed with FTS5. If search ever gets slow, only the keyword stage needs to change.

## How it's built

The index covers `wiki/` and `raw/summaries/`. It doesn't index the full source articles. The search finds the summary first, and the agent opens the source only when it needs the exact wording. Each markdown file is split by heading into chunks of at most 400 words, and frontmatter values such as page type and source tier are stored as filters. Vectors live inside the same SQLite file, so the whole index is one file.

## What I measured

Claude Code ran the measurements on Windows, over 956 files and 5,333 chunks.

| Measure | Keyword only | With vectors |
|---|---|---|
| Build time | about 3 s | about 6 s |
| Index size | 12.5 MB | 15.7 MB |
| Memory per query | about 36 MB | about 92 MB (peak about 147 MB) |
| Query time | about 10 ms | about 0.3 s (about 1.3 s when the model loads) |

One thing came out larger than I expected. The Python virtual environment with model2vec and numpy takes about 110 MB. The dependencies, not the model, take most of the space.

## Checking quality with 20 queries

I asked for an evaluation set, and Claude Code wrote 20 queries: 8 keyword, 8 conceptual (natural-language questions) in English, and 4 in Korean. It chose the expected pages from each query's topic before looking at any search results, and only checked that the files exist. The table shows how often the right page landed in the top 5 (hit@5).

| Query type | Keyword | Vector | Hybrid |
|---|---|---|---|
| Keyword (8) | 1.00 | 0.88 | 1.00 |
| Conceptual (8) | 0.75 | 0.75 | 0.88 |
| Korean (4) | 1.00 | 1.00 | 1.00 |
| All (20) | 0.90 | 0.85 | 0.95 |

Hybrid scores highest, but I don't want to overstate the gap. On conceptual queries it found one more page out of eight, and mean reciprocal rank (MRR), which also rewards ranking the right page higher, is 0.78 for keyword search and 0.79 for hybrid. My expected-page lists aren't exhaustive either, so some correct but unlisted pages were counted as misses. And the Korean queries all succeeded partly because each had a distinctive word, so I can't say Korean tokenization is solved.

## Getting agents to use it

A search tool does nothing if the agent doesn't know it exists. Claude Code set up three things so I don't have to name the command every time, and I reviewed and approved the AGENTS.md wording first.

- **A rule in AGENTS.md.** It tells agents to run the search before reading the index files or grepping. Every session reads that file, so every agent sees the rule.
- **A project skill.** A skill is an instruction file that Claude Code loads when its description matches the task. Mine says to use it when finding wiki pages by keyword or question. It also holds the new-machine setup steps.
- **A forgiving script.** A bare `python` call re-runs itself inside the virtual environment when one exists. Without it, the script falls back to keyword search and says so, and it builds the index on the first query if none exists. `reindex.py`, which runs at the end of each ingest, refreshes the index too.

To check, I had Claude Code start a fresh non-interactive session and ask a question without mentioning the tool: "What is the evidence for and against llms.txt actually helping agents?" The agent in that session ran the search command first, opened the top result and answered from it. It didn't grep or read the index files. But that was one query on a topic the wiki covers well, so it's weak evidence that the rule works. Short acronym questions and Korean questions still need testing.

## What's left

- Twenty queries and one session are a small sample. The set should grow to about 40 with questions I actually ask.
- Static embeddings may be weak on subtle conceptual queries, so I want to try a larger embedding model on the ones it missed.
- Each new machine needs a one-time virtual environment setup. Skipping it still gives you keyword search.

## Conclusion

Helping agents find their way around a 2-million-word wiki didn't require a large model. A small static embedding and SQLite kept the whole index under 16 MB, and the benefit showed up on conceptual queries, though only as one more hit out of eight. The validation is still early. Getting agents to use the search mattered as much as building it, and I think that part needs a longer watch.

That covers how I added local search to the wiki. If you run a different setup on a wiki or docs repo of similar size, I'd like to hear what you chose.

### References

- [qmd](https://github.com/tobi/qmd): local markdown search tool (BM25, vectors, LLM reranking, MCP)
- [SQLite FTS5](https://www.sqlite.org/fts5.html): SQLite's built-in full-text search extension
- [Model2Vec](https://github.com/MinishLab/model2vec): static embedding library
- [bm25s](https://github.com/xhluca/bm25s): NumPy-based BM25 implementation
