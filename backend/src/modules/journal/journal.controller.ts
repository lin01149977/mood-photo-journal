import type { FastifyReply, FastifyRequest } from 'fastify'
import { success } from '@/utils/response'
import { journalService } from './journal.service'
import { JournalCreateSchema, JournalIdSchema, JournalUpdateSchema } from './journal.schema'

export const journalController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    const data = await journalService.list()
    return reply.send(success(data))
  },

  async get(req: FastifyRequest, reply: FastifyReply) {
    const { id } = JournalIdSchema.parse(req.params)
    const data = await journalService.get(id)
    return reply.send(success(data))
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const input = JournalCreateSchema.parse(req.body)
    const data = await journalService.create(input)
    return reply.status(201).send(success(data, 'created'))
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = JournalIdSchema.parse(req.params)
    const input = JournalUpdateSchema.parse(req.body)
    const data = await journalService.update(id, input)
    return reply.send(success(data, 'updated'))
  },

  async remove(req: FastifyRequest, reply: FastifyReply) {
    const { id } = JournalIdSchema.parse(req.params)
    const data = await journalService.remove(id)
    return reply.send(success(data, 'deleted'))
  },
}
