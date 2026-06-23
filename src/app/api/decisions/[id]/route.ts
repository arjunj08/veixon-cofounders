import { getDecisionById } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const decision = await getDecisionById(params.id)
    if (!decision) return Response.json({ error: 'Decision not found', fallback: true }, { status: 404 })
    return Response.json(decision)
  } catch {
    return Response.json({ error: 'Decision unavailable', fallback: true }, { status: 500 })
  }
}
