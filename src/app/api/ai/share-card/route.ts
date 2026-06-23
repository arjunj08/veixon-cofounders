import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'

const system = `Generate LinkedIn post for founder. Return ONLY valid JSON: { postText:string, highlightStat:string }. Written as founder's voice, not VZN. Include @VISIONIXFounders and relevant hashtags.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    try {
      return Response.json(await callClaudeJson({ system, body, maxTokens: 700 }))
    } catch {
      return Response.json({
        postText: `Day ${body.day || 1} of building with @VISIONIXFounders. I am replacing assumptions with evidence. #startup #buildinpublic #founders`,
        highlightStat: body.highlightStat || '1 hard signal logged',
        fallback: true,
      })
    }
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
