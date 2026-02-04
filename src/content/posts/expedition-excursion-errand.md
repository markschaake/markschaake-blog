---
title: "Expedition, Excursion, Errand"
description: "A methodology for solo developers using AI agents - when to plan deeply, when to parallelize, when to iterate."
pubDate: 2026-02-03
draft: false
tags: ["ai", "consulting", "methodology", "claude-code"]
---

Clients want senior-level judgment and junior-level throughput. The traditional answer is to hire people, take on overhead, dilute margins. The agentic answer is different - multiply execution capacity while retaining judgment authority.

This is the solo developer's paradox, and I've been trying to solve it for months. Not through abstraction or theory, but through building actual systems and watching where they break.

---

The methodology I've landed on names three modes. I think of them as positions on a spectrum - not phases that happen in order, but stances that shift based on what the work requires.

_Expedition mode_ is for greenfield projects, major rewrites, new feature areas. Planning is deep, upfront, collaborative. Execution is fully autonomous, highly parallel - multiple AI agents working across multiple git worktrees simultaneously. The human is the expedition leader, planning the route while the team deploys across the terrain. Human involvement is heavy during planning, hands-off during execution.

_Excursion mode_ is for significant features, refactors, integrations. Planning is moderate, focused on the specific change. Execution is semi-autonomous - maybe a few parallel worktrees, maybe sequential. Base camp is established, and the human sends agents out to explore and develop specific areas. Human involvement means approving the plan, monitoring execution, intervening if something gets stuck.

_Errand mode_ is for bug fixes, small enhancements, polish work. Planning is light or inline - just part of the implementation conversation. Execution is interactive, single agent. The human and agent handle a quick trip to address something nearby - no elaborate planning needed. Human involvement is conversational, iterative, responsive.

---

The modes aren't discrete phases. An Expedition effort decomposes into Excursion-sized chunks. Excursion work spawns Errand-level subtasks. The shift happens fluidly based on scope.

What matters is recognizing which mode fits the current work. Expedition mode with a bug fix wastes planning overhead. Errand mode with a major rewrite leads to thrashing without direction.

---

The methodology identifies what humans _must_ do versus what agents _can_ do. This is the leverage - not replacing human work entirely, but reducing it to what's irreducible.

Judgment calls are always human. Architectural decisions, trade-off evaluation, scope definition - these require understanding context that agents don't have. So does UX and aesthetic review. An agent can verify that a button is clickable; it can't tell whether clicking it _feels_ right. Plan approval is human. Client communication is human.

Code implementation is delegable. Test execution is delegable. Verification of functional requirements, documentation generation, dependency updates, formatting, linting - all delegable. These aren't less important; they're just amenable to automation.

Some work is genuinely collaborative. Plan creation happens when humans guide and agents draft. Codebase exploration happens when agents search and humans direct. Test plan design happens when humans define scenarios and agents structure them. Debugging happens when agents investigate and humans decide.

---

The planning artifact matters more than I expected. Plans serve both human reviewers and agent executors - they need to be readable by people approving the approach _and_ parseable by agents carrying it out.

Dual format works. Human-readable prose describing what the plan accomplishes, implementation steps with enough detail for autonomous execution, acceptance criteria, verification commands. Machine-parseable frontmatter with IDs, dependencies, estimated files, test suites to run.

For Expedition mode, large efforts break into multiple plans. Each plan is independently executable. Dependencies are explicit - plan B waits for plan A. Plans without dependencies run in parallel. This is where the throughput multiplication comes from.

---

Quality assurance should be automated wherever possible, agent-executable rather than requiring the human to run tests manually, and defined during planning rather than as an afterthought.

Agents verify functional correctness - tests pass. They verify type safety - no type errors. They verify code quality - linting, formatting. They verify branching logic - all paths tested. They verify error states - failures handled gracefully.

Humans verify UX and aesthetics - does it feel right? They verify business logic alignment - does it solve the actual problem? They verify architectural judgment - is this the right approach?

Test plans get created collaboratively during planning, structured for agent execution. The human defines the scenarios; the agent structures them into something runnable.

---

The minimal setup is an agentic coding tool, git with worktree support, and automated test infrastructure. That's enough for Excursion and Errand modes.

Expedition mode needs more - multi-plan decomposition tooling, an orchestration layer for worktree and agent management, maybe a progress dashboard. Browser testing integration if the work involves UX verification.

I've been building these tools incrementally, and they're not done. The methodology is ahead of the implementation.

---

The tooling landscape is still emerging. For implementation, I use <a href="https://claude.ai/claude-code" target="_blank">Claude Code</a> daily - it handles Errand and Excursion mode work well. I've experimented with <a href="https://www.npmjs.com/package/@mariozechner/pi-coding-agent" target="_blank">Pi</a>, and there are others - Cursor, Codex, the list grows monthly.

Orchestration is less mature. <a href="https://github.com/steveyegge/gastown" target="_blank">GasTown</a> is interesting - a framework for coordinating multiple agents. I've been building a custom Claude Code plugin that handles planning facilitation and orchestration, spawning multiple Claude Code instances across git worktrees. It works, mostly. The missing piece is monitoring - a decent UI for watching what the agents are doing, which is next on the roadmap.

---

Open questions remain.

How to handle failures mid-execution in parallel mode? An agent hits a wall - does the orchestration stop everything, notify the human, try to recover?

What's the right plan granularity for parallelization? Too coarse and the throughput gains disappear. Too fine and the coordination overhead dominates.

How to communicate progress to clients during autonomous execution? The work is happening, but the developer isn't actively doing it. How does that translate to status updates and expectations?

How to price this work? I've been tracking wall hours - my time - versus machine hours - agent time - via Claude Code hooks that feed into a custom billing system. The goal is a leverage ratio above 1.5, meaning the agents work more hours than I do. Currently I bill by wall hour or fixed per project, but I'm thinking about how machine time fits into the equation. The time I spend is mostly planning and verification. The work that happens is mostly agent-hours. What's the fair exchange?

---

I don't have answers to these yet. The methodology is a working hypothesis - a way of naming what I've been doing so I can examine it, refine it, share it. Expedition, Excursion, Errand. Plan deeply when the scope demands it, parallelize when the structure allows it, iterate when the work is small.

The leverage is real. The details are still evolving.
