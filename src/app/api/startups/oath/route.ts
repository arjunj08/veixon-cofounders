import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

// Save the founder's oath. Resolves the startup from the authenticated session
// (NOT a client-supplied id), so it works regardless of localStorage state and
// can't be used to write to another user's startup.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = (session.user as any).id as string

  const body = await req.json().catch(() => ({}))
  const oath = (body?.oath ?? '').toString().trim().slice(0, 200)
  if (!oath) {
    return Response.json({ error: 'Oath is required' }, { status: 400 })
  }

  const startup = await prisma.startup.findFirst({
    where: { userId },
    select: { id: true },
  })
  if (!startup) {
    return Response.json({ error: 'No startup found for this account' }, { status: 404 })
  }

  await prisma.startup.update({
    where: { id: startup.id },
    data: { oath, oathDate: new Date() },
  })

  return Response.json({ ok: true })
}
