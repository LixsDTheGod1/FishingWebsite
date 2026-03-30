/** Matches ASP.NET Core JSON (camelCase) for ProductDTO */
export type ProductDTO = {
  id: number
  name: string
  category: string
  description: string | null
  imageUrl: string | null
  price: number
  stockQuantity: number
  createdAtUtc: string
}

export type SignupTicketDTO = {
  registrationId: number
  userName: string
  eventTitle: string
}

export type MyEventRegistrationDTO = {
  registrationId: number
  event: FishingEventDTO
}

/** Matches BlogPostResponse from API */
export type BlogPostDTO = {
  id: number
  title: string
  slug: string | null
  content: string
  authorId: number
  authorName: string
  publishedAtUtc: string | null
}

export type AuthResponseDTO = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: number
  email: string
  userName: string
}

export type UserDTO = {
  id: number
  email: string
  userName: string
  role: string
  createdAtUtc: string
}

export type UserPublicDTO = {
  id: number
  userName: string
}

export type EventParticipantDTO = {
  registrationId: number
  userId: number
  userName: string
}

export type FishingLocationDTO = {
  id: number
  name: string
  description: string | null
  latitude: number
  longitude: number
  region: string | null
  locationType: string | null
  createdAtUtc: string
}

export type FishingEventTypeDTO = 'Express' | 'Adventure'

export type FishingEventDTO = {
  id: number
  title: string
  description: string | null
  fullDescription: string | null
  imageUrl: string | null
  type: FishingEventTypeDTO
  nights: number
  location: string
  totalPrice: number
  capacity: number
  occupiedSeats: number
  remainingSeats: number
  guideRating: number
  createdAtUtc: string
}

export type OrderItemDTO = {
  id: number
  productId: number
  productName: string
  unitPrice: number
  quantity: number
}

export type OrderDTO = {
  id: number
  userId: number
  userEmail: string | null
  userName: string | null
  orderDateUtc: string
  totalAmount: number
  status: string
  customerName: string | null
  phone: string | null
  city: string | null
  items: OrderItemDTO[]
}
