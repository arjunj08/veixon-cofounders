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
import VznMatrixCore from '@/components/dashboard/VznMatrixCore'
import NotificationPermission from '@/components/ui/NotificationPermission'
import AnimatedNumber from '@/components/ui/motion/AnimatedNumber'
import { DashboardSkeleton } from '@/components/ui/motion/Skeleton'

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

function percentFromRate(rate: number) {
  return Math.min(100, Math.round(rate * (rate <= 1 ? 100 : 1)))
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOath, setShowOath] = useState(true)
  const [burnForm, setBurnForm] = useState({ burnRate: '', cashInBank: '', monthlyRevenue: '' })
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (data?.startup?.id) {
      setShareUrl(`${window.location.origin}/results/${data.startup.id}`)
    }
  }, [data])

  const user = session?.user as any
  const userId = user?.id || user?.email || 'anonymous'

  const EMPTY_DASHBOARD = {
    startup: null,
    checkin: null,
    decisions: [],
    tasks: [],
    insight: 'Sign in and run your first check-in and I will tell you where you are drifting.',
    stats: { startupHealth: 0, accountability: 0, decisionsThisMonth: 0, pivotStatus: 'AMBER', completedCount: 0, totalTasks: 90, taskProgress: 0 },
  }

  useEffect(() => {
    if (!session) return
    fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((payload) => {
        if (payload.error || payload.dbFallback) throw new Error()
        
        if (payload.startup?.id) {
          window.localStorage.setItem('visionix_active_startup_id', payload.startup.id)
          const local = window.localStorage.getItem(`veixon_completed_tasks_${payload.startup.id}`)
          if (local) {
            try {
              const parsed = JSON.parse(local)
              if (Array.isArray(parsed) && parsed.length > (payload.startup.completedTasks?.length || 0)) {
                payload.startup.completedTasks = parsed.map(id => ({ taskId: id, completedAt: new Date().toISOString() }))
                payload.startup.taskCompletionRate = parsed.length / 90
                payload.startup.accountabilityScore = Math.round((parsed.length / 90) * 100)
                
                payload.stats.completedCount = parsed.length
                payload.stats.taskProgress = percentFromRate(payload.startup.taskCompletionRate)
                payload.stats.accountability = payload.startup.accountabilityScore
              }
            } catch {}
          }
        }

        setData(payload)
        setBurnForm({
          burnRate: payload.startup?.burnRate ? String(payload.startup.burnRate) : '',
          cashInBank: payload.startup?.cashInBank ? String(payload.startup.cashInBank) : '',
          monthlyRevenue: payload.startup?.monthlyRevenue ? String(payload.startup.monthlyRevenue) : '',
        })
      })
      .catch(() => {
        const activeId = window.localStorage.getItem('visionix_active_startup_id')
        if (activeId) {
          const localRecord = window.localStorage.getItem(`veixon_startup_${activeId}`)
          if (localRecord) {
            const parsed = JSON.parse(localRecord)
            
            const localCompleted = window.localStorage.getItem(`veixon_completed_tasks_${activeId}`)
            let completedTasks = parsed.completedTasks || []
            let rate = parsed.taskCompletionRate || 0
            let score = parsed.accountabilityScore || 0
            if (localCompleted) {
              try {
                const parsedCompleted = JSON.parse(localCompleted)
                if (Array.isArray(parsedCompleted)) {
                  completedTasks = parsedCompleted.map(id => ({ taskId: id, completedAt: new Date().toISOString() }))
                  rate = parsedCompleted.length / 90
                  score = Math.round(rate * 100)
                }
              } catch {}
            }

            const fallbackPayload = {
              startup: {
                ...parsed,
                completedTasks,
                taskCompletionRate: rate,
                accountabilityScore: score,
              },
              checkin: null,
              decisions: [],
              tasks: parsed.warPlanJson?.[0]?.dailyTasks || [],
              insight: parsed.vznVoice || 'Run your first check-in and I will tell you where you are drifting.',
              stats: {
                startupHealth: 50,
                accountability: score,
                decisionsThisMonth: 0,
                pivotStatus: 'AMBER',
                completedCount: completedTasks.length,
                totalTasks: 90,
                taskProgress: percentFromRate(rate),
              }
            }
            setData(fallbackPayload)
            setBurnForm({
              burnRate: parsed.burnRate ? String(parsed.burnRate) : '',
              cashInBank: parsed.cashInBank ? String(parsed.cashInBank) : '',
              monthlyRevenue: parsed.monthlyRevenue ? String(parsed.monthlyRevenue) : '',
            })
            return
          }
        }
        setData(EMPTY_DASHBOARD)
      })
      .finally(() => setLoading(false))
  }, [session, userId])

  const todayKey = new Date().toISOString().slice(0, 10)
  const isMonday = new Date().getDay() === 1
  const oathDismissed = useMemo(() => (typeof window !== 'undefined' ? window.localStorage.getItem(`oath_${todayKey}`) === '1' : false), [todayKey])
  const completedCount = data?.stats?.completedCount ?? data?.startup?.completedTasks?.length ?? 0
  const totalTasks = data?.stats?.totalTasks ?? 90
  const taskProgress =
    data?.stats?.taskProgress ??
    percentFromRate(Number(data?.startup?.taskCompletionRate || 0))

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

  function applyTaskProgress(progress: any) {
    setData((prev: any) => {
      if (!prev?.startup) return prev

      const nextStartup = {
        ...prev.startup,
        completedTasks: progress.completedTasks || prev.startup.completedTasks || [],
        taskCompletionRate: progress.taskCompletionRate ?? prev.startup.taskCompletionRate,
        accountabilityScore: progress.accountabilityScore ?? prev.startup.accountabilityScore,
      }
      const nextCompletedCount = progress.completedCount ?? nextStartup.completedTasks.length ?? 0
      const nextTotalTasks = progress.totalTasks ?? prev.stats?.totalTasks ?? 90
      const nextTaskProgress = percentFromRate(Number(nextStartup.taskCompletionRate || 0))
      const nextPivotStatus =
        Number(nextStartup.taskCompletionRate || 0) > 0.7
          ? 'GREEN'
          : Number(nextStartup.accountabilityScore || 0) < 45
            ? 'RED'
            : 'AMBER'

      return {
        ...prev,
        startup: nextStartup,
        stats: {
          ...prev.stats,
          accountability: nextStartup.accountabilityScore || 0,
          pivotStatus: nextPivotStatus,
          completedCount: nextCompletedCount,
          totalTasks: nextTotalTasks,
          taskProgress: nextTaskProgress,
        },
      }
    })
  }

  return (
    <AppShell
      title={`Good morning, ${(session?.user?.name || 'Founder').split(' ')[0]}. VZN is watching.`}
      actions={
        <button onClick={() => router.push('/decisions')} className="vzn-button-primary rounded-lg px-4 py-2 text-sm font-semibold">
          New Decision
        </button>
      }
    >
      {isMonday && data?.startup?.oath && showOath && !oathDismissed && (
        <div className="vzn-panel mx-4 mt-4 flex items-center justify-between gap-4 rounded-2xl px-6 py-3 md:mx-8">
          <div className="flex min-w-0 items-center gap-3">
            <VZNAvatar size="sm" />
            <p className="truncate text-sm">
              You said this on Day 1: <em>{data.startup.oath}</em> Are you living up to it?
            </p>
          </div>
          <button onClick={dismissOath}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="vzn-page-pad mx-auto w-full max-w-7xl">
        {loading ? (
          <DashboardSkeleton />
        ) : !data?.startup ? (
          <div className="vzn-panel-strong rounded-[1.5rem] p-10 text-center">
            <VZNAvatar size="lg" className="mx-auto" />
            <h2 className="mt-6 text-2xl font-bold">No startup analysed yet.</h2>
            <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Give VZN a raw idea and let it get uncomfortable.</p>
            <Link href="/intake" className="vzn-button-primary mt-6 inline-flex rounded-xl px-5 py-3 font-semibold">Analyse idea</Link>
          </div>
        ) : (
          <>
            <section className="vzn-panel veixon-lift veixon-rise mb-6 rounded-[1.5rem] p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="vzn-section-label">90-Day Progress</div>
                  <h2 className="mt-1 text-2xl font-bold">{taskProgress}% complete</h2>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {completedCount}/{totalTasks} tasks done. Keep the proof moving.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-right sm:flex sm:items-center">
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Done</div>
                    <div className="text-xl font-bold text-[var(--teal)]">{completedCount}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Left</div>
                    <div className="text-xl font-bold">{Math.max(0, totalTasks - completedCount)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full bg-[var(--purple)] transition-all duration-700" style={{ width: `${taskProgress}%` }} />
              </div>
            </section>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Startup Health" index={0}><Ring value={data.stats.startupHealth || 0} color="var(--purple)" /></StatCard>
              <StatCard label="Accountability Score" index={1}><Ring value={data.stats.accountability || 0} color="var(--teal)" /></StatCard>
              <StatCard label="Decisions Made" index={2}>
                <AnimatedNumber value={data.stats.decisionsThisMonth || 0} className="text-5xl font-bold" />
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>this month</p>
              </StatCard>
              <div id="pivot" className="scroll-mt-24">
                <StatCard label="Pivot Radar" index={3}>
                  <span className="inline-flex rounded-full px-3 py-1 text-sm font-bold" style={{ background: 'color-mix(in srgb, var(--purple) 15%, transparent)', color: 'var(--purple)' }}>
                    {data.stats.pivotStatus}
                  </span>
                </StatCard>
              </div>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-12">
              <section id="checkins" className="vzn-panel veixon-lift veixon-rise rounded-[1.5rem] p-6 lg:col-span-8">
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
                  onProgressUpdate={applyTaskProgress}
                />
              </section>
              <section className="vzn-panel veixon-lift veixon-rise rounded-[1.5rem] p-6 lg:col-span-4" style={{ ['--d' as any]: '0.08s' }}>
                <h2 className="mb-6 text-lg font-bold">VZN Insights</h2>
                <VznMatrixCore />
                <p className="mt-6 text-lg font-medium leading-snug">&quot;{data.insight}&quot;</p>
                <button onClick={() => router.push('/checkins')} className="vzn-button-primary mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold">
                  Run check-in
                </button>
              </section>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-12">
              <section className="vzn-panel veixon-lift veixon-rise rounded-[1.5rem] p-6 lg:col-span-4">
                <h2 className="mb-4 text-lg font-bold">Burn Clock</h2>
                <BurnClock burnRate={data.startup.burnRate} cashInBank={data.startup.cashInBank} monthlyRevenue={data.startup.monthlyRevenue} />
                <div className="mt-5 grid gap-2">
                  {(['burnRate', 'cashInBank', 'monthlyRevenue'] as const).map((key) => (
                    <input
                      key={key}
                      value={burnForm[key]}
                      onChange={(event) => setBurnForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      placeholder={key}
                      className="focus-ring vzn-input rounded-lg px-3 py-2 text-sm"
                    />
                  ))}
                  <button onClick={saveBurn} className="vzn-button-primary rounded-lg px-3 py-2 text-sm font-semibold">Save runway</button>
                </div>
              </section>
              <section className="vzn-panel veixon-lift veixon-rise overflow-hidden rounded-[1.5rem] lg:col-span-8" style={{ ['--d' as any]: '0.08s' }}>
                <div className="border-b p-6" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="text-lg font-bold">Recent decisions</h2>
                </div>
                <DecisionTable decisions={data.decisions || []} />
              </section>
            </div>

            <div id="share" className="mb-6 scroll-mt-24">
              <section className="vzn-panel veixon-lift veixon-rise rounded-[1.5rem] p-6">
                <div className="grid gap-6 md:grid-cols-[1fr_180px] items-center">
                  <div>
                    <h2 className="text-lg font-bold mb-2">Share VEIXON Co-Founder OS</h2>
                    <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                      Invite co-founders, investors, or advisors to view your real-time startup progress and VZN diagnostics.
                    </p>
                    <button
                      onClick={() => {
                        const inviteUrl = shareUrl || `${window.location.origin}/results/${data?.startup?.id || ''}`
                        const text = `Join my startup workspace on VEIXON and track our real-time execution scorecard & 90-day war plan: ${inviteUrl}`

                        if (navigator.share) {
                          navigator.share({
                            title: 'VEIXON Co-Founder Workspace Invite',
                            text: text,
                            url: inviteUrl,
                          }).then(() => {
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }).catch(() => {})
                        } else {
                          try {
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                              navigator.clipboard.writeText(inviteUrl).then(() => {
                                setCopied(true)
                                setTimeout(() => setCopied(false), 2000)
                              })
                            } else {
                              const textArea = document.createElement('textarea')
                              textArea.value = inviteUrl
                              textArea.style.position = 'fixed'
                              textArea.style.opacity = '0'
                              document.body.appendChild(textArea)
                              textArea.focus()
                              textArea.select()
                              document.execCommand('copy')
                              document.body.removeChild(textArea)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }
                          } catch (err) {
                            console.error('Clipboard copy failed:', err)
                          }
                        }
                      }}
                      className="vzn-button-primary rounded-xl px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-all duration-300"
                      style={{
                        background: copied ? 'var(--teal)' : undefined,
                        borderColor: copied ? 'var(--teal)' : undefined,
                      }}
                    >
                      {copied ? '✓ Invite Link Copied!' : 'Copy Workspace Invite Link'}
                    </button>
                  </div>
                  {shareUrl && (
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl border" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg-secondary) 50%, transparent)' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shareUrl)}&color=818cf8&bgcolor=111022`}
                        alt="Workspace QR Code"
                        className="h-[120px] w-[120px] rounded-xl"
                      />
                      <div className="mt-2 text-[9px] font-mono tracking-wider uppercase text-center" style={{ color: 'var(--text-muted)' }}>Scan to view</div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
      <NotificationPermission />
    </AppShell>
  )
}
