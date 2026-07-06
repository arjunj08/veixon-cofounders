import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLatestCheckin, getLatestStartup, listDecisions } from '@/lib/server-store'

export const runtime = 'nodejs'

function health(startup: any) {
  if (!startup) return 0
  const scores = Object.values(startup.scorecardJson || {}).map((item: any) => Number(item?.score || 0))
  const avg = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0
  const accountability = Number(startup.accountabilityScore || 0) / 10
  return Math.min(100, Math.round(avg * 7 + accountability * 3))
}

function totalPlanTasks(startup: any) {
  const planned = (startup?.warPlanJson || []).reduce((sum: number, mission: any) => {
    return sum + (mission.dailyTasks?.length || 0)
  }, 0)

  return Math.max(90, planned || 0)
}

const EMPTY = {
  startup: null,
  checkin: null,
  decisions: [],
  tasks: [],
  insight: 'Sign in and run your first check-in and I will tell you where you are drifting.',
  stats: { startupHealth: 0, accountability: 0, decisionsThisMonth: 0, pivotStatus: 'AMBER', completedCount: 0, totalTasks: 90, taskProgress: 0 },
}

export async function GET(_req: Request) {
  try {
    // Never trust a client-supplied userId — derive the owner from the session only.
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) return Response.json(EMPTY)

    let startup: any = null
    let checkin: any = null
    let decisions: any[] = []

    try {
      startup = await getLatestStartup(userId)
      checkin = await getLatestCheckin(userId)
      decisions = await listDecisions(userId)
    } catch (dbErr) {
      console.warn('Dashboard Prisma query failed, returning fallback stats:', dbErr)
      return Response.json({
        startup: null,
        checkin: null,
        decisions: [],
        tasks: [],
        insight: 'Database is offline, running in offline recovery mode.',
        stats: {
          startupHealth: 50,
          accountability: 50,
          decisionsThisMonth: 0,
          pivotStatus: 'AMBER',
          completedCount: 0,
          totalTasks: 90,
          taskProgress: 0,
        },
        dbFallback: true,
      })
    }
    let activeWeek = 1
    const completedCount = startup?.completedTasks?.length || 0
    if (completedCount) {
      activeWeek = Math.min(13, Math.floor(completedCount / 7) + 1)
    }

    const rawTasks = checkin?.tasksJson || startup?.warPlanJson?.[activeWeek - 1]?.dailyTasks || startup?.warPlanJson?.[0]?.dailyTasks || []
    const tasks = rawTasks.map((t: any) => ({
      ...t,
      week: t.week || activeWeek
    }))

    const totalTasks = totalPlanTasks(startup)
    const taskProgress = totalTasks ? Math.min(100, Math.round((completedCount / totalTasks) * 100)) : 0
    const pivotStatus = startup?.taskCompletionRate && startup.taskCompletionRate > 0.7 ? 'GREEN' : startup?.accountabilityScore && startup.accountabilityScore < 45 ? 'RED' : 'AMBER'

    return Response.json({
      startup,
      checkin,
      decisions,
      tasks,
      insight: checkin?.vznVoice || startup?.vznVoice || 'Run your first check-in and I will tell you where you are drifting.',
      stats: {
        startupHealth: health(startup),
        accountability: startup?.accountabilityScore || checkin?.accountabilityScore || 0,
        decisionsThisMonth: decisions.length,
        pivotStatus,
        completedCount,
        totalTasks,
        taskProgress,
      },
    })
  } catch {
    return Response.json({ error: 'Dashboard unavailable', fallback: true }, { status: 500 })
  }
}
