import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Always run fresh (depends on the session) and never get statically cached.
export const dynamic = 'force-dynamic'

export default async function RoutingPage() {
  const session = await getServerSession(authOptions)

  // redirect() throws NEXT_REDIRECT internally, so it must live OUTSIDE the try/catch.
  if (!session || !session.user) {
    redirect('/auth')
  }

  let target = '/intake'

  try {
    // Never let a slow or misconfigured database block the post-login redirect.
    // Cap the lookup at 2.5s; if it can't answer in time, fall through to /intake.
    let timer: ReturnType<typeof setTimeout> | undefined
    const lookup = prisma.startup.findFirst({
      where: { userId: (session.user as any).id },
      select: { id: true, oath: true },
    })
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('routing-db-timeout')), 2500)
    })
    const startup = (await Promise.race([lookup, timeout])) as { id: string; oath: string | null } | null
    if (timer) clearTimeout(timer)

    if (startup) {
      // Has a startup but hasn't taken the oath yet → send to the oath step (the missing redirect).
      target = startup.oath ? '/dashboard' : '/oath'
    }
  } catch (error) {
    console.error('Routing DB check failed/slow; defaulting to dashboard:', error)
    target = '/dashboard'
  }

  redirect(target)
}
