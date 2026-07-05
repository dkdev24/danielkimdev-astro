---
title: "What Insight Synthesis Actually Looks Like: The One Point Where DRM Expertise Meets the AI Agent Economy"
description: "Looking for where DRM expertise actually meets the AI agent economy, my first answer was wrong. Here's the retraction, and the one real connection point regulation is already making mandatory."
pubDate: 2026-05-20
lang: en
tags: [pkm, ai-llm]
draft: false
translationKey: building-llm-pkm-in-public-ep3
series: building-llm-pkm-in-public
---

Last episode ended with a question: "What business models become possible when OTT security technology meets AI agents?" This time, I'll walk through how I actually went about answering it, which is how **insight synthesis** actually works in my wiki.

That question hides a trap, though. I've spent years working in content security for OTT (Over-The-Top, internet-based video streaming) services, specifically DRM (Digital Rights Management). My wiki already held sources from two very different domains: content security (DRM) and AI agents. Before connecting them, I had to question myself first: was this a real connection, or was I forcing one just because both domains happen to sit in my own portfolio?

## My First Answer Was Wrong

The first time Claude and I worked through this question, we landed on: "Multi-DRM's trust architecture broadly transfers to an AI agent's authorization system." It sounded plausible. Checking it again, though, it didn't hold up.

Multi-DRM (supporting several DRM standards in a single service) protects the moment a human plays back content. Licenses, the CDM (content decryption module), and device attestation all assume a human viewer. AI agents don't watch movies. Watermarking and anti-piracy are no different: both trace and respond to content a human has already leaked, so neither has anything to do at the moment an agent buys or sells content.

I retracted the conclusion the same day. It was a textbook case of motivated reasoning: forcing a connection because both domains happened to live in my own portfolio, not because the connection was real.

## The One Point That Actually Connects

Starting from scratch, exactly one technology built a real bridge: **content provenance ([C2PA](https://c2pa.org/))**.

C2PA is a standard for attaching cryptographically signed proof to content: where it came from, whether AI generated it, and how it may be used going forward. It answers exactly the question an AI agent has to answer every time it acquires, generates, or redistributes content: what is this, and what rights does it carry?

## Why This Isn't Just a Plausible Story

What makes this connection real, not just plausible, is regulation. Under the EU AI Act, the European Union's AI-specific law, [Article 50](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50) mandates machine-readable marking of AI-generated content, effective August 2, 2026. C2PA v2.3 has already shipped, and OpenAI, Google, and Microsoft are all building [Content Credentials](https://contentcredentials.org/) into their products.

AI agents are already producing content at scale, and regulation now requires it to carry proof of origin. Provenance is moving from a nice-to-have to mandatory plumbing in the agent content pipeline.

## The Gap That's Still Open

The standard, as it stands, only covers origin and AI-disclosure. No standard yet lets an agent bind license and rights terms into that same credential, so it could verify "paid, licensed, and cleared to redistribute" in a single check before transacting. That's worth watching over the next 12 to 24 months.

## What Insight Synthesis Actually Does

Looking back at the whole process, it clarifies what insight synthesis actually does. It isn't stitching two domains together into one tidy conclusion. It's doubting the connection first, discarding most of it, and keeping only the one piece that survives.

One more thing came out of this. The cryptographic signing and verification underneath C2PA is generic PKI (public key infrastructure), not something specific to me. The licensing know-how from the OTT/media business side is scarce: how rights, distribution windows (the release-timing strategy that governs when content moves from theaters to streaming), and territories actually work. The real asset I brought to this connection wasn't the cryptography. It was knowing how content rights actually move.

## Coming Up Next

Work like this, checking evidence back and forth across domains, is the heaviest kind of session my wiki runs. A tight context budget felt like the obvious cost of doing business.

Except the problem actually showed up in the opposite moment. In a session as light as reading one HANDOFF.md file, the context was burning down just as fast. Whatever was actually causing it had nothing to do with the work itself. That's next time.

*Do the two areas of expertise sitting in your own portfolio actually connect to each other? Or do they only look connected because the same person happens to hold both?*
