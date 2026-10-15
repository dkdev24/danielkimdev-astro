---
title: "toonstrip: Comic Strips from Data, Drawn Live on Your Page"
role: Solo builder (side project)
period: "2026–present"
startDate: 2026-09-01
summary: An open-source library, extracted from Grues in Comic, that renders a comic strip (characters, poses, emotions, speech balloons, backdrops) from data you supply, as a live canvas widget for Astro, React, Vue, or plain HTML.
category: side-ai
tags: [ai-llm, solopreneur]
lang: en
featured: false
order: 6
links:
  - label: toonstrip.danielkimdev.com
    url: https://toonstrip.danielkimdev.com
  - label: "@toonstrip/element on npm"
    url: https://www.npmjs.com/package/@toonstrip/element
  - label: "Live demo in the Grues in Comic post"
    url: https://danielkimdev.com/blog/grues-in-comic-beta
---

While building [Grues in Comic](/portfolio/grues-in-comic/), the part that drew the comic panels turned out to be useful on its own: it didn't care about Zork at all, only about who's in a panel, what they say, and how they feel. toonstrip is that half, pulled out and generalized into a library anyone can drop into a page.

You describe a strip as data (panels, characters, an emotion for each line, the dialogue), and toonstrip draws it on real `<canvas>` elements that re-flow as the page resizes, rather than as a flat image. It deliberately doesn't generate anything. Writing the dialogue is up to you, by hand, by script, or by asking an LLM yourself. toonstrip only renders what it's given.

- **Framework-friendly.** A framework-free custom element sits at the center, with thin wrappers for Astro, React and Vue, and a no-build HTML example.
- **Asset packs.** The original 15-character Comic Chat roster ships as the default pack, and a packager CLI turns your own character art into a new pack.
- **Agent-ready.** An included agent skill teaches an AI coding agent to write and validate a strip document.

Like Grues in Comic, it was built through AI-agent pair-programming. Eleven packages are on npm, and the comic strip in this site's Grues in Comic post runs on it.
