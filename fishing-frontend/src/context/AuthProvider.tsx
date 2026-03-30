import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser } from '../api/usersApi'
import { getAccessToken } from '../api/http'
import { clearAuth, logoutSingleSession } from '../api/authApi'
import type { UserDTO } from '../api/types'

type AuthContextValue = {
  user: UserDTO | null
  loading: boolean
  refresh: () => Promise<UserDTO | null>
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
      return null
    }

    try {
      const me = await fetchCurrentUser()
      if (!me) {
        clearAuth()
        setUser(null)
        return null
      }
      setUser(me)
      return me
    } catch {
      clearAuth()
      setUser(null)
      return null
    }
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
