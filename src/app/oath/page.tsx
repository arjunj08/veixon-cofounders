'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import VZNAvatar from '@/components/ui/VZNAvatar'
import OathPortal from '@/components/oath/OathPortal'
import AppShell from '@/components/AppShell'

export default function OathPage() {
  const router = useRouter()
  const [oath, setOath] = useState('')
  const [error, setError] = useState('')

  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!oath.trim()) {
      setError('One sentence. No hiding.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/startups/oath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oath }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || data.dbFallback) {
        // Fallback to local storage persistence!
        const activeId = window.localStorage.getItem('visionix_active_startup_id')
        if (activeId) {
          const localRecord = window.localStorage.getItem(`veixon_startup_${activeId}`)
          if (localRecord) {
            try {
              const parsed = JSON.parse(localRecord)
              parsed.oath = oath
              parsed.oathDate = new Date().toISOString()
              window.localStorage.setItem(`veixon_startup_${activeId}`, JSON.stringify(parsed))
              router.push('/dashboard')
              return
            } catch {}
          }
        }
        
        if (!res.ok) {
          setError(data?.error || 'Could not save your commitment. Try again.')
          setSaving(false)
          return
        }
      }
      router.push('/dashboard')
    } catch {
      // Catch network errors and try local storage fallback
      const activeId = window.localStorage.getItem('visionix_active_startup_id')
      if (activeId) {
        const localRecord = window.localStorage.getItem(`veixon_startup_${activeId}`)
        if (localRecord) {
          try {
            const parsed = JSON.parse(localRecord)
            parsed.oath = oath
            parsed.oathDate = new Date().toISOString()
            window.localStorage.setItem(`veixon_startup_${activeId}`, JSON.stringify(parsed))
            router.push('/dashboard')
            return
          } catch {}
        }
      }
      setError('Network error. Try again.')
      setSaving(false)
    }
  }

  return (
    <AppShell title="Founder Oath" subtitle="Make the commitment before execution starts.">
      <div className="vzn-page-pad grid min-h-[calc(100vh-120px)] place-items-center text-center">
      <form onSubmit={submit} className="vzn-panel-strong veixon-rise w-full max-w-[680px] rounded-[1.5rem] p-6 md:p-10">
        <OathPortal oathLength={oath.length} />
        <div className="vzn-section-label mt-7">Commitment Lock</div>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">VZN has given you everything.</h1>
        <p className="mt-3 text-base md:text-lg" style={{ color: 'var(--text-muted)' }}>Now you make a commitment.</p>
        <label className="mt-10 block text-left">
          <textarea
            value={oath}
            onChange={(event) => setOath(event.target.value.slice(0, 200))}
            maxLength={200}
            placeholder="In one sentence - why will YOU specifically succeed where others have failed?"
            rows={5}
            className="focus-ring vzn-input w-full resize-none rounded-2xl p-4 text-base"
          />
          <span className="mt-2 block text-right text-xs" style={{ color: 'var(--text-muted)' }}>{oath.length}/200</span>
        </label>
        {error && <p className="mt-3 text-sm text-[var(--amber)]">{error}</p>}
        <button
          disabled={saving}
          className="vzn-button-primary mt-6 w-full rounded-xl px-5 py-3.5 font-semibold disabled:opacity-60"
        >
          {saving ? 'Committing…' : 'I commit.'}
        </button>
      </form>
      </div>
    </AppShell>
  )
}
