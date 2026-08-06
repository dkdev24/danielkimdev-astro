# PRD — Personal Site & Blog (Astro, EN/KO)

**Owner:** Daniel Kim (daniel.kim@doverunner.com)
**Status:** Draft v1 — ready for implementation by Claude Code
**Last updated:** 2026-06-26
**Repo:** separate Astro project (blog template already scaffolded)
**Audience for this doc:** the coding agent (Claude Code) that will build the site

> **How to use this PRD.** This is the build brief. Implement section by section, following the priority tags (P0 → P1 → P2). Section 13 contains seed content (bio, portfolio entries) you can place directly into content files. When a decision is genuinely ambiguous, prefer the simplest Astro-native approach and leave a `TODO(daniel):` comment rather than inventing facts.

---

## 1. Context & Background

Daniel's current focus — and the focus of this site — is **AI for knowledge work: AI-driven knowledge management, automation, and the AI-readiness ("Agent Readiness") of technical documentation.** He comes to this from a deep technical career: 11+ years as a C/C++ and Java developer, now working across Product Owner, Product Management, and Developer Relations in media/entertainment technology (OTT/streaming, DRM/content security, cloud/SaaS) on DoveRunner / PallyCon products.

**Positioning (locked 2026-06-27) — career as credibility substrate, not a second topic.** The media-tech career is *why* his AI take is worth reading, not a parallel content track. The throughline: someone who has shipped and explained complex technical products and documentation in a hard domain, now working out how AI changes knowledge work. Media-tech depth makes the AI writing non-generic; the blog leads on AI, and the career provides proof, lived examples (most defensibly, agent-ready technical docs), and credibility. Media-tech surfaces in the blog only when it serves an AI point — otherwise it lives in About/Portfolio.

This site is the **public-facing layer** of a personal knowledge system (a Karpathy-style "LLM wiki" / digital garden). A private Obsidian PKM vault curates raw material; selected, polished pieces are published here. The site is **not** the PKM vault — it is the front door: a personal brand hub, a credibility surface, and a public digital garden.

**Primary goal of the site (chosen):** Personal brand for a long-term solopreneur transition, professional credibility / industry visibility, and knowledge sharing (digital garden) — in that order of weight.

---

## 2. Goals

1. **Establish a credible personal brand** that reads as "a media-tech product/DevRel veteran applying AI to knowledge work" — one sharp identity, with the career as proof. *Measure: a coherent Home + About + Portfolio that a stranger can parse in under 60 seconds and come away knowing the one thing Daniel is about.*
2. **Make expertise discoverable** in AI knowledge management, automation, and AI-readiness of technical documentation — with media-tech/DevRel depth as the differentiating angle. *Measure: organic search impressions growing month-over-month for these target topic queries within 90 days.*
3. **Lower the cost of publishing** so the digital-garden habit sticks — writing a post should be "drop a markdown file in, push." *Measure: time from finished draft to live post < 5 minutes.*
4. **Bilingual reach (EN + KO)** with full first-class support for both languages, not an afterthought translation. *Measure: every core page reachable and correct under both `/en` and `/ko`.*
5. **Fast, accessible, professional** on every device. *Measure: Lighthouse ≥ 95 Performance / ≥ 95 Accessibility on Home and a representative post.*

---

## 3. Non-Goals (v1)

1. **No CMS / admin UI.** Content is git-managed markdown. (Rationale: solo author, lowest maintenance, version-controlled.)
2. **No comments, accounts, or auth.** (Rationale: moderation cost; use external channels for discussion.)
3. **No automated sync from the private PKM vault.** Publishing is a deliberate copy-in step. (Rationale: keep private/public boundary explicit and safe.)
4. **No e-commerce, newsletter platform, or paywall in v1.** Newsletter capture is P2. (Rationale: prove the content habit first.)
5. **No machine auto-translation between EN/KO.** Each post declares its own language; translations are authored deliberately when worthwhile. (Rationale: Daniel writes natively in both; MT would dilute voice.)
6. **No heavy JS framework islands** unless a feature truly needs interactivity. (Rationale: performance + simplicity.)

---

## 4. Personas

