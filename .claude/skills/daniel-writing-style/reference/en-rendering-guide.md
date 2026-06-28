# English Rendering Guide — Daniel Kim (en-rendering-guide)

> **This is NOT a voice profile.** It is a guide for turning Daniel's Korean content
> (which carries his voice — see `ko-style.md`) into clean, professional English that
> reads as if written natively, while deliberately avoiding translationese.
>
> **Why this exists:** most English samples in `samples/en/` are DeepL/Google translations
> of Daniel's Korean, lightly post-edited. Scanning them captures the translator's style,
> not Daniel's. So instead of mimicking that output, this guide names the recurring
> translation artifacts found in those samples and shows how to fix them.
>
> If Daniel later supplies genuinely self-written English, build a real `en-style.md`
> alongside this guide. Until then, "render Korean → good English" is the operating mode.
> Last updated: 2026-06-12

---

## 0. The operating principle: rewrite, don't translate

Read the Korean for **intent and content**, then **write the English from scratch.** Do not
walk sentence by sentence. The Korean's *voice* (professional-warm, explanatory, balanced —
per `ko-style.md`) should survive; its *sentence shapes* should not. A good test: if an
English sentence could only have come from a Korean original, rewrite it.

---

## 1. Register and voice to preserve (from ko-style)

These carry over from Daniel's Korean voice and should be reproduced in English:

- **Professional-warm, explanatory teacher tone.** Clear, patient, never showy.
- **First person + direct address.** The samples use "I will explain…", "As we saw in the
  previous post…", "save **you** upfront costs", "what **you'll** pay." Keep this — it reads
  naturally and matches his Korean reader-empathy ("고객의 입장에서").
- **Balanced framing.** Always pair the trade-off: "A SaaS subscription can save you upfront
  costs… but the downside is that it's hard to predict what you'll pay."
- **Measured forecasts, not hype.** Mirror the Korean restraint ("지켜보아야 할 것 같습니다"):
  "it remains to be seen whether…", "this is worth watching." Avoid "best," "perfect,"
  "revolutionary," "guaranteed."
- **Structure transfers cleanly:** Intro/Overview → stepwise body → Conclusion → soft CTA.
  Headings, bullet lists, tables, code blocks, and `>` side-notes all carry over as-is.
- **Term introduction:** keep the "spelled-out name (Acronym)" convention —
  "Monthly Active License (MAL)", "Encrypted Media Extensions (EME)." Don't transliterate
  product/standard names (PlayReady, Widevine, FairPlay, CMAF, MPEG-DASH, HLS).

---

## 2. Translationese checklist (the recurring artifacts to fix)

Every "before" below is **actual text from the post-edited MT samples**; the "after" is the
clean version to aim for.

### 2.1 Missing or wrong articles (a / an / the) — the #1 issue
Korean has no articles, so MT drops or misplaces them constantly.

- Before: "it was common to pay annual fee for license, maintenance, and technical support"
  After: "it was common to pay **an annual fee** for **the** license, maintenance, and technical support"
- Before: "there is a need for multi-region DR system"
  After: "there is a need for **a** multi-region DR system" (better: see 2.3)
- Before: "PallyCon DR system uses AWS Seoul region as the main system"
  After: "**The** PallyCon DR system uses **the** AWS Seoul region as **its** main system"

Sweep every noun phrase and ask: a, an, the, or a possessive?

### 2.2 Calqued time / discourse adverbials
Korean connectives get translated literally into stiff or wrong English.

| Korean | MT calque (before) | Natural (after) |
|--------|--------------------|-----------------|
| 이때 | "At this time," | drop it, or "Here," / "In this case," |
| 지난해 11월 | "in November last year" | "**last November**" |
| 평상시에 | "in normal condition" | "**under normal conditions**" / "normally" |
| 이에 따라 | "Therefore, there is…" | "**As a result,** …" / "**So** …" |
| 다만 | "However it is…" | "**That said,** …" / "**One caveat:** …" |

### 2.3 "There is a need for…" / "it is needed to…" (existential calque)
Calque of `필요성이 대두된다` / `~해야 합니다`. Make it direct and agentive.

- Before: "there is a need for a multi-region DR system"
  After: "**a multi-region DR system becomes necessary**" / "**this calls for** a multi-region DR system"
- Before: "it is also needed to make sure that the SaaS solution… is covered"
  After: "**you also need to confirm that** the SaaS solution… is covered"

### 2.4 Over-passive voice
Korean 피동 maps to English passive by default; English tech writing prefers active.

- Before: "License requests from multi-DRM clients **are done in** the DRM module"
  After: "The DRM module **handles** license requests" / "License requests **run in** the DRM module"
- Keep the passive only when the actor is genuinely unknown or irrelevant
  ("the data is encrypted with the device's public key" is fine).

### 2.5 Choppy clause splits ("And…", "However…")
Korean sentence-final endings get split into short English fragments.

- Before: "…generates the information… as `License Challenge` data. **And it sends** the data
  to the `License Acquisition (LA) URL`…"
  After: "…packages the device and content information as a **License Challenge**, then **POSTs
  it** to the DRM server's **License Acquisition (LA) URL**."
