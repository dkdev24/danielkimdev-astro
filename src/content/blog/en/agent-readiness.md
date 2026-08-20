---
title: "Agent Readiness: Writing Docs Machines Can Actually Use"
description: "Technical documentation has a second audience now: AI agents. What agent readiness means, where docs fail agents, and how to measure it."
pubDate: 2026-06-20
lang: en
tags: [ai-ready-docs, ai-llm]
draft: false
translationKey: agent-readiness
series: agent-readiness
---

A developer types a prompt. An AI coding agent reads your documentation, generates the
integration code, and opens a pull request. No one on the team wrote that code, and
increasingly no one read your docs the way you assumed they would. That workflow is already
here, and if you ship an API or an SDK it raises one question: are your docs built for an
agent to use, not just a person?

I keep coming back to this because I spent years on the other side of it, writing and
maintaining developer documentation for DRM and streaming, where a single wrong parameter
quietly breaks playback for a subset of users. Agents don't make that problem new. They
make it more expensive.

## What an agent actually reads

Technical documentation was written for humans, and we read it by filling the gaps with
experience. We infer the subtext, resolve ambiguity with domain knowledge, and follow "do
A, then B" even when the prerequisite for A sits in a different document.

An agent works from what the text says explicitly. If a constraint isn't written down, the
agent assumes it doesn't exist. If "A then B" actually depends on finishing C first, and C
lives on another page, the agent does B without C. It handles failure differently too. A
person who hits an error recognizes the missing step. An agent generates retry logic,
infers an alternative, or confidently produces a workaround that looks right and isn't.

## One wrong parameter is enough

Here is the shape I run into most often, stripped of the specifics. An integration has to
prepare content for several client platforms, and those platforms don't all support the same
options. One configuration field accepts two valid values. Call them mode A and mode B. Most
platforms take either one, but a single platform accepts only mode B, and that constraint
lives in someone's head rather than in the docs. Watch what an agent does. It reads that the
field accepts both values, picks mode A because that is what it saw working for the other
platforms, and ships. The build succeeds. Unit tests pass. CI is green. Then users on that
one platform can't load anything, and the error that comes back is generic enough that it
could be almost any layer in the stack.

That is the dangerous shape of these failures: the output looks valid at every checkpoint
and only breaks for a subset of users in production, which is exactly what makes it so hard
to catch before it ships.

There is a quieter version too. Many integrations demand work before any code gets written:
account provisioning, credential registration, third-party approvals. Some of those
credentials are issued by an outside party, available only at a specific account tier, and
take several business days to come through. If the docs don't surface that at the very start
of the flow, the agent walks straight past it.

## Two layers of agent readiness

So how do you measure whether docs are ready? I find it helps to split agent readiness into
two independent layers.

- **Infrastructure layer:** can an agent find and read the docs at all? Are crawlers
  allowed? Is content served as Markdown rather than HTML wrapped in navigation? Is there an
  `llms.txt` (a machine-readable index of your key pages, the way a sitemap serves search
  engines)? Is there an MCP server card? You can check this layer with automated tools.
- **Content layer:** once the agent is reading, does the content actually let it produce
  correct code? Are prerequisites stated before the steps that need them? Are cross-document
  dependencies surfaced where they matter? Are security constraints flagged with the
  consequence of getting them wrong? No tool measures this. You have to trace a real
  integration.

The two are genuinely separate. A site can pass every infrastructure check and still be
full of implicit constraints, and a beautifully written site can be invisible to agents if
the infrastructure isn't there.

### How the infrastructure layer matures

The infrastructure side tends to come together in stages, and it helps to treat them
separately rather than as one flat checklist:

1. **Discoverability:** `llms.txt`, `sitemap.xml`, typed `Link` headers. This tells an
   agent what exists before it reads anything. Without it, an agent landing on a single URL
   is crawling blind.
2. **Governance:** AI-aware robots rules, content-signal declarations, Markdown delivery.
   This controls how agents consume the content. Markdown matters because an agent given
   HTML has to dig the real text out of sidebars and chrome, and constraints get lost in the
   noise.
3. **Controlled interaction:** an API catalog, an MCP server card, OAuth metadata, so
   agents can connect and authenticate without a human steering them.

Stage 1 is a few static files. Stage 3 is real architecture work. Lumping them together is
how remediation effort gets misallocated.

### What goes wrong in the content layer

On the content side, the same failure patterns show up over and over. When I trace an
integration end to end, the gaps cluster into a handful of kinds:

- **Cross-document handoffs.** A step needs something configured in another document, and
  neither document names the dependency.
- **Silent, security-sensitive failures.** A token with the wrong encoding, a stream with
  the wrong encryption scheme: valid-looking output that only fails at runtime.
- **Prerequisites outside the flow.** The account, certificate, or approval you needed first
  is documented as a separate tutorial or a footnote mid-procedure.
- **Platform and environment constraints.** A region, device tier, or SDK-version condition
  buried inside a step instead of flagged up front.
- **Missing error guidance.** Opaque error responses with no map of the distinct failures
  behind them, so the agent writes a catch-all retry instead of handling the real cause.

None of these show up in an infrastructure scan. They live at the handoffs between
documents, which is exactly where most agent failures begin.

## Two ways to measure it

That points to two complementary methods, used together. The first is infrastructure
scanning: tools that score a site's structural readiness. `isitagentready.com` tests bot
access, API catalogs, MCP cards, and OAuth discovery. Fern's Agent Score checks for
`llms.txt` and Markdown availability. No single tool covers everything, so it's worth
running more than one. The second is end-to-end scenario auditing: you follow a complete
customer journey through the docs and ask, at every step, whether the documentation hands
off everything the next step needs. Reading one page at a time and judging it on its own
merits will miss the boundary gaps entirely.

## The fixable part

The encouraging thing is that all of this is a documentation problem, which means it is
measurable and fixable. A constraint existed, it wasn't written down, and an agent acted as
though it didn't apply. Write the constraint down, in the right place, and the failure goes
away for the agent and for the human who was quietly working around it.

I'll keep sharing what I find as I put real docs through this.
