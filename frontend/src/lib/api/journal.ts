import type { JournalEntry, Paginated } from '../../types'
import { api } from './client'

export async function listJournalEntries(entryType?: string) {
  const { data } = await api.get<Paginated<JournalEntry>>('/journal-entries/', {
    params: { entry_type: entryType, page_size: 100 },
  })
  return data.results
}
export async function createJournalEntry(payload: Partial<JournalEntry>) {
  const { data } = await api.post<JournalEntry>('/journal-entries/', payload)
  return data
}
export async function updateJournalEntry(id: number, payload: Partial<JournalEntry>) {
  const { data } = await api.patch<JournalEntry>(`/journal-entries/${id}/`, payload)
  return data
}
export async function deleteJournalEntry(id: number) {
  await api.delete(`/journal-entries/${id}/`)
}
