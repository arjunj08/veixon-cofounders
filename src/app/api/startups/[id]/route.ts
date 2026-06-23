import { getStartupById, updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const startup = await getStartupById(params.id)
    if (!startup) return Response.json({ error: 'Startup not found', fallback: true }, { status: 404 })
    return Response.json(startup)
  } catch {
    return Response.json({ error: 'Startup unavailable', fallback: true }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    await updateStartup(params.id, body)
    return Response.json({ updated: true })
  } catch {
    return Response.json({ error: 'Startup unavailable', fallback: true }, { status: 500 })
  }
}
