import type { IdeationResult, WarMission } from './types'

const missionsData = [
  { code: 'OPERATION ZERO', name: 'Validate the problem', obj: 'Confirm the problem is real and painful for a specific person.', ms: 'A one-sentence validated problem statement.', watch: 'I am watching if you chase feedback or confirmation bias.' },
  { code: 'OPERATION SIGNAL', name: 'Validate willingness to pay', obj: 'Find out if anyone will actually exchange money for a fix.', ms: 'A documented "yes" or a documented "no, because X".', watch: 'I am watching if you ask for money or just compliments.' },
  { code: 'OPERATION SKETCH', name: 'Design the smallest solution', obj: 'Define the thinnest version of the product that tests the core value.', ms: 'A one-page spec of the MVP.', watch: 'I am watching you over-engineer.' },
  { code: 'OPERATION BUILD', name: 'Ship a working prototype', obj: 'Get something real in front of a real user, even if ugly.', ms: 'A working link or demo, not a deck.', watch: 'I am watching you delay the launch for polish.' },
  { code: 'OPERATION FIRST FIVE', name: 'First real users', obj: 'Get 5 people who are not friends or family actually using it.', ms: '5 logged users with at least one real session each.', watch: 'I am watching if you do unscalable things to get them.' },
  { code: 'OPERATION FEEDBACK', name: 'Cut what doesn\'t work', obj: 'Talk to those 5 users, find what they hate, kill it.', ms: 'A revised feature list with at least one thing removed.', watch: 'I am watching if you defend your features instead of listening.' },
  { code: 'OPERATION PROOF', name: 'First paying signal', obj: 'Get a payment, a deposit, or a binding commitment to pay.', ms: 'First ₹1 of real revenue or a signed pre-order.', watch: 'I am watching you avoid the ask.' },
  { code: 'OPERATION MOAT', name: 'Start the defensibility', obj: 'Identify and begin building the thing competitors can\'t copy in a sprint.', ms: 'A named, specific moat — not "we move faster".', watch: 'I am watching you rely on generic speed.' },
  { code: 'OPERATION CHANNEL', name: 'Find the repeatable channel', obj: 'Test 2-3 acquisition channels, find the one with real signal.', ms: 'One channel with a measured cost-per-user.', watch: 'I am watching you spray and pray.' },
  { code: 'OPERATION SCALE', name: 'Push what\'s working', obj: 'Stop testing, start pushing the one channel that worked.', ms: 'A 2-3x increase in users from that channel.', watch: 'I am watching you get distracted by new shiny channels.' },
  { code: 'OPERATION NUMBERS', name: 'Get the unit economics straight', obj: 'Know your real CAC, real margin, real burn rate.', ms: 'A one-page real unit economics sheet.', watch: 'I am watching you ignore the math.' },
  { code: 'OPERATION STORY', name: 'Build the pitch from real data', obj: 'Turn 11 weeks of actual decisions and outcomes into a narrative.', ms: 'A pitch narrative built only from things that actually happened.', watch: 'I am watching you invent traction.' },
  { code: 'OPERATION CAPITAL', name: 'Earn the Vault', obj: 'Hit the accountability and traction bar that unlocks VC access.', ms: 'Vault unlock conditions met.', watch: 'I am watching if you fold under pressure.' },
]

export function fallbackWarPlan(): WarMission[] {
  return missionsData.map((m, index) => {
    const week = index + 1
    const isEarly = week <= 2
    const isProduct = week >= 3 && week <= 4
    const isSales = week >= 5 && week <= 7
    const isGrowth = week >= 8

    let executeAction = "Talk to target users"
    let synthesizeAction = "Summarise the pain points"
    let applyAction = "Decide on the exact problem to solve"
    
    if (isEarly) {
      executeAction = `Interview target users to validate ${m.name.toLowerCase()}`
      synthesizeAction = `Analyse user interviews and document the exact objection`
      applyAction = `Write the finalized ${m.name.toLowerCase()} thesis`
    } else if (isProduct) {
      executeAction = `Build the core components for ${m.name.toLowerCase()}`
      synthesizeAction = `Document the missing edge cases`
      applyAction = `Ship the current prototype to staging`
    } else if (isSales) {
      executeAction = `Reach out to cold leads for ${m.name.toLowerCase()}`
      synthesizeAction = `Analyse the conversion funnel and objections`
      applyAction = `Design a counter-objection script`
    } else if (isGrowth) {
      executeAction = `Run acquisition experiments for ${m.name.toLowerCase()}`
      synthesizeAction = `Calculate the CAC and ROI of the tests`
      applyAction = `Double down on the highest ROI segment`
    }

    return {
      week,
      missionCode: m.code,
      missionName: m.name,
      primaryObjective: m.obj,
      weeklyMilestone: m.ms,
      failureSignal: 'You rely on your own certainty instead of fresh customer behaviour.',
      vznWatching: m.watch,
      dailyTasks: [
        { day: 1, task: `Plan the execution constraints for ${m.name.toLowerCase()}.`, category: 'ops' },
        { day: 2, task: `${executeAction} - Batch 1.`, category: 'execution' },
        { day: 3, task: `${executeAction} - Batch 2.`, category: 'execution' },
        { day: 4, task: `${executeAction} - Batch 3.`, category: 'execution' },
        { day: 5, task: `${synthesizeAction} from this week's data.`, category: 'synthesis' },
        { day: 6, task: `${applyAction}.`, category: 'apply' },
        { day: 7, task: `Choose one measurable commitment for next week and calendar it.`, category: 'ops' }
      ]
    }
  })
}

