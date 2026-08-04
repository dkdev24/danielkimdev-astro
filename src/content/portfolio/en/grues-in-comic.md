---
title: "Grues in Comic — A Zork × Comic Chat Mashup"
role: Solo builder (side project)
period: "2026–present"
summary: A public beta that replays Zork I's parser-driven text adventure as Comic Chat-style comic panels — two 1980s/90s Microsoft open-source releases fused into one browser game via an independent intermediate representation (IR).
category: side-ai
tags: [ai-llm, solopreneur]
lang: en
featured: true
order: 4
translationKey: grues-in-comic
links:
  - label: grues.danielkimdev.com
    url: https://grues.danielkimdev.com
  - label: "Blog: Zork Meets Comic Chat"
    url: https://danielkimdev.com/blog/grues-in-comic-beta
---

Sparked by two unrelated Microsoft open-source releases: [Zork](https://github.com/historicalsource/zork1), the 1980s text adventure, and [Comic Chat](https://github.com/microsoft/comic-chat), a 1990s IRC client with a live comic-panel renderer. Zork's parser-driven gameplay stays intact; only its text-wall output gets replaced with Comic Chat's automatically arranged character poses and speech bubbles.

Rather than porting either original's code directly (ZIL and old C++ don't run in a browser), the project extracts each original's behavior into an independent layer: an importer parses Zork I's ZIL source into an AST, an intermediate representation (IR) captures the game logic independent of any runtime, and a TypeScript engine executes that IR — reproducing world state, parsing, combat, and save/load. Engine output feeds a Comic Chat-style renderer, with panel layout, poses, and speech-bubble rules ported from the original C++ source. A frotz-generated walkthrough serves as a reference dataset for line-by-line fidelity checks, now locked in as a regression test covering a full playthrough to the game's ending.

Built entirely through AI-agent pair-programming — no code written by hand. Public beta live now; the repository stays private until a 1.0 tag alongside the site's public launch.

![Grues in Comic gameplay screenshot: the West of House opening scene rendered as four Comic Chat panels on the left, with the Hero and Dungeon Master characters, alongside the classic Zork text output — look, open mailbox, get leaflet — on the right](/images/portfolio/grues-in-comic.png)
