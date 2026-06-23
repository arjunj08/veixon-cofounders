import { callClaudeJson } from '@/lib/anthropic'

export const runtime = 'nodejs'

const system = `Generate 12-slide pitch deck from founder's real data. Return ONLY valid JSON: { slides:[{ slideNumber:number, title:string, headline:string, bullets:[string], vznNote:string }] }. Use actual data points from founder profile - not generic startup template language.`

const titles = ['Problem', 'Customer', 'Solution', 'Why Now', 'Market', 'Traction', 'Product', 'Business Model', 'GTM', 'Competition', 'Team', 'Ask']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    try {
      return Response.json(await callClaudeJson({ system, body, maxTokens: 4000 }))
    } catch {
      return Response.json({
        slides: titles.map((title, index) => ({
          slideNumber: index + 1,
          title,
          headline: index === 0 ? body.profile?.problem || 'A painful workflow is still handled manually.' : `${title} needs investor-grade proof.`,
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
