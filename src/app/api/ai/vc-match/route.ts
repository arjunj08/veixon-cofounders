import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'

const system = `Explain why this VC matches this founder's startup. One paragraph. Direct. Specific to both the startup's metrics and the VC's actual thesis. Return ONLY valid JSON: { matchReason:string }.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    try {
      return Response.json(await callClaudeJson({ system, body, maxTokens: 600 }))
    } catch {
      return Response.json({
        matchReason: `${body.vc?.name || 'This VC'} fits if you can prove a sharp early market wedge and capital-efficient traction.`,
        fallback: true,
      })
    }
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
