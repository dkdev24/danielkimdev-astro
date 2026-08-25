---
title: "What the 1835 Moon Hoax Teaches Us About Watermarking and C2PA"
description: "The 1835 Great Moon Hoax fooled New York by borrowing a real astronomer's name. Here's how watermarking and C2PA content provenance are answering that same old problem in the AI era."
pubDate: 2026-08-25
lang: en
tags: [ai-llm]
draft: false
translationKey: great-moon-hoax-ai-misinformation-warning
heroImage: ./great-moon-hoax-hero.jpg
---

How much of the news you read today do you actually believe is true?

It's easy to think "I wouldn't fall for something so obviously fake." But that confidence looks a lot shakier once you hear about the Great Moon Hoax, a fake news story that swept all of New York almost 190 years ago. Borrowing a respected name to fool the public works the same way now as it did then. The technology behind it has just gotten far more powerful.

This post covers that hoax, plus what watermarking and C2PA content provenance are doing about this same old problem today.

## 1835: The "Bat-Men on the Moon" Story That Fooled New York

In August 1835, the New York newspaper *The Sun* began running a series of articles that turned the world upside down.[^1] The story claimed that Sir John Herschel, a respected British astronomer, had set up a massive new telescope in South Africa and used it to observe the Moon in unprecedented detail. What the articles described was pure wonder:

- **A lunar ecosystem**: basalt mountain ranges and fields blooming with red flowers
- **Strange animals**: single-horned goats and upright, fire-building beavers
- **The ultimate discovery**: a winged, city-building species called "man-bats" (*Vespertilio-homo*)

