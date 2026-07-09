'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, X, Check, Trash2 } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import AmbientBackdrop from '@/components/dashboard/AmbientBackdrop'
import PageReveal from '@/components/dashboard/PageReveal'
import { 
  getNotifications, 
  markAllNotificationsRead, 
  dismissNotification, 
  clearAllNotifications 
} from '@/lib/client-notifications'

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
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const unreadCount = notifications.filter(n => !n.read).length
  const hasHeader = title || subtitle || actions
  const pathname = usePathname()

  // Load and sync notifications
  useEffect(() => {
    setNotifications(getNotifications())

    const handleUpdate = () => {
      setNotifications(getNotifications())
    }

    window.addEventListener('veixon-notification-update', handleUpdate)
    return () => window.removeEventListener('veixon-notification-update', handleUpdate)
  }, [])

  // Close notifications dropdown on click outside
  useEffect(() => {
    if (!showNotifications) return

    const handleClickOutside = (e: MouseEvent) => {
      const container = document.getElementById('vzn-notifications-dropdown')
      const trigger = document.getElementById('vzn-notifications-trigger')
      if (
        container &&
        !container.contains(e.target as Node) &&
        trigger &&
        !trigger.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

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
                  id="vzn-notifications-trigger"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="veixon-press vzn-icon-button relative flex h-10 w-10 place-items-center rounded-xl border"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 mx-auto" />
                  {unreadCount > 0 && (
                    <span className="veixon-pulse absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
                  )}
                </button>

                {showNotifications && (
                  <div 
                    id="vzn-notifications-dropdown"
                    className="absolute right-0 mt-2 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                    style={{
                      background: 'rgba(13, 12, 30, 0.94)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), inset 0 0 15px rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--purple)] flex items-center gap-1.5">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold text-black" style={{ background: 'var(--teal)' }}>
                            {unreadCount}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <>
                            {unreadCount > 0 && (
                              <button 
                                onClick={() => {
                                  markAllNotificationsRead()
                                }} 
                                className="text-[10px] hover:underline" 
                                style={{ color: 'var(--text-muted)' }}
                              >
                                Mark all read
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                clearAllNotifications()
                              }} 
                              className="text-[10px] hover:text-red-400 flex items-center gap-0.5" 
                              style={{ color: 'var(--text-dim)' }}
                              title="Clear all notifications"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs" style={{ color: 'var(--text-dim)' }}>
                          <p className="font-medium">All caught up.</p>
                          <p className="text-[10px] mt-0.5">Focus on building your vision.</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (!n.read) {
                                const list = getNotifications()
                                const updated = list.map(item => item.id === n.id ? { ...item, read: true } : item)
                                localStorage.setItem('veixon_notifications', JSON.stringify(updated))
                                window.dispatchEvent(new Event('veixon-notification-update'))
                              }
                              if (n.link) {
                                setShowNotifications(false)
                                router.push(n.link)
                              }
                            }}
                            className="group relative text-left text-xs p-2.5 rounded-xl border leading-relaxed transition-all cursor-pointer hover:bg-white/5" 
                            style={{ 
                              opacity: n.read ? 0.55 : 1,
                              background: n.read ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                              borderColor: n.read ? 'rgba(255, 255, 255, 0.04)' : 'rgba(168, 85, 247, 0.15)'
                            }}
                          >
                            <div className="pr-6">
                              <p className={`font-medium ${n.read ? 'text-white/80' : 'text-white'}`}>{n.text}</p>
                              <span className="text-[9px] block mt-1" style={{ color: 'var(--text-dim)' }}>{n.time}</span>
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute right-2 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-md p-0.5">
                              {!n.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const list = getNotifications()
                                    const updated = list.map(item => item.id === n.id ? { ...item, read: true } : item)
                                    localStorage.setItem('veixon_notifications', JSON.stringify(updated))
                                    window.dispatchEvent(new Event('veixon-notification-update'))
                                  }}
                                  className="p-1 hover:bg-white/10 rounded text-teal-400"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  dismissNotification(n.id)
                                }}
                                className="p-1 hover:bg-white/10 rounded text-red-400"
                                title="Dismiss"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Unread Indicator dot inside card */}
                            {!n.read && (
                              <span className="absolute right-2.5 bottom-3.5 h-1.5 w-1.5 rounded-full" style={{ background: 'var(--purple)' }} />
                            )}
                          </div>
                        ))
                      )}
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
