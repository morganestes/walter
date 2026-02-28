# Operations

Incidents, postmortems, and retrospectives.

---

## The Goal

Learn from what happens. Document facts during incidents. Analyze blamelessly after. Feed improvements back into the system.

---

## Core Principles

### Document Facts First, Analyze Later
During incidents, capture what happened and when. Save analysis for after resolution.

### Blameless Analysis
Focus on systems and processes, not individuals. "Jesse broke it" vs "The deploy process lacked safeguards."

### Action Items Need Teeth
Actions without owners, deadlines, and follow-through breed cynicism. "Communicate better" isn't actionable.

### Recurring Problems Mean Actions Aren't Working
If the same issues appear repeatedly, past action items didn't address root causes.

---

## Incidents

Production events requiring response.

### Severity Levels

| Severity | Criteria | Response |
| ---------- | ---------- | ---------- |
| Critical | System unusable, data loss, security breach | All hands, immediate |
| High | Major feature unavailable, significant user impact | Dedicated responder |
| Medium | Partial degradation, workaround available | Normal priority |
| Low | Minor issue, limited impact | Queue for next available |

### During Active Incident

1. **Assess severity**
2. **Gather facts** — when detected, what affected, who reported
3. **Create incident record** with timeline
4. **Update continuously**
   - Timeline as events occur
   - Actions taken by responders
   - Communications sent
   - Hypotheses and findings
5. **After resolution** — complete resolution section

### Incident Contents

- **Timeline** — what happened when
- **Impact** — services affected, users affected, business impact
- **Detection** — how discovered, first alert
- **Response** — actions taken
- **Resolution** — what fixed it, duration
- **Root cause** (preliminary)

---

## Postmortems

Analysis after incidents to prevent recurrence.

### The 5 Whys

1. "Why did the incident occur?" → [answer]
2. "Why did that happen?" → [answer]
3. "Why did that happen?" → [answer]
4. "And why did that happen?" → [answer]
5. "What's the underlying cause?" → [answer]

Don't stop at the first cause. Keep digging until you hit a systemic issue.

### Postmortem Contents

- **Summary** — brief description of incident and impact
- **Timeline** — key events with timestamps
- **Impact** — duration, users, services, business
- **Root cause analysis** — what happened, why, contributing factors
- **What went well** — in the response
- **What could improve**
- **Lessons learned**
- **Action items** — with owners and due dates

### Good Action Items

- Specific and verifiable
- Assigned to an owner
- Has a deadline
- Achievable in near term

### Bad Action Items

- "Be more careful"
- "Communicate more"
- No owner or deadline
- Too vague to verify

---

## Retrospectives

Scheduled reflection on process and team dynamics. Don't skip these.

### When to Run

- After sprint completes
- After milestone/epic completes
- After significant incident
- Periodically for long-running projects

### Formats

**Start/Stop/Continue**
- What should we start doing?
- What should we stop doing?
- What should we continue?

**4Ls**
- Liked: What went well?
- Learned: What did we learn?
- Lacked: What was missing?
- Longed for: What do we wish we had?

**Mad/Sad/Glad**
- Mad: What frustrated us?
- Sad: What disappointed us?
- Glad: What made us happy?

### Facilitation

1. **Set the stage** — period, key metrics, major events
2. **Remind ground rules** — no blame, all perspectives valued
3. **Gather input** — what worked, what caused friction, what to change
4. **Document discussion**
5. **Identify action items** with owners and deadlines
6. **Review outcomes** before closing

### Facilitation Rules

- Timebox each section
- Draw out quiet voices
- Park tangents — address them later
- End positively
- Follow through on every action

---

## Anti-Patterns

**Blame focus**
"Jesse broke production" vs "The deploy process lacked canary checks"

**Shallow analysis**
Stopping at first cause instead of digging deeper. Go back to the 5 Whys.

**No actions from analysis**
Discussion without commitment to change is wasted time.

**Vague actions**
"Improve monitoring" vs "Add alerting for connection pool at 80%"

**Skipping retrospectives**
"Too busy" leads to repeated mistakes.

**Same issues recurring**
Past action items didn't work. Go back and find the actual root cause.

---

## Key Questions

**During Incidents**
- What is affected?
- When was it detected?
- What's the current status?
- What actions have been taken?
- Who needs to be notified?

**During Postmortems**
- What happened? (timeline)
- Why did it happen? (5 Whys)
- What contributed?
- What went well in response?
- What could improve?
- What specific actions prevent recurrence?

**During Retrospectives**
- What worked well?
- What caused friction?
- What would you change?
- What specific actions will we take?
- Who owns each action?
