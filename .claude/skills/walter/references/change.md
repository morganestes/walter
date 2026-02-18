# Change

Handle pivots and scope changes with discipline.

---

## The Goal

Changes to locked work require explicit acknowledgment. Create audit trails. Document the why. Future contributors must understand why things are the way they are.

---

## Core Principles

### Changes Require Explicit Acknowledgment
Changes to committed scope, requirements, or decisions require explicit review. This creates audit trails and prevents scope creep.

### Document the Why
Decisions and changes require rationale. Future contributors must understand why. This prevents re-litigation of settled decisions.

### One Change Per Request
Each change addresses a single logical change. Multiple related changes must be separate requests that reference each other.

### Pivots Are Learning Opportunities
Mid-course corrections based on implementation learning aren't failures. Execute decisively once the need is clear.

---

## Change Requests

**When to create a CR:**
- Add, modify, or remove requirements
- Change scope boundaries
- Alter functional flows or technical designs
- Restructure milestones or resequence work
- Modify acceptance criteria
- Update quality targets or constraints

**When NOT to create a CR:**
- Routine implementation within approved scope
- Bug fixes that don't change requirements
- Documentation clarifications
- Adding test cases within existing criteria
- Code refactoring that doesn't change interfaces

### CR Contents

- **Summary** — What's changing and why
- **Motivation** — What triggered the need
- **Current state** — What exists now (specific quotes/references)
- **Proposed change** — Exactly what should change
- **Impact analysis** — Schedule, technical, risk
- **Alternatives considered** — What else was evaluated

### CR Lifecycle

```
Draft → Approved → Implemented
      ↘ Rejected
```

CRs are immutable after decision. Only status and "Applied Changes" sections update.

---

## Decisions

Capture architectural and design choices with lasting project impact.

**When to capture:**
- Choosing between competing technical approaches
- Making architectural trade-offs
- Selecting frameworks, libraries, or services
- Defining data models or API contracts
- Setting quality attributes or performance targets
- Reversing or superseding a previous decision

**When NOT to capture:**
- Routine implementation choices within established patterns
- Bug fixes that don't change architecture
- Formatting or style choices
- Temporary workarounds

### Decision Contents

- **Context** — What situation prompted this
- **Options considered** — With pros/cons of each
- **Decision** — What was chosen
- **Rationale** — Why this option
- **Consequences** — Implications, follow-up, risks

### Quick Check

Before moving on:
- Will this affect future development?
- Were there meaningful alternatives?
- Would a new contributor need to understand this?
- Could this be questioned later?

If yes to any, stop and capture the decision.

---

## Invariants

Rules that must ALWAYS hold true. Violations are never acceptable.

**Characteristics:**
- Use "must never" or "must always" language
- Violation causes serious problems (data loss, security, system failure)
- Can be enforced (database constraint, validation, test)

**Examples:**
- "Balance must NEVER be negative"
- "IDs must NEVER change once assigned"
- "API response must NEVER exceed 30 seconds"

**Not invariants:**
- "Usually true" or "should be true" — those are guidelines
- Performance targets — those are requirements
- Preferences — those are decisions

---

## Pivots

Significant mid-work change in approach based on learning. Don't resist it — execute it cleanly.

**Triggers:**
- Spike reveals fundamentally different approach
- Implementation uncovers architectural flaws
- External dependencies force changes
- Performance testing shows approach won't scale
- Security review mandates changes

### Pivot Process

1. **Document the trigger** — what caused the change?
2. **Capture decision** formally
3. **Assess current state** — categorize work by status
4. **Identify what's changing** (old approach → new approach)
5. **Analyze impact** on each piece (High/Medium/Low/None)
6. **Update affected work** with pivot notes
7. **Resequence** implementation
8. **Update documentation**

---

## Right-Sizing Change Process

Not every change needs a formal CR. Match ceremony to stakes.

| Project Type | Change Process |
| -------------- | ---------------- |
| Solo/small | Just do it, note in commit or CLAUDE.md |
| Team | Comment on scope doc/issue, get thumbs up |
| Formal | Change request with impact analysis and approval |
| Regulated | Full CR workflow with audit trail |

The full CR process above is the rigorous version. Scale down for smaller work — but always capture what changed, why, and what's impacted. Even a commit message counts.

### Handling Scope Creep

When new scope appears disguised as a clarification:

1. **Name it** — "This is new scope, not a clarification"
2. **Assess impact** — What does this cost? What gets cut?
3. **Decide explicitly** — Add it, defer it, or reject it
4. **Document** — Why we decided what we decided

### Superseding Decisions

When a previous decision needs to change:

- Don't delete old decisions — they're history
- Mark as superseded, reference the new decision
- Capture why the change was needed

---

## Anti-Patterns

**Bundling changes**
One CR per logical change. Don't combine unrelated changes.

**After-the-fact CRs**
Don't create CRs after implementing. Review happens before change, not after.

**Scope creep via "while we're at it"**
Each change stands on its own merit. No bundling.

**Silent pivots**
Don't change approach without documenting why. Future contributors won't understand.

**Soft invariants**
"Balance should usually be positive" — either it's absolute or it's not an invariant.

**Recording routine decisions**
Not every coding choice needs a decision entry. Focus on lasting architectural impact.

---

## Key Questions

**Before Creating a CR**
- Is this outside current approved scope?
- Does it modify committed scope, requirements, or decisions?
- Will it affect other components or teams?
- Could it impact timeline or resources?

**When Capturing a Decision**
- Will this affect future development?
- Were there meaningful alternatives?
- Would a new contributor need to understand this?

**When Capturing an Invariant**
- Is this ABSOLUTE? No exceptions ever?
- What happens if violated? (Must be serious)
- Can this be enforced?

**When Pivoting**
- What triggered this change?
- What were we assuming before?
- What do we know now?
- What's the impact on remaining work?
