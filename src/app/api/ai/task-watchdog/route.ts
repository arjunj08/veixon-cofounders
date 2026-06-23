import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'

const system = `You are VZN, a brutal AI co-founder. Compare original vs edited task. Return ONLY valid JSON: { comment:string, severity:"warning"|"critical" }. Be direct about what the founder is avoiding.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    try {
      return Response.json(await callClaudeJson({ system, body, maxTokens: 500 }))
    } catch {
      return Response.json({ comment: 'You made the task easier. That is usually avoidance wearing a productivity mask.', severity: 'warning', fallback: true })
    }
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
