import { aios, aiosErrorResponse } from '@/lib/academy/aios'
import { founderSubject } from '../_subject'

export const runtime = 'nodejs'

// Report how a decision turned out — VEIXON AI OS re-weights the rules for this founder.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = String(body?.id || '')
    const result = String(body?.result || '')
    if (!/^vd-[a-f0-9]{12}$/.test(id) || !['worked', 'mixed', 'failed'].includes(result)) {
      return Response.json({ error: 'Need a decision id and result: worked, mixed or failed.' }, { status: 400 })
    }
    const d: any = await aios(`/venture/decisions/${id}`)
    if (d?.subject !== (await founderSubject(req, body?.anonId))) return Response.json({ error: 'Decision not found' }, { status: 404 })
    return Response.json(await aios(`/venture/decisions/${id}/outcome`, { method: 'POST', body: { result, notes: String(body?.notes || '').slice(0, 2000) } }))
  } catch (e) {
    return aiosErrorResponse(e)
  }
}
