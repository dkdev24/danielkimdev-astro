---
title: "아이콘이 있는 단계별 Mermaid 다이어그램 pele-animate"
role: 사이드 프로젝트 (1인 개발)
period: "2026–현재"
startDate: 2026-10-21
summary: "Pele 다이어그램 렌더러의 비공식 오픈소스 애드온입니다. Mermaid 코드를 작성자가 정한 순서대로 독자가 한 단계씩 따라갈 수 있는 다이어그램으로 바꿔 주며, 노드에 아이콘도 넣을 수 있습니다."
category: side-ai
tags: [ai-llm, solopreneur]
lang: ko
featured: false
order: 5
translationKey: pele-animate
links:
  - label: pele-animate.danielkimdev.com
    url: https://pele-animate.danielkimdev.com/ko/
  - label: npm의 pele-animate
    url: https://www.npmjs.com/package/pele-animate
  - label: GitHub 소스
    url: https://github.com/dkdev24/pele-animate
---

문서에 들어가는 다이어그램은 대개 전체가 한꺼번에 보여서, 독자가 어디서부터 읽어야 할지 스스로 찾아야 합니다. 저는 순서대로 스스로 설명하는 다이어그램을 원했고, GitHub와 Obsidian에서도 그대로 보이도록 일반 Mermaid 코드로 쓰고 싶었습니다. [Pele](https://pele.run)가 이미 Mermaid를 작고 빠르게 그려 주기 때문에, 이를 대체하지 않고 그 위에 올리는 비공식 애드온으로 pele-animate를 만들었습니다.

주석 한 줄(`%% pa: 1=A 2=B,C`)로 순서를 고정하면 독자는 버튼이나 키보드로 단계를 넘겨 가며 읽습니다. 주석이 없으면 엣지 순서를 따르고, 기본 상태는 항상 완성된 그림이며, 모션 줄이기 설정도 지킵니다.

- **단계 순서와 재생**: 이전, 재생, 다음 컨트롤이 있는 단계 모드와 선택 기능인 자동 재생을 플로차트, 시퀀스, 아키텍처, 상태, C4, 클래스, ER 다이어그램 등에서 쓸 수 있습니다.
- **아이콘**: 36개 카테고리의 Tabler 선형 아이콘 4,368개를 제공하며 import한 카테고리만 불러오고, 직접 만든 아이콘도 등록할 수 있습니다.
- **AI 에이전트 지원**: 프로젝트에 연결하고 브라우저에서 결과를 확인하는 스킬이 패키지에 들어 있고, 모든 문서 페이지는 Markdown으로도 제공됩니다.

첫 사용처는 DoveRunner 문서 사이트이며, 다이어그램에 적용했습니다. 사이트와 문서는 영어와 한국어로 제공합니다. 다른 사이드 프로젝트와 마찬가지로 AI 에이전트와의 협업으로 만들었고, 패키지는 npm에 공개되어 있습니다.
