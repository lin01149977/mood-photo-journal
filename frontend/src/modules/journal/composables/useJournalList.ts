import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useJournalStore } from '../store'
import type { Journal, MoodOption } from '../types'

export const moodOptions: MoodOption[] = [
  { id: 'happy', label: '开心', emoji: '😊', color: '#ffbf3f' },
  { id: 'calm', label: '平静', emoji: '😌', color: '#6dc6c9' },
  { id: 'sad', label: '伤心', emoji: '😢', color: '#7aa7e8' },
  { id: 'low', label: '低落', emoji: '☁️', color: '#8f95a8' },
  { id: 'expecting', label: '期待', emoji: '🤩', color: '#ff7a45' },
]

export interface MonthDay {
  key: string
  day: number
  weekday: string
  entry?: Journal
  color: string
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function sameMonth(dateKey: string, now: Date) {
  return dateKey.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
}

function buildMonthDays(entriesByDate: Map<string, Journal[]>, date = new Date()): MonthDay[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const totalDays = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: totalDays }, (_, index) => {
    const current = new Date(year, month, index + 1)
    const key = toDateKey(current)
    const entry = entriesByDate.get(key)?.[0]
    return {
      key,
      day: index + 1,
      weekday: current.toLocaleDateString('zh-CN', { weekday: 'short' }),
      entry,
      color: entry?.moodColor ?? '#f0dcc9',
    }
  })
}

export function useJournalList() {
  const store = useJournalStore()
  const { items, loading, error } = storeToRefs(store)

  const entriesByDate = computed(() => {
    const map = new Map<string, Journal[]>()
    for (const item of items.value) {
      map.set(item.entryDate, [...(map.get(item.entryDate) ?? []), item])
    }
    return map
  })

  const monthDays = computed(() => buildMonthDays(entriesByDate.value))
  const monthEntries = computed(() => items.value.filter((item) => sameMonth(item.entryDate, new Date())))
  const photoCount = computed(() => items.value.reduce((total, item) => total + item.photos.length, 0))

  return {
    items,
    loading,
    error,
    entriesByDate,
    monthDays,
    monthEntries,
    photoCount,
    moods: moodOptions,
    fetchAll: store.fetchAll,
    create: store.create,
    update: store.update,
    remove: store.remove,
  }
}
