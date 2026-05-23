---
title: "The Landing Phase"
description: "As eforge moves toward public use, the hard part has shifted from generating code to landing work safely inside real development workflows."
pubDate: 2026-05-23
draft: false
llms: ["gpt-5.5", "opus-4.7"]
tags: ["ai", "eforge", "engineering", "agentic-workflows"]
heroImage: ./the-landing-phase.webp
---

<a href="https://www.eforge.build/" target="_blank" rel="noopener noreferrer">eforge</a> is still young - only a couple of months old - and it has grown inside the shape of my own work. I write a plan, hand it to the system, let it build in a worktree, review the result, and merge it back. The workflow is direct because the environment is direct. I am the planner, reviewer, maintainer, release manager, and person who would suffer if the tool made a mess.

That is a reasonable way for custom software to begin. A system can be powerful while still being tuned to one person's habits. Public readiness asks a different question: can the same system support developers at different stages, with different branch policies, review expectations, and team constraints, without making the simple path feel heavy?

I've been spending the last stretch turning eforge from custom software for my own agentic workflow into a polished, flexible system someone else could reasonably adopt - profiles for different agent runtimes, playbooks for recurring workflows, a TypeScript extension SDK for project-specific behavior, better daemon support, better tooling around planning and recovery. The feature list has grown, but the deeper work has been removing assumptions I didn't notice because they matched how I already worked.

Until recently, I was comfortable letting eforge land successful builds straight back onto main for my own projects. That's the solo-developer path of least resistance. If the build passes, the review looks good, and I'm the only person affected, adding a pull request can feel like ceremony. Direct-to-main isn't reckless by itself. In a small enough context, with strong validation and one accountable operator, it can be the cleanest workflow.

But eforge is approaching the point where I need to test it against the workflows other people will actually expect. That meant moving my own eforge development to a PR-oriented flow instead of letting the tool assume that successful work should be merged locally.

A coding agent can finish its build and still not be done. The tests can pass, the diff can be good, the plan can be satisfied, and the work can still be sitting in the wrong shape for the development process around it. It may need to become a pull request. It may need to stay as a branch. It may need to land directly because the project is intentionally configured that way. It may need to sit on top of another piece of work that hasn't merged yet.

I'd been treating that as an implementation detail at the end of the build. It isn't. It's its own phase.

I'm calling it _landing_.

Landing is what happens after the agent has produced validated code but before the work has safely entered the project's normal flow. For a solo project, landing might mean merging back to the base branch. For a protected team project, it might mean opening or updating a PR. For an experimental branch, it might mean committing the result and leaving it alone. The important part is that eforge shouldn't pretend these are the same workflow with different flags. They carry different assumptions about review, ownership, branch safety, and what should happen next.

This is where public readiness gets more demanding than feature completeness. A tool can have impressive demos while quietly assuming one branch model, one review model, one developer shape. Those assumptions are fine when they're explicit. They become dangerous when they're hidden.

The first pass at landing is configuration: let the project decide what success means. Some projects should merge successful work back to the base branch. Some should open or update a pull request. Some should leave the branch alone. A solo developer shouldn't be forced through team ceremony just because the tool wants to look professional. A team shouldn't be pushed toward local merges just because that matched my initial setup.

Pull requests aren't only endpoints. They're often part of a sequence.

The way I want to use eforge isn't one isolated task at a time. I want to stay in the planning flow. I want to describe the first piece of work, hand it off, then keep thinking. Sometimes the next plan depends on the first one. Sometimes a refactor has to happen before the feature. Sometimes the API shape needs to land before the UI can be built cleanly. This is normal engineering work - one change creates the ground for the next.

With direct-to-main, the dependency is simple. Build A lands, then Build B starts from the new main. There's still risk, but the branch topology is flat.

With PRs, the shape changes. Build A may be complete but not merged. If I start Build B from main, I've asked the next agent to work without the foundation it depends on. If I manually branch B from A, I'm back to managing the Git graph myself. If several builds are moving at once, conflict risk grows in the exact place eforge is supposed to reduce background noise.

The Git graph needs to match the thinking graph.

That sentence has been useful to me because it turns PR stacking from an advanced Git preference into a workflow requirement. If eforge lets me plan layered work but can't represent those layers in branches and PRs, the system leaks. It hands the hardest coordination step back to the human at the moment the human is trying to stay in flow.

So eforge needs a PR stacking layer.

The first provider I'm building toward is <a href="https://abhinav.github.io/git-spice/" target="_blank" rel="noopener noreferrer">git-spice</a>. I like the model because it treats stacks as first-class rather than as an awkward convention taped onto branches. But the important design choice isn't "eforge supports git-spice." It's that eforge should model the landing capability separately from any one implementation. Create the dependent change. Restack when needed. Submit or update the chain. Understand what has landed and what still depends on it. Let a provider handle the mechanics.

That separation matters because eforge is taking on real workflow responsibility. Profiles, playbooks, and extensions already cover runtime selection, recurring patterns, and project-specific behavior. Landing decides what happens to the finished work. PR stacking decides whether layered work can move together without forcing the developer out of planning mode.

The surface area is getting larger because the problem is larger than "run an agent on this task."

That creates a product tension I feel every day. The more real workflows eforge supports, the easier it is for the experience to become a cockpit. More modes, more configuration, more branching logic, more places for the user to wonder what the tool is about to do. That's the opposite of what I want.

The goal isn't to expose all the machinery. The goal is for eforge to absorb it.

A solo developer should be able to initialize a project, choose a low-friction landing policy, and keep moving. A team should be able to require PRs without fighting the tool. A project with layered work should be able to stack changes without turning every plan into a branch-management session. The experience should feel simple not because the underlying system is simple, but because the complexity has been put in the right place.

That's the part I underestimated when I started building eforge. I thought the main challenge was orchestrating agents well - planning, implementation, validation, review. That's still hard. But the more I dogfood it, the more the surrounding workflow becomes the real product. Agents can generate code. The question is whether the system around them can make that code safe, reviewable, recoverable, and easy to move through the same paths human work already uses.

Every time eforge reaches a new level of usefulness, it reveals the private assumptions underneath the previous level. A new feature opens a new workflow. The new workflow breaks something that used to be invisible. Then comes the churn - architecture changes, rough edges, temporary breakage, and the slower hardening period where I use the tool until the new shape feels dependable.

That cycle has taken longer than I expected. It's also been good for the project.

There's a humbling quality to building developer tools this way. Branch policy, review flow, agent runtime selection, extension trust, PR topology, recovery behavior - none of these are exotic topics, but putting them together into one coherent experience has forced me to see how much engineering practice lives between the obvious steps.

Writing the plan, building the code, running the tests, reviewing the diff - those are the visible parts. The rest is where the workflow either breathes or drags.

The hard part after the agent finishes is becoming part of the system instead of an afterthought.