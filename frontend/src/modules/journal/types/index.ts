export interface Journal {
  id: string
  entryDate: string
  mood: string
  moodColor: string
  note: string
  photos: string[]
  createdAt: string
  updatedAt: string
}

export interface JournalCreateInput {
  entryDate: string
  mood: string
  moodColor: string
  note?: string
  photos: string[]
}

export interface JournalUpdateInput {
  entryDate?: string
  mood?: string
  moodColor?: string
  note?: string
  photos?: string[]
}

export interface MoodOption {
  id: string
  label: string
  color: string
}
