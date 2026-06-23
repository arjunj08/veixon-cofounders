import { getStartup, saveStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const { week, day, debrief, vznResponse, patternFlag, urgencyLevel, competitiveInsight, tomorrowSuggestion } = body

    const startup = await getStartup(id)
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 })
    }

    if (!startup.dayDebriefs) {
      startup.dayDebriefs = []
    }

    let dayDebrief = startup.dayDebriefs.find((d: any) => d.week === week && d.day === day)
    if (!dayDebrief) {
      dayDebrief = {
        week,
        day,
        prepAnswers: [],
        prepFeedback: '',
        executionCount: 0,
        executionNotes: [],
        subStepsCompleted: [],
        timeSpentMinutes: 0,
        debrief: {
          whatHappened: '',
          theSignal: '',
          whatItMeans: '',
          whatChanges: '',
          tomorrowEdge: '',
        },
        vznResponse: '',
        urgencyLevel: 'green',
        tomorrowSuggestion: '',
        completedAt: '',
        dayCardShared: false,
      }
      startup.dayDebriefs.push(dayDebrief)
    }

    dayDebrief.debrief = debrief
    dayDebrief.vznResponse = vznResponse
    dayDebrief.patternFlag = patternFlag
    dayDebrief.urgencyLevel = urgencyLevel
    dayDebrief.competitiveInsight = competitiveInsight
    dayDebrief.tomorrowSuggestion = tomorrowSuggestion
    dayDebrief.completedAt = new Date().toISOString()

    await saveStartup(startup as any)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Complete day error:', error)
    return Response.json({ error: 'Failed to complete day' }, { status: 500 })
  }
}
