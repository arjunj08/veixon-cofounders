// VEIXON brain — what the platform inherits from VEIXON AI OS beyond plain text generation:
//   academyContext()  cited passages from the VEIXON Academy course (AI OS knowledge base), added to AI prompts
//   ventureDecision() the Venture Decision Engine's verdict for a founder's decision
// Both are best-effort: if AI OS is not configured or slow, they return null/'' and the caller carries on.
import { aios, aiosConfigured } from './aios'

const CACHE = new Map<string, { text: string; exp: number }>()
const TTL_MS = 10 * 60_000

export function groundingEnabled() {
  return aiosConfigured() && process.env.VEIXON_ACADEMY_GROUNDING !== '0'
}

/** Top course passages for a query, formatted for a system prompt ('' when unavailable). */
export async function academyContext(query: string, k = 3): Promise<string> {
  if (!groundingEnabled()) return ''
  const q = query.replace(/\s+/g, ' ').trim().slice(0, 400)
  if (q.length < 8) return ''
  const hit = CACHE.get(q)
  if (hit && hit.exp > Date.now()) return hit.text
  try {
    const res = await aios<{ results: { lesson_title?: string; snippet: string }[] }>(
      `/venture/knowledge/search?q=${encodeURIComponent(q)}&top_k=${k}`,
      { timeoutMs: 3500 }
    )
    const lines = (res.results || [])
      .filter((r) => r.snippet)
      .map((r) => `- [${r.lesson_title || 'VEIXON Academy'}] ${r.snippet.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim()}`)
    const text = lines.length
      ? `VEIXON ACADEMY KNOWLEDGE (from the course this founder studies; use it when relevant, never contradict it, and you may name the lesson):\n${lines.join('\n')}`
      : ''
    if (CACHE.size > 300) CACHE.clear()
    CACHE.set(q, { text, exp: Date.now() + TTL_MS })
    return text
  } catch {
    return ''
  }
}

export interface EngineVerdict {
  decision_id: string
  decision_type: string
  decision_label: string
  status: string
  recommendation: { option_id: string; label: string; summary: string }
  confidence: { score: number; level: string }
  reasons: { says: string; lesson_id: string; lesson_title: string }[]
  risks: { says: string; lesson_id: string; lesson_title: string }[]
  alerts?: { says: string; area: string; lesson_id: string; lesson_title: string }[]
  information_gaps: { question: string }[]
  next_actions: string[]
  stage: { value: string }
}

/** The Venture Decision Engine's verdict, or null when AI OS is unavailable. */
export async function ventureDecision(question: string, opts?: { decisionType?: string; profile?: Record<string, unknown>; subject?: string }): Promise<EngineVerdict | null> {
  if (!aiosConfigured()) return null
  try {
    return await aios<EngineVerdict>('/venture/decide', {
      method: 'POST',
      timeoutMs: 15000,
      body: { question: question.slice(0, 4000), profile: opts?.profile || {}, decision_type: opts?.decisionType, subject: opts?.subject },
    })
  } catch {
    return null
  }
}

/** Compact text form of a verdict for an LLM prompt. */
export function verdictForPrompt(v: EngineVerdict): string {
  return [
    `VEIXON DECISION ENGINE VERDICT (rule-based, from the VEIXON Academy course — your answer must be consistent with it):`,
    `- Decision: ${v.decision_label}; stage: ${v.stage?.value}`,
    `- Recommendation: ${v.recommendation.label} — ${v.recommendation.summary} (confidence ${v.confidence.level}, ${v.status})`,
    ...v.reasons.slice(0, 3).map((r) => `- Because: ${r.says}`),
    ...[...v.risks, ...(v.alerts || [])].slice(0, 2).map((r) => `- Risk: ${r.says}`),
    ...(v.information_gaps.length ? [`- Unknowns: ${v.information_gaps.slice(0, 3).map((g) => g.question).join(' ')}`] : []),
  ].join('\n')
}
