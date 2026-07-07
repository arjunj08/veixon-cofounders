import { chatJsonSafe } from '@/lib/ai'
import { z } from 'zod'

export const runtime = 'nodejs'

const pitchDeckSchema = z.object({
  slides: z.array(z.object({
    slideNumber: z.number(),
    title: z.string(),
    headline: z.string(),
    bullets: z.array(z.string()),
    vznNote: z.string()
  }))
})

const system = `Generate 12-slide pitch deck from founder's real data. Use Indian Rupees (₹, Lakhs, Crores) for all financial numbers, valuations, asks, and revenue stats. Return ONLY valid JSON: { slides:[{ slideNumber:number, title:string, headline:string, bullets:[string], vznNote:string }] }. Use actual data points from founder profile - not generic startup template language.`

const titles = ['Problem', 'Customer', 'Solution', 'Why Now', 'Market', 'Traction', 'Product', 'Business Model', 'GTM', 'Competition', 'Team', 'Ask']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const profile = body.profile
    const hasData = !!(profile && (profile.problem || profile.ideaText || profile.targetCustomer))
    
    if (!hasData) {
      return Response.json({
        slides: titles.map((title, index) => ({
          slideNumber: index + 1,
          title,
          headline: index === 0 ? 'A painful workflow is still handled manually.' : `${title} needs investor-grade proof.`,
          bullets: ['Use real customer quotes.', 'Show the metric that changed.', 'Delete anything that sounds like a template.'],
          vznNote: 'Specific beats impressive.',
        })),
        fallback: true,
      })
    }

    try {
      const result = await chatJsonSafe(pitchDeckSchema, {
        system,
        messages: [{ role: 'user', content: JSON.stringify(body) }],
        maxTokens: 2000
      })
      return Response.json(result)
    } catch {
      return Response.json({
        slides: titles.map((title, index) => ({
          slideNumber: index + 1,
          title,
          headline: index === 0 ? profile?.problem || 'A painful workflow is still handled manually.' : `${title} needs investor-grade proof.`,
          bullets: ['Use real customer quotes.', 'Show the metric that changed.', 'Delete anything that sounds like a template.'],
          vznNote: 'Specific beats impressive.',
        })),
        fallback: true,
      })
    }
  } catch {
    return Response.json({ error: 'AI unavailable', fallback: true }, { status: 500 })
  }
}
