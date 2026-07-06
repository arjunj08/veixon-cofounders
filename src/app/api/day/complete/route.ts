import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getStartup, updateStartup } from '@/lib/server-store'
import { recordFounderEvent } from '@/lib/events'
import { sendDayOneCompletionEmail, sendDailyCheckinEmail } from '@/lib/email/day-one'

export const runtime = 'nodejs'

function totalPlanTasks(startup: any) {
  const planned = (startup?.warPlanJson || []).reduce((sum: number, mission: any) => {
    return sum + (mission.dailyTasks?.length || 0)
  }, 0)

  return Math.max(90, planned || 0)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = body.id || body.startupId
    const { week, day, debrief, vznResponse, patternFlag, urgencyLevel, competitiveInsight, tomorrowSuggestion } = body
    const weekNumber = Number(week)
    const dayNumber = Number(day)

    if (!id) return Response.json({ error: 'Startup id is required' }, { status: 400 })
    if (!Number.isFinite(weekNumber) || !Number.isFinite(dayNumber)) {
      return Response.json({ error: 'Week and day are required' }, { status: 400 })
    }

    let startup: any = null
    try {
      startup = await getStartup(id)
    } catch {
      startup = { id, userId: 'anonymous' }
    }
    
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 })
    }

    let completedTasks: any[] = []
    let completedCount = 0
    let totalTasks = 90
    let taskCompletionRate = 0
    let accountabilityScore = 0

    try {
      const existingDebrief = await prisma.dayDebrief.findFirst({
        where: { startupId: startup.id, week: weekNumber, day: dayNumber },
      })
      const dayDebriefData = {
        week: weekNumber,
        day: dayNumber,
        prepAnswers: JSON.stringify(body.prepAnswers || []),
        executionCount: Number(body.executionCount || 0),
        executionNotes: JSON.stringify(body.executionNotes || []),
        subStepsCompleted: JSON.stringify(body.subStepsCompleted || []),
        timeSpentMinutes: Number(body.timeSpentMinutes || 0),
        debrief: JSON.stringify(debrief || {}),
        vznResponse: vznResponse || '',
        patternFlag: patternFlag || null,
        urgencyLevel: urgencyLevel || 'green',
        competitiveInsight: competitiveInsight || null,
        tomorrowSuggestion: tomorrowSuggestion || '',
        completedAt: new Date(),
        dayCardShared: false,
      }

      if (existingDebrief) {
        await prisma.dayDebrief.update({
          where: { id: existingDebrief.id },
          data: dayDebriefData,
        })
      } else {
        await prisma.dayDebrief.create({
          data: {
            ...dayDebriefData,
            startupId: startup.id,
          },
        })
      }

      const taskId = body.taskId || `wk${weekNumber}-day${dayNumber}`
      const existingTask = await prisma.completedTask.findFirst({
        where: { startupId: startup.id, taskId },
      })

      if (!existingTask) {
        await prisma.completedTask.create({
          data: {
            startupId: startup.id,
            taskId,
            completedAt: new Date(),
          },
        })
      }

      const dbCompleted = await prisma.completedTask.findMany({
        where: { startupId: startup.id },
        orderBy: { completedAt: 'asc' },
      })
      completedTasks = dbCompleted
      totalTasks = totalPlanTasks(startup)
      completedCount = completedTasks.length
      taskCompletionRate = Math.min(1, completedCount / totalTasks)
      accountabilityScore = Math.min(100, Math.round(taskCompletionRate * 100))

      await updateStartup(startup.id, { taskCompletionRate, accountabilityScore })

      try {
        await recordFounderEvent({
          type: 'day_return',
          startupId: (startup as any).id,
          userId: (startup as any).userId,
          orgId: (startup as any).orgId,
          cohortId: (startup as any).cohortId,
          payload: { week: weekNumber, day: dayNumber, taskId, urgencyLevel, patternFlag: patternFlag || null, taskCompletionRate },
        })
      } catch {}
    } catch (dbError) {
      console.warn('Day complete DB operation failed, using local fallback:', dbError)
      completedCount = 1
      taskCompletionRate = completedCount / totalTasks
      accountabilityScore = Math.round(taskCompletionRate * 100)
    }

    try {
      const session = await getServerSession(authOptions).catch(() => null)
      await sendDayOneCompletionEmail({
        startup,
        session,
        taskId: body.taskId || `wk${weekNumber}-day${dayNumber}`,
        week: weekNumber,
        day: dayNumber,
        task: body.taskLabel || body.task,
      })
      await sendDailyCheckinEmail({
        startup,
        session,
        week: weekNumber,
        day: dayNumber,
        task: body.taskLabel || body.task,
      })
    } catch {}

    return Response.json({
      success: true,
      taskId: body.taskId || `wk${weekNumber}-day${dayNumber}`,
      completedTasks,
      completedCount,
      totalTasks,
      taskCompletionRate,
      accountabilityScore,
    })
  } catch (error) {
    console.error('Complete day error:', error)
    return Response.json({ error: 'Failed to complete day' }, { status: 500 })
  }
}
