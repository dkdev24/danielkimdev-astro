# AI Slop Tells — anti-detection catalog (ai-slop-tells)

> A reference for the **AI-signal-elimination** half of this skill's north star.
> The voice profiles (`ko-style.md`, `en-rendering-guide.md`) say what Daniel *does*;
> this file says what an AI *does that Daniel doesn't* — the patterns that mark text
> as machine-generated even when the voice is otherwise close.
>
> **Seed source:** the English catalog in `tropes.md` (tropes.fyi). This file distills it,
> adds Korean examples for the cross-language patterns, and adds an original Korean-tell
> section that `tropes.md` does not cover. Em-dash handling lives in the voice profiles
> (KO: banned; EN: ≤2/piece) and is not repeated here.
> Last updated: 2026-06-22
>
> **The rule of thumb (from tropes.fyi):** any one of these used *once* may be fine.
> The signal is **clustering** — several tropes together, or one trope repeated. Hunt for
> density, not single instances. Daniel's real writing uses some of these structures
> sparingly (one sharp short line, one tricolon, one rhetorical question); the AI failure
> mode is doing it every paragraph.

---

## How to use this file

- **Every workflow (A, B, C):** run §1 (cross-language) + §5 (the slop pass) before delivering.
- **Korean output (A, B):** also run §3 (Korean LLM tells).
- **English output (C):** also run §2 (English-surface tells).
- **Workflow A specifically:** the *input* is AI-written English and is usually saturated with
  these tropes. Read §4 first — your job is to detect the source's slop and **not inherit it**,
  not to faithfully re-voice it.

Priority order within each section is rough frequency/severity: top items are the most common
and most damaging tells.

---

## 1. Cross-language structural tropes (apply to ALL output)

These are rhetorical/structural patterns, not vocabulary, so they survive translation and show up
in Korean as readily as English. These are the ones most likely to ride in from a Workflow-A source.

