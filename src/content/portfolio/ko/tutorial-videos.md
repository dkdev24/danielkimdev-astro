---
title: 코드로 만드는 튜토리얼 영상 — HyperFrames와 Claude
role: 디벨로퍼 애드보킷
org: DoveRunner
period: 2026–현재
startDate: 2026-09-16
summary: "DoveRunner 제품 튜토리얼 영상을 코드로 다시 만들고 있습니다. HyperFrames 컴포지션, 실제 콘솔 캡처, 합성 내레이션과 자막을 Claude와 함께 작성하고 관리해서, UI나 문서가 바뀌면 다시 촬영하지 않고 다시 렌더링하면 됩니다."
category: devrel
tags: [drm-content-security, automation, ai-llm]
lang: ko
featured: false
order: 2
links:
  - label: DoveRunner Lab 아카데미의 영상
    url: https://lab.doverunner.com/ko/academy
  - label: HyperFrames
    url: https://github.com/heygen-com/hyperframes
---

YouTube에 올라가 있던 DoveRunner 연동 튜토리얼은 PallyCon에서 리브랜딩하기 전에 만든
영상이라, 화면 속 콘솔도 이미 지금과 달랐습니다. 제품이 바뀔 때마다 영상을 다시 녹화하고
편집하고 녹음하는 방식은 오래 갈 수 없습니다. 그래서 이 문제를 제작이 아니라 유지보수의
문제로 보고 접근했습니다.

이제 튜토리얼 하나하나가 저장소 안의 프로젝트입니다. 최신 문서와 대조한 튜토리얼 스펙과
내레이션 스크립트, 민감 정보를 가리고 강조 박스 위치를 측정해 둔 실제 콘솔 캡처, 공용
컴포넌트 라이브러리 위에 [HyperFrames](https://github.com/heygen-com/hyperframes) HTML
컴포지션으로 만든 장면이 함께 들어 있습니다. 내레이션은 로컬에서 합성하고 자막 타이밍을
맞추며, 배경 음악도 타임라인에 맞게 잘라 넣은 뒤 영상 전체를 결정적으로 렌더링합니다. 장면
구성과 타이밍, 도구 작업은 대부분 Claude가 맡고, 사람은 음성을 만들기 전에 내레이션을,
공개하기 전에 기술적 정확성을 승인합니다.

2026년 9월 영상 한 편짜리 개념 검증으로 시작해 지금은 실제 제작 방식이 되었습니다. CLI
패키징, 라이선스 토큰, 재생 테스트, AWS Elemental MediaConvert와 MediaLive·MediaPackage를
이용한 DRM 패키징, 트랜스코딩·패키징, 포렌식 워터마킹 튜토리얼을
[DoveRunner Lab](https://lab.doverunner.com/ko/academy)의 레슨으로 공개하고 있습니다.
