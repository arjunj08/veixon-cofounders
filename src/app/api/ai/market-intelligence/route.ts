import { callClaudeJson } from '@/lib/anthropic'
import type { MarketIntelligence } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

const system = `You are VZN — a brutal market intelligence analyst. Analyse this startup idea and return a comprehensive competitive intelligence report.

Return ONLY valid JSON with this exact structure, no markdown, no explanation outside JSON:
{
  "ideaOriginality": {
    "score": 1-10,
    "verdict": "Highly original | Moderately original | Common space | Saturated | Already built",
    "explanation": "2-3 sentences on how original this actually is"
  },
  "directCompetitors": [
    {
      "name": "company name",
      "status": "active | shut down | acquired | pivoted",
      "foundedYear": "year or unknown",
      "funding": "funding amount or bootstrapped or unknown",
      "whyTheyMatter": "one sentence",
      "theirWeakness": "one sentence — where they fail",
      "shutdownReason": "only if shut down — why they died"
    }
  ],
  "indirectCompetitors": [
    { "name": "string", "overlap": "string", "threat": "high|medium|low" }
  ],
  "marketStatus": {
    "stage": "emerging | growing | mature | declining | crowded",
    "timing": "too early | right time | slightly late | too late",
    "timingExplanation": "2 sentences on market timing",
    "indianMarketSpecific": "one paragraph on India-specific dynamics for this market"
  },
  "graveyardWarning": {
    "hasDeadStartups": true|false,
    "count": number,
    "mostRelevantDeathStory": "name + what happened + why it matters to this founder",
    "patternAcrossDeaths": "what do all the failed attempts have in common"
  },
  "whitespace": {
    "exists": true|false,
    "description": "where the genuine gap is if it exists",
    "why": "why hasn't anyone filled this gap yet"
  },
  "vcSentiment": {
    "currentInterest": "hot | warm | cooling | cold",
    "explanation": "why VCs are or aren't interested in this space right now",
    "recentFundingSignals": "any notable recent funding in this space"
  },
  "vznVerdict": "one brutal honest paragraph about whether this idea has a real shot given the competitive landscape",
  "biggestThreat": "the single most dangerous competitor or trend that could kill this startup",
  "unfairAdvantage": "what this founder would need as an unfair advantage to win in this space"
}`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { idea, targetCustomer, problem } = body

    if (!idea) {
      return Response.json({ error: 'Idea is required' }, { status: 400 })
    }

    const input = `
Idea: ${idea}
Target Customer: ${targetCustomer || 'Not specified'}
Problem: ${problem || 'Not specified'}

Analyze this startup idea thoroughly and provide market intelligence.`

    const result = await callClaudeJson<MarketIntelligence>({
      system,
      body: { text: input },
      maxTokens: 4000,
    })

    return Response.json({ ...result, generatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Market intelligence error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
