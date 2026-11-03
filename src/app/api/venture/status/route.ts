import { aios, aiosConfigured } from '@/lib/academy/aios'
import { academy } from '@/lib/academy'

export const runtime = 'nodejs'

// Is VEIXON AI OS connected, and is it running the same course version as this app?
export async function GET() {
  if (!aiosConfigured()) return Response.json({ connected: false, reason: 'not_configured', appCourseVersion: academy.version })
  try {
    const course = await aios<{ version: string }>('/venture/course', { timeoutMs: 6000 })
    return Response.json({ connected: true, aiosCourseVersion: course.version, appCourseVersion: academy.version, inSync: course.version === academy.version })
  } catch (e: any) {
    return Response.json({ connected: false, reason: e?.message || 'unreachable', appCourseVersion: academy.version })
  }
}
