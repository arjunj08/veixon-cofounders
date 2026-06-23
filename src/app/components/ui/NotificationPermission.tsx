'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { requestNotificationPermission } from '@/lib/firebase'

export default function NotificationPermission() {
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle')

  useEffect(() => {
    // Only show after 30 seconds on first visit and if permission not yet decided
    const hasAsked = localStorage.getItem('vzn-notif-asked')
    if (
      !hasAsked &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      const timer = setTimeout(() => setShow(true), 30000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('vzn-notif-asked', 'true')
  }

  const handleEnable = async () => {
    setStatus('loading')
    const token = await requestNotificationPermission()

    if (token) {
      try {
        await fetch('/api/notifications/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcmToken: token }),
        })
      } catch {
        // Non-fatal — token saved locally already
      }
      setStatus('granted')
      localStorage.setItem('vzn-notif-asked', 'true')
      setTimeout(() => setShow(false), 2000)
    } else {
      setStatus('denied')
      localStorage.setItem('vzn-notif-asked', 'true')
    }
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 left-6 z-40 w-[320px] rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[0_0_40px_rgba(83,74,183,0.2)]">
      {/* Close */}
      <button
        onClick={dismiss}
        className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--purple)]/15">
          <Bell className="h-5 w-5 text-[var(--purple)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Enable VZN alerts</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">
            VZN will remind you about daily tasks, streak risks, and Monday missiles. Miss nothing.
          </p>
        </div>
      </div>

      {/* States */}
      {status === 'granted' && (
        <div className="rounded-xl border border-[var(--teal)] bg-[var(--teal)]/10 px-3 py-2 text-center text-sm text-[var(--teal)]">
          ✓ VZN notifications enabled
        </div>
      )}

      {status === 'denied' && (
        <div className="rounded-xl border border-red-500 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">
          Notifications blocked. Enable in browser settings.
        </div>
      )}

      {status === 'loading' && (
        <div className="py-2 text-center text-sm text-[var(--text-muted)]">
          Requesting permission...
        </div>
      )}

      {status === 'idle' && (
        <div className="flex gap-2">
          <button
            onClick={handleEnable}
            className="flex-1 rounded-xl bg-[var(--purple)] py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
          >
            Enable alerts
          </button>
          <button
            onClick={dismiss}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-muted)] transition-all hover:border-[var(--purple)]"
          >
            Later
          </button>
        </div>
      )}
    </div>
  )
}
