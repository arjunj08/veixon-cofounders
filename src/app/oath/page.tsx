'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import VZNAvatar from '@/components/ui/VZNAvatar'

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
      // Server resolves the startup from the session — no localStorage dependency,
      // so this can't silently fail and bounce you back here.
      const res = await fetch('/api/startups/oath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oath }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || 'Could not save your commitment. Try again.')
        setSaving(false)
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Network error. Try again.')
      setSaving(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg-primary)] px-6 py-16 text-center">
      <form onSubmit={submit} className="w-full max-w-[620px]">
        <VZNAvatar size="lg" className="mx-auto" />
        <h1 className="mt-8 text-4xl font-bold">VZN has given you everything.</h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--text-muted)' }}>Now you make a commitment.</p>
        <label className="mt-10 block text-left">
          <textarea
            value={oath}
            onChange={(event) => setOath(event.target.value.slice(0, 200))}
            maxLength={200}
            placeholder="In one sentence - why will YOU specifically succeed where others have failed?"
            rows={5}
            className="focus-ring w-full resize-none rounded-2xl border p-4 text-base"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <span className="mt-2 block text-right text-xs" style={{ color: 'var(--text-muted)' }}>{oath.length}/200</span>
        </label>
        {error && <p className="mt-3 text-sm text-[var(--amber)]">{error}</p>}
        <button
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-[var(--purple)] px-5 py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Committing…' : 'I commit.'}
        </button>
      </form>
    </main>
  )
}
