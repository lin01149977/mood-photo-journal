import type { Journal, JournalCreateInput, JournalUpdateInput } from '../types'

const STORAGE_KEY = 'mood-photo-journal.entries.v1'

function nowIso() {
  return new Date().toISOString()
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `journal-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readEntries() {
  const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Journal[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeEntries(entries: Journal[]) {
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function sortEntries(entries: Journal[]) {
  return [...entries].sort((a, b) => {
    const byDate = b.entryDate.localeCompare(a.entryDate)
    return byDate || b.createdAt.localeCompare(a.createdAt)
  })
}

export const localDemoJournalApi = {
  async list() {
    return sortEntries(readEntries())
  },

  async get(id: string) {
    const entry = readEntries().find((item) => item.id === id)
    if (!entry) throw new Error('没有找到这篇日记')
    return entry
  },

  async create(input: JournalCreateInput) {
    const timestamp = nowIso()
    const entry: Journal = {
      id: createId(),
      entryDate: input.entryDate,
      mood: input.mood,
      moodColor: input.moodColor,
      note: input.note ?? '',
      photos: input.photos,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    writeEntries(sortEntries([entry, ...readEntries()]))
    return entry
  },

  async update(id: string, input: JournalUpdateInput) {
    const entries = readEntries()
    const current = entries.find((item) => item.id === id)
    if (!current) throw new Error('没有找到这篇日记')

    const next: Journal = {
      ...current,
      ...input,
      updatedAt: nowIso(),
    }
    writeEntries(sortEntries(entries.map((item) => (item.id === id ? next : item))))
    return next
  },

  async remove(id: string) {
    writeEntries(readEntries().filter((item) => item.id !== id))
    return { id }
  },
}
