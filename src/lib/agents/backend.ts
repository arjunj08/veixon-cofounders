import { jsonLLM } from '../llm'
import { ArchitectureSpec } from './architect'
import { CodeArtifact } from './frontend'

export async function runBackendEngineerAgent(arch: ArchitectureSpec): Promise<CodeArtifact[]> {
  const systemPrompt = `You are a Senior Backend Engineer Agent.
Your task is to take a Technical Architecture Specification and generate the actual Node.js backend code.
Since we are using Next.js with MongoDB/Mongoose, output the Mongoose Model files and the Next.js API route files.
You must output a JSON array of files. Each object should contain the filePath (e.g., 'models/User.ts' or 'app/api/users/route.ts'), the raw code string, and an array of npm dependencies needed.`

  const userPrompt = `
Database Schema: ${JSON.stringify(arch.databaseSchema, null, 2)}
API Endpoints: ${JSON.stringify(arch.apiEndpoints, null, 2)}

Please generate the backend code files.
`

  const schemaHint = `[
  {
    "filePath": "String",
    "code": "String",
    "dependencies": ["String"]
  }
]`

  const files = await jsonLLM({
    system: systemPrompt,
    user: userPrompt,
    schema_hint: schemaHint,
    maxTokens: 4000
  }) as CodeArtifact[]

  return files
}
