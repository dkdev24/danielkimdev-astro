# Stage 12 — Core components B (Callout, Timeline item, Code block, TOC)

**Session size:** ~30 min · **Priority:** P0 · **Phase:** 2 Content engine
**Depends on:** 11 · **Next:** 14, 17
**PRD refs:** §8.2, §6.5 (post body) · **Design refs:** DESIGN-minimax.md §4, §6

## Goal
Build the content-rich components used by About and blog posts: Callout/Admonition, Timeline item, Code block (with copy + language label), and Table of Contents.

## Prerequisites / context
- Code block and TOC are consumed by the blog post layout (Stage 17); Timeline item by About (Stage 14).

## Tasks
- [x] `Callout.astro`: variants note / tip / warning / important using semantic tokens; icon + title + body slot; AA contrast in both themes.
- [x] `TimelineItem.astro`: date, title, body; renders from timeline collection; vertical-rail styling per DESIGN-minimax.
- [x] `CodeBlock` handling: syntax highlighting (Astro/Shiki built-in), a **copy button** (small island), and a language label; keyboard-operable copy with state announcement.
- [x] `TOC.astro`: auto-built from post headings; sticky on desktop, collapsible on mobile; current-section highlight (progressive enhancement — works without JS as a plain list).
- [x] All four: focus-visible + keyboard behavior; respect `prefers-reduced-motion`.

## Files to create / edit
- `src/components/Callout.astro`, `src/components/TimelineItem.astro`, `src/components/TOC.astro` — new.
- Code-block: a Shiki config tweak + `CopyButton` island (`.astro`/tiny script).

## Acceptance criteria
- Callout renders all 4 variants AA-compliant in both themes.
- Copy button copies code and announces success; reachable by keyboard.
- TOC reflects headings and is usable without JS.

## Verify
- Render a sample MDX post with all four; keyboard-test copy + TOC; toggle reduced-motion.
- `astro check` clean.

## Handoff note
Record that content components are ready; note Shiki theme choice for light/dark.
