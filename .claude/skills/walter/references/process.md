# Process

Intuition over ceremony.

---

## The Goal

Principal engineers and architects don't follow process rigidly — they've internalized why process exists and adapt naturally. This is that intuition.

**Core insight:** Process is structured thinking, not paperwork. The ceremony exists to force the thinking. If you can do the thinking without the ceremony, do that. If you need the ceremony to ensure the thinking happens, use it.

---

## Phase Awareness

Know where you are:

| Phase | What Matters | Done When |
| ------- | -------------- | ----------- |
| **Understanding** | Why this exists, what problem | Can explain it to someone else |
| **Scoping** | What's in, what's out, what's success | Boundaries are explicit |
| **Breaking down** | Pieces small enough to hold | Each piece has clear "done" |
| **Building** | One piece at a time, tested | Acceptance criteria met |
| **Verifying** | Does it actually work? Intent met? | Would you ship this? |

Don't skip phases. Don't blend them. Know which one you're in.

---

## Decomposition Sense

Big things break into smaller things. Keep breaking until pieces are **holdable** — you can keep the whole thing in your head.

**The natural hierarchy:**
- **Outcome** — what value are we delivering?
- **Phases** — what coherent chunks get us there?
- **Features** — what capabilities deliver each phase?
- **Work Items** — what specific pieces build each feature?

Stop decomposing when:
- You can explain what "done" looks like
- You know the approach (not every detail, but the shape)
- You can verify it independently

Too much complexity at one level (>8 points) = needs splitting. Complexity, not count.

---

## Scope Readiness

Before decomposing, verify the scope is actually ready. Don't proceed until you can answer all five:

1. **Is the problem clear?** (can you explain why this matters?)
2. **Are boundaries explicit?** (what's in, what's out?)
3. **Are success criteria testable?** (could someone else verify them?)
4. **Are constraints known?** (what must always/never be true?)
5. **Is there commitment?** (are we past exploration?)

If you can't answer these, stop. Go back to planning.

**Signs scope isn't ready:**
- "What exactly are we building?" keeps changing
- Success criteria are vague ("it should be good")
- Every conversation reveals new requirements
- You're not sure what's in vs. out

---

## Work Readiness

A piece of work is ready to build when you can answer all five. Not most. All.

1. **What does done look like?** (specific, testable)
2. **What's the approach?** (not every line, but the shape)
3. **What patterns exist?** (similar code in the codebase)
4. **How will you verify it?** (tests, checks, criteria)
5. **What must exist first?** (dependencies)

If you can't answer these, stop. Do more thinking or run a spike.

**Signs work isn't ready:**
- Acceptance criteria are missing or vague
- You don't know where to start
- Dependencies are unclear
- Similar patterns don't exist and approach is uncertain

---

## Document to Think

Writing isn't ceremony — it's thinking made visible.

**Write things down when:**
- Scope needs to be clear (brief, plan, boundaries)
- A decision has lasting impact (decision record)
- You're handing off to future-you or someone else (context)
- You need to track what's done vs remaining (checklist, status)

**Don't write things down when:**
- It's obvious and won't be forgotten
- The code is the documentation
- It would be stale before anyone reads it

Right-size the documentation to the project. Weekend hack needs a README. Multi-phase initiative needs scope docs and decision records.

---

## Artifacts

Real software has artifacts — things that capture scope, track work, record decisions. The names and tools vary (JIRA, Linear, Notion, markdown, mental models) but the concepts are universal.

### The Concepts

**Scope capture** — Something that says what we're building and what we're not. Could be a brief, an epic description, a README section, or a conversation summary. Exists so everyone agrees on boundaries.

**Work tracking** — Something that says what needs doing and what's done. Could be tickets, issues, a checklist, or a kanban board. Exists so work doesn't get lost and progress is visible.

**Decision records** — Something that captures why we chose this approach. Could be an ADR, a Confluence page, a PR description, or comments in code. Exists so future contributors understand and don't re-litigate.

**Requirements** — Testable commitments. Could be acceptance criteria, a spec, or just "it should do X." Exists so you know when you're done.

**Invariants** — Rules that must always hold. Could be documented constraints, validation rules, or tribal knowledge. Exists so critical things don't break.

**Spikes** — Timeboxed research. Could be a ticket, a task, or just "spend 2 hours figuring out X." Exists so uncertainty gets bounded investigation.

