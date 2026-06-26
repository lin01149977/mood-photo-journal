import type { FastifyInstance } from 'fastify'
import { journalController } from './journal.controller'

export async function journalRoutes(app: FastifyInstance) {
  app.get('/', journalController.list)
  app.get('/:id', journalController.get)
  app.post('/', journalController.create)
  app.patch('/:id', journalController.update)
  app.delete('/:id', journalController.remove)
}
