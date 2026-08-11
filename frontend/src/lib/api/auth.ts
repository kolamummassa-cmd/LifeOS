import { api, clearTokens, setTokens } from './client'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export async function login(username: string, password: string) {
  const { data } = await api.post('/auth/login/', { username, password })
  setTokens(data.access, data.refresh)
}

export function logout() {
  clearTokens()
}

export async function getMe(): Promise<User> {
  const { data } = await api.get('/auth/me/')
  return data
}
