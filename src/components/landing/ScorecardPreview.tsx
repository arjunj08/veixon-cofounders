'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import VZNAvatar from '@/components/ui/VZNAvatar'

const scores = [
  ['Market', 8, 'var(--purple)'],
  ['Moat', 6, 'var(--purple)'],
  ['Timing', 9, 'var(--purple)'],
  ['Founder Fit', 7, 'var(--purple)'],
  ['Monetisation', 7, 'var(--purple)'],
  ['Execution Risk', 5, 'var(--red)'],
] as const

const notes = [
  ['FAILURE MODE', 'Distribution risk is not a side quest.', 'The first 30 days are about proving you can reach buyers without burning founder energy on fake momentum.'],
  ['SURVIVAL EDGE', 'Your first wedge must feel narrow.', 'If everyone is your customer, VEIXON Co-founders will treat that as avoidance, not ambition.'],
  ['WAR PLAN', 'Every mission is falsifiable.', 'Tasks are written so you can either complete them or admit you dodged them.'],
]

export default function ScorecardPreview() {
  return (
    <section className="relative z-10 px-6 py-[120px]">
      <h2 className="mx-auto mb-12 max-w-[760px] text-center text-[34px] font-bold md:text-[42px]">
        See what VEIXON Co-founders sees in your idea.
      </h2>
      <div className="mx-auto grid max-w-[1000px] items-center gap-12 lg:grid-cols-2">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-[20px] border p-7"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', boxShadow: '0 0 80px var(--card-glow)' }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VZNAvatar size="sm" />
              <div>
                <div className="text-sm font-bold">VEIXON Co-founders Analysis</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Scorecard preview</div>
              </div>
            </div>
            <span className="rounded-full border px-2 py-1 text-xs text-[var(--amber)]" style={{ borderColor: 'var(--amber)' }}>
              VEIXON Co-founders
            </span>
          </div>

          <div className="space-y-4">
            {scores.map(([label, value, color], index) => (
              <div key={label} className="grid grid-cols-[110px_1fr_44px] items-center gap-3">
                <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value * 10}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
                <span className="text-right text-[13px] font-bold">{value}/10</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-xl border px-4 py-2.5 text-sm text-[var(--amber)]" style={{ background: 'color-mix(in srgb, var(--amber) 10%, transparent)', borderColor: 'var(--amber)' }}>
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Distribution will kill you before product does.
          </div>
        </motion.div>

        <div className="space-y-8">
          {notes.map(([label, headline, body], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--purple)]">{label}</div>
              <h3 className="mt-2 text-lg font-bold">{headline}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
