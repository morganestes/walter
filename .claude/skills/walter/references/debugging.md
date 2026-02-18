# Debugging

Systematic diagnosis.

---

## The Goal

Find the root cause, not just the symptom. Fix it once, prevent it forever.

---

## Core Principles

### Can't Fix What You Can't Reproduce
Don't touch the code until you can reliably trigger the issue. Follow reproduction steps exactly. Note any variations.

### Root Cause Over Symptoms
A fix without understanding is a band-aid that will fail again. Understand WHY the failure occurs, not just WHERE.

### Triage is Classification, Not Fixing
Get bugs into the right queue quickly. Assess, prioritize, classify. Stop investigating once classified — triage is not debugging.

---

## Bug Lifecycle

```
New → Triaged → In Progress → Resolved → Closed
              ↘ Won't Fix
```

---

## Severity vs Priority

**Severity** — What's broken (impact)

| Severity | Criteria |
| ---------- | ---------- |
| Critical | System unusable, data loss, security breach |
| High | Major feature broken, no workaround |
| Medium | Feature impaired, workaround exists |
| Low | Minor issue, cosmetic, edge case |

**Priority** — When to fix (business context)

| Priority | Response |
| ---------- | ---------- |
| Critical | Drop everything, fix now |
| High | Fix this sprint |
| Medium | Schedule upcoming |
| Low | Backlog |

Severity describes impact. Priority considers business context, user count, workarounds, deadlines.

---

## Bug Creation

Every bug report must enable anyone to reproduce and understand without additional clarification:

1. **Verify reproducible** — can you trigger it reliably?
2. **Check for duplicates** — does this already exist?
3. **Gather information**
   - Reproduction steps (exact sequence)
   - Expected behavior
   - Actual behavior
   - Environment (browser, OS, versions)
   - Frequency (always, intermittent, specific conditions)
   - Workaround (if any)
4. **Assess severity** based on impact
5. **Link related items**

---

## Bug Triage

1. **Review the report** — is it complete?
2. **Check for duplicates**
3. **Verify reproduction** — can you trigger it?
4. **Assess severity** based on impact
5. **Assign priority** considering business context
6. **Preliminary root cause** — obvious? or needs investigation?
7. **Determine next steps**
   - Clear and fixable → assign to sprint
   - Needs investigation → create spike
   - Cannot reproduce → request more info
   - Not a bug → close with explanation
   - Feature request → convert to story
8. **Update status** and document triage notes

---

## Root Cause Analysis

1. **Trace the code path** from reproduction steps
2. **Identify the exact failure point**
3. **Understand WHY** — not just where
4. **Check recent changes** — is this a regression?
5. **Document clearly** — future fixers need context

---

## Bug Fix

1. **Verify reproduction** — follow steps exactly
2. **Confirm root cause** — trace code path, understand why
3. **Write failing test** that reproduces the bug
4. **Implement minimal fix** — fix the bug, nothing more
5. **Verify fix**
   - Test passes
   - Reproduction steps no longer fail
   - Full suite green
6. **Add regression tests** for edge cases
7. **Document the fix**

---

## Anti-Patterns

**Vague bug descriptions**
"Login doesn't work" vs "Login crashes with 500 error when entering invalid password"

**Missing reproduction steps**
Cannot reproduce = cannot reliably fix. Don't proceed without them.

**Skipping duplicate check**
Creates noise and wastes effort.

**Severity inflation**
Not everything is critical. Inflate severity and nothing gets prioritized correctly.

**Fixing symptoms instead of causes**
A null check that papers over the real issue will fail differently later. Find the actual cause.

**Endless investigation during triage**
Triage classifies. Root cause unclear? Create a spike and move on.

**No regression tests**
The bug will return without tests that prevent it.

---

## Key Questions

**When Creating**
- Can I reproduce this reliably?
- Is this a duplicate?
- What's the exact sequence to trigger this?
- What's the impact on users?

**When Triaging**
- Is the report complete enough to act on?
- What's the severity based on actual impact?
- What's the business priority?
- Is root cause obvious or needs investigation?
- Is this part of a pattern?

**When Fixing**
- Do I understand the root cause? If not, stop.
- Am I fixing the cause or just the symptom?
- What regression tests prevent recurrence?
- What edge cases might have the same issue?

---

## Patterns Signal Bigger Issues

Multiple related bugs indicate systemic problems. Track patterns:
- Same module
- Same type of error
- Same time period
- Same code path

When patterns emerge, do a systematic review beyond individual fixes. Don't just fix the next ticket.
