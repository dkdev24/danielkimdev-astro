---
title: "What a Five-Month Stall Taught Me About Working With AI"
description: "Returning to What If Classics after five months with Fable clarified something about AI-assisted work: the bottleneck isn't execution — it's knowing how to package a problem before you hand it over."
pubDate: 2026-07-06
lang: en
tags: [solopreneur, ai-llm]
draft: false
translationKey: whatifclassics-fable5-revival
---

Five months is a long time for a project to sit untouched. [What If Classics](https://whatifclassics.com) had been in that state since Day 33 of my building-in-public diary. Traffic wasn't moving, the inertia built up, and eventually the project settled into a drawer.

Then Anthropic reopened [Fable](https://www.anthropic.com/news/redeploying-fable-5) for a free weekend. I used it to go back to something stalled rather than start something new. The site is working now — but I want to write about what the process clarified, not the implementation.

## The Real Problem With a Stalled Project

Looking back, the issue wasn't motivation. It was that I didn't have the project decomposed into units small enough to hand off.

Working with AI has changed what "ready to work" means to me. Before, ready meant having time and energy. Now it also means having a problem statement clear enough to delegate. A vague goal — "make this feel more like a game" — doesn't move. A specific problem — "replace the button-click choice interface with a drag-and-swipe interaction and add card tilt physics" — does.

The five-month stall wasn't a motivation problem. It was a decomposition problem.

## Session Architecture Under a Hard Constraint

Fable on the Claude Pro plan burns through the five-hour usage window in roughly 30 to 40 minutes. That's a tight constraint. But tight constraints can force something useful: you can't waste a session on vague exploration when it resets that fast. Each session needs a defined scope and a concrete deliverable before you open the laptop.

This is what makes AI collaboration productive regardless of which model you're using. The time constraint just made the discipline visible. I planned the work in two chunks — the interactive core of the story screen first, then the whole site's visual frame — and that planning came before any code ran. The session was execution. The architecture was the upstream work.

## What You Delegate vs. What You Direct

The sharpest example from the weekend was the text length problem.

Playing through the site on my phone, I noticed the card text often ran long enough to require pagination — friction that breaks the pacing of a choice-driven story. The fix required auditing every text node across six story packs.

640 nodes.

I described the problem. Fable opened all of them, measured character counts, identified the ones exceeding the mobile-card threshold, and trimmed them. That's not a task I would have approached directly — not because the individual edit is hard, but because I never would have framed it as a tractable single task. The mental overhead of organizing that audit would have been enough to defer it indefinitely.

The same pattern holds across a lot of AI-assisted work: certain tasks become visible as discrete, delegatable units only when you have a collaborator who can handle the scale. Recognizing which problems belong in that category is where the real skill sits — not in prompting.

## The Frame Insight

The most unexpected thing about the weekend: I didn't write a single new story.

All six existing story packs kept their content exactly as written. What changed was the visual frame and how the whole site presents itself. The result felt like a fundamentally different project.

This is a pattern that shows up in knowledge architecture too. The substance doesn't always need to change. Structure around the substance is often the work that gets deferred because it doesn't feel like "real" production. The Fable weekend was a reminder that framing is as substantive as content — and that AI can make the structural work tractable in a way it wasn't before.

## Where This Leaves the Project

The project is out of the drawer. Two face-down cards sit on the story list page, placeholders for packs still in progress. Whether new stories come first or gameplay refinement comes first, I haven't decided.

What I have decided is that the session-planning discipline from this weekend is worth keeping — even now that the free event is over and I'm back on my regular model. The constraint that forced it is gone. The habit shouldn't be.

Project-level updates live in the [Building in Public diary](https://whatifclassics.com/blog) on the What If Classics site.
