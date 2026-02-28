# Planning

Think before you build. Every time.

---

## The Goal

Planning is thinking, not paperwork. Understand deeply before building. A plan isn't done until a new contributor can explain:
- Why this work exists
- What problem it solves
- What's in scope vs out of scope
- What constraints exist
- What success looks like

---

## The Planning Hierarchy

1. **Problem definition** — Why does this matter?
2. **Scope and boundaries** — What's in, what's out?
3. **Success criteria** — How do we know we're done?
4. **Constraints** — What must always be true?
5. **Risks** — What could go wrong?

Everything flows from problem definition. Skip it and the rest falls apart.

---

## Phase 1: Understand Context

Gather this before defining anything. Don't skip it.

**User context**
- Technical competency — can they maintain code themselves?
- Build vs buy preference — own it or use services?
- Budget constraints — time, money, ongoing maintenance?

**Technical context**
- Existing infrastructure — what's already in place?
- Quality tooling — linters, type checkers, formatters, pre-commit hooks, CI pipelines?
- Team capabilities — who will maintain this?
- Current pain — what's broken or missing?

---

## Phase 2: Define the Problem

Do this through conversation. Keep pushing until you have real answers.

1. **Understand deeply** — keep asking why
2. **Quantify impact** — "X% of time spent on Y"
3. **Challenge assumptions** — what's really needed?
4. **Identify the real problem** — not just symptoms

### Key Questions

- What problem are we solving?
- How do we know it's a problem? (quantify)
- What happens if we don't solve it?
- Is this the real problem or a symptom?

---

## Phase 3: Define Scope

**In scope** — explicitly state what's included
**Out of scope** — explicitly state what's excluded
**Future phases** — where nice-to-haves go

Not defining what's OUT invites creep.

### Key Questions

- What must be IN scope for this to be useful?
- What's explicitly OUT?
- What's deferred to future phases?
- Where are the boundaries?

---

## Phase 4: Define Success

Every criterion must be:
- **Specific** — no vague words
- **Measurable** — can verify completion
- **Achievable** — grounded in reality

Bad: "Performance is acceptable"
Good: "Response time < 200ms p95"

### Key Questions

- How will we measure success?
- What's the minimum viable outcome?
- What would exceed expectations?
- When do we call it done?

### Extracting Requirements

Success criteria are the starting point. Requirements extraction is the discipline of turning them into testable commitments.

**The thinking:**
- Each requirement should be **independent** — testable on its own
- Each requirement should be **verifiable** — you can prove it's met
- Each requirement should be **traceable** — links back to the problem it solves

**At any scale:**

| Scale | What It Looks Like |
| ------- | ------------------- |
| Weekend | Mental checklist: "It needs to do X, Y, Z" |
| Feature | Bullet points: specific behaviors to verify |
| Project | Requirements list: numbered, testable, traced to scope |
| Enterprise | Formal requirements: IDs, categories, acceptance tests |

**Follow this process (scale up or down as needed):**
1. Look at scope — what did we agree to build?
2. Pull out testable statements — "User can X", "System does Y"
3. Check independence — can each be verified separately?
4. Check coverage — does this cover the scope? Anything missing?
5. Check for hidden requirements — error handling, edge cases, performance

**Stop when:**
- Someone else could verify each requirement
- Requirements cover the scope (no gaps)
- Requirements don't overlap (no duplicates)
- Each traces back to why it matters

Don't over-formalize for small work. But do the *thinking* every time — even for a weekend project. "What specifically must be true when this is done?"

---

## Phase 5: Identify Constraints

**Invariants** — rules that must ALWAYS hold, no exceptions
- Use "must never" or "must always" language
- Violation causes serious harm (data loss, security breach, system failure)
- Must be enforceable (validation, constraint, test)
- Examples: "Balance must NEVER be negative", "Auth tokens must ALWAYS be encrypted"

**Decisions** — choices already made
**Dependencies** — what must exist first
**Risks** — what could go wrong

### Key Questions

- What must ALWAYS be true? What must NEVER happen?
- What's already been decided?
- What do we depend on?
- What could go wrong?

