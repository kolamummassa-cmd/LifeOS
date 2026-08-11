import type { Habit, Paginated } from '../../types'
import { api } from './client'

export async function listHabits() {
  const { data } = await api.get<Paginated<Habit>>('/habits/', { params: { page_size: 50 } })
  return data.results
}
export async function createHabit(payload: Partial<Habit>) {
  const { data } = await api.post<Habit>('/habits/', payload)
  return data
}
export async function toggleHabitToday(id: number) {
  const { data } = await api.post(`/habits/${id}/toggle_today/`)
  return data
}
export async function deleteHabit(id: number) {
  await api.delete(`/habits/${id}/`)
}
