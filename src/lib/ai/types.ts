// AI Gateway — domain port + types. Provider-agnostic LLM contract.
// Structured so this whole folder lifts into a NestJS `ai-gateway` module unchanged.

export type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'ollama' | 'nvidia'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  system?: string
  messages: ChatMessage[]
  model?: string
  maxTokens?: number
  temperature?: number
  timeoutMs?: number
  json?: boolean
}

export interface Usage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface ChatResult {
  text: string
  provider: ProviderName
  model: string
  usage: Usage
  latencyMs: number
  raw?: unknown
}

// The port every provider adapter implements (Dependency Inversion).
export interface LlmProvider {
  readonly name: ProviderName
  readonly defaultModel: string
  configured(): boolean
  chat(req: ChatRequest): Promise<ChatResult>
}

export class AiError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider?: ProviderName,
    public status?: number,
    public retryable = false,
  ) {
    super(message)
    this.name = 'AiError'
  }
}

export type Tier = 'default' | 'fast' | 'strong'

export interface ChatOptions {
  tier?: Tier
  providers?: ProviderName[]
  retries?: number
  cache?: boolean
  userId?: string
}

export interface UsageEvent {
  provider: ProviderName
  model: string
  usage: Usage
  latencyMs: number
  userId?: string
  costUsd?: number
}