- **The industry peer / hiring-adjacent visitor.** OTT/DRM/DevRel professional who landed from LinkedIn, a talk, or a shared post. Wants to quickly judge credibility and see what Daniel has built. Reads About + Portfolio, maybe one post.
- **The search arrival.** Found a blog post via Google on a DRM/streaming/AI-tooling query. Wants the answer; may explore About if the post was good. SEO and post quality matter most here.
- **The Korean-language reader.** Prefers Korean; expects the site to feel native in Korean (typography, copy, not translated-English-shaped prose). Story/blog content is Korean-primary per Daniel's existing workflow.
- **Future-self / solopreneur-network contact.** A potential collaborator or client evaluating Daniel as an independent operator. Wants signal of range: product impact, public speaking/writing, and side/AI experiments.

---

## 5. Information Architecture

```
/                       → Home (English — default locale, NO /en prefix)
/about/                 → About Me
/portfolio/             → Portfolio
/blog/                  → Blog index (list + filter by topic)
/blog/[slug]/           → Blog post
/tags/[tag]/            → Posts by tag/topic (P1)
/ko/                    → Home (Korean)
/ko/about/              → 소개
/ko/portfolio/          → 포트폴리오
/ko/blog/               → 블로그 목록
/ko/blog/[slug]/        → 블로그 글
/ko/tags/[tag]/         → 태그별 글 (P1)
/rss.xml  /ko/rss.xml   → feeds (default English at root + Korean)
/sitemap-index.xml      → sitemap (auto)
404                     → localized not-found
```

**Global nav (every page):** Home · About · Portfolio · Blog · [language toggle EN | 한국어]
**Footer:** short tagline, email link, social links — **LinkedIn, X (Twitter), GitHub** (`TODO(daniel): profile URLs`) — RSS, © year, language toggle.

Topic taxonomy. **Positioning (locked 2026-06-27):** the blog leads on AI for knowledge work; media-tech/DRM is career credibility that lives in **About + Portfolio only**, not the blog focus.

- **Blog — canonical post tags:** `ai-knowledge-mgmt`, `automation`, `ai-ready-docs`, `ai-llm`, `pkm`, `solopreneur`. (`ai-ready-docs` = AI-readiness / "Agent Readiness" of technical documentation.)
- **Portfolio — career/credibility tags:** `drm-content-security`, `ott-streaming`, `cloud-saas`, plus any blog tag where a portfolio item genuinely crosses over.

Keep the two sets separate in the schema (§9) so media-tech tags don't surface as blog topics.

---

## 6. Page Requirements

### 6.1 Home — P0
- **Hero:** name, one-line positioning statement, 1–2 sentence subhead, primary CTA (View Portfolio) + secondary (Read the Blog). Localized per language.
- **Identity strip:** current focus areas as compact chips — **AI Knowledge Management · Automation · AI-Ready Technical Docs** (KO: AI 지식 관리 · 자동화 · 에이전트 준비도). Sourced from `src/data/home.ts` (`HOME_HERO[locale].focusAreas`). Media-tech background is conveyed in About/Portfolio, not here.
- **Featured work:** 3 portfolio highlights (cards: title, one-liner, tag, link).
- **Latest writing:** 3 most recent posts in the *current* locale (fall back gracefully if a locale has few posts — see §7.4).
- **Short "about" teaser** linking to full About page.
- **Footer CTA:** ways to connect (email, LinkedIn).
- *Acceptance:* Renders fully static, no layout shift, hero readable above the fold on a 375px-wide screen.

### 6.2 About Me — P0
- Narrative bio (see seed content §13.1) — the 11-years-dev → PO/PM/DevRel arc, domain expertise, and the solopreneur/AI throughline.
- **Career timeline** component: dated milestones (role, org, one-line impact). Data-driven from a content/data file, not hardcoded in markup.
- **Skills / focus areas** grouped (Product, Domain, Technical, AI).
- Headshot slot (`TODO(daniel): add /public/images/daniel.jpg`) with graceful fallback if absent.
- Contact row (email + social).
- *Acceptance:* Both `/en/about` and `/ko/about` exist with locale-appropriate prose (not auto-translated).

