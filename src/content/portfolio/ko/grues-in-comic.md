---
title: "그루스 인 코믹 — Zork × Comic Chat 매시업"
role: 사이드 프로젝트 (1인 개발)
period: "2026–현재"
summary: "Zork I의 파서 기반 텍스트 어드벤처를 Comic Chat 스타일 만화 패널로 재생하는 퍼블릭 베타. 1980·90년대에 나온 두 마이크로소프트 오픈소스 프로젝트를, 독립적인 중간 표현(IR) 계층을 통해 하나의 브라우저 게임으로 엮었습니다."
category: side-ai
tags: [ai-llm, solopreneur]
lang: ko
featured: false
order: 4
translationKey: grues-in-comic
links:
  - label: grues.danielkimdev.com
    url: https://grues.danielkimdev.com
  - label: "블로그: Zork와 Comic Chat, 하나의 게임으로"
    url: https://danielkimdev.com/ko/blog/grues-in-comic-beta
---

서로 무관해 보이는 두 마이크로소프트 오픈소스 공개에서 시작했습니다. 1980년대 텍스트 어드벤처 [Zork](https://github.com/historicalsource/zork1)와, 대화 내용을 실시간으로 만화 패널로 그려주는 1990년대 IRC 클라이언트 [Comic Chat](https://github.com/microsoft/comic-chat)입니다. Zork의 파서 기반 플레이 방식은 그대로 유지하면서, 진입 장벽이던 텍스트 출력만 Comic Chat이 자동으로 배치하는 캐릭터 포즈와 말풍선으로 바꿨습니다.

두 원작의 코드(ZIL과 오래된 C++)는 브라우저에서 그대로 돌릴 수 없기 때문에 직접 이식하는 대신, 각 원작의 동작 방식을 독립적인 계층으로 추출했습니다. 임포터가 Zork I의 ZIL 소스를 AST로 파싱하고, 특정 런타임에 종속되지 않는 중간 표현(IR)이 게임 로직을 담으며, TypeScript로 작성된 엔진이 이 IR을 실행해 월드 상태·파서·전투·저장/불러오기를 재현합니다. 엔진이 만들어내는 이벤트는 Comic Chat 방식의 렌더러로 전달되며, 패널 배치와 포즈, 말풍선 규칙은 원작 C++ 코드를 참고해 옮겼습니다. frotz로 뽑은 공략을 기준 데이터로 삼아 한 줄씩 정합성을 검증했고, 게임 결말까지 이어지는 전체 플레이 시나리오를 회귀 테스트로 고정해두었습니다.

전 과정을 AI 에이전트와의 협업으로만 만들었으며, 코드는 직접 작성하지 않았습니다. 퍼블릭 베타는 현재 공개되어 있고, 저장소는 1.0 태그와 사이트 정식 오픈 시점까지 비공개로 유지됩니다.

![그루스 인 코믹 플레이 화면 — 왼쪽은 West of House 시작 장면을 네 컷의 Comic Chat 패널로 그린 모습(Hero와 Dungeon Master 캐릭터 등장), 오른쪽은 look, open mailbox, get leaflet 같은 명령을 입력한 고전 Zork 텍스트 출력](/images/portfolio/grues-in-comic.png)
