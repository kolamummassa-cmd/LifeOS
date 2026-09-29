import type { DashboardSummary, Note, Paginated, Person, Resource, Goal as GoalType, Tag } from '../../types'
import { api } from './client'

export async function getDashboard() {
  const { data } = await api.get<DashboardSummary>('/dashboard/')
  return data
}

export async function search(query: string) {
  const { data } = await api.get<{ resources: Resource[]; notes: Note[]; goals: GoalType[] }>('/search/', {
    params: { q: query },
  })
  return data
}

export async function listTags() {
  const { data } = await api.get<Paginated<Tag>>('/tags/', { params: { page_size: 200 } })
  return data.results
}

export async function listPeople() {
  const { data } = await api.get<Paginated<Person>>('/people/', { params: { page_size: 100 } })
  return data.results
}
export async function createPerson(payload: Partial<Person>) {
  const { data } = await api.post<Person>('/people/', payload)
  return data
}
export async function updatePerson(id: number, payload: Partial<Person>) {
  const { data } = await api.patch<Person>(`/people/${id}/`, payload)
  return data
}
export async function deletePerson(id: number) {
  await api.delete(`/people/${id}/`)
}

export async function getDriveStatus() {
  const { data } = await api.get<{ configured: boolean; connected: boolean }>('/integrations/drive/status/')
  return data
}

export async function startDriveConnection() {
  const { data } = await api.get<{ authorization_url: string }>('/integrations/drive/auth/')
  return data
}
