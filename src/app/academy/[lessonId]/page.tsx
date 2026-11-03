'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Compass, ExternalLink, Flag, Lightbulb, ListChecks, Scale } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { academy, getLesson, loadProgress, markDone, neighbours } from '@/lib/academy'

const sevColor: Record<string, string> = { critical: 'var(--red)', high: 'var(--amber)', medium: 'var(--purple-light)' }

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>()
  const lesson = getLesson(String(params?.lessonId || ''))
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    setAnswers({})
    setChecked({})
    setDone(!!(lesson && loadProgress().done[lesson.id]))
  }, [lesson?.id])

  const { prev, next } = neighbours(lesson?.id || '')
  const informs = useMemo(
    () => (lesson ? Object.entries(academy.decisions).filter(([, d]) => d.options.some((o) => o.lessons.includes(lesson.id))) : []),
    [lesson?.id]
  )

  if (!lesson) {
    return (
      <AppShell title="Academy" subtitle="Lesson not found">
        <div className="p-8 text-sm">
          That lesson doesn&apos;t exist. <Link href="/academy" className="underline">Back to the Academy</Link>
        </div>
      </AppShell>
    )
  }

  const answered = Object.keys(answers).length
  const correct = lesson.quiz.filter((q, i) => answers[i] === q.answer).length

  function complete() {
    markDone(lesson!.id, lesson!.quiz.length ? correct / lesson!.quiz.length : undefined)
    setDone(true)
  }

  return (
    <AppShell title={lesson.title} subtitle={`${lesson.moduleTitle} · ${lesson.minutes} min`}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 md:grid-cols-[1fr_300px] md:p-8">
        <div className="min-w-0 space-y-6">
          <Link href="/academy" className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-dim)' }}>
            <ArrowLeft className="h-3 w-3" /> Academy
          </Link>

          <section className="vzn-panel-strong rounded-[1.5rem] border p-6">
            <span className="vzn-section-label">Lesson {lesson.index + 1} of 39</span>
            <p className="mt-3 text-[15px] leading-relaxed">{lesson.summary}</p>
            <h3 className="mt-6 text-sm font-bold">Key ideas</h3>
            <ul className="mt-3 space-y-2.5">
              {lesson.key_ideas.map((k, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--teal)' }} />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>

          {lesson.framework && (
            <section className="vzn-panel rounded-[1.25rem] border p-6" style={{ borderColor: 'var(--border)' }}>
              <span className="vzn-section-label flex items-center gap-2"><Lightbulb className="h-3.5 w-3.5" /> Framework</span>
              <h3 className="mt-2 text-base font-bold">{lesson.framework.name}</h3>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {lesson.framework.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border p-3 text-xs leading-relaxed" style={{ borderColor: 'var(--border)' }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-bold" style={{ background: 'var(--purple-dim)', color: 'var(--purple-light)' }}>{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {lesson.checklist.length > 0 && (
              <section className="vzn-panel rounded-[1.25rem] border p-6" style={{ borderColor: 'var(--border)' }}>
                <span className="vzn-section-label flex items-center gap-2"><ListChecks className="h-3.5 w-3.5" /> Do this</span>
                <ul className="mt-4 space-y-2">
                  {lesson.checklist.map((c, i) => (
                    <li key={i}>
                      <label className="flex cursor-pointer gap-3 text-xs leading-relaxed">
                        <input type="checkbox" checked={!!checked[i]} onChange={() => setChecked({ ...checked, [i]: !checked[i] })} className="mt-0.5 accent-[var(--teal)]" />
                        <span style={{ textDecoration: checked[i] ? 'line-through' : 'none', color: checked[i] ? 'var(--text-dim)' : undefined }}>{c}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {lesson.pitfalls.length > 0 && (
              <section className="vzn-panel rounded-[1.25rem] border p-6" style={{ borderColor: 'var(--border)' }}>
                <span className="vzn-section-label flex items-center gap-2" style={{ color: 'var(--amber)' }}><AlertTriangle className="h-3.5 w-3.5" /> Pitfalls</span>
                <ul className="mt-4 space-y-2">
                  {lesson.pitfalls.map((p, i) => (
                    <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>— {p}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {lesson.india.length > 0 && (
            <section className="rounded-[1.25rem] border p-5" style={{ borderColor: 'color-mix(in srgb, var(--amber) 40%, var(--border))', background: 'color-mix(in srgb, var(--amber) 6%, transparent)' }}>
              <span className="vzn-section-label flex items-center gap-2" style={{ color: 'var(--amber)' }}><Flag className="h-3.5 w-3.5" /> India notes</span>
              <ul className="mt-3 space-y-2">
                {lesson.india.map((n, i) => <li key={i} className="text-xs leading-relaxed">{n}</li>)}
              </ul>
            </section>
          )}

          {lesson.rules.length > 0 && (
            <section className="vzn-panel rounded-[1.25rem] border p-6" style={{ borderColor: 'var(--border)' }}>
              <span className="vzn-section-label flex items-center gap-2"><Scale className="h-3.5 w-3.5" /> Decision rules the AI applies</span>
              <p className="mt-2 text-xs" style={{ color: 'var(--text-dim)' }}>The Decision Advisor checks these against your numbers.</p>
              <ul className="mt-4 space-y-2">
                {lesson.rules.map((r) => (
                  <li key={r.id} className="flex gap-3 rounded-xl border p-3 text-xs leading-relaxed" style={{ borderColor: 'var(--border)' }}>
                    <span className="mt-0.5 h-fit shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase" style={{ color: sevColor[r.severity] || 'var(--text-muted)', border: `1px solid ${sevColor[r.severity] || 'var(--border)'}` }}>{r.severity}</span>
                    <span>{r.says}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lesson.quiz.length > 0 && (
            <section className="vzn-panel rounded-[1.25rem] border p-6" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <span className="vzn-section-label">Check yourself</span>
                {answered === lesson.quiz.length && (
                  <span className="font-mono text-[10px]" style={{ color: correct === lesson.quiz.length ? 'var(--teal)' : 'var(--amber)' }}>{correct}/{lesson.quiz.length} correct</span>
                )}
              </div>
              <div className="mt-4 space-y-5">
                {lesson.quiz.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-sm font-semibold">{q.q}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {q.options.map((o, oi) => {
                        const picked = answers[qi] === oi
                        const show = answers[qi] !== undefined
                        const right = oi === q.answer
                        const color = show && right ? 'var(--teal)' : show && picked ? 'var(--red)' : 'var(--border)'
                        return (
                          <button key={oi} disabled={show} onClick={() => setAnswers({ ...answers, [qi]: oi })}
                            className="rounded-xl border px-3 py-2 text-left text-xs transition-colors hover:bg-white/5 disabled:cursor-default"
                            style={{ borderColor: color, color: show && right ? 'var(--teal)' : undefined }}>
                            {o}
                          </button>
                        )
                      })}
                    </div>
                    {answers[qi] !== undefined && (
                      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        <b style={{ color: answers[qi] === q.answer ? 'var(--teal)' : 'var(--amber)' }}>{answers[qi] === q.answer ? 'Right. ' : 'Not quite. '}</b>{q.why}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            {prev ? (
              <Link href={`/academy/${prev.id}`} className="vzn-button-ghost veixon-press inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs" style={{ borderColor: 'var(--border)' }}>
                <ArrowLeft className="h-3.5 w-3.5" /> {prev.title.length > 30 ? prev.title.slice(0, 28) + '…' : prev.title}
              </Link>
            ) : <span />}
            <div className="flex gap-2">
              <button onClick={complete} disabled={done} className="vzn-button-primary veixon-press inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold disabled:opacity-70">
                <CheckCircle2 className="h-3.5 w-3.5" /> {done ? 'Completed' : 'Mark complete'}
              </button>
              {next && (
                <Link href={`/academy/${next.id}`} className="vzn-button-ghost veixon-press inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs" style={{ borderColor: 'var(--border)' }}>
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* side rail */}
        <aside className="space-y-4">
          <div className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
            <span className="vzn-section-label flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {lesson.minutes} minutes</span>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lesson.tags.map((t) => (
                <span key={t} className="rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase" style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>{t}</span>
              ))}
            </div>
          </div>
          {informs.length > 0 && (
            <div className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
              <span className="vzn-section-label flex items-center gap-2"><Compass className="h-3.5 w-3.5" /> Apply it</span>
              <p className="mt-2 text-xs" style={{ color: 'var(--text-dim)' }}>This lesson feeds these decisions:</p>
              <div className="mt-3 space-y-1.5">
                {informs.map(([type, d]) => (
                  <Link key={type} href={`/academy/advisor?type=${type}&q=${encodeURIComponent(d.examples[0])}`} className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                    {d.label} <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {lesson.sources.length > 0 && (
            <div className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
              <span className="vzn-section-label">Sources</span>
              <ul className="mt-3 space-y-2">
                {lesson.sources.map((s, i) => (
                  <li key={i} className="text-xs leading-snug">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 hover:underline" style={{ color: 'var(--purple-light)' }}>
                        {s.title} <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                      </a>
                    ) : <span style={{ color: 'var(--text-muted)' }}>{s.title}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </AppShell>
  )
}
