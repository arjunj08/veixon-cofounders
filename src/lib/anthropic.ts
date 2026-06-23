// Back-compat shim — keeps the original `callClaudeJson` API while routing every call
// through the new provider-agnostic AI Gateway (retries, fallback, circuit-breaker, usage).
// Existing routes (`@/lib/anthropic`) keep working unchanged.
import { chatJson, listConfiguredProviders } from '@/lib/ai'

export const CLAUDE_MODEL = process.env.NVIDIA_MODEL_ID || 'nvidia/nemotron-3-super-120b-a12b'

// Retained for compatibility. Now reports whether ANY provider is configured.
export function getAnthropicClient() {
  return listConfiguredProviders().length ? {} : null
}

export function aiError(message = 'AI unavailable') {
  return Response.json({ error: message, fallback: true }, { status: 500 })
}

export async function callClaudeJson<T>({
  system,
  body,
  maxTokens = 2000,
}: {
  system: string
  body: any
  maxTokens?: number
}): Promise<T> {
  return chatJson<T>({
    system,
    messages: [{ role: 'user', content: JSON.stringify(body) }],
    maxTokens,
    json: true,
  })
}
