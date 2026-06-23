import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { debriefs, weekNumber } = body

    if (!debriefs || debriefs.length === 0) {
      return Response.json({ error: 'Debriefs required' }, { status: 400 })
    }

    const debriefSummary = debriefs
      .map((d: any) => `Day ${d.day}: Signal: ${d.theSignal}`)
      .join('\n')

    const system = `You are VZN, analysing a week of founder debriefs to extract patterns and strategic insights.

Return ONLY valid JSON:
{
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "warnings": ["warning 1", "warning 2"],
  "strengths": ["strength 1", "strength 2"],
  "weekScore": 50-100,
  "nextWeekFocus": "one sentence on what to focus on next week",
  "vznVerdict": "3-4 sentences analysing the week - be honest and specific"
}`

    const input = `Week ${weekNumber} debriefs:
${debriefSummary}

Analyse this week. Find patterns. Be specific. Not generic.`

    const result = await callClaudeJson<{
      patterns: string[]
      warnings: string[]
      strengths: string[]
      weekScore: number
      nextWeekFocus: string
      vznVerdict: string
    }>({
      system,
      body: { text: input },
      maxTokens: 1200,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Pattern analysis error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
