---
title: "Adding a Newsletter to My Blog on Kit's Free Plan"
description: "My blog only had an RSS feed, so I added email subscription with Kit's free plan. Here's why I picked Kit, what caused the confirmation emails to land in spam and how I fixed it, what the free plan blocks, and how a Cloudflare Worker uses the Kit API to draft a broadcast for every new post."
lang: en
translationKey: kit-newsletter-for-my-blog
tags:
  - automation
  - solopreneur
pubDate: 2026-10-26
draft: false
---

**What you'll get from this post**

- How I chose an email service by its free limit. As of October 2026, [Buttondown](https://buttondown.com)'s free plan stops at 100 subscribers, while the limit on my [Kit](https://kit.com) account is 10,000.
- What sent my confirmation emails to spam and made them bounce, and the order I fixed it in. Kit was sending as my Gmail address, so [DMARC](https://www.rfc-editor.org/rfc/rfc7489) (the check where the receiving side confirms that the sending server matches the domain in the From address) failed. Cloudflare Email Routing and a few DNS records fixed it.
- A table of what Kit's free plan blocks (the MCP connector and RSS auto-send) and what stays open (creating drafts through REST API v4).
- How a Cloudflare Worker creates a Kit draft for each new post, with the core API call, and why my first drafts had no unsubscribe link or footer.

**Good fit:** you're adding free email subscription to a static site or personal blog and want new-post emails automated.

**Not for you:** you publish once or twice a month, since creating the broadcast by hand is probably simpler than running a Worker. If your plan includes RSS auto-send, you don't need the Worker at all.

**Keep in mind:** this is one personal blog's experience in October 2026. The Worker made its first drafts from this post only after I fixed its saved state by hand, and I haven't yet seen it draft a new post with no help from me.

For a long time this blog had only an RSS feed. I had analytics, but no channel that reached readers directly, so I had no way to tell anyone about a new post. I decided to add email subscription. I built it with Buttondown on October 15 and left it hidden, then spent October 26 switching to Kit, fixing an email delivery problem, and automating new-post drafts.

The first problem I hit was that the confirmation email from my first test landed in spam.

## I picked Kit for its free limit

The site is a static Astro site on Cloudflare Pages. There's no server, so the signup form is a plain HTML form that posts straight to the email service. Switching services only means changing the form's action URL and the `form-action` in the Content Security Policy. That's also why moving from Buttondown to Kit took less than a day.

I looked at Buttondown, [EmailOctopus](https://emailoctopus.com), and Kit, and the deciding factor was the free limit. I'm not planning to pay for now. As of October 2026, [Buttondown's free plan](https://buttondown.com/pricing) stops at 100 subscribers, while the limit on my Kit account is 10,000. If you know you'll stay under 100, Buttondown's free plan would have been fine. I just didn't want to migrate again after hitting a cap.

## The confirmation emails went to spam and bounced

After adding the form, I signed up myself. The confirmation email landed in the spam folder of my Google Workspace account and bounced on Daum Mail. The `Authentication-Results` header in the raw message showed the cause. Kit's default sender was my personal Gmail address, and the header said `dmarc=fail` for `header.from=gmail.com`. **DMARC** is the check where the receiving side confirms that the server that sent a message matches the domain in its From address. Kit's servers were sending as a `gmail.com` address, so the check failed.

The fix was to send from my own domain. It took three steps.

1. I turned on [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/) for `danielkimdev.com`. It adds an MX record (which servers receive mail for the domain) and an SPF record (which servers may send as the domain, `include:_spf.mx.cloudflare.net`), and mail to `hello@danielkimdev.com` lands in my Gmail.
2. I verified `hello@danielkimdev.com` in Kit and made it the default sender.
3. I added the records Kit needs to authenticate the sending domain to Cloudflare DNS. Claude Code did this with the `cf` CLI (`cf dns records create`). That's three CNAMEs set to "DNS only" with no proxy. `ckespa` points to Kit's SPF setup, and `cka._domainkey` and `cka2._domainkey` point to the DKIM keys Kit uses to sign messages. There's also a `_dmarc` TXT record with `v=DMARC1; p=none;`. `p=none` is the loosest policy, since it doesn't ask receivers to reject mail that fails authentication, so I started there. It can be tightened to `quarantine` and then `reject` later.

After that, the confirmation email reached Daum Mail. I also signed up again with my Google Workspace address, and this time it landed in the inbox instead of spam.

## What the free plan blocks

I tried connecting Kit to Claude Code through its connector (MCP) to manage subscribers and broadcasts. Every call came back with a message saying Kit MCP needs a paid plan. I'm not upgrading right now, so I deleted the connector. The REST API, though, is open on a free account. I called it directly with an API key. Here's what I found.

| Item | Free plan |
|---|---|
| Kit MCP connector | Blocked (paid plan required) |
| RSS-based auto-send (turns new posts in the feed into emails) | Blocked (paid plan required) |
| REST API v4, read account and broadcasts | Works |
| REST API v4, create a draft broadcast | Works (HTTP 201) |
| Subscriber limit | 10,000 |

## Drafting each new post with the Kit API and a Cloudflare Worker

Without RSS auto-send, every new post means opening Kit and pasting a link into a new broadcast (one email sent to your list). RSS auto-send would remove that chore. I knew I'd eventually stop doing that, so I set it up to create only a **draft** in Kit when a post goes live. I review it and press send myself. Auto-send is possible, but these go to real subscribers, so Claude Code suggested stopping at the draft and I agreed.

A [cron trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/) runs the Worker at the top of every hour. It reads the English and Korean feeds (`/rss.xml` and `/ko/rss.xml`), compares the links against the ones stored in Workers KV (Cloudflare's key-value store), and for each new post it creates a draft through the Kit [API v4](https://developers.kit.com/). The email template is a copy of Kit's "Escape" that I saved as "My Escape." The core call looks like this.

```js
const image = p.image || env.DEFAULT_THUMB;
const res = await fetch('https://api.kit.com/v4/broadcasts', {
	method: 'POST',
	headers: { 'X-Kit-Api-Key': env.KIT_API_KEY, 'Content-Type': 'application/json' },
	body: JSON.stringify({
		subject: p.title,
		content: buildEmail(p, lang, image), // the whole email HTML, footer and {{ unsubscribe_url }} included
		public: false,
		email_template_id: 5639223, // My Escape
		thumbnail_url: image,
		thumbnail_alt: p.title,
	}),
});
```

`content` takes the whole email as HTML. My first drafts sent just two `<p>` tags, and Kit's editor warned that the email was missing an unsubscribe link and showed none of the template's header or footer. In my case the template ID only labels the draft and doesn't apply the layout. So I fetched the My Escape HTML through the API, left slots for the title, date, image, and body, and the Worker fills them in for each post. The footer's `{{ unsubscribe_url }}` and `{{ address }}` stay as they are.

On the first run the Worker only records the existing links and creates no drafts, because otherwise every post I've ever written would show up as a draft. And it records a link only after the draft succeeds, so a post that failed because of a Kit error gets retried at the next hour.

Kit's broadcast list shows a thumbnail slot for each broadcast, and a draft created through the API without one shows a gray image icon. So I added an `<enclosure>` with the post's main image (`ogImage`, or `heroImage` if there isn't one) to each RSS item, and the Worker passes it along as the thumbnail. Posts without an image get the site's default OG image, and the same image goes at the top of the email body.

## Wrapping up

The free plan was enough to get email subscription, a verified sending domain, and automatic drafts for new posts. In exchange, Kit's AI connector and RSS auto-send are both paid features, so I had to fill that gap myself with the API and a Worker. If you publish once or twice a month, creating the broadcast by hand is probably simpler than running a Worker.

How I separate Korean and English subscribers will get its own post. The signup form is below the latest posts on the home page. If you'd like new posts in your inbox, please subscribe.
