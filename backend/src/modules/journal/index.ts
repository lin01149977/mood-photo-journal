import fp from 'fastify-plugin'
import { journalRoutes } from './journal.routes'

export default fp(
  async (app) => {
    await app.register(journalRoutes, { prefix: '/api/journal' })
  },
  { name: 'module-journal' },
)

export type { Journal } from './journal.types'
export { JournalCreateSchema, JournalUpdateSchema, JournalSchema } from './journal.schema'