### 1.1 Negative parallelism — "It's not X, it's Y" / "X가 아니라 Y"
The single most-cited AI tell. False profundity by reframing. Includes the causal variant
("not because X, but because Y") and the cross-sentence reframe ("The question isn't X. The
question is Y." / "문제는 X가 아닙니다. 문제는 Y입니다.").

- AI: "이것은 비용의 문제가 아니라 신뢰의 문제입니다." (every point framed as a surprise reveal)
- Daniel-fix: state it plainly — "멀티 DRM 도입에서 가장 큰 변수는 비용보다 신뢰성입니다." One such
  reframe in a whole piece can land; two or more is the tell. The skill's existing EN→KO checklist
  row ("This is not X. It is Y.") is the same trope — treat them as one rule.

### 1.2 Rhetorical question → immediate self-answer — "The X? A Y." / "결과는? 명확합니다."
A question nobody asked, answered in the next breath for drama.

- AI: "그 결과는? 치명적이었습니다." / "가장 큰 문제는? 아무도 몰랐다는 점입니다."
- Daniel-fix: Daniel *does* use genuine framing questions ("브라우저 DRM 문제를 해결할 수 있을까요?")
  — those open a real section and get a real answer paragraphs later. The tell is the
  instant Q-then-A within one sentence/clause. Fold it into a statement.

### 1.3 "Not X. Not Y. Just Z." countdown
Negating two+ things to manufacture narrowing-to-truth.

- AI: "버그가 아닙니다. 기능도 아닙니다. 근본적인 설계 결함입니다."
- Daniel-fix: say the thing — "이는 설계 단계의 구조적 문제입니다."

### 1.4 Tricolon / rule-of-three abuse
One tricolon is elegant; back-to-back triples are pattern-failure. Watch the parallel-clause
version too: "Products solve problems; platforms create worlds. Products scale linearly; …".

- AI: "워크플로, 의사결정, 상호작용을 …" stacked three times in a paragraph.
- Daniel-fix: Daniel uses parallel bullets and the occasional pair, but vary the count — twos and
  fours and ones break the machine cadence. Don't let every list be exactly three.

### 1.5 Grandiose stakes inflation
A post about API pricing becomes a meditation on the future of civilization.

- AI: "이것은 우리가 콘텐츠를 생각하는 방식을 근본적으로 바꿀 것입니다."
- Daniel-fix: this directly violates ko-style's 절제 rule (no 단정/과장, measured forecasts).
  Downgrade to "주목할 필요가 있습니다 / 지켜보아야 할 것 같습니다." Keep stakes proportional to the topic.

### 1.6 Superficial "-ing" / "-는" trailing analysis
A participle tail that adds significance to a mundane fact and says nothing:
"highlighting its importance," "reflecting broader trends," "~함으로써 그 중요성을 보여줍니다."

- AI: "…를 지원하며, 이는 업계의 더 큰 흐름을 반영합니다."
- Daniel-fix: cut the tail, or replace with a concrete consequence ("…를 지원하므로 오프라인 재생이
  가능해집니다").

### 1.7 False ranges — "from X to Y" where X and Y aren't on a scale
"From innovation to cultural transformation" — nothing in between.

- AI: "혁신에서 문화적 전환까지 모든 것을 …"
- Daniel-fix: name the actual items as a list; reserve "A부터 B까지" for real spectra (VOD부터
  라이브까지 — which Daniel legitimately uses for content types).

### 1.8 "Imagine a world where…" futurism
Selling a premise with a wishlist of wonderful outcomes.

- AI: "모든 도구가 조용한 지능을 갖춘 세상을 상상해 보십시오."
- Daniel-fix: open on a concrete market fact or reader problem (ko-style §3 도입), not a fantasy.

### 1.9 Invented concept-labels presented as established terms
Abstract problem-noun compounds — "the supervision paradox," "감독의 역설," "가속의 함정" — used as if
rigorously defined. Naming a thing to skip the argument.

- Daniel-fix: if you coin a frame, mark it as your own framing and earn it with an example
  (this matches his 오피니언 genre, which *sets up* a frame then validates it). Don't drop a
  coined label as if it's textbook. Multiple coined labels in one piece is strong slop signal.

### 1.10 One-point dilution / fractal summaries
Restating one thesis ten ways across thousands of words; summarizing every subsection, section,
and the whole. "In this section we'll explore… [later] …as we've seen in this section."

- Daniel-fix: Daniel declares scope once up front and closes once (도입 범위 선언 + 결론) — that's
  fine and is *not* a fractal summary. The tell is mid-body recap loops and per-subsection
  mini-summaries. One scope line, one conclusion; no echo summaries in between.

### 1.11 Signposted conclusion — "In conclusion," / "요약하자면,"
Announcing the structural move instead of just making it.

- Daniel-fix: he uses `## 결론` / `## 마치며` headings and "이상으로 ~ 알아보았습니다" — that's his
  signature and stays. But avoid inline "요약하자면 / 정리하자면" openers (0 in his corpus) and the
  English "In conclusion / To sum up." Let the heading do the signaling.

### 1.12 "Despite its challenges…" formula
Acknowledge a problem only to immediately wave it away with a tidy optimistic close.

- Daniel-fix: this collides with his genuine 균형(trade-off) habit — the difference is that Daniel
  *leaves* the tension ("장점이 있습니다. 하지만 단점이 있습니다."), he doesn't dissolve it. Don't end a
  balanced section by dismissing the downside.

---

## 2. English-surface tells (Workflow C output; also for reading Workflow-A input)

Vocabulary- and formatting-level tells that are specific to English text. Apply these when
producing English (Workflow C). When *reading* a Workflow-A English source, their presence is your
cue that the draft is AI-written and its structure should not be trusted as a template (see §4).

- **Magic vocabulary:** delve, leverage (v.), utilize, robust, streamline, harness, seamless,
  tapestry, landscape, ecosystem, paradigm, synergy. → plain words (use, sturdy, fit together).
- **"Serves as / stands as / represents" for "is":** "The module serves as the gateway" → "is the
  gateway." Use the copula.
- **Filler transitions:** "It's worth noting," "Importantly," "Notably," "Interestingly,"
  "That said" as decoration. → delete or make the connection explicit.
- **"Here's the kicker / Here's the thing / Here's where it gets interesting":** false suspense. → cut.
- **"Think of it as… / It's like a…":** patronizing analogy reflex. → state the thing directly;
  keep an analogy only if it's genuinely clearer than the concept.
- **"Let's break this down / Let's unpack / Let's dive in":** teacher-mode for an expert reader. → cut.
- **"The truth is simple / History is clear":** asserting obviousness instead of showing it. → show it.
- **Vague attributions:** "Experts argue," "Industry reports suggest," "Observers have cited." →
  name the source or drop the claim. (Daniel cites specific sources as "(참고 N)" — keep that rigor.)
- **Anaphora abuse:** three+ sentences opening with the same words ("They assume… They assume…").
- **Bold-first bullets:** *every* list item starting with a **bolded keyword**:. Daniel uses
  **굵은 라벨**: bullets sometimes — so don't ban them, but don't make 100% of bullets that shape;
  vary, and only bold a genuine term.
- **Unicode decoration:** arrows (→, ⇒), smart/curly quotes. Use straight quotes and "to"/"then".
  (Claude over-reaches for → in particular.)
- **Historical-analogy stacking:** rapid-fire "Apple didn't build Uber. Facebook didn't build
  Spotify…" to borrow authority. → one example, made well.
- **Dead metaphor:** introducing a metaphor then beating it for 30 mentions. Use once, move on.

---

## 3. Korean LLM tells (original — not in tropes.md)

LLM-generated Korean has its own fingerprints, distinct from English tropes and from classic 번역체.
Each item below is **calibrated against Daniel's `samples/ko/` corpus** so it flags machine habits,
not his real ones.

### 3.1 Hedge inflation — "~수 있습니다 / ~것입니다 / ~라고 할 수 있습니다" overload
- Daniel uses "~수 있습니다" naturally (83× in corpus) for genuine capability statements — **do not
  ban it.** The tell is (a) using it as a vague hedge where a plain 평서문 is truer, and (b)
  *clustering* — multiple "~수 있습니다" in one short paragraph.
- "~라고 할 수 있습니다" (0× in his corpus) and bare assertive "~것입니다" (only 6× — he avoids it) are
  reliable non-Daniel tells. Replace with direct 합쇼체: "…라고 할 수 있습니다" → "…입니다";
  "바뀔 것입니다" → "바뀝니다 / 바뀔 것으로 보입니다."

### 3.2 Mechanical additive connectors — 게다가 · 더 나아가 · 더불어
- **0× each in Daniel's corpus.** He connects with 또한(9×), 뿐만 아니라(10×), 이에 따라, 이를 위해, 특히,
  반면에. Swap any 게다가/더 나아가/더불어 for one of his, or restructure so the addition flows as a clause.

### 3.3 "통해 / 위한" over-reliance
- Both appear in his writing (통해 55×, 위한 34×), so this is a **soft** flag. The tell is chaining
  "~을 통해 ~을 위한 ~을 통해" or using 통해 where a direct verb is stronger: "API를 통해 요청을 전송합니다"
  → "API로 요청을 전송합니다." Trim, don't eliminate.

### 3.4 English-style rhetorical questions
- Daniel asks real section-framing questions (브라우저 DRM …할 수 있을까요?) — keep those. The tell is the
  §1.2 pattern: a dramatic question answered instantly in the same breath. In Korean this reads
  doubly artificial.

### 3.5 Over-tidy three-beat parallelism (삼단 병렬)
- The Korean face of §1.4. LLM Korean loves "A하고, B하며, C합니다" in perfect threes, repeatedly.
  Daniel uses parallel structure but irregularly. Vary clause counts; don't make every enumeration a triple.

### 3.6 Pronoun spillover — 당신 / 그것 / 이것
- **0× "당신" in his corpus.** Already covered by the EN→KO checklist; repeated here because it's the
  most recognizable MT/LLM Korean tell. Drop subject/object pronouns Korean wouldn't say; reserve
  사용자/고객/여러분 for genuine reader address.

### 3.7 Inline summary signposts — 요약하자면 · 정리하자면 · 한마디로
- **0× in his corpus.** The Korean face of §1.11. Daniel signals closure with a heading
  (`## 결론`/`## 마치며`) and "이상으로 ~ 알아보았습니다," not an inline "요약하자면." Cut the inline signpost.

### 3.8 Empty intensifiers / hype — 정말 · 매우 · 혁신적인 · 획기적인 · 강력한
- Collides with ko-style's 절제/과장 금지 rule. LLM Korean reaches for these for emphasis; Daniel
  emphasizes with **굵게** on a key term and measured wording. Strip the intensifier or replace with
  a concrete fact.

### 3.9 번역투 residue (cross-reference)
- The full English→Korean translationese checklist lives in `SKILL.md` and `ko-style.md` (pronoun
  spillover, fragment punctuation, calqued discourse markers, heading calques, em-dash carry-over).
  Run it alongside this section for Workflow A — translationese and slop tropes co-occur in
  AI-written sources.

---

## 4. Workflow A — detect source slop, don't inherit it

The Workflow-A input is an AI-written English draft. Its **content** is trusted (preserve every
technical claim — SKILL.md A5). Its **rhetorical structure is not** — it is typically built out of
§1 and §2 tropes. Re-authoring faithfully would carry the slop into Korean.

Add this read before re-authoring (slots between A1 "read for intent" and A2 "restructure"):

> **A1.5 — Slop scan of the source.** As you read for intent, mark where the English leans on
> §1/§2 tropes (negative parallelism, rhetorical Q→A, "imagine a world," grandiose stakes,
> coined-label frames, fragment drama, "Here's the kicker," bold-first bullets). These are *not*
> content — they are AI packaging. Extract the underlying claim and discard the packaging. Do not
> reproduce the source's dramatic fragmentation or reframe-everything rhythm in Korean; rebuild on
> Daniel's 도입→개요→본문→결론 skeleton (A2) and his measured register, which structurally don't admit
> most of these tropes.

A practical tell: if a Korean sentence you're about to write would only exist because the English
source used a trope (a reframe, a rhetorical question, an inflated stake), it's wrong — the same
"could only exist because the source did" test the skill already applies to translationese.

---

## 5. The slop pass (quick self-check — referenced from SKILL.md)

Run after drafting, before the close-out question. Looking for **density**, not single instances.

1. **Negative parallelism count** (X가 아니라 Y / "not X, it's Y") — more than one? Convert all but
   the strongest to plain statements.
2. **Rhetorical Q→instant-A** — any question answered in the same breath? Fold into a statement.
3. **Tricolons / 삼단 병렬** — is every list/enumeration a triple? Vary the counts.
4. **Stakes** — any "근본적으로 바꿀 것" / "fundamentally reshape" inflation? Downgrade to measured.
5. **Trailing "-는/-ing" pseudo-analysis** — cut the empty significance tails.
6. **Signposts** — inline "요약하자면 / In conclusion / Here's the thing / Let's break this down"? Cut.
7. **(KO) Hedge & connector check** — "~라고 할 수 있습니다," bare "~것입니다," 게다가/더 나아가/더불어,
   요약하자면, 당신? All non-Daniel — replace.
8. **(EN) Magic-vocab check** — delve/leverage/robust/tapestry/serves as/it's worth noting? Replace.
9. **Formatting** — unicode arrows or smart quotes? Are 100% of bullets bold-first? Fix.
10. **Density gut-check** — count total tropes in the piece. A human first draft has a few by
    accident; if you're seeing many, the rhythm still reads as machine. Re-vary sentence shapes.

Then proceed to the voice self-check in the relevant profile and the close-out question.
