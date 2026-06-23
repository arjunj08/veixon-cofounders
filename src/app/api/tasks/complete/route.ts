import { getStartupById, updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const startup = await getStartupById(body.startupId)
    if (!startup) return Response.json({ error: 'Startup not found', fallback: true }, { status: 404 })
    const completedTasks = [...(startup.completedTasks || []), { taskId: body.taskId, completedAt: new Date().toISOString() }]
    const totalTasks = Math.max(1, (startup.warPlanJson || []).reduce((sum: number, mission: any) => sum + (mission.dailyTasks?.length || 0), 0))
    const taskCompletionRate = completedTasks.length / totalTasks
    await updateStartup(startup.id, { completedTasks, taskCompletionRate, accountabilityScore: Math.min(100, Math.round(taskCompletionRate * 100)) })
    return Response.json({ completed: true, taskCompletionRate })
  } catch {
    return Response.json({ error: 'Task update unavailable', fallback: true }, { status: 500 })
  }
}
