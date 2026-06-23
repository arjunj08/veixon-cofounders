import { jsonLLM } from '../llm'
import { PRD } from './pm'

export interface GrowthSpec {
  investorPitchDeck: {
    slideNumber: number
    title: string
    content: string
  }[]
  goToManyStrategy: {
    channel: string
    actionPlan: string
    expectedOutcome: string
  }[]
  landingPageCopy: {
    heroHeadline: string
    heroSubheadline: string
    callToAction: string
    benefits: string[]
  }
}

export async function runGrowthAgent(prd: PRD): Promise<GrowthSpec> {
  const systemPrompt = `You are a Growth Marketer & VC Associate Agent.
Your task is to take a completed Product Requirements Document (PRD) and generate the Go-To-Market (GTM) strategy, Landing Page copy, and a 10-slide Investor Pitch Deck outline.
Ensure the messaging is concise, compelling, and optimized for conversion and fundraising.`

  const userPrompt = `
PRD Title: ${prd.title}
Executive Summary: ${prd.executiveSummary}
Target Audience: ${prd.targetAudience.join(', ')}

Please generate the Growth & Investor Materials.
`

  const schemaHint = `{
  "investorPitchDeck": [{ "slideNumber": 1, "title": "String", "content": "String" }],
  "goToManyStrategy": [{ "channel": "String", "actionPlan": "String", "expectedOutcome": "String" }],
  "landingPageCopy": {
    "heroHeadline": "String",
    "heroSubheadline": "String",
    "callToAction": "String",
    "benefits": ["String"]
  }
}`

  const growth = await jsonLLM({
    system: systemPrompt,
    user: userPrompt,
    schema_hint: schemaHint,
    maxTokens: 4000
  }) as GrowthSpec

  return growth
}
