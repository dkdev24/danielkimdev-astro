# Measuring Agent Readiness: A Two-Layer Framework

> **Series:** Can AI Agents Use Your Docs Well? A Practitioner's Analysis — Part 2  
> **Published:** DoveRunner Tech Blog  
> **Status:** Draft — Under Review

---

Agents generate code from what documentation explicitly states. B2B SaaS documentation is full of the implicit constraints, cross-document dependencies, and opaque error responses that agents cannot navigate on their own.

Measuring those gaps requires a framework. This post introduces it: two layers of Agent Readiness, and the two methodologies for evaluating them.

---

## Two Layers of Agent Readiness

Agent Readiness has two layers.

**Infrastructure Layer:** Can an agent discover and access the documentation? Are web crawlers permitted? Is content served as Markdown? Is an llms.txt file present (the AI-equivalent of a sitemap)? Is there an MCP (Model Context Protocol) server card? This layer is measurable with automated tools.

**Content Layer:** Is the documentation content itself sufficient for an agent to generate correct code? Are prerequisites stated before the steps that require them? Are cross-document dependencies surfaced at the point where the dependency matters? Are security constraints marked as warnings, with the consequence of violation stated? Are multi-party coordination requirements — steps that require external approval or delayed provisioning — identified as such within the integration flow?

These layers measure different things. A documentation site can pass every infrastructure check and still contain implicit constraints and missing cross-references that cause agent failures. Conversely, a site with excellent content can be structurally invisible to agents if the infrastructure layer is absent.

Automated tools evaluate the infrastructure layer. For the content layer, no tool can substitute for tracing a complete integration — a methodology covered in detail in Part 4.

---

## The Infrastructure Maturity Model

The infrastructure layer follows a staged maturity model. Agent-friendly technical standards progress through three stages, from discovery to controlled interaction. Each stage represents a distinct failure mode: a documentation site that hasn't reached Stage 1 fails differently than one stuck between Stage 1 and Stage 2.

**Stage 1 — Discoverability:** llms.txt, sitemap.xml, Link headers (RFC 8288 — an internet standard for typed links between web resources). Stage 1 tells an agent what the site contains before it reads anything. Without it, an agent approaching the documentation from a URL starts blind — it has to crawl the site opportunistically, with no structured view of what pages exist or how they relate to each other. An llms.txt file resolves this: it is to AI agents what a sitemap is to search engines — a machine-readable index of key pages with descriptions, so an agent can understand the site's scope without crawling it entirely.

**Stage 2 — Governance:** AI-specific robots.txt rules, Content-Signal declarations, Markdown delivery. This layer controls how agents consume content. Markdown delivery matters because agents that receive HTML must work through navigation chrome, sidebars, and layout elements to extract the actual documentation content, introducing noise and increasing the likelihood that constraints buried in secondary elements are missed. Content-Signal is an emerging standard that declares directly in robots.txt whether AI training, search indexing, and prompt input are permitted, giving the site explicit control over how its content is used by AI systems.

**Stage 3 — Controlled Interaction:** API Catalog (RFC 9727), MCP Server Card, OAuth metadata. Stage 3 enables agents to connect to APIs autonomously and handle authentication without human direction. For organizations building MCP servers, this stage is how agent orchestrators (frameworks that coordinate multiple AI agents working in sequence) discover and connect to those servers — skipping it makes the MCP server invisible to any agent framework that relies on standard discovery mechanisms.

The distinction between stages matters for remediation planning. Stage 1 failures are a few static files and configuration changes. Stage 2 failures require content delivery configuration. Stage 3 is medium-to-long-term architecture work. Treating them as an undifferentiated checklist leads to misallocated effort.

---

## What Content Layer Evaluation Actually Looks For

Infrastructure scanning produces a score. Content layer evaluation produces a different kind of result: a set of specific, documentable gaps at the exact points in an integration flow where an agent would fail.

The methodology is end-to-end scenario auditing. The evaluator traces a complete customer journey through the documentation, step by step — mapping every action to the specific documentation that must support it. The criterion is not whether an individual document is well-written. It is whether the documentation set as a whole, followed in integration order, gives an agent everything it needs to produce a correct result.

Across DoveRunner's documentation — covering both Content Security and Mobile App Security — five failure categories emerged consistently:

**Cross-document handoff gaps.** An integration step requires information produced or configured in a different document, but neither document states the dependency. The agent completes the step in isolation and the dependency is skipped.

**Security-sensitive silent failures.** A constraint whose violation produces output that looks valid but isn't. The token generates with the wrong encoding. The stream packages with the wrong encryption scheme. The format looks correct at every step, and the failure surfaces only at runtime — with an opaque error that doesn't trace back to the cause.

**Prerequisites outside the integration flow.** Account provisioning, certificate registration, or third-party approval is required before integration work can begin, but it is documented somewhere other than the top of the integration guide — as a separate tutorial, a footnote, or a note mid-procedure. The agent starts the integration without it.

**Platform and environment constraints.** A runtime condition — cloud region, device certification tier, SDK compatibility — appears mid-step inside a procedure rather than as a prerequisite warning at the start. The agent reads the step, follows it, and produces configuration that works in one environment but fails in the target environment.

**Missing error handling guidance.** APIs return intentionally opaque error responses. Without documentation enumerating the distinct failure modes behind a generic error, an agent generates a catch-all handler and a retry loop rather than code that can distinguish between a token expiry, a certificate mismatch, and a parameter error.

None of these categories are detectable by infrastructure scanning. They require following the actual integration path through the documentation.

---

## The Two Evaluation Methodologies

Two methodologies work in combination.

The first is **infrastructure scanning**. Specialized tools scan a documentation site and produce a scored assessment of its structural readiness. Cloudflare's isitagentready.com tests bot access controls, API catalog, MCP server cards, and OAuth Discovery. Fern's Agent Score (buildwithfern.com/agent-score) tests llms.txt presence and Markdown availability. These tools measure different layers. Running only one produces an incomplete picture: isitagentready.com does not check for llms.txt at all.

The second is **end-to-end scenario-based auditing**. The auditor traces complete customer journeys through the documentation to verify whether an agent could reproduce each integration using only what is written. Every step maps to specific documentation pages. At each step, the question is: does the documentation hand off everything the next step requires?

Feature-path analysis — reading one document at a time and assessing whether it covers its feature — will miss the gaps at document boundaries. Most agent failures don't originate inside a document. They originate at the handoffs between documents.

---

## What's Next

Both methodologies were applied to docs.doverunner.com, DoveRunner's developer documentation covering Content Security and Mobile App Security.

The next post covers the infrastructure scan results from isitagentready.com and Fern Agent Score. The two scores measure different layers of the same site. Reading them together produces a more complete picture than either in isolation.

---

*This series documents a systematic effort to define — and close — the gaps between DoveRunner's developer documentation and what AI coding agents need.*
