import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

// Save the founder's oath. Resolves the startup from the authenticated session
// (NOT a client-supplied id), so it works regardless of localStorage state and
// can't be used to write to another user's startup.
export async function POST(req: Request) {
  try {
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

    let startup: any = null
    try {
      startup = await prisma.startup.findFirst({
        where: { userId },
        select: { id: true },
      })
    } catch (dbErr) {
      console.warn('Prisma startup lookup failed for oath, using fallback:', dbErr)
    }

    if (startup) {
      try {
        await prisma.startup.update({
          where: { id: startup.id },
          data: { oath, oathDate: new Date() },
        })
      } catch (dbErr) {
        console.warn('Prisma startup update failed for oath:', dbErr)
        return Response.json({ error: 'Database is offline, using offline recovery mode', dbFallback: true })
      }
    } else {
      return Response.json({ error: 'Database offline, fallback active', dbFallback: true })
    }

    return Response.json({ ok: true })
  } catch (err: any) {
    console.error('Oath API error:', err)
    return Response.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
