'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import VZNAvatar from './VZNAvatar'

export default function EmergencyRunwayBanner() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    if (!session?.user?.id && !session?.user?.email) return
    const userId = session.user.id || session.user.email
    fetch(`/api/dashboard?userId=${encodeURIComponent(userId || '')}`)
      .then((res) => res.json())
      .then((data) => {
        const startup = data.startup
        if (!startup) return
        const burn = Number(startup.burnRate || 0)
        const revenue = Number(startup.monthlyRevenue || 0)
        const cash = Number(startup.cashInBank || 0)
        const netBurn = Math.max(burn - revenue, 0)
        const runway = netBurn > 0 ? Math.floor((cash / netBurn) * 30) : null
        setDays(runway && runway < 30 ? runway : null)
      })
      .catch(() => setDays(null))
  }, [session?.user?.email, session?.user?.id, pathname])

  if (!days) return null

  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] flex min-h-12 items-center justify-center gap-3 border-b px-4 py-2 text-sm"
      style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--amber)', color: 'var(--amber)' }}
    >
      <VZNAvatar size="sm" mood="warning" />
      <span>You have {days} days of runway. Emergency protocol active.</span>
      <Link href="/vault" className="rounded-lg bg-[var(--purple)] px-3 py-1.5 text-xs font-semibold text-white">
        Get VC contacts now
      </Link>
    </div>
  )
}
