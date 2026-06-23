import { getStartup, saveStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { startupId, competitorName, track } = body

    if (!startupId || !competitorName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const startup = await getStartup(startupId)
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 })
    }

    if (!startup.trackedCompetitors) {
      startup.trackedCompetitors = []
    }

    if (track) {
      if (!startup.trackedCompetitors.includes(competitorName)) {
        startup.trackedCompetitors.push(competitorName)
      }
    } else {
      startup.trackedCompetitors = startup.trackedCompetitors.filter((c: string) => c !== competitorName)
    }

    await saveStartup(startup as any)
    return Response.json({ success: true, tracked: track })
  } catch (error) {
    console.error('Track competitor error:', error)
    return Response.json({ error: 'Failed to update competitor tracking' }, { status: 500 })
  }
}
