---
name: stash
description: Stash the batch. Seal session context for the next agent. Nothing gets lost.
argument-hint: "[notes]"
---

# /stash

Stash the batch.

---

## Intent

The session is ending — or a milestone just landed — and the next agent starts fresh. They get no conversation history, no mental model, no context. Give them exactly what they need to continue. Nothing more, nothing less.

---

## Load Skill

Load the `walter` skill first. Then read its `handoff` reference.

---

## Start

$ARGUMENTS

If no notes were specified, assess the session and proceed with the process below.

---

## The Process

### 1. Scan for Unpersisted Work

Check the conversation for significant work products that exist only in context:

- Formulas (scope, success criteria, approach)
- Probe findings and recommendations
- Decisions and rationale
- Architecture or design work
- Root cause analyses
- Anything that took substantial effort to produce

**For each unpersisted item:** Ask the user: "This exists only in conversation. Want me to save it?" Default to `.walter/` if they don't specify a location. Don't assume. Don't skip. Don't batch them — name each one specifically.

### 2. Assess Current State

Answer these from what you know:
- What's in progress?
- What just completed?
- What's blocked or waiting?
- What's the logical next step?

If context is thin and you can't confidently answer these, use sub-agents to verify state:
- Check git status and recent commits for what actually changed
- Verify key files exist and reflect what was discussed

Be mindful of context. Stash is about sealing what you know, not starting new investigations. If you don't know the state of the project, that's a bigger problem than stash can solve.

### 3. Update {{config_file}}

Update the project root {{config_file}} with current state:

- **Status** — What exists, what's in progress. Reflect reality, not plans.
- **Next** — Specific next action. Not "continue working." What should the next agent do first?
- **Context** — 1-3 bullets of important context. Recent decisions, blockers, gotchas.
- **Commands** — Verify these still work. Update if anything changed.
- **Structure** — Update if files or directories changed.

Keep it minimal. The next agent can explore — they need a launchpad, not a journal.

### 4. Close Out

If there's completed work — items done, tests passing, self-review done — commit it along with the updated {{config_file}}. Don't leave finished work uncommitted. Use sub-agents to verify if needed.

If work is genuinely in progress or the session is just reporting state, that's fine — not every stash requires a commit. But "uncommitted changes" for completed work is a failure state. Either commit it or be explicit about why it's not ready.

### 5. Verify

Before completing:

- [ ] All significant work products either saved or explicitly declined by user
- [ ] Completed work committed (if applicable) — clean working tree
- [ ] {{config_file}} exists and is current
- [ ] Status reflects actual state (not stale)
- [ ] Next action is specific and actionable
- [ ] Commands section has working commands
- [ ] No claims of preserved work that only exists in conversation

---

## When to Stash

**Stash when:**
- Session ending (user says goodbye, wrapping up)
- Major milestone completes (feature done, phase transition)
- Context is getting full and a fresh session is needed
- Work is blocked and pausing
- User explicitly asks

**Don't stash for:**
- Minor progress within a task
- Quick questions or clarifications
- No meaningful state change since last stash

---

## Anti-Patterns

**Too much detail** — This isn't full documentation. The next agent can explore. Focus on what's NOW and what's NEXT.

**Vague next steps** — "Continue working" tells nothing. Be specific about the next action.

**Stale information** — Wrong status is worse than no status. Verify before writing.

**Skipping the work product scan** — The whole point is nothing gets lost. Check the conversation.

**Project history in {{config_file}}** — What happened belongs in commits and docs. {{config_file}} is current state + next action.

**Claiming work is preserved** — If it's only in conversation, say so. Don't let the user think it's saved when it isn't.

**Leaving completed work uncommitted** — If the work is done, commit it. "There are uncommitted changes" for finished work is a failure state, not a status update.
