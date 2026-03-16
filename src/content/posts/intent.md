---
title: "Intent"
description: "The build phase is dissolving. What remains is the ability to specify what you want clearly enough that machines can take it from there."
pubDate: 2026-03-15
draft: true
tags: ["ai", "engineering", "methodology"]
---

I've been tracking the composition of my own engineering work for several months now - classifying every commit by what kind of work it represents. The numbers for a recent project: 38% feature code, 37% planning and methodology artifacts, 14% refactoring, the rest split across fixes, tests, ops, and rework. The planning artifacts - architecture documents, module decompositions, scope assessments, verification criteria - accounted for nearly as much effort as the feature code they produced, and zero lines were written by hand.

That ratio felt wrong the first time I saw it, but it doesn't feel wrong anymore. A year ago the phrase was _context engineering_. Before that, _prompt engineering_. Now it's _intent_ - the vocabulary shifts but the underlying motion is the same: the surface where the human contributes is moving up.

---

The shift happened in stages over the past year, each one subtle enough that I only recognized it looking back.

First the typing stopped mattering. Autocomplete and inline generation handled the mechanical act of producing code, and the bottleneck moved to knowing what to ask for. Then the prompting stopped mattering - not because prompts got easier, but because the tools got good enough that a well-structured plan replaced the need for careful prompt engineering on every interaction. The agents could read a plan and execute. The quality of the output tracked the quality of the plan, not the quality of any individual prompt.

Then the plans themselves started shifting. Early on I wrote detailed implementation plans - specific files to create, function signatures, data flow diagrams. The kind of plan that's one abstraction level above code. Over time the plans got higher-level, because the agents could handle the decomposition themselves if the intent was clear enough. A napkin-level description of what I wanted, combined with access to the existing codebase, was often sufficient for simple work. Complex work still needed architectural thinking - but the form of that thinking changed from implementation specification to intent specification.

The distinction matters. An implementation spec says "create a file called X with functions Y and Z that call service W." An intent spec says "the system needs to handle this concern, here's how it fits into the existing architecture, here are the constraints." One tells the machine what to type. The other tells it what to solve.

---

The workflows that make this concrete evolved in stages. First as Claude Code slash commands - small automations for planning and review. Then as a <a href="/posts/expedition-excursion-errand" target="_blank" rel="noopener noreferrer">full methodology</a> packaged into a plugin marketplace with dozens of skills covering everything from scope assessment to blind code review.

Each layer removed some friction but left the developer orchestrating the pieces - still doing non-intent work. Deciding which skills to invoke, in what order, managing parallel agents manually across git worktrees.

Last week I started building the <a href="/posts/the-layer-above" target="_blank" rel="noopener noreferrer">layer above</a> all of it - a tool that takes a plan at whatever fidelity I provide, assesses the complexity of the buildout against the existing codebase, and handles everything from there. Simple intent gets a simple execution path. Complex intent gets compiled into a dependency graph of sub-plans that run in parallel across isolated workspaces, each one independently reviewed by multiple parallel agents - with different focuses and no knowledge of how the code was written - evaluating only whether it's correct.

That's the part that changed how I work. I express the intent, hand it off, and move on to the next thing. Multiple builds run concurrently while I'm already planning the next feature or thinking through the next architectural question. The build phase - the part that used to be the job - runs in the background. I check the results when they're done, and the independent review cycle catches the things I'd catch in a code review if I were paying close attention.

I no longer think about the build phase. Not because I don't care about build quality - I care about it obsessively, which is why the independent review and evaluation cycles exist. But the concern is addressed structurally, not manually. The methodology handles it. My attention stays where it has the most leverage.

---

The barrier to entry isn't lower. It's _different_. The skills that matter are shifting from implementation fluency to architectural fluency - the ability to think clearly about systems at a level above the code, and to express that thinking in a form that machines can execute reliably. The tool I've been building works _because_ I understand the systems I'm asking it to build - how the components interact, where the failure modes live, what tradeoffs matter for this specific context. An intent spec written without that understanding produces exactly the kind of confidently wrong output that gives AI-generated code its reputation. The intent is only as good as the understanding behind it.

---

The planning artifacts in my commit history tell this story in data. When methodology accounts for 37% of the measured work on a project, the methodology _is_ the work. The feature code is the output, not the effort. And the effort - the thinking, the scoping, the architectural reasoning, the intent specification - is the part that doesn't automate, because it's the part that requires understanding the problem deeply enough to describe what solving it looks like.

I don't know yet whether the tool I've been building is a product or just my own workflow made portable. But the pattern underneath it feels durable - build quality as a function of intent quality, not engineering effort. The build is dissolving into infrastructure. What remains is the thinking.
