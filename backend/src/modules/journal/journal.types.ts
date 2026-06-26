import type { z } from 'zod'
import type { JournalSchema } from './journal.schema'

export type Journal = z.infer<typeof JournalSchema>

export interface JournalRow {
  id: string
  entry_date: string | Date
  mood: string
  mood_color: string
  note: string | null
  photos: string
  created_at: string | Date
  updated_at: string | Date
}