### 6.3 Portfolio — P0
- Grid/list of portfolio items rendered from a **content collection** (§9.2), each with: title, role, period, summary, tags, optional links (case study/post, external), optional thumbnail.
- **Filter by tag/topic** (client-side, progressive-enhancement; works without JS as a full list).
- Item detail: either an in-page expandable card or a dedicated `/portfolio/[slug]` page (P1) — v1 may render rich cards inline.
- Cover the four content buckets Daniel selected: **Product impact** (DoveRunner/PallyCon), **Talks / writing / DevRel**, **Side projects / AI experiments**, **Technical & career timeline** (the timeline lives primarily on About; cross-link).
- *Acceptance:* Adding a portfolio entry = adding one markdown/data file; no component edits required.

### 6.4 Blog index — P0
- Reverse-chronological list for the current locale: title, date, reading time, tags, excerpt.
- Topic filter (tag chips) and, P1, a search box.
- Pagination or load-more once > ~10 posts (P1; v1 can list all).
- *Acceptance:* Draft posts (`draft: true`) are excluded from production builds.

### 6.5 Blog post — P0
- Title, date, updated-date (optional), reading time, tag chips, locale badge.
- Body: full markdown/MDX support — headings with anchor links, code blocks with syntax highlighting, callouts/admonitions, images with captions, tables, footnotes.
- **Table of contents** (auto from headings) for long posts, sticky on desktop.
- Prev/next post navigation within the same locale.
- **Cross-language link** if a translation of this post exists (e.g., "Read in 한국어").
- Per-post SEO: title, description, canonical, OpenGraph image (auto-generated or per-post — see §10.4).
- *Acceptance:* A post written only in Korean renders correctly and is excluded from the English blog list (no broken/empty English version).

### 6.6 404 / not-found — P1
- Localized, on-brand, with links back to Home and Blog.

---

## 7. Internationalization (EN / KO) — P0

**Chosen model:** Astro native i18n with **URL routing** plus a **language toggle**. English is the default locale and serves from the **root** (no `/en/` prefix); Korean serves under **`/ko/`**. (Confirmed by Daniel.)

### 7.1 Routing & config
- Use Astro's built-in i18n routing. `locales: ["en", "ko"]`, `defaultLocale: "en"`, **`prefixDefaultLocale: false`** — English (default) is served at the root (`/`, `/about/`, `/blog/...`) with **no `/en/` prefix**; Korean is served under `/ko/...`.
- The English site lives at the root and must render directly with **no blocking redirect**. For first-time visitors, an optional lightweight client hint may route a Korean preference (stored cookie/localStorage, else `Accept-Language: ko`) from `/` to `/ko/`; persist the choice and never trap a user on a 404.

### 7.2 UI strings
- All chrome (nav, buttons, labels, dates, reading-time, "Read in…", footer) comes from per-locale UI dictionaries (e.g., `src/i18n/en.json`, `src/i18n/ko.json`). No hardcoded display strings in components.
- Localize date formatting and number/reading-time phrasing per locale.

### 7.3 Language toggle
- Toggle in header + footer. When a translation of the current page exists, switch to it directly; otherwise switch to the locale's equivalent section (e.g., its Home or Blog index) — never dump the user on a 404.
- Persist the user's language choice (cookie or localStorage) and honor it on next visit.

### 7.4 Content & locale independence
- Posts and portfolio items are **per-locale**, linked by a shared `translationKey` (or slug convention) when a real translation exists. A post in one locale must NOT require a counterpart in the other.
- Home "latest writing" and Blog index show only the current locale's posts. If a locale has fewer than 3 posts, fill remaining slots gracefully (show what exists; no empty cards).

### 7.5 SEO for i18n
- Emit `hreflang` alternate tags (`en`, `ko`, `x-default`) on pages that have counterparts — `en` and `x-default` point to the unprefixed root URLs, `ko` to the `/ko/...` URLs. `lang` attribute on `<html>` set per locale. Per-locale sitemap entries.

### 7.6 Fonts (bilingual typography)
- **Latin / UI:** use the MiniMax font system from [`DESIGN-minimax.md`](DESIGN-minimax.md) §3 — **DM Sans** (body/UI workhorse), **Outfit** (display headings), **Poppins** (mid-tier sub-headings), **Roboto** (data/technical). Apply the role/size/weight mapping in that doc's hierarchy table.
- **Korean:** pair a high-quality Korean webfont (**Pretendard**, Noto Sans KR fallback) for all KO content, applied via the locale's font stack so Korean renders natively rather than falling back to a Latin face. Tune Korean line-height/letter-spacing separately (Korean generally needs slightly more line-height than the universal 1.50).
- Subset and self-host (or use a performant CDN) to avoid FOIT/CLS; preload the primary body font (DM Sans for EN, Pretendard for KO).

