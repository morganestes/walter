---
name: formula
description: Define the formula. Scope the problem, challenge assumptions, establish success criteria. No formula, no cook.
argument-hint: "[goal]"
---

# /formula

Define the formula before cooking.

---

## Intent

You're defining what to build before building it. Challenge assumptions, scope properly, establish clear success criteria. No half measures on the thinking.

---

## Load Skill

Load the `walter` skill first. Then read its `planning` and `decomposition` references. If the task involves frontend, UI, or visual design, also read the `frontend-design` reference.

---

## Start

$ARGUMENTS

If no goal was specified, STOP and use the AskUserQuestion tool to ask What are we building? What problem are we trying to solve?

---

## The Process

### 1. Understand the Problem

Don't accept the first answer. Dig deeper.

**Ask:**
- What problem are we solving?
- How do we know it's a problem? Quantify it.
- What happens if we don't solve it?
- Is this the real problem or a symptom?

If you can't articulate the problem clearly, you're not ready to solve it.

### 2. Understand Context

**Ask:**
- Who needs this?
- Who will maintain it?
- What exists already?
- What constraints are we working within?
- What's the budget (time, money, ongoing maintenance)?

Context shapes everything. A solution for a funded startup differs from a weekend project.

### 3. Research with Sub-Agents

Spawn sub-agents to explore in parallel. Don't waste context on exploration.

**Sub-agent tasks:**
- Survey existing solutions (name the problem space, specify OSS/SaaS/API categories to search)
- Explore the codebase for related patterns (point to directories, name the domain or feature area)
- Identify technical constraints or dependencies (list the systems and boundaries to check)
- Research similar implementations for lessons learned (specify the type of solution to compare)

**Brief each sub-agent with:**
- The problem statement and context so they know what relevance looks like
- Specific areas to search (directories, package registries, documentation sites)
- Expected output: options with trade-offs, not just a list of links. For codebase exploration: file paths, patterns found, and how existing code relates to the problem

**After collection:**
- Verify claims about existing code by spot-checking key files. Sub-agents can misidentify patterns or hallucinate implementations.
- Synthesize into options with trade-offs for the user to evaluate.

### 4. Define Scope

**Explicitly state:**
- What's IN scope
- What's OUT of scope
- What's deferred to future phases

Not defining OUT is how scope creeps in. Be explicit.

### 5. Define Success Criteria

Every criterion must be:
- **Specific** — no vague words
- **Measurable** — can verify completion
- **Achievable** — grounded in reality

Bad: "Performance is acceptable"
Good: "Response time < 200ms p95"

Bad: "Users like it"
Good: "80% task completion rate in usability testing"

### 6. Identify Constraints and Risks

**Constraints:**
- What must always be true? (invariants)
- What's already been decided?
- What do we depend on?

**Risks:**
- What could go wrong?
- What don't we know yet?
- What needs early validation?

### 7. Explore Solutions

Before committing:
- Present options with trade-offs (from sub-agent research)
- Let the user weigh based on their context

Don't lock in solutions too early. Don't fall in love with your first idea.

### 8. Break It Down

If scope is significant, decompose:
- What are the major phases?
- What features deliver those phases?
- What's the critical path?
- What can be parallelized?
- What's risky and needs early validation?

### 9. Get Explicit Approval

Before proceeding:
- Confirm problem definition
- Confirm scope boundaries
- Confirm success criteria
- Confirm approach

Not silence. Not "sounds good." Explicit approval. Changes after this point require explicit acknowledgment.

---

## Challenge Everything

Always challenge:
- Vague requirements ("make it better", "improve performance")
- Missing success criteria (how do we know we're done?)
- Undefined scope (what's NOT included?)
- Solution-first thinking ("build me an API" without why)
- Unrealistic targets (aspirational, not grounded)
- Over-engineering (complexity beyond what's needed)

Your job is to find the holes before they become expensive.

---

## Output

When complete, you should have:
- Clear problem statement (the WHY)
- Explicit scope (in and out)
- Measurable success criteria
- Known constraints and risks
- Agreed approach
- Breakdown (if scope is significant)

This is the formula. Now you can cook.

---

## Persist

This formula exists only in conversation. Before moving to `/prep` or `/cook`, ask: "Where do you want this saved?"

Don't assume. Don't skip. If the user declines, that's their call — but name it: "This will be lost when the session ends or context compacts."

---

## Anti-Patterns

- Skipping problem definition
- Vague success criteria
- Solution-first thinking
- Scope creep by omission
- Unrealistic targets
- Jumping to implementation
- Falling in love with the first idea
- Researching in main context — use sub-agents, don't waste tokens
