---
name: prep
description: Break down the formula. Convert scope into executable work items. Right-sized to the problem.
argument-hint: "[formula]"
---

# /prep

Break down the formula into executable pieces.

---

## Intent

You're converting a defined scope into work that can be executed. Not creating busywork. Not over-engineering the breakdown. Right-sized decomposition that gives `/cook` exactly what it needs.

---

## Load Skill

Load the `walter` skill first. Then read its `decomposition`, `planning`, and `quality` references.

---

## Start

$ARGUMENTS

If no formula was specified, {{ask_instruction}} What scope are we decomposing? Point me to the formula, spec, or scope document. If none exists, use `/formula` first.

---

## Pre-Flight

Before decomposing:

### 1. Verify the Formula

- [ ] Problem is clearly defined
- [ ] Scope boundaries are explicit (in and out)
- [ ] Success criteria are measurable
- [ ] Constraints and risks are identified

If any are missing, stop. Use `/formula` to complete the formula.

### 2. Research with Sub-Agents

Spawn sub-agents to explore in parallel. Don't waste context on exploration.

**Sub-agent tasks:**
- Survey the codebase for existing patterns (specify the feature areas and directories to examine)
- Identify similar features and how they were structured (name the behaviors to match against)
- Find dependencies that will affect sequencing (list the modules and integration points to check)
- Assess technical complexity of key components (point to the specific files or systems)

