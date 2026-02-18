# Handoff

Session context for the next agent.

---

## When to Trigger

**Trigger handoff when:**
- Session ending (user says goodbye, wrapping up, etc.)
- Major milestone completes (feature done, phase transition)
- Significant decision made
- Work blocked and pausing
- User explicitly asks ("handoff", "wrap up", "update context")

**Don't trigger for:**
- Minor progress within a task
- Quick questions or clarifications
- No meaningful state change

---

## Persist Work Products

Conversation context is ephemeral. Formulas, probe findings, decisions, and other work products exist only in the current session until saved to disk.

**When significant work completes, act immediately:**
1. Tell the user: "This only exists in conversation. Want me to save it?"
2. Don't wait to be asked. Don't assume they know it's ephemeral.
3. Don't claim work is preserved when it isn't.
4. Don't say "come back to this later" unless it's actually saved.

**What counts as significant work:**
- Completed formula (scope, success criteria, approach)
- Probe findings and recommendations
- Decisions and rationale
- Architecture or design work
- Anything that took substantial effort to produce

**Where to save:**
- `.walter/` for in-flight work — gitignored, persists across sessions. On first write: create the directory if needed, ensure `.gitignore` covers it, and tell the user what `.walter/` is and that they can choose a different location
- `docs/{topic}/` for permanent work products — committed, shared, the user decides when and where
- Context log for session history
- CLAUDE.md for current status only — not full work products

**The rule:** If it would hurt to lose it, offer to save it.

---

## The Process

### 1. Assess Current State

Quick scan (use sub-agents if needed):
- What is this project?
- What commands are needed to run it?
- What's in progress?
- What just completed?
- What's blocked or waiting?
- What's the logical next step?

### 2. Create or Update CLAUDE.md

Single operation. If file exists, update it. If not, create it.

**Location:** Project root `CLAUDE.md`

### 3. Keep It Minimal, Stay Flexible

CLAUDE.md tells the next agent what to do NOW. Not project history. Not full documentation. Just:
- What this is and how to run it
- Where we are
- What to do next

The user may want more. Keep data updated as things change — commands, structure, docs, where you are in the process. Adapt to what they need.

---

## CLAUDE.md Template

```markdown
# {Project Name}

{One sentence: what this project is.}

## Commands

{Essential commands to work with this project.}

```bash
# Install dependencies
{install command}

# Run development
{dev command}

# Run tests
{test command}

# Build
{build command}
```

## Structure

{Brief overview of key directories/files. 4-8 lines max.}

- `docs/` - {requirements, specs, decisions}
- `src/` - {what's here}
- `tests/` - {what's here}
- ...

## Status

{Current state in 2-4 bullets. What exists, what's in progress.}

- ...
- ...

## Next

{Specific next action. What the next agent should do first.}

## Context

{Optional: 1-3 bullets of important context. Recent decisions, blockers, gotchas.}
```

---

## Context Log (Optional)

For projects that need session history, maintain a single log file. Prepend new entries at the top — newest first.

**File:** `docs/context.md` (or similar)

**Entry format:**
```markdown
## 2026-01-28T18:59:14.629Z

What changed. Decisions made. What's next.
```

Use `node -e "console.log(new Date().toISOString())"` or equivalent for precise timestamps.

**When to use:** Multi-session projects, team handoffs, or when "how did we get here?" matters.

CLAUDE.md = current state. Context log = history. Most projects only need CLAUDE.md.

---

## Anti-Patterns

**Too much detail** — This isn't full documentation. The next agent can explore.

**Vague next steps** — "Continue working" tells nothing. Be specific.

**Stale information** — Wrong status is worse than no status.

**Missing commands** — The agent needs to know how to run the project.

**Project history** — Don't include what happened. Focus on what's NOW.

**Claiming work is preserved** — Saying "no work lost" or "come back to this" when work exists only in conversation. Context compacts. Sessions end. Be honest about persistence.

---

## Verification

Before completing handoff:

- [ ] CLAUDE.md exists at project root
- [ ] Commands section has working commands
- [ ] Status reflects actual current state
- [ ] Next action is specific and actionable
- [ ] No stale or outdated information

The next agent starts fresh. Give them exactly what they need to continue.

---

## Context Limits

When context is getting full, say so immediately. Don't wait until it's critical. Let the user decide:

- **Complete current task** — If it can finish before limits hit, keep going
- **Compact** — Fine if summary stays coherent and agent doesn't become "two-brained"
- **Fresh handoff** — Better for complex work where nuance matters

Don't silently degrade. Communicate and let the user choose.
