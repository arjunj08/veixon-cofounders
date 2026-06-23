// Server-only LLM client — NVIDIA Nemotron (primary) or Emergent gateway (fallback)

const NVIDIA_URL = (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '') + '/chat/completions'
const EMERGENT_URL = 'https://integrations.emergentagent.com/llm/v1/chat/completions'

function getProvider() {
  if (process.env.NVIDIA_API_KEY) return 'nvidia'
  if (process.env.EMERGENT_LLM_KEY) return 'emergent'
  throw new Error('NVIDIA_API_KEY not configured. Add it to .env.local and restart the dev server.')
}

function getModel(provider) {
  if (provider === 'nvidia') {
    return process.env.NVIDIA_MODEL_ID || 'nvidia/nemotron-3-super-120b-a12b'
  }
  return process.env.CLAUDE_MODEL_ID || 'claude-sonnet-4-20250514'
}

export async function chatLLM({ system, user, model, jsonOnly = false, maxTokens = 2000, temperature = 0.6, messages = null }) {
  const provider = getProvider()
  const key = provider === 'nvidia' ? process.env.NVIDIA_API_KEY : process.env.EMERGENT_LLM_KEY
  const url = provider === 'nvidia' ? NVIDIA_URL : EMERGENT_URL
  const finalModel = model || getModel(provider)

  let msgs = messages
  if (!msgs) {
    msgs = []
    if (system) msgs.push({ role: 'system', content: system })
    if (user) msgs.push({ role: 'user', content: user })
  }

  const body = {
    model: finalModel,
    max_tokens: maxTokens,
    messages: msgs,
  }

  if (provider === 'nvidia') {
    body.temperature = jsonOnly ? 0.4 : 1
    body.top_p = 0.95
    body.chat_template_kwargs = { enable_thinking: !jsonOnly }
    if (!jsonOnly) {
      body.reasoning_budget = Number(process.env.NVIDIA_REASONING_BUDGET) || 16384
    }
  } else {
    body.temperature = temperature
  }

  if (jsonOnly) {
    body.response_format = { type: 'json_object' }
  }

  const headers = {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
  if (provider === 'nvidia') {
    headers['NVCF-POLL-SECONDS'] = process.env.NVIDIA_POLL_SECONDS || '1800'
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LLM error ${res.status}: ${text.slice(0, 500)}`)
  }

  const data = await res.json()
  const message = data?.choices?.[0]?.message
  // Prefer final answer content; fall back to reasoning if needed
  return message?.content ?? message?.reasoning_content ?? ''
}

export async function jsonLLM({ system, user, schema_hint, maxTokens = 4000 }) {
  const fullSystem =
    (system || '') +
    '\n\nYou MUST respond with ONLY a single valid JSON object. No markdown, no code fences, no commentary. Just raw JSON.' +
    (schema_hint ? `\n\nFollow this JSON shape exactly:\n${schema_hint}` : '')

  const raw = await chatLLM({ system: fullSystem, user, jsonOnly: true, maxTokens, temperature: 0.4 })

  try {
    return JSON.parse(raw)
  } catch (e) {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim()
    try {
      return JSON.parse(cleaned)
    } catch (e2) {
      const m = cleaned.match(/\{[\s\S]*\}/)
      if (m) {
        return JSON.parse(m[0])
      }
      throw new Error('Could not parse JSON from LLM. Raw: ' + raw.slice(0, 300))
    }
  }
}
