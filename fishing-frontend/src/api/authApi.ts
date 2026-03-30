import { http, setAccessToken } from './http'
import type { AuthResponseDTO } from './types'

const REFRESH_KEY = 'refreshToken'

function setRefreshToken(token: string | null) {
  if (token) localStorage.setItem(REFRESH_KEY, token)
  else localStorage.removeItem(REFRESH_KEY)
}

export function clearAuth() {
  setAccessToken(null)
  setRefreshToken(null)
}

export async function login(email: string, password: string): Promise<AuthResponseDTO> {
  const { data } = await http.post<AuthResponseDTO>('/api/Auth/login', { email, password })
  setAccessToken(data.accessToken)
  setRefreshToken(data.refreshToken)
  return data
}

export async function register(
  email: string,
  userName: string,
  password: string,
): Promise<AuthResponseDTO> {
  const { data } = await http.post<AuthResponseDTO>('/api/Auth/register', {
    email,
    userName,
    password,
  })
  setAccessToken(data.accessToken)
  setRefreshToken(data.refreshToken)
  return data
}

/** Revokes refresh token(s) on the server; clears local tokens. */
export async function logoutSingleSession(): Promise<void> {
  const refresh = localStorage.getItem(REFRESH_KEY)
  try {
    await http.post('/api/Auth/logout', { refreshToken: refresh ?? undefined })
  } finally {
    clearAuth()
  }
}

export async function logoutAllSessions(): Promise<void> {
  try {
    await http.post('/api/Auth/logout', {})
  } finally {
    clearAuth()
  }
}
