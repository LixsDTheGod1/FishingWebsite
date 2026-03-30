import { http } from './http'
import type {
  EventParticipantDTO,
  FishingEventDTO,
  MyEventRegistrationDTO,
  SignupTicketDTO,
} from './types'

export async function fetchEvents(): Promise<FishingEventDTO[]> {
  const { data } = await http.get<FishingEventDTO[]>('/api/FishingEvents')
  return data
}

export async function fetchMyEvents(): Promise<FishingEventDTO[]> {
  const { data } = await http.get<FishingEventDTO[]>('/api/FishingEvents/my')
  return data
}

export async function fetchMyRegistrations(): Promise<MyEventRegistrationDTO[]> {
  const { data } = await http.get<MyEventRegistrationDTO[]>('/api/FishingEvents/my/registrations')
  return data
}

export async function signupForEvent(eventId: number): Promise<SignupTicketDTO> {
  const { data } = await http.post<SignupTicketDTO>(`/api/FishingEvents/${eventId}/signup`)
  return data
}

export type UpsertFishingEventInput = {
  title: string
  description: string | null
  fullDescription: string | null
  imageUrl: string | null
  type: 'Express' | 'Adventure'
  nights: number
  location: string
  totalPrice: number
  capacity: number
  occupiedSeats: number
  guideRating: number
}

export async function createFishingEvent(input: UpsertFishingEventInput): Promise<FishingEventDTO> {
  const { data } = await http.post<FishingEventDTO>('/api/FishingEvents', input)
  return data
}

export async function updateFishingEvent(id: number, input: UpsertFishingEventInput): Promise<FishingEventDTO> {
  const { data } = await http.put<FishingEventDTO>(`/api/FishingEvents/${id}`, input)
  return data
}

export async function deleteFishingEvent(id: number): Promise<void> {
  await http.delete(`/api/FishingEvents/${id}`)
}

export async function fetchEventParticipants(eventId: number): Promise<EventParticipantDTO[]> {
  const { data } = await http.get<EventParticipantDTO[]>(`/api/FishingEvents/${eventId}/participants`)
  return data
}

export async function deleteEventRegistration(registrationId: number): Promise<void> {
  await http.delete(`/api/FishingEvents/registrations/${registrationId}`)
}
