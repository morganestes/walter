---
name: trace
description: Find the contamination. Systematic root cause analysis — trace from symptom to source.
argument-hint: "[issue]"
---

# /trace

Find the contamination source.

---

## Intent

Something's broken. You're finding out why. Not guessing. Not patching symptoms. Tracing to the root cause and fixing it properly.

---

## Load Skill

Load the `walter` skill first. Then read its `debugging`, `quality`, and `operations` references.

---

## Start

$ARGUMENTS

If no issue was specified, STOP and use the AskUserQuestion tool to ask What's broken? Describe the symptom, when it started, and what you've already tried.

---

## The Discipline

### Can't Fix What You Can't Reproduce

Before investigating:
1. Get reproduction steps
2. Follow them exactly
3. Confirm you can trigger the issue
4. Note any variations

If you can't reproduce it, you can't reliably fix it. Period.

### Root Cause Over Symptoms

A fix without understanding is a band-aid. It will fail again, differently, at a worse time.

Don't just find WHERE it fails. Understand WHY.

---

## Diagnosis Workflow

### 1. Gather Information

If the symptom, timeline, and scope are already clear, proceed. Otherwise:

STOP and use the AskUserQuestion tool to ask What additional context is needed? Specifically: What is the symptom? When did it start? What changed recently? Who/what is affected? How often does it occur?

### 2. Investigate with Sub-Agents

Spawn sub-agents to research in parallel. Don't waste context on exploration.

**Sub-agent tasks:**
- Trace the code path from entry point to failure (name the entry point, the expected flow, and where it breaks)
- Check git history for recent changes to affected areas (specify the files, directories, and time range)
- Search for similar patterns or related issues in the codebase (describe the failure pattern to match against)
- Review test coverage for the affected code (point to the test directories and specify what should be covered)

**Brief each sub-agent with:**
- The symptom description and reproduction steps
- The specific files, functions, or modules under investigation
- What to report: file paths, line numbers, git commit hashes, and a clear description of what they found and why it matters. For git history: who changed what, when, and what the commit message says.

**After collection:**
- Verify findings against the actual code and git history. Sub-agents can misidentify the failure point or attribute changes to the wrong commits.
- Synthesize into a picture of what happened: the code path, what changed, and where the investigation should focus next.

### 3. Reproduce

Follow reproduction steps exactly:
- Same environment
- Same inputs
- Same sequence

Document:
- What you tried
- What happened
- Any variations

### 4. The 5 Whys

Don't stop at the first answer:
1. "Why did this fail?" → [answer]
2. "Why did that happen?" → [answer]
3. "Why did that happen?" → [answer]
4. "And why?" → [answer]
5. "What's the underlying cause?" → [root cause]

Most people stop at Why #1. That's why bugs come back.

### 5. Check Recent Changes

- Is this a regression?
- What changed recently?
- When did it last work?

`git log` and `git bisect` are your friends.

### 6. Look for Patterns

- Same module?
- Same type of error?
- Same time period?
- Same code path?

Patterns signal systemic issues, not isolated bugs.

---

## Triage (If Multiple Issues)

Classify quickly, don't investigate deeply during triage.

**Severity** (impact):
- Critical: System unusable, data loss, security
- High: Major feature broken, no workaround
- Medium: Feature impaired, workaround exists
- Low: Minor, cosmetic, edge case

**Priority** (when to fix):
- Critical: Drop everything
- High: This sprint
- Medium: Schedule upcoming
- Low: Backlog

### Triage Outcomes

- **Clear and fixable** → Fix it
- **Needs investigation** → Create spike, timebox it
- **Cannot reproduce** → Request more info
- **Duplicate** → Link and close
- **Not a bug** → Close with explanation
- **Feature request** → Separate work item

---

## Fix Verification

After fixing:
1. Failing test passes
2. Reproduction steps no longer fail
3. Full test suite green
4. Regression tests added for edge cases
5. No unintended side effects

If you can't prove it's fixed, it's not fixed.

---

## Document the Fix

- What was the root cause?
- What fix was applied?
- What regression tests were added?
- What edge cases were covered?

Future you (or someone else) will thank you.

---

## After the Fix

If this was a significant incident or part of a pattern, use `/vent` to:
- Run a postmortem (what happened, why, how to prevent)
- Identify systemic issues
- Create action items that actually get done

Discovery is `/trace`. Recovery and learning is `/vent`.

---

## Persist

The root cause analysis exists only in conversation. For significant bugs — especially systemic ones — ask: "Want me to save the trace findings?" Root cause, fix rationale, and regression context are valuable for future debugging and postmortems.

---

## Key Questions

**When Diagnosing**
- Can I reproduce this reliably?
- What's the exact failure point?
- WHY does it fail there?
- Is this a regression?
- Is this part of a pattern?

**When Fixing**
- Do I understand the root cause?
- Am I fixing the cause or the symptom?
- What tests prevent recurrence?
- What edge cases might have the same issue?

---

## Anti-Patterns

**Fixing without reproducing** — You're guessing.

**Fixing symptoms** — The null check that papers over the real issue.

**No regression tests** — The bug will return.

**Endless investigation** — Timebox it. If you can't find it in N hours, escalate or spike.

**Severity inflation** — Not everything is critical.

**Ignoring patterns** — Three similar bugs = systemic problem.

**Investigating in main context** — Use sub-agents for research. Don't waste tokens.

---

Find the source. Fix it right. Make sure it stays fixed.
