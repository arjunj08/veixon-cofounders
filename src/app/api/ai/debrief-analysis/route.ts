import { callClaudeJson } from '@/lib/anthropic'
import type { MarketIntelligence } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { whatHappened, theSignal, whatItMeans, whatChanges, tomorrowEdge, marketIntelligence, recentDebriefs } = body

    if (!whatHappened || !theSignal) {
      return Response.json({ error: 'Debrief data required' }, { status: 400 })
    }

    const competitorContext = marketIntelligence
      ? `
Biggest Threat: ${marketIntelligence.biggestThreat}
Direct Competitors: ${marketIntelligence.directCompetitors?.map((c: any) => c.name).join(', ') || 'unknown'}`
      : ''

    const system = `You are VZN, a world-class, direct, and brutally honest AI co-founder. Your job is to analyze the founder's daily debrief answers and output strategic coaching feedback.

Understand each part of the debrief thoroughly:
1. "What happened": The literal action. Call out busywork (logos, CSS adjustments) vs. real execution (cold calls, user interviews).
2. "The signal": The data collected. Is it actual market feedback (a quote, conversion rate) or just the founder's own thoughts?
3. "What it means": The founder's analysis. Diagnose if they are delusional, overly optimistic, or ignoring red flags.
4. "What changes": The tactical adjustment. Check if they are actually changing their strategy or just repeating mistakes.
5. "Tomorrow's edge": The next immediate priority. Make sure it directly addresses the signal discovered today.

Response Guidelines:
- "vznResponse": One sharp, high-impact paragraph (max 180 words). Give highly customized, direct feedback analyzing their answers. Do not speak in generic terms; quote or reference their specific signal and actions. Tell them if they executed well or wasted time.
- "patternFlag": A short phrase representing a behavioral or strategic pattern you notice (e.g., "Feature Creep Trap", "Avoidance of Sales", "Data-Driven Momentum", "Delusional Optimism"). If none, return null.
- "urgencyLevel": "red" if they are ignoring critical market warning signals or doing zero real execution; "amber" if they are doing okay but missing leverage; "green" if they are executing flawlessly on high-leverage goals.
- "tomorrowSuggestion": One specific, tactical instruction for tomorrow that forces them to act on today's signal.
- "competitiveInsight": A sharp remark on how today's actions position them against their biggest threat/competitors. If unrelated, return null.

Return ONLY a valid JSON object matching the schema. No markdown wrapping.`;

    const input = `CO-FOUNDER DEBRIEF INPUTS:
- What happened: "${whatHappened}"
- The signal received: "${theSignal}"
- What it means: "${whatItMeans}"
- What changes: "${whatChanges}"
- Tomorrow's edge: "${tomorrowEdge}"

STARTUP CONTEXT:
${competitorContext}

Analyze these answers. Be direct, specific, and brutally constructive.`;

    const result = await callClaudeJson<{
      vznResponse: string
      patternFlag: string | null
      urgencyLevel: 'green' | 'amber' | 'red'
      tomorrowSuggestion: string
      competitiveInsight: string | null
    }>({
      system,
      body: { text: input },
      maxTokens: 1000,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Debrief analysis error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
