import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/*
  Token storage: kept in localStorage for simplicity — this is a
  single-user personal app run by Kolamu himself, not a multi-tenant
  product, so the usual "never put JWTs in localStorage" concern about
  other users' scripts stealing tokens on a shared origin doesn't apply
  here the way it would on a public product. If LifeOS ever becomes
  multi-user or public-facing, revisit this (see docs/Architecture.md).
*/
const ACCESS_KEY = 'lifeos_access_token'
const REFRESH_KEY = 'lifeos_refresh_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null
  try {
    const { data } = await axios.post(`${API_URL}/auth/login/refresh/`, { refresh })
    setTokens(data.access)
    return data.access
  } catch {
    clearTokens()
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (!refreshing) {
        refreshing = refreshAccessToken().finally(() => {
          refreshing = null
        })
      }
      const newToken = await refreshing
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
