---
title: "What I Learned Building DoveRunner Lab and Nine Tutorial Videos with Claude as a Product Owner"
description: "How I built DoveRunner Lab, a developer onboarding site, and nine tutorial videos in a month with Claude Code as a product owner, and what I left to the AI versus what stayed a human job."
lang: en
translationKey: doverunner-lab-ai-workflow
tags: [ai-llm, automation]
pubDate: 2026-10-15
draft: false
---

Software tutorial videos have a shelf life. Product screens and menus shift a little with every release, but a video stays frozen on the day it was recorded. The YouTube tutorials for the products I work on were no exception. They predated our rebrand from PallyCon to [DoveRunner](https://doverunner.com/), so the menus and commands on screen no longer matched, and when I audited one, 9 of the 17 factual claims in its narration were out of date or incomplete.

Security products add one more twist: the better they work, the less you see them. When content protection works, a demo looks like ordinary video playback, and when something breaks, a developer trying it for the first time can hardly guess why.

I work at DoveRunner as a product owner and in developer relations, and from mid-September I spent about a month on both problems at once. One half was DoveRunner Lab, a public developer site where customers and colleagues alike can learn our security products. The other half was rebuilding the tutorial videos that live inside it, this time as code. [Claude Code](https://claude.com/product/claude-code), an AI coding agent, wrote almost all of the code. In this post I'll skip the tech stack and cover the problems I set out to solve and what working with AI was actually like: what went well, and what stayed a human job. To give away the ending, the quality of the result depended less on how capable the AI was and more on where I put the checkpoints.

## Overview

Both projects started from the same question. What does someone new to DoveRunner need in order to play protected content on their own and, if it fails, understand why?

- **The tutorial video project**: rebuilding our tutorials as code with [HyperFrames](https://github.com/heygen-com/hyperframes), an open-source framework that composes and renders video from HTML. It started on September 16, 2026 as a one-video proof of concept. Nine videos later, every one of them is a lesson in the Lab Academy.
- **DoveRunner Lab**: a site with two parts. The Playground shows, in real time, what the security features are actually doing while a protected video plays. The Academy holds getting-started courses for each product. The first commit came a week after the video project, on September 23, and the site went public at [lab.doverunner.com](https://lab.doverunner.com) on October 12.

## Treating video as a maintenance problem

Reshooting the old videos wouldn't have fixed anything for long. Every time the Console or the docs change, a recorded video needs new screen captures, new edits, a new voice-over, and new captions. So I put one principle into the plan: **"Optimize for the second and tenth video, not the first."**

That turned each video into a project. The repository holds a tutorial spec and narration script checked against the current docs, real Console captures, and the scenes built in HTML, while scripts generate the voice-over, captions, and music bed. To fix one line of narration, I regenerate the voice and captions for that scene and re-render the whole video.

Claude took on more of this than I expected. It pulled the transcript of the old video and fact-checked it against the current docs, drafted storyboards and narration, built the scenes and a shared component library, and set up the pipeline for speech synthesis and caption alignment. Once the shared components were in place, a new video project often went from empty folder to first render in a day or two. But doing the work also made it clear where AI couldn't be left alone.

- **A narration approval gate.** The speech synthesis script refuses to run until the narration is approved, and any edit to the script clears the approval, so no voice-over gets made from a script I haven't checked. When the real voice-over ran longer than planned and the first video grew from 72 to 90 seconds, I kept the narration I had approved and lengthened the scenes instead.
- **Highlight boxes drawn by eye.** When Claude placed a box over a button on screen, it estimated the coordinates, and the box kept landing on the wrong field. We ended up building a tool that measures an element's real edges in the image, and the project instructions now say never to estimate highlight coordinates by eye.
- **Automated checks miss real problems.** Every automated check passed on videos where a command box overflowed the frame or the wrong logo variant sat on a dark background. Now, before any render, I look at a contact sheet of every scene.
- **Pronunciation.** The speech engine skipped the dots in a domain name and mangled our brand name. My first fix was to spell out the pronunciation in the script, which then showed up in the captions too. So we added a pronunciation dictionary that changes only what the speech engine reads and leaves the captions alone. CMAF, for example, goes to the engine as "See-maff."

## Making invisible security visible

For the Lab, I wrote a one-pager and a staged development plan before any code. I'm a product owner, not a developer, so I decided the things I could control directly were scope and judgment. Every session ran under one rule, **"propose a plan before editing anything,"** and I cut whatever went beyond scope before Claude started. I sized each stage to finish before my Claude subscription's usage limit reset, which works out to one sitting, and kept anything only a person could do, such as [AWS](https://aws.amazon.com/) console work or testing on real devices, out of the sessions.

At the end of every session, Claude records the current state and next steps in a HANDOFF.md file and the version history in WORKLOG.md, and it writes up any decision that's hard to reverse as an Architecture Decision Record (ADR). A new session doesn't remember the previous conversation, so without these files I'd have to re-explain the context every time. Instead, Claude reads HANDOFF.md first and picks up where the last session stopped. By launch there were 27 ADRs.

The moment I remember most is when Claude was confidently wrong. [FairPlay](https://developer.apple.com/streaming/fps/) playback was failing in Safari. Claude first blamed a bug in the open-source player. Then, after fixing four real client bugs, it recorded in an ADR that the cause was a missing FairPlay certificate registration. But a token issued for the same site ID by DevConsole, our existing developer tool, played fine in Safari, and once I confirmed that, the conclusion fell apart. Comparing our requests against the official sample code field by field turned up the real cause: the license request body was encoded differently from the sample, and so was the certificate. **However convincing the AI's reasoning, one working example was stronger evidence.** In a similar case, something I was about to report to another team as a bug turned out to be a stale CDN cache.

Some work was simply mine. Automated browsers don't ship the [Widevine](https://www.widevine.com/) module, so I did every DRM playback test by hand in a real browser, and we recorded that limit as an ADR too. Capturing authenticated Console screens, entering license tokens, and asking another team to change DNS settings were also on me.

## Where the two projects meet

The two projects ended up checking each other. The tutorial videos are packaged, DRM-protected, and forensically watermarked with DoveRunner's own products and then played in the Lab, so every video that goes live also runs the products end to end.

While building the videos, Claude walked through real setups in the AWS and DoveRunner consoles, and that kept surfacing places where the docs and the actual behavior disagreed, such as a dependency missing from an install guide or a setting documented with a different limit than the service enforces. Over the nine videos we collected 54 documentation fixes this way, and the ones I reviewed and accepted are going into the docs.

Building the Lab also meant redrawing the line between it and the docs site. Following the [Diátaxis](https://diataxis.fr) framework, tutorials now live in the Lab and how-to and reference content stays in the docs, and the Multi-DRM quickstart moved from the docs to a Lab course. The goal is to stop maintaining the same content in two places until the copies drift apart.

## How the work split between me and Claude

Looking back on the month, the roles divided roughly like this.

| Area | What I did | What Claude did |
|---|---|---|
| Direction | Decided what to build and what to cut | Proposed plans and alternatives |
| Content | Approved narration and technical content | Checked docs, drafted scripts and storyboards |
| Build | Adjusted scope, reviewed output | Most of the code, scenes, tools, and infrastructure |
| Verification | Tested in real browsers and devices, watched every render | Ran automated checks, diagnosed, fixed |
| Records | Confirmed decisions | Wrote HANDOFF, WORKLOG, and ADRs |

## Closing thoughts

The original one-pager estimated one to two engineers for six to eight weeks for the first phase. In practice, Claude Code and I took about three weeks from the first commit to launch. That isn't a like-for-like comparison, since a few stages moved to after launch.

On this project, the AI coding agent changed how fast I could build, but **quality still came down to where I put the checkpoints**. Where human checks were built into the structure (the narration gate, the contact sheet, real-browser testing), the AI's mistakes got caught before they reached anyone. Where my check came late, as in the FairPlay case, a plausible but wrong conclusion was already in an ADR before I could correct it.

The Lab has only just launched, so it remains to be seen how much it actually shortens the time it takes a developer to play protected content for the first time. Next on the list are mobile reference apps.

That's the story of building DoveRunner Lab and its tutorial videos with AI. If you want to see how DRM and forensic watermarking actually work, try [DoveRunner Lab](https://lab.doverunner.com).
