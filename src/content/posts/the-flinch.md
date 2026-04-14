---
title: "The Flinch"
description: "Everyone flinches at the moment they're supposed to let go of the code. The skill that matters now is planning well enough to trust the handoff."
pubDate: 2026-04-04
draft: false
tags: ["ai", "engineering", "eforge"]
heroImage: ./the-flinch.webp
---

I've had a few conversations recently with people building in the agentic development space, and in each one, at some point, there's a flinch. One person gravitates back toward the IDE. Another hears about a workflow where no human reviews pull requests and says his team wouldn't go for that. The reasons vary but the discomfort is the same, and it's upstream of the tools entirely.

## The actual bottleneck

The conventional workflow is: quick plan, get into the code, iterate fast. This works when the human is writing the code - course-correction happens in real time because the person executing is also the person thinking. Planning can be loose because execution is tight.

Agentic development inverts this. The agent handles execution. The human handles planning. And the quality of that planning becomes the single biggest constraint on what comes out the other side.

With <a href="https://eforge.build" target="_blank" rel="noopener noreferrer">eforge</a>, I spend real time on a plan before any code gets written - not because the tool is slow, but because the plan has to be _that good_. Every architectural choice, every module boundary, every acceptance criterion needs to be thought through to the point where I'm confident handing it off to parallel agents who will build it without me watching. I read every line Claude produces during planning. I push back, ask for alternatives, challenge assumptions.

It's closer to architecture review than coding - except the architecture review _is_ the work. Going that deep into the planning keeps me close to the codebase in a way that isn't so different from writing the code myself. I know the module boundaries, the data flows, the tradeoffs - not because I typed the implementation, but because I thought through every decision that shaped it.

Even thirty minutes of careful, concentrated planning before a line of code exists feels wasteful when the instinct is to start building immediately. But with agents that can execute an entire module in parallel - and do it well if the spec is clear - the leverage is overwhelmingly in the planning.

## Where the advantage actually is

The advantage I have here isn't technical skill - it's practice. Close to a year of agentic engineering, starting with skills and subagent frameworks I built myself and eventually building eforge out of that work. The whole time, building the instinct for what a plan needs to contain before it's ready to hand off. Early on I made the same mistakes: plans that were too vague, specs that left too much to interpretation, assumptions I didn't realize I was making. The agents would build something reasonable but wrong in ways that took longer to fix than if the plan had been right.

The reps changed that. Planning now feels like the primary work - the thing that matters most, not the step before the thing that matters. But getting there took discipline that runs against every instinct built up from decades of coding.

A friend I was talking with about this put it well: the gap isn't in the models or the tools, it's in the trust-building - the _planner's_ ability to produce something complete enough that autonomous execution is safe. Handing off execution and trusting the output will be right - that only happens after enough confidence in the handoff builds up, and it takes time. For me it was Opus 4.5 and 4.6 that got me there - the model was consistently good enough that I stopped needing to check every line of code and started trusting the plan-to-execution loop.

## How I actually work now

The build phase <a href="/posts/the-handoff" target="_blank" rel="noopener noreferrer">already runs in the background</a> - while eforge builds one thing, I'm planning the next, sometimes in Claude's plan mode, sometimes in <a href="https://pi.dev/" target="_blank" rel="noopener noreferrer">Pi</a> using an <a href="https://github.com/eforge-build/eforge/tree/main/packages/pi-eforge" target="_blank" rel="noopener noreferrer">eforge planning extension</a> I built. The bar I hold each plan to isn't "does this sound right" but "could someone who's never seen this codebase execute this and produce something I'd ship." If five different agents could build it independently and produce roughly the same result, the plan is ready.

Context-switching between plans is its own skill to develop, but the alternative is sitting idle while agents build, and that's wasted leverage.

## The transition is the skill

Most AI developer tools are still built around human quality gates - a person reviewing code mid-development, a person approving pull requests. Those checkpoints made sense when the human was the only one who could catch problems. In my own work, both the writing and reviewing of code have moved to agents - I stay in the plan. Whether that's where everyone ends up, I don't know, but for this workflow the checkpoints feel like artifacts of an earlier constraint.

The code is a downstream artifact. And the skill that determines whether that works - given models smart enough to execute well - is the ability to think clearly enough about what needs to be built that an autonomous system can build it right.
