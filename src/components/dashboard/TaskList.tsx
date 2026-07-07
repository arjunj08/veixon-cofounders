'use client'

import { useEffect, useState } from 'react'
import { CheckSquare, Square, X } from 'lucide-react'
import ShareCard from '@/components/dashboard/ShareCard'

type TaskProgress = {
  taskId: string
  taskCompletionRate?: number
  accountabilityScore?: number
  completedTasks?: Array<{ taskId: string; completedAt: string }>
  completedCount?: number
  totalTasks?: number
}

export default function TaskList({
  tasks = [],
  startupId,
  startupName,
  initialCompleted = [],
  week = 1,
  onProgressUpdate,
}: {
  tasks: any[]
  startupId?: string
  startupName?: string
  initialCompleted?: string[]
  week?: number
  onProgressUpdate?: (progress: TaskProgress) => void
}) {
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === 'undefined') return initialCompleted
    const local = window.localStorage.getItem(`veixon_completed_tasks_${startupId}`)
    if (local) {
      try {
        const parsed = JSON.parse(local)
        if (Array.isArray(parsed)) {
          return Array.from(new Set([...initialCompleted, ...parsed]))
        }
      } catch {}
    }
    return initialCompleted
  })
  const [sharingTask, setSharingTask] = useState<string | null>(null)
  const [progress, setProgress] = useState<TaskProgress | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !startupId) return
    const local = window.localStorage.getItem(`veixon_completed_tasks_${startupId}`)
    if (local) {
      try {
        const parsed = JSON.parse(local)
        if (Array.isArray(parsed)) {
          setCompleted(Array.from(new Set([...initialCompleted, ...parsed])))
          return
        }
      } catch {}
    }
    setCompleted(initialCompleted)
  }, [initialCompleted, startupId])

  const getTaskId = (task: any, index: number) => `wk${task.week || week}-day${task.day || index + 1}`

  const handleToggle = async (task: any, index: number) => {
    const taskId = getTaskId(task, index)
    if (completed.includes(taskId) || completed.includes(task.task)) return

    const nextCompleted = [...completed, taskId]
    setCompleted(nextCompleted)
    setSharingTask(taskId)

    if (typeof window !== 'undefined' && startupId) {
      window.localStorage.setItem(`veixon_completed_tasks_${startupId}`, JSON.stringify(nextCompleted))
    }

    if (!startupId) {
      const total = 90
      const done = nextCompleted.length
      const rate = done / total
      const score = Math.round(rate * 100)
      const nextProgress: TaskProgress = {
        taskId,
        taskCompletionRate: rate,
        accountabilityScore: score,
        completedTasks: nextCompleted.map(id => ({ taskId: id, completedAt: new Date().toISOString() })),
        completedCount: done,
        totalTasks: total,
      }
      setProgress(nextProgress)
      onProgressUpdate?.(nextProgress)
      return
    }

    try {
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, taskId, taskLabel: task.task }),
      })

      if (!response.ok) throw new Error('Task update failed')

      const result = await response.json()
      if (Array.isArray(result.completedTasks)) {
        const ids = result.completedTasks.map((item: any) => item.taskId)
        setCompleted(ids)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(`veixon_completed_tasks_${startupId}`, JSON.stringify(ids))
        }
      }

      const nextProgress: TaskProgress = {
        taskId,
        taskCompletionRate: result.taskCompletionRate,
        accountabilityScore: result.accountabilityScore,
        completedTasks: result.completedTasks,
        completedCount: result.completedCount,
        totalTasks: result.totalTasks,
      }

      setProgress(nextProgress)
      onProgressUpdate?.(nextProgress)
    } catch (error) {
      console.warn('Backend task completion sync failed, using local storage cache:', error)
      const total = 90
      const done = nextCompleted.length
      const rate = done / total
      const score = Math.round(rate * 100)
      
      const localCompletedTasks = nextCompleted.map(id => ({ taskId: id, completedAt: new Date().toISOString() }))
      
      const activeId = window.localStorage.getItem('visionix_active_startup_id')
      if (activeId) {
        const localRecord = window.localStorage.getItem(`veixon_startup_${activeId}`)
        if (localRecord) {
          try {
            const parsed = JSON.parse(localRecord)
            parsed.completedTasks = localCompletedTasks
            parsed.taskCompletionRate = rate
            parsed.accountabilityScore = score
            window.localStorage.setItem(`veixon_startup_${activeId}`, JSON.stringify(parsed))
          } catch {}
        }
      }

      const nextProgress: TaskProgress = {
        taskId,
        taskCompletionRate: rate,
        accountabilityScore: score,
        completedTasks: localCompletedTasks,
        completedCount: done,
        totalTasks: total,
      }
      setProgress(nextProgress)
      onProgressUpdate?.(nextProgress)
    }
  }

  if (!tasks.length) {
    return (
      <div className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Complete your first check-in.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const taskId = getTaskId(task, index)
        const dayLabel = Number(task.day || index + 1)
        const taskWeek = Number(task.week || week)
        const isCompleted = completed.includes(taskId) || completed.includes(task.task)
        const isSharing = sharingTask === taskId
        const missionCode = task.missionCode || `WEEK ${taskWeek}`

        return (
          <div
            key={taskId}
            className="veixon-lift veixon-rise flex flex-col gap-2 rounded-lg border p-3"
            style={{
              borderColor: isCompleted ? 'var(--teal)' : 'var(--border)',
              background: isCompleted ? 'color-mix(in srgb, var(--teal) 5%, transparent)' : 'transparent',
              ['--d' as any]: `${Math.min(index, 8) * 0.06}s`,
            }}
          >
            <div className="flex items-start gap-3">
              <button onClick={() => handleToggle(task, index)} className="mt-0.5 text-[var(--purple)] hover:opacity-80 disabled:opacity-50" disabled={isCompleted}>
                {isCompleted ? <CheckSquare className="h-5 w-5 text-[var(--teal)]" /> : <Square className="h-5 w-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${isCompleted ? 'line-through opacity-60' : ''}`}>{task.task}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Day {dayLabel} | {task.successMetric || task.category || 'execution'}
                </p>
              </div>
            </div>

            {isSharing && (
              <div className="ml-0 mt-2 rounded-xl border p-3 md:ml-8" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[var(--teal)]">Task completed.</span>
                  <button onClick={() => setSharingTask(null)} className="rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Close share card">
                    <X size={16} />
                  </button>
                </div>
                <ShareCard
                  shareAngle={task.task}
                  missionCode={missionCode}
                  week={taskWeek}
                  day={dayLabel}
                  startupName={startupName}
                  completionRate={progress?.taskCompletionRate}
                  completedCount={progress?.completedCount}
                  totalTasks={progress?.totalTasks}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