### Handling Risks

Identifying risks isn't enough. Assign a strategy to every one:

| Strategy | When to Use | Example |
| ---------- | ------------- | --------- |
| **Mitigate** | Risk is likely and impact is high | Add validation to prevent bad data |
| **Accept** | Risk is low or cost to address exceeds impact | Edge case that's unlikely and recoverable |
| **Avoid** | Risk can be eliminated by changing approach | Choose proven library over custom implementation |
| **Transfer** | Someone else is better positioned to handle | Use managed service instead of self-hosting |

**For each significant risk:**
- What's the likelihood? (Low/Medium/High)
- What's the impact if it happens?
- What's the strategy? (Mitigate/Accept/Avoid/Transfer)
- If mitigating, what's the action?

**Front-load risky work.** If something might change the whole approach, learn that early while there's time to adapt.

---

## Phase 6: Explore Solutions

Do all of this before committing to an approach. Don't skip to a solution.

1. **Research what exists** — OSS, SaaS, APIs
2. **Understand priorities** — timeline, budget, risk tolerance
3. **Present options with trade-offs** — not recommendations
4. **Let the user weigh** — they have context you don't

---

## Phase 7: Get Explicit Approval

Don't proceed without it.

- Not silence or implicit agreement — get a clear yes
- Confirm the plan is ready before building anything
- Changes after this point require explicit acknowledgment. No exceptions.

---

## The Commitment Point

Planning ends. Building begins. Know when you've crossed the line.

**Before commitment:** Everything is fluid. Scope can shift. Requirements can change. You're still figuring it out.

**After commitment:** Changes are explicit. Scope shifts require acknowledgment. You're executing against an agreed target.

**The moment:**
- "We've agreed on what we're building"
- "This is the scope, these are the requirements"
- "Changes from here are changes, not clarifications"

**At any scale:**

| Scale | What Commitment Looks Like |
| ------- | --------------------------- |
| Weekend | Mental note: "Okay, I know what I'm building" |
| Feature | Verbal agreement: "This is the scope, let's build it" |
| Project | Written scope: documented, shared, acknowledged |
| Enterprise | Formal baseline: locked, versioned, change-controlled |

**Why it matters:**
- Without a commitment point, scope creep is invisible
- "Just one more thing" compounds until you're building something else
- Changes aren't bad — *unacknowledged* changes are bad

**Signs you've crossed it:**
- You've stopped asking "what should this do?" and started asking "how do I build this?"
- Adding something feels like a change, not a clarification
- You could explain the scope to someone and they could verify against it

**After the commitment point:**
- New ideas go to "future" or require explicit scope change
- Clarifications are fine; expansions are acknowledged
- The scope document (or mental model) is the source of truth

Don't over-formalize for small work. But recognize the *moment* every time — even solo, know when you've stopped exploring and started building.

---

## Anti-Patterns

**Skipping problem definition**
Lighter process doesn't mean lighter thinking. Don't skip why.

**Vague success criteria**
"It works" means nothing. Define measurable completion.

**Solution-first thinking**
"Build an API" before understanding why an API is needed.

**Over-specification**
Defining implementation details when only behavior matters.

**Scope creep by omission**
Not defining what's OUT invites everything IN.

**Unrealistic targets**
Aspirational numbers not grounded in reality or measurement.

**Jumping to milestones**
Planning delivery before the problem is understood.

---

## Quality Checks

Run these before leaving planning. Don't skip any section.

**Scope**
- [ ] In-scope items explicitly stated
- [ ] Out-of-scope items explicitly stated
- [ ] Future phases documented separately

**Success Criteria**
- [ ] Every criterion is measurable
- [ ] Targets are achievable, not aspirational
- [ ] Criteria map to the problem being solved

**Feasibility**
- [ ] Technical approach is realistic
- [ ] Resource needs are understood
- [ ] Constraints are documented
- [ ] Risks are identified with mitigations

**Clarity**
- [ ] No vague words like "manages", "handles", "processes"
- [ ] Responsibilities are explicit
- [ ] Boundaries are clear
- [ ] Dependencies are documented
