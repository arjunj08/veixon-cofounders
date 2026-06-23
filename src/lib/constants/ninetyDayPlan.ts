// AUTO-GENERATED - VEIXON 90-Day War Plan seed data.
// Source of truth for /dashboard/warplan/[week]/[day]. The AI textures each day per founder
// AT RUNTIME inside this structure; never hardcode founder-specific copy here.
// Aligned to changes/veixon_90day_handbook.md (7 zones, 13 missions, frame/execute/synthesize/apply/debrief).

export type TaskMode = "count" | "completion";
export type RhythmRole = "frame" | "execute" | "synthesize" | "apply" | "debrief";
export type Phase = "VALIDATE" | "BUILD" | "PROVE";

export interface DayTask { label: string; mode: TaskMode; target: number | null; }

export interface PlanDay {
  day: number; week: number; dayOfWeek: number; phase: Phase;
  missionCode: string; theme: string; weekObjective: string; weekMilestone: string;
  rhythmRole: RhythmRole; brief: string; dayObjective: string; task: DayTask;
  prepQuestions: string[]; successCriteria: string; failureSignal: string;
  competitiveContext: boolean; debriefFocus: string; shareAngle: string; killSwitch: string;
}

export const NINETY_DAY_PLAN: PlanDay[] = [
  {
    "day": 1,
    "week": 1,
    "dayOfWeek": 1,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "frame",
    "brief": "OPERATION ZERO - Day 1 of 7. Name the exact problem and the exact person who has it. This week we confirm the problem is real and painful for a specific person. Today is not optional: A written hypothesis with one named, narrow customer segment. If you can't, that is the signal - not a delay.",
    "dayObjective": "Name the exact problem and the exact person who has it.",
    "task": {
      "label": "Write a one-paragraph problem hypothesis that names a specific customer, not 'everyone'.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Who specifically feels this pain - name a real type of person?",
      "When did you last watch this problem happen?",
      "Why hasn't it already been solved well?"
    ],
    "successCriteria": "A written hypothesis with one named, narrow customer segment.",
    "failureSignal": "Your customer is 'everyone' or 'businesses' - too vague to test.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Day 1. Named the enemy. One problem, one person.",
    "killSwitch": "Fewer than 5 people rank this problem in their top 3 - pivot the problem before Week 2."
  },
  {
    "day": 2,
    "week": 1,
    "dayOfWeek": 2,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "execute",
    "brief": "OPERATION ZERO - Day 2 of 7. Build a list of real people who match that customer. This week we confirm the problem is real and painful for a specific person. Today is not optional: 10 named, reachable prospects in a list. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build a list of real people who match that customer.",
    "task": {
      "label": "Find and list 10 real people who fit your target customer.",
      "mode": "count",
      "target": 10
    },
    "prepQuestions": [
      "Where do these people already gather?",
      "What proves someone actually fits the profile?",
      "How will you reach each one?"
    ],
    "successCriteria": "10 named, reachable prospects in a list.",
    "failureSignal": "You can't find even 5 - the segment may not exist where you think.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Day 2. Built my first 10-person target list.",
    "killSwitch": "Fewer than 5 people rank this problem in their top 3 - pivot the problem before Week 2."
  },
  {
    "day": 3,
    "week": 1,
    "dayOfWeek": 3,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "execute",
    "brief": "OPERATION ZERO - Day 3 of 7. Open the conversations. This week we confirm the problem is real and painful for a specific person. Today is not optional: 10 outreach messages sent, at least 3 replies. If you can't, that is the signal - not a delay.",
    "dayObjective": "Open the conversations.",
    "task": {
      "label": "Message 10 prospects and request a 15-minute problem interview.",
      "mode": "count",
      "target": 10
    },
    "prepQuestions": [
      "What's the one-line reason they'd say yes?",
      "What channel gets the fastest reply?",
      "What time window are you offering?"
    ],
    "successCriteria": "10 outreach messages sent, at least 3 replies.",
    "failureSignal": "Zero replies after 10 sends - message or channel is wrong.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Day 3. Asked 10 strangers for their time.",
    "killSwitch": "Fewer than 5 people rank this problem in their top 3 - pivot the problem before Week 2."
  },
  {
    "day": 4,
    "week": 1,
    "dayOfWeek": 4,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "execute",
    "brief": "OPERATION ZERO - Day 4 of 7. Listen, don't sell. This week we confirm the problem is real and painful for a specific person. Today is not optional: 4 interviews done with real quotes captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Listen, don't sell.",
    "task": {
      "label": "Run at least 4 problem interviews - ask about their world, never pitch.",
      "mode": "count",
      "target": 4
    },
    "prepQuestions": [
      "What will you NOT say (your idea)?",
      "What's your opening question?",
      "How will you capture exact quotes?"
    ],
    "successCriteria": "4 interviews done with real quotes captured.",
    "failureSignal": "You pitched instead of listening - the data is now biased.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Day 4. 4 interviews. Zero pitching. Pure listening.",
    "killSwitch": "Fewer than 5 people rank this problem in their top 3 - pivot the problem before Week 2."
  },
  {
    "day": 5,
    "week": 1,
    "dayOfWeek": 5,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "synthesize",
    "brief": "OPERATION ZERO - Day 5 of 7. Find the pattern in what you heard. This week we confirm the problem is real and painful for a specific person. Today is not optional: 3 clearly written pain patterns grounded in quotes. If you can't, that is the signal - not a delay.",
    "dayObjective": "Find the pattern in what you heard.",
    "task": {
      "label": "Write the 3 most common pain patterns from your interviews.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which complaint came up the most?",
      "What words did THEY use, not you?",
      "What surprised you?"
    ],
    "successCriteria": "3 clearly written pain patterns grounded in quotes.",
    "failureSignal": "No pattern repeats - too few interviews or no shared problem.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Day 5. Found 3 patterns I didn't expect.",
    "killSwitch": "Fewer than 5 people rank this problem in their top 3 - pivot the problem before Week 2."
  },
  {
    "day": 6,
    "week": 1,
    "dayOfWeek": 6,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "apply",
    "brief": "OPERATION ZERO - Day 6 of 7. Sharpen the problem into one sentence. This week we confirm the problem is real and painful for a specific person. Today is not optional: One crisp sentence validated against a real quote. If you can't, that is the signal - not a delay.",
    "dayObjective": "Sharpen the problem into one sentence.",
    "task": {
      "label": "Rewrite your problem statement as one sentence a stranger would instantly recognize.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Can a stranger repeat it back?",
      "Does it name the person AND the pain?",
      "Have you cut every buzzword?"
    ],
    "successCriteria": "One crisp sentence validated against a real quote.",
    "failureSignal": "Still needs a paragraph to explain - not sharp enough.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Day 6. One sentence. The whole problem.",
    "killSwitch": "Fewer than 5 people rank this problem in their top 3 - pivot the problem before Week 2."
  },
  {
    "day": 7,
    "week": 1,
    "dayOfWeek": 7,
    "phase": "VALIDATE",
    "missionCode": "OPERATION ZERO",
    "theme": "Validate the problem",
    "weekObjective": "Confirm the problem is real and painful for a specific person",
    "weekMilestone": "A one-sentence validated problem statement",
    "rhythmRole": "debrief",
    "brief": "OPERATION ZERO - Day 7 of 7. Go / no-go on the problem. This week we confirm the problem is real and painful for a specific person. Today is not optional: A documented go/no-go backed by interview evidence. If you can't, that is the signal - not a delay.",
    "dayObjective": "Go / no-go on the problem.",
    "task": {
      "label": "Decide: is this problem real and painful enough to continue? Document the evidence for the call.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "How many people rated this a top-3 pain?",
      "What's the strongest single piece of evidence?",
      "What would make you walk away?"
    ],
    "successCriteria": "A documented go/no-go backed by interview evidence.",
    "failureSignal": "You're continuing on hope, not evidence.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate the problem?",
    "shareAngle": "Week 1 done. Problem validated with real evidence.",
    "killSwitch": "If the evidence says no, VZN forces a problem pivot now - not in Week 5."
  },
  {
    "day": 8,
    "week": 2,
    "dayOfWeek": 1,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "frame",
    "brief": "OPERATION SIGNAL - Day 1 of 7. Define what 'willing to pay' means here. This week we find out if anyone will actually exchange money for a fix. Today is not optional: A concrete price + commitment definition. If you can't, that is the signal - not a delay.",
    "dayObjective": "Define what 'willing to pay' means here.",
    "task": {
      "label": "Write your price hypothesis: what they'd pay, how often, and what 'paying' looks like.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the smallest real commitment that counts?",
      "What price feels almost too high?",
      "What are they paying for today instead?"
    ],
    "successCriteria": "A concrete price + commitment definition.",
    "failureSignal": "'They'll definitely pay' with no number attached.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Day 8. Put a number on it.",
    "killSwitch": "Zero credible buy-signals after real asks - revisit the problem or customer, not the pitch."
  },
  {
    "day": 9,
    "week": 2,
    "dayOfWeek": 2,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "execute",
    "brief": "OPERATION SIGNAL - Day 2 of 7. Make the offer real. This week we find out if anyone will actually exchange money for a fix. Today is not optional: 5 direct paid asks made. If you can't, that is the signal - not a delay.",
    "dayObjective": "Make the offer real.",
    "task": {
      "label": "Present a paid offer or pre-order to at least 5 prospects and ask directly.",
      "mode": "count",
      "target": 5
    },
    "prepQuestions": [
      "What exactly do they get for the money?",
      "How do they say yes in one step?",
      "What objection do you expect?"
    ],
    "successCriteria": "5 direct paid asks made.",
    "failureSignal": "You hinted at price but never actually asked.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Day 9. Made my first real money ask.",
    "killSwitch": "Zero credible buy-signals after real asks - revisit the problem or customer, not the pitch."
  },
  {
    "day": 10,
    "week": 2,
    "dayOfWeek": 3,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "execute",
    "brief": "OPERATION SIGNAL - Day 3 of 7. Push past the polite yes. This week we find out if anyone will actually exchange money for a fix. Today is not optional: 5 more asks with a concrete commitment requested. If you can't, that is the signal - not a delay.",
    "dayObjective": "Push past the polite yes.",
    "task": {
      "label": "Ask 5 more prospects and require a concrete next step (deposit, signature, calendar hold).",
      "mode": "count",
      "target": 5
    },
    "prepQuestions": [
      "How do you separate polite interest from real intent?",
      "What's the lowest-friction commitment?",
      "Who's most likely to convert?"
    ],
    "successCriteria": "5 more asks with a concrete commitment requested.",
    "failureSignal": "Everyone 'loves it' but no one commits to anything.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Day 10. Stopped accepting 'sounds great'.",
    "killSwitch": "Zero credible buy-signals after real asks - revisit the problem or customer, not the pitch."
  },
  {
    "day": 11,
    "week": 2,
    "dayOfWeek": 4,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "execute",
    "brief": "OPERATION SIGNAL - Day 4 of 7. Chase the maybes. This week we find out if anyone will actually exchange money for a fix. Today is not optional: Every open prospect followed up, objections logged. If you can't, that is the signal - not a delay.",
    "dayObjective": "Chase the maybes.",
    "task": {
      "label": "Follow up with everyone who didn't say no and surface the real objection.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "What's the real reason behind 'let me think'?",
      "Is it price, trust, or timing?",
      "What would turn a maybe into a yes?"
    ],
    "successCriteria": "Every open prospect followed up, objections logged.",
    "failureSignal": "You let the maybes go cold.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Day 11. Hunted down every maybe.",
    "killSwitch": "Zero credible buy-signals after real asks - revisit the problem or customer, not the pitch."
  },
  {
    "day": 12,
    "week": 2,
    "dayOfWeek": 5,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "synthesize",
    "brief": "OPERATION SIGNAL - Day 5 of 7. Tally the signal honestly. This week we find out if anyone will actually exchange money for a fix. Today is not optional: A clear yes/no tally with reasons. If you can't, that is the signal - not a delay.",
    "dayObjective": "Tally the signal honestly.",
    "task": {
      "label": "List who said yes, who balked, and the exact reason for each.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the dominant objection?",
      "Did anyone pay or commit for real?",
      "Which segment converts best?"
    ],
    "successCriteria": "A clear yes/no tally with reasons.",
    "failureSignal": "You're rounding 'maybe' up to 'yes'.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Day 12. Counted the real yeses.",
    "killSwitch": "Zero credible buy-signals after real asks - revisit the problem or customer, not the pitch."
  },
  {
    "day": 13,
    "week": 2,
    "dayOfWeek": 6,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "apply",
    "brief": "OPERATION SIGNAL - Day 6 of 7. Fix the offer. This week we find out if anyone will actually exchange money for a fix. Today is not optional: A revised offer tested on real fence-sitters. If you can't, that is the signal - not a delay.",
    "dayObjective": "Fix the offer.",
    "task": {
      "label": "Revise the price or offer to answer the top objection, then re-ask 2 fence-sitters.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What single change kills the top objection?",
      "Are you discounting or actually re-framing value?",
      "Who gets the revised ask?"
    ],
    "successCriteria": "A revised offer tested on real fence-sitters.",
    "failureSignal": "You dropped the price instead of fixing the value story.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Day 13. Rebuilt the offer around the #1 objection.",
    "killSwitch": "Zero credible buy-signals after real asks - revisit the problem or customer, not the pitch."
  },
  {
    "day": 14,
    "week": 2,
    "dayOfWeek": 7,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SIGNAL",
    "theme": "Validate willingness to pay",
    "weekObjective": "Find out if anyone will actually exchange money for a fix",
    "weekMilestone": "A documented 'yes' or a documented 'no, because X'",
    "rhythmRole": "debrief",
    "brief": "OPERATION SIGNAL - Day 7 of 7. Go / no-go on willingness to pay. This week we find out if anyone will actually exchange money for a fix. Today is not optional: A documented willingness verdict with evidence. If you can't, that is the signal - not a delay.",
    "dayObjective": "Go / no-go on willingness to pay.",
    "task": {
      "label": "Document the verdict: is there real money signal here? Capture the proof either way.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "How many credible commitments do you have?",
      "What's the honest conversion rate of asks to yes?",
      "What does the 'no' teach you?"
    ],
    "successCriteria": "A documented willingness verdict with evidence.",
    "failureSignal": "Continuing despite zero real commitment.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: validate willingness to pay?",
    "shareAngle": "Week 2 done. Money signal: documented.",
    "killSwitch": "No credible buy-signal at all - the problem or customer is wrong. Fix that before designing anything."
  },
  {
    "day": 15,
    "week": 3,
    "dayOfWeek": 1,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "frame",
    "brief": "OPERATION SKETCH - Day 1 of 7. Define the single core value. This week we define the thinnest version of the product that tests the core value. Today is not optional: One sentence naming the single core value. If you can't, that is the signal - not a delay.",
    "dayObjective": "Define the single core value.",
    "task": {
      "label": "Write the one thing the MVP must do to deliver value - everything else is optional.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "If it could only do ONE thing, what?",
      "What's the moment the user feels value?",
      "What are you tempted to add that you must not?"
    ],
    "successCriteria": "One sentence naming the single core value.",
    "failureSignal": "Your 'core' is actually three features.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Day 15. One job. That's the whole MVP.",
    "killSwitch": "If the smallest honest version still needs >2 weeks to build, the scope is wrong - cut harder."
  },
  {
    "day": 16,
    "week": 3,
    "dayOfWeek": 2,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "execute",
    "brief": "OPERATION SKETCH - Day 2 of 7. Map the critical path. This week we define the thinnest version of the product that tests the core value. Today is not optional: A drawn user flow with no detours. If you can't, that is the signal - not a delay.",
    "dayObjective": "Map the critical path.",
    "task": {
      "label": "Sketch the exact step-by-step path a user takes from arrival to value moment.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's step one for a brand-new user?",
      "Where could they get stuck?",
      "What's the shortest path to value?"
    ],
    "successCriteria": "A drawn user flow with no detours.",
    "failureSignal": "The flow has 10 steps before any value.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Day 16. Mapped the shortest path to value.",
    "killSwitch": "If the smallest honest version still needs >2 weeks to build, the scope is wrong - cut harder."
  },
  {
    "day": 17,
    "week": 3,
    "dayOfWeek": 3,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "execute",
    "brief": "OPERATION SKETCH - Day 3 of 7. Separate must-have from nice-to-have. This week we define the thinnest version of the product that tests the core value. Today is not optional: A ruthless must-have vs cut list. If you can't, that is the signal - not a delay.",
    "dayObjective": "Separate must-have from nice-to-have.",
    "task": {
      "label": "List every feature, then mark each must-have or cut for v1.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does this feature block the core value?",
      "What breaks if you remove it?",
      "What can a human do manually instead of code?"
    ],
    "successCriteria": "A ruthless must-have vs cut list.",
    "failureSignal": "Everything is 'must-have' - no real cuts made.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Day 17. Cut half the feature list.",
    "killSwitch": "If the smallest honest version still needs >2 weeks to build, the scope is wrong - cut harder."
  },
  {
    "day": 18,
    "week": 3,
    "dayOfWeek": 4,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "execute",
    "brief": "OPERATION SKETCH - Day 4 of 7. Stress-test against a real user. This week we define the thinnest version of the product that tests the core value. Today is not optional: 2 reactions to the sketch captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Stress-test against a real user.",
    "task": {
      "label": "Walk 2 prospects through the sketched flow and ask if it would actually solve their problem.",
      "mode": "count",
      "target": 2
    },
    "prepQuestions": [
      "Does the flow match how THEY described the problem?",
      "Where do they look confused?",
      "What do they expect that's missing?"
    ],
    "successCriteria": "2 reactions to the sketch captured.",
    "failureSignal": "You only showed it to yourself.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Day 18. Tested the sketch on real people.",
    "killSwitch": "If the smallest honest version still needs >2 weeks to build, the scope is wrong - cut harder."
  },
  {
    "day": 19,
    "week": 3,
    "dayOfWeek": 5,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "synthesize",
    "brief": "OPERATION SKETCH - Day 5 of 7. Write the one-page spec. This week we define the thinnest version of the product that tests the core value. Today is not optional: A complete one-page MVP spec. If you can't, that is the signal - not a delay.",
    "dayObjective": "Write the one-page spec.",
    "task": {
      "label": "Write a single page: core value, user flow, must-have features, what's deliberately excluded.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Could an engineer build from this page alone?",
      "Is the excluded list explicit?",
      "Is it one page, not five?"
    ],
    "successCriteria": "A complete one-page MVP spec.",
    "failureSignal": "The spec sprawls past one page - scope crept back in.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Day 19. Whole MVP on one page.",
    "killSwitch": "If the smallest honest version still needs >2 weeks to build, the scope is wrong - cut harder."
  },
  {
    "day": 20,
    "week": 3,
    "dayOfWeek": 6,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "apply",
    "brief": "OPERATION SKETCH - Day 6 of 7. Pick the build path. This week we define the thinnest version of the product that tests the core value. Today is not optional: A chosen build path with a dated deadline. If you can't, that is the signal - not a delay.",
    "dayObjective": "Pick the build path.",
    "task": {
      "label": "Decide how you'll build it (no-code, code, or concierge/manual) and set the ship deadline.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the fastest path to a real test?",
      "Can you fake the backend manually first?",
      "What's the hard deadline?"
    ],
    "successCriteria": "A chosen build path with a dated deadline.",
    "failureSignal": "You picked the impressive path over the fast one.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Day 20. Build path locked. Clock started.",
    "killSwitch": "If the smallest honest version still needs >2 weeks to build, the scope is wrong - cut harder."
  },
  {
    "day": 21,
    "week": 3,
    "dayOfWeek": 7,
    "phase": "VALIDATE",
    "missionCode": "OPERATION SKETCH",
    "theme": "Design the smallest solution",
    "weekObjective": "Define the thinnest version of the product that tests the core value",
    "weekMilestone": "A one-page spec of the MVP",
    "rhythmRole": "debrief",
    "brief": "OPERATION SKETCH - Day 7 of 7. Lock the scope. This week we define the thinnest version of the product that tests the core value. Today is not optional: A frozen, buildable one-page spec. If you can't, that is the signal - not a delay.",
    "dayObjective": "Lock the scope.",
    "task": {
      "label": "Confirm the spec is final and buildable in under two weeks. Document the scope freeze.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Is every item buildable in your timeline?",
      "What did you cut to get there?",
      "What's the one feature you'll regret cutting - and why it's fine?"
    ],
    "successCriteria": "A frozen, buildable one-page spec.",
    "failureSignal": "Scope still creeping - you'll never ship.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: design the smallest solution?",
    "shareAngle": "Week 3 done. MVP scoped and frozen.",
    "killSwitch": "Spec needs more than 2 weeks - you haven't cut enough. VZN sends you back to the cut list."
  },
  {
    "day": 22,
    "week": 4,
    "dayOfWeek": 1,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "frame",
    "brief": "OPERATION BUILD - Day 1 of 7. Plan the build sprint. This week we get something real in front of a real user, even if ugly. Today is not optional: A day-by-day build plan for the core path. If you can't, that is the signal - not a delay.",
    "dayObjective": "Plan the build sprint.",
    "task": {
      "label": "Break the MVP into the smallest shippable core path and schedule it across the week.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the thinnest end-to-end slice?",
      "What can you fake or stub for now?",
      "What must work by Day 7?"
    ],
    "successCriteria": "A day-by-day build plan for the core path.",
    "failureSignal": "You planned features, not a shippable slice.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Day 22. Build sprint planned.",
    "killSwitch": "No working core path by Day 7 - strip a feature, never extend the deadline."
  },
  {
    "day": 23,
    "week": 4,
    "dayOfWeek": 2,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "execute",
    "brief": "OPERATION BUILD - Day 2 of 7. Build the core path - part 1. This week we get something real in front of a real user, even if ugly. Today is not optional: The entry point of the flow works. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build the core path - part 1.",
    "task": {
      "label": "Build the first half of the critical path until a user can start the flow.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the single most important screen/step?",
      "What's blocking you right now?",
      "What's the ugly-but-works version?"
    ],
    "successCriteria": "The entry point of the flow works.",
    "failureSignal": "You're polishing pixels before the flow works.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Day 23. First half of the flow is alive.",
    "killSwitch": "No working core path by Day 7 - strip a feature, never extend the deadline."
  },
  {
    "day": 24,
    "week": 4,
    "dayOfWeek": 3,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "execute",
    "brief": "OPERATION BUILD - Day 3 of 7. Build the core path - part 2. This week we get something real in front of a real user, even if ugly. Today is not optional: A user can go start-to-value, even if rough. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build the core path - part 2.",
    "task": {
      "label": "Build the second half so a user reaches the value moment end-to-end.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does the value moment actually trigger?",
      "What's still stubbed?",
      "What's the fastest way to connect the ends?"
    ],
    "successCriteria": "A user can go start-to-value, even if rough.",
    "failureSignal": "The two halves still don't connect.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Day 24. End-to-end path connected.",
    "killSwitch": "No working core path by Day 7 - strip a feature, never extend the deadline."
  },
  {
    "day": 25,
    "week": 4,
    "dayOfWeek": 4,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "execute",
    "brief": "OPERATION BUILD - Day 4 of 7. Make it shareable. This week we get something real in front of a real user, even if ugly. Today is not optional: A shareable working link or demo. If you can't, that is the signal - not a delay.",
    "dayObjective": "Make it shareable.",
    "task": {
      "label": "Get the prototype to a link or demo you can put in someone else's hands.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Can a stranger open it without you?",
      "What breaks on someone else's device?",
      "What's the absolute minimum to share?"
    ],
    "successCriteria": "A shareable working link or demo.",
    "failureSignal": "It only works on your machine.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Day 25. It's live. There's a link.",
    "killSwitch": "No working core path by Day 7 - strip a feature, never extend the deadline."
  },
  {
    "day": 26,
    "week": 4,
    "dayOfWeek": 5,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "synthesize",
    "brief": "OPERATION BUILD - Day 5 of 7. Self-test and list the breaks. This week we get something real in front of a real user, even if ugly. Today is not optional: A prioritized list of breakages. If you can't, that is the signal - not a delay.",
    "dayObjective": "Self-test and list the breaks.",
    "task": {
      "label": "Run the full flow yourself 3 times and list every breakage in priority order.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Where does a new user hit a wall?",
      "Which break is most embarrassing?",
      "Which break is fastest to fix?"
    ],
    "successCriteria": "A prioritized list of breakages.",
    "failureSignal": "You tested the happy path only.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Day 26. Found the cracks before users did.",
    "killSwitch": "No working core path by Day 7 - strip a feature, never extend the deadline."
  },
  {
    "day": 27,
    "week": 4,
    "dayOfWeek": 6,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "apply",
    "brief": "OPERATION BUILD - Day 6 of 7. Fix the worst break. This week we get something real in front of a real user, even if ugly. Today is not optional: The core path works reliably. If you can't, that is the signal - not a delay.",
    "dayObjective": "Fix the worst break.",
    "task": {
      "label": "Fix the top breakage so the core value reliably lands.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does the core value now work every time?",
      "Did the fix break anything else?",
      "Is it good enough to demo live?"
    ],
    "successCriteria": "The core path works reliably.",
    "failureSignal": "You fixed cosmetics, not the core break.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Day 27. Killed the worst bug.",
    "killSwitch": "No working core path by Day 7 - strip a feature, never extend the deadline."
  },
  {
    "day": 28,
    "week": 4,
    "dayOfWeek": 7,
    "phase": "VALIDATE",
    "missionCode": "OPERATION BUILD",
    "theme": "Ship a working prototype",
    "weekObjective": "Get something real in front of a real user, even if ugly",
    "weekMilestone": "A working link or demo, not a deck",
    "rhythmRole": "debrief",
    "brief": "OPERATION BUILD - Day 7 of 7. Demo it live. This week we get something real in front of a real user, even if ugly. Today is not optional: A live demo done, reaction captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Demo it live.",
    "task": {
      "label": "Walk one real person through the working prototype live and document their reaction.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Did they reach the value moment unaided?",
      "Where did they hesitate?",
      "Would they use it again?"
    ],
    "successCriteria": "A live demo done, reaction captured.",
    "failureSignal": "You described it instead of demoing it.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: ship a working prototype?",
    "shareAngle": "Week 4 done. Working prototype in real hands.",
    "killSwitch": "Still no working path - cut the hardest feature and ship the rest. Do not extend."
  },
  {
    "day": 29,
    "week": 5,
    "dayOfWeek": 1,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "frame",
    "brief": "OPERATION FIRST FIVE - Day 1 of 7. Define a 'real session' and where to find five. This week we get 5 people who are not friends or family actually using it. Today is not optional: A session definition + a sourced list of 5. If you can't, that is the signal - not a delay.",
    "dayObjective": "Define a 'real session' and where to find five.",
    "task": {
      "label": "Write what counts as a real session and list where 5 non-friends will come from.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What action proves a real session?",
      "Which channel from Week 1 still has warm prospects?",
      "Why would a stranger try it today?"
    ],
    "successCriteria": "A session definition + a sourced list of 5.",
    "failureSignal": "'Real user' is undefined, so you'll fool yourself.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Day 29. Defined what a real user means.",
    "killSwitch": "Fewer than 2 real users - it's a channel or offer problem; fix that before Week 6."
  },
  {
    "day": 30,
    "week": 5,
    "dayOfWeek": 2,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "execute",
    "brief": "OPERATION FIRST FIVE - Day 2 of 7. Drive the first signups. This week we get 5 people who are not friends or family actually using it. Today is not optional: 2 real users onboarded with a session each. If you can't, that is the signal - not a delay.",
    "dayObjective": "Drive the first signups.",
    "task": {
      "label": "Get the prototype in front of prospects and onboard the first 2 real users.",
      "mode": "count",
      "target": 2
    },
    "prepQuestions": [
      "What's the one-line reason to try it now?",
      "What's the friction in signup?",
      "Who's most likely to say yes today?"
    ],
    "successCriteria": "2 real users onboarded with a session each.",
    "failureSignal": "Only friends signed up.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Day 30. First 2 real users in.",
    "killSwitch": "Fewer than 2 real users - it's a channel or offer problem; fix that before Week 6."
  },
  {
    "day": 31,
    "week": 5,
    "dayOfWeek": 3,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "execute",
    "brief": "OPERATION FIRST FIVE - Day 3 of 7. Get to five. This week we get 5 people who are not friends or family actually using it. Today is not optional: 5 total real users with logged sessions. If you can't, that is the signal - not a delay.",
    "dayObjective": "Get to five.",
    "task": {
      "label": "Onboard 3 more real users to reach five total with real sessions.",
      "mode": "count",
      "target": 3
    },
    "prepQuestions": [
      "What worked for the first two?",
      "Where are users dropping before value?",
      "What's the fastest source of 3 more?"
    ],
    "successCriteria": "5 total real users with logged sessions.",
    "failureSignal": "Stuck at 2 - the source is dry.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Day 31. Five real strangers using it.",
    "killSwitch": "Fewer than 2 real users - it's a channel or offer problem; fix that before Week 6."
  },
  {
    "day": 32,
    "week": 5,
    "dayOfWeek": 4,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "execute",
    "brief": "OPERATION FIRST FIVE - Day 4 of 7. Watch them use it. This week we get 5 people who are not friends or family actually using it. Today is not optional: Session behavior captured for all 5. If you can't, that is the signal - not a delay.",
    "dayObjective": "Watch them use it.",
    "task": {
      "label": "Observe or instrument what your users actually do and where they stop.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Where exactly do they drop off?",
      "Do they reach the value moment?",
      "What do they ignore entirely?"
    ],
    "successCriteria": "Session behavior captured for all 5.",
    "failureSignal": "You're guessing at usage instead of measuring.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Day 32. Watched real usage, not assumptions.",
    "killSwitch": "Fewer than 2 real users - it's a channel or offer problem; fix that before Week 6."
  },
  {
    "day": 33,
    "week": 5,
    "dayOfWeek": 5,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "synthesize",
    "brief": "OPERATION FIRST FIVE - Day 5 of 7. Find the drop-off. This week we get 5 people who are not friends or family actually using it. Today is not optional: The #1 drop-off point, clearly named. If you can't, that is the signal - not a delay.",
    "dayObjective": "Find the drop-off.",
    "task": {
      "label": "Identify the single biggest point where users stall or leave.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the most common exit point?",
      "Is it confusion, friction, or no value?",
      "What did engaged users do differently?"
    ],
    "successCriteria": "The #1 drop-off point, clearly named.",
    "failureSignal": "No clear pattern - too few sessions to learn.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Day 33. Found where users fall off.",
    "killSwitch": "Fewer than 2 real users - it's a channel or offer problem; fix that before Week 6."
  },
  {
    "day": 34,
    "week": 5,
    "dayOfWeek": 6,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "apply",
    "brief": "OPERATION FIRST FIVE - Day 6 of 7. Fix the worst drop-off. This week we get 5 people who are not friends or family actually using it. Today is not optional: Drop-off fix shipped and re-tested. If you can't, that is the signal - not a delay.",
    "dayObjective": "Fix the worst drop-off.",
    "task": {
      "label": "Make one change that reduces the biggest drop-off, then re-test with a user.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does the change attack the real cause?",
      "Can you test it with one user today?",
      "What metric proves it worked?"
    ],
    "successCriteria": "Drop-off fix shipped and re-tested.",
    "failureSignal": "You changed something unrelated to the drop-off.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Day 34. Patched the leak.",
    "killSwitch": "Fewer than 2 real users - it's a channel or offer problem; fix that before Week 6."
  },
  {
    "day": 35,
    "week": 5,
    "dayOfWeek": 7,
    "phase": "BUILD",
    "missionCode": "OPERATION FIRST FIVE",
    "theme": "First real users",
    "weekObjective": "Get 5 people who are not friends or family actually using it",
    "weekMilestone": "5 logged users with at least one real session each",
    "rhythmRole": "debrief",
    "brief": "OPERATION FIRST FIVE - Day 7 of 7. Confirm five real sessions. This week we get 5 people who are not friends or family actually using it. Today is not optional: 5 verified real sessions documented. If you can't, that is the signal - not a delay.",
    "dayObjective": "Confirm five real sessions.",
    "task": {
      "label": "Verify you have 5 real users with genuine sessions and document the proof.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "How many are truly non-friends?",
      "Did each reach a real session?",
      "Which user is most likely to return?"
    ],
    "successCriteria": "5 verified real sessions documented.",
    "failureSignal": "You're counting friends to hit the number.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first real users?",
    "shareAngle": "Week 5 done. Five real users, proven.",
    "killSwitch": "Under 2 real users - stop adding features; the offer or channel is broken."
  },
  {
    "day": 36,
    "week": 6,
    "dayOfWeek": 1,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "frame",
    "brief": "OPERATION FEEDBACK - Day 1 of 7. Write the feedback questions. This week we talk to those users, find what they hate, and kill it. Today is not optional: 5 sharp, non-leading feedback questions. If you can't, that is the signal - not a delay.",
    "dayObjective": "Write the feedback questions.",
    "task": {
      "label": "Write the 5 questions that reveal what users love, ignore, and hate.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What question reveals real value, not politeness?",
      "How will you ask what they'd miss if it vanished?",
      "How do you avoid leading them?"
    ],
    "successCriteria": "5 sharp, non-leading feedback questions.",
    "failureSignal": "Your questions beg for compliments.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Day 36. Wrote questions that get the truth.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 37,
    "week": 6,
    "dayOfWeek": 2,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "execute",
    "brief": "OPERATION FEEDBACK - Day 2 of 7. Interview your users. This week we talk to those users, find what they hate, and kill it. Today is not optional: 4 user feedback interviews done. If you can't, that is the signal - not a delay.",
    "dayObjective": "Interview your users.",
    "task": {
      "label": "Talk to at least 4 of your 5 users about what they actually use and avoid.",
      "mode": "count",
      "target": 4
    },
    "prepQuestions": [
      "What do they open it for?",
      "What have they never touched?",
      "What frustrated them?"
    ],
    "successCriteria": "4 user feedback interviews done.",
    "failureSignal": "You asked 'do you like it?' and got 'yes'.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Day 37. Heard the hard feedback.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 38,
    "week": 6,
    "dayOfWeek": 3,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "execute",
    "brief": "OPERATION FEEDBACK - Day 3 of 7. Dig into the ignored parts. This week we talk to those users, find what they hate, and kill it. Today is not optional: Clear reasons for each ignored feature. If you can't, that is the signal - not a delay.",
    "dayObjective": "Dig into the ignored parts.",
    "task": {
      "label": "Probe specifically why the least-used features go untouched.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Is it undiscovered, confusing, or unwanted?",
      "Would they notice if it disappeared?",
      "What were they expecting instead?"
    ],
    "successCriteria": "Clear reasons for each ignored feature.",
    "failureSignal": "You defended features instead of probing them.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Day 38. Found what nobody uses.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 39,
    "week": 6,
    "dayOfWeek": 4,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "synthesize",
    "brief": "OPERATION FEEDBACK - Day 4 of 7. Name the loved and the dead. This week we talk to those users, find what they hate, and kill it. Today is not optional: One loved + one dead feature, named. If you can't, that is the signal - not a delay.",
    "dayObjective": "Name the loved and the dead.",
    "task": {
      "label": "Identify the one most-loved feature and the one most-ignored.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the single feature they'd fight to keep?",
      "What's pure dead weight?",
      "What surprised you about their priorities?"
    ],
    "successCriteria": "One loved + one dead feature, named.",
    "failureSignal": "Everything seems equally 'fine' - dig deeper.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Day 39. Found the one feature they love.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 40,
    "week": 6,
    "dayOfWeek": 5,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "apply",
    "brief": "OPERATION FEEDBACK - Day 5 of 7. Kill something. This week we talk to those users, find what they hate, and kill it. Today is not optional: One feature cut, the loved one strengthened. If you can't, that is the signal - not a delay.",
    "dayObjective": "Kill something.",
    "task": {
      "label": "Remove or hide the most-ignored feature and double down on the most-loved one.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What exactly are you removing?",
      "How does cutting it sharpen the product?",
      "How will you amplify the loved feature?"
    ],
    "successCriteria": "One feature cut, the loved one strengthened.",
    "failureSignal": "You couldn't bring yourself to cut anything.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Day 40. Killed a feature. On purpose.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 41,
    "week": 6,
    "dayOfWeek": 6,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "execute",
    "brief": "OPERATION FEEDBACK - Day 6 of 7. Ship the trimmed version. This week we talk to those users, find what they hate, and kill it. Today is not optional: A leaner version shipped to users. If you can't, that is the signal - not a delay.",
    "dayObjective": "Ship the trimmed version.",
    "task": {
      "label": "Release the leaner product and tell users what changed.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Is the core value now more obvious?",
      "Did removal break any flow?",
      "How will you tell users?"
    ],
    "successCriteria": "A leaner version shipped to users.",
    "failureSignal": "You trimmed it locally but never shipped.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Day 41. Shipped a sharper, smaller product.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 42,
    "week": 6,
    "dayOfWeek": 7,
    "phase": "BUILD",
    "missionCode": "OPERATION FEEDBACK",
    "theme": "Cut what doesn't work",
    "weekObjective": "Talk to those users, find what they hate, and kill it",
    "weekMilestone": "A revised feature list with at least one thing removed",
    "rhythmRole": "debrief",
    "brief": "OPERATION FEEDBACK - Day 7 of 7. Confirm the cut was right. This week we talk to those users, find what they hate, and kill it. Today is not optional: A documented, trimmed feature list. If you can't, that is the signal - not a delay.",
    "dayObjective": "Confirm the cut was right.",
    "task": {
      "label": "Check whether users noticed the removal and document the revised feature list.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Did anyone miss the cut feature?",
      "Is the value prop clearer now?",
      "What's the next thing to cut?"
    ],
    "successCriteria": "A documented, trimmed feature list.",
    "failureSignal": "You added features back under pressure.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: cut what doesn't work?",
    "shareAngle": "Week 6 done. Leaner product, proven cuts.",
    "killSwitch": "If users can't name one thing they value, the value prop itself is unproven - go back to it."
  },
  {
    "day": 43,
    "week": 7,
    "dayOfWeek": 1,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "frame",
    "brief": "OPERATION PROOF - Day 1 of 7. Design the ask. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: A concrete, one-step paid offer. If you can't, that is the signal - not a delay.",
    "dayObjective": "Design the ask.",
    "task": {
      "label": "Define the exact paid offer: price, what they get, and the one-step way to pay.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the price for your best users?",
      "What's the single click to pay?",
      "What guarantee removes the risk?"
    ],
    "successCriteria": "A concrete, one-step paid offer.",
    "failureSignal": "The path to pay has 4 steps and no clear price.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Day 43. Built a real way to pay.",
    "killSwitch": "Zero payment after genuine asks - there's a pricing or value gap; confront it, don't ignore it."
  },
  {
    "day": 44,
    "week": 7,
    "dayOfWeek": 2,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "execute",
    "brief": "OPERATION PROOF - Day 2 of 7. Ask your warmest users. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: Every warm user asked to pay. If you can't, that is the signal - not a delay.",
    "dayObjective": "Ask your warmest users.",
    "task": {
      "label": "Make the paid ask to every engaged user and request a real commitment.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Who gets the most value today?",
      "What's the natural moment to ask?",
      "What objection do you expect from each?"
    ],
    "successCriteria": "Every warm user asked to pay.",
    "failureSignal": "You hinted but never named the price.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Day 44. Asked my best users for money.",
    "killSwitch": "Zero payment after genuine asks - there's a pricing or value gap; confront it, don't ignore it."
  },
  {
    "day": 45,
    "week": 7,
    "dayOfWeek": 3,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "execute",
    "brief": "OPERATION PROOF - Day 3 of 7. Widen the ask. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: Paid offer extended to 5+ prospects. If you can't, that is the signal - not a delay.",
    "dayObjective": "Widen the ask.",
    "task": {
      "label": "Extend the paid offer to warm prospects beyond current users.",
      "mode": "count",
      "target": 5
    },
    "prepQuestions": [
      "Which prospects already showed buy-signal?",
      "What proof can you show them now?",
      "What's the deadline that creates urgency?"
    ],
    "successCriteria": "Paid offer extended to 5+ prospects.",
    "failureSignal": "You only asked people who'd already say no.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Day 45. Took the offer wider.",
    "killSwitch": "Zero payment after genuine asks - there's a pricing or value gap; confront it, don't ignore it."
  },
  {
    "day": 46,
    "week": 7,
    "dayOfWeek": 4,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "execute",
    "brief": "OPERATION PROOF - Day 4 of 7. Handle the objections live. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: Every maybe followed up, blockers surfaced. If you can't, that is the signal - not a delay.",
    "dayObjective": "Handle the objections live.",
    "task": {
      "label": "Follow up on every 'maybe' and resolve the real blocker to payment.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Is it price, trust, or timing?",
      "What proof closes the trust gap?",
      "What's the smallest yes you'd accept?"
    ],
    "successCriteria": "Every maybe followed up, blockers surfaced.",
    "failureSignal": "You let payment-ready people slip away.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Day 46. Chased every almost-yes.",
    "killSwitch": "Zero payment after genuine asks - there's a pricing or value gap; confront it, don't ignore it."
  },
  {
    "day": 47,
    "week": 7,
    "dayOfWeek": 5,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "synthesize",
    "brief": "OPERATION PROOF - Day 5 of 7. Analyze who paid and who didn't. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: A clear conversion analysis. If you can't, that is the signal - not a delay.",
    "dayObjective": "Analyze who paid and who didn't.",
    "task": {
      "label": "List converters vs non-converters and the deciding factor for each.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What do payers have in common?",
      "What's the most common reason for no?",
      "Which segment converts best?"
    ],
    "successCriteria": "A clear conversion analysis.",
    "failureSignal": "You're averaging away the real signal.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Day 47. Learned exactly who pays.",
    "killSwitch": "Zero payment after genuine asks - there's a pricing or value gap; confront it, don't ignore it."
  },
  {
    "day": 48,
    "week": 7,
    "dayOfWeek": 6,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "apply",
    "brief": "OPERATION PROOF - Day 6 of 7. Re-ask the fence-sitters. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: Revised offer re-presented to hesitators. If you can't, that is the signal - not a delay.",
    "dayObjective": "Re-ask the fence-sitters.",
    "task": {
      "label": "Adjust the offer to the top objection and re-approach those who hesitated.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What single change unlocks the most yeses?",
      "Are you fixing value or just cutting price?",
      "Who's first to re-ask?"
    ],
    "successCriteria": "Revised offer re-presented to hesitators.",
    "failureSignal": "You discounted to zero margin to force a yes.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Day 48. Rebuilt the offer and re-asked.",
    "killSwitch": "Zero payment after genuine asks - there's a pricing or value gap; confront it, don't ignore it."
  },
  {
    "day": 49,
    "week": 7,
    "dayOfWeek": 7,
    "phase": "BUILD",
    "missionCode": "OPERATION PROOF",
    "theme": "First paying signal",
    "weekObjective": "Get a payment, a deposit, or a binding commitment to pay",
    "weekMilestone": "First Rs.1 of real revenue or a signed pre-order",
    "rhythmRole": "debrief",
    "brief": "OPERATION PROOF - Day 7 of 7. Bank the proof. This week we get a payment, a deposit, or a binding commitment to pay. Today is not optional: First payment banked or blocker documented. If you can't, that is the signal - not a delay.",
    "dayObjective": "Bank the proof.",
    "task": {
      "label": "Secure the first real payment or document precisely why it isn't happening yet.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Did real money or a binding commitment land?",
      "If not, what's the exact blocker?",
      "What's the path to first revenue?"
    ],
    "successCriteria": "First payment banked or blocker documented.",
    "failureSignal": "Calling 'interested' the same as 'paid'.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: first paying signal?",
    "shareAngle": "Week 7 done. First real money signal.",
    "killSwitch": "No payment after honest asks - pricing or value gap. VZN makes you confront which, not push harder."
  },
  {
    "day": 50,
    "week": 8,
    "dayOfWeek": 1,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "frame",
    "brief": "OPERATION MOAT - Day 1 of 7. List what's hard to copy. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: A list of candidate moats specific to you. If you can't, that is the signal - not a delay.",
    "dayObjective": "List what's hard to copy.",
    "task": {
      "label": "Write down every asset in your situation a competitor couldn't replicate in a week.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What do you have that took real time to build?",
      "What relationship or data is uniquely yours?",
      "What would a competitor struggle to copy?"
    ],
    "successCriteria": "A list of candidate moats specific to you.",
    "failureSignal": "Your list is all generic 'speed' and 'passion'.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Day 50. Mapped what's actually hard to copy.",
    "killSwitch": "If your only moat is 'we work harder', that's not a moat. Find a real one."
  },
  {
    "day": 51,
    "week": 8,
    "dayOfWeek": 2,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "execute",
    "brief": "OPERATION MOAT - Day 2 of 7. Investigate the strongest candidate. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: A reality-checked view of your top moat. If you can't, that is the signal - not a delay.",
    "dayObjective": "Investigate the strongest candidate.",
    "task": {
      "label": "Research how durable your best moat candidate really is against competitors.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Could a funded competitor copy it in a month?",
      "What makes it compound over time?",
      "Who else is trying this?"
    ],
    "successCriteria": "A reality-checked view of your top moat.",
    "failureSignal": "You assumed it's defensible without checking.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Day 51. Pressure-tested my best moat.",
    "killSwitch": "If your only moat is 'we work harder', that's not a moat. Find a real one."
  },
  {
    "day": 52,
    "week": 8,
    "dayOfWeek": 3,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "execute",
    "brief": "OPERATION MOAT - Day 3 of 7. Gather the compounding asset. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: First units of the compounding asset captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Gather the compounding asset.",
    "task": {
      "label": "Take concrete steps to accumulate the asset that strengthens with use (data, community, integrations).",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What asset grows every time a user engages?",
      "How do you start accumulating it now?",
      "What's the first measurable unit?"
    ],
    "successCriteria": "First units of the compounding asset captured.",
    "failureSignal": "You theorized a moat but built none of it.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Day 52. Started stacking the moat.",
    "killSwitch": "If your only moat is 'we work harder', that's not a moat. Find a real one."
  },
  {
    "day": 53,
    "week": 8,
    "dayOfWeek": 4,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "execute",
    "brief": "OPERATION MOAT - Day 4 of 7. Talk to users about lock-in. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: User-grounded lock-in insights captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Talk to users about lock-in.",
    "task": {
      "label": "Ask users what would make leaving your product painful or pointless.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "What would they lose by switching?",
      "What keeps them coming back?",
      "What would make them never leave?"
    ],
    "successCriteria": "User-grounded lock-in insights captured.",
    "failureSignal": "You guessed at stickiness instead of asking.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Day 53. Learned what makes them stay.",
    "killSwitch": "If your only moat is 'we work harder', that's not a moat. Find a real one."
  },
  {
    "day": 54,
    "week": 8,
    "dayOfWeek": 5,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "synthesize",
    "brief": "OPERATION MOAT - Day 5 of 7. Name the one moat. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: One named, defensible moat with rationale. If you can't, that is the signal - not a delay.",
    "dayObjective": "Name the one moat.",
    "task": {
      "label": "Choose the single moat you'll invest in and write why it's defensible.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Is it specific and real, not a slogan?",
      "Why can't a competitor copy it fast?",
      "How does it compound?"
    ],
    "successCriteria": "One named, defensible moat with rationale.",
    "failureSignal": "Still hedging across three vague 'moats'.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Day 54. Named the one moat that matters.",
    "killSwitch": "If your only moat is 'we work harder', that's not a moat. Find a real one."
  },
  {
    "day": 55,
    "week": 8,
    "dayOfWeek": 6,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "apply",
    "brief": "OPERATION MOAT - Day 6 of 7. Take a concrete moat step. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: A concrete first step on the moat, done. If you can't, that is the signal - not a delay.",
    "dayObjective": "Take a concrete moat step.",
    "task": {
      "label": "Make one real investment that starts building the chosen moat this week.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the smallest real step today?",
      "How will you measure it growing?",
      "What habit makes it compound weekly?"
    ],
    "successCriteria": "A concrete first step on the moat, done.",
    "failureSignal": "You wrote about the moat but invested nothing.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Day 55. Took the first real moat step.",
    "killSwitch": "If your only moat is 'we work harder', that's not a moat. Find a real one."
  },
  {
    "day": 56,
    "week": 8,
    "dayOfWeek": 7,
    "phase": "BUILD",
    "missionCode": "OPERATION MOAT",
    "theme": "Start the defensibility",
    "weekObjective": "Identify and begin building what competitors can't copy in a sprint",
    "weekMilestone": "A named, specific moat - not 'we move faster'",
    "rhythmRole": "debrief",
    "brief": "OPERATION MOAT - Day 7 of 7. Document the moat thesis. This week we identify and begin building what competitors can't copy in a sprint. Today is not optional: A defensible one-paragraph moat thesis. If you can't, that is the signal - not a delay.",
    "dayObjective": "Document the moat thesis.",
    "task": {
      "label": "Write the one-paragraph moat thesis you'd defend to an investor.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Would a sharp VC believe it?",
      "What evidence backs it?",
      "What's the risk to the moat?"
    ],
    "successCriteria": "A defensible one-paragraph moat thesis.",
    "failureSignal": "The thesis collapses under one hard question.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: start the defensibility?",
    "shareAngle": "Week 8 done. Real moat, named and started.",
    "killSwitch": "Only moat is effort - VZN rejects it and sends you back to find a structural one."
  },
  {
    "day": 57,
    "week": 9,
    "dayOfWeek": 1,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "frame",
    "brief": "OPERATION CHANNEL - Day 1 of 7. Pick the channels and the measure. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: 2-3 channels chosen with a measurement plan. If you can't, that is the signal - not a delay.",
    "dayObjective": "Pick the channels and the measure.",
    "task": {
      "label": "Choose 2-3 acquisition channels to test and define how you'll measure cost-per-user.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Where does your customer already spend attention?",
      "What's the cheapest channel to test first?",
      "How will you measure cost per user?"
    ],
    "successCriteria": "2-3 channels chosen with a measurement plan.",
    "failureSignal": "You picked channels because they're easy, not because users are there.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Day 57. Picked my channel experiments.",
    "killSwitch": "If no channel returns any signal, the problem is upstream in offer or message - fix that first."
  },
  {
    "day": 58,
    "week": 9,
    "dayOfWeek": 2,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "execute",
    "brief": "OPERATION CHANNEL - Day 2 of 7. Run channel test 1. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: Channel 1 tested with real numbers. If you can't, that is the signal - not a delay.",
    "dayObjective": "Run channel test 1.",
    "task": {
      "label": "Run a small, measurable test on the first channel and log results.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "What's the minimum spend to get signal?",
      "What's the call-to-action?",
      "What counts as a win?"
    ],
    "successCriteria": "Channel 1 tested with real numbers.",
    "failureSignal": "You ran it but didn't track the cost.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Day 58. First channel, real data.",
    "killSwitch": "If no channel returns any signal, the problem is upstream in offer or message - fix that first."
  },
  {
    "day": 59,
    "week": 9,
    "dayOfWeek": 3,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "execute",
    "brief": "OPERATION CHANNEL - Day 3 of 7. Run channel test 2. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: Channel 2 tested and compared. If you can't, that is the signal - not a delay.",
    "dayObjective": "Run channel test 2.",
    "task": {
      "label": "Run the second channel test under the same measurement.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "How does the CTA differ here?",
      "What's comparable across channels?",
      "What's surprising vs channel 1?"
    ],
    "successCriteria": "Channel 2 tested and compared.",
    "failureSignal": "You changed too many variables to compare.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Day 59. Second channel tested.",
    "killSwitch": "If no channel returns any signal, the problem is upstream in offer or message - fix that first."
  },
  {
    "day": 60,
    "week": 9,
    "dayOfWeek": 4,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "execute",
    "brief": "OPERATION CHANNEL - Day 4 of 7. Run channel test 3. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: Three channels tested or one deepened. If you can't, that is the signal - not a delay.",
    "dayObjective": "Run channel test 3.",
    "task": {
      "label": "Run the third channel test or double the most promising one.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Which channel hinted at signal?",
      "Is it worth a third test or a deeper second?",
      "What's the cost trend?"
    ],
    "successCriteria": "Three channels tested or one deepened.",
    "failureSignal": "You spread too thin to learn from any.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Day 60. Closed out the channel tests.",
    "killSwitch": "If no channel returns any signal, the problem is upstream in offer or message - fix that first."
  },
  {
    "day": 61,
    "week": 9,
    "dayOfWeek": 5,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "synthesize",
    "brief": "OPERATION CHANNEL - Day 5 of 7. Compare cost-per-user. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: A cost-per-user comparison across channels. If you can't, that is the signal - not a delay.",
    "dayObjective": "Compare cost-per-user.",
    "task": {
      "label": "Calculate and compare the real cost-per-user across every channel tested.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which channel is cheapest per real user?",
      "Which scales without you?",
      "Which is a dead end?"
    ],
    "successCriteria": "A cost-per-user comparison across channels.",
    "failureSignal": "You compared vanity clicks, not real users.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Day 61. Found my cheapest real channel.",
    "killSwitch": "If no channel returns any signal, the problem is upstream in offer or message - fix that first."
  },
  {
    "day": 62,
    "week": 9,
    "dayOfWeek": 6,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "apply",
    "brief": "OPERATION CHANNEL - Day 6 of 7. Commit to the winner. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: One channel committed with a daily action. If you can't, that is the signal - not a delay.",
    "dayObjective": "Commit to the winner.",
    "task": {
      "label": "Pick the one channel to scale and define the daily action that drives it.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which channel has the best cost AND scale?",
      "What daily action feeds it?",
      "What will you stop doing to focus?"
    ],
    "successCriteria": "One channel committed with a daily action.",
    "failureSignal": "You're keeping all three to avoid choosing.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Day 62. Bet on one channel.",
    "killSwitch": "If no channel returns any signal, the problem is upstream in offer or message - fix that first."
  },
  {
    "day": 63,
    "week": 9,
    "dayOfWeek": 7,
    "phase": "BUILD",
    "missionCode": "OPERATION CHANNEL",
    "theme": "Find the repeatable channel",
    "weekObjective": "Test 2-3 acquisition channels and find the one with real signal",
    "weekMilestone": "One channel with a measured cost-per-user",
    "rhythmRole": "debrief",
    "brief": "OPERATION CHANNEL - Day 7 of 7. Document the channel decision. This week we test 2-3 acquisition channels and find the one with real signal. Today is not optional: A documented channel decision with numbers. If you can't, that is the signal - not a delay.",
    "dayObjective": "Document the channel decision.",
    "task": {
      "label": "Write up the winning channel, its cost-per-user, and why you chose it.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Is the cost-per-user real and repeatable?",
      "Can someone else run this channel?",
      "What's the risk it dries up?"
    ],
    "successCriteria": "A documented channel decision with numbers.",
    "failureSignal": "The 'winner' was chosen on vibes, not cost.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: find the repeatable channel?",
    "shareAngle": "Week 9 done. One repeatable channel, measured.",
    "killSwitch": "No channel shows signal - the offer/message is the bottleneck, not the channel. Go fix it."
  },
  {
    "day": 64,
    "week": 10,
    "dayOfWeek": 1,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "frame",
    "brief": "OPERATION SCALE - Day 1 of 7. Set the growth target. This week we stop testing, start pushing the one channel that worked. Today is not optional: A concrete growth target with daily math. If you can't, that is the signal - not a delay.",
    "dayObjective": "Set the growth target.",
    "task": {
      "label": "Set a specific 2-3x user target for the week and the daily number that hits it.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the realistic 2-3x target?",
      "What daily volume gets you there?",
      "What's the one metric you'll watch hourly?"
    ],
    "successCriteria": "A concrete growth target with daily math.",
    "failureSignal": "A vague 'grow more' with no number.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Day 64. Set the growth target.",
    "killSwitch": "If the channel breaks at higher volume, find the constraint before Week 11 - don't paper over it."
  },
  {
    "day": 65,
    "week": 10,
    "dayOfWeek": 2,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "execute",
    "brief": "OPERATION SCALE - Day 2 of 7. Push the channel - day 1. This week we stop testing, start pushing the one channel that worked. Today is not optional: Channel run hard, day-1 numbers logged. If you can't, that is the signal - not a delay.",
    "dayObjective": "Push the channel - day 1.",
    "task": {
      "label": "Run the winning channel at full daily volume and log the intake.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "What's today's volume target?",
      "Where's the first strain showing?",
      "What's converting best?"
    ],
    "successCriteria": "Channel run hard, day-1 numbers logged.",
    "failureSignal": "You eased off instead of pushing.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Day 65. Opened the throttle.",
    "killSwitch": "If the channel breaks at higher volume, find the constraint before Week 11 - don't paper over it."
  },
  {
    "day": 66,
    "week": 10,
    "dayOfWeek": 3,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "execute",
    "brief": "OPERATION SCALE - Day 3 of 7. Push the channel - day 2. This week we stop testing, start pushing the one channel that worked. Today is not optional: Sustained volume, strain points captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Push the channel - day 2.",
    "task": {
      "label": "Sustain full volume and capture where the funnel strains under load.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Is conversion holding at volume?",
      "What broke that didn't at small scale?",
      "What's the bottleneck forming?"
    ],
    "successCriteria": "Sustained volume, strain points captured.",
    "failureSignal": "Volume dropped because you got distracted.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Day 66. Held the line at volume.",
    "killSwitch": "If the channel breaks at higher volume, find the constraint before Week 11 - don't paper over it."
  },
  {
    "day": 67,
    "week": 10,
    "dayOfWeek": 4,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "execute",
    "brief": "OPERATION SCALE - Day 4 of 7. Push the channel - day 3. This week we stop testing, start pushing the one channel that worked. Today is not optional: Three days of volume, trend confirmed. If you can't, that is the signal - not a delay.",
    "dayObjective": "Push the channel - day 3.",
    "task": {
      "label": "Run a third day at volume and confirm the growth trend is real, not a spike.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Is growth compounding or flattening?",
      "Is the cost-per-user holding?",
      "What's the limiting resource now?"
    ],
    "successCriteria": "Three days of volume, trend confirmed.",
    "failureSignal": "One good day you're calling a trend.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Day 67. Confirmed it's a trend, not a spike.",
    "killSwitch": "If the channel breaks at higher volume, find the constraint before Week 11 - don't paper over it."
  },
  {
    "day": 68,
    "week": 10,
    "dayOfWeek": 5,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "synthesize",
    "brief": "OPERATION SCALE - Day 5 of 7. Find the bottleneck. This week we stop testing, start pushing the one channel that worked. Today is not optional: The #1 growth bottleneck, named. If you can't, that is the signal - not a delay.",
    "dayObjective": "Find the bottleneck.",
    "task": {
      "label": "Identify the single constraint capping your growth (capacity, onboarding, cost, support).",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What breaks first as volume rises?",
      "Is it a people, product, or money limit?",
      "What's the cheapest way to widen it?"
    ],
    "successCriteria": "The #1 growth bottleneck, named.",
    "failureSignal": "You blame the channel instead of the constraint.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Day 68. Found the ceiling.",
    "killSwitch": "If the channel breaks at higher volume, find the constraint before Week 11 - don't paper over it."
  },
  {
    "day": 69,
    "week": 10,
    "dayOfWeek": 6,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "apply",
    "brief": "OPERATION SCALE - Day 6 of 7. Widen the bottleneck. This week we stop testing, start pushing the one channel that worked. Today is not optional: Bottleneck widened and re-tested at volume. If you can't, that is the signal - not a delay.",
    "dayObjective": "Widen the bottleneck.",
    "task": {
      "label": "Make one change that lifts the constraint, then push volume again to test it.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does the fix actually raise the ceiling?",
      "What's the next constraint behind it?",
      "Did cost-per-user stay healthy?"
    ],
    "successCriteria": "Bottleneck widened and re-tested at volume.",
    "failureSignal": "You optimized something that wasn't the limit.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Day 69. Lifted the ceiling.",
    "killSwitch": "If the channel breaks at higher volume, find the constraint before Week 11 - don't paper over it."
  },
  {
    "day": 70,
    "week": 10,
    "dayOfWeek": 7,
    "phase": "PROVE",
    "missionCode": "OPERATION SCALE",
    "theme": "Push what's working",
    "weekObjective": "Stop testing, start pushing the one channel that worked",
    "weekMilestone": "A 2-3x increase in users from that channel",
    "rhythmRole": "debrief",
    "brief": "OPERATION SCALE - Day 7 of 7. Confirm the multiple. This week we stop testing, start pushing the one channel that worked. Today is not optional: A documented 2-3x with the driving lever. If you can't, that is the signal - not a delay.",
    "dayObjective": "Confirm the multiple.",
    "task": {
      "label": "Verify you hit a real 2-3x and document the growth and what enabled it.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Did you actually hit 2-3x real users?",
      "What single lever drove it?",
      "Is it repeatable next week?"
    ],
    "successCriteria": "A documented 2-3x with the driving lever.",
    "failureSignal": "You hit the number once but can't repeat it.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: push what's working?",
    "shareAngle": "Week 10 done. Growth, multiplied and proven.",
    "killSwitch": "Channel collapses at volume - find the true constraint now; scaling a broken funnel just burns cash."
  },
  {
    "day": 71,
    "week": 11,
    "dayOfWeek": 1,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "frame",
    "brief": "OPERATION NUMBERS - Day 1 of 7. List the numbers that matter. This week we know your real CAC, real margin, and real burn rate. Today is not optional: A defined list of the metrics to compute. If you can't, that is the signal - not a delay.",
    "dayObjective": "List the numbers that matter.",
    "task": {
      "label": "Write the exact metrics you need: CAC, contribution margin, retention, and burn.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What does it really cost to get one user?",
      "What do you keep per user after costs?",
      "How long is your runway?"
    ],
    "successCriteria": "A defined list of the metrics to compute.",
    "failureSignal": "You're tracking vanity metrics instead of these.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Day 71. Listed the numbers that decide everything.",
    "killSwitch": "If the economics are fundamentally underwater, confront it now - a pitch can't hide broken math."
  },
  {
    "day": 72,
    "week": 11,
    "dayOfWeek": 2,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "execute",
    "brief": "OPERATION NUMBERS - Day 2 of 7. Pull real acquisition costs. This week we know your real CAC, real margin, and real burn rate. Today is not optional: Real CAC computed from actuals. If you can't, that is the signal - not a delay.",
    "dayObjective": "Pull real acquisition costs.",
    "task": {
      "label": "Gather actual spend and users from the scale week to compute real CAC.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "What did you truly spend, including your time?",
      "How many real users did it buy?",
      "What's hidden in the cost?"
    ],
    "successCriteria": "Real CAC computed from actuals.",
    "failureSignal": "You used projected, not actual, spend.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Day 72. Got my real CAC.",
    "killSwitch": "If the economics are fundamentally underwater, confront it now - a pitch can't hide broken math."
  },
  {
    "day": 73,
    "week": 11,
    "dayOfWeek": 3,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "execute",
    "brief": "OPERATION NUMBERS - Day 3 of 7. Pull real margins and retention. This week we know your real CAC, real margin, and real burn rate. Today is not optional: Real margin and retention computed. If you can't, that is the signal - not a delay.",
    "dayObjective": "Pull real margins and retention.",
    "task": {
      "label": "Compute contribution margin per user and actual retention from your data.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's left per user after delivery cost?",
      "How many users come back?",
      "Where does margin leak?"
    ],
    "successCriteria": "Real margin and retention computed.",
    "failureSignal": "You assumed margins instead of measuring.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Day 73. Margins and retention, for real.",
    "killSwitch": "If the economics are fundamentally underwater, confront it now - a pitch can't hide broken math."
  },
  {
    "day": 74,
    "week": 11,
    "dayOfWeek": 4,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "synthesize",
    "brief": "OPERATION NUMBERS - Day 4 of 7. Compute the runway and the verdict. This week we know your real CAC, real margin, and real burn rate. Today is not optional: Burn, runway, and per-user verdict computed. If you can't, that is the signal - not a delay.",
    "dayObjective": "Compute the runway and the verdict.",
    "task": {
      "label": "Calculate burn, runway, and whether each user makes or loses money.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "How many months of runway remain?",
      "Does a user pay back their CAC?",
      "What's the one number that's scariest?"
    ],
    "successCriteria": "Burn, runway, and per-user verdict computed.",
    "failureSignal": "You avoided the number you're afraid of.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Day 74. Faced the real runway.",
    "killSwitch": "If the economics are fundamentally underwater, confront it now - a pitch can't hide broken math."
  },
  {
    "day": 75,
    "week": 11,
    "dayOfWeek": 5,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "apply",
    "brief": "OPERATION NUMBERS - Day 5 of 7. Find the lever. This week we know your real CAC, real margin, and real burn rate. Today is not optional: One economic lever identified with a test. If you can't, that is the signal - not a delay.",
    "dayObjective": "Find the lever.",
    "task": {
      "label": "Identify the single metric that most improves the economics and one way to move it.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which metric, if fixed, changes everything?",
      "What's the realistic lever?",
      "What's the fastest test of that lever?"
    ],
    "successCriteria": "One economic lever identified with a test.",
    "failureSignal": "You listed ten fixes and committed to none.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Day 75. Found the lever that moves the math.",
    "killSwitch": "If the economics are fundamentally underwater, confront it now - a pitch can't hide broken math."
  },
  {
    "day": 76,
    "week": 11,
    "dayOfWeek": 6,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "execute",
    "brief": "OPERATION NUMBERS - Day 6 of 7. Build the unit-econ sheet. This week we know your real CAC, real margin, and real burn rate. Today is not optional: A one-page real unit-economics sheet. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build the unit-econ sheet.",
    "task": {
      "label": "Assemble the one-page unit economics sheet from real numbers only.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Is every number an actual, not a guess?",
      "Could an investor stress-test it?",
      "Is it one clean page?"
    ],
    "successCriteria": "A one-page real unit-economics sheet.",
    "failureSignal": "The sheet mixes hopes with actuals.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Day 76. Unit economics on one honest page.",
    "killSwitch": "If the economics are fundamentally underwater, confront it now - a pitch can't hide broken math."
  },
  {
    "day": 77,
    "week": 11,
    "dayOfWeek": 7,
    "phase": "PROVE",
    "missionCode": "OPERATION NUMBERS",
    "theme": "Get the unit economics straight",
    "weekObjective": "Know your real CAC, real margin, and real burn rate",
    "weekMilestone": "A one-page real (not projected) unit economics sheet",
    "rhythmRole": "debrief",
    "brief": "OPERATION NUMBERS - Day 7 of 7. Confront the verdict. This week we know your real CAC, real margin, and real burn rate. Today is not optional: An honest economic verdict documented. If you can't, that is the signal - not a delay.",
    "dayObjective": "Confront the verdict.",
    "task": {
      "label": "State plainly whether the economics work and what has to change if they don't.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Do the unit economics actually work?",
      "What must change to make them work?",
      "What would you tell a co-founder honestly?"
    ],
    "successCriteria": "An honest economic verdict documented.",
    "failureSignal": "You're spinning bad numbers as 'early'.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: get the unit economics straight?",
    "shareAngle": "Week 11 done. Real unit economics, no fiction.",
    "killSwitch": "Economics fundamentally underwater - fix the model now; the Vault can't be unlocked on broken math."
  },
  {
    "day": 78,
    "week": 12,
    "dayOfWeek": 1,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "frame",
    "brief": "OPERATION STORY - Day 1 of 7. Outline the arc. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: A five-beat pitch outline grounded in reality. If you can't, that is the signal - not a delay.",
    "dayObjective": "Outline the arc.",
    "task": {
      "label": "Outline the pitch arc: problem, insight, what you built, traction, and the ask.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's the single sharpest insight you earned?",
      "What's the one number that proves traction?",
      "What's the specific ask?"
    ],
    "successCriteria": "A five-beat pitch outline grounded in reality.",
    "failureSignal": "The outline is generic and could be anyone's.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Day 78. Outlined the real story.",
    "killSwitch": "If the story needs invented numbers to be compelling, that's a traction gap, not a story gap."
  },
  {
    "day": 79,
    "week": 12,
    "dayOfWeek": 2,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "execute",
    "brief": "OPERATION STORY - Day 2 of 7. Build the problem + insight sections. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: Problem and insight sections drafted from evidence. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build the problem + insight sections.",
    "task": {
      "label": "Draft the problem and insight slides using your real Week 1-3 evidence.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which quote makes the problem undeniable?",
      "What insight did the market teach you?",
      "Is every claim backed by evidence?"
    ],
    "successCriteria": "Problem and insight sections drafted from evidence.",
    "failureSignal": "You're using assumptions, not your real findings.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Day 79. Problem and insight, from real evidence.",
    "killSwitch": "If the story needs invented numbers to be compelling, that's a traction gap, not a story gap."
  },
  {
    "day": 80,
    "week": 12,
    "dayOfWeek": 3,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "execute",
    "brief": "OPERATION STORY - Day 3 of 7. Build the traction section. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: A traction section built only on real numbers. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build the traction section.",
    "task": {
      "label": "Draft the traction slides using only real users, revenue, and growth numbers.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's your strongest real metric?",
      "How do you show growth honestly?",
      "What proof can you screenshot?"
    ],
    "successCriteria": "A traction section built only on real numbers.",
    "failureSignal": "You're projecting hockey sticks with no basis.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Day 80. Traction slide - all real.",
    "killSwitch": "If the story needs invented numbers to be compelling, that's a traction gap, not a story gap."
  },
  {
    "day": 81,
    "week": 12,
    "dayOfWeek": 4,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "execute",
    "brief": "OPERATION STORY - Day 4 of 7. Build the product + moat + ask. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: Product, moat, and ask sections drafted. If you can't, that is the signal - not a delay.",
    "dayObjective": "Build the product + moat + ask.",
    "task": {
      "label": "Draft the product, moat, and the ask using your Week 4-9 work.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does the product slide show the value moment?",
      "Is the moat the one you named in Week 8?",
      "Is the ask specific and justified?"
    ],
    "successCriteria": "Product, moat, and ask sections drafted.",
    "failureSignal": "The ask has no number or use of funds.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Day 81. Product, moat, and the ask - drafted.",
    "killSwitch": "If the story needs invented numbers to be compelling, that's a traction gap, not a story gap."
  },
  {
    "day": 82,
    "week": 12,
    "dayOfWeek": 5,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "synthesize",
    "brief": "OPERATION STORY - Day 5 of 7. Write the throughline. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: A clear narrative throughline written. If you can't, that is the signal - not a delay.",
    "dayObjective": "Write the throughline.",
    "task": {
      "label": "Write the single narrative thread that connects every section into one story.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Can you tell the whole thing in 3 sentences?",
      "Does each slide earn the next?",
      "What's the emotional core?"
    ],
    "successCriteria": "A clear narrative throughline written.",
    "failureSignal": "The deck is facts with no story connecting them.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Day 82. Found the throughline.",
    "killSwitch": "If the story needs invented numbers to be compelling, that's a traction gap, not a story gap."
  },
  {
    "day": 83,
    "week": 12,
    "dayOfWeek": 6,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "apply",
    "brief": "OPERATION STORY - Day 6 of 7. Pitch it live. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: A live pitch delivered, feedback captured. If you can't, that is the signal - not a delay.",
    "dayObjective": "Pitch it live.",
    "task": {
      "label": "Deliver the full pitch to one trusted, critical listener and capture their feedback.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Where did they lose interest?",
      "Which claim did they doubt?",
      "What question couldn't you answer?"
    ],
    "successCriteria": "A live pitch delivered, feedback captured.",
    "failureSignal": "You read slides instead of telling the story.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Day 83. Pitched it out loud.",
    "killSwitch": "If the story needs invented numbers to be compelling, that's a traction gap, not a story gap."
  },
  {
    "day": 84,
    "week": 12,
    "dayOfWeek": 7,
    "phase": "PROVE",
    "missionCode": "OPERATION STORY",
    "theme": "Build the pitch from real data",
    "weekObjective": "Turn 11 weeks of actual decisions and outcomes into a narrative",
    "weekMilestone": "A pitch narrative built only from things that actually happened",
    "rhythmRole": "debrief",
    "brief": "OPERATION STORY - Day 7 of 7. Lock the deck. This week we turn 11 weeks of actual decisions and outcomes into a narrative. Today is not optional: A finalized, all-real pitch deck. If you can't, that is the signal - not a delay.",
    "dayObjective": "Lock the deck.",
    "task": {
      "label": "Revise from feedback and finalize the pitch built entirely on real data.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Is every number defensible?",
      "Did you cut the weakest slide?",
      "Would you bet your reputation on it?"
    ],
    "successCriteria": "A finalized, all-real pitch deck.",
    "failureSignal": "You added invented numbers to fill a gap.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: build the pitch from real data?",
    "shareAngle": "Week 12 done. A pitch built only on truth.",
    "killSwitch": "Story only works with invented numbers - it's a traction gap. VZN names what to go prove."
  },
  {
    "day": 85,
    "week": 13,
    "dayOfWeek": 1,
    "phase": "PROVE",
    "missionCode": "OPERATION CAPITAL",
    "theme": "Earn the Vault",
    "weekObjective": "Hit the accountability and traction bar that unlocks VC access",
    "weekMilestone": "Vault unlock conditions met (or a clear-eyed look at why not)",
    "rhythmRole": "frame",
    "brief": "OPERATION CAPITAL - Day 1 of 6. Audit the Vault requirements. This week we hit the accountability and traction bar that unlocks VC access. Today is not optional: A gap analysis against every unlock condition. If you can't, that is the signal - not a delay.",
    "dayObjective": "Audit the Vault requirements.",
    "task": {
      "label": "Review the unlock bar (70% tasks, score 60+, traction proof) and list your exact gaps.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which requirement are you closest to?",
      "Which is furthest?",
      "What's the single biggest gap?"
    ],
    "successCriteria": "A gap analysis against every unlock condition.",
    "failureSignal": "You assume you qualify without checking the bar.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: earn the vault?",
    "shareAngle": "Day 85. Audited the Vault bar.",
    "killSwitch": "If the requirements aren't met, don't fake it - VZN sets the honest requalification plan."
  },
  {
    "day": 86,
    "week": 13,
    "dayOfWeek": 2,
    "phase": "PROVE",
    "missionCode": "OPERATION CAPITAL",
    "theme": "Earn the Vault",
    "weekObjective": "Hit the accountability and traction bar that unlocks VC access",
    "weekMilestone": "Vault unlock conditions met (or a clear-eyed look at why not)",
    "rhythmRole": "execute",
    "brief": "OPERATION CAPITAL - Day 2 of 6. Close the task and score gaps. This week we hit the accountability and traction bar that unlocks VC access. Today is not optional: Task completion and score gaps closed honestly. If you can't, that is the signal - not a delay.",
    "dayObjective": "Close the task and score gaps.",
    "task": {
      "label": "Finish outstanding war-plan tasks and lift your accountability score toward the bar.",
      "mode": "count",
      "target": null
    },
    "prepQuestions": [
      "Which incomplete days can you legitimately close?",
      "What lifts the score fastest?",
      "What can you not fake?"
    ],
    "successCriteria": "Task completion and score gaps closed honestly.",
    "failureSignal": "You're back-dating tasks to hit 70%.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: earn the vault?",
    "shareAngle": "Day 86. Closed the gaps, honestly.",
    "killSwitch": "If the requirements aren't met, don't fake it - VZN sets the honest requalification plan."
  },
  {
    "day": 87,
    "week": 13,
    "dayOfWeek": 3,
    "phase": "PROVE",
    "missionCode": "OPERATION CAPITAL",
    "theme": "Earn the Vault",
    "weekObjective": "Hit the accountability and traction bar that unlocks VC access",
    "weekMilestone": "Vault unlock conditions met (or a clear-eyed look at why not)",
    "rhythmRole": "execute",
    "brief": "OPERATION CAPITAL - Day 3 of 6. Assemble the traction proof. This week we hit the accountability and traction bar that unlocks VC access. Today is not optional: Verifiable traction proof assembled. If you can't, that is the signal - not a delay.",
    "dayObjective": "Assemble the traction proof.",
    "task": {
      "label": "Gather and upload the hard evidence of traction (users, revenue, retention).",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "What's your single best proof point?",
      "Is it verifiable, not claimed?",
      "What story does the data tell?"
    ],
    "successCriteria": "Verifiable traction proof assembled.",
    "failureSignal": "Your 'proof' is a screenshot of hope.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: earn the vault?",
    "shareAngle": "Day 87. Packaged the real proof.",
    "killSwitch": "If the requirements aren't met, don't fake it - VZN sets the honest requalification plan."
  },
  {
    "day": 88,
    "week": 13,
    "dayOfWeek": 4,
    "phase": "PROVE",
    "missionCode": "OPERATION CAPITAL",
    "theme": "Earn the Vault",
    "weekObjective": "Hit the accountability and traction bar that unlocks VC access",
    "weekMilestone": "Vault unlock conditions met (or a clear-eyed look at why not)",
    "rhythmRole": "synthesize",
    "brief": "OPERATION CAPITAL - Day 4 of 6. Shortlist your VCs. This week we hit the accountability and traction bar that unlocks VC access. Today is not optional: A reasoned VC shortlist with fit notes. If you can't, that is the signal - not a delay.",
    "dayObjective": "Shortlist your VCs.",
    "task": {
      "label": "From the Vault's 20 VCs, shortlist the best-fit funds and why each fits.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Which funds invest at your stage and sector?",
      "Why would each care about YOUR traction?",
      "Who's the warmest path in?"
    ],
    "successCriteria": "A reasoned VC shortlist with fit notes.",
    "failureSignal": "You'd spray all 20 with the same email.",
    "competitiveContext": true,
    "debriefFocus": "What did today prove or disprove about: earn the vault?",
    "shareAngle": "Day 88. Shortlisted the right VCs.",
    "killSwitch": "If the requirements aren't met, don't fake it - VZN sets the honest requalification plan."
  },
  {
    "day": 89,
    "week": 13,
    "dayOfWeek": 5,
    "phase": "PROVE",
    "missionCode": "OPERATION CAPITAL",
    "theme": "Earn the Vault",
    "weekObjective": "Hit the accountability and traction bar that unlocks VC access",
    "weekMilestone": "Vault unlock conditions met (or a clear-eyed look at why not)",
    "rhythmRole": "apply",
    "brief": "OPERATION CAPITAL - Day 5 of 6. Draft the intro. This week we hit the accountability and traction bar that unlocks VC access. Today is not optional: Personalized VC intros drafted. If you can't, that is the signal - not a delay.",
    "dayObjective": "Draft the intro.",
    "task": {
      "label": "Write the personalized intro pitch for your top VC matches.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Does the first line earn the second?",
      "Is the traction proof front and center?",
      "Is the ask crystal clear?"
    ],
    "successCriteria": "Personalized VC intros drafted.",
    "failureSignal": "One generic template for everyone.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: earn the vault?",
    "shareAngle": "Day 89. Wrote intros worth reading.",
    "killSwitch": "If the requirements aren't met, don't fake it - VZN sets the honest requalification plan."
  },
  {
    "day": 90,
    "week": 13,
    "dayOfWeek": 6,
    "phase": "PROVE",
    "missionCode": "OPERATION CAPITAL",
    "theme": "Earn the Vault",
    "weekObjective": "Hit the accountability and traction bar that unlocks VC access",
    "weekMilestone": "Vault unlock conditions met (or a clear-eyed look at why not)",
    "rhythmRole": "debrief",
    "brief": "OPERATION CAPITAL - Day 6 of 6. Unlock - or requalify honestly. This week we hit the accountability and traction bar that unlocks VC access. Today is not optional: Vault unlocked with intros sent, or an honest requalification plan. If you can't, that is the signal - not a delay.",
    "dayObjective": "Unlock - or requalify honestly.",
    "task": {
      "label": "Meet the bar and unlock the Vault and send first intros, or document the honest plan to qualify.",
      "mode": "completion",
      "target": null
    },
    "prepQuestions": [
      "Did you genuinely meet every condition?",
      "If yes, who gets the first intro?",
      "If no, what's the 30-day requalification plan?"
    ],
    "successCriteria": "Vault unlocked with intros sent, or an honest requalification plan.",
    "failureSignal": "You gamed the bar instead of earning it.",
    "competitiveContext": false,
    "debriefFocus": "What did today prove or disprove about: earn the vault?",
    "shareAngle": "Day 90. Earned the Vault. The work was the proof.",
    "killSwitch": "Conditions unmet - VZN refuses to unlock and hands you the exact requalification plan. No shortcuts."
  }
];

export const TOTAL_DAYS = NINETY_DAY_PLAN.length; // 90
export function getDay(week: number, day: number): PlanDay | undefined {
  return NINETY_DAY_PLAN.find((d) => d.week === week && d.dayOfWeek === day);
}
export function getDayByNumber(n: number): PlanDay | undefined {
  return NINETY_DAY_PLAN.find((d) => d.day === n);
}
export function getWeek(week: number): PlanDay[] {
  return NINETY_DAY_PLAN.filter((d) => d.week === week);
}
