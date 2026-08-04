---
title: "Zork Meets Comic Chat: Turning Two Classic Open-Source Projects Into One Game"
description: "How a chance discovery of two Microsoft open-source releases, Zork and Comic Chat, turned into Grues in Comic, a side project now live in public beta."
pubDate: 2026-08-04
lang: en
tags: [ai-llm, solopreneur]
draft: false
translationKey: grues-in-comic-beta
---

I subscribe to a few developer newsletters, and one of them is [GeekNews](https://news.hada.io/), a Korean service covering dev, tech, and startup news. Late last November, [a GeekNews item](https://news.hada.io/topic?id=24510) caught my eye: Microsoft had released [Zork](https://github.com/historicalsource/zork1), the 1980s text adventure game, under the MIT license. I played plenty of NetHack-style text roguelikes in the '90s, and grew up on graphical adventure games from Sierra (Leisure Suit Larry) and LucasArts (the Monkey Island series). But even at 50-plus, I'd never actually played a text adventure like Zork. It's a classic genre I somehow skipped entirely.

I filed that away as "huh, interesting" and mostly forgot about it. Then last month, [another GeekNews post](https://news.hada.io/topic?id=31503) grabbed my attention. Microsoft had done the same thing again, this time open-sourcing [Comic Chat](https://github.com/microsoft/comic-chat), a 1990s IRC client. Like Zork, I'd never even heard of Comic Chat before that post, but at the bottom of the article, under "related reading," sat a link back to the Zork release. Seeing the two side by side is what sparked the idea.

Zork was built in 1977 by MIT students, and later, through Infocom, became one of the works credited with pioneering interactive fiction as a genre. Comic Chat, released by Microsoft in the late '90s, had a distinctive rendering engine that turned live chat into comic-strip panels in real time. The two projects have nothing in common on the surface: one's a parser-driven text game, the other's a renderer that turns chat logs into comics. Yet looking at both open-source announcements together, an idea clicked: what if Zork's text adventure played out through Comic Chat's comic renderer?

This post covers how that idea turned into a side project called Grues in Comic, how I've built it so far, and how it ended up in public beta. Quick aside on the name: a "grue" is the monster in Zork that eats you if you wander into darkness without a light source, and it's become a bit of an in-joke among interactive fiction fans. That's where "Grues in Comic" comes from.

## The idea: why combine the two

If you've played Zork, you know text adventures have a steep barrier to entry. You have to type commands like `north` or `take lamp`, and all you get back is a wall of text. Comic Chat has the opposite strength: it automatically arranges character expressions, gestures, and speech bubbles so a text conversation reads like a comic scene.

Putting the two side by side, I realized Zork's gameplay events, room transitions, item pickups, combat outcomes, could be rendered as Comic Chat panels. The player still types commands, but the result shows up as comic panels instead of a scrolling wall of text. The parser-based interaction that defines a text adventure stays intact; only the text output, the actual barrier to entry, gets swapped for comics.

I set one ground rule before starting: this wouldn't be a straight port of either original to the browser. The source for Zork is in ZIL (Zork's interpreter language), and Comic Chat's is old C++, so running either as-is in a browser was never realistic, and it wasn't the goal either. Instead, the plan was to understand each original first, extract how it actually behaves, move that behavior into an independent layer I call the intermediate representation (IR), and have an engine execute that IR.

## How it's built: from the originals to an IR

The actual work breaks down into three stages.

**First, the importer.** It parses Zork I's ZIL source into an [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree), extracting every room, object, parser rule, and routine from the original into a form a program can read.

**Second, the IR.** This is the core of the project. The IR is independent of ZIL and independent of any specific runtime; the whole point of this layer is to keep the game logic from being locked to one environment. The importer's output gets translated into this IR. Worth noting here: Grues in Comic is written entirely in TypeScript, so it runs in the browser without any separate runtime.

**Third, the engine.** This runtime reads the IR and actually plays the game: world state, the parser, combat, save and load, everything Zork I originally handled. The events the engine produces feed into a Comic Chat-style renderer, which draws them as comic panels. The panel layout, character poses, and speech-bubble rules were ported by working directly from the original Comic Chat C++ source.

Splitting the work into these layers also made it possible to verify fidelity against the original. I extracted a Zork walkthrough using [frotz](https://gitlab.com/DavidGriffith/frotz), an interpreter, as a reference dataset, then compared the engine's output against it line by line.

Here's the part worth being upfront about: I didn't write a single line of code myself. This is a 100% vibe-coded project. The importer, the IR, the engine, and the frotz-based fidelity checks I just described were all written by an AI agent. My job was to define the project's direction and requirements, then play through the result myself to test it. I also generated and touched up the extra background art: the original Comic Chat only shipped with a handful of backgrounds, so I used an image generation model to create ones that matched each Zork room's mood.

## Where things stand

It looked like a long road at the start, but a few solid milestones are already behind me.

- The importer, IR, and engine are all complete, and Zork I now runs start to finish in the browser. The game reaches its actual ending (the Stone Barrow), and I've locked that full playthrough in as a regression test. Every time I change engine code, it replays that scenario automatically, so anything that used to work and suddenly breaks gets caught right away.
- The Comic Chat-style rendering is wired up to the Zork gameplay, so player commands and the game's responses now show up as comic panels. The screen supports both horizontal and vertical layouts for desktop and mobile browsers.
- The original Zork mostly has the player character moving through the game alone, with almost no dialogue. To actually deliver on Comic Chat's conversational feel, I added a character who acts as a tabletop RPG dungeon master. This DM character narrates each new room the player (Hero) enters and voices the engine's reactions to the player's commands as dialogue.
- I built a static site with a landing page, an about page, and an auto-generated changelog.

## Public beta is live

The result is live on a subdomain: **[grues.danielkimdev.com](https://grues.danielkimdev.com)**. You can play it right now.

![Grues in Comic gameplay screenshot: the West of House opening scene rendered as four Comic Chat panels on the left, with the Hero and Dungeon Master characters, alongside the classic Zork text output — look, open mailbox, get leaflet — on the right](/images/blog/grues-in-comic-beta.png)

The repository isn't public yet. I'm planning to tag 1.0 when the repo goes public alongside the site's official launch; until then, it stays in beta and keeps getting polished.

## Closing thoughts

It took two weeks to go from a chance GeekNews find to a public beta. As I mentioned, I didn't write any of the code myself; this was 100% vibe coding. At least for this project, whether I could write code myself never determined whether I could start it. What did determine it was having an AI agent to build with and Microsoft's decision to open-source both projects; without either one, this project simply wouldn't exist. The most fun part of the whole thing was stitching together two codebases built in different eras for entirely different purposes, a text adventure and a comic chat renderer, into a single web game.

I'll keep sharing progress on this blog as it moves along.
