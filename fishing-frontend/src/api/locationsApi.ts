import { http } from './http'
import type { FishingLocationDTO } from './types'

export async function fetchLocations(): Promise<FishingLocationDTO[]> {
  const { data } = await http.get<FishingLocationDTO[]>('/api/Locations')
  return data
}
