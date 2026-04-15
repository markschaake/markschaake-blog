---
title: "The Handoff"
description: "Abstracting away the build phase: learning to plan full time."
pubDate: 2026-03-20
draft: false
tags: ["ai", "engineering", "methodology", "thinking-layer"]
heroImage: ./the-handoff.webp
---

AI has written 100% of my code for over six months now - that part is settled. What's been shifting is everything else - the orchestration, the oversight, the gap between expressing what I want and trusting that it gets built correctly.

I've been classifying every commit across six projects by what kind of work it represents - feature, fix, refactor, rework, test, docs, ops. The weekly breakdown tells a story the aggregates can't.

The docs category in the chart above is planning and methodology artifacts - architecture documents, module decompositions, scope assessments, verification criteria. It starts as a sliver and by the final week accounts for 42% of measured effort - not because the planning expanded, but because everything around it automated away. None of it was written by hand.

---

The shift happened in stages over the past few months, each one noticeable as it arrived.

Once agents could read a plan and execute, the quality of the output tracked the quality of the plan, not the quality of any individual prompt. I started building skills and plugins that automated more of the coordination - planning workflows, review cycles, scope assessments. Each layer removed friction - the builds themselves ran hands-free once the plans were compiled and launched - but I was still the one invoking the skills to compile plans, kicking off the builds, managing worktrees, merging branches. The coordination was partially automated but still required manual orchestration, and there was no clean way to queue work - a build might run thirty minutes or more, and while I could start planning the next thing, I couldn't hand that plan off until the previous build finished. I was almost at the point of full handoff, but not quite.

The plans themselves didn't get simpler - they're still detailed, still low-level enough that I can verify Claude has thought through the full architectural impact before anything gets built. I need to see enough specifics to know it isn't assuming too much. What changed is the form - less implementation specification, more intent specification - one tells the machine what to type, the other tells it what to solve. I expect the fidelity I need will drop as models improve, but right now getting the details right in the plan is where the engineering happens.

---

Last week I started building <a href="https://eforge.run" target="_blank" rel="noopener noreferrer">the layer above</a> all of it - a tool that takes a plan at whatever fidelity I provide, assesses the complexity of the buildout against the existing codebase, and handles everything from there. Simple intent gets a simple execution path, complex intent gets compiled into a dependency graph of sub-plans that run in parallel across isolated workspaces, each one independently reviewed by parallel agents that have no knowledge of how the code was written - evaluating only whether it's correct.

That's the part that changed how I work. I express the intent, hand it off, and move on to the next thing. Multiple builds run concurrently while I'm already planning the next feature or thinking through the next architectural question. The build phase - the part that used to be the job - runs in the background. I check the results when they're done, and the independent review cycle catches the things I'd catch in a code review if I were paying close attention.

I no longer think about the build phase, and the early evidence suggests the output is better for it. The tool doesn't get tired and skip a review step. It doesn't decide a verification pass isn't worth the time at the end of a long session. After a week of dogfooding, the builds coming out of the automated pipeline are already more consistent than what my manually-orchestrated work produced the week before - not because the methodology changed, but because it actually gets followed every time.

---

Handing off the build doesn't mean handing off the thinking - it means the thinking is all that's left. The skills that matter now are architectural, not mechanical - the ability to think clearly about systems above the code and express that thinking in a form machines can execute reliably. The tool works _because_ I understand the systems I'm asking it to build - how the components interact, where the failure modes live, what tradeoffs matter for this specific context. An intent spec written without that understanding produces exactly the kind of confidently wrong output that gives AI-generated code its reputation.

I don't know yet whether the tool I've been building is a product or just my own workflow made portable, but the pattern underneath it feels durable - build quality as a function of intent quality, not engineering effort.
