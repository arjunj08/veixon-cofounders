import { callClaudeJson } from '@/lib/anthropic'
import { fallbackIdeation, fallbackWarPlan } from '@/lib/fallbacks'
import { newId, saveStartup, updateStartup } from '@/lib/server-store'
import type { IdeationResult, StartupRecord } from '@/lib/types'
import { CURRICULUM_GROUNDING } from '@/lib/curriculum/frameworks'

export const runtime = 'nodejs'
export const maxDuration = 60

// Only the analysis is AI-generated (fast, ~1500 tokens). The 13-week war plan is
// generated locally to keep the request well under the 60s function limit — asking the
// model for the full plan pushed latency to ~90s and timed out on the client.
const system = `You are VZN, a brutal, direct, and elite AI co-founder grounded in this venture framework:
${CURRICULUM_GROUNDING}

Analyze the user's startup idea based on their inputs (What they are building, who will pay, and what problem they solve).

Return ONLY valid JSON with this exact structure:
{
  "scorecard": {
    "market": { "score": number, "explanation": "string" },
    "moat": { "score": number, "explanation": "string" },
    "timing": { "score": number, "explanation": "string" },
    "founderFit": { "score": number, "explanation": "string" },
    "monetisation": { "score": number, "explanation": "string" },
    "executionRisk": { "score": number, "explanation": "string" }
  },
  "devilsAdvocate": [
    { "title": "string", "explanation": "string", "severity": "high" | "medium" }
  ],
  "failureProbability": number,
  "survivalEdge": "string",
  "vzn_voice": "string"
}

Specific rules:
- Scores: 1 to 10. Be brutally honest. If they have no customer verification or no distribution channel, give them a low score.
- Keep each scorecard explanation under 30 words.
- "failureProbability": Compute this dynamically as a percentage (e.g. 35 to 98) based on your evaluation. Early ideas with no traction, no moat, or generic features should be marked as very high risk (e.g., 75 to 96). Highly structured ideas with specific defensibility segments can be lower.
- "vzn_voice": One sharp, customized co-founder remark addressing their exact idea. Avoid generic text.`;

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let result: IdeationResult
    try {
      const analysis = await callClaudeJson<Omit<IdeationResult, 'warPlan'>>({ system, body, maxTokens: 1400 })
      result = { ...analysis, warPlan: fallbackWarPlan() }
    } catch {
      result = fallbackIdeation(body)
    }

    const id = newId('startup')
    const record: StartupRecord = {
      id,
      userId: body.userId || body.email || 'anonymous',
      ideaText: body.idea || body.ideaText || '',
      targetCustomer: body.targetCustomer || '',
      problem: body.problem || '',
      scorecardJson: result.scorecard,
      warPlanJson: result.warPlan,
      devilsAdvocateJson: result.devilsAdvocate,
      failureProbability: result.failureProbability,
      survivalEdge: result.survivalEdge,
      completedTasks: [],
      taskEdits: [],
      tractionDetails: [],
      introRequests: [],
      shareCardsGenerated: 0,
      pivotAlerts: [],
      createdAt: new Date().toISOString(),
      accountabilityScore: 0,
      taskCompletionRate: 0,
      vaultUnlocked: false,
      tractionProof: false,
      vznVoice: result.vzn_voice,
    }

    let dbFallback = false
    try {
      await saveStartup(record)
    } catch (err) {
      console.error('Database save failed, using local fallback:', err)
      dbFallback = true
    }

    // Best-effort: persist the founder's email for later triggers (e.g. the inactivity cron).
    if (body.email) {
      try { await updateStartup(id, { founderEmail: body.email }) } catch { /* column appears after migration */ }
    }

    // First-idea email: the analysis report (once per founder).
    if (body.email) {
      try {
        const sc: any = result.scorecard
        const scores = sc
          ? Object.values(sc).map((dimension: any) => Number(dimension?.score) || 0)
          : []
        const composite = scores.length
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : undefined
        const { dispatchEmail } = await import('@/lib/email/service')
        const { analysisReportEmail } = await import('@/lib/email/templates')
        const { subject, html } = analysisReportEmail(body.name || String(body.email).split('@')[0], {
          idea: body.idea || body.ideaText || '',
          failureProbability: result.failureProbability,
          composite,
          vzn: result.vzn_voice,
          startupId: id,
        })
        await dispatchEmail({ type: 'analysis_report', to: body.email, userId: body.userId, subject, html, once: true })
      } catch {
        /* email is best-effort */
      }
    }

    try {
      const sc: any = result.scorecard
      const scores = sc
        ? Object.values(sc).map((dimension: any) => Number(dimension?.score) || 0)
        : []
      const composite = scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : undefined
      const { dispatchIdeaSubmissionNotice } = await import('@/lib/email/service')
      await dispatchIdeaSubmissionNotice({
        startupId: id,
        founderEmail: body.email,
        founderName: body.name,
        idea: body.idea || body.ideaText || '',
        targetCustomer: body.targetCustomer || '',
        problem: body.problem || '',
        failureProbability: result.failureProbability,
        composite,
      })
    } catch {
      /* admin email is best-effort */
    }

    return Response.json({ id, dbFallback, ...result, record })
  } catch {
    return Response.json({ error: 'ideation_failed' }, { status: 500 })
  }
}
