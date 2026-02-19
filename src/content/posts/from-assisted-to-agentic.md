---
title: "From Assisted to Agentic"
description: "AI tool adoption is nearly universal among engineering teams, but the workflows underneath haven't moved."
pubDate: 2026-02-18
draft: false
tags: ["ai", "engineering", "methodology"]
---

I did a fractional CTO engagement last year where I spent weeks building with agentic engineering workflows - specs before prompting, validation as real-time feedback, AI as a system component rather than a typing assistant. When it came time to hand the work off, the gap between how I'd been building and how the team was working was enormous. Not a gap in talent or effort - a gap in methodology. I spent time teaching, trying to transfer not just the tools but the framework around them. Whether it stuck, I don't know.

In conversations with engineering leaders at other companies since, I hear the same starting point. Some say their teams have adopted AI tools, but when I ask how it's changed the way they work, the answer gets vague. Others are openly skeptical that AI has much to offer their engineering process at all - unaware, it seems to me, of how much the landscape has shifted underneath them.

---

The data confirms what I saw in that handoff is the norm. Deloitte's <a href="https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html" target="_blank" rel="noopener noreferrer">2026 State of AI report</a> surveyed over 3,000 leaders and found that 37% of organizations are using AI at a surface level with little or no change to existing processes, and only 30% are actually redesigning workflows around the tools. Stack Overflow's <a href="https://survey.stackoverflow.co/2025/ai/" target="_blank" rel="noopener noreferrer">2025 developer survey</a> found 84% of developers using or planning to use AI tools, but 66% cite "almost right" code as their biggest frustration - output close enough to look useful but wrong enough to require debugging.

And the abandonment numbers tell the same story. An <a href="https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590/" target="_blank" rel="noopener noreferrer">S&P Global survey</a> found 42% of companies pulled back from most AI initiatives in 2025, up from 17% the year before - not because the tools got worse, but because the organizations never adapted around them. The tools are installed but the workflows haven't moved.

---

The clearest picture of what the gap looks like in practice comes from <a href="https://www.tweag.io/blog/2025-10-23-agentic-coding-intro/" target="_blank" rel="noopener noreferrer">Tweag</a>, which ran a controlled experiment - two engineering squads building the same product, one using traditional methods, the other using structured agentic workflows. The agentic team had 30% fewer engineers and delivered in half the time, with consistent code quality verified by SonarQube and human reviewers.

The important word there is _structured_ - the agentic team didn't just have better autocomplete, they worked differently. Specs before prompting, validation tools as feedback loops, a deliberate workflow architecture that treated the AI as a system component rather than a typing assistant. That's what I was trying to transfer in the handoff - not a tool recommendation but a way of working.

<a href="https://every.to/source-code/inside-the-ai-workflows-of-every-s-six-engineers" target="_blank" rel="noopener noreferrer">Every.to</a> documents something similar at a smaller scale - six engineers running four AI products, multiple AI instances in parallel for different task streams. The gap between "we have Copilot" and "we have structured agentic workflows" is mostly a gap of deliberate design, not capability.

---

What makes this harder to navigate is that the productivity gains are genuinely difficult to measure - and teams consistently misjudge them. When <a href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" target="_blank" rel="noopener noreferrer">METR studied</a> experienced developers working on real tasks from their own codebases, the developers believed they were faster with AI tools. They were actually slower. That perception gap - feeling productive while measurably losing ground - ran consistently across the study and suggests that self-reported gains from AI tooling deserve more skepticism than they're getting.

And the organizational dynamics compound the problem. <a href="https://jellyfish.co/blog/2025-ai-metrics-in-review/" target="_blank" rel="noopener noreferrer">Jellyfish analyzed over two million pull requests</a> and found that full AI adoption increased PRs merged per engineer by 113%, but review time increased by 91% - more code flowing through a review pipeline that wasn't designed for the volume, with <a href="https://www.faros.ai/blog/ai-software-engineering" target="_blank" rel="noopener noreferrer">no correlation</a> between individual productivity gains and what organizations actually shipped.

Small teams have a structural advantage here - fewer handoffs, shorter feedback loops, less process between the developer and the deployment. At five people, the person writing with AI assistance often reviews their own output. At twenty or fifty, the review queue backs up and individual gains disappear into organizational friction.

---

But the productivity framing might be the wrong lens entirely. Since I started working with Claude Code in 2025, the shift I've felt most isn't speed - it's scope. Early on I built an AI microservice that replaced an AWS Textract dependency in my SaaS - better extraction quality at lower cost. Without agentic workflows, that project would have meant weeks of dedicated focus - reading documentation, researching APIs, the kind of concentrated effort that demands its own block of calendar. Instead I built it in parallel with higher-priority work, almost as a side channel. The leverage isn't just that each task gets faster - it's that tasks which previously required dedicated focus can now run alongside other work, which means the total surface area of what one person can take on expands in ways that a speed metric doesn't capture.

<a href="https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic" target="_blank" rel="noopener noreferrer">Anthropic's internal engineering study</a> found the same pattern at scale - they surveyed 132 engineers and discovered that 27% of Claude-assisted work consisted of tasks that _wouldn't have been done otherwise_. Backend engineers building UIs. Researchers creating data visualizations. Not the same things faster, but things that wouldn't have been attempted at all. A five-person team operating with the breadth of a fifteen-person team isn't faster - it's structurally different.

---

The teams that haven't made this transition aren't behind on tooling - the tools are a commodity, everyone has access to roughly the same models and capabilities. What separates the Tweag experiment from the 42% that abandoned their initiatives is whether the team redesigned how they work or just added a new tool to the existing process.
