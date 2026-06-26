import { http } from '@/utils/request'
import type { Journal, JournalCreateInput, JournalUpdateInput } from '../types'
import { localDemoJournalApi } from './local-demo-api'

const isStaticDemo = import.meta.env.VITE_STATIC_DEMO === 'true'

export const journalApi = {
  list: (signal?: AbortSignal) =>
    isStaticDemo ? localDemoJournalApi.list() : http.get<Journal[]>('/journal', { signal }),
  get: (id: string, signal?: AbortSignal) =>
    isStaticDemo ? localDemoJournalApi.get(id) : http.get<Journal>(`/journal/${id}`, { signal }),
  create: (input: JournalCreateInput) =>
    isStaticDemo ? localDemoJournalApi.create(input) : http.post<Journal>('/journal', input),
  update: (id: string, input: JournalUpdateInput) =>
    isStaticDemo
      ? localDemoJournalApi.update(id, input)
      : http.patch<Journal>(`/journal/${id}`, input),
  remove: (id: string) =>
    isStaticDemo ? localDemoJournalApi.remove(id) : http.delete<{ id: string }>(`/journal/${id}`),
}
