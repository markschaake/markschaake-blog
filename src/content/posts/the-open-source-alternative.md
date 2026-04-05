---
title: "The Open Source Alternative"
description: "Factory AI ships Missions. I'd already built the open source version - from a different direction, with a different answer to what quality means."
pubDate: 2026-04-05
draft: false
tags: ["ai", "engineering", "eforge"]
heroImage: ./the-open-source-alternative.webp
---

I didn't set out to build an alternative to anything. I was automating my own workflow - the manual orchestration of plan, build, review, evaluate that I'd been running by hand across Claude Code sessions for months. Each piece got automated, then the coordination between pieces, and at some point I had a multi-agent build system with blind review, dependency-aware parallel orchestration, and a daemon that runs overnight.

Then Factory AI shipped <a href="https://factory.ai/news/missions" target="_blank" rel="noopener noreferrer">Missions</a> - a long-horizon orchestration system that decomposes large projects into milestones, assigns work to parallel workers, and runs autonomously for hours to days. $200 a month, backed by $50M from Sequoia, NEA, and NVIDIA. The overlap with <a href="https://eforge.run" target="_blank" rel="noopener noreferrer">eforge's</a> <a href="/posts/expedition-excursion-errand/" target="_blank" rel="noopener noreferrer">expedition mode</a> was hard to miss - same problem space, same multi-agent decomposition, same "hand off and come back later" model.

The convergence validates the problem space. The divergence is where it gets interesting.

## Different bets about quality

Both systems solve "how do I build something large without being present?" But they make opposite bets about where quality breaks down.

Factory validates by asking _does it work?_ Their <a href="https://factory.ai/news/missions" target="_blank" rel="noopener noreferrer">Missions announcement</a> describes validation workers that "launch the application, navigate through flows, check that pages render correctly, and flag visual or functional issues." Quality means functional completeness - the output runs, the UI renders, the state transitions work. Their <a href="https://docs.factory.ai/cli/features/missions" target="_blank" rel="noopener noreferrer">documentation</a> lists "How do you maximize correctness?" as an open research question, which says something about where the architecture is focused and where it's still searching.

eforge validates by asking _is it correct?_ A separate agent reviews the code blind - zero context from the builder, no access to the builder's reasoning, no ability to rationalize implementation choices. Then an evaluator applies per-hunk verdicts, accepting changes that strictly improve the code and rejecting anything that alters intent. Anthropic's engineering team <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps" target="_blank" rel="noopener noreferrer">independently validated this pattern</a> - solo agents approve their own work, adversarial evaluation dramatically improves quality.

These aren't the same question. A codebase can pass every functional test while accumulating structural drift - wrong abstractions, subtle coupling, decisions that compound into maintenance debt but never surface in a UI flow. Factory catches what breaks. eforge catches what drifts.

My experience building with agents over the past couple of years is that the code _usually works_. Frontier models are good at making things function. What they're less reliable at is staying faithful to a plan across a large coordinated change - holding the architectural intent through thirty files without quietly reinterpreting, simplifying, or drifting from the spec. That's the failure mode blind review is engineered to catch. Not "does this code run" but "does this code do what was planned, the way it was planned."

For an engineer who spent real time on a careful plan - thinking through every module boundary, every data flow, every tradeoff - the question that matters is fidelity. Did the build execute the plan as specified, or did the agent decide it knew better? eforge's review pipeline is built around that question. The blind reviewer can't rationalize the builder's choices because it never saw them. The per-hunk evaluator rejects changes that alter intent even if they'd technically work. The goal is minimizing drift and slop - keeping the output coherent with the plan, not just functional.

## Different ideas about who's using it

Factory's framing is explicit: the user is a project manager. From their announcement - "the skillset for working with Missions looks less like traditional debugging and more like project management of agents, where you monitor a team of workers, unblocking them when they get stuck, redirecting them when priorities change." The human manages a fleet. The platform handles the engineering.

That's a coherent model, and it works for enterprise teams that need to multiply throughput across an organization. But it's not the only model.

eforge is built for a developer who wants to stay close to the work. <a href="/posts/the-flinch/" target="_blank" rel="noopener noreferrer">The planning is the engineering</a> - every architectural choice, every module boundary, every acceptance criterion thought through before anything gets built. The build phase <a href="/posts/the-handoff/" target="_blank" rel="noopener noreferrer">runs in the background</a>, but the person who planned it understands the codebase at the level of someone who wrote it by hand - because the planning demands that depth.

The difference isn't capability - it's proximity. Factory abstracts you above the engineering. eforge keeps you in it, automating the execution but not the judgment. The review architecture exists to protect the investment the engineer made in the plan - careful planning should produce faithful execution, not a reinterpretation filtered through an agent's preferences. A tool for someone who wants the leverage of autonomous builds without giving up control over what gets built.

## Plans belong in version control

Factory's plan lives in Mission Control - a dashboard where you iterate with an orchestrator, approve the plan, and monitor execution. eforge commits plans to git - `orchestration.yaml`, module plans, dependency graphs, all committed as the build runs and cleaned up when it's done. The full planning history is in version control, diffable and traceable, without cluttering the working tree.

This is a design choice, not a limitation. When a build goes wrong, I can diff the plan against what was built and see exactly where the divergence happened. When a queued build starts, the planner re-assesses against the current codebase - if earlier builds changed the architecture, later plans adapt before executing rather than building against stale assumptions.

## Open source, embeddable, free

eforge is <a href="https://github.com/eforge-build/eforge" target="_blank" rel="noopener noreferrer">Apache 2.0</a>. The tool I needed didn't exist, and the thing I built should be useful to others.

It installs as a Claude Code plugin, a <a href="https://pi.dev/" target="_blank" rel="noopener noreferrer">Pi</a> extension, or standalone via npm. Two backends - Claude Agent SDK and Pi, which connects to <a href="/posts/what-a-cheaper-model-actually-costs/" target="_blank" rel="noopener noreferrer">over 20 LLM providers</a>. The engine exposes an `AsyncGenerator<EforgeEvent>` - it's a library, not just a CLI. It can live inside CI pipelines, get called from other agents, embed in custom tooling. Factory is a platform you log into. eforge is a component you compose with.

The intent is a tool that feels free to use - not free as in "free tier before the paywall" but genuinely open, configurable, yours to run however you want. Agent-assisted setup through the plugin or extension means configuration takes seconds, not documentation-diving. The complexity is there if you want it - model selection down to individual agent roles, hooks, MCP servers - with sane defaults.

## Different tools for different people

Factory is an enterprise platform - $50M in funding, deep integrations with Linear and Sentry and PagerDuty, computer-use validation, skill accumulation across builds. It's built for organizations that need to multiply throughput across teams.

eforge is built for an individual developer who wants to drive. The tool amplifies judgment, it doesn't accumulate its own. The developer holds the patterns, understands the codebase, owns the plan. eforge executes faithfully and verifies rigorously - that's the scope, and it's deliberate.

I've been using eforge daily for three weeks, building real features across multiple projects - including eforge itself. It's young and rough around the edges. I built it with care, and I plan to keep building it.
