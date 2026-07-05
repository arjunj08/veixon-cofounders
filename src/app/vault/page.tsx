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
  
  let startup = null
  let progress = {
    taskCompletionRate: 0,
    accountabilityScore: 0,
    tractionProof: false,
  }
  let unlocked = false

  try {
    startup = await getLatestStartup(user?.id || user?.email || 'anonymous')
    if (startup) {
      progress = {
        taskCompletionRate: startup.taskCompletionRate || 0,
        accountabilityScore: startup.accountabilityScore || 0,
        tractionProof: !!startup.tractionProof,
      }
      unlocked = progress.taskCompletionRate >= 0.7 && progress.accountabilityScore >= 60 && progress.tractionProof
    }
  } catch (error) {
    console.error('Vault page failed to load startup from database:', error)
  }

  return <VaultClient startup={startup} initialUnlocked={unlocked} progress={progress} />
}
