import { jsonLLM } from '../llm'
import { PRD } from './pm'

export interface UIUXSpec {
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  pages: {
    path: string
    layout: string
    components: {
      name: string
      props: string[]
      description: string
    }[]
  }[]
}

export async function runUIUXAgent(prd: PRD): Promise<UIUXSpec> {
  const systemPrompt = `You are a Staff UI/UX Designer Agent.
Your task is to take a Product Requirements Document (PRD) and design the user interface components.
You should output a JSON specification of the Pages, Layouts, and the specific React components needed.
Ensure the design is clean, minimal, and modern.`

  const userPrompt = `
PRD Title: ${prd.title}
Features: ${JSON.stringify(prd.coreFeatures.filter(f => f.priority === 'P0'), null, 2)}
User Flows: ${JSON.stringify(prd.userFlows, null, 2)}

Please design the UI/UX components.
`

  const schemaHint = `{
  "theme": { "primaryColor": "String", "secondaryColor": "String", "fontFamily": "String" },
  "pages": [
    {
      "path": "String",
      "layout": "String",
      "components": [
        { "name": "String", "props": ["String"], "description": "String" }
      ]
    }
  ]
}`

  const spec = await jsonLLM({
    system: systemPrompt,
    user: userPrompt,
    schema_hint: schemaHint,
    maxTokens: 4000
  }) as UIUXSpec

  return spec
}
