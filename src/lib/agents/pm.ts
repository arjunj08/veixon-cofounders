import { jsonLLM } from '../llm'

export interface ProductContext {
  ideaText: string
  targetCustomer: string
  problem: string
}

export interface PRD {
  title: string
  executiveSummary: string
  targetAudience: string[]
  coreFeatures: {
    featureName: string
    description: string
    priority: 'P0' | 'P1' | 'P2'
  }[]
  userFlows: {
    flowName: string
    steps: string[]
  }[]
}

export async function runProductManagerAgent(context: ProductContext): Promise<PRD> {
  const systemPrompt = `You are a Staff Product Manager Agent.
Your task is to take a raw startup idea and generate a comprehensive Product Requirements Document (PRD) for the MVP (Minimum Viable Product).
Be opinionated, decisive, and focus ONLY on the absolute core features needed to validate the idea (P0 features).

Focus on practical execution. Exclude 'nice-to-have' features.
`

  const userPrompt = `
Idea: ${context.ideaText}
Target Customer: ${context.targetCustomer}
Problem: ${context.problem}

Please generate the PRD.
`

  const schemaHint = `{
  "title": "String",
  "executiveSummary": "String",
  "targetAudience": ["String"],
  "coreFeatures": [
    { "featureName": "String", "description": "String", "priority": "P0 | P1 | P2" }
  ],
  "userFlows": [
    { "flowName": "String", "steps": ["String"] }
  ]
}`

  const prd = await jsonLLM({
    system: systemPrompt,
    user: userPrompt,
    schema_hint: schemaHint,
    maxTokens: 3000
  }) as PRD

  return prd
}
