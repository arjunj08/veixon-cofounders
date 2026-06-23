export type ScoreDimension = {
  score: number
  explanation: string
}

export type IdeationResult = {
  id?: string
  scorecard: {
    market: ScoreDimension
    moat: ScoreDimension
    timing: ScoreDimension
    founderFit: ScoreDimension
    monetisation: ScoreDimension
    executionRisk: ScoreDimension
  }
  devilsAdvocate: Array<{ title: string; explanation: string; severity: 'high' | 'medium' }>
  failureProbability: number
  survivalEdge: string
  warPlan: WarMission[]
  vzn_voice: string
  fallback?: boolean
}

export type WarMission = {
  week: number
  missionCode: string
  missionName: string
  primaryObjective: string
  dailyTasks: Array<{ day: number; task: string; category: string }>
  weeklyMilestone: string
  failureSignal: string
  vznWatching: string
}

export type MarketIntelligence = {
  ideaOriginality: { score: number; verdict: string; explanation: string }
  directCompetitors: Array<{
    name: string
    status: 'active' | 'shut down' | 'acquired' | 'pivoted'
    foundedYear: string
    funding: string
    whyTheyMatter: string
    theirWeakness: string
    shutdownReason?: string
  }>
  indirectCompetitors: Array<{ name: string; overlap: string; threat: 'high' | 'medium' | 'low' }>
  marketStatus: {
    stage: 'emerging' | 'growing' | 'mature' | 'declining' | 'crowded'
    timing: 'too early' | 'right time' | 'slightly late' | 'too late'
    timingExplanation: string
    indianMarketSpecific: string
  }
  graveyardWarning: {
    hasDeadStartups: boolean
    count: number
    mostRelevantDeathStory: string
    patternAcrossDeaths: string
  }
  whitespace: { exists: boolean; description: string; why: string }
  vcSentiment: {
    currentInterest: 'hot' | 'warm' | 'cooling' | 'cold'
    explanation: string
    recentFundingSignals: string
  }
  vznVerdict: string
  biggestThreat: string
  unfairAdvantage: string
  generatedAt: string
}

export type DayDebrief = {
  week: number
  day: number
  prepAnswers: string[]
  prepFeedback: string
  executionCount: number
  executionNotes: string[]
  subStepsCompleted: string[]
  timeSpentMinutes: number
  debrief: {
    whatHappened: string
    theSignal: string
    whatItMeans: string
    whatChanges: string
    tomorrowEdge: string
  }
  vznResponse: string
  patternFlag?: string
  urgencyLevel: 'green' | 'amber' | 'red'
  competitiveInsight?: string
  tomorrowSuggestion: string
  completedAt: string
  dayCardShared: boolean
}

export type StartupRecord = {
  id: string
  userId: string
  ideaText: string
  targetCustomer: string
  problem: string
  scorecardJson: IdeationResult['scorecard']
  warPlanJson: WarMission[]
  devilsAdvocateJson: IdeationResult['devilsAdvocate']
  failureProbability: number
  survivalEdge: string
  founderDNA?: unknown
  completedTasks: Array<{ taskId: string; completedAt: string }>
  taskEdits: Array<{ taskId: string; original: string; edited: string; vznComment: string; editedAt: string }>
  tractionDetails: Array<{ type: string; value: string; loggedAt: string }>
  introRequests: Array<{ vcName: string; requestedAt: string }>
  shareCardsGenerated: number
  pivotAlerts: Array<{ triggeredAt: string; signals: string[]; message: string; dismissedAt?: string }>
  createdAt: string
  subscriptionTier?: string
  accountabilityScore?: number
  taskCompletionRate?: number
  vaultUnlocked?: boolean
  oath?: string
  oathDate?: string
  stressTestResponse?: string
  tractionProof?: boolean
  burnRate?: number
  cashInBank?: number
  monthlyRevenue?: number
  vznVoice?: string
  marketIntelligence?: MarketIntelligence
  competitorAwarenessAnswers?: string[]
  trackedCompetitors?: string[]
  competitorNotes?: Array<{ competitorName: string; week: number; notes: string; date: string }>
  dayDebriefs?: DayDebrief[]
  weekAnalyses?: Array<{
    week: number
    patterns: string[]
    warnings: string[]
    strengths: string[]
    weekScore: number
    nextWeekFocus: string
    vznVerdict: string
    generatedAt: string
  }>
  decisionFollowUps?: Array<{
    decisionId: string
    dueDate: string
    completedAt?: string
    actualOutcome: string
    vznAccuracy: string
    vznAutopsy: string
  }>
  weekUnlockStatus?: Array<{ week: number; unlocked: boolean; unlockedAt?: string }>
}

// Curriculum-grounded idea analysis (M1–M6). Produced by /api/ai/idea-analysis.
export type CurriculumScore = { score: number; explanation: string }
export type CurriculumAnalysis = {
  problem: { statement: string; rootCause: string; whoAffected: string; severity: number }
  customer: { primarySegment: string; segmentType: 'B2B' | 'B2C' | 'B2G'; endUser: string; buyer: string }
  jtbd: { functional: string; emotional: string; social: string }
  persona: { name: string; snapshot: string; painPoints: string[] }
  solution: { idea: string; distinctiveness: string; scamperAngle: string }
  competition: {
    direct: Array<{ name: string; weakness: string }>
    indirect: Array<{ name: string; overlap: string }>
    whitespace: string
  }
  market: { tam: string; sam: string; som: string; tenMillionVerdict: { passes: boolean; reasoning: string } }
  economics: { revenueModel: string; pricingStrategy: string; roughUnitEconomics: string }
  leanCanvas: {
    problem: string
    customerSegments: string
    uniqueValueProposition: string
    solution: string
    channels: string
    revenueStreams: string
    costStructure: string
    keyMetrics: string
    unfairAdvantage: string
  }
  scorecard: {
    problemSeverity: CurriculumScore
    customerClarity: CurriculumScore
    solutionFit: CurriculumScore
    marketSize: CurriculumScore
    moat: CurriculumScore
    monetisation: CurriculumScore
    scalability: CurriculumScore
  }
  devilsAdvocate: Array<{ title: string; explanation: string; severity: 'high' | 'medium' }>
  failureProbability: number
  killCriteria: string
  vzn_voice: string
  fallback?: boolean
}
