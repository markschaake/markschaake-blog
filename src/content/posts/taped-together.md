---
title: "Taped Together"
description: "I stopped working on eforge. A smaller, more changeable arrangement is giving me more of the harness I wanted to build."
pubDate: 2026-11-20
draft: false
llms: ["gpt-6-astra", "claude-opus-5-5"]
tags: ["ai", "harness-engineering", "agentic-workflows", "eforge", "thinking-layer"]
heroImage: ./tapey.webp
---

I stopped working on eforge. When I chose how to build my current project, I decided not to use the build system I'd spent months developing, and that has turned out to be the right choice.

Instead, I'm using <a href="https://pi.dev/" target="_blank" rel="noopener noreferrer">Pi</a>, a few third-party extensions, and project-specific tooling. More recently, Grok Bot has been managing sessions through herdr, taking over some of the supervision I was doing myself. It's a less unified arrangement than eforge was supposed to be, but I can change it quickly while working on the project.

I haven't stopped wanting what eforge was meant to provide. I'm getting more of it by assembling focused tools than I was by building the whole system.

## Too much to own

<a href="https://github.com/eforge-build/eforge" target="_blank" rel="noopener noreferrer">eforge</a> was my attempt at a software factory - a system that could take a brief, plan the work, delegate to coding agents, review their output, and get changes landed. It had orchestration with opinionated defaults, subagents, blind review, worktree management, and an extension system for shaping the workflow around a project.

It was the right shape when I started it, but I was trying to advance all of those pieces while using the system to build itself.

I also bet too much on the LLMs. I wanted to stay at the planning level and trust the generation, review, and repair loops underneath. I stopped reviewing the code myself and expected those loops to carry more of the engineering judgment than they could reliably sustain. Slop debt accumulated, and eventually I didn't feel I could recover the project with the energy I had for it.

Orchestration reliability was the final piece I couldn't get working well enough. But fixing that alone wouldn't have resolved the larger problem: eforge was becoming a jack of all trades while focused tools were getting better at each of its jobs.

<a href="https://github.com/backnotprop/plannotator" target="_blank" rel="noopener noreferrer">Plannotator</a> became better for my planning and review use cases than what I'd built. The <a href="https://github.com/nicobailon/pi-subagents" target="_blank" rel="noopener noreferrer">pi-subagents extension</a> gave me configurable agent roles, delegation, and blind review, with more capable orchestration than my own. Those projects had a focus I couldn't maintain across every part of eforge.

I'd love to own every layer - that was part of the appeal. But as a solo engineer, I couldn't keep all of them competitive while the models, tools, and workflows underneath were changing this fast. A software factory framework was too much to carry if I also wanted to stay at the frontier of using it.

## Working on the project's harness

Pi lets me put the project-specific pieces close to the work. Its extensions can add tools, commands, and behavior at either the user or project level. When I want something to work differently, I can ask Pi to help build that change without forking the agent or turning it into a feature of a separate platform.

The third-party subagents extension handles the reusable orchestration. My project extension handles what is particular to this project - how tasks start, how work gets verified, and what has to be true before a change can land. Plannotator gives me a focused way to review plans rather than another planning interface to maintain myself.

The clearest example is browser verification. I started by using <a href="https://github.com/vercel-labs/agent-browser" target="_blank" rel="noopener noreferrer">agent-browser</a>, with a Playwright fallback, to check that functionality worked. Then I extended the loop to review the user experience against the project's guidelines.

A screen can function correctly and still be wrong for the product. Implementation language can leak into labels and messages. A layout can be busier than it needs to be, or so sparse that routine work takes unnecessary scrolling. I want the interface to fit the task, and those expectations need to be part of verification rather than something I notice later when clicking through the application.

Adding those checks through the Pi extension was straightforward. I could adjust the workflow against actual changes to the application, see where the checks were useful, and fine-tune the gates. This was part of the vision for eforge's extension system, which I never realized there because getting the underlying system working consumed so much of the effort.

The replacement isn't seamless. The browser extension delegates to the system's native agent-browser installation, and I've hit version mismatches between them. My current setup isn't especially team-friendly, since it depends on a collection of tools that don't always move together.

But those are problems I can work on directly. I can inspect the integration, repair it, and return to adjusting the verification. For now, that is a better tradeoff than owning the entire framework around it.

## Delegating the babysitting

There was more manual supervision in this arrangement at first. I was managing sessions, checking progress, answering questions, and deciding when an agent needed steering. That work has moved to a <a href="https://docs.x.ai/grok-bot/overview" target="_blank" rel="noopener noreferrer">Grok Bot</a> steward - persistent, named, and pointed at one project.

<a href="https://herdr.dev/" target="_blank" rel="noopener noreferrer">herdr</a> is what makes that useful. It provides the workspaces and terminal sessions through which the steward can launch Pi, inspect ongoing work, and interact with multiple agents. Rather than dispatching jobs and waiting for results, the steward does the interactive babysitting I would otherwise be doing.

What's changed is that I'm working _with_ the babysitter rather than trying to eliminate myself from the loop. The steward holds more memory across tracks than I can keep in my head. It manages several threads of work in parallel, watches resource use on the machine, and responds faster when a session needs attention. It can make process decisions without me - what to test next, how to recover from a validation failure without rerunning every check. I still set product direction: what matters, what has to land before something else, and which cues to add to the queue so the steward can start them when the path is clear.

