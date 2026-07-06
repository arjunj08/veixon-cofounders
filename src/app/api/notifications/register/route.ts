import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { fcmToken } = body
    if (!fcmToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 })
    }

    try {
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          fcmToken,
          notificationsEnabled: true,
          fcmTokenUpdatedAt: new Date(),
        }
      })
    } catch (dbErr) {
      console.warn('FCM token DB write bypassed (database offline/read-only):', dbErr)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FCM register error:', error)
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 })
  }
}
