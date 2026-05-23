---
title: "Discipline, Codified"
description: "What harness engineering actually names: the discipline an engineer applies on their best days, made executable so it runs every day."
pubDate: 2026-05-05
draft: true
llms: ["opus-4.6"]
tags: ["ai", "agentic-engineering", "harness-engineering", "thinking-layer", "methodology", "eforge"]
---

On the days I was sharp, I wrote the plan before I coded. I slept on hard decisions and read the diff in the morning. I ran the tests every time, even when the change felt too small to break anything. I didn't merge tired.

Twenty years of battle scars made the discipline non-negotiable. On the days I wasn't sharp, it still held - just less sharply. The plan still got written, the diff still got read, the validation still ran. I was bursty - high output when sharp, slow when not, never sloppy.

I don't write code anymore - agents do the typing. The discipline didn't move to them; it moved into the harness I built around them. What I encoded, the harness now sustains.

---

Discipline is not process. Process is what teams write down to manufacture discipline at scale, because policy is the only lever a company has when it cannot rely on every engineer, on every day, carrying the disciplined practices themselves. Some of it works. Most of it produces a watered-down version of what a disciplined solo engineer applies natively - because policy can require a code review, but it cannot require the reviewer to give the diff their full attention.

The disciplined solo engineer is the existence proof. Software gets built well by individuals who carry the practice themselves, without policy, without enforcement. The discipline is not about teams. It is about what gets carried.

---

When agents do the typing, a third option opens up - the disciplined practices themselves, encoded in a system that runs them faithfully every time.

Codified discipline is not the same as uniform workflow. The engineer's first move on any change is to size it - is this a one-file fix or a cross-cutting refactor? Does this need a design pass, or can I head straight to the diff? The answer shapes everything that follows. A great engineer's discipline is not "apply every practice to every change" - it is "assess what this work needs, then carry through the practices appropriate to that scope."

A harness embodies the same shape. A planning stage analyzes the input and selects the workflow. A small change runs through a fast path. A large cross-cutting change decomposes into a dependency graph with full review at every layer. The discipline lives in two places: the rigor of the assessment, and the faithful execution of whatever workflow the assessment selects.

When the workflow calls for a plan, the plan exists by the time the build agent starts. No path through that workflow skips it. When the workflow calls for blind review, the reviewer is a separate agent in a separate context, with no knowledge of the build conversation. The blind reviewer cannot be tired, cannot be sympathetic to the builder's framing, cannot say "I trust this person, I'll skim."

Agentic engineering is the discipline of building software with agents. <a href="https://martinfowler.com/articles/harness-engineering.html" target="_blank" rel="noopener noreferrer">Harness engineering</a> is one way of codifying that discipline - not control theory, not orchestration plumbing, but a great engineer's best-day practice, made executable.

---

The harness runs the same on Friday afternoons. It runs the same when the engineer is sick. It runs the same on the third feature of a long day, when the urge to skip validation is strongest. There is no fatigue, no caveat, no exception for "this one is small enough."

And every lesson encodes. The first time a build of mine shipped with subtle drift from the spec - the change worked, but the agent had quietly reinterpreted a piece of the plan - I added an evaluator that compares the diff to the plan hunk by hunk. Later, when builds started declaring themselves done while quietly skipping pieces of the spec - every per-subplan evaluator passing, the implementation still short of the original - I added a gap evaluator that compares the full build against the source spec. When it finds gaps, agents spawn to close them. From that point on, every build runs through both checks. The next engineer using the same harness inherits the lessons without paying their tuition.

Human discipline does not compound this way. Each engineer relearns the same lessons across their career - the missed validation, the rushed merge, the plan that should have been written. Codified discipline accumulates.

The part that exceeds human capacity isn't the cognition. Models still drift, still hallucinate, still need supervision. It's the consistency: the practice running the same way at 9am Monday and 6pm Friday, with every lesson the engineer has ever encoded built in.

---

The work does not go away. It shifts upstream.

The engineer decides what to encode. Which steps deserve separation. What "fresh eyes" means in this domain. What the spec actually says, and what counts as drift from it. When a small change has earned the fast path and when it needs the full pipeline.

Codification carries the same risk as policy: an encoded practice outlives the situation it was built for and ossifies into a checkbox the harness runs because it always has. The defense is the same too - the engineer who encoded it has to keep asking whether each piece is still load-bearing or has become scaffolding for a problem that no longer exists. Doing that well compounds. The harness gets more reliable, more aligned with the discipline the engineer would actually apply on their best day. Doing it poorly produces another version of the watered-down process the harness was supposed to escape.

---

<a href="https://github.com/eforge-build/eforge" target="_blank" rel="noopener noreferrer">eforge</a> is one expression of this. Spec-driven input. A planner that grounds in the codebase, sizes the work, and shapes the workflow - small changes run a fast path, larger work decomposes into modules and runs full review at every layer. Implementation, blind review in a fresh context, evaluation against the plan, post-merge validation with auto-fix - applied with rigor proportional to scope. Every stage, and the assessment that selects them, is a piece of practice made executable.

The architecture is documented for engineers who want to build their own - patterns, tradeoffs, design choices all visible. For everyone else, the pipeline is ready to run.

Either path - building your own or running mine - lands in the same place.
