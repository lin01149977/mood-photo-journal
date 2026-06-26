import { NotFoundError } from '@/utils/http-error'
import { journalRepository } from './journal.repository'
import type { Journal } from './journal.types'
import type { JournalCreateInput, JournalUpdateInput } from './journal.schema'

export const journalService = {
  list(): Promise<Journal[]> {
    return journalRepository.list()
  },

  async get(id: string): Promise<Journal> {
    const journal = await journalRepository.findById(id)
    if (!journal) throw NotFoundError('journal')
    return journal
  },

  create(input: JournalCreateInput): Promise<Journal> {
    return journalRepository.create(input)
  },

  async update(id: string, input: JournalUpdateInput): Promise<Journal> {
    const exists = await journalRepository.findById(id)
    if (!exists) throw NotFoundError('journal')
    const updated = await journalRepository.update(id, input)
    if (!updated) throw NotFoundError('journal')
    return updated
  },

  async remove(id: string): Promise<{ id: string }> {
    const ok = await journalRepository.remove(id)
    if (!ok) throw NotFoundError('journal')
    return { id }
  },
}
