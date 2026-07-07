import { chatJsonSafe } from '@/lib/ai'
import { z } from 'zod'

export const runtime = 'nodejs'

const pitchEmailSchema = z.object({
  subject: z.string(),
  body: z.string()
})

const system = `Write personalised intro email from founder to this specific VC. Reference founder's real metrics. Use Indian Rupees (₹, Lakhs, Crores) for all financial asks and revenue metrics. Return ONLY valid JSON: { subject:string, body:string }. Warm but specific.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    try {
      const result = await chatJsonSafe(pitchEmailSchema, {
        system,
        messages: [{ role: 'user', content: JSON.stringify(body) }],
        maxTokens: 800
      })
      return Response.json(result)
    } catch {
      return Response.json({
        subject: `Intro: ${body.profile?.ideaText || 'VISIONIX-backed founder'} x ${body.vc?.name || 'your fund'}`,
        body: `Hi ${body.vc?.name || 'there'},\n\nI am building ${body.profile?.ideaText || 'a focused startup'} for ${body.profile?.targetCustomer || 'a specific customer segment'}. VZN flagged your fund as a fit because the stage and thesis line up with our current traction path.\n\nCould I send a short deck?\n\nBest,`,
        fallback: true,
      })
    }
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
