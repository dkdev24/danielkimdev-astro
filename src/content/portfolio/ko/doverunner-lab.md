---
title: DoveRunner Lab — 보안 제품 온보딩 사이트
role: 프로덕트 오너 & 개발
org: DoveRunner
period: 2026–현재
startDate: 2026-09-23
summary: "고객과 사내 구성원 모두가 콘텐츠 보안이 실제로 동작하는 모습을 직접 확인하는 공개 개발자 사이트입니다. 실시간 DRM·워터마크 인스펙터가 붙은 레퍼런스 플레이어와 짧은 튜토리얼 코스로 구성했고, Claude Code로 만들어 lab.doverunner.com에서 운영 중입니다."
category: devrel
tags: [drm-content-security, ott-streaming, ai-llm]
lang: ko
featured: false
order: 1
links:
  - label: lab.doverunner.com
    url: https://lab.doverunner.com/ko
  - label: 아카데미
    url: https://lab.doverunner.com/ko/academy
---

DRM은 잘 동작할수록 눈에 보이지 않습니다. 그래서 데모를 보여줘도 평범한 영상처럼 보이고,
반대로 재생이 실패하면 연동하는 개발자는 원인을 찾기 어렵습니다. DoveRunner Lab은 이 보안
계층을 눈에 보이게 만들고, 고객이든 사내 구성원이든 처음 접하는 사람이 한곳에서 배울 수
있도록 만든 사이트입니다.

- **플레이그라운드.** DRM과 포렌식 워터마킹이 적용된 콘텐츠를 재생하는 레퍼런스
  플레이어입니다. 실시간 인스펙터가 DRM 종류, 보안 레벨, 라이선스·토큰 교환 과정, 키 상태를
  보여주고 오류는 쉬운 말로 풀어 줍니다. 개발자는 자신의 스트림과 토큰으로 직접 테스트할 수
  있고, 연동 작업에 자주 쓰는 도구도 함께 제공합니다.
- **아카데미.** Multi-DRM, 포렌식 워터마킹, 트랜스코딩·패키징, 안티 파이러시, 모바일 앱
  보안을 시작하는 짧은 코스입니다. 튜토리얼 영상과 한국어·영어 스크립트를 제공하고, 각
  레슨은 플레이그라운드와 제품 문서로 이어집니다. 레퍼런스는 문서가, 튜토리얼은 Lab이
  맡도록 역할을 나눴습니다.
- **처음부터 도그푸딩.** 패키징, Multi-DRM, AWS 기반 서버 사이드 워터마킹까지 DoveRunner
  제품을 처음부터 끝까지 직접 사용해 운영합니다. 플레이어, 인스펙터, 샘플 토큰 엔드포인트는
  고객이 그대로 가져다 쓸 수 있는 코드로 작성했습니다.

원페이저부터 출시까지 직접 맡았습니다. 제품 스펙, 단계별 개발 계획, 아키텍처 결정, 그리고
실제 개발까지 Claude Code와 함께 진행했습니다(Next.js, Shaka Player, AWS CDK). 2026년
10월에 출시했고, 다음 단계는 네이티브 모바일 레퍼런스 앱입니다.
