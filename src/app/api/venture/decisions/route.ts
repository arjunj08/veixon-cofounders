import { aios, aiosErrorResponse } from '@/lib/academy/aios'
import { founderSubject } from '../_subject'

export const runtime = 'nodejs'

// The founder's decision history, from VEIXON AI OS (?id=… returns one full decision).
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (id) {
      if (!/^vd-[a-f0-9]{12}$/.test(id)) return Response.json({ error: 'Bad id' }, { status: 400 })
      const [d, subject] = await Promise.all([aios(`/venture/decisions/${id}`), founderSubject(req, url.searchParams.get('anonId'))])
      if ((d as any)?.subject !== subject) return Response.json({ error: 'Decision not found' }, { status: 404 })
      return Response.json(d)
    }
    const subject = await founderSubject(req, url.searchParams.get('anonId'))
    return Response.json(await aios(`/venture/decisions?subject=${encodeURIComponent(subject)}&limit=50`))
  } catch (e) {
    return aiosErrorResponse(e)
  }
}