---

## 8. Design System — P0

Goal: **modern, professional, restrained.** Editorial-clean, lots of whitespace, strong typographic hierarchy, one confident accent color. Avoid trendy gimmicks; optimize for legibility and timelessness.

> **Visual design source of truth.** The concrete visual language — color values, typography scale, component styling, radius/shadow/spacing tokens, and do's/don'ts — is specified in [`dev-references/DESIGN-minimax.md`](DESIGN-minimax.md) (a MiniMax-inspired system: white-dominant, blue brand accent, pill nav, generously rounded cards, multi-font hierarchy). **Implement the design tokens and components from that document.** This §8 defines the *requirements* (what must exist and behave how); `DESIGN-minimax.md` defines the *concrete values*. Where they overlap, `DESIGN-minimax.md` wins for aesthetics; this PRD wins for scope, accessibility (§11), and bilingual/i18n needs (§7). Two deliberate reconciliations:
>
> - **Dark mode (still required, §8.1 + §11).** `DESIGN-minimax.md` specifies only a light theme (white-dominant with a dark footer). Treat its tokens as the **light** theme and **derive a matching dark token set from the same MiniMax palette** (near-black surfaces in the `#181e25`/`#18181b` family, inverted text ramp, accent kept legible) — confirmed by Daniel. Both themes must meet WCAG AA. The overall design may be revisited later if Daniel isn't satisfied, so keep tokens centralized and swappable.
> - **Bilingual fonts (§7.6).** Adopt the MiniMax Latin font system for EN/UI, and pair a Korean webfont (Pretendard) for KO — see §7.6.

### 8.1 Design tokens (define as CSS custom properties / a tokens file)

Take concrete values from [`DESIGN-minimax.md`](DESIGN-minimax.md) §2 (color), §5 (spacing/radius), and §6 (elevation); the points below set the requirements they must satisfy.

- **Color — neutrals + accent:** near-black ink (`#222222`), white background (`#ffffff`), gray ramp, and the **blue brand accent** (`#1456f0` brand / `#3b82f6` primary-500 / `#2563eb` hover) per `DESIGN-minimax.md` §2. Brand pink (`#ea5ec1`) is decorative/logo-only — never text or buttons. **Semantic:** success/warning/error/info for callouts. All pairings must meet WCAG AA contrast (§11). *(Resolves the earlier accent-color open question.)*
- **Dark mode:** required. Token-driven (light/dark sets via `prefers-color-scheme` + a manual toggle that persists). `DESIGN-minimax.md` covers the light theme only — derive the dark set from the same palette (see §8 source-of-truth note). Test both themes for contrast.
- **Typography scale:** follow `DESIGN-minimax.md` §3 (DM Sans / Outfit / Poppins / Roboto roles, the size/weight/line-height table, universal 1.50 line-height, weight 500 as default emphasis). Keep a distinct, generous measure for blog body (~65–75ch). Korean typography per §7.6.
- **Spacing scale:** 8px-based step scale per `DESIGN-minimax.md` §5. No arbitrary one-off margins.
- **Radius / borders / shadows:** use the radius scale (8px UI → 20–24px cards → 9999px pills) and elevation levels from `DESIGN-minimax.md` §5–6, including the brand purple-tinted glow for featured cards. Keep shadows light (≤0.16 opacity).
- **Motion:** short, purposeful transitions (150–250ms ease). Respect `prefers-reduced-motion`.

### 8.2 Core components (document variants/states/a11y for each)
- **Button** (primary / secondary / ghost; default·hover·active·focus-visible·disabled).
- **Card** (portfolio item, post preview, featured work).
- **Tag/Chip** (topic, filter — selectable state).
- **Nav bar** (sticky, responsive; mobile menu).
- **Language toggle** (current-locale indicated, keyboard-operable).
- **Theme toggle** (light/dark, persists).
- **TOC** (sticky desktop, collapsible mobile).
- **Callout/Admonition** (note/tip/warning/important).
- **Timeline item** (date, title, body).
- **Code block** (syntax highlight + copy button + language label).
- **Pagination / load-more** (P1).
- Each component must define focus-visible styling and keyboard behavior.

