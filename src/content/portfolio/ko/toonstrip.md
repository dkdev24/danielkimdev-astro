---
title: "toonstrip — 데이터로 그리는 실시간 만화 위젯"
role: 사이드 프로젝트 (1인 개발)
period: "2026–현재"
startDate: 2026-09-01
summary: "그루스 인 코믹에서 분리해 만든 오픈소스 라이브러리입니다. 캐릭터, 포즈, 감정, 말풍선, 배경을 데이터로 넘기면 Astro, React, Vue, 일반 HTML 페이지 안에 실시간으로 그려지는 만화 위젯을 만들어 줍니다."
category: side-ai
tags: [ai-llm, solopreneur]
lang: ko
featured: false
order: 6
links:
  - label: toonstrip.danielkimdev.com
    url: https://toonstrip.danielkimdev.com
  - label: "npm의 @toonstrip/element"
    url: https://www.npmjs.com/package/@toonstrip/element
  - label: "그루스 인 코믹 글의 라이브 데모"
    url: https://danielkimdev.com/ko/blog/grues-in-comic-beta
---

[그루스 인 코믹](/ko/portfolio/grues-in-comic/)을 만들다 보니, 만화 패널을 그리는 부분은 Zork와 전혀 상관없이 혼자서도 쓸모가 있었습니다. 이 부분이 신경 쓰는 것은 패널에 누가 있고, 무슨 말을 하고, 어떤 감정인지뿐이었기 때문입니다. toonstrip은 이 렌더링 부분을 떼어내 누구나 웹페이지에 넣어 쓸 수 있는 라이브러리로 일반화한 프로젝트입니다.

패널, 캐릭터, 대사별 감정, 대사 내용을 데이터로 넘기면, toonstrip이 이를 고정된 이미지가 아니라 실제 `<canvas>` 요소에 그리고 페이지 크기가 바뀌면 다시 배치합니다. 콘텐츠를 생성하는 기능은 의도적으로 넣지 않았습니다. 대사는 직접 쓰든, 스크립트로 만들든, LLM에게 맡기든 사용하는 쪽에서 정하고, toonstrip은 받은 데이터를 그리기만 합니다.

- **프레임워크 지원**: 프레임워크에 의존하지 않는 커스텀 엘리먼트를 중심으로 Astro, React, Vue용 래퍼와 빌드 없이 쓰는 HTML 예제를 제공합니다.
- **에셋 팩**: 원작 Comic Chat의 캐릭터 15명이 기본 팩으로 들어 있고, 패키저 CLI로 직접 그린 캐릭터를 새 팩으로 만들 수 있습니다.
- **AI 에이전트 지원**: AI 코딩 에이전트가 만화 문서를 작성하고 검증할 수 있도록 에이전트 스킬을 함께 제공합니다.

그루스 인 코믹과 마찬가지로 AI 에이전트와의 협업으로 만들었습니다. 현재 11개 패키지가 npm에 공개되어 있고, 이 사이트의 그루스 인 코믹 글에 들어간 만화도 toonstrip으로 그렸습니다.