**Brief each sub-agent with:**
- The scope being decomposed so they understand what's relevant
- Specific directories, modules, or file patterns to search
- Expected output: file paths, structural patterns (how similar features are organized), dependency chains, and complexity flags (what's straightforward vs. what has unknowns)

**After collection:**
- Verify structural claims by spot-checking key files. Sub-agents can misrepresent how features are organized or miss dependencies.
- Use findings to inform the breakdown: which patterns to follow, what dependencies drive sequencing, where complexity lives.

---

## Assess Scale

Not everything needs phases. Right-size the decomposition.

| Scale | Signals | Decomposition |
| ------- | --------- | --------------- |
| **Simple** | Single concern, clear path, <8 points total | Work items only |
| **Moderate** | Multiple concerns, some unknowns, 8-20 points | Features → Work items |
| **Complex** | Multiple phases, significant unknowns, 20+ points | Phases → Features → Work items |

**Ask:**
- How many distinct outcomes are we delivering?
- Are there natural phase boundaries (foundation → core → polish)?
- Can one person hold the whole thing in their head?

If in doubt, start with features. Add phases only if needed.

---

## The Process

### 1. Identify Outcomes

What distinct capabilities or results does this formula deliver?

Each outcome becomes a **feature** (or phase, if large enough).

**For each outcome:**
- What value does it deliver when complete?
- What's in scope? What's explicitly out?
- How do we verify it's done?

### 2. Create Phases (If Needed)

Only for complex work with natural boundaries.

**A phase needs:**
- Clear exit criteria (not dates)
- Multiple features that together achieve the phase
- Dependencies on prior phases (or none for phase 1)

**Common phase patterns:**
- Foundation → Core → Polish
- Infrastructure → Features → Integration
- MVP → Enhancement → Scale

### 3. Create Features

Group related work into outcome-oriented slices.

**A feature needs:**
- **Outcome**: What value this delivers when complete
- **Scope**: What's in, what's explicitly out
- **Acceptance criteria**: Beyond individual work items, what must be true?
- **Complexity estimate**: Points (1-8 per feature level)

### 4. Create Work Items

Break features into executable pieces.

**A work item needs:**
- **Acceptance criteria**: Specific, testable conditions
- **Implementation guidance**: Approach, patterns to follow, code examples
- **Test approach**: How to verify (unit, integration, manual)
- **Complexity**: Points (1, 2, 3, 5, 8 — split anything larger)
- **Dependencies**: What must exist first

**Quality check each work item:**
- [ ] Can I explain what "done" looks like?
- [ ] Do I know the approach (not every line, but the shape)?
- [ ] Are there existing patterns to follow?
- [ ] Do I know how to verify it?

If you can't answer these, the work item isn't ready.

### 5. Handle Unknowns

When you hit uncertainty:

**Create a spike** (timeboxed research):
- Specific question to answer
- Timebox (15min to 4hr max)
- Decision it will inform

Spikes go first in the sequence. Don't build on assumptions.

### 6. Sequence the Work

Order matters. Wrong sequence creates blockers and wasted work.

**Principles:**
1. **Think in layers** — Environment → structure → implementation → refinement. Each layer creates the conditions for the next to be verifiable.
2. **Dependencies first** — What unblocks the most?
3. **Risk early** — Uncertain things while there's time to adapt
4. **Value early** — Deliver usable increments when possible
5. **Learn early** — Spikes before building on assumptions

**Watch for:**
- Circular dependencies (break the cycle)
- Long sequential chains (parallelize where possible)
- All risk at the end (front-load uncertainty)

### 7. Refine

Multiple passes catch different issues:

| Pass | Focus | Catches |
| ------ | ------- | --------- |
| **Architecture** | Technical consistency | Conflicts, duplicates, missing components |
| **Capability** | Completeness | Missing criteria, error handling, edge cases |
| **Dependency** | References | Broken links, circular deps, blocking order |
| **Clarity** | Understanding | Vague language, assumed knowledge |

### 8. Get Explicit Approval

Before proceeding to `/cook`:
- Confirm the breakdown captures all success criteria
- Confirm sequencing makes sense
- Confirm complexity estimates are realistic
- Confirm nothing critical is missing

Not "looks good." Explicit approval. This is the work plan.

---

## Output

When complete, you should have:

**For each phase** (if applicable):
- Exit criteria
- Features included
- Dependencies

**For each feature**:
- Outcome statement
- Scope (in/out)
- Acceptance criteria
- Work items

**For each work item**:
- Acceptance criteria
- Implementation guidance
- Test approach
- Complexity points
- Dependencies
- Sequence position

**Spikes** (if any):
- Question to answer
- Timebox
- Decision it informs
- Position in sequence (usually first)

This is the breakdown. Now `/cook` has what it needs.

---

## Where to Capture

Match ceremony to stakes — but always ask the user where they want the plan stored. Don't default to global config space or system plan files. The user's project, the user's call.

| Project Size | Capture Method |
| -------------- | ---------------- |
| Quick feature | Mental model or checklist in chat |
| Moderate feature | Work items in {{config_file}} or task list |
| Significant initiative | Scope doc with phases/features/work items |
| Multi-phase project | Dedicated planning docs |

Before writing anything to disk, ask: "Where do you want this?" Don't over-document. Don't under-document. Don't assume.

---

## Persist

This breakdown exists only in conversation until saved. Before moving to `/cook`, ask where to persist it. The breakdown is what `/cook` executes against and what `/purity` verifies against — if it's not saved, downstream commands have nothing to reference.

---

## Anti-Patterns

**Decomposing without a formula** — If scope isn't clear, you're not decomposing, you're guessing. Use `/formula` first.

**Creating all detail upfront** — Don't decompose phase 3 while you're still in phase 1. Just-in-time detail.

**Calendar dates instead of exit criteria** — "Due Friday" tells nothing. "All acceptance criteria met" is done.

**Vague acceptance criteria** — "Auth works" vs "User can log in with email/password, invalid credentials return 401"

**8+ point work items** — Too big to hold in your head. Split it.

**No scope boundaries** — Not defining OUT invites creep.

**Skipping spikes** — Building on assumptions is how you pivot late.

**Work items without patterns** — No reference to existing code = guesswork during implementation.

**Over-decomposing simple work** — A bug fix doesn't need phases and features. Right-size it.
