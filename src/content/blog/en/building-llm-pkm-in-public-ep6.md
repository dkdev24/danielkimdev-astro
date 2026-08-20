---
title: "I Thought It Was My Thinking: How AI Quietly Takes Over Your Judgment"
description: "Every summary Claude returned seemed obvious, until I realized my own impressions were being shaped by Claude's framing before I'd formed any of my own. What Sofia Quintero's essay helped me see, and how I built a friction step into my ingest workflow."
pubDate: 2026-06-11
lang: en
tags: [pkm, ai-llm]
draft: false
translationKey: building-llm-pkm-in-public-ep6
series: building-llm-pkm-in-public
---

A habit doesn't feel like a habit until you step outside it.

Every time a new article came in, I had a fixed sequence: drop the link into Claude, read the summary, think "yep, that tracks," approve it. Done.

Then one day, before sending anything to Claude, I read the title and the first two paragraphs on my own. Just to ask myself: *What does this piece seem to argue? What do I think about that?* Then I looked at Claude's summary.

They were nearly identical. What unsettled me was how natural that similarity felt.

## Agreeing is not the same as being absorbed

I'd felt like I was thinking independently. But my actual thoughts had already been shaped by the way Claude frames things.

Researchers call this **algorithmic sycophancy**: the tendency of AI models to respond in ways that align with what the user seems to want to hear. But what I experienced was a quieter version of that. The AI wasn't adjusting to my views. My views were being formed inside the AI's frame.

When you hand a source to the AI first, its interpretation becomes your initial impression. And first impressions are stubborn. Even when I read carefully afterward, I was reading inside a frame that was already set.

## Injecting friction on purpose

What helped me name the problem was Sofia Quintero's essay, ["You're not getting smarter. You're getting more confident."](https://sofiaqt.medium.com/youre-not-getting-smarter-you-re-getting-more-confident-2f3ba6b8da46) She argues that AI is most dangerous when it sounds right, when fluent, well-structured output creates an illusion of verification. You stop thinking not because you've confirmed the answer, but because the answer *feels* confirmed. Reading that piece, I recognized exactly what was happening in my ingest routine.

So I formalized a principle I call **Friction-Injection** and built it into my wiki workflow.

The rule is simple: **before giving a new source to the AI, form at least a minimal judgment on your own first.** Reading the title and the first two paragraphs is enough. Just enough to answer: *What does this piece seem to be arguing? What's my initial reaction?* Then hand it over.

It felt inefficient at first. I'd built the AI workflow precisely to save time, and here I was deliberately slowing it down.

But two things changed once I started doing it consistently.

First, I started disagreeing with Claude's summaries. Parts of the summary that I'd previously nodded through now had a point of comparison. My own preliminary read gave me something to push back against.

Second, the notes I wrote changed character. Before: *"This piece argues X."* After: *"This piece argues X, but I'm uncertain about the part where it claims Y."* The first version captures Claude's interpretation. The second version is mine.

## The deeper question: where is my thinking in this system?

Most discussion of AI-assisted PKM focuses on efficiency, how fast you can process sources, how clean your wiki looks. That matters. But the question I've come to care about more is different.

*Inside this system, where does my thinking actually live?*

Friction-injection keeps my own reasoning present and active inside a workflow that can very easily run without it, rather than just slowing things down. The system doesn't need my judgment to keep moving. That's the point of building it. But if it keeps moving without me, then the knowledge base it builds isn't really mine.

## Next episode

Up to this point in the project, every source was judged from scratch: the same outlet, the same author, evaluated fresh each session, by whichever model happened to be running that day. Next episode, I'll cover how I finally gave that judgment a memory.
