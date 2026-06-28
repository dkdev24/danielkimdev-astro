# What Agent Readiness Means for Technical Documentation (And Why It Matters Now)

> **Series:** Can AI Agents Use Your Docs Well? A Practitioner's Analysis — Part 1  
> **Published:** DoveRunner Tech Blog  
> **Status:** Draft — Under Review

---

A developer types a prompt. An AI coding agent reads the documentation, generates integration code, opens a PR. This is already happening in agentic coding workflows, where every API provider's documentation is heading.

For API and SDK providers, this shift has one implication: **Is our documentation built for agents to consume?**

This post is the first in a series applying that question to DoveRunner's developer documentation. DoveRunner is a B2B SaaS platform with two major product lines: Content Security and Mobile App Security. Content Security covers Multi-DRM (Digital Rights Management for protecting video content), forensic watermarking, distributor watermarking, and anti-piracy. Both product lines expose complex developer-facing APIs and are subject to the failure modes described here.

---

## What "An Agent Reads" Actually Means

Technical documentation was written for humans. Humans read it while inferring subtext, resolving ambiguity with domain knowledge, and filling gaps with experience. They understand "do A, then B" even when the prerequisite for A is buried in a different document.

Agents operate differently. An agent generates code from what is explicitly stated in the documentation. If a constraint isn't written, the agent assumes it doesn't exist. If "A then B" requires completing C first — where C is documented elsewhere — the agent generates B without C.

Agents also handle failures silently. A human encountering an error message will recognize the missing step. An agent receiving an error will generate retry logic, infer an alternative approach, or — worse still — confidently produce a workaround that appears correct but isn't.

This is the expected default behavior when documentation leaves constraints implicit. Later in this series, scenario-based testing will put that expectation to the test and show whether it holds in practice.

---

## Why B2B SaaS API Documentation Is Especially Challenging

B2B SaaS API documentation differs from consumer API documentation.

Consumer APIs — weather APIs, maps APIs — are straightforward. A single endpoint, a few parameters, a response schema. Agents handle these well.

B2B SaaS is another category. DRM integration, for example, requires connecting a complete chain: packager (encrypts and packages video) → CDN (delivers it) → player (plays it on the user's device) → license server (authorizes each playback request). Configuration values scattered across different documents must align at every stage. The three major DRM systems — FairPlay (Apple), Widevine (Google), and PlayReady (Microsoft) — each require different encryption schemes. FairPlay only works with CBCS (the HLS-native encryption scheme), not CENC, which Widevine and PlayReady use.

Consider what happens when that constraint is not documented explicitly. An agent reads the packager documentation, notes that `encryption_scheme` accepts both CENC and CBCS, and generates packaging code using CENC — the same scheme it observed working for Widevine. Nothing in the documentation warned otherwise. The packaging job succeeds. Unit tests pass. The CI pipeline clears. Streams are deployed to production.

But iOS users cannot play them.

The devops team investigates. The error is a generic DRM decryption failure — it could be the CDN configuration, the player version, the license server, or the packaging parameters. Hours of debugging lead back to a single wrong parameter value in the packager config. 

This category of failure — a constraint whose violation produces output that looks valid but isn't — is the most dangerous pattern in B2B SaaS integration. The packaging succeeds, the tests pass, and the break surfaces only for a subset of users in production, which is exactly what makes it so hard to catch before it ships.

B2B SaaS also imposes setup overhead before any integration work begins. Account setup, certificate registration, and multi-service dependencies must be completed first. In our experience, FairPlay certificate registration requires Apple Developer Account Holder credentials (a specific permission tier within the Apple Developer Program, not available to standard developer accounts) and three to seven business days of Apple processing time. If the documentation doesn't surface this dependency at the start of the integration flow, the agent proceeds without it.

---

## What Comes Next

These failures share a common structure: a constraint existed, was not documented explicitly, and an agent generated code as though the constraint didn't apply. The failures described here are documentation problems — measurable and fixable.

The next post introduces the framework for measuring it: two distinct layers of Agent Readiness, and the methodologies for evaluating each one.

---

*This series documents a systematic effort to define — and close — the gaps between DoveRunner's developer documentation and what AI coding agents need.*