![An 1835 illustration published in The Sun, showing a lunar landscape ringed by red cliffs and waterfalls.](https://upload.wikimedia.org/wikipedia/commons/f/fb/Great-Moon-Hoax-1835-New-York-Sun-lithograph-298px.jpg)
*A lunar landscape illustration from The Sun's August 28, 1835 installment, depicting a "ruby amphitheater" ringed by cliffs and waterfalls. (Source: Wikimedia Commons, public domain)*[^2]

Edgar Allan Poe, writing about the episode afterward, put it this way: "not one person in ten discredited it." New York took the story at face value. Scholars from Yale reportedly showed up at the newspaper's office demanding to see the original observation records. A group of Baptist ministers went further, earnestly asking whether there was any way to bring the Gospel to the Moon's inhabitants.[^3]

None of it was real. Richard Adams Locke, a *Sun* reporter, had fabricated the entire series to boost circulation. By borrowing a real astronomer's name and the format of a credible scientific journal, he shut down the public's critical thinking almost completely. It's remembered today as one of the most effective hoaxes in history.

## 190 Years Later, the Deception Got More Sophisticated

The 1835 hoax ended quietly, with a newspaper's confession and a public that mostly laughed it off. Generative AI and social media haven't made us any safer from fake news since then. If anything, the danger has grown. Where old-fashioned fake news depended on the printed word, today's version of "a lie that looks more real than the truth" gets produced as images and video.

Locke borrowed Herschel's name to lend his fabrication authority. Deepfakes combined with generative AI can now produce video and audio of a real politician or celebrity saying something they never said, in a matter of seconds. Locke's fake was a convincing lie dressed in borrowed authority, built entirely out of words. Today's version is something you can watch and hear, and still not be able to tell it's fake.

Readers in 1835 had no real way to check whether the story Locke had built around Herschel's name was even true. A story back then could only spread as fast as a newspaper could be printed and carried by horse-drawn wagon, and that physical limit capped how far it could travel before the hoax was exposed. Now content reaches millions of screens within minutes, riding an algorithm, and even that limit is gone. Closing this verification gap is what the tech industry has spent the past few years working on.

## The Tech That Proves Where Content Came From: Watermarking and C2PA

**Watermarking** embeds a mark invisible to the human eye inside AI-generated content, so its origin can be verified later. It's being applied to text, images, video, and audio.

- **Text**: Anthropic has officially announced that it watermarks text and files Claude generates.[^4]
- **Images, video, and audio**: Google DeepMind's **SynthID** embeds watermarks across images, video, audio, and text. It's designed to survive common edits like cropping, filters, and compression, and as of May 2026 it had been applied to more than 10 billion pieces of content.[^5]

Where watermarking embeds a mark inside the content, **C2PA** (Coalition for Content Provenance and Authenticity) is a standard that attaches a cryptographically signed history to the content itself. Tamper with it, and the signature breaks, immediately revealing the attempt. It records which device or AI model created the content and what edits followed, which is why C2PA compares it to "a nutrition label for content."[^6] Adobe, Google, Meta, Microsoft, and OpenAI are among the companies on the standard's steering committee. Consumer devices that sign content the moment it's captured, like the Samsung Galaxy S25 and Google Pixel 10, are starting to appear too. In practice, this signature shows up as a clickable "Content Credentials" pin on the content, and clicking it shows you the creation method and edit history directly.[^7]

## Not a Perfect Shield

These technologies don't solve the fake news problem at its root, though.

Watermarking has its own limits. Anthropic itself says that light editing of Claude's text probably won't remove the watermark, but a complete rewrite where every word is replaced will.[^4] In other words, rewriting a passage from scratch, or running it back through a different AI model, is enough to erase the mark of its origin.

C2PA's own side acknowledges its limits too. The Content Credentials site states plainly that "bad actors who seek to label synthetic content as authentic" will keep existing, and frames the standard's goal as giving "good actors a way to demonstrate the authenticity of their content."[^7] Make a fake with a tool that never joined the standard in the first place, and no watermark or signature gets attached at all.

C2PA's signed provenance data can also get lost. Screenshotting a file or re-uploading it to social media tends to strip that signature information out entirely, since most platforms re-encode uploads without preserving embedded metadata. Regulation is only just starting to move, too. The EU AI Act's Article 50 requires machine-readable labels on AI-generated content starting in August 2026,[^8] but that requirement isn't universal.

## Closing

In 1835, the public was deceived by a name it couldn't verify: "Sir John Herschel's telescope." Now the technology to make that kind of authority checkable is coming together fast. Watermarking and C2PA are real progress: they're building the infrastructure for good-faith creators and platforms to prove where their content came from.

But until that infrastructure covers every piece of content and every actor, the habit of questioning the source before you hit share, especially on news that looks unusually shocking or sensational, is still the first line of defense. However far verification technology advances, the warning the "bat-men on the Moon" left behind isn't going away.

### References

[^1]: ["Great Moon Hoax" - Wikipedia](https://en.wikipedia.org/wiki/Great_Moon_Hoax): Overview of the hoax and the full article series
[^2]: [Great-Moon-Hoax-1835-New-York-Sun-lithograph - Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Great-Moon-Hoax-1835-New-York-Sun-lithograph-298px.jpg): Source for the illustration above
[^3]: ["The Great Moon Hoax (1835)" - hoaxes.org](https://hoaxes.org/archive/permalink/the_great_moon_hoax): Archive account covering Edgar Allan Poe's recollection, the Yale scholars' visit, and the Baptist ministers' inquiry
[^4]: ["How Claude's text watermarking works" - Anthropic](https://www.anthropic.com/news/claude-text-watermark): Official announcement of watermarking for Claude-generated text and files
[^5]: ["Watermarking AI-generated text and video with SynthID" - Google DeepMind](https://deepmind.google/models/synthid/): How SynthID works, its coverage, and cumulative application count as of May 2026
[^6]: ["C2PA" official site](https://c2pa.org/): Overview of C2PA and the Content Credentials standard, steering committee members
[^7]: ["Content Credentials" official site](https://contentcredentials.org/): Official description of the standard's goals and limits
[^8]: ["Article 50: Transparency Obligations for Providers and Deployers of Certain AI Systems"](https://artificialintelligenceact.eu/article/50/): Official text of EU AI Act Article 50
