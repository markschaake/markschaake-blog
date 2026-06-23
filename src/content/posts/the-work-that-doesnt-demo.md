---
title: "The Work That Doesn't Demo"
description: "The visible part of agentic coding is the build. The trustworthy part is what happens when the build gets messy."
pubDate: 2026-06-23
draft: false
llms: ["gpt-5.5"]
tags: ["ai", "engineering", "eforge", "agentic-workflows", "thinking-layer"]
heroImage: ./the-work-that-doesnt-demo.webp
---

Last week, I queued a follow-up change before the branch underneath it had landed. <a href="https://www.eforge.build" target="_blank" rel="noopener noreferrer">eforge</a> built the work in an isolated worktree, the parent moved, and the stacked pull request hit the kind of restack conflict that used to send me back into Git by hand.

That is the kind of failure I've been trying to turn into system behavior. eforge is the autonomous build system I'm building for agentic coding - it takes a product brief, plans the work, gives coding agents isolated worktrees, validates the result, and lands the change through GitHub. I've been using eforge to build eforge.

The interesting question starts after an agent can make a useful diff. Can the workflow around that diff survive a real codebase, where branches move, dependent work stacks up, and validation has to mean more than tests passed?

The useful test is not the clean demo. It is one ordinary workflow: a follow-up change built on top of another change while `main` keeps moving.

Before eforge handled that workflow well, I would queue a follow-up, the agent would build it on an artifact branch, the parent branch or `origin/main` would move, and a stacked pull request restack would hit a conflict. Sometimes the conflict was genuinely about intent. More often it was mechanical - the same kind of merge friction eforge already knew how to handle in a non-stacked path.

But the stacked landing path did not share that capability, so the build failed. I would stop what I was doing, inspect the worktree, reconstruct which plan was running, decide whether to retry, rebase, repair, or abandon, rerun validation, and get the pull request current again.

None of that was the product decision. The product decision was whether the follow-up change belonged in the system, whether the scope was right, and whether the implementation matched the direction I wanted. Branch freshness was just the mechanical underside of parallel work leaking back into the part of the day where I was supposed to be thinking about the product.

The better version is less dramatic. eforge records the dependency, waits while the upstream build is active, fetches before landing, rebases or restacks when the base moves, asks an agent to repair navigable conflicts, reruns validation, proves freshness, and only then opens or updates the pull request. If the conflict requires intent, it stops. That stop matters. A system that repairs every conflict confidently is not safer than one that asks too often.

Interruptions are not the problem. Interruptions without judgment are.

This is the work that doesn't demo.

![eforge console showing a recovery build running, a dependent plan waiting, spend by model, and build health.](./the-work-that-doesnt-demo-console.png)

_The actual shape of the work: one recovery build running, one dependent plan waiting, and the machinery around it visible._

A demo wants the clean path: a well-scoped task, a quiet repo, one agent run, one branch, no upstream movement, no ambiguous validation, no weird stack topology. The dashboard moves, the diff looks reasonable, and the tests pass.

That path matters, but it is also the easiest path.

The past week was mostly the other kind of work - about 360 commits across recovery sidecars, acceptance-criteria evidence, validation repair, blocked dependents, stacked-PR landing edge cases, and timer-flakiness cleanup. The visible product did not change much. The system got less casual about pretending a build was done.

That one stacked-workflow failure forced several boring pieces to become real. A dependent plan needs to know when to wait instead of starting from the wrong base. A failed build needs to leave behind enough state for the next move. A successful build needs evidence that it satisfied the request, not just a passing test run and a plausible diff.

Recovery sidecars are the failed-state part. A failed build used to mean archaeology: which plan was running, which worktree it used, what changed, what evidence existed, and whether the next move was retry, split, abandon, resume, or fix one missing piece. Now the failed build leaves behind a legible account of the plan, state, reusable artifacts, and recovery options.

That is boring because it is just files, and that is exactly why it matters. The next action should start from a structured verdict, not from panic or log-diving.

Acceptance criteria are the success-state part. Early versions of a system like this are tempted to treat "tests pass" as completion. That is too weak. Tests passing means the checks did not object. It does not mean the requested work was done, every acceptance criterion has evidence, or the agent did not quietly skip the awkward part of the spec and implement the easy part cleanly.

Failing closed makes the system look worse for a while. Builds that used to pass now fail because the evidence is incomplete, a criterion was vague, or no committed change actually proves the requested behavior. That can look like regression if the only metric is green checkmarks.

But a build that fails honestly is more useful than a build that succeeds optimistically.

Most of the hardening is about making success harder to claim. If a validator cannot parse the evidence, the verdict should not become pass by default. If a build produces no diff, that is not automatically fine. If a dependent plan is blocked behind an upstream build, that is not the same thing as a build failure. These distinctions are tedious, but without them I do not know what a green build means.

The boundary I care about is judgment versus tedium.

The engineer owns the plan, architecture, scope, taste, priority, sequencing, and whether the system being built still makes sense.

eforge should own as much of the mechanical convergence as possible - queue ordering, worktree setup, branch freshness, stacked PR targeting, merge repair when the conflict is navigable, validation loops, recovery bookkeeping, evidence collection, conservative gates.

The happy path proves the agent can build something. The messy path proves whether the system knows what should come back to me.
