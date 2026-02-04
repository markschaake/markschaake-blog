# Agentic Development Methodology for Solo Developers

## Draft Outline v1

---

## 1. Introduction

### The Solo Developer's Paradox
- Clients want senior-level judgment AND junior-level throughput
- Traditional answer: hire people, take on overhead, dilute margins
- Agentic answer: multiply execution capacity while retaining judgment authority

### Core Thesis
The methodology optimizes for:
- **Minimizing essential human time** to planning, UX/aesthetics, and verification oversight
- **Maximizing parallel execution** via multiple agents working autonomously
- **Maintaining quality** through automated verification and carefully structured plans

---

## 2. The Three Modes

Development work exists on a spectrum. The methodology names three positions:

### Expedition Mode
**When**: Greenfield projects, major rewrites, new feature areas
**Planning depth**: Deep, upfront, collaborative (human + agent)
**Execution**: Fully autonomous, highly parallel (multiple worktrees)
**Human involvement**: Heavy during planning, hands-off during execution

*The human is the expedition leader, planning the route while the team deploys across the terrain.*

### Excursion Mode
**When**: Significant features, refactors, integrations
**Planning depth**: Moderate, focused on the specific change
**Execution**: Semi-autonomous, moderate parallelism (few worktrees or sequential)
**Human involvement**: Approves plan, monitors execution, may intervene

*Base camp is established. The human sends agents out to explore and develop specific areas.*

### Errand Mode
**When**: Bug fixes, small enhancements, polish work
**Planning depth**: Light or inline (part of the implementation conversation)
**Execution**: Interactive, single agent
**Human involvement**: Conversational, iterative, responsive

*The human and agent handle a quick trip to address something nearby - no elaborate planning needed.*

### Mode Fluidity
Modes are not discrete phases but a spectrum:
- An Expedition effort decomposes into Excursion-sized chunks
- Excursion work spawns Errand-level subtasks
- The developer shifts fluidly based on current scope

---

## 3. Tool Categories

### Planning Tools
**Purpose**: Decompose work into structured, actionable plans

- **Single-plan tools**: Generate one implementation plan from requirements
- **Multi-plan tools**: Decompose large efforts into multiple independent plans
- **Plan splitters**: Analyze dependencies, identify parallelizable work units

**Key capability**: Produce dual-format output (human-readable prose + machine-parseable metadata)

### Orchestration Tools
**Purpose**: Execute multiple plans in parallel

- Worktree management (create, isolate, clean up)
- Agent spawning (one agent per work unit)
- Progress monitoring (which agents are done, which are blocked)
- Merge coordination (bring completed work back to main)

**Key capability**: Hands-off execution once launched

### Implementation Tools
**Purpose**: Execute individual plans or handle incremental work

- Agentic coding assistants (Claude Code, Codex, Cursor, etc.)
- Operate on a single codebase/worktree
- Handle the actual code writing, editing, testing

**Key capability**: Deep context on a specific problem, iterative refinement

### Verification Tools
**Purpose**: Automated quality assurance executed by agents

- Browser testing (Playwright MCP, Claude Chrome plugin)
- Test execution (unit, integration, e2e)
- Type checking, linting, static analysis
- Custom test plans (human-crafted, agent-executed)

**Key capability**: Verify branching logic, error states, edge cases automatically

---

## 4. The Planning Artifact

### Dual Format Structure
Plans serve both human reviewers and agent executors:

```
---
# Machine-parseable frontmatter
id: plan-001
dependencies: []
estimated_files: [src/auth/*, src/api/login.ts]
verification: [test:unit, test:e2e:login]
---

## Overview
[Human-readable description of what this plan accomplishes]

## Implementation Steps
1. [Step with enough detail for an agent to execute]
2. [...]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Verification
- Run: `pnpm test src/auth`
- Browser test: Login flow completes successfully
```

### Plan Decomposition (Expedition Mode)
Large efforts require breaking into multiple plans:
- Each plan is independently executable
- Dependencies are explicit (plan B waits for plan A)
- Plans without dependencies can run in parallel

---

## 5. Quality Assurance

