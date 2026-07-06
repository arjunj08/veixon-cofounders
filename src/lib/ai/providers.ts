// AI Gateway — provider adapters (infrastructure layer).
// OpenAI-compatible (OpenAI/Groq/Ollama/NVIDIA) share one base; Anthropic + Gemini are bespoke.
import { AiError, type ChatRequest, type ChatResult, type LlmProvider, type ProviderName } from './types'

// Pull the first valid JSON object/array out of a model response (handles <think> + ```json fences).
export function extractJson(text: string): string {
  let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```json|```/gi, '').trim()
  const fo = clean.indexOf('{'), fa = clean.indexOf('[')
  let start = -1
  if (fo === -1) start = fa
  else if (fa === -1) start = fo
  else start = Math.min(fo, fa)
  if (start === -1) return clean
  const open = clean[start], close = open === '{' ? '}' : ']'
  let depth = 0
  for (let i = start; i < clean.length; i++) {
    if (clean[i] === open) depth++
    else if (clean[i] === close && --depth === 0) return clean.slice(start, i + 1)
  }
  return clean.slice(start)
}

async function postJson(url: string, headers: Record<string, string>, body: unknown, timeoutMs = 60000, provider?: ProviderName): Promise<any> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: ctrl.signal })
    if (!r.ok) {
      const txt = await r.text().catch(() => '')
      throw new AiError(`HTTP ${r.status}: ${txt.slice(0, 300)}`, 'provider_http', provider, r.status, r.status >= 500 || r.status === 429)
    }
    return await r.json()
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new AiError('Provider timeout', 'timeout', provider, undefined, true)
    if (e instanceof AiError) throw e
    throw new AiError(e?.message || 'Provider error', 'provider_error', provider, undefined, true)
  } finally {
    clearTimeout(t)
  }
}

// ---- OpenAI-compatible chat/completions (OpenAI, Groq, Ollama, NVIDIA) ----
interface OaiCfg { name: ProviderName; baseUrl: string; apiKey?: string; model: string; jsonMode: boolean; systemPrefix?: string }
async function oaiChat(cfg: OaiCfg, req: ChatRequest): Promise<ChatResult> {
  const start = Date.now()
  const sys = (cfg.systemPrefix || '') + (req.system || '') + (req.json && !cfg.jsonMode ? '\n\nRespond with ONLY valid JSON. No markdown, no commentary.' : '')
  const messages = [...(sys ? [{ role: 'system', content: sys }] : []), ...req.messages]
  const body: any = { model: req.model || cfg.model, max_tokens: req.maxTokens ?? 2000, temperature: req.temperature ?? 0.6, messages }
  if (cfg.name === 'nvidia') {
    body.chat_template_kwargs = { enable_thinking: !req.json }
    body.temperature = req.json ? 0.35 : 0.7
  }
  if (req.json && cfg.jsonMode) body.response_format = { type: 'json_object' }
  const headers = cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}
  const data = await postJson(`${cfg.baseUrl}/chat/completions`, headers, body, req.timeoutMs, cfg.name)
  const u = data?.usage || {}
  return {
    text: data?.choices?.[0]?.message?.content ?? '',
    provider: cfg.name, model: body.model,
    usage: { promptTokens: u.prompt_tokens || 0, completionTokens: u.completion_tokens || 0, totalTokens: u.total_tokens || 0 },
    latencyMs: Date.now() - start, raw: data,
  }
}

function oaiProvider(name: ProviderName, baseUrl: string, keyEnv: string | null, defaultModel: string, jsonMode: boolean, systemPrefix?: string): LlmProvider {
  return {
    name, defaultModel,
    configured: () => (keyEnv ? !!process.env[keyEnv] : true),
    chat: (req) => oaiChat({ name, baseUrl, apiKey: keyEnv ? process.env[keyEnv] : undefined, model: req.model || defaultModel, jsonMode, systemPrefix }, req),
  }
}

// ---- Anthropic Messages API ----
const anthropic: LlmProvider = {
  name: 'anthropic',
  defaultModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
  configured: () => !!process.env.ANTHROPIC_API_KEY,
  async chat(req) {
    const start = Date.now()
    const model = req.model || this.defaultModel
    const system = (req.system || '') + (req.json ? '\n\nRespond with ONLY valid JSON. No markdown.' : '')
    const body = {
      model, max_tokens: req.maxTokens ?? 2000, temperature: req.temperature ?? 0.6,
      system: system || undefined,
      messages: req.messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content })),
    }
    const data = await postJson('https://api.anthropic.com/v1/messages', { 'x-api-key': process.env.ANTHROPIC_API_KEY || '', 'anthropic-version': '2023-06-01' }, body, req.timeoutMs, 'anthropic')
    const u = data?.usage || {}
    return {
      text: data?.content?.[0]?.text ?? '',
      provider: 'anthropic', model,
      usage: { promptTokens: u.input_tokens || 0, completionTokens: u.output_tokens || 0, totalTokens: (u.input_tokens || 0) + (u.output_tokens || 0) },
      latencyMs: Date.now() - start, raw: data,
    }
  },
}

// ---- Google Gemini ----
const gemini: LlmProvider = {
  name: 'gemini',
  defaultModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  configured: () => !!process.env.GEMINI_API_KEY,
  async chat(req) {
    const start = Date.now()
    const model = req.model || this.defaultModel
    const body: any = {
      contents: req.messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: req.maxTokens ?? 2000, temperature: req.temperature ?? 0.6 },
    }
    if (req.system) body.systemInstruction = { parts: [{ text: req.system }] }
    if (req.json) body.generationConfig.responseMimeType = 'application/json'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY || ''}`
    const data = await postJson(url, {}, body, req.timeoutMs, 'gemini')
    const u = data?.usageMetadata || {}
    return {
      text: (data?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text).join('') || '',
      provider: 'gemini', model,
      usage: { promptTokens: u.promptTokenCount || 0, completionTokens: u.candidatesTokenCount || 0, totalTokens: u.totalTokenCount || 0 },
      latencyMs: Date.now() - start, raw: data,
    }
  },
}

// Registry of all adapters (created once).
const REGISTRY: Record<ProviderName, LlmProvider> = {
  nvidia: oaiProvider('nvidia', process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1', 'NVIDIA_API_KEY', process.env.NVIDIA_MODEL_ID || 'nvidia/nemotron-3-super-120b-a12b', false, 'detailed thinking off\n\n'),
  openai: oaiProvider('openai', process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1', 'OPENAI_API_KEY', process.env.OPENAI_MODEL || 'gpt-4o-mini', true),
  groq: oaiProvider('groq', 'https://api.groq.com/openai/v1', 'GROQ_API_KEY', process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', true),
  ollama: oaiProvider('ollama', process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1', null, process.env.OLLAMA_MODEL || 'llama3.1', false),
  anthropic,
  gemini,
}

export function getProvider(name: ProviderName): LlmProvider {
  return REGISTRY[name]
}
export function allProviders(): LlmProvider[] {
  return Object.values(REGISTRY)
}
