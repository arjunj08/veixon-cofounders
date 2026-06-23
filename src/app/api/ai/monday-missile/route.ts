import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'

const system = `Write Monday email as VZN. Direct, sharp, zero fluff. Reference specific tasks by name. Give exactly ONE task. End with the founder's oath. Return ONLY valid JSON: { subject:string, body:string, singleTask:string }. Max 150 words in body.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    try {
      return Response.json(await callClaudeJson({ system, body, maxTokens: 900 }))
    } catch {
      return Response.json({
        subject: 'VZN Monday Missile',
        body: `You do not need more tasks. You need one task finished with proof. End the week with evidence, not explanations. Oath: ${body.oath || 'I commit.'}`,
        singleTask: 'Run one payment conversation and document the answer.',
        fallback: true,
      })
    }
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
