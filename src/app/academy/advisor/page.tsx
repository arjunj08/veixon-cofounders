'use client'

import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, CheckCircle2, ChevronDown, Compass, Flag, HelpCircle, ListChecks,
  Loader2, Plug, RefreshCw, Scale, ShieldAlert, Sparkles, ThumbsDown, ThumbsUp, Minus,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { academy, getLesson, type FactSpec } from '@/lib/academy'

const COMMON_FACTS = ['interviews_done', 'paying_customers', 'monthly_revenue_inr', 'monthly_burn_inr', 'cash_in_bank_inr', 'pmf_score']
const DERIVED_TO_INPUTS: Record<string, string[]> = {
  runway_months: ['cash_in_bank_inr', 'monthly_burn_inr'],
  ltv_cac: ['arpu_monthly_inr', 'gross_margin_pct', 'monthly_churn_pct', 'cac_inr'],
  cac_payback_months: ['cac_inr', 'arpu_monthly_inr', 'gross_margin_pct'],
  default_alive: ['cash_in_bank_inr', 'monthly_burn_inr', 'monthly_revenue_inr', 'revenue_growth_mom_pct'],
  burn_multiple: ['monthly_burn_inr', 'monthly_revenue_inr', 'revenue_growth_mom_pct'],
}
const statusColor: Record<string, string> = {
  required: 'var(--red)', not_eligible: 'var(--text-dim)', not_allowed: 'var(--text-dim)', eligible: 'var(--teal)', done: 'var(--teal)',
  allowed: 'var(--teal)', possible: 'var(--teal)', approaching: 'var(--amber)', needs_dpiit: 'var(--amber)', unknown: 'var(--text-dim)',
  not_required_yet: 'var(--text-muted)',
}

function anonId() {
  try {
    let id = window.localStorage.getItem('veixon_anon_id')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      window.localStorage.setItem('veixon_anon_id', id)
    }
    return id
  } catch {
    return null
  }
}

function fmt(key: string, v: any) {
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (typeof v !== 'number') return String(v).replace(/_/g, ' ')
  if (key.endsWith('_inr')) {
    if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(2).replace(/\.00$/, '')} cr`
    if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(2).replace(/\.00$/, '')} L`
    return `₹${Math.round(v).toLocaleString('en-IN')}`
  }
  if (key === 'runway_months' && v >= 999) return 'Not burning'
  if (key.endsWith('_months')) return `${v} mo`
  if (key === 'ltv_cac') return `${v} : 1`
  if (key === 'burn_multiple') return `${v}×`
  return String(v)
}

