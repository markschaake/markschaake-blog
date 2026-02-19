---
description: Critical review of a blog post for content, flow, and voice
argument-hint: "[post-slug-or-path]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep
---

# Review Blog Post

Perform a critical review of a blog post evaluating content, flow, and voice against the standards in `voice.md`, `CLAUDE.md`, and the patterns established across published posts.

## Arguments

- `$1` - Post slug (e.g., `the-layer-above`) or file path. If omitted, review the most recently modified post in `src/content/posts/`.

## Workflow

### Step 1: Gather materials

1. **Read the target post** fully
2. **Read `voice.md`** (project root) - this is the single source of truth for voice, tone, punctuation, formatting, and style
3. **Read CLAUDE.md** - specifically the Writing Style section and any project-specific conventions
4. **Read 2-3 most recent published posts** (non-draft, by `pubDate` descending) for voice calibration. These are your reference for what "on-voice" sounds like in practice.

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
- **Citations**: Are external claims linked? Do links open in new tabs? (See `voice.md` for format.)

### 2. Flow

Evaluate how the post moves the reader through its ideas.

**Check for:**
- **Opening**: Does it ground the reader in something concrete and specific? This blog never opens with abstractions or thesis statements. It opens with situations - a client email, a tennis club, a debugging session.
- **Arc**: Does the post follow a natural progression? Typical pattern: concrete situation -> development and analysis -> complication or counterargument -> implications -> open close. Not every post follows this exactly, but there should be a discernible shape.
- **Transitions**: Are section breaks (`---`) placed at genuine tonal or topical shifts? Do bridging sentences connect sections naturally rather than announcing what comes next?
- **Closing**: See `voice.md` for closing style. Flag tidy conclusions, ceremonial callbacks to the opening, or unnecessary wrap-up paragraphs.
- **Pacing**: Is paragraph length varied? Long analytical paragraphs should be balanced by shorter grounding ones. Flag monotonous paragraph lengths.

### 3. Voice

This is the most important dimension. **`voice.md` is the authoritative reference** - read it fully before evaluating. Compare against both `voice.md` guidelines and the reference posts you read.

Flag any violations of `voice.md` rules, including but not limited to: sentence rhythm, directness, personal grounding, tone, phrases to avoid, emphasis/formatting, and claims. When flagging, reference the specific `voice.md` section being violated.

### 4. Mechanics

Quick checks for formatting consistency per `voice.md`:

- **Punctuation**: Per `voice.md` Punctuation section
- **Citations**: Per `voice.md` Citations section
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
