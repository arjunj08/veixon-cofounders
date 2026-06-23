import { jsonLLM } from '../llm'
import { PRD } from './pm'

export interface ArchitectureSpec {
  techStack: {
    frontend: string
    backend: string
    database: string
    infrastructure: string
  }
  databaseSchema: {
    tableName: string
    columns: { name: string, type: string, description: string }[]
    relations: string[]
  }[]
  apiEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    description: string
    payloadSummary: string
  }[]
}

export async function runArchitectAgent(prd: PRD): Promise<ArchitectureSpec> {
  const systemPrompt = `You are a Staff Software Architect Agent.
Your task is to take a Product Requirements Document (PRD) and design the technical architecture for the MVP.
We default to a modern, scalable, but fast-to-ship stack: Next.js (React), Node.js/Python for AI logic, and PostgreSQL (or MongoDB).
Design the database schema and API endpoints needed to support the core P0 features.`

  const userPrompt = `
PRD Title: ${prd.title}
Features: ${JSON.stringify(prd.coreFeatures.filter(f => f.priority === 'P0'), null, 2)}
User Flows: ${JSON.stringify(prd.userFlows, null, 2)}

Please design the technical architecture.
`

  const schemaHint = `{
  "techStack": { "frontend": "String", "backend": "String", "database": "String", "infrastructure": "String" },
  "databaseSchema": [
    { 
      "tableName": "String", 
      "columns": [{ "name": "String", "type": "String", "description": "String" }],
      "relations": ["String"]
    }
  ],
  "apiEndpoints": [
    { "method": "GET | POST | PUT | DELETE", "path": "String", "description": "String", "payloadSummary": "String" }
  ]
}`

  const architecture = await jsonLLM({
    system: systemPrompt,
    user: userPrompt,
    schema_hint: schemaHint,
    maxTokens: 4000
  }) as ArchitectureSpec

  return architecture
}
