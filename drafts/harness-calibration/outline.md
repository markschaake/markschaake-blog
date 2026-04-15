# Draft outline - harness comparison post

Working title candidates:
- "Same Models, Different Bills"
- "What Two Harnesses Produce from One Model"
- "The Only Thing That Replicated"

Status: outline / skeleton. Prose to be written in voice.
Supporting evidence: see `./supporting/` for the five variant analyses this draft references.

Significant revision from v1: most calibration claims did not survive the second excursion run. Token efficiency did. Outline restructured around what replicated vs. what didn't.

---

## Premise

Eforge is an orchestration layer above agent harnesses. It can route to the Claude Agent SDK or to pi (with Anthropic API direct) as its underlying harness. Same orchestration, same models, same scenario - only the harness changes.

I ran five evals with model routing equalized (opus-4-6 for build stages, sonnet-4-6 for the low-stakes PRD validator). Three small errand-scale runs, two larger excursion-scale runs. Going in, I expected a clean "harness X wins" conclusion. The data didn't deliver one.

## What replicated across all five runs

### Pi uses fewer tokens. Every time.

| Run | Scale | Pi tokens | Claude-sdk tokens | Ratio |
|-----|-------|-----------|-------------------|-------|
| 1   | errand    | 167k  | 406k  | 2.4× |
| 2   | errand    | 167k  | 352k  | 2.1× |
| 3   | errand    | 159k  | 379k  | 2.4× |
| 4   | excursion | 6.74M | 9.32M | 1.38× |
| 5   | excursion | 4.92M | 12.10M | 2.46× |

Pi is always cheaper too - by 1.1× to 1.7× on cost, depending on the run. Cache inversion holds at errand scale: claude-sdk caches better (86-89% vs. ~75%) and still loses on cost because the raw input volume is so much larger.

Output tokens also diverge consistently: on errand scale claude-sdk produces ~2× the output of pi for the same passing task. The harness shapes generation behavior, not just input context.

### Claude-sdk's planner silently enlists haiku.

Both excursion runs showed the same architectural behavior: claude-sdk's planner agent invokes `claude-haiku-4-5-20251001` as a sub-agent.

| Run | Planner haiku tokens | Planner opus tokens |
|-----|----------------------|---------------------|
| 4   | 349k in              | 294k in             |
| 5   | 507k in              | 168k in             |

Pi doesn't do this. Eforge didn't configure it. This is the claude-sdk backend dispatching a faster helper model from inside an opus-configured agent - a mixed-model workflow that happens invisibly to the layer above.

Worth flagging because it reframes "same model routing on both sides." On paper they're identical. In practice claude-sdk is running more than one model and pi is running exactly what was asked.

## What didn't replicate

The temptation after run 4 was to claim pi had better decision quality. Run 5 made that claim untenable.

### Reviewer signal-to-noise completely reversed

|     | Pi accept rate | Claude-sdk accept rate |
|-----|----------------|------------------------|
| Run 4 (excursion) | 57% | 28% |
| Run 5 (excursion) | 33% | 62% |

Same models, same PRD, same orchestration, same overlay. Both sides swung ~25 points in opposite directions.

### Plan-evaluator execution flipped
- Run 4: pi ran plan-evaluator; claude-sdk skipped it
- Run 5: claude-sdk ran plan-evaluator; pi skipped it

### Merge-conflict-resolver invocations
- Run 4: pi 1, claude-sdk 2
- Run 5: both 0

### The "review" verdict class
- Run 4: appeared only on claude-sdk
- Run 5: appeared on pi (8 of 27 verdicts)

### Composer scope sizing across errand runs
- Pi flipped between errand and excursion run-to-run on the same PRD
- Claude-sdk stably over-scoped

Five dimensions I would have claimed as calibration differences after run 4. Four of them reversed or washed out by run 5. The fifth (pi composer variance) holds but is itself a story about instability, not a cleaner decision-making process.

## The finding I didn't set out to make

**Eval results at excursion scale are noisy enough that individual runs lie.** On run 4, pi looked more calibrated. On run 5, claude-sdk did. A post-published after run 4 would have overclaimed. A post published after run 5 with opposite framing would have overclaimed in the other direction.

