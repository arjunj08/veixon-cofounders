import { getLatestStartup, getStartupById, updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startup = searchParams.get('startupId')
      ? await getStartupById(searchParams.get('startupId') || '')
      : await getLatestStartup(searchParams.get('userId') || 'anonymous')
    if (!startup) return Response.json({ unlocked: false, progress: { taskCompletionRate: 0, accountabilityScore: 0, tractionProof: false } })
    const unlocked = Number(startup.taskCompletionRate || 0) >= 0.7 && Number(startup.accountabilityScore || 0) >= 60 && !!startup.tractionProof
    if (unlocked && !startup.vaultUnlocked) await updateStartup(startup.id, { vaultUnlocked: true })
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
