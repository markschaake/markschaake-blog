---
title: "The Next Operating System"
description: "Replacing a tennis club's software backbone while most people still live in the old one - and seeing a future they can't see yet."
pubDate: 2026-10-28
draft: true
llms: ["grok-bot"]
tags: ["ai", "product", "communities", "agentic-software", "ytc"]
---

A month into live use, the member portal at my tennis club is smoother than I expected. Operations have been steady. Members are finding their way. The incumbent software - Club Automation - still sits in the background of people's habits, but the day-to-day work of belonging to the club is already happening somewhere else.

This started as a pro bono passion project: replace the club's software backbone with something built for us. What it has become is harder to name cleanly. I'm not just swapping screens. I'm building the next operating system for a place I care about, while most members and staff still live inside the old one - and while I can already see an agentified membership experience that isn't visible to them yet.

Software that becomes the OS of a business never stays technical. It surfaces politics. It collides with policy. The interpersonal work shows up whether I planned for it or not.

## What Ace is for

The membership experience I'm aiming for is AI-first in a way that should feel natural rather than flashy. The point isn't a chatbot bolted onto a reservation form. It's that self-service becomes discoverable - that a member who wants something can find it without already knowing which menu hides it.

Ace is the member-facing assistant for that. It's rolling into the product as the place where features show up in conversation instead of only in navigation. Next week the private-lesson availability flow lands as a concrete example. Instructors block future court time as available. A member sees a homepage nudge - Kathleen has time open - and that opens Ace with presets for thirty or sixty minutes, plus room for natural conversation. Booking for someone else on the account is part of the same flow.

That is a small surface. Underneath it is a different idea of how a club should work: the system notices availability, surfaces it, and helps the member act without making them hunt. The old software couldn't do that. Waiting on a vendor ticket for it would have been a multi-year joke. Building it ourselves means the future can show up in pieces people can touch.

## Who can see it

I under-promise, with a confident expectation of over-delivering. That has already been the pattern this month. Skepticism is still understandable. Plenty of people have lived through the opposite - big claims, thin delivery - and software rollouts at clubs and small organizations have a reputation for disruption that outruns benefit.

Kathleen, one of our tennis pros, is the clearest counterexample so far. She was early-skeptical, which I expected. I looped her into demos and training anyway. She cares about the member experience, and once she could see what the system was becoming, she had real epiphanies and bought in. She also works marketing at White Pass and already uses AI heavily there. When I enabled MCP so Claude could connect to her club account and draft club-branded emails into the club email system, that landed hard. The abstract promise became a concrete tool in her hands.

There is another pattern on the tennis-leadership side that I hear secondhand rather than face to face: concern that the software change is a huge mistake. I take that seriously as a signal even when it doesn't come to me directly. Some of it is disruption anxiety - workflows and revenue rhythms that used to be stable suddenly sit on new ground. Some of it is the gap between seeing member experience improve and feeling the cost of changing how you work. I don't get to resolve that gap by arguing harder. I get to keep shipping things that make the new direction feel better than the old one for the people who use it every day.

## Workarounds as a tell

An older mindset is still active: work with what we have. I found people routing around a missing capability by stretching another feature instead of asking for the right fix. I had already built the enabling piece, but the cue hadn't stuck - Provide feedback - so the system that can change fast was being treated like the vendor software that couldn't.

That habit made sense under Club Automation. You submitted a ticket and waited. You learned not to ask. The new portal is different on purpose. A gap can become a change request, and a change request can land while the conversation is still warm. The cultural shift is slower than the engineering one. People have to believe the feedback loop is real before they stop improvising around holes.

## When the OS meets policy

Then there are collisions that aren't about features at all.

The club had a card-surcharge policy before cutover. On Stripe, that policy doesn't sit cleanly. Processing fees are the same shape either way, and surcharging debit isn't allowed even though Stripe still charges the club for those payments. Without card-type detection, debit payers got surcharged by accident and were upset - which is a reasonable response to being charged a fee the rules don't permit.

My preference is to drop surcharges and cover processing in pricing rather than punish people for how they pay. The alternative - full debit-versus-credit detection - adds complexity, staff training, and a final amount you can't quote until after the tap. I dislike that path. A longer-horizon idea is Match Points: a karma-like reward for engagement that could also become account credit sized to the savings from ACH, reward instead of punishment. That one carries accounting complexity and likely bylaw work. It's a future suggestion, not a shipped answer.

What matters for this post is the shape of the collision. Replace the operating system and pre-existing policy stops being abstract. The software makes the awkwardness visible. People who were comfortable with the old arrangement feel the pressure of a clearer picture, and the builder has to decide whether to encode a bad rule more carefully or change the rule.

---

The code is the easier part. Agents, harnesses, overnight merge trains - those I know how to run. The harder work is holding a future most of the club can't see yet, shipping pieces of it gently enough that people can climb aboard without being dragged, and noticing when resistance, workarounds, or policy friction are telling me something the backlog isn't.
