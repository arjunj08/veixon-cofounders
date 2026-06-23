import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task, taskType, missionName, dayNumber } = body

    if (!task) {
      return Response.json({ error: 'Task is required' }, { status: 400 })
    }

    const system = `You are VZN, an AI co-founder crafting a daily mission brief.

Return ONLY valid JSON:
{
  "briefing": "2-3 sharp sentences on WHY this matters today",
  "whyThisMatters": "one paragraph on strategic importance",
  "whatGoodLooksLike": "specific, measurable success criteria",
  "whatFailureLooksLike": "specific failure states to avoid",
  "vznWarning": "one sentence — the trap most founders fall into on this task",
  "estimatedTime": "30min | 1hr | 2hr | half-day | full-day"
}`

    const input = `
Task: ${task}
Mission: ${missionName || 'Unknown'}
Day: ${dayNumber || 'Unknown'}
Type: ${taskType || 'general'}

Create a mission brief for this day's task.`

    const result = await callClaudeJson<{
      briefing: string
      whyThisMatters: string
      whatGoodLooksLike: string
      whatFailureLooksLike: string
      vznWarning: string
      estimatedTime: string
    }>({
      system,
      body: { text: input },
      maxTokens: 1500,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Day brief error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
