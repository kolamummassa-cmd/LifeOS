import type { Note, Paginated } from '../../types'
import { api } from './client'

export async function listNotes(academyId?: number) {
  const { data } = await api.get<Paginated<Note>>('/notes/', { params: { academy: academyId, page_size: 100 } })
  return data.results
}
export async function getNote(id: number) {
  const { data } = await api.get<Note>(`/notes/${id}/`)
  return data
}
export async function createNote(payload: Partial<Note>) {
  const { data } = await api.post<Note>('/notes/', payload)
  return data
}
export async function updateNote(id: number, payload: Partial<Note>) {
  const { data } = await api.patch<Note>(`/notes/${id}/`, payload)
  return data
}
export async function deleteNote(id: number) {
  await api.delete(`/notes/${id}/`)
}
