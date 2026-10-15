---
title: "DoveRunner Lab, an Onboarding Site for Security Products"
role: Product Owner & builder
org: DoveRunner
period: 2026–present
startDate: 2026-09-23
summary: A public developer site where customers and DoveRunner's own teams see content protection working — a reference player with a live DRM/watermark inspector, plus short tutorial courses — built with Claude Code and live at lab.doverunner.com.
category: devrel
tags: [drm-content-security, ott-streaming, ai-llm]
lang: en
featured: false
order: 1
links:
  - label: lab.doverunner.com
    url: https://lab.doverunner.com
  - label: Academy
    url: https://lab.doverunner.com/academy
---

DRM is invisible when it works, so a demo of it looks like ordinary video — and when it
fails, the integrating developer can rarely tell why. DoveRunner Lab makes the security
layer visible and gives new users, customers and colleagues alike, one place to learn it.

- **Playground.** A reference player for DRM-protected, forensically watermarked content,
  with a real-time inspector: DRM system, security level, the license and token exchange,
  key status and errors explained in plain language. Developers can test their own streams
  with their own tokens, plus small tools for everyday integration work.
- **Academy.** Short courses for getting started with Multi-DRM, Forensic Watermarking,
  Transcoding & Packaging, Anti-Piracy and Mobile App Security, with tutorial videos and
  Korean and English transcripts. Lessons link into the Playground and into the product
  docs, which now keep the reference while the Lab keeps the tutorials.
- **Dogfooding by design.** The site runs DoveRunner's own stack end to end — packaging,
  multi-DRM and server-side watermarking on AWS — and its player, inspector and sample token
  endpoint are written as code customers can copy.

I owned it from one-pager to launch: product spec, staged build plan, architecture decisions,
and the build itself, done with Claude Code (Next.js, Shaka Player, AWS CDK). Launched in
October 2026; native mobile reference apps are next.
