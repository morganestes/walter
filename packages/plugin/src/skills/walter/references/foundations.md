# Foundations

The thinking that everything else rests on.

---

## Why This Matters

Before scope, before success criteria, before decomposition — understand the domain. Most bugs aren't code bugs. They're understanding bugs. The developer didn't grasp the problem space.

Experienced engineers do this naturally. They ask about entities, relationships, flows, and constraints before writing code. They build a mental model first. This reference makes that thinking explicit and scalable.

The questions are universal. The artifacts scale with complexity.

---

## Domain Thinking

Understand the problem space itself.

### The Questions

**Entities** — What are the things?
- What nouns appear when describing the problem?
- Which are core vs. supporting?
- What uniquely identifies each one?

**Relationships** — How do they connect?
- Which entities reference others?
- One-to-one, one-to-many, many-to-many?
- Are relationships required or optional?

**Lifecycle** — What states can they be in?
- What's the journey from creation to completion/deletion?
- What triggers state changes?
- Can states go backward or only forward?

**Invariants** — What must always/never be true?
- What constraints govern the entities?
- What would cause data corruption or invalid state?
- What business rules are non-negotiable?

### How It Scales

| Complexity | Artifact |
| ------------ | ---------- |
| Simple | Mental model — hold it in your head |
| Moderate | Sketch or bullet points — entities and key relationships |
| Complex | Domain model doc — entities, relationships, lifecycle diagrams |
| Enterprise | Formal ontology — complete with validation rules |

### When to Go Deeper

- Multiple entities with complex relationships
- State machines with many transitions
- Business rules that interact or conflict
- Multiple teams need shared understanding
- You keep discovering edge cases

### Anti-Patterns

**Skipping to schema** — Designing database tables before understanding the domain. Tables follow understanding, not the reverse.

**Entity soup** — Everything is a "thing" with no clear boundaries. If you can't name it precisely, you don't understand it.

**Implicit relationships** — Assuming connections without stating them. "Obviously X relates to Y" — make it explicit.

**Ignoring lifecycle** — Treating entities as static when they have states and transitions.

---

## Functional Thinking

Understand what users can do and what happens when they do it.

### The Questions

**Capabilities** — What can users do?
- What actions are available?
- Who can perform each action?
- What preconditions must be met?

**Flows** — What's the sequence?
- What's the happy path?
- What steps are required vs. optional?
- Where are the decision points?

**Edge Cases** — What happens when things go wrong?
- What if input is invalid?
- What if a step fails partway through?
- What if external dependencies are unavailable?
- What if the user does something unexpected?

**Boundaries** — Where does this system end?
- What's handled here vs. elsewhere?
- What's manual vs. automated?
- What's synchronous vs. asynchronous?

### How It Scales

| Complexity | Artifact |
| ------------ | ---------- |
| Simple | Mental walkthrough — trace the happy path in your head |
| Moderate | User flows — bullet points or simple diagrams |
| Complex | Flow documentation — all paths including errors |
| Enterprise | Functional spec — comprehensive with edge cases |

### When to Go Deeper

- Multiple user roles with different permissions
- Flows that branch significantly
- Error handling that affects user experience
- Integrations with external systems
- Compliance or audit requirements

### Anti-Patterns

**Happy path only** — Designing for success, ignoring failure. Real systems fail constantly.

**God user** — Assuming one type of user. Different roles have different needs and constraints.

**Infinite scope** — "Users can do anything." No they can't. Define the boundaries.

**UI-first thinking** — Designing screens before understanding flows. Flows dictate UI, not vice versa.

---

## Technical Thinking

Understand how it works under the hood.

### The Questions

**Data Structure** — How is information organized?
- What's the schema/model?
- What's normalized vs. denormalized?
- What needs to be indexed?
- What's the source of truth?

**Architecture** — How do components interact?
- What are the major components?
- How do they communicate?
- What's synchronous vs. asynchronous?
- Where are the failure points?

**Interfaces** — What are the boundaries?
- What APIs exist (internal and external)?
- What contracts must be maintained?
- What's the versioning strategy?
- What's public vs. private?

**Operations** — How does it run?
- How is it deployed?
- How is it monitored?
- How does it scale?
- How is it debugged?

### How It Scales

| Complexity | Artifact |
| ------------ | ---------- |
| Simple | Mental model — architecture in your head |
| Moderate | Architecture sketch — components and connections |
| Complex | Technical design doc — with rationale |
| Enterprise | Formal spec — ADRs, detailed contracts |

### When to Go Deeper

- Multiple services or components
- Performance requirements
- Security considerations
- Team boundaries (who owns what)
- Long-term maintenance concerns

### Anti-Patterns

**Premature optimization** — Designing for scale before understanding the domain. Optimize later.

**Architecture astronautics** — Complex architecture for simple problems. Match complexity to need.

**Implicit contracts** — Components "just know" how to talk to each other. Make interfaces explicit.

**Ops afterthought** — Designing without considering how it runs. Operability is a feature.

---

## The Interplay

These three lenses inform each other:

```
Domain → Functional → Technical
  ↑                      ↓
  ←────────────────────←
```

- **Domain** shapes what's possible functionally
- **Functional** requirements drive technical decisions
- **Technical** constraints may reshape domain understanding

Iterate. Understanding deepens as you move between lenses.

---

## Apply at Every Phase

**During /formula:** Use all three lenses.
- Domain thinking to validate the problem definition
- Functional thinking to draw scope boundaries
- Technical thinking to surface constraints

**During /prep:** Let the model drive decomposition.
- Domain model shapes the work breakdown
- Functional flows become features
- Technical architecture reveals dependencies

**During /cook:** Build from understanding, not guesswork.
- Domain understanding prevents misimplementation
- Functional flows guide test cases
- Technical design guides code structure

---

## Quality Checks

**Domain**
- [ ] Core entities identified and named
- [ ] Relationships explicit (not assumed)
- [ ] Lifecycle states documented
- [ ] Invariants stated

**Functional**
- [ ] Capabilities defined for each user type
- [ ] Happy path flows documented
- [ ] Error cases considered
- [ ] Boundaries explicit

**Technical**
- [ ] Data structure supports domain model
- [ ] Architecture matches functional needs
- [ ] Interfaces defined
- [ ] Operational concerns addressed

---

## The Principle

You can't build what you don't understand. Foundations thinking is how you understand.

The ceremony scales. The thinking doesn't. A weekend project needs 10 minutes of foundations thinking. An enterprise system needs weeks. Both need it.

Skip this and you'll pay later — in bugs, in rework, in "why didn't we think of that?"
