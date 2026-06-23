// Prisma adapter implementing the data ports. It delegates to the proven server-store
// functions, so behaviour is identical today (zero risk) while the rest of the app can
// start depending on the abstract `DataLayer` instead of importing the store directly.
import * as store from '@/lib/server-store'
import type { DataLayer } from './ports'

export const prismaData: DataLayer = {
  newId: store.newId,
  startups: {
    create: store.saveStartup,
    findById: store.getStartupById,
    findLatestByUser: store.getLatestStartup,
    update: store.updateStartup,
  },
  decisions: {
    create: store.saveDecision,
    findById: store.getDecisionById,
    listByUser: store.listDecisions,
  },
  checkins: {
    create: store.saveCheckin,
    findById: store.getCheckinById,
    findLatestByUser: store.getLatestCheckin,
  },
}