The analysis for run 5 puts this plainly - "any single-run comparison should be read as one sample, not a backend verdict." That observation is arguably the most useful thing the exercise produced.

What this means for anyone benchmarking agent harnesses on realistic workloads:
- Token and cost numbers are stable enough to trust from small samples
- Behavioral/decision-quality metrics (review precision, stage execution, scope sizing) are not
- N=1 on an excursion-scale scenario tells you almost nothing about calibration
- The bar for claiming "harness X makes better decisions" is higher than most comparisons I've seen bother with

## Specific findings worth noting (smaller, still replicable)

### Claude-sdk's plan-reviewer overspends at least sometimes
Run 5: $1.24 on 1.14M input tokens for plan-review on claude-sdk vs. $0.29 / 94k on pi. 4× the spend on the same PRD at the same stage. Not present in run 4 data at this magnitude. One-run finding - could be redundant re-reads or a loop. Worth a follow-up investigation before claiming, but worth noting.

### Neither harness used MCP or skills
Across all six runs (n=5 after the initial sonnet-4-5 calibration run plus this one), zero MCP tool calls and zero skill invocations on either side. Claude-sdk backend is deliberately not exposing skills to eforge sub-agents in the current config. This simplifies the comparison - no capability asymmetry - but also means the claude-sdk overhead is pure harness, not "overhead that pays for skills when they're needed."

## Caveats

- Two scenarios total (one errand fixture, one excursion fixture). Not representative of all engineering work.
- Errand: n=3. Excursion: n=2. Small samples for anything but the loudest signals.
- All runs on the same day. Shared API-side conditions (one known stall on run 4 pi).
- Errand composer-scope non-determinism on pi was itself only observed within n=3 - may not generalize.
- Five total runs is enough to be suggestive, not enough to be conclusive. The post should say so clearly.

## Economic coda (optional section, possibly split to companion post)

The eforge → harness → subscription stack. Pi routing to Anthropic API direct is pay-per-token. Claude-sdk via subscription is flat-rate at $200/mo. The five runs cost roughly:

- Pi metered total: ~$0.39 + $0.42 + $0.39 + $10.52 + $8.42 ≈ $20.14 for five runs
- Claude-sdk on subscription: amortized within the flat monthly rate

Extrapolating pi costs to a month of real usage would almost certainly exceed the flat subscription. So the harness that wins on tokens loses on how I actually pay for it.

Possible framing: *the harness I'd rather use by the numbers is the one the pricing model doesn't reward me for using.*

Decide: include here or publish separately. Arguments for separate - keeps this post focused on what did and didn't replicate. Arguments for combined - the pricing tension is the reason anyone reading would care about these numbers.

## Structure draft (for the write-up)

1. Open with the setup - same models, different harnesses, five runs
2. The stable finding: tokens (tight paragraph with the table)
3. The stable finding: hidden haiku delegation (short, with numbers)
4. The unstable findings - what I would have claimed after run 4 and why run 5 undid it
5. Land on: excursion-scale eval results are noisy; behavioral claims need more runs than I had
6. Brief specific-findings section (plan-reviewer overspend, no MCP use)
7. Caveats in voice
8. Optional: pricing coda, or save for companion post

Keep it under 1400 words. The non-determinism section is the hardest part to write well - it's tempting to sound apologetic ("I almost published something wrong!"), but the finding is actually useful: don't trust single-run harness benchmarks. Close on that, not on self-correction.

## Open questions / things to verify before publishing

- [ ] ~~Run a second excursion~~ done; confirmed non-determinism
- [ ] Is the plan-reviewer overspend on claude-sdk (run 5) reproducible? Would need one more excursion to tell.
- [ ] Understand whether eforge counts `"review"` verdicts correctly in `result.review.accepted`/`rejected`. Both backends now emit them.
- [ ] Confirm claude-sdk's planner-side haiku call is a subagent/Task mechanism (currently inferred from modelUsage only)
- [ ] Decide: one post or two (tokens/architecture + pricing)
- [ ] Decide title
- [ ] Consider whether a third excursion run would change anything - or whether n=3 at excursion scale has the same noise floor as n=2
