import { getStartup, saveStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    const startup = await getStartup(id)
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 })
    }

    const { week, day, executionCount, executionNote, subStep, timeSpent } = body

    if (week && day) {
      if (!startup.dayDebriefs) {
        startup.dayDebriefs = []
      }

      let debrief = startup.dayDebriefs.find((d: any) => d.week === week && d.day === day)
      if (!debrief) {
        debrief = {
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
        startup.dayDebriefs.push(debrief)
      }

      if (executionCount !== undefined) {
        debrief.executionCount = executionCount
      }
      if (executionNote) {
        debrief.executionNotes.push(executionNote)
      }
      if (subStep) {
        debrief.subStepsCompleted.push(subStep)
      }
      if (timeSpent !== undefined) {
        debrief.timeSpentMinutes = (debrief.timeSpentMinutes || 0) + timeSpent
      }
    }

    await saveStartup(startup as any)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Day update error:', error)
    return Response.json({ error: 'Failed to update day' }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { searchParams } = new URL(req.url)
    const week = searchParams.get('week')
    const day = searchParams.get('day')

    const startup = await getStartup(id)
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 })
    }

    if (week && day) {
      const debrief = startup.dayDebriefs?.find((d: any) => d.week === parseInt(week) && d.day === parseInt(day))
      return Response.json(debrief || {})
    }

    return Response.json(startup)
  } catch (error) {
    console.error('Day get error:', error)
    return Response.json({ error: 'Failed to fetch day' }, { status: 500 })
  }
}
