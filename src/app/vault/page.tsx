import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getLatestStartup } from '@/lib/server-store'
import VaultClient from './vault-client'

export const dynamic = 'force-dynamic'

export default async function VaultPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth')

  const user = session.user as any
  const startup = await getLatestStartup(user?.id || user?.email || 'anonymous')
  const progress = {
    taskCompletionRate: startup?.taskCompletionRate || 0,
    accountabilityScore: startup?.accountabilityScore || 0,
    tractionProof: !!startup?.tractionProof,
  }
  const unlocked = progress.taskCompletionRate >= 0.7 && progress.accountabilityScore >= 60 && progress.tractionProof

  return <VaultClient startup={startup} initialUnlocked={unlocked} progress={progress} />
}
