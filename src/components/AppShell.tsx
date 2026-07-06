'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import AmbientBackdrop from '@/components/dashboard/AmbientBackdrop'
import PageReveal from '@/components/dashboard/PageReveal'

export default function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode
  title?: string
  subtitle?: string
  actions?: ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'VZN Co-founder profile initialized.', time: 'Just now', read: false },
    { id: '2', text: 'Day 1 task verified. 1% progress logged.', time: '2 hours ago', read: false },
    { id: '3', text: 'Scorecard analysis complete: risk vector updated.', time: '1 day ago', read: true },
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }
  const hasHeader = title || subtitle || actions
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleHashScroll = () => {
      const hash = window.location.hash
      if (hash) {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 150)
        }
      }
    }

    // Run on path change / mount
    handleHashScroll()

    window.addEventListener('hashchange', handleHashScroll)
    return () => window.removeEventListener('hashchange', handleHashScroll)
  }, [pathname])

  return (
    <div className="vzn-app-shell relative min-h-screen text-[var(--text-primary)]">
      <AmbientBackdrop />
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <main className="relative z-10 min-h-screen pl-0 lg:pl-[244px]">
        {hasHeader ? (
          <header
            className="vzn-shell-header sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-3 border-b px-4 py-3 md:px-8"
          >
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setNavOpen(true)}
                aria-label="Open menu"
                className="veixon-press vzn-icon-button grid h-10 w-10 shrink-0 place-items-center rounded-xl border lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <span className="vzn-header-accent hidden h-10 w-[3px] shrink-0 rounded-full sm:block" />
              <div className="min-w-0">
                {title && <h1 className="truncate text-lg font-bold tracking-tight md:text-2xl">{title}</h1>}
                {subtitle && (
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] md:text-xs" style={{ color: 'var(--text-dim)' }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="veixon-press vzn-icon-button relative hidden h-10 w-10 place-items-center rounded-xl border md:grid"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="veixon-pulse absolute right-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: 'var(--teal)' }} />
                  )}
                </button>

                {showNotifications && (
                  <div 
                    className="absolute right-0 mt-2 w-[300px] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                    style={{
                      background: 'rgba(13, 12, 30, 0.92)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--purple)]">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] hover:underline" style={{ color: 'var(--text-muted)' }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3 max-h-[220px] overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="text-left text-xs leading-relaxed transition-opacity" style={{ opacity: n.read ? 0.6 : 1 }}>
                          <p className="font-medium text-white">{n.text}</p>
                          <span className="text-[9px] block mt-0.5" style={{ color: 'var(--text-dim)' }}>{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        ) : (
          <button
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            className="veixon-press vzn-icon-button fixed left-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-xl border backdrop-blur-xl lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <PageReveal>{children}</PageReveal>
      </main>
    </div>
  )
}

export { AppShell }
