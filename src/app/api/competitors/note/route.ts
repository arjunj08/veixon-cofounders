import { getStartup, saveStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { startupId, week, competitorName, notes } = body

    if (!startupId || !competitorName || !notes) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const startup = await getStartup(startupId)
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 })
    }

    if (!startup.competitorNotes) {
      startup.competitorNotes = []
    }

    startup.competitorNotes.push({
      competitorName,
      week: week || 0,
      notes,
      date: new Date().toISOString(),
    })

    await saveStartup(startup as any)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Competitor note error:', error)
    return Response.json({ error: 'Failed to add competitor note' }, { status: 500 })
  }
}
