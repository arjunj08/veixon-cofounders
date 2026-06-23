import { callClaudeJson } from '@/lib/anthropic'
import { fallbackFounderDNA } from '@/lib/fallbacks'
import { updateStartup } from '@/lib/server-store'

export const runtime = 'nodejs'

const system = `You are VZN, a brutal AI co-founder. Analyse the founder's writing style, specificity, confidence, and market awareness from how they described their idea. Return ONLY valid JSON: { founderType:"Visionary"|"Executor"|"Analyst"|"Hustler", traits:{ visionaryVsExecutor:0-100, riskAppetite:0-100, clarityOfThinking:0-100, emotionalAttachment:0-100 }, vznVerdict:string, dangerLine:string }. Be sharp and slightly uncomfortable.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let result: any
    try {
      result = await callClaudeJson({ system, body, maxTokens: 1600 })
    } catch {
      result = fallbackFounderDNA()
    }
    if (body.startupId) await updateStartup(body.startupId, { founderDNA: result })
    return Response.json(result)
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
