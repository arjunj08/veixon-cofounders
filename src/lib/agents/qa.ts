import { jsonLLM } from '../llm'
import { PRD } from './pm'
import { CodeArtifact } from './frontend'

export interface QAReport {
  status: 'Pass' | 'Fail'
  issues: {
    filePath: string
    severity: 'High' | 'Medium' | 'Low'
    description: string
    suggestedFix: string
  }[]
}

export async function runQAAgent(prd: PRD, codeFiles: CodeArtifact[]): Promise<QAReport> {
  const systemPrompt = `You are a Senior QA Engineer Agent.
Your task is to review the generated code against the Product Requirements Document (PRD).
Ensure that all P0 features are implemented, there are no obvious syntax errors, and the dependencies are correctly listed.
Output a JSON report detailing any issues found and whether the build passes or fails.`

  const userPrompt = `
PRD Title: ${prd.title}
Code Files: ${JSON.stringify(codeFiles.map(f => ({ path: f.filePath, codeSnippet: f.code.substring(0, 500) + '...' })), null, 2)}

Please generate the QA Report.
`

  const schemaHint = `{
  "status": "Pass | Fail",
  "issues": [
    { "filePath": "String", "severity": "High | Medium | Low", "description": "String", "suggestedFix": "String" }
  ]
}`

  const report = await jsonLLM({
    system: systemPrompt,
    user: userPrompt,
    schema_hint: schemaHint,
    maxTokens: 3000
  }) as QAReport

  return report
}