### 8.3 Layout
- Max content width container; full-bleed allowed for hero/section backgrounds.
- Responsive breakpoints (mobile-first): ~480 / 768 / 1024 / 1280.
- Grid for portfolio/blog lists (1 → 2 → 3 columns by breakpoint).

---

## 9. Content Model — P0

Use **Astro content collections** with typed schemas (Zod). Keep authoring friction minimal.

### 9.1 Blog post schema
```
title: string
description: string            # for SEO + excerpt fallback
pubDate: date
updatedDate: date?            # optional
lang: "en" | "ko"
tags: string[]                # from the canonical taxonomy (§5)
writingProcess: "ai-assisted" | "human-written"  # author's own provenance note, default "ai-assisted" (2026-08-06); not reader-verifiable
draft: boolean (default false)
translationKey: string?       # links EN/KO versions of the same piece
heroImage: string?
ogImage: string?
```
- Reading time computed at build from body length.
- File layout: `src/content/blog/en/*.md(x)` and `src/content/blog/ko/*.md(x)` (or a `lang` field + folder by locale — pick one and be consistent).

### 9.2 Portfolio schema
```
title: string
role: string                  # e.g., "Product Owner", "DevRel"
org: string?                  # DoveRunner / PallyCon / independent
period: string                # e.g., "2023–present"
summary: string
category: "product" | "talk-writing" | "side-ai" | "career"
tags: string[]
lang: "en" | "ko"
links: { label: string, url: string }[]?
thumbnail: string?
featured: boolean (default false)   # surfaces on Home
order: number?
```

### 9.3 About / timeline data
- Career timeline as a typed data/content collection (`role`, `org`, `start`, `end`, `summary`, `lang`) so About renders it dynamically and it's easy to update.

---

## 10. Technical Requirements

### 10.1 Stack & build — P0
- Astro (existing scaffold). Output **static** (`output: "static"`). MDX integration for rich posts. TypeScript.
- Keep JS minimal; use Astro islands only where interactivity is required (filters, toggles, copy-button).

### 10.2 Deployment — Cloudflare Pages — P0
- Build command `npm run build`, output dir `dist/`. Document required Node version in `.nvmrc` / `package.json` engines.
- Set `site` in `astro.config` to `https://danielkimdev.com` (registered via Cloudflare Registrar) for correct canonical/sitemap/RSS absolute URLs.
- No special base path (custom domain at root). Include a `_headers` file for sensible security headers (CSP-light, `X-Content-Type-Options`, referrer-policy) and long-cache for hashed assets.
- Provide a one-line deploy note in the repo README (connect repo → Cloudflare Pages → framework preset "Astro"). Target is **Cloudflare Pages**, already configured via the `wrangler` CLI.

### 10.3 Feeds & sitemap — P0
- `@astrojs/sitemap` for sitemap-index. RSS via `@astrojs/rss` — a combined feed plus optional per-locale feeds. Link feeds in `<head>` and footer.

### 10.4 SEO & social — P0
- Per-page `<title>`, meta description, canonical, OpenGraph + Twitter card tags, `hreflang` alternates (§7.5).
- OG images: per-post override, with an auto-generated default (build-time generated card with title + site brand) as fallback (P1 if auto-gen is heavy; v1 can ship a single branded default OG image).
- JSON-LD: `Person` on About/Home, `BlogPosting` on posts.

### 10.5 Performance — P0
- Astro image optimization for all raster images; explicit width/height to prevent CLS. Lazy-load below-fold images.
- Self-hosted/subset fonts with `font-display: swap`. Preload the primary body font.
- Target: Lighthouse ≥ 95 Perf / ≥ 95 A11y / ≥ 95 Best-Practices / ≥ 95 SEO on Home and a representative post.

### 10.6 Analytics — P1
- **Cloudflare Web Analytics** (chosen) — privacy-friendly, cookieless, no extra account since the site is on Cloudflare Pages. No invasive tracking.

### 10.7 Tooling / DX — P1
- Prettier + ESLint (Astro plugin). A `CONTRIBUTING`/`AUTHORING.md` snippet documenting how to add a post and a portfolio item (frontmatter template). Optional: a content lint/check in CI (broken internal links, missing frontmatter).

---

