# Execution

Building with discipline.

---

## The Goal

Transform specs into working code through disciplined, incremental implementation. Every piece tested, every commit meaningful, every criterion verified.

---

## Core Discipline

### Verify Before Acting
- Read everything before writing code
- Confirm dependencies are satisfied
- Identify unknowns and resolve them first
- Verify the development environment is ready

### Work Incrementally
- One logical change at a time
- Test after each change
- Commit at logical boundaries — a completed work item or a coherent part of a larger feature
- Review before committing — use sub-agents for verification when the scope warrants it

### Follow Existing Patterns
- Use consistent naming with codebase
- Match established code patterns
- Don't introduce new patterns unless necessary

### Stay Within Scope
- Implement the acceptance criteria, nothing more
- Don't refactor unrelated code during implementation
- Pragmatic cleanup of code you're touching (DRY, KISS, clear naming) is craft, not creep
- Don't add features beyond what was asked

---

## The TDD Cycle

When appropriate (business logic, algorithms, APIs, service methods):

1. **Write test** for the criterion
2. **Write the best implementation** — not just enough to pass the test
3. **Iterate** if tests fail or quality isn't right
4. **Repeat** for next criterion
5. **Review and commit** at the logical boundary — one coherent unit

TDD does not apply to: environment setup, config files, schema definitions, UI layout, third-party integrations.

---

## Implementation Flow

### Before Starting

1. **Create branch** from latest main
2. **Pre-implementation review**
   - Read everything (spec, acceptance criteria, related code)
   - Check dependencies
   - Verify environment
3. **Create implementation checklist** from acceptance criteria

### During Implementation

4. **Implement** following TDD cycle where appropriate
5. **Follow existing patterns** in the codebase
6. **Test continuously** — after each change
7. **Review and commit at the logical boundary** — verify your work, use sub-agents when warranted

### Before Completing

8. **Self-review** — review your own PR. If you wouldn't approve it, don't submit it.
9. **Validate definition of done** — all criteria met?
10. **Update documentation** with what was built
11. **Create PR or merge**

---

## Bug Fixes

Same discipline, tighter scope. Follow the bug fix process in the `debugging` reference.

The key principle: minimal fix. Don't refactor unrelated code. Don't improve beyond the fix. But pragmatic cleanup of code you're touching is craft, not creep.

---

## Definition of Done

Don't call it done until every item checks off:
- [ ] Code implemented following patterns
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Code reviewed (self or peer)
- [ ] Documentation updated
- [ ] No critical issues
- [ ] Performance acceptable

---

## When to Ship

Done is better than perfect. But done means criteria met, not "I'm tired of this."

**Ship when:**
- All acceptance criteria are met
- Tests pass and cover the important paths
- You'd be comfortable debugging this at 2am
- The next person can understand it

**Don't ship when:**
- Known bugs exist (even minor ones add up)
- Tests are missing for core functionality
- You're hoping no one looks too closely
- "It works on my machine" is your confidence

**Cut scope when:**
- You're gold-plating (adding polish beyond requirements)
- Nice-to-haves are blocking must-haves
- Timeline pressure is real and criteria can be narrowed
- Scope creep happened and you need to reset

**Push through when:**
- You're almost there and stopping creates more work than finishing
- The hard part is done and only cleanup remains
- Cutting would leave something broken or unusable
- Momentum matters and pausing would lose context

**The test:** Show this to a principal engineer or architect. Not perfect — but solid, clean, meets requirements. If you'd hesitate, you're not done.

---

## Pre-Build Validation

Before writing code, validate you're ready. Don't proceed until you can answer all five:

1. **Read the work item completely** — criteria, guidance, dependencies
2. **Check dependencies are satisfied** — required pieces exist and work
3. **Verify code examples** — do method names, field names, patterns actually exist in the codebase?
4. **Identify unknowns** — resolve anything unclear before implementation, not during
5. **Confirm environment** — can you run, test, and verify?

Catching misunderstandings here is cheap. Catching them after implementation is expensive.

For complex work (5+ points), consider a quick spike to validate the approach before committing.

---

## Self-Review Checklist

Before calling it done, run every item. No exceptions.

**Code Quality**
- [ ] No commented-out code
- [ ] No debug print statements
- [ ] Consistent formatting
- [ ] Meaningful variable names
- [ ] DRY principle followed
- [ ] Error handling complete
- [ ] Edge cases handled
- [ ] No hardcoded paths
- [ ] Tests portable across environments

**Security**
- [ ] No hardcoded credentials
- [ ] Input validation present
- [ ] SQL injection prevented
- [ ] No sensitive data logged

**Performance**
- [ ] No N+1 queries
- [ ] Appropriate indexes used
- [ ] Caching where beneficial
- [ ] Meets performance criteria

---

## Anti-Patterns

**Big bang implementation**
Implementing everything before testing. Stop. Work incrementally.

**"I'll add tests later"**
You won't. Write tests as part of implementation.

**Giant commits with vague messages**
"Fixed stuff" tells nothing. One commit per work item with clear messages.

**Acceptance criteria drift**
Implementing beyond scope. Stick to what was defined.

**Over-fixing bugs**
Refactoring unrelated code during bug fix. Pragmatic cleanup of what you're touching is fine.

**Documentation lag**
Not updating docs with code. Document as you go.

**Test coverage gaming**
Writing useless tests for coverage. Focus on meaningful tests.

**AI attribution in commits**
Commit messages describe what changed and why, not who or what wrote the code. No co-author lines. Attribution adds noise and ages poorly.

---

## Key Questions

**Before Starting**
- Are all dependencies satisfied?
- Is the development environment ready?
- Do I understand what needs to be built?

If any answer is no, stop. Resolve before proceeding.

**During Implementation**
- Does this follow existing patterns?
- Am I staying within scope?
- Have I tested this change?
- Is this work item complete enough to commit?

**Before Completing**
- Are all acceptance criteria met?
- Do all tests pass?
- Have I documented what I built?
- Would I approve this PR?

If any answer is no, you're not done.
