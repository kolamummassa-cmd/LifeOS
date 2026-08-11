import type { Goal, Milestone, Paginated } from '../../types'
import { api } from './client'

export async function listGoals(academyId?: number) {
  const { data } = await api.get<Paginated<Goal>>('/goals/', { params: { academy: academyId, page_size: 100 } })
  return data.results
}
export async function createGoal(payload: Partial<Goal>) {
  const { data } = await api.post<Goal>('/goals/', payload)
  return data
}
export async function updateGoal(id: number, payload: Partial<Goal>) {
  const { data } = await api.patch<Goal>(`/goals/${id}/`, payload)
  return data
}
export async function deleteGoal(id: number) {
  await api.delete(`/goals/${id}/`)
}

export async function createMilestone(payload: Partial<Milestone>) {
  const { data } = await api.post<Milestone>('/milestones/', payload)
  return data
}
export async function updateMilestone(id: number, payload: Partial<Milestone>) {
  const { data } = await api.patch<Milestone>(`/milestones/${id}/`, payload)
  return data
}
export async function deleteMilestone(id: number) {
  await api.delete(`/milestones/${id}/`)
}