- Join or restructure; don't open sentences with "And." Put "However," after a period **with a
  comma**, or fold into the prior sentence with "but."

### 2.6 Wrong verbs / collocations
MT picks dictionary-literal verbs. Replace with the idiomatic one.

| Before (MT) | After |
|-------------|-------|
| "convert the service DNS to the Tokyo region" | "**redirect / switch** the service DNS to the Tokyo region" |
| "inquire existing information" | "**query / retrieve** existing information" |
| "if the disruption of Seoul region **is recovered**" | "once the Seoul region outage **is resolved**" |
| "impossible to **cope with** the problems" | "can't **handle** problems" |
| "runs one instance of each major **servers**" | "runs one instance of each major **server**" |

### 2.7 Inanimate subjects performing human actions
Calque of Korean topic-comment structure. Often fine in tech writing, but reword when clunky.

- Tolerable: "The license sets the `persistent` value to `false`."
- Better when awkward: instead of "This backup system minimizes the impact…", →
  "As a result, a regional failure has minimal impact on customers."

### 2.8 Redundant compound-noun headings
Korean compound nouns (설정과 동작 방식) get doubled in English.

- Before: "How DRM Licenses Are Set Up and How They Work"
  After: "**How DRM Licenses Work**" (or "Setting Up DRM Licenses")

### 2.9 Em-dash overuse (AI writing signal)
AI-generated text overuses em-dashes — often one per sentence. This is a recognized AI writing
signal; minimize it in English output too.

- Use em-dashes sparingly: **at most 1–2 per piece**, and only when a comma or parentheses won't do.
- Default alternatives:
  - **Parentheses** for asides: "The packager (which runs in your ingest pipeline) outputs an encrypted CMAF stream."
  - **Comma + clause** for continuations: "…, which runs in your ingest pipeline, outputs…"
  - **Separate sentence** for strong breaks.
- Before: "The packager — which runs in your ingest pipeline — outputs an encrypted CMAF stream — and the result is a CMAF-packaged file."
  After: "The packager, which runs in your ingest pipeline, outputs an encrypted CMAF stream."

---

## 3. General English tech-writing norms (apply on top)

- **Tighten.** English rewards brevity that Korean explanatory prose doesn't. Cut "in order
  to" → "to", "the fact that" → drop, "various" → often delete.
- **Prefer active voice and concrete subjects.** Name the actor (the module, the server, you).
- **One idea per sentence**, but combine the Korean's stacked clauses into properly subordinated
  English ("…, which…", "…, so…") rather than comma splices.
- **Reduce nominalizations:** "perform authentication of" → "authenticate"; "make a decision" →
  "decide"; "provides support for" → "supports."
- **Oxford comma, US spelling** (the samples lean US: "license," not "licence").
- **Consistent terminology:** pick one of "on-premise / on-premises" (use **on-premises**),
  "playback," "issue a license," and stay consistent.

---

## 4. Worked example (before → after)

**Korean source (excerpt):**
> 지난 해 11월에 발생한 AWS 서울 리전의 대규모 장애로 인하여 클라우드 플랫폼을 기반으로 운영되는
> 서비스의 안정성이 다시 이슈화 되었습니다. … 이에 따라 멀티 리전을 이용한 재해 복구(DR) 시스템의
> 필요성이 대두되고 있습니다.

**MT-edited English (the sample — translationese):**
> The stability of online services based on cloud platforms has emerged as a major issue due to
> the massive failure of the AWS Seoul region in November last year. … Therefore, there is a need
> for multi-region DR system.

**Rendered English (the target):**
> Last November's large-scale AWS Seoul region outage put the reliability of cloud-based services
> back in the spotlight. … This is exactly the gap a multi-region disaster recovery (DR) system is
> meant to close.

What changed: "in November last year" → "Last November"; passive "has emerged… due to" →
active "put… back in the spotlight"; existential "there is a need for [missing article]" →
agentive "the gap a … system is meant to close."

---

## 5. Self-check before delivering English

1. Could any sentence only exist because a Korean original did? Rewrite it.
2. Every noun: article correct?
3. Any "At this time / there is a need / it is needed / are done"? Replace.
4. Passive that could be active? Flip it.
5. Sentences opening with "And/But/However" without a fix? Join or re-punctuate.
6. Verbs idiomatic (redirect, retrieve, resolve, handle)?
7. Voice still professional-warm, first-person, balanced, measured — i.e., still *Daniel*?
8. Trade-offs paired; forecasts measured; no hype words.
9. Em-dash count: 0–2 max per piece? If more, convert to parentheses, commas, or separate sentences.

---

## 6. Status / open items

- This guide is built from **5 en/ko sample pairs** plus the broader Korean voice profile.
  It is about *fixing translation artifacts*, not capturing native English idiosyncrasy.
- **To upgrade to a real `en-style.md`:** Daniel will supply genuinely self-written English
  (LinkedIn posts, emails, talk scripts, internal docs). He plans to look, not yet. When those
  land, profile only those and keep this guide as the "rendering" half.
- Keep Korean (`ko-style.md`) and English handling **separate** — do not blend their patterns.
