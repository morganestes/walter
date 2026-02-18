---
name: cook
description: Let me cook. TDD, atomic commits, existing patterns. One reaction at a time. 99.1% pure.
argument-hint: "[task]"
---

# /cook

Let's cook.

---

## Intent

You're building. Not hacking. Not vibing. Building with discipline. TDD where appropriate, atomic commits, existing patterns, incremental progress. 99.1% pure.

---

## Load Skill

Load the `walter` skill first. Then read its `execution`, `decomposition`, and `quality` references. If the task involves frontend, UI, or visual design, also read the `frontend-design` reference.

---

## Start

$ARGUMENTS

If no task was specified, {{ask_instruction}} What are we building? If there's no clear spec or scope, use `/formula` first.

---

## Pre-Flight

Before writing any code:

### 1. Verify Readiness

- [ ] Problem and scope are clear
- [ ] Success criteria are defined
- [ ] Dependencies are identified and satisfied
- [ ] Development environment is ready
- [ ] Governing docs located (check `.walter/` for formulas, preps, or other in-flight work)

If any unclear, use `/formula` first. Don't cook without a formula.

### 2. Research with Sub-Agents

Spawn sub-agents to explore in parallel. Don't waste context on exploration.

**Sub-agent tasks:**
- Find existing code patterns relevant to this task (specify directories and file types to search)
- Identify similar implementations in the codebase (name the feature or behavior to match)
- Review test approaches used elsewhere (point to the test directories and frameworks)
- Check for dependencies or conflicts (list the modules and files being changed)

**Brief each sub-agent with:**
- Specific files or directories to focus on
- What to look for (patterns, naming, structure, not just "find patterns")
- The acceptance criteria for context on what's being built
- Expected output: file paths, code snippets, and a summary of how existing code handles this

**After collection:**
- Spot-check key claims against the actual code. Sub-agents can hallucinate file contents or misidentify patterns.
- Synthesize into implementation approach: what patterns to follow, what test approach to use, what dependencies exist.

### 3. Create Checklist

Convert acceptance criteria into explicit checklist:
- Setup (branch, dependencies, environment)
- Implementation (each criterion as checkbox)
- Testing (new tests, existing tests, coverage)
- Documentation

---

## The Discipline

### Work Incrementally

Build and test in small steps. Commit at logical boundaries:
1. Make changes incrementally, testing as you go
2. Commit when a work item or coherent part of a feature is complete
3. Review your work before committing — use sub-agents for verification when it warrants it
4. Move to next piece

No big bangs. No micro-commits after every small change. An atomic commit is a self-contained piece of work that could be reverted as a whole — sometimes that's a full work item, sometimes it's a meaningful part of one.

### Follow TDD (When Appropriate)

For business logic, algorithms, APIs, service methods:
1. Write failing test
2. Write the best implementation — not just enough to pass
3. Refactor if needed
4. Repeat until the logical unit is complete
5. Review and commit

### Follow Existing Patterns

- Match the codebase naming
- Match the codebase patterns
- Don't introduce new patterns unless necessary

You're contributing to a codebase, not expressing yourself.

### Stay Within Scope

- Implement the acceptance criteria, nothing more
- Don't refactor unrelated code during implementation
- Pragmatic cleanup of code you're touching (DRY, KISS, clear naming) is craft, not creep
- Don't add features beyond what was asked
- "While I'm here..." is how scope creeps

### Commit at Logical Boundaries

- One commit per completed work item or coherent part of a feature — self-contained, revertible as a unit
- Review before committing — verify your work, use sub-agents when the scope warrants it
- Meaningful messages that explain WHY
- No AI co-author attribution

---

## Self-Review

Before calling it done, check your own work:

**Would you approve this PR?**

- [ ] No commented-out code
- [ ] No debug statements
- [ ] Consistent formatting
- [ ] Meaningful variable names
- [ ] DRY principle followed
- [ ] Error handling complete
- [ ] Edge cases handled
- [ ] No hardcoded paths or credentials
- [ ] Tests are meaningful, not coverage gaming

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Code follows existing patterns
- [ ] Self-review complete
- [ ] Documentation updated
- [ ] No critical issues

If you can't check all boxes, you're not done.

---

## Key Questions During Implementation

- Does this follow existing patterns?
- Am I staying within scope?
- Have I tested this change?
- Is this work item complete enough to commit?
- What could go wrong?
- Would I approve this PR?

---

## Anti-Patterns

**Big bang implementation** — Implement everything, then test. No. Work incrementally.

**"I'll add tests later"** — You won't.

**Giant commits** — "Updated stuff" tells nothing. Commit at logical boundaries.

**Scope creep** — "While I'm here..." Stop. That's separate work.

**Refactoring unrelated code during implementation** — But pragmatic cleanup of code you're touching is craft, not creep.

**Coverage gaming** — Tests that exist to hit a number, not to verify behavior.

**Exploring in main context** — Use sub-agents for research. Don't waste tokens.

---

Stay focused. Stay disciplined. Ship clean.