### The Quality Principle
Quality assurance should be:
- **Automated** wherever possible
- **Agent-executable** (the human doesn't run tests manually)
- **Defined during planning** (not an afterthought)

### What Agents Verify
- Functional correctness (tests pass)
- Type safety (no type errors)
- Code quality (linting, formatting)
- Branching logic (all paths tested)
- Error states (failures handled gracefully)

### What Humans Verify
- UX and aesthetics (does it feel right?)
- Business logic alignment (does it solve the actual problem?)
- Architectural judgment (is this the right approach?)

### Test Plans
- Created collaboratively (human + agent during planning)
- Structured for agent execution
- Cover automated and semi-automated scenarios

---

## 6. Workflows by Mode

### Expedition Workflow

```
+-----------------------------------------------------------------+
|  1. PLANNING (Human-heavy)                                      |
|     - Define scope and goals                                    |
|     - Explore codebase (agent-assisted)                         |
|     - Draft architecture/approach                               |
|     - Decompose into parallel work units                        |
|     - Create test plan                                          |
|     - Human reviews and approves all plans                      |
+-----------------------------------------------------------------+
                            |
                            v
+-----------------------------------------------------------------+
|  2. EXECUTION (Autonomous)                                      |
|     - Orchestration creates worktrees                           |
|     - Agents execute plans in parallel                          |
|     - Each agent: implement -> verify -> signal complete        |
|     - Orchestration merges completed work                       |
|     - Human is hands-off (doing other work)                     |
+-----------------------------------------------------------------+
                            |
                            v
+-----------------------------------------------------------------+
|  3. VERIFICATION (Human-light)                                  |
|     - Review merged result                                      |
|     - Spot-check UX and aesthetics                              |
|     - Run acceptance test suite (automated)                     |
|     - Ship or iterate                                           |
+-----------------------------------------------------------------+
```

### Excursion Workflow

```
+-----------------------------------------------------------------+
|  1. PLANNING (Moderate)                                         |
|     - Define the specific change                                |
|     - Explore relevant code (agent-assisted)                    |
|     - Draft plan (single or few work units)                     |
|     - Define verification criteria                              |
|     - Human approves plan                                       |
+-----------------------------------------------------------------+
                            |
                            v
+-----------------------------------------------------------------+
|  2. EXECUTION (Semi-autonomous)                                 |
|     - Agent executes plan                                       |
|     - May use 1-3 parallel worktrees if decomposable            |
|     - Human monitors, may intervene if stuck                    |
+-----------------------------------------------------------------+
                            |
                            v
+-----------------------------------------------------------------+
|  3. VERIFICATION (Standard)                                     |
|     - Agent runs test suite                                     |
|     - Human reviews diff                                        |
|     - Ship or iterate                                           |
+-----------------------------------------------------------------+
```

### Errand Workflow

```
+-----------------------------------------------------------------+
|  ITERATIVE LOOP                                                 |
|     - Human describes change                                    |
|     - Agent proposes approach (inline planning)                 |
|     - Human approves or adjusts                                 |
|     - Agent implements                                          |
|     - Human reviews, iterates as needed                         |
|     - Ship                                                      |
+-----------------------------------------------------------------+
```

---

## 7. Essential Human Activities

The methodology identifies irreducible human responsibilities:

### Always Human
- **Judgment calls**: Architectural decisions, trade-off evaluation
- **Scope definition**: What problem are we actually solving?
- **UX/aesthetic review**: Does this feel right to use?
- **Plan approval**: Is this the right approach?
- **Client communication**: Translating between business and technical

### Delegable to Agents
- Code implementation
- Test execution
- Verification of functional requirements
- Documentation generation
- Dependency updates
- Code formatting and linting

### Collaborative (Human + Agent)
- Plan creation (human guides, agent drafts)
- Codebase exploration (agent searches, human directs)
- Test plan design (human defines scenarios, agent structures)
- Debugging (agent investigates, human decides)

---

## 8. Getting Started

### Minimal Setup
1. Agentic coding tool (Claude Code or equivalent)
2. Git with worktree support
3. Automated test infrastructure (unit + e2e)

### Scaled Setup (for Expedition mode)
1. Multi-plan decomposition tooling
2. Orchestration layer (worktree + agent management)
3. Progress dashboard (optional but helpful)
4. Browser testing integration (Playwright or equivalent)

---

## Open Questions for Further Development

- [ ] How to handle failures mid-execution in parallel mode?
- [ ] What's the right plan granularity for parallelization?
- [ ] How to communicate progress to clients during autonomous execution?
- [ ] Integration with existing PM tools (Linear, GitHub Issues, etc.)?
- [ ] How to estimate effort/pricing when execution is agent-driven?
