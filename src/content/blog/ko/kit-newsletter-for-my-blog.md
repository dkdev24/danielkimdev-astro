---
title: "Kit 무료 플랜으로 개인 블로그에 뉴스레터를 붙인 과정"
description: "RSS밖에 없던 개인 블로그에 Kit 무료 플랜으로 이메일 구독을 붙였습니다. 서비스를 고른 기준, 확인 메일이 스팸함으로 간 문제의 원인과 해결, 무료 플랜에서 막힌 부분, 그리고 Kit API와 Cloudflare Workers로 새 글 초안을 자동으로 만든 과정을 정리했습니다."
lang: ko
translationKey: kit-newsletter-for-my-blog
tags:
  - automation
  - solopreneur
pubDate: 2026-10-26
draft: false
---

**이 글에서 얻을 수 있는 것**

- 무료 한도를 기준으로 이메일 서비스를 고른 과정입니다. 2026년 10월 기준으로 [Buttondown](https://buttondown.com) 무료 플랜은 구독자 100명까지, [Kit](https://kit.com)은 계정 정보상 10,000명까지였습니다.
- 확인 메일이 스팸함으로 가고 반송된 원인과 해결 순서입니다. Kit이 제 Gmail 주소로 메일을 보내서 [DMARC](https://www.rfc-editor.org/rfc/rfc7489)(받는 쪽이 발신 주소의 도메인과 실제로 보낸 서버가 맞는지 확인하는 검사)가 실패했고, Cloudflare Email Routing과 DNS 레코드 설정으로 해결했습니다.
- Kit 무료 플랜에서 막힌 것(MCP 커넥터, RSS 자동 발송)과 열려 있는 것(REST API v4로 초안 생성)을 정리한 표입니다.
- Cloudflare Worker가 새 글마다 Kit 초안을 만드는 구조와 핵심 API 호출 코드입니다. wrangler 버전 때문에 배포가 한 번 막혔던 과정도 담았습니다.

**이런 분께 맞습니다:** 정적 사이트나 개인 블로그에 무료로 이메일 구독을 붙이면서 새 글 알림을 자동화하고 싶은 경우입니다.

**맞지 않는 경우:** 새 글이 한 달에 한두 편이라면 Worker 없이 브로드캐스트를 직접 만드는 쪽이 더 간단합니다. 유료 플랜에서 RSS 자동 발송을 쓸 수 있다면 Worker도 필요 없습니다.

**유의할 점:** 한 개인 블로그가 2026년 10월에 겪은 일이고, Worker가 실제 새 글에서 초안을 만드는지는 아직 확인하지 못했습니다.

이 블로그에는 오랫동안 RSS 피드밖에 없었습니다. 분석 도구는 붙어 있었지만 독자와 직접 이어지는 채널은 없었기 때문에, 새 글을 알릴 방법이 사실상 없는 셈이었습니다. 그래서 이메일 구독을 붙이기로 했습니다. 10월 15일에 Buttondown으로 한 번 만들었다가 숨겨 두었고, 10월 26일 하루 동안 Kit으로 갈아타서 메일 전달 문제를 풀고 새 글 알림 자동화까지 붙였습니다.

가장 먼저 부딪힌 문제는 첫 테스트에서 확인 메일이 스팸함으로 들어간 것이었습니다.

## 무료 한도를 기준으로 Kit을 골랐습니다

이 사이트는 Astro로 만든 정적 사이트이고 Cloudflare Pages에서 서비스됩니다. 서버가 없기 때문에 구독 폼은 이메일 서비스의 주소로 바로 제출하는 일반 HTML 폼이면 충분합니다. 서비스를 바꾸더라도 폼의 제출 주소와 보안 헤더(CSP)의 `form-action`만 고치면 됩니다. Buttondown에서 Kit으로 옮기는 작업이 하루 안에 끝난 것도 이 때문입니다.

후보는 Buttondown, [EmailOctopus](https://emailoctopus.com), Kit이었고 기준은 무료 한도였습니다. 당장 유료 플랜을 쓸 계획이 없었는데, 2026년 10월 기준으로 [Buttondown의 무료 플랜](https://buttondown.com/pricing)은 구독자가 100명까지인 반면 Kit은 계정 정보에서 확인한 한도가 10,000명입니다. 구독자가 100명을 넘길 일이 없다면 Buttondown의 무료 플랜도 충분했을 것입니다. 다만 저는 한도에 걸려서 서비스를 다시 옮기는 일을 피하고 싶었습니다.

## 첫 테스트에서 확인 메일이 스팸함과 반송으로 갔습니다

폼을 붙이고 직접 가입해 보니, Google Workspace 계정에서는 확인 메일이 스팸함으로 들어갔고 Daum 메일에서는 반송되었습니다. 메일 원본 헤더의 `Authentication-Results`를 보니 원인은 발신 주소였습니다. Kit의 기본 발신 주소가 제 Gmail 주소(`danielkimdev24@gmail.com`)였고, `header.from=gmail.com`에 대한 `dmarc=fail`이 찍혀 있었습니다. **DMARC**는 메일의 발신 주소 도메인과 실제로 보낸 서버가 맞는지 받는 쪽이 검사하는 방식입니다. Kit의 서버가 `gmail.com` 주소로 메일을 보냈으니 이 검사를 통과하지 못했습니다.

해결은 제 도메인에서 보내는 것이었고, 세 단계로 진행했습니다.

1. [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/)을 `danielkimdev.com`에 켰습니다. 이때 MX 레코드(이 도메인으로 오는 메일을 받을 서버)와 SPF 레코드(이 도메인 이름으로 메일을 보낼 수 있는 서버 목록, `include:_spf.mx.cloudflare.net`)가 추가되며, `hello@danielkimdev.com`으로 오는 메일이 제 Gmail로 전달됩니다.
2. `hello@danielkimdev.com`을 Kit에서 발신 주소로 인증하고 기본 발신자로 바꿨습니다.
3. Kit의 발신 도메인 인증에 필요한 레코드를 Cloudflare DNS에 추가했습니다. 이 작업은 Claude Code가 `cf` CLI(`cf dns records create`)로 처리했습니다. CNAME 3개는 프록시 없이 'DNS only'로 두었습니다. `ckespa`는 Kit의 SPF 설정을, `cka._domainkey`와 `cka2._domainkey`는 Kit이 메일에 서명할 때 쓰는 DKIM 키를 가리킵니다. 그리고 `_dmarc` TXT 레코드는 `v=DMARC1; p=none;`으로 넣었습니다. `p=none`은 인증에 실패한 메일의 차단을 요구하지 않는 가장 느슨한 정책이어서 처음에는 이 값으로 두었고, 상황을 보며 `quarantine`, `reject` 순으로 강화할 수 있습니다.

이후 Daum 메일로 확인 메일이 정상적으로 도착했습니다. Google Workspace 계정으로도 다시 가입해 보았고, 이번에는 스팸함이 아니라 받은편지함으로 들어왔습니다.

## 무료 플랜에서 막힌 부분

Claude Code에 Kit 커넥터(MCP)를 연결해 구독자와 브로드캐스트를 관리하려고 했는데, 호출마다 "Kit MCP는 유료 플랜이 필요하다"는 응답만 돌아왔습니다. 당장 유료로 전환할 계획이 없어서 커넥터는 지웠습니다. 다만 REST API는 무료 계정에서도 열려 있었습니다. 발급한 API 키로 직접 호출해 확인한 결과는 아래와 같습니다.

| 항목 | 무료 플랜 |
|---|---|
| Kit MCP 커넥터 | 막힘 (유료 플랜 필요) |
| RSS 기반 자동 발송 (피드의 새 글을 메일로 자동 생성) | 막힘 (유료 플랜 필요) |
| REST API v4, 계정과 브로드캐스트 조회 | 가능 |
| REST API v4, 브로드캐스트 초안 생성 | 가능 (HTTP 201) |
| 구독자 한도 | 10,000명 |

## Kit API와 Cloudflare Workers로 새 글 초안 만들기

RSS 자동 발송을 쓸 수 없으니, 새 글이 올라올 때마다 Kit에 들어가 링크를 붙여 넣어 브로드캐스트(Kit에서 한 번에 보내는 메일 한 통)를 만들어야 합니다. RSS 자동 발송이 있다면 필요 없는 일입니다. 이 작업이 반복되면 결국 안 하게 될 것 같아서, 새 글이 올라오면 Kit에 **초안**까지만 자동으로 만들어지게 했습니다. 발송 버튼은 제가 검토한 뒤 직접 누릅니다. 자동 발송까지 가능하지만, 실제 구독자에게 나가는 메일이어서 Claude Code가 초안까지만 만드는 방식을 제안했고 그대로 가기로 했습니다.

[Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/)로 매시 정각에 Worker가 영어와 한국어 RSS 피드(`/rss.xml`, `/ko/rss.xml`)를 읽고, Workers KV(Cloudflare의 키-값 저장소)에 기록해 둔 링크와 비교해 새 글만 골라 Kit [API v4](https://developers.kit.com/)로 초안을 만듭니다. 메일 템플릿은 Kit의 'Escape'를 복사해 저장한 'My Escape'를 씁니다. 핵심 호출은 아래와 같습니다.

```js
const res = await fetch('https://api.kit.com/v4/broadcasts', {
	method: 'POST',
	headers: { 'X-Kit-Api-Key': env.KIT_API_KEY, 'Content-Type': 'application/json' },
	body: JSON.stringify({
		subject: p.title,
		content: `<p>${esc(p.description)}</p><p><a href="${esc(p.link)}">${esc(p.title)}</a></p>`,
		public: false,
		email_template_id: 5639223, // My Escape
		thumbnail_url: p.image || env.DEFAULT_THUMB,
		thumbnail_alt: p.title,
	}),
});
```

첫 실행에서는 기존 글의 링크를 기록만 하고 초안은 만들지 않습니다. 그렇지 않으면 지금까지 쓴 글 전체가 초안으로 쏟아집니다. 또 링크는 초안 생성이 성공한 뒤에만 기록하므로, Kit 쪽 오류로 실패한 글은 다음 정각에 다시 시도됩니다.

Kit의 브로드캐스트 목록 화면에는 글마다 썸네일 자리가 있는데, API로 만든 초안은 비어 있으면 회색 이미지 아이콘으로 보입니다. 그래서 RSS 항목에 `<enclosure>`로 글의 대표 이미지(`ogImage`, 없으면 `heroImage`)를 넣고, Worker가 이것을 썸네일로 넘기게 했습니다. 이미지가 없는 글은 사이트 기본 OG 이미지가 들어갑니다.

배포에서는 한 번 돌아갔습니다. `cf deploy`가 프로젝트 안에 wrangler 4.136 이상과 `cloudflare.config.ts`를 요구했는데, 이 저장소에는 4.127.1과 `wrangler.toml`뿐이었습니다. `cf migrate`로 설정을 변환하고 wrangler를 4.152.0으로 올려서 Worker 폴더와 한 버전으로 맞췄습니다.

Worker 코드, RSS 수정, 배포는 Claude Code가 작성하고 실행했습니다. 저는 초안만 만들게 한다는 방향, 템플릿과 썸네일 같은 결과물의 모양, 그리고 Kit 화면에서 확인하는 부분을 맡았습니다. 코드는 [저장소의 `workers/kit-rss-draft`](https://github.com/dkdev24/danielkimdev-astro/tree/main/workers/kit-rss-draft)에 공개되어 있습니다.

## 마치며

무료 플랜으로도 블로그의 이메일 구독, 도메인 인증이 된 발신 주소, 새 글 초안 자동화까지 갖출 수 있었습니다. 대신 Kit의 AI 커넥터와 RSS 자동 발송은 유료 기능이어서 쓸 수 없었고, 그 빈자리를 API와 Worker로 직접 채워야 했습니다. 새 글이 한 달에 한두 편이라면 Worker 없이 브로드캐스트를 직접 만드는 쪽이 더 간단할 수도 있습니다.

앞으로는 첫 실제 초안이 제대로 만들어지는지 확인하고, 한국어와 영어 구독자를 나누는 방법을 정할 예정입니다. 구독 폼은 이 블로그 첫 화면 아래쪽에 있습니다. 새 글이 올라올 때 메일로 받아보고 싶으시다면 구독해 주시기 바랍니다.
