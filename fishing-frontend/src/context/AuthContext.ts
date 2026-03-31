import { createContext } from 'react'
import type { UserDTO } from '../api/types'

export type AuthContextValue = {
  user: UserDTO | null
  loading: boolean
  refresh: () => Promise<UserDTO | null>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
