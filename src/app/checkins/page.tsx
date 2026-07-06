import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLatestStartup } from '@/lib/server-store'

export const dynamic = 'force-dynamic'

export default async function CheckinsRedirect() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  if (!userId) {
    redirect('/auth')
  }

  let redirectUrl = ''
  try {
    const startup = await getLatestStartup(userId)
    if (!startup) {
      redirectUrl = '/intake'
    } else {
      const completedTaskIds = (startup.completedTasks || []).map((t: any) => t.taskId)
      let found = false
      
      for (let w = 1; w <= 13; w++) {
        for (let d = 1; d <= 7; d++) {
          const taskId = `wk${w}-day${d}`
          if (!completedTaskIds.includes(taskId)) {
            redirectUrl = `/dashboard/warplan/${w}/${d}`
            found = true
            break
          }
        }
        if (found) break
      }
      
      if (!found) {
        redirectUrl = '/dashboard/warplan/1/1'
      }
    }
  } catch (error) {
    console.error('Failed to resolve active check-in page:', error)
    redirectUrl = '/dashboard'
  }

  redirect(redirectUrl)
}
