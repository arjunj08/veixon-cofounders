'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  CheckSquare,
  LayoutDashboard,
  Lightbulb,
  Lock,
  LogOut,
  Map,
  Radar,
  Settings,
  Share2,
  Zap,
} from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import VZNAvatar from '@/components/ui/VZNAvatar'
import LogoButton from '@/components/ui/LogoButton'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/intake', label: 'My Idea', icon: Lightbulb },
  { href: '/decisions', label: 'Decisions', icon: Zap },
  { href: '/dashboard#pivot', label: 'Pivot Radar', icon: Radar },
  { href: '/dashboard#checkins', label: 'Check-ins', icon: CheckSquare },
  { href: '/results/latest#war-plan', label: 'War Plan', icon: Map },
  { href: '/vault', label: 'VC Vault', icon: Lock },
  { href: '/dashboard#share', label: 'Share', icon: Share2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const email = session?.user?.email || 'founder@visionix.ai'

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-[60px] flex-col border-r lg:w-[240px]"
      style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
    >
      <div className="flex h-16 items-center gap-3 border-b px-3 lg:px-5" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logos/clusterx.png"
            alt="CLUSTERX Logo"
            width={40}
            height={40}
            priority
            className="h-8 w-auto shrink-0"
          />
          <span className="hidden text-sm font-semibold tracking-wide lg:inline">VISIONIX</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-5 lg:px-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href.split('#')[0]
          return (
            <Link
              key={label}
              href={href}
              title={label}
              className="group flex h-11 items-center gap-3 rounded-lg border-l-[3px] px-3 text-sm font-medium transition-colors"
              style={{
                background: active ? 'color-mix(in srgb, var(--purple) 15%, transparent)' : 'transparent',
                borderColor: active ? 'var(--purple)' : 'transparent',
                color: active ? 'var(--purple)' : 'var(--text-muted)',
              }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-3 border-t p-3 lg:p-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--purple)] text-xs font-bold text-white">
            {(session?.user?.name || email).charAt(0).toUpperCase()}
          </div>
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-sm font-medium">{session?.user?.name || 'Founder'}</div>
            <div className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>{email}</div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/auth' })}
            className="focus-ring grid h-9 w-9 place-items-center rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
