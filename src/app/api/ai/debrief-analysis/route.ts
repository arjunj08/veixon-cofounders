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

    const system = `You are VZN, analysing a founder's daily debrief and extracting strategic signals.

Return ONLY valid JSON:
{
  "vznResponse": "one sharp paragraph (max 300 words) analysing what they learned",
  "patternFlag": "if you detect a pattern across recent debriefs, name it here; otherwise null",
  "urgencyLevel": "green|amber|red",
  "tomorrowSuggestion": "one specific action for tomorrow based on today's signal",
  "competitiveInsight": "if today's debrief reveals something about competitors, mention it here; otherwise null"
}`

    const input = `Today's debrief:
- What happened: ${whatHappened}
- The signal: ${theSignal}
- What it means: ${whatItMeans}
- What changes: ${whatChanges}
- Tomorrow's edge: ${tomorrowEdge}

${competitorContext}

Recent pattern context: ${recentDebriefs ? 'Available' : 'First debrief'}

Analyse this debrief. Be specific. Flag patterns if they exist.`

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
