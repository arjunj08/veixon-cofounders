import { callClaudeJson } from '@/lib/anthropic'
import { fallbackDecision } from '@/lib/fallbacks'
import { newId, saveDecision } from '@/lib/server-store'
import { ventureDecision, verdictForPrompt } from '@/lib/academy/brain'
import { founderSubject } from '@/app/api/venture/_subject'

// Simulator decision types -> Venture Decision Engine types (VEIXON AI OS).
const ENGINE_TYPE: Record<string, string> = {
  pricing: 'pricing', hiring: 'hiring', pivot: 'pivot_or_persevere', fundraising: 'fundraise_timing',
  product: 'build_or_validate', 'go-to-market': 'channel',
}

export const runtime = 'nodejs'

const system = `You are VZN, a brutal AI co-founder. Simulate this decision. Return ONLY valid JSON: { bestCase:{summary,day30,day90,day180}, worstCase:{same}, mostLikely:{same}, recommendation:string, reasoning:string, vzn_voice:string }.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // 1. The rule-based verdict from the Venture Decision Engine (course rules + the founder's numbers).
    const engine = body.description
      ? await ventureDecision(String(body.description), {
          decisionType: ENGINE_TYPE[String(body.decisionType || body.type || '')],
          subject: await founderSubject(req, body.anonId),
        })
      : null
    // 2. The LLM simulates the scenarios — consistent with the engine's verdict when there is one.
    let result: any
    try {
      result = await callClaudeJson({ system: engine ? `${system}\n\n${verdictForPrompt(engine)}` : system, body, maxTokens: 2400 })
    } catch {
      result = fallbackDecision()
      if (engine) {
        result.recommendation = engine.recommendation.label
        result.reasoning = [engine.recommendation.summary, ...engine.reasons.slice(0, 2).map((r) => r.says)].join(' ')
      }
    }
    const engineSummary = engine
      ? {
          decisionId: engine.decision_id,
          decision: engine.decision_label,
          recommendation: engine.recommendation.label,
          summary: engine.recommendation.summary,
          confidence: engine.confidence.level,
          status: engine.status,
          stage: engine.stage?.value,
          reasons: engine.reasons.slice(0, 3).map((r) => ({ says: r.says, lessonId: r.lesson_id, lessonTitle: r.lesson_title })),
          risks: [...engine.risks, ...(engine.alerts || [])].slice(0, 2).map((r) => ({ says: r.says, lessonId: r.lesson_id, lessonTitle: r.lesson_title })),
          questions: engine.information_gaps.slice(0, 3).map((g) => g.question),
          nextActions: engine.next_actions.slice(0, 3),
        }
      : null
    const id = newId('decision')
    let dbFallback = false
    try {
      await saveDecision({
        id,
        userId: body.userId || 'anonymous',
        startupId: body.startupId || null,
        description: body.description || '',
        decisionType: body.decisionType || body.type || 'strategy',
        scenariosJson: {
          bestCase: result.bestCase,
          worstCase: result.worstCase,
          mostLikely: result.mostLikely,
        },
        recommendation: result.recommendation,
        reasoning: result.reasoning,
        vznVoice: result.vzn_voice,
        createdAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Failed to save decision to DB:', err)
      dbFallback = true
    }

    // Email the founder a summary of the decision VZN just ran.
    if (body.email) {
      try {
        const { dispatchEmail } = await import('@/lib/email/service')
        const { decisionEmail } = await import('@/lib/email/templates')
        const { subject, html } = decisionEmail(body.name || String(body.email).split('@')[0], {
          description: body.description,
          recommendation: result.recommendation,
          reasoning: result.reasoning,
        })
        await dispatchEmail({ type: 'decision', to: body.email, userId: body.userId, refId: id, subject, html, once: true })
      } catch {
        /* email is best-effort */
      }
    }

    return Response.json({ id, dbFallback, ...result, engine: engineSummary })
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
