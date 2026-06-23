import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task } = body

    if (!task) {
      return Response.json({ error: 'Task is required' }, { status: 400 })
    }

    const system = `You are VZN, breaking down a completion-based task into specific sub-steps.

Return ONLY valid JSON:
{
  "steps": [
    { "step": "specific action", "why": "why this step matters" }
  ]
}`

    const input = `Task: ${task}

Break this into 3-5 specific, checkable sub-steps. Each step must be completable in 30-90 minutes.`

    const result = await callClaudeJson<{
      steps: Array<{ step: string; why: string }>
    }>({
      system,
      body: { text: input },
      maxTokens: 800,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Task breakdown error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
