# 90-Day Plan — Seed Data & Wiring

Files generated here:

- **`ninetyDayPlan.ts`** — typed source of truth. `import { NINETY_DAY_PLAN, getDay, getWeek, getDayByNumber } from "@/lib/constants/ninetyDayPlan"`.
- **`ninety-day-plan.json`** — same data, portable (seed scripts, the AI prompt context, tests).
- **`../../VEIXON-90-Day-Program.md`** — human-readable view of all 90 days.

This is exactly the *structured seed data* called for in `changes/veixon_90day_handbook.md` §5 step 5. It is **curriculum, not founder copy** — the AI textures each field per founder at runtime; never hardcode a founder's specifics here.

## Per-day shape (`PlanDay`)

| field | zone | use |
|---|---|---|
| `brief` | 2 — VZN Mission Brief | first-person seed; feed to `/api/ai/day-brief` as the skeleton to personalize |
| `competitiveContext` | 3 — Competitive Context | render zone 3 only when `true` |
| `prepQuestions[3]` | 4 — Pre-Task Prep | the 3 gate questions; feed `/api/ai/prep-questions` to tailor wording |
| `task{label,mode,target}` | 5 — Execution Tracker | `mode:"count"` → +/- counter to `target`; `mode:"completion"` → checklist (`/api/ai/task-breakdown`) |
| `debriefFocus` | 6 — Day Debrief | steer the 5-field debrief / `/api/ai/debrief-analysis` |
| `shareAngle` | 7 — Day Summary Card | seed text for `/api/ai/share-card` |
| `killSwitch` | — | VZN escalation trigger (pivot/cut) — wire to task-watchdog / pivot radar |
| `rhythmRole` | — | frame/execute/synthesize/apply/debrief — UI accent + AI tone |
| `weekObjective`,`weekMilestone` | week | header + the Day-7 gate |

## Wiring the day page

```ts
// app/dashboard/warplan/[week]/[day]/page.tsx
import { getDay } from "@/lib/constants/ninetyDayPlan";

export default function DayPage({ params }: { params: { week: string; day: string } }) {
  const seed = getDay(Number(params.week), Number(params.day));
  if (!seed) return notFound();
  // 1. render 7 zones from `seed`
  // 2. hydrate brief/prep/breakdown/debrief/share via the matching /api/ai/* routes,
  //    passing `seed` + founder profile so the AI personalizes INSIDE this structure
  // 3. tick turns green only after prep + execution + debrief all complete (handbook rule)
}
```

## Task-mode rule (handbook §4)
`mode` is pre-computed here so you don't re-derive it per render. `count` for talk/interview/email/find/reach-out tasks (with a numeric `target`); `completion` for write/build/design/decide/document tasks. Default is `completion`.

## Progressive unlock
`getWeek(n)` gives a week's 7 (or 6, for Week 13) days. Keep Week N+1 locked until Week N hits 70% completion — enforce server-side, per handbook §5 step 4.

## Regenerating
Edit `outputs/weeks_data.py` and re-run the generator. Day count is asserted to be exactly 90; each day must have exactly 3 prep questions and a valid task mode, or the build fails loudly.
