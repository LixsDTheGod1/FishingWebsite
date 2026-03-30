import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser } from '../api/usersApi'
import { getAccessToken } from '../api/http'
import { logoutSingleSession } from '../api/authApi'
import type { UserDTO } from '../api/types'

type AuthContextValue = {
  user: UserDTO | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      return
    }

    const me = await fetchCurrentUser()
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await logoutSingleSession()
    setUser(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refresh()
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        refresh().catch(() => {})
      }
    }

    window.addEventListener('storage', onStorage)
    return () => {
      cancelled = true
      window.removeEventListener('storage', onStorage)
    }
  }, [refresh])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refresh,
      logout,
    }),
    [user, loading, refresh, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