export function fallbackIdeation(body: any): IdeationResult {
  return {
    scorecard: {
      market: { score: 7, explanation: 'The market may be real, but the buyer definition still needs sharper proof.' },
      moat: { score: 5, explanation: 'Nothing here is defensible until distribution or data compounds.' },
      timing: { score: 8, explanation: 'AI adoption creates timing leverage if you move faster than incumbents.' },
      founderFit: { score: 6, explanation: 'Founder fit is plausible, but the submission does not prove unfair access.' },
      monetisation: { score: 7, explanation: 'The willingness-to-pay test is the first existential question.' },
      executionRisk: { score: 5, explanation: 'Distribution risk is more dangerous than product risk right now.' },
    },
    devilsAdvocate: [
      {
        title: 'Distribution will kill you before product does.',
        explanation:
          'Your customer may agree with the problem and still ignore you. Without a repeatable channel, the product becomes an expensive opinion.',
        severity: 'high',
      },
      {
        title: 'The pain may not be urgent enough.',
        explanation:
          'A painful problem is not automatically a paid problem. You need evidence that customers will switch, pay, and tolerate early roughness.',
        severity: 'high',
      },
      {
        title: 'Your moat is currently a paragraph.',
        explanation:
          'If the advantage cannot compound every week, a faster team can copy the visible product and beat you on reach.',
        severity: 'medium',
      },
    ],
    failureProbability: Math.max(55, Math.min(95, 98 - Math.round((((body?.idea || '').length + (body?.targetCustomer || '').length + (body?.problem || '').length) || 120) / 12))),
    survivalEdge:
      'The survivors do not wait for confidence. They force payment conversations early, narrow the first customer segment until it hurts, and treat every week without new evidence as a lost week.',
    warPlan: fallbackWarPlan(),
    vzn_voice: `The idea is not the problem. Your proof is.`,
    fallback: true,
  }
}

export function fallbackFounderDNA() {
  return {
    founderType: 'Executor',
    traits: {
      visionaryVsExecutor: 58,
      riskAppetite: 64,
      clarityOfThinking: 62,
      emotionalAttachment: 71,
    },
    vznVerdict: 'You have enough urgency to move, but not enough precision to be trusted yet.',
    dangerLine: 'You may confuse intensity with evidence.',
    fallback: true,
  }
}

export function fallbackDecision() {
  return {
    bestCase: {
      summary: 'The decision creates speed without creating new complexity.',
      day30: 'You have one clear metric moving and no unresolved ownership gaps.',
      day90: 'The team has a repeatable cadence around the decision.',
      day180: 'The decision becomes invisible infrastructure.',
    },
    worstCase: {
      summary: 'The decision hides the real problem and burns time.',
      day30: 'You are explaining why the result needs more time.',
      day90: 'The same bottleneck appears under a different name.',
      day180: 'You have paid for motion without getting leverage.',
    },
    mostLikely: {
      summary: 'The decision helps only if you constrain scope hard.',
      day30: 'One part works and two parts need ruthless trimming.',
      day90: 'You either codify the win or quietly abandon the experiment.',
      day180: 'The result depends on whether you measured it weekly.',
    },
    recommendation: 'Do it only if you define the kill metric before you start.',
    reasoning: 'The upside is speed, but the downside is disguised drift. Make the decision reversible and time-boxed.',
    vzn_voice: 'I would make the call, but I would also define exactly when to kill it.',
    fallback: true,
  }
}

