---
title: "Finding the Edge of AI Trust"
description: "What happens when you over-trust your AI agents and misdirect a client's leadership team."
pubDate: 2026-01-30
draft: true
tags: ["ai", "claude-code", "lessons"]
---

I'm not interested in 10x productivity from AI. I'm chasing something bigger.

The safe way to use AI agents - reviewing every output, second-guessing every decision - gets you maybe 2-3x. Useful, but not transformative. The real leverage lives at the edge: trusting the AI enough to move fast, catching mistakes through tight feedback loops rather than constant oversight.

The problem with edges is that you sometimes fall over them. This week I did.

The fall cost me 1.5 hours of throwaway development, a credit to my client, and - harder to quantify - some trust. All because of a GET vs POST.

## The Setup

I was building an AI classification feature for a client that depended on a third-party API. This API operates in legally gray territory; competitors have been shut down. It had recently changed versions, and the fields we needed were coming back empty.

Stakes were high. Without this data, the feature couldn't work. This was exactly the kind of ambiguous debugging task where AI agents shine - or where they can lead you confidently off a cliff.

## The Confident Diagnosis

I asked Claude to investigate. It dove in, examined the responses, and delivered a verdict with characteristic confidence: "The provider no longer has access to this data."

That made sense. Given the legal pressures in this space, it was plausible they'd been forced to remove certain data points.

I asked Claude to verify. It ran cURL tests, examined response structures, and produced a detailed markdown report. Responses came back 200 OK. Data returned. But the target fields? Empty.

The report looked thorough. Professional. Convincing. This is where the edge gets dangerous - not when AI is obviously wrong, but when it's confidently, plausibly wrong.

## The Escalation

I shared Claude's report with my client as evidence of the problem. They forwarded it to the third-party's support team. Major stakeholders got pulled into discussions about workarounds and alternatives.

This was the moment I crossed the edge. The edge isn't crossed when AI makes a mistake - it's crossed when you propagate that mistake outward.

Meanwhile, I'd already moved on. Built an alternative solution in about 90 minutes. AI-first development is fast like that. By the time anyone could catch the error, I'd traveled far past it.

## The Reveal

Twenty-four hours later, support responded: it's a GET vs POST issue.

The GET endpoint I'd been hitting - that Claude had been testing - isn't documented or officially supported. Use POST with a JSON body and everything works. All the data is there.

The kicker: I couldn't have verified this earlier. The API documentation was behind authentication I didn't have access to. We were debugging blind - and the edge is hardest to see when you have no ground truth.

## The Fallout

The technical problem evaporated. The real damage didn't.

Stakeholders had wasted time on a non-problem. I'd built 1.5 hours of code that went straight to the trash. Worse, I'd confidently led my client down the wrong path, backed by a professional-looking report that turned out to be confidently wrong.

The cost of falling over the edge scales with how fast you were moving. AI-first development is fast. So when you fall, you fall far.

## Making It Right

I credited the client three hours - more than the total dev time wasted. It wasn't really about the money. It was about acknowledging that I'd caused the disruption, even if the root cause was "the AI told me so."

"The AI was wrong" isn't an excuse. I'm the one who trusted it. I'm the one who escalated it. The buck stops with the human.

## Where the Edge Is

This wasn't an AI catastrophe. It was a mundane mistake amplified by speed and confidence. But it taught me where the edge actually is:

**The edge is where AI is confidently, plausibly wrong.** Not obviously wrong - that's easy to catch. Not randomly wrong - you wouldn't trust it in the first place. The danger zone is when the AI's answer is confident, coherent, and fits your mental model. That's when you're most likely to propagate it without verifying. Your job is to recognize when you're in that zone.

**Speed amplifies distance past the edge.** The formula is brutal: Confidence × Speed = Distance traveled when wrong. I had an alternative solution built before support even replied. That's the value proposition of AI-assisted development - and the risk. You need braking mechanisms proportional to your speed.

**The edge moves.** This might be the hardest part. AI capabilities shift constantly - model updates, service degradation, the inherent stochasticity of responses. And the movement isn't always forward. [Independent benchmarks](https://marginlab.ai/trackers/claude-code/) have detected statistically significant performance regressions in Claude Code over 30-day windows. A workflow that kept you safely on the right side last month might cross the edge today. You can't calibrate once and forget. Staying close to the edge requires ongoing navigation.

## The Takeaway

I don't have clean rules for staying close to the edge. The edge moves. AI capabilities shift. What I do have are questions I'm still working through:

**When to bet vs. wait.** I built 90 minutes of throwaway code - that's a reasonable bet with bounded downside. But I also escalated an unverified diagnosis to stakeholders. That's where the real cost came from. The code was cheap. The misdirection wasn't.

**How to communicate the tradeoff.** Maybe the right move is setting expectations upfront: "We can wait 24 hours for certainty, or we can bet on the plausible answer and keep moving - knowing that rework is part of the deal." That's a conversation to have before you're mid-crisis.

**What signals to watch for.** Confident AI + plausible explanation + no ground truth = danger zone. Not because you should stop, but because you should know you're placing a bet.

I paid for this lesson with 1.5 hours of code, a credit to my client, and some trust. Probably cheap tuition. The edge is where the leverage lives - and where the falls happen.
