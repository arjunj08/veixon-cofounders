import { jsonLLM } from '../llm'
import { UIUXSpec } from './uiux'
import { ArchitectureSpec } from './architect'

export interface CodeArtifact {
  filePath: string
  code: string
  dependencies: string[]
}

export async function runFrontendEngineerAgent(uiux: UIUXSpec, arch: ArchitectureSpec): Promise<CodeArtifact[]> {
  const systemPrompt = `You are a Senior Frontend Engineer Agent.
Your task is to take a UI/UX Specification and a Technical Architecture and generate the actual React (Next.js) code.
You must output a JSON array of files. Each object should contain the filePath (e.g., 'app/page.tsx'), the raw code string, and an array of npm dependencies needed.
Focus on generating the core structural files and components first.`

  const userPrompt = `
UI/UX Spec: ${JSON.stringify(uiux, null, 2)}
Architecture API Endpoints: ${JSON.stringify(arch.apiEndpoints, null, 2)}

Please generate the frontend code files.
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
