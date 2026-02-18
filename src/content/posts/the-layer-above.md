---
title: "The Layer Above"
description: "The Codex-vs-Claude-Code debate is comparing the wrong layer."
pubDate: 2026-02-18
draft: false
tags: ["ai", "claude-code", "methodology"]
heroImage: ./the-layer-above.webp
---

The Codex-vs-Claude-Code discourse has been hard to avoid lately. OpenAI launched GPT-5.3-Codex with a dedicated desktop app, and the takes landed fast - Codex is the autonomous co-worker, Claude Code is the interactive collaborator. The framing is tidy: if you can write clean specs, hand them to Codex and walk away. If your work is messier, more exploratory, more iterative, Claude Code meets you where you are. Pick the right tool for the job.

I installed Codex and was about to start testing it when a familiar feeling pulled me back - the sense that evaluating was detracting from the actual work, that I wasn't yet convinced this would be a good use of time right now. And the question I kept circling wasn't really about Codex at all - it was whether the comparison framework itself is the right lens for what matters.

---

The models underneath are converging. <a href="https://www.vals.ai/benchmarks/swebench" target="_blank" rel="noopener noreferrer">SWE-bench Verified</a> has Opus 4.5 at 80.9%, Opus 4.6 at 80.8%, and GPT-5.2 Codex at 80.0% - essentially a dead heat. The capability gap that might justify switching tools isn't in the numbers. Where the tools actually differ is in the harness - the layer above the model: the interface, the defaults, the philosophy of how much autonomy the tool assumes out of the box. Claude Code, Codex, Pi - different harnesses, different fittings, same converging capability pool underneath.

Some of the analysis being published draws broad conclusions from narrow evidence. A <a href="https://blog.nilenso.com/blog/2026/02/12/codex-cli-vs-claude-code-on-autonomy/" target="_blank" rel="noopener noreferrer">Nilenso blog post</a> characterized Codex as a "scripting-proficient intern" and Claude Code as a "senior developer who asks clarifying questions" - but this was based largely on reading system prompts, not extended use. In practice, Claude Code with permissions bypassed and a clear plan doesn't pause to ask anything. It executes. The characterization describes a default out-of-the-box posture, not how the tool actually behaves once configured for autonomous work.

Meanwhile, a <a href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" target="_blank" rel="noopener noreferrer">METR study</a> found that experienced developers using AI tools were 19% slower on average while believing they were 20% faster. If experienced developers can't reliably tell whether their tools are helping, the confident declarations about which tool is better for which task deserve more skepticism than they're getting.

---

The framing that Codex is the right tool for autonomous, spec-driven work treats Claude Code's interactive default as a limitation. It's not - it's a starting position.

I've been building on top of Claude Code for the better part of a year. The result is a <a href="/posts/expedition-excursion-errand">workflow framework</a> that ranges from fully hands-off parallel execution across git worktrees to conversational single-agent work - the kind of thing that accrues naturally when you stay with a tool long enough to understand where its edges are and how to extend them. The "hand it off and walk away" experience isn't unique to Codex. It's what depth produces on any capable foundation.

So when the comparison discourse says Codex is better for autonomous work and Claude Code is better for iterative work, what it's really comparing is one harness's out-of-the-box experience against another harness's _customized_ experience. That's not a comparison of harnesses - it's a comparison of how fitted each one is.

---

The practical economics make the depth question concrete. Claude Code Max is $200 a month. That's not a trial subscription - it's a commitment that shapes how I work, because it _needs_ to justify itself. Adding Codex at a similar price point means $400+ a month in AI tooling alone, plus the attention cost of maintaining fluency in both. For a solo developer, that's material.

I tried Claude Code's fast mode recently - same Opus 4.6 model, faster output, pay-as-you-use on top of Max. The shift was immediate - faster responses created a different flow state, tighter iteration, less time spent waiting and losing context. I pulled back after a short run because the cost added up quickly, but the experience clarified something: speed without quality loss changes how you think, not just how fast you ship. OpenAI's Codex-Spark promises dramatically faster generation, but it's a smaller model with a reduced context window and lower benchmarks - speed traded for capability. That's a different kind of friction than a clean speedup on the same intelligence.

And the financial picture keeps shifting underneath. Open-source models arrive competitive and often debut with free usage periods on OpenRouter. The floor of what capable tooling costs is dropping steadily. What requires a $200/month subscription today might be available for a fraction of that in six months - or open-source entirely. The financial investment creates a natural pull toward depth, not because switching is intellectually wrong, but because the budget and attention required to maintain expertise across multiple platforms is a real constraint - one the comparison articles almost never mention.

---

The pattern extends beyond any one developer's setup. <a href="https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/" target="_blank" rel="noopener noreferrer">Anthropic reports</a> that roughly 90% of Claude Code's codebase is now Claude-written - the tool building itself. The community around these tools is doing something similar: skills ecosystems, custom frameworks, plugins that extend the foundation in ways the original developers didn't anticipate.

The leverage I've found doesn't come from the tool itself - it comes from what's built on top of it. The tool is the foundation. The workflow layer - the custom skills, the calibrated sense of when to trust output and when to verify, the muscle memory of how to prompt effectively for a specific codebase - is where the actual leverage lives.

Switching means abandoning that layer - or so I assumed. In practice, the file-level infrastructure is becoming more portable than you'd expect. CLAUDE.md is readable by Pi, by Codex, by most of the emerging tools. Skills conventions are standardizing. The literal configs and agent-facing instructions could, in theory, travel with me. Whether they actually work as well in a different tool's runtime is something I haven't tested, and the difference between theoretical portability and practical portability might be the whole game.

But the deeper investment isn't in the files - it's in the intuition - the calibrated feel for how a specific model thinks, where it drifts, what prompting patterns produce reliable output for a particular codebase. That intuition has a natural expiration date, since new model versions shift the behavior underneath, but while it lasts it directly shapes the flow state that makes depth productive. It's the part of the layer above that doesn't port, and it's the part the portability arguments never mention.

---

I installed Codex and never spun it up. I'd spent a few hours with <a href="https://github.com/badlogic/pi-mono" target="_blank" rel="noopener noreferrer">Pi</a> not long before that - another harness, this one built for customizability, the kind that appeals to the Emacs-tinkerer part of my brain - but felt the same pull back toward the work already in progress. The tension arrived at the moment of installation, not after hours of evaluation. What kept stopping me wasn't loyalty to Claude Code or certainty that I'd chosen right. It was the recognition that constant sampling has its own cost, and that I hadn't yet been deliberate about when to look up from the work and when to stay in it.

The landscape will keep moving. New models, new tools, new pricing tiers arriving faster than anyone can evaluate them. But the tools are converging on capability underneath, which means the specific foundation matters less over time. What doesn't converge is what gets built on top - the workflow layer, the accumulated judgment, the infrastructure that compounds with use. The comparison discourse keeps debating the foundation, but the leverage was always in the layer above.