function FactInput({ k, spec, value, onChange }: { k: string; spec: FactSpec; value: any; onChange: (v: any) => void }) {
  if (spec.kind === 'bool') {
    return (
      <div className="flex gap-1">
        {[['Yes', true], ['No', false], ['—', '']].map(([label, val]) => (
          <button key={String(label)} type="button" onClick={() => onChange(val)}
            className="flex-1 rounded-lg border px-2 py-1.5 text-[11px] transition-colors"
            style={{ borderColor: value === val ? 'var(--purple)' : 'var(--border)', color: value === val ? 'var(--purple-light)' : 'var(--text-muted)' }}>
            {String(label)}
          </button>
        ))}
      </div>
    )
  }
  if (spec.kind === 'enum') {
    return (
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="vzn-input rounded-lg px-2.5 py-1.5 text-xs">
        <option value="">—</option>
        {(spec.values || []).map((o) => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
      </select>
    )
  }
  return (
    <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={k.endsWith('_inr') ? 'e.g. 15 lakh' : k.endsWith('_pct') ? '%' : spec.kind === 'date' ? 'YYYY-MM-DD' : ''}
      className="vzn-input rounded-lg px-2.5 py-1.5 text-xs" />
  )
}

function Advisor() {
  const params = useSearchParams()
  const [question, setQuestion] = useState(params.get('q') || '')
  const [dtype, setDtype] = useState(params.get('type') || '')
  const [facts, setFacts] = useState<Record<string, any>>({})
  const [gapAnswers, setGapAnswers] = useState<Record<string, any>>({})
  const [narrate, setNarrate] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [status, setStatus] = useState<any>(null)
  const [outcomeSent, setOutcomeSent] = useState('')

  const fieldKeys = useMemo(() => {
    const base = dtype ? academy.decisions[dtype].key_facts.flatMap((k) => DERIVED_TO_INPUTS[k] || [k]) : COMMON_FACTS
    return Array.from(new Set(base)).filter((k) => academy.facts[k])
  }, [dtype])

  async function loadHistory() {
    try {
      const r = await fetch(`/api/venture/decisions?anonId=${encodeURIComponent(anonId() || '')}`)
      const d = await r.json()
      if (Array.isArray(d)) setHistory(d)
    } catch {}
  }

  useEffect(() => {
    fetch('/api/venture/status').then((r) => r.json()).then(setStatus).catch(() => setStatus({ connected: false }))
    loadHistory()
  }, [])

  async function run(extra?: Record<string, any>) {
    if (!question.trim()) {
      setError('Describe the decision you are facing.')
      return
    }
    const merged = { ...facts, ...(extra || {}) }
    setFacts(merged)
    setLoading(true)
    setError('')
    setOutcomeSent('')
    try {
      const r = await fetch('/api/venture/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, decisionType: dtype || undefined, profile: merged, narrate, anonId: anonId() }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'The decision engine failed')
      setResult(d)
      setGapAnswers({})
      loadHistory()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function openDecision(id: string) {
    setLoading(true)
    try {
      const r = await fetch(`/api/venture/decisions?id=${id}&anonId=${encodeURIComponent(anonId() || '')}`)
      const d = await r.json()
      if (r.ok) {
        setResult(d)
        setQuestion(d.question)
        setOutcomeSent(d.outcome?.result || '')
      }
    } finally {
      setLoading(false)
    }
  }

  async function sendOutcome(res: string) {
    if (!result) return
    const r = await fetch('/api/venture/outcome', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: result.decision_id, result: res, anonId: anonId() }),
    })
    if (r.ok) {
      setOutcomeSent(res)
      loadHistory()
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    run()
  }

  const conf = result?.confidence
  const confColor = conf?.level === 'high' ? 'var(--teal)' : conf?.level === 'medium' ? 'var(--amber)' : 'var(--red)'
  const maxScore = result ? Math.max(1, ...result.options.map((o: any) => Math.abs(o.score))) : 1

  return (
    <AppShell title="Decision Advisor" subtitle="Your numbers × the Academy's rules × cited course knowledge">
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 md:grid-cols-[380px_1fr] md:p-8">
        {/* ---------------- left: ask ---------------- */}
        <div className="space-y-6">
          {status && !status.connected && (
            <div className="rounded-[1.25rem] border p-5 text-xs leading-relaxed" style={{ borderColor: 'color-mix(in srgb, var(--amber) 45%, var(--border))', background: 'color-mix(in srgb, var(--amber) 6%, transparent)' }}>
              <span className="vzn-section-label flex items-center gap-2" style={{ color: 'var(--amber)' }}><Plug className="h-3.5 w-3.5" /> VEIXON AI OS not connected</span>
              <p className="mt-2">The Advisor runs on VEIXON AI OS. Set <code>VEIXON_AIOS_URL</code> and <code>VEIXON_AIOS_API_KEY</code> (a key with the <b>chat</b> and <b>decisions</b> scopes) and restart. The course itself works without it.</p>
            </div>
          )}
          {status?.connected && status.inSync === false && (
            <p className="rounded-xl border p-3 text-[11px]" style={{ borderColor: 'var(--border)', color: 'var(--amber)' }}>
              Course versions differ (app {status.appCourseVersion}, AI OS {status.aiosCourseVersion}). Re-export the curriculum.
            </p>
          )}

          <form onSubmit={submit} className="vzn-panel-strong rounded-[1.5rem] border p-6">
            <span className="vzn-section-label flex items-center gap-2"><Compass className="h-3.5 w-3.5" /> Ask</span>
            <h2 className="mt-2 text-xl font-bold">What are you deciding?</h2>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4}
              placeholder="We have 5 months of runway and burn 6 lakh a month. Should we hire a full-time developer?"
              className="focus-ring vzn-input mt-4 resize-none rounded-xl p-4 text-xs" />

            <label className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-dim)' }}>Decision</label>
            <select value={dtype} onChange={(e) => setDtype(e.target.value)} className="vzn-input mt-1.5 rounded-xl px-3 py-2 text-xs">
              <option value="">Detect from my question</option>
              {Object.entries(academy.decisions).map(([k, d]) => <option key={k} value={k}>{d.label}</option>)}
            </select>

            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-dim)' }}>Your numbers (optional)</span>
              <button type="button" onClick={() => setShowAll(!showAll)} className="font-mono text-[10px] uppercase" style={{ color: 'var(--purple-light)' }}>
                {showAll ? 'Fewer' : 'All facts'}
              </button>
            </div>
            <div className="mt-2 grid gap-3">
              {(showAll ? Object.keys(academy.facts) : fieldKeys).map((k) => (
                <label key={k} className="grid gap-1">
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{academy.facts[k].label}</span>
                  <FactInput k={k} spec={academy.facts[k]} value={facts[k]} onChange={(v) => setFacts({ ...facts, [k]: v })} />
                </label>
              ))}
            </div>

            <label className="mt-4 flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <input type="checkbox" checked={narrate} onChange={(e) => setNarrate(e.target.checked)} className="accent-[var(--purple)]" />
              Let the model write the explanation (slower; it can&apos;t change the decision)
            </label>

            {error && <p className="mt-3 text-xs" style={{ color: 'var(--red)' }}>{error}</p>}
            <button disabled={loading} className="vzn-button-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold disabled:opacity-60">
              {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Running the decision workflow…</> : <><Sparkles className="h-3.5 w-3.5" /> Decide</>}
            </button>
          </form>

          <div className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
            <span className="vzn-section-label">Your decisions</span>
            {history.length === 0 ? (
              <p className="mt-3 font-mono text-[11px] italic" style={{ color: 'var(--text-dim)' }}>None yet.</p>
            ) : (
              <div className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {history.map((h) => (
                  <button key={h.decision_id} onClick={() => openDecision(h.decision_id)} className="block w-full rounded-xl border p-3 text-left text-xs hover:bg-white/5"
                    style={{ borderColor: result?.decision_id === h.decision_id ? 'var(--purple)' : 'var(--border)' }}>
                    <div className="flex justify-between font-mono text-[9px]" style={{ color: 'var(--text-dim)' }}>
                      <span style={{ color: 'var(--purple-light)' }}>{academy.decisions[h.decision_type]?.label || h.decision_type}</span>
                      <span>{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 truncate">{h.question}</p>
                    {h.outcome && <span className="mt-1 inline-block font-mono text-[9px] uppercase" style={{ color: 'var(--teal)' }}>outcome: {h.outcome}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- right: decision ---------------- */}
        <div className="min-w-0 space-y-5">
          {!result && !loading && (
            <div className="vzn-panel rounded-[1.5rem] border p-8" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold">How the Advisor decides</h3>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                It runs a fixed workflow inside VEIXON AI OS: understand your question → classify the decision → compute your metrics and stage →
                apply the Academy&apos;s decision rules → score the options → critique the result → pull the course passages behind it → plan next steps.
                Same numbers, same decision — and every reason links to the lesson it came from.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {Object.entries(academy.decisions).slice(0, 6).map(([k, d]) => (
                  <button key={k} onClick={() => { setDtype(k); setQuestion(d.examples[0]) }} className="rounded-xl border p-3 text-left text-xs hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                    <span className="block font-mono text-[9px] uppercase" style={{ color: 'var(--purple-light)' }}>{d.label}</span>
                    {d.examples[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {loading && !result && (
            <div className="vzn-panel grid place-items-center rounded-[1.5rem] border p-16" style={{ borderColor: 'var(--border)' }}>
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--purple)' }} />
            </div>
          )}

          {result && (
            <>
              {/* recommendation */}
              <section className="vzn-panel-strong rounded-[1.5rem] border p-6">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                  <span style={{ color: 'var(--purple-light)' }}>{result.decision_label}</span>
                  <span style={{ color: 'var(--text-dim)' }}>·</span>
                  <span style={{ color: 'var(--text-dim)' }}>stage: {result.stage.value.replace(/_/g, ' ')}</span>
                  <span className="ml-auto rounded-md border px-2 py-0.5" style={{ borderColor: result.status === 'decided' ? 'var(--teal)' : 'var(--amber)', color: result.status === 'decided' ? 'var(--teal)' : 'var(--amber)' }}>
                    {result.status}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{result.recommendation.label}</h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.recommendation.summary}</p>
                <div className="mt-5">
                  <div className="flex justify-between font-mono text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                    <span>Confidence · {conf.level}</span><span>{Math.round(conf.score * 100)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${conf.score * 100}%`, background: confColor }} />
                  </div>
                  {conf.notes?.length > 0 && <ul className="mt-2 space-y-1">{conf.notes.map((n: string, i: number) => <li key={i} className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{n}</li>)}</ul>}
                </div>
                {result.runner_up && (
                  <p className="mt-3 text-[11px]" style={{ color: 'var(--text-dim)' }}>Runner-up: {result.runner_up.label}</p>
                )}
              </section>

              {/* gaps: answer and re-run */}
              {result.information_gaps?.length > 0 && (
                <section className="rounded-[1.25rem] border p-5" style={{ borderColor: 'color-mix(in srgb, var(--purple) 45%, var(--border))' }}>
                  <span className="vzn-section-label flex items-center gap-2"><HelpCircle className="h-3.5 w-3.5" /> Answer these to sharpen the decision</span>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {result.information_gaps.map((g: any) => (
                      <label key={g.fact} className="grid gap-1">
                        <span className="text-[11px] leading-snug">{g.question}</span>
                        <FactInput k={g.fact} spec={academy.facts[g.fact] || { kind: g.kind, label: g.fact, ask: g.question, values: g.values }}
                          value={gapAnswers[g.fact]} onChange={(v) => setGapAnswers({ ...gapAnswers, [g.fact]: v })} />
                      </label>
                    ))}
                  </div>
                  <button onClick={() => run(gapAnswers)} disabled={loading || !Object.values(gapAnswers).some((v) => v !== '' && v !== undefined)}
                    className="vzn-button-primary mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold disabled:opacity-50">
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Re-run with my answers
                  </button>
                </section>
              )}

              <div className="grid gap-5 lg:grid-cols-2">
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Why</span>
                  {result.reasons.length === 0 ? <p className="mt-3 text-xs" style={{ color: 'var(--text-dim)' }}>No rule fired yet — add your numbers.</p> : (
                    <ul className="mt-3 space-y-3">
                      {result.reasons.map((r: any) => (
                        <li key={r.rule_id} className="text-xs leading-relaxed">
                          {r.says}
                          <Link href={`/academy/${r.lesson_id}`} className="mt-1 block font-mono text-[10px]" style={{ color: 'var(--purple-light)' }}>↳ {r.lesson_title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2" style={{ color: 'var(--amber)' }}><AlertTriangle className="h-3.5 w-3.5" /> Watch out</span>
                  {[...result.risks, ...(result.alerts || [])].length === 0 ? <p className="mt-3 text-xs" style={{ color: 'var(--text-dim)' }}>No strong objections.</p> : (
                    <ul className="mt-3 space-y-3">
                      {[...result.risks, ...(result.alerts || [])].map((r: any, i: number) => (
                        <li key={r.rule_id + i} className="text-xs leading-relaxed">
                          {r.area && <span className="mr-1 font-mono text-[9px] uppercase" style={{ color: 'var(--red)' }}>{r.area}:</span>}
                          {r.says}
                          <Link href={`/academy/${r.lesson_id}`} className="mt-1 block font-mono text-[10px]" style={{ color: 'var(--purple-light)' }}>↳ {r.lesson_title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              {/* metrics */}
              {Object.keys(result.metrics || {}).length > 0 && (
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Your numbers, computed</span>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(result.metrics).map(([k, m]: [string, any]) => (
                      <div key={k} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{String(m.label).split(':')[0]}</div>
                        <div className="mt-1 text-lg font-bold">{fmt(k, m.value)}</div>
                        {m.how && <div className="mt-1 text-[10px] leading-snug" style={{ color: 'var(--text-dim)' }}>{m.how}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* next actions + options */}
              <div className="grid gap-5 lg:grid-cols-2">
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2"><ListChecks className="h-3.5 w-3.5" /> Next steps</span>
                  <ol className="mt-3 space-y-2">
                    {result.next_actions.map((a: string, i: number) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed"><span className="font-mono" style={{ color: 'var(--teal)' }}>{i + 1}.</span>{a}</li>
                    ))}
                  </ol>
                  <p className="mt-4 font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>Review this decision on {result.review_on}</p>
                </section>
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2"><Scale className="h-3.5 w-3.5" /> Options scored</span>
                  <div className="mt-4 space-y-3">
                    {result.options.map((o: any) => (
                      <div key={o.option_id}>
                        <div className="flex justify-between text-[11px]">
                          <span style={{ color: o.option_id === result.recommendation.option_id ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: o.option_id === result.recommendation.option_id ? 700 : 400 }}>
                            {o.label}{o.blocked && <span className="ml-1.5 font-mono text-[9px] uppercase" style={{ color: 'var(--red)' }}>blocked</span>}
                          </span>
                          <span className="font-mono" style={{ color: 'var(--text-dim)' }}>{o.score > 0 ? '+' : ''}{o.score}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${(Math.max(0, o.score) / maxScore) * 100}%`, background: o.blocked ? 'var(--red)' : o.option_id === result.recommendation.option_id ? 'var(--teal)' : 'var(--purple)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* India */}
              {result.india_checks?.length > 0 && (
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2"><Flag className="h-3.5 w-3.5" /> India checks</span>
                  <div className="mt-3 divide-y" style={{ borderColor: 'var(--border)' }}>
                    {result.india_checks.map((c: any) => (
                      <div key={c.check} className="grid gap-1 py-2.5 text-xs sm:grid-cols-[200px_110px_1fr]" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-semibold">{c.check}</span>
                        <span className="font-mono text-[10px] uppercase" style={{ color: statusColor[c.status] || 'var(--text-muted)' }}>{c.status.replace(/_/g, ' ')}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{c.detail}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* evidence */}
              {result.knowledge?.length > 0 && (
                <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="vzn-section-label flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> From the course (cited)</span>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {result.knowledge.slice(0, 4).map((c: any, i: number) => (
                      <Link key={i} href={c.lesson_id ? `/academy/${c.lesson_id}` : '/academy'} className="rounded-xl border p-3 text-xs hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                        <span className="block font-mono text-[9px] uppercase" style={{ color: 'var(--purple-light)' }}>{c.lesson_title || getLesson(c.lesson_id)?.title || 'Lesson'}</span>
                        <span className="mt-1 block leading-relaxed" style={{ color: 'var(--text-muted)' }}>{String(c.snippet).replace(/[[\]]/g, '')}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* narrative + trace */}
              <details className="vzn-panel group rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="vzn-section-label flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> How it decided · {result.trace?.length || 0} steps</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" style={{ color: 'var(--text-dim)' }} />
                </summary>
                <ol className="mt-4 space-y-2">
                  {(result.trace || []).map((s: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-xs">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md font-mono text-[9px]" style={{ background: 'var(--purple-dim)', color: 'var(--purple-light)' }}>{i + 1}</span>
                      <span className="flex-1">{s.title}<span className="ml-2 font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>{s.ms} ms</span></span>
                    </li>
                  ))}
                </ol>
                <pre className="mt-4 whitespace-pre-wrap rounded-xl border p-4 text-[11px] leading-relaxed" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', fontFamily: 'inherit' }}>
                  {result.narrative}
                </pre>
                <p className="mt-2 font-mono text-[9px]" style={{ color: 'var(--text-dim)' }}>
                  Explanation by {result.narrative_source} · engine {result.engine?.version} · course {result.engine?.course_version}
                  {result.engine?.calibrated_rules?.length ? ` · ${result.engine.calibrated_rules.length} rules calibrated by your outcomes` : ''}
                </p>
              </details>

              {/* outcome */}
              <section className="vzn-panel rounded-[1.25rem] border p-5" style={{ borderColor: 'var(--border)' }}>
                <span className="vzn-section-label flex items-center gap-2"><ShieldAlert className="h-3.5 w-3.5" /> After you act: how did it go?</span>
                <p className="mt-2 text-[11px]" style={{ color: 'var(--text-dim)' }}>Your answer re-weights the rules for you — the Advisor learns which ones work for your company.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[['worked', ThumbsUp, 'Worked'], ['mixed', Minus, 'Mixed'], ['failed', ThumbsDown, 'Didn’t work']].map(([k, Icon, label]: any) => (
                    <button key={k} onClick={() => sendOutcome(k)} disabled={!!outcomeSent}
                      className="vzn-button-ghost inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs disabled:opacity-60"
                      style={{ borderColor: outcomeSent === k ? 'var(--teal)' : 'var(--border)', color: outcomeSent === k ? 'var(--teal)' : undefined }}>
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </section>

              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>{result.disclaimer}</p>
            </>
          )}

          {!result && (
            <Link href="/academy" className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--purple-light)' }}>
              Study the rules first in the Academy <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  )
}

export default function AdvisorPage() {
  return (
    <Suspense fallback={null}>
      <Advisor />
    </Suspense>
  )
}
