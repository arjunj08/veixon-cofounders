'use client'

import { ReactNode } from 'react'
import { Bell } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'

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
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-h-screen pl-[60px] lg:pl-[240px]">
        {(title || subtitle || actions) && (
          <header
            className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b px-4 py-3 backdrop-blur-md md:px-8"
            style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}
          >
            <div className="min-w-0">
              {title && <h1 className="truncate text-lg font-bold md:text-2xl">{title}</h1>}
              {subtitle && <p className="mt-0.5 truncate text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <button className="focus-ring hidden h-9 w-9 place-items-center rounded-lg border md:grid" style={{ borderColor: 'var(--border)' }}>
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>
        )}
        {children}
      </main>
    </div>
  )
}

export { AppShell }
