---
title: 에이전트 친화 문서 (Agent-Ready Docs)
role: 디벨로퍼 애드보킷
org: DoveRunner
period: 2026–현재
startDate: 2026-05-28
summary: "사람뿐 아니라 AI 코딩 에이전트도 DoveRunner 개발자 문서를 제대로 활용할 수 있도록 만드는 작업입니다. 문서 감사와 에이전트 친화 인프라 구축, 그리고 이 방법을 누구나 쓸 수 있게 만든 오픈소스 도구까지 이어집니다."
category: devrel
tags: [ai-ready-docs, ai-llm]
lang: ko
featured: true
order: 3
translationKey: agent-ready-docs
links:
  - label: "블로그: 에이전트 준비도"
    url: https://danielkimdev.com/ko/blog/agent-readiness/
  - label: siteready (GitHub)
    url: https://github.com/dkdev24/siteready
  - label: DoveRunner 개발자 문서
    url: https://docs.doverunner.com/ko/
---

이제 개발자는 브라우저 탭보다 AI 코딩 에이전트를 통해 문서를 만나는 경우가 많아졌습니다.
이 작업의 출발점은 단순한 질문입니다. 에이전트가 이 문서만 보고 실제로 동작하는 연동 코드를
만들 수 있는가? 그리고 그 답에서 드러난 문제를 하나씩 고쳐 나갑니다.

- **측정.** 공개된 에이전트 준비도 스캐너로 문서 사이트를 점검하고, 고객의 실제 연동 흐름을
  따라가는 E2E 시나리오로 콘텐츠를 감사했습니다. 빈틈은 대개 페이지와 페이지 사이에 숨어
  있습니다.
- **인프라 개선.** `llms.txt`, 모든 페이지의 마크다운 버전, 마크다운 콘텐츠 협상, AI 크롤러를
  위한 콘텐츠 시그널을 적용했습니다.
- **콘텐츠 개선.** 감사에서 나온 이슈를 답을 가진 각 제품 팀과 함께 정리했습니다.
- **일반화.** 스캔 → 수정 → 재스캔 과정을 오픈소스 CLI이자 에이전트 스킬인
  [siteready](https://github.com/dkdev24/siteready)로 만들었습니다. 이 사이트도 테스트
  대상 중 하나입니다.

같은 맥락이 일상 업무로도 이어집니다. 새 프로덕트 오너로 합류했을 때 Claude와 Jira MCP로
흩어진 티켓을 쓸 수 있는 맥락으로 정리해 빠르게 적응했고, 그 과정을
[Medium에 정리](https://medium.com/@daniel-inka)했습니다.
