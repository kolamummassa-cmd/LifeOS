import type { Academy, AcademyPeriod, Paginated } from '../../types'
import { api } from './client'

export async function listAcademies() {
  const { data } = await api.get<Paginated<Academy>>('/academies/', { params: { page_size: 50 } })
  return data.results
}

export async function getAcademy(id: number) {
  const { data } = await api.get<Academy>(`/academies/${id}/`)
  return data
}

export async function createAcademy(payload: Partial<Academy>) {
  const { data } = await api.post<Academy>('/academies/', payload)
  return data
}

export async function updateAcademy(id: number, payload: Partial<Academy>) {
  const { data } = await api.patch<Academy>(`/academies/${id}/`, payload)
  return data
}

export async function deleteAcademy(id: number) {
  await api.delete(`/academies/${id}/`)
}

export async function listAcademyPeriods(academyId?: number) {
  const { data } = await api.get<Paginated<AcademyPeriod>>('/academy-periods/', {
    params: { academy: academyId, page_size: 50 },
  })
  return data.results
}

export async function createAcademyPeriod(payload: Partial<AcademyPeriod>) {
  const { data } = await api.post<AcademyPeriod>('/academy-periods/', payload)
  return data
}

export async function updateAcademyPeriod(id: number, payload: Partial<AcademyPeriod>) {
  const { data } = await api.patch<AcademyPeriod>(`/academy-periods/${id}/`, payload)
  return data
}
