'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// Clean, preview-matching top nav (replaces the old VISIONIX-logo Navbar on the homepage).
// Monochrome, glassy, with a visible "Analyse my idea" CTA (black text on white in dark mode).
export default function HomeNav() {
  const [solid, setSolid] = useState(false)
  const { status } = useSession()
  const authed = status === 'authenticated'
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const t = document.querySelector(id)
    if (t) {
      const r = t.getBoundingClientRect()
      window.scrollTo({ top: r.top + window.scrollY - 56, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors"
      style={{ borderColor: solid ? 'var(--border)' : 'transparent', background: solid ? 'var(--nav-bg)' : 'transparent', backdropFilter: solid ? 'blur(12px)' : 'none' }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <a href="#top" onClick={go('#top')} className="text-[15px] font-extrabold tracking-[0.2em] text-[var(--text-primary)]">
          VE<span style={{ color: 'var(--text-muted)' }}>I</span>XON
        </a>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" onClick={go('#how-it-works')} className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">How it works</a>
          <a href="#features" onClick={go('#features')} className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">Features</a>
          <a href="#proof" onClick={go('#proof')} className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">Why trust it</a>
          {authed ? (
            <Link
              href="/dashboard"
              className="rounded-full px-5 py-2 text-sm font-bold transition-transform active:scale-95 hover:opacity-90"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth" className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">Log in</Link>
              <a
                href="#top"
                onClick={go('#top')}
                className="rounded-full px-5 py-2 text-sm font-bold transition-transform active:scale-95 hover:opacity-90"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
              >
                Analyse my idea
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
