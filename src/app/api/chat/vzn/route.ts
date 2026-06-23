import { callClaudeJson } from '@/lib/anthropic'
import type { MarketIntelligence } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      message,
      founderName,
      startupName,
      ideaText,
      marketIntelligence,
      currentWeek,
      missionCode,
      missionName,
      dayNumber,
      todayTask,
      accountabilityScore,
      weekCompletionPct,
      streakCount,
      oath,
      lastDebriefSignal,
      recentDecisions,
      tractionProof,
    } = body

    if (!message || !founderName) {
      return Response.json({ error: 'Message and founder name required' }, { status: 400 })
    }

    const systemPrompt = `You are VZN — the AI co-founder of ${founderName}'s startup.

FOUNDER CONTEXT:
- Startup: ${startupName || 'Unknown'}
- Idea: ${ideaText || 'Unknown'}
- Market originality score: ${marketIntelligence?.ideaOriginality?.score || 'Unknown'}/10
- Biggest competitor: ${marketIntelligence?.biggestThreat || 'Unknown'}
- Current week: Week ${currentWeek || '?'} — ${missionCode || '?'}: ${missionName || '?'}
- Today: Day ${dayNumber || '?'} of 90
- Task today: ${todayTask || 'Unknown'}
- Accountability score: ${accountabilityScore || 0}%
- Task completion this week: ${weekCompletionPct || 0}%
- Streak: ${streakCount || 0} days
- Oath: "${oath || 'Not set'}"
- Recent debrief signal: "${lastDebriefSignal || 'None'}"
- Recent decisions: ${recentDecisions || 'None'}
- Traction: ${tractionProof ? 'Yes' : 'No'}

PERSONALITY:
Direct. Sharp. Zero filler. Never say "Great!" or "Awesome!".
Short sentences. One follow-up question when needed.
Reference their actual data when relevant.
Challenge laziness. Celebrate real wins briefly then push forward.
Max 3 sentences unless they ask for something long-form.

SPECIAL MODES:
- If they mention competitors: use the market intelligence data to give specific intel
- If they want to pivot: challenge hard with 3 specific questions before engaging
- If they ask about vault unlock: give exact gap with numbers
- If they analyse a new idea: run a quick 3-point analysis and be honest

OUTPUT FORMAT: Return ONLY valid JSON: { "reply": "your response as a string" }`

    const response = await callClaudeJson<{ reply: string }>({
      system: systemPrompt,
      body: { text: `Founder message: ${message}` },
      maxTokens: 500,
    })

    return Response.json({ reply: response.reply || 'VZN is thinking...' })
  } catch (error) {
    console.error('VZN chat error:', error)
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
