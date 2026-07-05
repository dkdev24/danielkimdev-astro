---
title: "I Spent a Free Weekend Rebuilding a Stalled Side Project with Claude's Fable Model"
description: "After five months away from What If Classics, a free Anthropic Fable weekend pulled me back. What two days of rebuilding actually looked like — and what Fable is like in practice on a Claude Pro plan."
pubDate: 2026-07-06
lang: en
tags: [solopreneur, ai-llm]
draft: false
translationKey: whatifclassics-fable5-revival
---

Five months. That's how long What If Classics had been sitting untouched.

The building-in-public diary I'd been keeping on the project went quiet after Day 33. Traffic wasn't moving, opening the laptop to work on it stopped feeling worthwhile, and eventually I just stopped. The idea stayed alive in my head. The project didn't.

Then Anthropic reopened [Fable](https://www.anthropic.com/news/redeploying-fable-5) for a free weekend. I decided to spend it going back to something unfinished rather than starting something new.

## What the Site Looked Like Before

[What If Classics](https://whatifclassics.com) turns public-domain novels into short choice-driven stories. You drag a card left or right, branch through the plot, reach one of sixteen endings, and collect an MBTI-style character card based on your choices. The interactive core was already built. But everything wrapped around it looked like a blog template painted dark — a landing page, a library section, no visual grammar connecting any of it to the feeling of a game.

The reference for the weekend was [Reigns](https://www.reignsgame.com/): a full-screen dark stage, one card at a time, resource meters along the top. That frame is most of what makes a card-swipe interface feel like playing a game rather than clicking through a website.

## Two Passes

The first pass was the story screen itself. I swapped the plain button interface for a real drag-and-swipe interaction with card tilt physics, and added a 3D flip animation on the ending card reveal. A few hours in, it worked.

The second pass started from a realization: the seam between the new story screen and the rest of the site was jarring. You'd work through a dark, game-like story, hit exit, and land back on a bright static page. The whole site needed the same treatment.

We rebuilt it as one continuous dark stage. The cream card became the only light surface anywhere on the site. Story covers now fan out on the title screen like a hand of cards. Even the blog section was pulled into the same visual space. The frame carries through now, not just the play screen.

## What You Only Find by Playing It

Building to spec and having something actually work are two different things.

On mobile, the ending screen overflowed the viewport with no scroll container. Share and download buttons were physically unreachable. On desktop, releasing the mouse outside the browser window during a card drag left the card frozen mid-swipe — the kind of edge case that only shows up when you use your own project wrong.

The text problem was more systematic. Fable opened all 640 story nodes across the six packs, measured character counts, identified the nodes running too long for a phone-size card, and trimmed them. That's not something I would have tackled manually. I described the problem, handed it over, and it got handled.

## What Fable Is Like in Practice

The results over two days were real. A dark-painted blog template became something that actually plays like a game. Fable also ran a clean Astro framework upgrade from v5 to v7, in two stages, alongside all the visual work.

The practical constraint worth naming: on the Claude Pro plan, Fable burns through the five-hour usage window in roughly 30 to 40 minutes. Each session required planning upfront, a push to extract as much progress as possible before the cutoff, then waiting for the next window. The free event is over, so I'm back on my regular model. Usage-based pricing is hard to justify for a project with no revenue yet.

One more honest note: I didn't write a single new story pack this weekend. All six packs kept their content exactly as written. Only the way they're presented changed. That felt more significant than I expected — the same six stories, in a new frame, feel like a different thing entirely.

## What Comes Next

Two face-down cards sit on the story list page, placeholders for packs still in the works. Whether I write new stories first or tighten up the gameplay first, I haven't decided. The project is no longer in a drawer.

Project-level updates live in the [Building in Public diary](https://whatifclassics.com/blog) on the What If Classics site.
