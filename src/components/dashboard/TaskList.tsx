'use client'

import { useState } from 'react'
import { CheckSquare, Square, ExternalLink } from 'lucide-react'

export default function TaskList({ tasks = [], startupId, initialCompleted = [], week = 1 }: { tasks: any[], startupId?: string, initialCompleted?: string[], week?: number }) {
  const [completed, setCompleted] = useState<string[]>(initialCompleted)
  const [sharingTask, setSharingTask] = useState<string | null>(null)

  const getTaskId = (task: any, index: number) => {
    // Generate a unique coordinate-based ID to avoid collisions
    return `wk${task.week || week}-day${task.day || index + 1}`
  }

  const handleToggle = async (task: any, index: number) => {
    const taskId = getTaskId(task, index)
    if (completed.includes(taskId) || completed.includes(task.task)) return // Support legacy string IDs

    // Mark locally
    setCompleted((prev) => [...prev, taskId])
    setSharingTask(taskId)

    // Call API if we have a startupId
    if (startupId) {
      try {
        await fetch('/api/tasks/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startupId, taskId })
        })
      } catch (err) {
        console.error('Failed to complete task', err)
      }
    }
  }

  const shareOnLinkedIn = (task: any, index: number) => {
    const dayLabel = task.day || index + 1
    const text = `Just conquered Day ${dayLabel} of my 90-day war plan building my startup: "${task.task}". \n\nPowered by @VISIONIX AI Co-founder.`
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setSharingTask(null)
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
        const isCompleted = completed.includes(taskId) || completed.includes(task.task)
        const isSharing = sharingTask === taskId

        return (
          <div key={index} className="flex flex-col gap-2 rounded-lg border p-3 transition-colors" style={{ borderColor: isCompleted ? 'var(--teal)' : 'var(--border)', background: isCompleted ? 'color-mix(in srgb, var(--teal) 5%, transparent)' : 'transparent' }}>
            <div className="flex items-start gap-3">
              <button onClick={() => handleToggle(task, index)} className="mt-0.5 text-[var(--purple)] hover:opacity-80 disabled:opacity-50" disabled={isCompleted}>
                {isCompleted ? <CheckSquare className="h-5 w-5 text-[var(--teal)]" /> : <Square className="h-5 w-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${isCompleted ? 'line-through opacity-60' : ''}`}>{task.task}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Day {task.day || index + 1} · {task.successMetric || task.category || 'execution'}
                </p>
              </div>
            </div>
            {isSharing && (
              <div className="mt-2 ml-8 flex items-center justify-between rounded-md p-2 text-sm" style={{ background: 'var(--bg-secondary)' }}>
                <span className="font-semibold text-[var(--teal)]">Task completed! 🎉</span>
                <button onClick={() => shareOnLinkedIn(task, index)} className="flex items-center gap-1 rounded bg-[#0A66C2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#004182]">
                  Share update <ExternalLink size={12} />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