// Deterministic, no-API curriculum analysis. Same shape as the AI output so the
// /api/ai/idea-analysis route always returns something useful for local dev / outages.
export function fallbackCurriculumAnalysis(body: any) {
  const idea: string = body.idea || body.ideaText || 'an unspecified product'
  const customer: string = body.targetCustomer || body.customer || 'a specific customer'
  const problem: string = body.problem || 'a real, recurring problem'
  const h = Math.abs([...(idea + customer + problem)].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0))
  const pick = <T,>(arr: T[], salt = 0) => arr[(h >> salt) % arr.length]
  const sc = (base: number, salt: number) => Math.max(2, Math.min(9, base + ((h >> salt) % 4) - 1))

  const sevType = pick(['B2C', 'B2B', 'B2G'] as const, 1)
  const tenM = sc(5, 6) >= 6
  const scorecard = {
    problemSeverity: { score: sc(6, 2), explanation: 'Problem looks real but root cause is unproven — run a 5-Why before trusting it.' },
    customerClarity: { score: sc(5, 3), explanation: 'Segment named but user-vs-buyer split and JTBD still need validation.' },
    solutionFit: { score: sc(5, 4), explanation: 'Solution is plausible; distinctiveness vs alternatives is not yet demonstrated.' },
    marketSize: { score: sc(6, 5), explanation: 'Plausible TAM, but no SOM evidence in 2–4 years yet.' },
    moat: { score: sc(4, 6), explanation: 'No defensible whitespace identified — a funded rival could copy this in a sprint.' },
    monetisation: { score: sc(5, 7), explanation: 'Revenue model unproven; pricing and unit economics untested.' },
    scalability: { score: sc(tenM ? 6 : 4, 8), explanation: tenM ? 'Could reach $10M if the channel scales without linear cost.' : 'Hard to see a credible path to $10M without expanding the offering.' },
  }
  const avg = Math.round(Object.values(scorecard).reduce((s, d) => s + d.score, 0) / 7)
  return {
    problem: { statement: `Despite needing it, ${customer} struggles with ${problem}.`, rootCause: 'Surface symptom logged — the underlying cause is not yet root-caused (apply 5-Why).', whoAffected: customer, severity: sc(6, 9) },
    customer: { primarySegment: customer, segmentType: sevType, endUser: customer, buyer: sevType === 'B2C' ? customer : 'the budget owner / decision maker' },
    jtbd: { functional: `Get ${problem} handled reliably.`, emotional: 'Feel in control and less anxious about it.', social: 'Be seen as someone who has it together.' },
    persona: { name: 'Persona TBD', snapshot: `A representative ${customer} who currently copes with ${problem} using makeshift workarounds.`, painPoints: ['Time lost to the problem', 'No trustworthy existing solution', 'Cost of the current workaround'] },
    solution: { idea, distinctiveness: 'Not yet distinctive — needs a SCAMPER pass to find a sharp angle.', scamperAngle: pick(['Eliminate a step rivals force', 'Combine two tools into one flow', 'Adapt a model from another industry'], 4) },
    competition: { direct: [{ name: 'Established incumbent', weakness: 'Generic, not built for this exact segment' }], indirect: [{ name: 'Manual workaround / spreadsheets', overlap: 'Solves the same job more cheaply today' }], whitespace: 'A segment-specific, lower-friction approach the incumbents ignore.' },
    market: { tam: 'Estimate via TAM→SAM→SOM with real assumptions', sam: 'Reachable slice given geography/constraints', som: 'Realistically obtainable in 2–4 years', tenMillionVerdict: { passes: tenM, reasoning: tenM ? 'Market and model can plausibly support ~$10M in 3–5 years.' : 'Either TAM is too small or the model scales with cost — fix one to pass.' } },
    economics: { revenueModel: pick(['subscription', 'transaction', 'marketplace commission', 'freemium + ads'], 5), pricingStrategy: pick(['value-based', 'competition-based (penetration)', 'cost-plus'], 6), roughUnitEconomics: 'Run a back-of-envelope: price × units − (setup + fixed + variable). Unknown until tested.' },
    leanCanvas: {
      problem: problem,
      customerSegments: customer,
      uniqueValueProposition: 'TBD — must be unique, valuable, and tied to the problem.',
      solution: idea,
      channels: 'TBD — pick channels where this customer already gathers.',
      revenueStreams: scorecard ? pick(['subscription', 'transaction', 'commission'], 7) : 'TBD',
      costStructure: 'Setup + fixed + variable; biggest line likely customer acquisition.',
      keyMetrics: 'Activation, retention, CAC, CLV.',
      unfairAdvantage: 'Not yet identified — this is the riskiest blank.',
    },
    scorecard,
    devilsAdvocate: [
      { title: 'Root cause unproven', explanation: 'You have a symptom, not a validated root cause. Run a 5-Why this week.', severity: 'high' as const },
      { title: 'No moat', explanation: 'Nothing here a funded competitor cannot copy in a sprint. Find the unfair advantage.', severity: 'high' as const },
      { title: 'Willingness to pay untested', explanation: 'Interest is not revenue. Get a real paid commitment before building more.', severity: 'medium' as const },
    ],
    failureProbability: Math.max(58, Math.min(92, 100 - avg * 8)),
    killCriteria: 'If fewer than 5 target customers rank this a top-3 problem after interviews, pivot the problem.',
    vzn_voice: `I ran your idea through the framework. Composite ${avg}/10. The problem might be real, but you have not root-caused it, you have no moat, and nobody has paid you yet. That is the work — not more features.`,
    fallback: true,
  }
}