## 11. Accessibility — P0 (WCAG 2.1 AA)

- **Contrast:** all text/UI meets AA (4.5:1 normal text, 3:1 large text / UI components) in *both* themes.
- **Keyboard:** every interactive element (nav, toggles, filters, TOC, copy button) reachable and operable by keyboard with visible `focus-visible` styles. Logical tab order. Skip-to-content link.
- **Semantics:** correct landmarks (`header/nav/main/footer`), one `h1` per page, ordered headings, `lang` attribute per locale, `alt` text on meaningful images (empty alt on decorative).
- **Motion:** honor `prefers-reduced-motion`.
- **Targets:** interactive targets ≥ 44×44px on touch.
- **Toggles:** language and theme toggles announce state to screen readers (`aria-pressed` / proper labels).
- *Verification:* run the design system's accessibility-review pass on Home + a post before launch.

---

## 12. Requirements Summary (priority)

**P0 — cannot ship without:**
- Home, About, Portfolio, Blog index, Blog post pages (§6.1–6.5)
- Astro i18n routing `/en` `/ko` + working language toggle (§7)
- Content collections with typed schemas for posts + portfolio (§9)
- Design system tokens + core components, light/dark, bilingual fonts (§8)
- Static build deploying to Cloudflare Pages (§10.2)
- Sitemap, RSS, SEO/OG/hreflang basics (§10.3–10.4)
- WCAG AA accessibility (§11)
- Performance targets met (§10.5)

**P1 — fast follow:**
- Tag/topic archive pages, blog search, pagination/load-more
- Portfolio detail pages
- Auto-generated per-post OG images
- 404 polish, analytics, authoring docs + content-lint CI

**P2 — later / architectural insurance:**
- Newsletter capture, post series/collections, related-posts, reading progress
- Webmentions / external discussion links
- Optional move to hybrid/SSR if dynamic features appear
- Light automation to assist (not auto-publish) PKM → site hand-off

---

## 13. Seed Content (place into content files; refine wording with Daniel)

> These are starting drafts from Daniel's profile. Korean versions should be authored natively (use Daniel's writing-style voice), not translated from the English. Mark anything uncertain with `TODO(daniel):`.

> **Throughline for all §13 copy (locked 2026-06-27):** lead with AI for knowledge work; the media-tech/DevRel career is *proof*, not a second topic. Every bio/positioning line should leave the reader knowing one thing — "AI for knowledge work, from someone with real technical-docs/DevRel chops."

### 13.1 About — English draft
> I'm Daniel Kim. I work on AI for knowledge work — how AI reshapes the way we manage knowledge, automate the busywork, and write technical documentation that machines, not just people, can use. I come at this from a deep technical career: 11+ years building in C/C++ and Java, then moving from writing code to shaping products across Product Ownership, Product Management, and Developer Relations in media & entertainment technology — OTT/streaming and DRM/content security, most recently with DoveRunner / PallyCon. That background is the point: years of shipping and explaining complex systems and documentation in a hard domain are exactly what keep my take on AI concrete rather than generic. This site is my digital garden — notes, essays, and experiments from that work, and a record of building toward an independent, solopreneur future.

### 13.2 About — 한국어 초안 (네이티브 보이스로 다듬기)
> `TODO(daniel):` 다니엘 문체 스킬로 직접 집필. 핵심 줄기: **메인은 AI 기반 지식 작업**(지식 관리, 자동화, 기술 문서의 에이전트 준비도(Agent Readiness)). **경력은 신뢰의 토대로** 배치: 11년+ C/C++·Java 개발자에서 PO/PM/DevRel로, 미디어·OTT·DRM/콘텐츠 보안 경험(DoveRunner/PallyCon)이 AI 관점을 일반론이 아닌 구체적인 이야기로 만들어 준다는 점. 솔로프리너 지향. (영문 직역 금지, 합쇼체, 한국어 본문에는 em-dash 금지.)

### 13.3 Positioning one-liners (pick/refine for hero)
- (EN, locked tagline) "An engineer-turned-product person exploring AI knowledge management, automation, and AI-ready technical docs."
- (EN, alt) "Media-tech product & DevRel veteran, now working out how AI changes knowledge work."
- (EN, alt — career-as-proof) "AI for knowledge work — kept concrete by years of shipping technical docs in a hard domain."
- (KO, locked tagline) "개발자로 출발한 제품 전문가가 AI 기반 지식 관리와 자동화, 그리고 기술 문서의 에이전트 준비도를 다룹니다."
- (KO, alt) `TODO(daniel):` 미디어/DevRel 경력을 신뢰의 토대로 둔 한 줄: AI 지식 작업 + 솔로프리너.

