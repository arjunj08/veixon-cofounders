'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

type Msg = { role: 'vzn' | 'me'; text: string }

// Pages where VZN must NOT appear (landing + idea submission are intentionally left untouched).
const HIDDEN = ['/', '/intake', '/auth']

function fallbackReply(q: string, ctx: any): string {
  const t = q.toLowerCase()
  if (/pivot|change direction|give up|quit/.test(t)) return "Don't pivot on a feeling. Pivot on a number. What does your last week of data actually say?"
  if (/scared|afraid|doubt|fail|stuck/.test(t)) return 'Fear is fine. Inaction isn\'t. The cure for doubt is your next task, not a pep talk.'
  if (/vc|funding|raise|invest|vault/.test(t)) return ctx?.vaultUnlocked ? 'Vault\'s open. Lead with traction in line one, the ask in line two. No life stories.' : 'VCs come after proof. Hit 70% of tasks and a score of 60+. Earn the intro.'
  if (/hi|hello|hey/.test(t)) return "Hey. You didn't open this to chat. What's blocking you?"
  return 'Be specific. Vague questions get vague answers — and we don\'t have time for either.'
}

export default function VZNChat() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'vzn', text: "I'm VZN. I don't do cheerleading. Ask me about your idea, your plan, or what to do next." }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [startup, setStartup] = useState<any>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only fetch founder context the first time the panel is opened — avoids an
    // API/DB request on every page navigation when the chat is closed.
    if (!open || startup || typeof window === 'undefined') return
    const id = window.localStorage.getItem('visionix_active_startup_id')
    if (!id) return
    fetch(`/api/startups/${id}`).then((r) => r.json()).then(setStartup).catch(() => {})
  }, [open, startup])

  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight)
  }, [msgs, open])

  // Hidden on landing/intake/auth, and until the user is signed in.
  if (HIDDEN.includes(pathname) || !session) return null

  const founderName = (session.user as any)?.name || (session.user as any)?.email?.split('@')[0] || 'Founder'

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setMsgs((m) => [...m, { role: 'me', text }])
    setInput('')
    setSending(true)
    try {
      const res = await fetch('/api/chat/vzn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          founderName,
          startupName: startup?.ideaText?.slice(0, 50),
          ideaText: startup?.ideaText,
          marketIntelligence: startup?.marketIntelligence,
          accountabilityScore: startup?.accountabilityScore,
          streakCount: startup?.streakCount,
          oath: startup?.oath,
          tractionProof: startup?.tractionProof,
          lastDebriefSignal: startup?.dayDebriefs?.[startup.dayDebriefs.length - 1]?.theSignal,
        }),
      })
      const data = await res.json().catch(() => ({}))
      const reply = data?.reply || fallbackReply(text, { vaultUnlocked: startup?.vaultUnlocked })
      setMsgs((m) => [...m, { role: 'vzn', text: reply }])
    } catch {
      setMsgs((m) => [...m, { role: 'vzn', text: fallbackReply(text, { vaultUnlocked: startup?.vaultUnlocked }) }])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-[88px] right-[18px] z-[60] flex h-[440px] max-h-[70vh] w-[340px] max-w-[calc(100vw-36px)] flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2 border-b px-4 py-3 font-bold" style={{ borderColor: 'var(--border)' }}>
              <span className="h-7 w-7 rounded-full" style={{ background: 'radial-gradient(circle at 32% 30%, #7b73e0, var(--purple) 60%, #2c267a)' }} />
              VZN <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>· your co-founder</span>
              <button className="ml-auto" style={{ color: 'var(--text-muted)' }} onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <div ref={scroller} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3.5">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className="max-w-[84%] rounded-2xl px-3 py-2 text-[13.5px] leading-snug"
                  style={
                    m.role === 'me'
                      ? { background: 'var(--purple)', color: '#fff', alignSelf: 'flex-end', borderBottomRightRadius: 4 }
                      : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', alignSelf: 'flex-start', borderBottomLeftRadius: 4 }
                  }
                >
                  {m.text}
                </div>
              ))}
              {sending && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>VZN is thinking…</div>}
            </div>
            <div className="flex gap-2 border-t p-2.5" style={{ borderColor: 'var(--border)' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask VZN anything…"
                className="flex-1 rounded-xl border px-3 py-2 text-sm"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button onClick={send} disabled={sending} className="grid w-11 place-items-center rounded-xl font-bold text-white disabled:opacity-50" style={{ background: 'var(--purple)' }}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-[18px] right-[18px] z-[60] grid h-14 w-14 place-items-center rounded-full font-extrabold text-white shadow-2xl"
        style={{ background: 'radial-gradient(circle at 32% 30%, #7b73e0, var(--purple) 60%, #2c267a)' }}
        aria-label="Open VZN chat"
      >
        VZN
      </button>
    </>
  )
}
