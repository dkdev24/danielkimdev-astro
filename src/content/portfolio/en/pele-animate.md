---
title: "pele-animate, Step-by-Step Mermaid Diagrams with Icons"
role: Solo builder (side project)
period: "2026–present"
startDate: 2026-10-21
summary: An open-source add-on for the Pele diagram renderer that turns Mermaid code into diagrams readers can step through in the order you choose, with icons on the nodes.
category: side-ai
tags: [ai-llm, solopreneur]
lang: en
featured: false
order: 5
translationKey: pele-animate
links:
  - label: pele-animate.danielkimdev.com
    url: https://pele-animate.danielkimdev.com
  - label: pele-animate on npm
    url: https://www.npmjs.com/package/pele-animate
  - label: Source on GitHub
    url: https://github.com/dkdev24/pele-animate
---

Documentation diagrams usually show everything at once, and the reader has to work out where to start. I wanted a diagram that explains itself in order, written as plain Mermaid so it still renders on GitHub and in Obsidian. [Pele](https://pele.run) already draws Mermaid small and fast, so pele-animate sits on top of it as an unofficial add-on instead of replacing it.

You pin the order with one comment line (`%% pa: 1=A 2=B,C`), and readers click through the steps with buttons or the keyboard. Without the comment, the order follows the edges. The finished picture is always the resting state, and reduced-motion settings are respected.

- **Step order and playback.** A step mode with previous, play and next controls, plus optional autoplay, for flowcharts, sequence, architecture, state, C4, class and ER diagrams, and several more.
- **Icons.** 4,368 Tabler line icons in 36 categories, loaded only for the categories you import, plus a way to register your own.
- **Agent-ready.** The package ships a skill that wires it into a project and checks the result in a browser, and every docs page is also served as Markdown.

The first consumer is the DoveRunner docs site, where it animates the diagrams. The site and docs are available in English and Korean. Like my other side projects, it was built through AI-agent pair-programming, and the package is published on npm.
