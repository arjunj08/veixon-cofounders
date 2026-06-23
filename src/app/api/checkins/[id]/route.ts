import { getCheckinById } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const checkin = await getCheckinById(params.id)
    if (!checkin) return Response.json({ error: 'Check-in not found', fallback: true }, { status: 404 })
    return Response.json(checkin)
  } catch {
    return Response.json({ error: 'Check-in unavailable', fallback: true }, { status: 500 })
  }
}
