import { createHash } from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/** Opaque per-founder id for VEIXON AI OS (a hash — no email or name leaves this app). */
export async function founderSubject(req: Request, anonId?: string | null): Promise<string> {
  const session: any = await getServerSession(authOptions).catch(() => null)
  const who = session?.user?.email || session?.user?.id
  const raw = who ? `user:${who}` : `guest:${(anonId || req.headers.get('x-forwarded-for') || 'anon').slice(0, 80)}`
  return 'f-' + createHash('sha256').update(raw).digest('hex').slice(0, 40)
}
