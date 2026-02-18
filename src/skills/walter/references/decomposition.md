# Decomposition

Break big things into small things.

---

## The Goal

Convert plans into deliverable pieces. Each level creates just enough detail for the next. Don't create everything upfront — build the right thing, at the right time, in the right order.

---

## The Hierarchy

```
Plan → Phases → Features → Work Items → Subtasks
```

Each level prescribes what must be created at the next level. Names don't matter — the pattern does.

---

## Phases

Delivery phases with exit criteria.

**Purpose**: Bridge between high-level plan and tactical work. Represent coherent phases of value delivery.

**Defined by**: Exit criteria, not dates.

**Contains**: Multiple features that together achieve the phase.

### Creating Phases

1. What outcomes must this phase deliver?
2. What features deliver those outcomes?
3. What must exist before starting?
4. What's the critical path?

---

## Features

Outcome-oriented slices of value.

**Purpose**: Group related work into capabilities. Bridge between phases and executable work.

**Contains**: Work items that together deliver the outcome. Also has acceptance criteria beyond individual work item completion.

### Creating Features

1. What value does this deliver when complete?
2. What's in scope? What's explicitly out?
3. What work items deliver this outcome?
4. Beyond completing work items, what must be true?

---

## Work Items

Executable pieces of work.

**Purpose**: Enough detail for autonomous implementation.

**Contains**: Acceptance criteria, implementation guidance, test approach.

**Sized by**: Complexity points, not time. If it's too big, split it.

### Creating Work Items

1. What's the concrete, testable behavior?
2. What are the error cases and edge cases?
3. What existing patterns should be followed?
4. What tests prove this works?

### Work Item Components

- **Acceptance criteria** — specific, testable conditions
- **Implementation guidance** — approach, similar patterns, code examples
- **Test approach** — unit tests, integration tests, test data
- **Dependencies** — what must exist first
- **Traceability** — what scope/requirement this delivers

Every work item must trace back to what it's delivering. Not heavy linkage with IDs — just clarity on why this work exists and what success criteria it satisfies.

---

## Subtasks

Technical work that supports a work item.

**Purpose**: Infrastructure, refactoring, migrations, or breaking down complex work items.

**Contains**: Success criteria focused on technical outcomes.

---

## Spikes

Timeboxed research.

**Purpose**: Answer questions before committing to implementation.

**Key principle**: Spikes are questions, not answers. Every spike must inform a real decision.

**Timebox**: 15 min to 4 hours max. Over 4 hours? Split it or it's feature-level work.

### Creating Spikes

1. What specific question needs answering?
2. Has this been answered elsewhere?
3. What decision will this inform?
4. Can this be answered within the timebox?

### Executing Spikes

1. Execute within timebox — stop when time expires
2. Make a clear recommendation — don't just present options
3. Document findings with evidence

---

## Complexity Assessment

Estimate complexity, not time. Time varies — complexity is inherent to the work.

**Complexity factors:**
- How many things need to change?
- How many unknowns exist?
- How many integration points?
- How much existing code needs understanding?
- How much could go wrong?

**Rough scale:**
| Points | Meaning | Signals |
| -------- | --------- | --------- |
| 1-2 | Trivial | Single file, known pattern, obvious approach |
| 3-5 | Moderate | Few files, some unknowns, clear shape |
| 5-8 | Significant | Multiple components, integration points, requires investigation |
| 8+ | Too big | Split it. You can't hold this in your head. |

**Split when:**
- You can't explain the approach in a few sentences — stop and split
- Multiple independent outcomes are bundled together
- You'd need to context-switch within the work
- Risk is concentrated — one failure tanks everything

**Don't over-split:**
- Splitting adds overhead (context, handoffs, integration)
- Some things are genuinely complex and need to stay together
- If splitting creates more coordination than it saves, keep it whole

---

## Sequencing

Order matters. Wrong sequence creates blockers, wasted work, and integration pain.

**Principles:**

**Dependencies first** — What unblocks the most? Build foundations before features. Don't start what you can't finish.

**Risk early** — Tackle uncertain things first, while there's time to adapt. Don't push the scary parts to the end.

**Value early** — Deliver usable increments. Something working beats everything almost working.

**Learn early** — If a spike might change the approach, run it before building on assumptions.

**Think in layers** — Work naturally falls into layers, and each layer creates the conditions for the next to be verifiable. Environment (config, tooling, build) → structure (types, schemas, interfaces) → implementation (code, content, assets) → refinement (optimization, polish). You can't verify code without a build system. You can't implement without types. You can't refine what doesn't exist. Sequence accordingly.

**Sequence for flow:**
1. What layer does this work live in? (Environment → Structure → Implementation → Refinement)
2. What must exist before anything else? (Foundation)
3. What reduces the most uncertainty? (Risk/Learning)
4. What unblocks the most other work? (Critical path)
5. What delivers usable value soonest? (Incremental delivery)

**Watch for:**
- Circular dependencies (A needs B needs A) — break the cycle
- Long chains of sequential work — parallelize where possible
- All risk at the end — front-load uncertainty
- Integration last — integrate continuously, not at the end

---

## Refinement

Run multiple focused passes. Each catches different issues:

| Pass | Focus | Catches |
| ------ | ------- | --------- |
| Architecture | Technical consistency | Conflicts, duplicates, missing components |
| Capability | Completeness | Missing criteria, error handling, NFRs |
| Dependency | References | Broken links, circular deps, blocking order |
| Clarity | Understanding | Terminology, ambiguity, assumed knowledge |
| Sequence | Practicality | Implementation order, quick wins, risk |

---

## Anti-Patterns

**Vague criteria**
"Auth is done" vs "User can log in with email/password"

**No scope boundaries**
Not defining OUT invites creep. Always define what's out.

**Too much complexity**
More than 8 points at any level = too big to hold in your head. Split it.

**Calendar dates instead of exit criteria**
"Due March 15" vs "All acceptance criteria met"

**Creating all detail upfront**
Don't decompose everything at once. Create just-in-time.

**Work items without patterns**
No reference to existing code = implementation becomes guesswork. Always reference existing patterns.

**Spike without decision**
Research that doesn't inform a real decision is waste. Kill it or tie it to a decision.

**Oversized work items**
If you can't hold it in your head, split it.

---

## Quality Checks

**Phases**
- [ ] Exit criteria are specific and measurable
- [ ] Features identified to cover all criteria
- [ ] Dependencies documented
- [ ] Risks identified with mitigations

**Features**
- [ ] Outcome delivers clear value
- [ ] Scope boundaries explicit (in and out)
- [ ] Work items cover all acceptance criteria
- [ ] Complexity estimated

**Work Items**
- [ ] Acceptance criteria specific and testable
- [ ] Happy path, errors, and edge cases covered
- [ ] Implementation guidance with code examples
- [ ] Similar patterns in codebase referenced
- [ ] Test approach defined

**Spikes**
- [ ] Question is specific and answerable
- [ ] Answer doesn't already exist
- [ ] Timebox is realistic
- [ ] Decision this informs is identified
