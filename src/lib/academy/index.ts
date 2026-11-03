// VEIXON Academy — the entrepreneurship course, shared with VEIXON AI OS.
// curriculum.json is generated from VEIXON AI OS (app/venture/course_data.py) by
// `python scripts/export_academy.py --out <this folder>/curriculum.json`. Don't edit it by hand:
// the same course is the AI's knowledge base and the source of its decision rules.
import data from './curriculum.json'

export interface QuizQuestion { q: string; options: string[]; answer: number; why: string }
export interface Source { title: string; url?: string | null }
export interface LessonRule { id: string; says: string; severity: string }
export interface Lesson {
  id: string
  title: string
  minutes: number
  summary: string
  key_ideas: string[]
  framework?: { name: string; steps: string[] } | null
  checklist: string[]
  pitfalls: string[]
  india: string[]
  rules: LessonRule[]
  quiz: QuizQuestion[]
  sources: Source[]
  tags: string[]
}
export interface Module { id: string; title: string; outcome: string; lessons: Lesson[] }
export interface DecisionOption { id: string; label: string; summary: string; lessons: string[] }
export interface DecisionType { label: string; examples: string[]; key_facts: string[]; options: DecisionOption[] }
export interface FactSpec { kind: 'number' | 'bool' | 'enum' | 'text' | 'date'; label: string; ask: string; values?: string[] }

export const academy = data as unknown as {
  title: string
  subtitle: string
  version: string
  modules: Module[]
  glossary: Record<string, string>
  decisions: Record<string, DecisionType>
  facts: Record<string, FactSpec>
  derived: Record<string, string>
}

export const modules: Module[] = academy.modules
export const allLessons: (Lesson & { moduleId: string; moduleTitle: string; index: number })[] = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
).map((l, index) => ({ ...l, index }))

export function getLesson(id: string) {
  return allLessons.find((l) => l.id === id) || null
}

export function neighbours(id: string) {
  const i = allLessons.findIndex((l) => l.id === id)
  return { prev: i > 0 ? allLessons[i - 1] : null, next: i >= 0 && i < allLessons.length - 1 ? allLessons[i + 1] : null }
}

export const totalMinutes = allLessons.reduce((s, l) => s + l.minutes, 0)

// ---- progress (per browser; a convenience, so every read/write is guarded) ----
const KEY = 'veixon_academy_progress_v1'
export interface Progress { done: Record<string, string>; quiz: Record<string, number> }

export function loadProgress(): Progress {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null
    if (raw) {
      const p = JSON.parse(raw)
      return { done: p.done || {}, quiz: p.quiz || {} }
    }
  } catch {}
  return { done: {}, quiz: {} }
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p))
    window.dispatchEvent(new Event('veixon-academy-progress'))
  } catch {}
}

export function markDone(id: string, quizScore?: number) {
  const p = loadProgress()
  p.done[id] = new Date().toISOString()
  if (typeof quizScore === 'number') p.quiz[id] = Math.max(quizScore, p.quiz[id] || 0)
  saveProgress(p)
  return p
}

export function moduleProgress(p: Progress, m: Module) {
  const done = m.lessons.filter((l) => p.done[l.id]).length
  return { done, total: m.lessons.length, pct: Math.round((done / m.lessons.length) * 100) }
}

// Compact grounding for the LLM routes (VZN chat, idea analysis …): the course's high-stakes decision
// rules, so every model call reasons with the same rules the decision engine applies.
export const ACADEMY_RULES_GROUNDING = (() => {
  const rules = allLessons.flatMap((l) => l.rules.filter((r) => r.severity === 'high' || r.severity === 'critical').map((r) => `- ${r.says}`))
  return `VEIXON ACADEMY DECISION RULES (apply when relevant; they come from the course the founder studies):\n${rules.join('\n')}`
})()
