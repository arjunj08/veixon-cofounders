import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { decisionText, denialDate, actualOutcome } = body

    if (!decisionText || !actualOutcome) {
      return Response.json({ error: 'Decision and outcome required' }, { status: 400 })
    }

    const system = `You are VZN, performing a 30-day decision autopsy - comparing predictions to reality.

Return ONLY valid JSON:
{
  "vznAccuracy": "was the prediction accurate, partially accurate, or completely wrong?",
  "vznAutopsy": "2-3 sentences on why the prediction was right/wrong and what this tells the founder"
}`

    const input = `Decision 30 days ago: ${decisionText}

What actually happened: ${actualOutcome}

Perform an autopsy. Be honest. What can the founder learn from the gap between prediction and reality?`

    const result = await callClaudeJson<{
      vznAccuracy: string
      vznAutopsy: string
    }>({
      system,
      body: { text: input },
      maxTokens: 600,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Decision autopsy error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
