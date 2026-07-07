import { getLatestStartup, getStartupById, updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const host = req.headers.get('host') || ''
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1')

    const startup = searchParams.get('startupId')
      ? await getStartupById(searchParams.get('startupId') || '')
      : await getLatestStartup(searchParams.get('userId') || 'anonymous')

    if (!startup) {
      return Response.json({
        unlocked: !!isLocal,
        progress: { taskCompletionRate: 0, accountabilityScore: 0, tractionProof: false }
      })
    }

    const unlocked = (Number(startup.taskCompletionRate || 0) >= 0.7 && Number(startup.accountabilityScore || 0) >= 60 && !!startup.tractionProof) || !!isLocal
    if (unlocked && !startup.vaultUnlocked) {
      try {
        await updateStartup(startup.id, { vaultUnlocked: true })
      } catch {}
    }
    return Response.json({
      unlocked,
      startup,
      progress: {
        taskCompletionRate: startup.taskCompletionRate || 0,
        accountabilityScore: startup.accountabilityScore || 0,
        tractionProof: !!startup.tractionProof,
      },
    })
  } catch {
    return Response.json({ error: 'Vault unavailable', fallback: true }, { status: 500 })
  }
}
