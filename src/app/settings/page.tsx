'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import AppShell from '@/components/AppShell'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<'test' | 'congrats' | null>(null)
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null)

  async function handleSendTest(type: 'test' | 'congrats') {
    setLoading(type)
    setStatusMsg(null)
    try {
      const email = session?.user?.email || 'founder@veixon.com'
      const res = await fetch(`/api/email/test?to=${encodeURIComponent(email)}&type=${type}`)
      const data = await res.json()
      if (data.sent) {
        setStatusMsg({ success: true, text: `✓ Email successfully sent to ${email}!` })
      } else {
        setStatusMsg({ success: false, text: `✗ Failed to send: ${data.reason || 'SMTP error'}` })
      }
    } catch {
      setStatusMsg({ success: false, text: '✗ Network error. Try again.' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <AppShell title="Settings" subtitle="Account, theme, and billing.">
      <div className="mx-auto grid w-full max-w-4xl gap-6 p-4 md:p-8">
        <section className="vzn-panel rounded-[1.5rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--purple)]">Account</div>
          <h2 className="mt-2 text-2xl font-bold">{session?.user?.name || 'Founder'}</h2>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{session?.user?.email}</p>
          <button onClick={() => signOut({ callbackUrl: '/auth' })} className="vzn-button-ghost mt-5 rounded-lg border px-4 py-2 text-sm">
            Log out
          </button>
        </section>

        <section className="vzn-panel rounded-[1.5rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--purple)]">Email Notifications & Previews</div>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            VEIXON dispatches congrats notifications and VZN co-founder guidance directly to your inbox. Use the buttons below to preview the email systems end-to-end.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button 
              onClick={() => handleSendTest('test')}
              disabled={loading !== null}
              className="vzn-button-ghost inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm disabled:opacity-50 transition-all hover:border-[var(--purple)]"
            >
              {loading === 'test' ? 'Sending...' : 'Send Test SMTP Mail'}
            </button>
            <button 
              onClick={() => handleSendTest('congrats')}
              disabled={loading !== null}
              className="vzn-button-ghost inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm disabled:opacity-50 transition-all hover:border-[var(--purple)]"
            >
              {loading === 'congrats' ? 'Sending...' : 'Send Congrats & Motivation Mail'}
            </button>
          </div>
          {statusMsg && (
            <p className="mt-3 text-xs font-medium" style={{ color: statusMsg.success ? 'var(--teal)' : 'var(--red)' }}>
              {statusMsg.text}
            </p>
          )}
        </section>

        <section className="vzn-panel rounded-[1.5rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--purple)]">Theme</div>
          <div className="mt-4 flex items-center justify-between">
            <p style={{ color: 'var(--text-muted)' }}>Default is dark. VZN does not do cheerful.</p>
            <ThemeToggle />
          </div>
        </section>

        <section className="vzn-panel rounded-[1.5rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--purple)]">Billing</div>
          <h2 className="mt-2 text-2xl font-bold">Free tier</h2>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Stripe subscription hooks are ready for INR monthly plans.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {['Free - Rs 0/mo', 'Founders - Rs 999/mo', 'Team - Rs 2,499/mo'].map((tier) => (
              <button key={tier} className="vzn-button-ghost rounded-xl border p-4 text-left text-sm">
                {tier}
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
