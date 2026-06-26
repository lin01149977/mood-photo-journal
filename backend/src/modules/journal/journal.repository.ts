import { db } from '@/db'
import { nanoid } from '@/utils/id'
import type { Journal, JournalRow } from './journal.types'
import type { JournalCreateInput, JournalUpdateInput } from './journal.schema'

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value
}

function parsePhotos(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

function toDomain(row: JournalRow): Journal {
  return {
    id: row.id,
    entryDate: toIso(row.entry_date).slice(0, 10),
    mood: row.mood,
    moodColor: row.mood_color,
    note: row.note ?? '',
    photos: parsePhotos(row.photos),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  }
}

export const journalRepository = {
  async list(): Promise<Journal[]> {
    const rows = await db.query<JournalRow>(
      'SELECT * FROM journal ORDER BY entry_date DESC, created_at DESC',
    )
    return rows.map(toDomain)
  },

  async findById(id: string): Promise<Journal | null> {
    const row = await db.queryOne<JournalRow>('SELECT * FROM journal WHERE id = ?', [id])
    return row ? toDomain(row) : null
  },

  async create(input: JournalCreateInput): Promise<Journal> {
    const id = nanoid()
    const now = new Date().toISOString()
    const note = input.note ?? ''
    await db.execute(
      `INSERT INTO journal
        (id, entry_date, mood, mood_color, note, photos, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.entryDate, input.mood, input.moodColor, note, JSON.stringify(input.photos), now, now],
    )
    return {
      id,
      entryDate: input.entryDate,
      mood: input.mood,
      moodColor: input.moodColor,
      note,
      photos: input.photos,
      createdAt: now,
      updatedAt: now,
    }
  },

  async update(id: string, input: JournalUpdateInput): Promise<Journal | null> {
    const sets: string[] = []
    const params: unknown[] = []
    if (input.entryDate !== undefined) {
      sets.push('entry_date = ?')
      params.push(input.entryDate)
    }
    if (input.mood !== undefined) {
      sets.push('mood = ?')
      params.push(input.mood)
    }
    if (input.moodColor !== undefined) {
      sets.push('mood_color = ?')
      params.push(input.moodColor)
    }
    if (input.note !== undefined) {
      sets.push('note = ?')
      params.push(input.note)
    }
    if (input.photos !== undefined) {
      sets.push('photos = ?')
      params.push(JSON.stringify(input.photos))
    }
    if (sets.length === 0) return this.findById(id)
    sets.push('updated_at = ?')
    params.push(new Date().toISOString(), id)
    await db.execute(`UPDATE journal SET ${sets.join(', ')} WHERE id = ?`, params)
    return this.findById(id)
  },

  async remove(id: string): Promise<boolean> {
    const result = await db.execute('DELETE FROM journal WHERE id = ?', [id])
    return result.rowsAffected > 0
  },
}
