import axios from 'axios'
import { http } from './http'
import type { UserDTO } from './types'

export async function fetchCurrentUser(): Promise<UserDTO | null> {
  try {
    const { data } = await http.get<UserDTO>('/api/Users/me')
    return data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 401) return null
    throw e
  }
}
