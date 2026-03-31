import axios, { AxiosHeaders, type AxiosRequestHeaders } from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export const http = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const TOKEN_KEY = 'accessToken'

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      const baseHeaders =
        typeof config.headers === 'object' && config.headers != null
          ? (config.headers as Record<string, unknown>)
          : {}
      config.headers = {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders
    }
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const hasResponse = Boolean(error?.response)
    if (!hasResponse) {
      error.message = 'Сървърът е временно недостъпен. Моля, опитайте отново след малко.'
    }
    return Promise.reject(error)
  },
)

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
