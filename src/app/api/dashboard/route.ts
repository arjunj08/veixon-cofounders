import { getLatestCheckin, getLatestStartup, listDecisions } from '@/lib/server-store'

export const runtime = 'nodejs'

function health(startup: any) {
  if (!startup) return 0
  const scores = Object.values(startup.scorecardJson || {}).map((item: any) => Number(item?.score || 0))
  const avg = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0
  const accountability = Number(startup.accountabilityScore || 0) / 10
  return Math.min(100, Math.round(avg * 7 + accountability * 3))
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'anonymous'
    const startup = await getLatestStartup(userId)
    const checkin = await getLatestCheckin(userId)
    const decisions = await listDecisions(userId)
    const tasks = checkin?.tasksJson || startup?.warPlanJson?.[0]?.dailyTasks || []
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
      },
    })
  } catch {
    return Response.json({ error: 'Dashboard unavailable', fallback: true }, { status: 500 })
  }
}
