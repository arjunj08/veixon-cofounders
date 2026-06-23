import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { answers, task } = body

    if (!answers || answers.length === 0) {
      return Response.json({ error: 'Answers are required' }, { status: 400 })
    }

    const system = `You are VZN, giving sharp feedback on a founder's prep answers.

Return ONLY valid JSON:
{
  "feedback": "one sharp line (max 30 words) based on their answers. Not congratulatory. Analytical."
}`

    const input = `Task: ${task || 'Unknown'}
Answers to prep questions:
1. ${answers[0] || ''}
2. ${answers[1] || ''}
3. ${answers[2] || ''}

Give one sharp analytical line of feedback.`

    const result = await callClaudeJson<{ feedback: string }>({
      system,
      body: { text: input },
      maxTokens: 200,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Prep feedback error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
