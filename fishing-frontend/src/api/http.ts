import axios from 'axios'

/**
 * Base URL for the API. In dev, leave empty to use Vite proxy (`/api` → backend).
 * For production or direct calls, set `VITE_API_URL` (e.g. https://api.example.com).
 */
const baseURL = import.meta.env.VITE_API_URL ?? ''

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const TOKEN_KEY = 'accessToken'

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
