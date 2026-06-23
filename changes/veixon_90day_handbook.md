# VEIXON Co-founders — 90-Day War Plan Build Handbook

**Purpose of this document:** a build and content reference for the daily war-plan pages — what gets built once (the template), what gets designed once (the 13-week curriculum), and what gets generated per founder (the actual task text). Use this as the single source of truth when implementing or auditing any day page.

---

## 1. The Core Principle — One Template, Ninety Instances

Day 1 and Day 73 are not different page designs. They are the same React route — `/dashboard/warplan/[week]/[day]` — rendering different data. Nobody hand-builds 90 pages. Engineering builds **one template** (Part 2 below); content/product design defines **one 13-week curriculum** (Part 3 below); the AI fills in the founder-specific specifics inside that structure at runtime.

If at any point the build starts hardcoding "Day 14 page" or "Day 52 copy," that's the wrong direction — stop and route it back through the template + curriculum data instead.

---

## 2. The Master Day Page Template

Every day page has exactly seven zones, always in this order, each gating the next. Nothing below a locked zone renders until the zone above it is satisfied.

| # | Zone | Unlocks when | Purpose |
|---|------|--------------|---------|
| 1 | Day Header (sticky) | Always visible | Mission code, week/day number, streak, status badge |
| 2 | VZN Mission Brief | Always visible | Why today's task matters, what success/failure looks like |
| 3 | Competitive Context | Only if task category = customer/market | Connects today's task to known competitor weaknesses |
| 4 | Pre-Task Prep (3 questions) | After reading the brief | Forces intentionality before action |
| 5 | Execution Tracker | After all 3 prep questions answered | Count-mode or completion-mode logging of the actual work |
| 6 | Day Debrief (5 fields) | After execution shows real activity | Forces reflection — this is the learning engine |
| 7 | Day Summary Card | After debrief submitted | Shareable proof of the day, triggers the green tick |

**The tick-mark rule (non-negotiable):** the checkbox on the war plan board only turns green after all three of prep → execution → debrief are complete. Visiting the page and skimming the brief does not count as progress. This is what separates VEIXON from a checklist app.

**Streak protection:** if it's after 6 PM local time and the day isn't complete, a sticky bottom banner appears with a countdown to midnight. This is the only zone that can appear out of the normal top-to-bottom flow.

---

## 3. The 90-Day Mission Map (13-Week Curriculum)

This is the actual founder journey, in order. It's deliberately written as a *realistic startup sequence*, not generic productivity filler — each week earns the right to the next. The AI generates founder-specific tasks, but it generates them **inside** these weekly objectives, never outside them.

| Week | Mission Code | Theme | Primary Objective | Day 7 Milestone |
|------|-------------|-------|--------------------|-----------------|
| 1 | OPERATION ZERO | Validate the problem | Confirm the problem is real and painful for a specific person | A one-sentence validated problem statement |
| 2 | OPERATION SIGNAL | Validate willingness to pay | Find out if anyone will actually exchange money for a fix | A documented "yes" or a documented "no, because X" |
| 3 | OPERATION SKETCH | Design the smallest solution | Define the thinnest version of the product that tests the core value | A one-page spec of the MVP |
| 4 | OPERATION BUILD | Ship a working prototype | Get something real in front of a real user, even if ugly | A working link or demo, not a deck |
| 5 | OPERATION FIRST FIVE | First real users | Get 5 people who are not friends or family actually using it | 5 logged users with at least one real session each |
| 6 | OPERATION FEEDBACK | Cut what doesn't work | Talk to those 5 users, find what they hate, kill it | A revised feature list with at least one thing removed |
| 7 | OPERATION PROOF | First paying signal | Get a payment, a deposit, or a binding commitment to pay | First ₹1 of real revenue or a signed pre-order |
| 8 | OPERATION MOAT | Start the defensibility | Identify and begin building the thing competitors can't copy in a sprint | A named, specific moat — not "we move faster" |
| 9 | OPERATION CHANNEL | Find the repeatable channel | Test 2-3 acquisition channels, find the one with real signal | One channel with a measured cost-per-user |
| 10 | OPERATION SCALE | Push what's working | Stop testing, start pushing the one channel that worked | A 2-3x increase in users from that channel |
| 11 | OPERATION NUMBERS | Get the unit economics straight | Know your real CAC, real margin, real burn rate | A one-page real (not projected) unit economics sheet |
| 12 | OPERATION STORY | Build the pitch from real data | Turn 11 weeks of actual decisions and outcomes into a narrative | A pitch narrative built only from things that actually happened |
| 13 | OPERATION CAPITAL | Earn the Vault | Hit the accountability and traction bar that unlocks VC access | Vault unlock conditions met (or a clear-eyed look at why not) |

