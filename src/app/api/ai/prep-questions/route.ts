import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task, taskType } = body

    if (!task) {
      return Response.json({ error: 'Task is required' }, { status: 400 })
    }

    const system = `You are VZN, creating 3 mandatory prep questions before a founder starts their day's task.

Return ONLY valid JSON:
{
  "questions": ["question 1", "question 2", "question 3"],
  "taskType": "customer|market|product|validation|other"
}`

    const input = `Task: ${task}
Type: ${taskType || 'general'}

Generate 3 mandatory prep questions. Make them specific to this task, not generic.`

    const result = await callClaudeJson<{
      questions: string[]
      taskType: string
    }>({
      system,
      body: { text: input },
      maxTokens: 800,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Prep questions error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
