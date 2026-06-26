import { defineStore } from 'pinia'
import { ref } from 'vue'
import { journalApi } from '../api'
import type { Journal, JournalCreateInput, JournalUpdateInput } from '../types'

export const useJournalStore = defineStore('journal', () => {
  const items = ref<Journal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function sortEntries(entries: Journal[]) {
    return [...entries].sort((a, b) => {
      const byDate = b.entryDate.localeCompare(a.entryDate)
      return byDate || b.createdAt.localeCompare(a.createdAt)
    })
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      items.value = await journalApi.list()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(input: JournalCreateInput) {
    const journal = await journalApi.create(input)
    items.value = sortEntries([journal, ...items.value])
    return journal
  }

  async function update(id: string, input: JournalUpdateInput) {
    const next = await journalApi.update(id, input)
    items.value = sortEntries(items.value.map((it) => (it.id === id ? next : it)))
    return next
  }

  async function remove(id: string) {
    await journalApi.remove(id)
    items.value = items.value.filter((it) => it.id !== id)
  }

  return { items, loading, error, fetchAll, create, update, remove }
})