**Context/Handoff** — Something that captures where we are and what's next. Could be a status update, a session log, or notes in the ticket. Exists so work can continue across people or time.

### Adapt to Your Workflow

| If You Use | Scope Lives In | Work Lives In | Decisions Live In |
| ------------ | ---------------- | --------------- | ------------------- |
| JIRA/Linear | Epic/Project | Stories/Issues | Comments or linked docs |
| GitHub | README or Issue | Issues/PRs | PR descriptions, ADRs |
| Notion/Docs | Planning doc | Task database | Decision log |
| Markdown | Brief file | Checklist or work items | Decision files |
| Mental model | Your head | Your head | Your memory (risky) |

The tool doesn't matter. The concepts do. Whatever captures scope, tracks work, and records decisions — use that.

### Principles

**Match ceremony to stakes** — A weekend project needs a mental model. A team initiative needs written scope. An enterprise system needs formal specs. Don't over-engineer, don't under-engineer.

**Capture what would be lost** — If you'd forget it, write it down. If it's obvious, don't.

**Keep it current or kill it** — Stale artifacts mislead. Update them or delete them.

---

## Criteria Terminology

These terms look similar but live at different levels:

- **Success criteria** — what "solved" looks like. Defined during planning. Answers: did we solve the problem?
- **Exit criteria** — what "complete" looks like for a phase. Defined during decomposition. Answers: can we move on?
- **Acceptance criteria** — what "done" looks like for a work item. Defined during breakdown. Answers: does this specific piece work?

All three must be specific, measurable, and verifiable. The difference is scope — problem level, phase level, work item level.

---

## Spike Discipline

Uncertainty gets timeboxed research, not open-ended exploration.

**A spike needs:**
- A specific question to answer
- A timebox (15min to 4hr — longer means it's feature work)
- A decision it will inform

**Execute spikes:**
- Stop when timebox expires
- Make a recommendation, don't just present options
- If inconclusive, either extend timebox (with justification) or make best-guess decision

Research without a decision to inform is waste.

---

## Pivot Recognition

When learning changes the approach:

1. **Name it** — "This is a pivot, not a tweak"
2. **Capture why** — What did we learn? What assumption was wrong?
3. **Assess impact** — What's affected? What's still valid?
4. **Adapt deliberately** — Update affected work, resequence if needed
5. **Continue** — Don't relitigate. Execute the new approach.

Silent pivots create confusion. Deliberate pivots create clarity.

---

## Natural Checkpoints

Stop and check alignment at every phase boundary. Don't skip these.

- **Before breaking down** — Is the scope actually clear?
- **Before building** — Is this piece actually ready?
- **After building** — Does this actually meet the criteria?
- **Before moving on** — Is this phase actually complete?

These aren't gates with heavy approval workflows — but they're not optional either. Pause, verify, then proceed.

---

## Right-Sizing

Match rigor to stakes:

| Project Type | Planning | Docs | Tracking |
| -------------- | ---------- | ------ | ---------- |
| Quick fix | Implicit | None or commit msg | None |
| Small feature | Brief conversation | Maybe a checklist | Informal |
| Significant feature | Explicit scope + criteria | Scope doc, decisions | Work items |
| Multi-phase initiative | Full planning | Scope, specs, decisions | Phases, features, work |

Over-engineering process is as bad as under-engineering it.

**The thinking is universal.** Same questions at every level:
- What problem are we solving?
- What's the domain? (entities, relationships, rules)
- What must be true when we're done?
- What's the approach?
- What could go wrong?

A quick fix answers these implicitly. A multi-phase initiative answers them in documents. The thinking doesn't change — what you make explicit does.

**Start anywhere, adjust as needed.** Realize it's more complex? Add documentation. Realize it's simpler? Skip the ceremony. Context getting lost? Persist what matters. The thinking you've done is never wasted.

---

## Anti-Patterns

**Ceremony without thinking** — Following steps without understanding why.

**Skipping phases** — Jumping to building before scoping is clear.

**Blending phases** — Trying to scope and build simultaneously.

**Open-ended research** — Investigation without timebox or decision to inform.

**Silent pivots** — Changing approach without acknowledging it.

**Over-documenting** — Writing things no one will read.

**Under-documenting** — Losing important context because "it's obvious."

**Rigid process for small work** — Full ceremony for a bug fix.

**No process for big work** — Winging a multi-phase initiative.