### 13.4 Portfolio seed entries (one file each; fill specifics)
> Portfolio carries the career credibility (media-tech tags live here, per §5). Where an item bridges into the AI focus, add the crossover tag (`ai-ready-docs`, `ai-knowledge-mgmt`, etc.) so it reinforces the throughline.
- **AI for knowledge work / agent-ready docs (lead item)** · category: side-ai · tags: ai-ready-docs, ai-knowledge-mgmt, ai-llm. Experiments + writing on AI knowledge management, automation, and making technical documentation AI/agent-ready. `TODO(daniel)`: specific projects/results.
- **Side / AI experiments — this LLM-wiki / digital garden** · category: side-ai · tags: ai-llm, pkm, solopreneur. The Karpathy-style PKM and AI tooling behind this very site.
- **Talks / writing / DevRel** · category: talk-writing · tags: ott-streaming, ai-ready-docs. Notable talks, articles, and developer docs — foreground the technical-documentation work that bridges to agent-readiness. `TODO(daniel)`.
- **Product impact — DoveRunner / PallyCon Multi-DRM** · role: Product Owner/PM · category: product · tags: drm-content-security, ott-streaming. Summary + measurable impact `TODO(daniel)`.
- **Product impact — Forensic / Distributor Watermarking & Anti-Piracy** · category: product · tags: drm-content-security. `TODO(daniel)`.
- **Career timeline** · category: career · tags: cloud-saas. 11+ yrs dev (C/C++, Java) → PO/PM/DevRel; map roles/orgs/dates `TODO(daniel)`.

---

## 14. Success Metrics

**Leading (weeks):** all P0 pages live in both locales; Lighthouse targets met; publish-a-post time < 5 min; zero broken links / missing-frontmatter in build.
**Lagging (1–3 months):** growing organic impressions on target topics; returning visitors; inbound contacts (email/LinkedIn) referencing the site; steady publishing cadence sustained.

---

## 15. Open Questions

- **[daniel]** ~~Final domain name?~~ (resolved: `danielkimdev.com`, Cloudflare Registrar → Cloudflare Pages, configured via `wrangler`.)
- **[daniel]** ~~Default locale~~ (resolved: `en` default served at root with **no `/en/` prefix**; Korean under `/ko/` — `prefixDefaultLocale: false`, see §7.1).
- **[daniel]** ~~Accent color~~ (resolved: MiniMax brand blue) and ~~dark palette~~ (resolved: derive from MiniMax light theme, swappable later). Still need **headshot availability**.
- **[daniel]** ~~Social links~~ (resolved: LinkedIn, X, GitHub — profile URLs still `TODO(daniel)`).
- **[daniel]** ~~Analytics provider~~ (resolved: Cloudflare Web Analytics, see §10.6).
- **[design]** ~~Portfolio item detail~~ (resolved: inline expandable cards for v1; dedicated pages remain P1).
- **[daniel]** ~~Site/blog focus & how to treat the media-tech career~~ (resolved 2026-06-27: **Bridge** positioning — blog leads on AI for knowledge work; media-tech is credibility substrate in About/Portfolio only, surfacing in the blog only via AI crossover. Taxonomy split in §5; throughline in §1/§2/§13.)
- **[daniel]** Which existing PKM "story" pieces seed the first 3–5 posts per locale? (Now scoped to the AI pillars: AI knowledge management, automation, agent-ready docs.)

---

## 16. Suggested Build Phasing

1. **Foundation:** tokens + design system + layout shell + i18n routing + nav/toggles (light/dark, EN/KO).
2. **Content engine:** content collections (blog + portfolio + timeline schemas), one sample post per locale, RSS/sitemap/SEO base.
3. **Pages:** Home → About → Portfolio → Blog index → Blog post.
4. **Polish:** accessibility pass, performance/Lighthouse, OG images, 404.
5. **Ship:** Cloudflare Pages deploy + README deploy notes; then P1 backlog.
