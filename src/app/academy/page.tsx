'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, Circle, Clock, Compass, GraduationCap } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { academy, allLessons, loadProgress, moduleProgress, modules, totalMinutes, type Progress } from '@/lib/academy'

export default function AcademyPage() {
  const [progress, setProgress] = useState<Progress>({ done: {}, quiz: {} })
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setProgress(loadProgress())
    sync()
    window.addEventListener('veixon-academy-progress', sync)
    return () => window.removeEventListener('veixon-academy-progress', sync)
  }, [])

  const doneCount = allLessons.filter((l) => progress.done[l.id]).length
  const pct = Math.round((doneCount / allLessons.length) * 100)
  const next = useMemo(() => allLessons.find((l) => !progress.done[l.id]) || allLessons[0], [progress])

  return (
    <AppShell title="Academy" subtitle={`${modules.length} modules · ${allLessons.length} lessons · about ${Math.round(totalMinutes / 60)} hours`}>
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
        {/* hero */}
        <section className="vzn-panel-strong rounded-[1.5rem] border p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="vzn-section-label flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" /> VEIXON Academy</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{academy.title}</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {academy.subtitle} The same course trains VZN&apos;s decision engine: every rule you learn here is a rule the
                Decision Advisor applies to your numbers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/academy/${next.id}`} className="vzn-button-primary veixon-press inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold">
                {doneCount ? 'Continue' : 'Start'}: {next.title.length > 34 ? next.title.slice(0, 32) + '…' : next.title} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/academy/advisor" className="vzn-button-ghost veixon-press inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-semibold" style={{ borderColor: 'var(--border)' }}>
                <Compass className="h-3.5 w-3.5" /> Decision Advisor
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-dim)' }}>
              <span>Your progress</span>
              <span>{doneCount}/{allLessons.length} lessons · {pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--purple), var(--teal))' }} />
            </div>
          </div>
        </section>

        {/* modules */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((m, i) => {
            const mp = moduleProgress(progress, m)
            const expanded = open === m.id
            return (
              <article key={m.id} className="vzn-panel flex flex-col rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--purple-light)' }}>
                    Module {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: mp.done === mp.total ? 'var(--teal)' : 'var(--text-dim)' }}>
                    {mp.done}/{mp.total}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold leading-snug">{m.title}</h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{m.outcome}</p>
                <div className="mt-3 h-1 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${mp.pct}%`, background: 'var(--teal)' }} />
                </div>
                <ul className="mt-4 space-y-1.5">
                  {(expanded ? m.lessons : m.lessons.slice(0, 3)).map((l) => (
                    <li key={l.id}>
                      <Link href={`/academy/${l.id}`} className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-white/5">
                        {progress.done[l.id] ? (
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--teal)' }} />
                        ) : (
                          <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-dim)' }} />
                        )}
                        <span className="flex-1 leading-snug group-hover:underline">{l.title}</span>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>
                          <Clock className="h-3 w-3" />{l.minutes}m
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {m.lessons.length > 3 && (
                  <button onClick={() => setOpen(expanded ? null : m.id)} className="mt-2 self-start font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--purple-light)' }}>
                    {expanded ? 'Show less' : `+${m.lessons.length - 3} more`}
                  </button>
                )}
              </article>
            )
          })}
        </section>

        {/* glossary */}
        <details className="vzn-panel group rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <span className="vzn-section-label flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> Glossary</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" style={{ color: 'var(--text-dim)' }} />
          </summary>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(academy.glossary).map(([term, meaning]) => (
              <div key={term} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                <dt className="text-xs font-bold">{term}</dt>
                <dd className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meaning}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </AppShell>
  )
}