Some of that coordination is work I had imagined eforge would do automatically. Parallel work sits in a few herdr worktrees rather than an open free-for-all. Database migrations merge one at a time, with an explicit order when they would clash. Heavy end-to-end suites share a lock across worktrees so contention on the Mac doesn't invent timeout failures on feature branches. After a merge, the steward fast-forwards coordinator main, rebases in-flight work, updates open pull request branches onto the new tip, and tears down only that task's workspace - sibling stacks stay up. Process decisions stay with the steward, and when an agent blocks on application policy, that comes to me.

eforge was starting to do pieces of this, but the steward keeps me in the loop in a way the factory didn't. I can change its approach in the middle of the night. At my desk I can tell it I want oversight on process without making application policy decisions myself. On a night shift I can tell it to make those policy calls when needed, as long as they won't add major complexity to the system.

In late September, on the project this steward is helping run, nineteen pull requests merged on the 22nd, eleven on the 23rd, and thirteen on the 24th - forty-three in three days. I still merge some myself. Multi-track babysitting is newer than the first of those days, but the difference is already clearer than anything I got from carrying the whole orchestration layer myself.

There's an obvious question here: after trusting LLMs too much with eforge, why put another LLM above the coding agents?

The difference I'm trying to maintain is an earned, bounded handoff. A steward doesn't make the agents' work more trustworthy by itself - the project's verification still has to do that, and I decide how much authority the steward has earned for a given shift.

In <a href="https://maven.com/p/e23d9c" target="_blank" rel="noopener noreferrer">her talk on improving coding agents</a>, Lauren Tan describes an agent trust curve - moving from micromanagement toward greater autonomy as verification improves. The browser and UX checks are a concrete part of that progression for me. They give me a better basis for stepping back than another agent saying the work looks good.

I'm still not handing the steward the product roadmap, and it doesn't decide what the project should become. It does decide more of the how while I'm asleep or focused elsewhere - within bounds I can tighten or loosen by talking to it. Routines that find and clean technical debt inside those bounds feel closer than they did when the babysitting was only mine.

## Where I still make the difference

User interface design and review have become my most important role in this arrangement. Delegating the implementation and its supervision gives me more room to work on what the application should feel like to the person using it.

I prefer GPT models for back-end development and Claude Opus 5.5 for front-end work, and an extension I maintain for Pi manages that split. Back-end implementation runs in the Pi agent harness with GPT models. When the engineering preparation is ready, Pi saves a handoff - what's implemented, what's been checked, what remains, and the constraints - and stops writing. Claude Code takes over the UI work in another herdr pane, in the same worktree. Claude owns the interface from the first pass, rather than polishing a UI GPT has already built.

After the UI work, I'm brought in for UX review and steering. Someone scanning records and taking repeated actions needs a different screen from someone making an occasional choice. More whitespace isn't always better; neither is greater density. I want to use what was built and decide whether the layout, language, and interactions fit the person doing the task.

The automated browser and UX checks help, but checking an interface against guidelines isn't the same as deciding whether it's the right interface. I can work with Claude on that design without Pi continuing to edit underneath us. When I'm ready, I stop the Claude session's work and explicitly hand control back to Pi for final verification and PR preparation. That return doesn't count as a test pass.

The review after that hand-back has a narrower job. It can flag broken controls, unreadable states, or other concrete usability problems, but it isn't supposed to replace my layout or copy choices with another model's preferences. If an intentional design choice creates a real problem, it should come back to me rather than be silently redesigned. My judgment needs to survive the rest of the workflow, not just be collected at a checkpoint.

This is the right level of involvement for me because the models aren't yet making better user interface decisions than I would. When they're doing it better than I am, on average, I expect to step out of that review loop too. I'm not reserving interface design as permanently human work. It's where my judgment is still worth bringing into the process.

## Trust and efficiency

Trustworthiness is the most important part of this, but it isn't the whole optimization problem. Delegation is already valuable, and poor delegation spends that value on rework, slop, and excessive compute.

Another verification pass can catch a real problem. It can also add another context handoff, repeat checks that have already been done, or send an agent into a repair loop that doesn't converge. Too little verification lets debt accumulate; too much poorly targeted verification burns tokens without buying confidence.

The balance doesn't stay fixed either. A new model changes which tasks need close supervision. A better tool makes a previously awkward check cheap. My own understanding of the project changes what I need to verify. I'm optimizing an arrangement whose parts and requirements are both moving.

The more efficient and trustworthy the harness, the more leverage I have in <a href="/posts/the-layer-above" target="_blank" rel="noopener noreferrer">the layer above</a>. Better verification lets me delegate more without inspecting every detail myself. Better coordination turns that delegation into progress instead of retries and supervision.

## Keeping the knobs within reach

I could adopt a more complete, preassembled harness, which would give me more ready-made behavior but also put another layer between me and the controls I want to adjust. Right now, I want to be able to change a gate or repair an integration without first working through a framework's assumptions.

So I'm taping together my Millennium Falcon. Pi and a few focused tools provide the substantial engineering underneath. The project extension fits them to the work, routing implementation through Pi and Claude Code. Grok Bot handles the supervision through herdr while I set direction and review the experience we're building. When the tape holds, it moves quickly and reliably. When it doesn't, I can get to the connection that needs fixing.

This isn't a finished system I'd hand to a team unchanged. It's the arrangement that currently lets me benefit from other people's focused work while retaining direct control over how the pieces fit.

I can afford to own the connections. I can't afford to keep every layer at the frontier myself.
