---
title: "The Hill"
description: "Information asymmetry, the bitter lesson, and what stays durable when models keep getting smarter."
pubDate: 2026-04-01
draft: false
tags: ["ai", "engineering", "career"]
heroImage: ./the-hill.webp
---

A friend was describing what it must be like inside a frontier AI company - "a wonderful place to be sitting on a hill and looking at everyone else trying to climb it." They'd be working with next-gen models before public release, already knowing which current friction is temporary while the rest of us place bets blind.

This is the information asymmetry that everyone outside those companies lives with. We're investing in tooling, building integrations, designing architectures - and someone inside already knows which of those investments will be obsolete in a quarter. Not because they're smarter, but because they've seen what's coming.

Yesterday someone <a href="https://news.ycombinator.com/item?id=47584540" target="_blank" rel="noopener noreferrer">discovered that Claude Code's entire source code</a> had shipped in an npm package - 500,000 lines, nearly 2,000 files, dozens of feature flags for capabilities that are fully built but haven't shipped. I looked at it, along with everyone else - some wanting to understand how things work under the hood, but a lot of the energy focused on the feature flags. What's coming next. What bets are about to pay off or stop making sense.

I watch it playing out around me. People grabbing at opportunities, building fast, trying to find the angle that holds. Some will land on something durable. Many won't - they'll burn through savings or enthusiasm and quietly step back, and the industry will look completely different in a year. It's a discouraging dynamic to sit with, and I'm not immune to it.

## The bitter lesson

The AI community calls it "the bitter lesson" - as models get smarter, human-added complexity increasingly gets in the way. Simpler works best. <a href="https://www.youtube.com/watch?v=hV5_XSEBZNg" target="_blank" rel="noopener noreferrer">Nate's recent video</a> lays this out well: "Every AI system in production contains an invisible layer of workarounds for the last model's weaknesses, and most teams stopped seeing them as workarounds a long time ago."

The core question he poses: is this instruction here because the model needs it, or because I needed the model to need it?

The people most at risk aren't those who can't use AI - it's those whose value was built on _compensating for AI's limitations_. Elaborate prompt scaffolding, complex retrieval pipelines, workaround architecture that outlived the limitation it was built for. Each model upgrade erodes that layer.

## Where I sit

AI has written all my code for over six months now, and I feel secure for now. Deep systems experience translates directly to driving AI effectively - knowing which architectural choices are good or bad, course-correcting before bad decisions compound. There's consulting work as far as I can see.

But I'm also completely consumed by eforge right now - I'm betting on it. Not casually - it's where my time goes, where my energy goes, and I think about what happens if it all turns out to be for nothing. When models internalize deep systems expertise - not just syntax but judgment about distributed systems, data modeling, failure modes - the value I bring narrows, and the tool I'm building may narrow with it.

## Building for the fade

So <a href="https://eforge.build" target="_blank" rel="noopener noreferrer">eforge</a> forces me to look ahead. <a href="/posts/the-handoff" target="_blank" rel="noopener noreferrer">The build phase already runs in the background</a> - eforge is meant to be <a href="/posts/the-layer-above" target="_blank" rel="noopener noreferrer">the layer above</a> - but that layer needs to constantly evolve upward. Some structure is load-bearing: orchestration, topological merge order, the blind review architecture. Some is compensatory scaffolding I expect to remove as models improve. The hard part is knowing which is which, and having the discipline to let go of the compensatory parts even when I built them myself.

Overprompting is the clearest example - all the careful wording that accommodates a model's current quirks but won't matter once the next version drops. Same with treating code review as a procedural checklist rather than thin scaffolding around model judgment, or building an opinionated abstraction layer where a shim would do. "Am I adding this because the model needs it, or because I'm uncomfortable letting go?"

One bet I'm more confident in: staying flexible on providers. eforge supports <a href="https://github.com/badlogic/pi-mono/" target="_blank" rel="noopener noreferrer">pi</a> as a multi-provider backend specifically because locking into one vendor's API when the landscape shifts this fast seems like exactly the kind of compensatory decision that ages badly. Maybe eforge itself becomes the tool people use, maybe it's an inspiration for whatever comes next, maybe the value is just in the design principles it forces me to confront. I don't know which.

## What stays

Models can solve problems, and they're getting better at it fast. What they don't do is decide which problems matter, whether the solution is actually right, or when to change direction entirely. I don't have a clean name for that role. It's not "problem solver" because the models are taking over more of that space. It's closer to judgment - the ability to evaluate, steer, and know when something is off before the cost compounds.

Currently that judgment requires implementation intuition - deep enough understanding of underlying choices to know which ones are good. That requirement may fade as models improve, and I want to believe the judgment itself stays human.
