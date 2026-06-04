---
title: "The Work That Doesn't Demo"
description: "The visible part of agentic coding is the build. The trustworthy part is what happens when the build gets messy."
pubDate: 2026-06-04
draft: true
llms: ["gpt-5.5"]
tags: ["ai", "engineering", "eforge", "agentic-workflows", "thinking-layer"]
heroImage: ./the-work-that-doesnt-demo.webp
---

I've been using <a href="https://www.eforge.build" target="_blank" rel="noopener noreferrer">eforge</a> to build eforge.

That sounds recursive in the cute way developer tools often sound recursive, but the loop has become practical. I plan a change, hand it to eforge, and let the system build against its own codebase. When it works, the build lands and I move on. When it falls short, I try not to route around the failure manually and forget it happened. I turn it back into the system.

The past week was mostly that kind of work - about 360 commits, very little of it flashy. Recovery sidecars. Acceptance-criteria evidence. Validation repair. Blocked dependents. Stacked-PR landing edge cases. Timer-flakiness cleanup. The visible product did not change much, but the system got harder to knock over.

This is the work that doesn't demo.

A demo wants the clean path: a well-scoped task, a quiet repo, one agent run, one branch, no upstream movement, no ambiguous validation, no weird stack topology. Prompt goes in, code comes out, the dashboard moves, the diff looks reasonable, the tests pass.

That path matters, but it is also the easiest path.

The thing I need from eforge is different. I need it to protect the layer of work I am trying to stay in - product direction, architecture, scope, tradeoffs, and whether the next change moves the system coherently. I do not want to stop that work because a stacked pull request needs to be rebased, or because an artifact branch is stale, or because a failed run left enough state for recovery but not enough structure for the next move to be obvious.

The goal is not for eforge to make every decision. The goal is for it to stop asking me to make decisions that are not really decisions.

A merge conflict is sometimes a real engineering problem. Two changes touch the same logic from different directions, and resolving the conflict requires understanding intent. That belongs with the engineer, or at least with an agent operating under a careful plan.

But a lot of merge friction is not that. A branch is a few commits behind `origin/main`. A stack parent moved. A restack produces the same kind of conflict the system already knows how to navigate in another workflow. A PR cannot auto-merge because the branch was pushed before freshness was proven. None of that is product thinking. It is the mechanical underside of parallel work leaking back into the part of the day where I am supposed to be thinking about the product.

Dogfooding makes those leaks hard to ignore.

One build failed because a <a href="https://abhinav.github.io/git-spice/" target="_blank" rel="noopener noreferrer">git-spice</a> restack hit a merge conflict. eforge already had merge-conflict handling in non-stacked workflows, so the failure was not really "merge conflicts are impossible." It was "this adjacent path does not use the capability the system already has." The fix is not glamorous - extend merge handling into the stacked path so the build only fails when the conflict is genuinely too tangled for the LLM to navigate safely.

Another case showed up during landing. A branch is ready to become a pull request, but the remote base has moved. The first version opens the PR anyway and lets GitHub report that the branch is behind. A better version notices and asks the engineer to deal with it. The version I want fetches, rebases, handles conflicts if they appear, validates again, proves freshness, and only then opens the PR. Auto-merge should fail because something real changed underfoot, not because the system skipped a routine branch-maintenance step.

There will still be races. Another branch can land after the freshness check and before the PR opens. When that happens often enough to stop feeling like an edge case, it becomes the next hardening target. Fetch again, rebase again, revalidate, ask an agent to repair the race if the repair is mechanical, and escalate only when judgment is actually needed.

That is the dogfood pattern: each time the system drags me down into tedium, decide whether the interruption carries judgment. If it does, surface it clearly. If it does not, encode it.

A failed build used to mean the system stopped and I had to reconstruct what happened. Which plan was running? Which worktree? What changed? What evidence exists? Is the right next move retry, split, abandon, resume, or fix one missing piece? A human can answer those questions, but answering them is not the work I am trying to preserve myself for.

Recovery sidecars are boring because they are just files, and that is exactly why they matter. A failed build should leave behind a legible account of what failed, what already happened, what state can be reused, and what kind of recovery is available. The next action should not start from panic or archaeology. It should start from a structured verdict.

Acceptance criteria have the same shape. Early versions of a system like this are tempted to treat "tests pass" as completion. That is too weak. Tests passing means the computational sensors did not object. It does not mean the requested work was done, every acceptance criterion has evidence, or the agent did not quietly skip the awkward part of the spec and implement the easy part cleanly.

Failing closed is uncomfortable because it makes the system look worse for a while. Builds that used to pass now fail because the evidence is incomplete, or a criterion was vague, or no committed change actually proves the requested behavior. That can look like regression if the only metric is green checkmarks.

But a build that fails honestly is more useful than a build that succeeds optimistically.

A lot of the hardening work is making success harder to claim. If the PRD validator cannot parse the evidence, the verdict should not become pass by default. If a build produces no diff, that is not automatically fine. If there are no acceptance criteria, that is a waiver, not a silent success path. If a dependent plan is blocked behind an upstream build, that is not the same thing as a build failure. These distinctions are tedious, but they are also where trust lives.

The same thing is true at the workflow level. Multiple work items converging in one repo should not require the engineer to hold the whole Git graph in his head. That is the point of handing work off to a build system. The system should know which branches depend on which other branches, when one build must wait for another, when a child branch can be retargeted because the parent has already landed, and when the safe move is to stop.

Not because Git is beneath human attention. Git is worth understanding deeply. But understanding Git is not the same as spending the afternoon manually shepherding branch freshness across work that should have been moving in the background.

The boundary I care about is judgment versus tedium.

The engineer owns the plan, the architecture, the tradeoff between a small local fix and a broader refactor, the taste, the priority, the sequencing, and whether the system being built still makes sense.

eforge should own as much of the mechanical convergence as possible - queue ordering, worktree setup, branch freshness, stacked PR targeting, merge repair when the conflict is navigable, validation loops, recovery bookkeeping, evidence collection, conservative gates.

The handoff only becomes real when those mechanics stop leaking back into the thinking layer.

That is why the non-demo work matters. It is not polish after the interesting part. It is the substance of the tool. The happy path proves the agent can build something. The messy paths prove whether I can trust the system enough to start planning the next thing before the current one is done.

The demo is the build running in the background. The product is the part that lets me keep thinking while the branches converge.
