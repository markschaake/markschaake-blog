---
description: Critical review of a blog post for content, flow, and voice
argument-hint: "[post-slug-or-path]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep
---

# Review Blog Post

Perform a critical review of a blog post evaluating content, flow, and voice against the standards in CLAUDE.md and the patterns established across published posts.

## Arguments

- `$1` - Post slug (e.g., `the-layer-above`) or file path. If omitted, review the most recently modified post in `src/content/posts/`.

## Workflow

### Step 1: Gather materials

1. **Read the target post** fully
2. **Read CLAUDE.md** - specifically the Writing Style section (punctuation, tone, voice)
3. **Read 2-3 most recent published posts** (non-draft, by `pubDate` descending) for voice calibration. These are your reference for what "on-voice" sounds like in practice.

### Step 2: Establish context

Before any evaluation, write a brief context section:

- **Thesis**: What is the post's central argument or observation?
- **Prompt**: What seems to have prompted this post (experience, trend, event)?
- **Arc**: How does the post develop its idea (e.g., concrete opening -> analysis -> counterargument -> open close)?

This context frames the review. A post about personal experience has different content expectations than one making technical claims.

### Step 3: Evaluate

Apply the criteria below across four dimensions. For each finding, assign a severity:

| Severity | Meaning | Action |
|----------|---------|--------|
| **Revise** | Undermines the post's effectiveness or violates voice | Must address before publishing |
| **Consider** | Would meaningfully strengthen the post | Worth addressing |
| **Note** | Minor observation or pattern to be aware of | Optional |

Be specific. Quote the problematic text and explain why it doesn't work. When suggesting changes, offer a concrete rewrite.

### Step 4: Output

Use the output format defined at the bottom of this file.

---

## Review Criteria

### 1. Content

Evaluate whether the post's argument is sound and well-supported.

**Check for:**
- **Thesis clarity**: Can you state the central argument in one sentence? If not, the post may lack focus.
- **Evidence**: Are claims supported by concrete evidence (personal experience, citations, examples)? Flag unsupported assertions.
- **Counterarguments**: Does the post address obvious objections? Strong posts in this blog acknowledge tension rather than arguing past it.
- **Essentiality**: Does every section serve the argument? Flag paragraphs that could be cut without losing anything.
- **Citations**: Are external claims linked? Do links use `{:target="_blank"}` format?

### 2. Flow

Evaluate how the post moves the reader through its ideas.

**Check for:**
- **Opening**: Does it ground the reader in something concrete and specific? This blog never opens with abstractions or thesis statements. It opens with situations - a client email, a tennis club, a debugging session.
- **Arc**: Does the post follow a natural progression? Typical pattern: concrete situation -> development and analysis -> complication or counterargument -> implications -> open close. Not every post follows this exactly, but there should be a discernible shape.
- **Transitions**: Are section breaks (`---`) placed at genuine tonal or topical shifts? Do bridging sentences connect sections naturally rather than announcing what comes next?
- **Closing**: Does the post end with open tension, a reframing question, or acknowledged uncertainty? This blog almost never wraps things up neatly. Flag tidy conclusions.
- **Pacing**: Is paragraph length varied? Long analytical paragraphs should be balanced by shorter grounding ones. Flag monotonous paragraph lengths.

### 3. Voice

This is the most important dimension. Compare against both CLAUDE.md guidelines and the reference posts you read.

**Sentence rhythm:**
- Clauses should flow together, connected by dashes, commas, "and", "but" - one thought breathing into the next
- Flag staccato fragments used for dramatic effect (e.g., "The idea started small. Our club uses software that's... fine. It works.")
- The fix is usually to reconnect fragments into a single flowing sentence

**Directness:**
- Plain observation over performative cleverness
- Flag constructed-feeling phrases, forced metaphors, or sentences that try too hard to be quotable
- The writing should feel like clear thinking, not crafted prose

**Personal grounding:**
- Specific details anchor analysis: "my lifelong best friend Dan" not "my close friend"
- Personal context should be woven through analytical sections, not separated into "story" and "analysis" blocks
- Flag personal details that are decorative rather than evidential

**Essentiality:**
- Every sentence earns its place. Flag filler, throat-clearing, or repetition
- Flag performative hedging ("No confident predictions here") - if uncertain, simply don't predict

**Tone:**
- Observational, not prescriptive. Flag "you should", "if you're considering", "I recommend"
- The "you" test: "you" for invitation is fine ("hard to explain until you've felt it"); "you" for prescription is not ("you should consider")
- Flag phrases implying prior dishonesty: "the honest answer", "to be frank", "truthfully"
- Flag advice-giving or telling readers what they know/feel

**Emphasis and asides:**
- Italics should be strategic - carrying argumentative weight on key words, not used for general emphasis
- Parentheticals should clarify something real ("outside of family"), not add personality
- Flag decorative italics or personality-driven asides

**Claims:**
- Direct claims without hedging: "The economics are inverting" not "It might be argued that the economics are inverting"
- Flag academic hedging language

### 4. Mechanics

Quick checks for formatting consistency.

- **Quotes**: Straight quotes (`"`) not curly quotes
- **Dashes**: Hyphens with spaces (` - `) not em dashes
- **Citations**: External links use `[text](url){:target="_blank"}`
- **Frontmatter**: Required fields present (`title`, `description`, `pubDate`). `draft: true` if not ready.

---

## Output Format

```markdown
## Review: [Post Title]

### Context
[Thesis, prompt, and arc as described in Step 2]

### Content
[Findings with severity tags]

### Flow
[Findings with severity tags]

### Voice
[Findings with severity tags]

### Mechanics
[Findings with severity tags]

### Summary
[2-3 sentences: overall assessment, most important thing to address, and what's working well]
```

### Finding format

Each finding should follow this pattern:

> **[Severity]** - [What the issue is]
>
> [Quoted text from the post]
>
> [Why it doesn't work, referencing the specific criterion]
>
> [Suggested revision if applicable]
