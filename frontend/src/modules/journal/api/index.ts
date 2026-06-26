import { http } from '@/utils/request'
import type { Journal, JournalCreateInput, JournalUpdateInput } from '../types'

export const journalApi = {
  list: (signal?: AbortSignal) => http.get<Journal[]>('/journal', { signal }),
  get: (id: string, signal?: AbortSignal) => http.get<Journal>(`/journal/${id}`, { signal }),
  create: (input: JournalCreateInput) => http.post<Journal>('/journal', input),
  update: (id: string, input: JournalUpdateInput) => http.patch<Journal>(`/journal/${id}`, input),
  remove: (id: string) => http.delete<{ id: string }>(`/journal/${id}`),
}
