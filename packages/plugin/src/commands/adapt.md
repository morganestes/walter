---
name: adapt
description: Adapt the formula. Handle scope changes, pivots, and new requirements. Controlled reactions, not explosions.
argument-hint: "[change]"
---

# /adapt

Adapt to change.

---

## Intent

Plans change. Requirements shift. You learned something that changes everything. Handle it properly — document the why, get explicit approval, execute decisively.

---

## Load Skill

Load the `walter` skill first. Then read its `change`, `planning`, `decomposition`, and `quality` references.

---

## Start

$ARGUMENTS

If no change was specified, {{ask_instruction}} What changed? Describe what's different from the original plan or what new requirement came up.

---

## Assess with Sub-Agents

Spawn sub-agents to analyze impact in parallel. Don't waste context on assessment.

**Sub-agent tasks:**
- Identify all affected components and files (specify the change and the areas likely impacted)
- Check for dependencies that need updating (name the modules, imports, and integration points to trace)
- Review tests that may need changes (point to test directories and describe what behavior is changing)
- Document current state before changes (list the specific files and their current role)

**Brief each sub-agent with:**
- What's changing and why, so they can assess relevance
- The specific codebase areas to examine (directories, modules, file patterns)
- Expected output: affected files with classification (High/Medium/Low/None impact), what specifically needs to change in each, and any risks or dependencies discovered

**After collection:**
- Verify impact classifications against the actual code. Sub-agents can overestimate impact on loosely related code or miss tightly coupled dependencies.
- Synthesize into an impact assessment for the user to review before approving the change.

---

## Types of Change

### Scope Change

Something needs to be added, modified, or removed from the plan.

**Requires explicit approval when:**
- Adding/removing requirements
- Changing scope boundaries
- Altering designs or flows
- Modifying acceptance criteria
- Restructuring delivery

**Doesn't require approval:**
- Routine implementation within scope
- Bug fixes that don't change requirements
- Documentation clarifications
- Adding tests within existing criteria

### Decision

An architectural or design choice with lasting impact.

**Worth capturing when:**
- Choosing between technical approaches
- Making architectural trade-offs
- Selecting technologies or services
- Defining data models or APIs
- Reversing previous decisions

**Not worth capturing:**
- Routine implementation choices
- Obvious patterns
- Temporary fixes (though note them)

### Pivot

Significant mid-work change in approach based on learning.

**Triggers:**
- Research reveals a fundamentally different approach
- Implementation uncovers architectural flaws
- External factors force changes
- Performance/security requirements mandate changes

Pivots aren't failures. They're learning. Execute them decisively.

---

## Scope Change Workflow

### 1. Assess Necessity

- Is this outside current approved scope?
- Does it modify baselined work?
- Will it affect other components?
- Could it impact timeline/resources?

If no to all, probably don't need formal change.

### 2. Document the Change

- **What's changing** and why
- **Current state** (specific references)
- **Proposed change** (exactly what should change)
- **Impact** (schedule, technical, risk)
- **Alternatives** considered

### 3. Get Explicit Approval

Not silence. Not "sounds good." Explicit approval.

### 4. Implement and Track

After approval:
- Apply changes as specified
- Track what was updated
- Document completion

---

## Decision Workflow

### 1. Verify It's Worth Capturing

- Will this affect future development?
- Were there meaningful alternatives?
- Would a new contributor need to understand this?

If yes to any, capture it.

### 2. Document the Decision

- **Context** — what prompted this
- **Options** — with pros/cons
- **Decision** — what was chosen
- **Rationale** — why
- **Consequences** — what follows

### 3. Cross-Reference

Update affected work to reference the decision.

---

## Pivot Workflow

### 1. Document the Trigger

- What caused the pivot?
- What did we learn?
- What assumptions were wrong?

### 2. Capture the Decision

Formally document why the pivot is happening.

### 3. Assess Impact

For each piece of work:
- **High impact** — fundamental changes needed
- **Medium impact** — significant adjustments
- **Low impact** — minor tweaks
- **None** — unaffected

### 4. Update Affected Work

- Rewrite high-impact pieces
- Adjust medium-impact pieces
- Add notes explaining what changed and why

### 5. Resequence

- Foundation work first
- High-value early
- Defer uncertain work

### 6. Document

Update all relevant documentation. Future contributors need to understand why things are the way they are.

---

## Key Principles

### One Change Per Request
Each change addresses a single logical change. Related changes should be separate.

### Document the Why
Future contributors need to understand why things are the way they are. "We changed it" is not enough.

### Pivots Are Learning
Mid-course corrections aren't failures. They're responding to reality. Execute them decisively once the need is clear.

### No Silent Changes
Changing approach without documenting why leaves future contributors confused. Or you, in six months.

---

## Persist

Scope changes, decisions, and pivot rationale exist only in conversation until saved. Default to `.walter/` if the user doesn't specify a location, but change records often warrant permanent storage — offer the choice. They're how future contributors understand why things are the way they are. Don't move on without persisting.

---

## Key Questions

**For Scope Changes**
- Is this outside current scope?
- What's the impact?
- What alternatives exist?
- Who needs to approve?

**For Decisions**
- Will this affect future work?
- Were there meaningful alternatives?
- Would a new contributor need this?

**For Pivots**
- What triggered this?
- What do we know now that we didn't before?
- What's the impact on remaining work?
- Are we pivoting or just panicking?

---

## Anti-Patterns

**Bundling changes** — One change per request. Don't combine.

**After-the-fact approval** — Get approval before implementing.

**"While we're at it"** — Each change should stand on its own merit.

**Silent pivots** — Changing approach without documenting why.

**Panic pivots** — Make sure it's a real learning, not just fear.

**Assessing in main context** — Use sub-agents for impact analysis. Don't waste tokens.

---

Change is inevitable. Handle it with discipline.
