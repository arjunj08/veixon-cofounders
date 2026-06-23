'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { X } from 'lucide-react'
import AppShell from '@/components/AppShell'
import StatCard from '@/components/dashboard/StatCard'
import TaskList from '@/components/dashboard/TaskList'
import DecisionTable from '@/components/dashboard/DecisionTable'
import BurnClock from '@/components/dashboard/BurnClock'
import VZNAvatar from '@/components/ui/VZNAvatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import NotificationPermission from '@/app/components/ui/NotificationPermission'

function Ring({ value, color }: { value: number; color: string }) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg className="absolute h-full w-full -rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (value / 100) * circumference}
        />
      </svg>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOath, setShowOath] = useState(true)
  const [burnForm, setBurnForm] = useState({ burnRate: '', cashInBank: '', monthlyRevenue: '' })

  const user = session?.user as any
  const userId = user?.id || user?.email || 'anonymous'

  useEffect(() => {
    if (!session) return
    fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((payload) => {
        setData(payload)
        if (payload.startup?.id) window.localStorage.setItem('visionix_active_startup_id', payload.startup.id)
        setBurnForm({
          burnRate: payload.startup?.burnRate ? String(payload.startup.burnRate) : '',
          cashInBank: payload.startup?.cashInBank ? String(payload.startup.cashInBank) : '',
          monthlyRevenue: payload.startup?.monthlyRevenue ? String(payload.startup.monthlyRevenue) : '',
        })
      })
      .finally(() => setLoading(false))
  }, [session, userId])

  const todayKey = new Date().toISOString().slice(0, 10)
  const isMonday = new Date().getDay() === 1
  const oathDismissed = useMemo(() => (typeof window !== 'undefined' ? window.localStorage.getItem(`oath_${todayKey}`) === '1' : false), [todayKey])

  async function saveBurn() {
    if (!data?.startup?.id) return
    const update = {
      burnRate: Number(burnForm.burnRate) || 0,
      cashInBank: Number(burnForm.cashInBank) || 0,
      monthlyRevenue: Number(burnForm.monthlyRevenue) || 0,
    }
    await fetch(`/api/startups/${data.startup.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    setData((prev: any) => ({ ...prev, startup: { ...prev.startup, ...update } }))
  }

  function dismissOath() {
    window.localStorage.setItem(`oath_${todayKey}`, '1')
    setShowOath(false)
  }

  return (
    <AppShell
      title={`Good morning, ${(session?.user?.name || 'Founder').split(' ')[0]}. VZN is watching.`}
      actions={
        <button onClick={() => router.push('/decisions')} className="rounded-lg bg-[var(--purple)] px-4 py-2 text-sm font-semibold text-white">
          New Decision
        </button>
      }
    >
      {isMonday && data?.startup?.oath && showOath && !oathDismissed && (
        <div className="flex items-center justify-between gap-4 border-b px-6 py-3" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="flex min-w-0 items-center gap-3">
            <VZNAvatar size="sm" />
            <p className="truncate text-sm">
              You said this on Day 1: <em>{data.startup.oath}</em> Are you living up to it?
            </p>
          </div>
          <button onClick={dismissOath}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
        {loading ? (
          <div className="py-20"><LoadingSpinner label="Loading your dashboard..." /></div>
        ) : !data?.startup ? (
          <div className="rounded-2xl border p-10 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
            <VZNAvatar size="lg" className="mx-auto" />
            <h2 className="mt-6 text-2xl font-bold">No startup analysed yet.</h2>
            <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Give VZN a raw idea and let it get uncomfortable.</p>
            <Link href="/intake" className="mt-6 inline-flex rounded-xl bg-[var(--purple)] px-5 py-3 font-semibold text-white">Analyse idea</Link>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Startup Health"><Ring value={data.stats.startupHealth || 0} color="var(--purple)" /></StatCard>
              <StatCard label="Accountability Score"><Ring value={data.stats.accountability || 0} color="var(--teal)" /></StatCard>
              <StatCard label="Decisions Made">
                <div className="text-5xl font-bold">{data.stats.decisionsThisMonth || 0}</div>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>this month</p>
              </StatCard>
              <StatCard label="Pivot Radar">
                <span className="inline-flex rounded-full px-3 py-1 text-sm font-bold" style={{ background: 'color-mix(in srgb, var(--purple) 15%, transparent)', color: 'var(--purple)' }}>
                  {data.stats.pivotStatus}
                </span>
              </StatCard>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-12">
              <section id="checkins" className="rounded-2xl border p-6 lg:col-span-8" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">This week&apos;s tasks</h2>
                  <Link href="/dashboard/warplan" className="text-sm font-semibold text-[var(--purple)] hover:underline">
                    View 90-day plan →
                  </Link>
                </div>
                <TaskList 
                  tasks={data.tasks || []} 
                  startupId={data?.startup?.id} 
                  initialCompleted={(data?.startup?.completedTasks || []).map((t: any) => t.taskId)} 
                />
              </section>
              <section className="rounded-2xl border p-6 lg:col-span-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                <h2 className="mb-6 text-lg font-bold">VZN Insights</h2>
                <VZNAvatar size="lg" />
                <p className="mt-6 text-lg font-medium leading-snug">&quot;{data.insight}&quot;</p>
                <button onClick={() => router.push('/dashboard#checkins')} className="mt-6 w-full rounded-xl bg-[var(--purple)] px-4 py-3 text-sm font-semibold text-white">
                  Run check-in
                </button>
              </section>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-12">
              <section className="rounded-2xl border p-6 lg:col-span-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                <h2 className="mb-4 text-lg font-bold">Burn Clock</h2>
                <BurnClock burnRate={data.startup.burnRate} cashInBank={data.startup.cashInBank} monthlyRevenue={data.startup.monthlyRevenue} />
                <div className="mt-5 grid gap-2">
                  {(['burnRate', 'cashInBank', 'monthlyRevenue'] as const).map((key) => (
                    <input
                      key={key}
                      value={burnForm[key]}
                      onChange={(event) => setBurnForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      placeholder={key}
                      className="focus-ring rounded-lg border px-3 py-2 text-sm"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                    />
                  ))}
                  <button onClick={saveBurn} className="rounded-lg bg-[var(--purple)] px-3 py-2 text-sm font-semibold text-white">Save runway</button>
                </div>
              </section>
              <section className="overflow-hidden rounded-2xl border lg:col-span-8" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                <div className="border-b p-6" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="text-lg font-bold">Recent decisions</h2>
                </div>
                <DecisionTable decisions={data.decisions || []} />
              </section>
            </div>
          </>
        )}
      </div>
      <NotificationPermission />
    </AppShell>
  )
}