### Day-by-day shape inside each week

Every week follows the same internal rhythm — this is what the AI uses to decide what *kind* of task to generate each day, regardless of which week it is:

- **Day 1** — Frame the week. One clarifying or planning task tied directly to the mission objective.
- **Days 2–4** — Core execution. The bulk of the actual work (interviews, building, outreach, testing) — usually count-mode tasks.
- **Day 5** — Synthesis. Make sense of what days 2-4 produced — usually completion-mode (write, document, decide).
- **Day 6** — Apply the synthesis. Turn the insight from Day 5 into a concrete artifact or decision.
- **Day 7** — Week debrief + Pattern Report. VZN reviews the full week and sets up Week N+1.

This rhythm is what makes the AI-generated tasks feel like a coherent week instead of seven random to-dos.

---

## 4. Task-Type Classification Rules

The execution tracker has two modes. The system decides which one a task gets by scanning for keywords — this logic must be implemented exactly once and reused for all 90 days.

**Count-mode** triggers: *talk to, interview, email, reach out, contact, sign up, find, call, message.*
Renders a large +/- counter against a target number extracted from the task text, with an optional one-line note per increment.

**Completion-mode** triggers: *write, create, build, document, decide, analyse, plan, design, ship.*
Renders a 3-5 step checklist generated by breaking the task down, with a progress bar.

If a task matches neither pattern, default to completion-mode — never leave a task with no execution UI.

---

## 5. Engineering Build Sequence

Build in this order. Do not start week 2's content until week 1 works end-to-end for one real test account — the template, not the content, is what's expensive to get wrong.

1. **Routing + master template** — `/dashboard/warplan/[week]/[day]` renders all 7 zones with placeholder data, gating logic enforced (tick only after all 3 conditions).
2. **Week 1 seed data** — hardcode OPERATION ZERO's objective, milestone, and day rhythm as a test fixture. Confirm a fake founder profile produces sensible AI output for all 7 days.
3. **Prep questions + execution tracker + debrief APIs** — wired to real MongoDB, not mock data. Confirm the tick only flips after all three steps.
4. **Progressive week unlock** — Week 2 stays locked until Week 1 hits 70%. Test the unlock animation and the server-side 403 on locked routes.
5. **Replicate across all 13 weeks** — once step 1-4 are proven, populate the mission map table from Part 3 as structured seed data (week objective, milestone, theme) and let the AI generate the rest. No new template code needed here — only new content data.
6. **Week overview + pattern analysis** — the `/warplan/[week]` summary page and the Sunday pattern report, both read from the same debrief data already being captured.
7. **Streak protection + Monday missile** — these are notification layers on top of the same data, build last since they depend on everything above already working.

---

## 6. Go-Live Checklist (per week, before founders see it)

- Tick only turns green after prep + execution + debrief — verified manually, not just in code review
- All 7 days have a defined milestone and rhythm role (frame / execute / synthesize / apply / debrief)
- Count-mode and completion-mode both render correctly for at least one real task example
- Week stays locked until the prior week hits 70%, and the locked state is enforced server-side, not just hidden in the UI
- Debrief's 5 fields all have working character minimums — empty or one-word debriefs must be rejected
- Day summary card renders and downloads correctly on both mobile and desktop
- Streak banner only appears after 6 PM and disappears once the day is complete

---

## Notes for Whoever Is Building This

The temptation with a "90 days" feature is to either write 90 days of content by hand (too slow, won't scale per founder) or let the AI generate everything with zero structure (incoherent, won't feel like a real program). The mission map in Part 3 is the middle path — humans design the 13-week arc once, the AI fills in the founder-specific texture inside it every day. Protect that split. If the AI ever starts generating tasks that ignore the week's objective, that's a prompt bug, not a content gap.
