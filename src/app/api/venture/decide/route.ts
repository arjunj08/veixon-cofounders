import { aios, aiosErrorResponse } from '@/lib/academy/aios'
import { clientIp, rateLimit, tooMany } from '@/lib/rate-limit'
import { founderSubject } from '../_subject'

export const runtime = 'nodejs'

// Decision Advisor → VEIXON AI OS Venture Decision Engine (course rules + cited knowledge).
export async function POST(req: Request) {
  const rl = rateLimit(`venture-decide:${clientIp(req)}`, 30, 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)
  try {
    const body = await req.json()
    const question = String(body?.question || '').trim()
    if (!question) return Response.json({ error: 'Describe the decision you are facing.' }, { status: 400 })
    const profile: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(body?.profile || {})) {
      if (v !== '' && v !== null && v !== undefined) profile[k] = v
    }
    const decision = await aios('/venture/decide', {
      method: 'POST',
      timeoutMs: body?.narrate ? 90000 : 30000,
      body: {
        question: question.slice(0, 4000),
        profile,
        decision_type: body?.decisionType || undefined,
        narrate: !!body?.narrate,
        subject: await founderSubject(req, body?.anonId),
      },
    })
    return Response.json(decision)
  } catch (e) {
    return aiosErrorResponse(e)
  }
}
