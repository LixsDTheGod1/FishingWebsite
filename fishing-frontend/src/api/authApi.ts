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

function normalizeAuthResponse(data: unknown): AuthResponseDTO {
  const obj = data as Partial<AuthResponseDTO> &
    Partial<{
      AccessToken: string
      RefreshToken: string
      TokenType: string
      ExpiresIn: number
      UserId: number
      Email: string
      UserName: string
    }>

  const accessToken = obj.accessToken ?? obj.AccessToken
  const refreshToken = obj.refreshToken ?? obj.RefreshToken

  return {
    accessToken: accessToken ?? '',
    refreshToken: refreshToken ?? '',
    tokenType: obj.tokenType ?? obj.TokenType ?? 'Bearer',
    expiresIn: obj.expiresIn ?? obj.ExpiresIn ?? 0,
    userId: obj.userId ?? obj.UserId ?? 0,
    email: obj.email ?? obj.Email ?? '',
    userName: obj.userName ?? obj.UserName ?? '',
  }
}

export async function login(email: string, password: string): Promise<AuthResponseDTO> {
  const { data } = await http.post<AuthResponseDTO>('/api/Auth/login', { email, password })
  const normalized = normalizeAuthResponse(data)
  setAccessToken(normalized.accessToken)
  setRefreshToken(normalized.refreshToken)
  return normalized
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
  const normalized = normalizeAuthResponse(data)
  setAccessToken(normalized.accessToken)
  setRefreshToken(normalized.refreshToken)
  return normalized
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
