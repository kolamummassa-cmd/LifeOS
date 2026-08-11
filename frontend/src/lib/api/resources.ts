import type { Book, Paginated, Podcast, Resource, Video } from '../../types'
import { api } from './client'

type Filters = Record<string, string | number | undefined>

export async function listBooks(filters: Filters = {}) {
  const { data } = await api.get<Paginated<Book>>('/books/', { params: { page_size: 100, ...filters } })
  return data.results
}
export async function createBook(payload: Partial<Book>) {
  const { data } = await api.post<Book>('/books/', payload)
  return data
}
export async function updateBook(id: number, payload: Partial<Book>) {
  const { data } = await api.patch<Book>(`/books/${id}/`, payload)
  return data
}
export async function deleteBook(id: number) {
  await api.delete(`/books/${id}/`)
}

export async function listPodcasts(filters: Filters = {}) {
  const { data } = await api.get<Paginated<Podcast>>('/podcasts/', { params: { page_size: 100, ...filters } })
  return data.results
}
export async function createPodcast(payload: Partial<Podcast>) {
  const { data } = await api.post<Podcast>('/podcasts/', payload)
  return data
}
export async function updatePodcast(id: number, payload: Partial<Podcast>) {
  const { data } = await api.patch<Podcast>(`/podcasts/${id}/`, payload)
  return data
}
export async function deletePodcast(id: number) {
  await api.delete(`/podcasts/${id}/`)
}

export async function listVideos(filters: Filters = {}) {
  const { data } = await api.get<Paginated<Video>>('/videos/', { params: { page_size: 100, ...filters } })
  return data.results
}
export async function createVideo(payload: Partial<Video>) {
  const { data } = await api.post<Video>('/videos/', payload)
  return data
}
export async function updateVideo(id: number, payload: Partial<Video>) {
  const { data } = await api.patch<Video>(`/videos/${id}/`, payload)
  return data
}
export async function deleteVideo(id: number) {
  await api.delete(`/videos/${id}/`)
}

export async function listResources(filters: Filters = {}) {
  const { data } = await api.get<Paginated<Resource>>('/resources/', { params: { page_size: 100, ...filters } })
  return data.results
}
export async function createResource(payload: Partial<Resource>) {
  const { data } = await api.post<Resource>('/resources/', payload)
  return data
}
export async function updateResource(id: number, payload: Partial<Resource>) {
  const { data } = await api.patch<Resource>(`/resources/${id}/`, payload)
  return data
}
export async function deleteResource(id: number) {
  await api.delete(`/resources/${id}/`)
}
