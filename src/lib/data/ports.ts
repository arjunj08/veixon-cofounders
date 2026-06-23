// Data-access PORTS (Dependency Inversion). Domains depend on these interfaces, never on
// a concrete store. Swapping SQLite → Postgres (or any store) becomes a one-line change in
// src/lib/data/index.ts — no domain/route rewrite. This is the core of Phase 2.

export interface StartupRepository {
  create(record: any): Promise<any>
  findById(id: string): Promise<any | null>
  findLatestByUser(userId: string): Promise<any | null>
  update(id: string, patch: any): Promise<void>
}

export interface DecisionRepository {
  create(record: any): Promise<any>
  findById(id: string): Promise<any | null>
  listByUser(userId: string): Promise<any[]>
}

export interface CheckinRepository {
  create(record: any): Promise<any>
  findById(id: string): Promise<any | null>
  findLatestByUser(userId: string): Promise<any | null>
}

export interface DataLayer {
  newId(prefix: string): string
  startups: StartupRepository
  decisions: DecisionRepository
  checkins: CheckinRepository
}
