import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStartupById, updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

// A startup is accessible if the session user owns it. Records with no owner
// (legacy / pre-login "anonymous" rows) stay reachable so the teaser→login
// hand-off doesn't break; tighten this for production by removing that clause.
function canAccess(startup: any, userId?: string | null) {
  if (!startup) return false
  const owner = startup.userId
  return owner === userId || !owner || owner === 'anonymous'
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    let startup: any = null
    try {
      startup = await getStartupById(params.id)
    } catch (err) {
      console.warn('Prisma getStartupById failed, using mock fallback:', err)
      return Response.json({
        id: params.id,
        userId: userId || 'anonymous',
        name: 'Mock Startup',
        ideaText: 'A startup idea',
        targetCustomer: 'Target customers',
        problem: 'A real problem',
        whitespace: 'Open market gap',
        vznVoice: 'The database is offline, but I am still watching.',
        completedTasks: [],
        dayDebriefs: [],
        weekAnalyses: [],
        weekUnlockStatus: [],
        scorecardJson: {
          problemSeverity: { score: 7, explanation: 'Offline mock' },
          marketSize: { score: 6, explanation: 'Offline mock' },
          executionSpeed: { score: 8, explanation: 'Offline mock' },
          moatBuilding: { score: 5, explanation: 'Offline mock' },
        },
        warPlanJson: [],
        devilsAdvocateJson: [],
        founderDNA: {
          founderType: 'Executor',
          traits: { visionaryVsExecutor: 50, riskAppetite: 50, clarityOfThinking: 50, emotionalAttachment: 50 },
          vznVerdict: 'Database is unavailable, using local mock DNA profile.',
          dangerLine: 'No database connection means no persistence.',
        },
        marketIntelligence: {
          whitespace: 'whitespace focus',
        },
        dbFallback: true,
      })
    }

    if (!startup) return Response.json({ error: 'Startup not found', fallback: true }, { status: 404 })

    return Response.json(startup)
  } catch {
    return Response.json({ error: 'Startup unavailable', fallback: true }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const startup = await getStartupById(params.id)
    if (!startup) return Response.json({ error: 'Startup not found', fallback: true }, { status: 404 })
    if (!canAccess(startup, userId)) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    await updateStartup(params.id, body)
    return Response.json({ updated: true })
  } catch {
    return Response.json({ error: 'Startup unavailable', fallback: true }, { status: 500 })
  }
}
