import { getStartupById, updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const startup = await getStartupById(body.startupId)
    if (!startup) return Response.json({ error: 'Startup not found', fallback: true }, { status: 404 })
    const tractionDetails = [...(startup.tractionDetails || []), { type: body.type || 'proof', value: body.value || '', loggedAt: new Date().toISOString() }]
    await updateStartup(startup.id, { tractionDetails, tractionProof: tractionDetails.length > 0 })
    return Response.json({ logged: true, tractionProof: true })
  } catch {
    return Response.json({ error: 'Traction update unavailable', fallback: true }, { status: 500 })
  }
}
