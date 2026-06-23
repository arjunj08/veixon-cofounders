import type { StartupRecord } from './types'

type MemoryStore = {
  startups: Map<string, StartupRecord>
  decisions: Map<string, any>
  checkins: Map<string, any>
}

declare global {
  var visionixMemoryStore: MemoryStore | undefined
}

export function memoryStore() {
  if (!global.visionixMemoryStore) {
    global.visionixMemoryStore = {
      startups: new Map(),
      decisions: new Map(),
      checkins: new Map(),
    }
  }
  return global.visionixMemoryStore
}
