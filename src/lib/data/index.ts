// THE single source of truth for data access. New code imports `db` from here and uses
// `db.startups.findById(...)` etc. To migrate the store (e.g. to a Postgres-native
// repository), change ONLY this file — nothing else.
import { prismaData } from './prisma-repository'
import type { DataLayer } from './ports'

export * from './ports'
export const db: DataLayer = prismaData
