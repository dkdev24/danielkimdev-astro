---
title: Tutorial Videos as Code — HyperFrames & Claude
role: Developer Advocate
org: DoveRunner
period: 2026–present
summary: Rebuilding DoveRunner's product tutorial videos as code — HyperFrames compositions, real Console captures, synthesized narration and captions, written and maintained with Claude — so a UI or docs change means a re-render, not a re-shoot.
category: devrel
tags: [drm-content-security, automation, ai-llm]
lang: en
featured: false
order: 2
links:
  - label: Videos in DoveRunner Lab Academy
    url: https://lab.doverunner.com/academy
  - label: HyperFrames
    url: https://github.com/heygen-com/hyperframes
---

DoveRunner's integration tutorials on YouTube predated the rebrand from PallyCon, and the
Console they showed had moved on. Re-recording, re-editing and re-voicing every video each
time the product changes doesn't scale, so I treated it as a maintenance problem, not a
production one.

Each tutorial is now a project in one repository: a tutorial spec and narration script
checked against the current docs, real Console captures with redactions and measured
highlight boxes, and scenes built as [HyperFrames](https://github.com/heygen-com/hyperframes)
HTML compositions on a shared component library. Narration is synthesized and
caption-aligned locally, a music bed is carved to the timeline, and the whole video renders
deterministically. Claude does most of the scene building, timing and tooling; a human
approves the narration before any voice is generated and the technical accuracy before
anything is published.

What started as a single-video proof of concept in September 2026 is now the production
path. Tutorials on CLI packaging, license tokens, playback testing, DRM packaging with AWS
Elemental MediaConvert and MediaLive/MediaPackage, Transcoding & Packaging and forensic
watermarking are published as lessons in [DoveRunner Lab](https://lab.doverunner.com/academy).
