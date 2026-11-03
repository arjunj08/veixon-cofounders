// Server-only client for VEIXON AI OS (the Venture Decision Engine + Academy knowledge base).
// Configure VEIXON_AIOS_URL (e.g. https://aios.veixon.in) and VEIXON_AIOS_API_KEY (a vx_live_ key
// created in VEIXON AI OS with the "chat" and "decisions" scopes).

export class AiosError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function aiosConfigured() {
  return !!(process.env.VEIXON_AIOS_URL && process.env.VEIXON_AIOS_API_KEY)
}

export function aiosBase() {
  return (process.env.VEIXON_AIOS_URL || '').replace(/\/$/, '')
}

export async function aios<T = any>(path: string, init?: { method?: string; body?: unknown; timeoutMs?: number }): Promise<T> {
  if (!aiosConfigured()) {
    throw new AiosError('VEIXON AI OS is not connected. Set VEIXON_AIOS_URL and VEIXON_AIOS_API_KEY.', 503)
  }
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 30000)
  try {
    const r = await fetch(`${aiosBase()}/api/v1${path}`, {
      method: init?.method || 'GET',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.VEIXON_AIOS_API_KEY || '' },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: ctrl.signal,
      cache: 'no-store',
    })
    const text = await r.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = { detail: text.slice(0, 300) }
    }
    if (!r.ok) {
      const detail = typeof data?.detail === 'string' ? data.detail : data?.detail?.message || data?.error || `HTTP ${r.status}`
      throw new AiosError(detail, r.status)
    }
    return data as T
  } catch (e: any) {
    if (e instanceof AiosError) throw e
    if (e?.name === 'AbortError') throw new AiosError('VEIXON AI OS did not answer in time.', 504)
    throw new AiosError('VEIXON AI OS is unreachable. Is it running?', 502)
  } finally {
    clearTimeout(t)
  }
}

export function aiosErrorResponse(e: unknown) {
  const err = e instanceof AiosError ? e : new AiosError('Unexpected error', 500)
  return Response.json({ error: err.message, connected: aiosConfigured() }, { status: err.status })
}
