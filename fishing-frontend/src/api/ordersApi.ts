import { http } from './http'
import type { OrderDTO } from './types'

export type CreateOrderItemInput = {
  productId: number
  quantity: number
}

export type CreateOrderInput = {
  items: CreateOrderItemInput[]
  status?: string | null
  customerName?: string | null
  phone?: string | null
  city?: string | null
}

export async function fetchMyOrders(): Promise<OrderDTO[]> {
  const { data } = await http.get<OrderDTO[]>('/api/Orders')
  return data
}

export async function fetchAllOrders(): Promise<OrderDTO[]> {
  const { data } = await http.get<OrderDTO[]>('/api/Orders/all')
  return data
}

export async function createOrder(input: CreateOrderInput): Promise<OrderDTO> {
  const { data } = await http.post<OrderDTO>('/api/Orders', input)
  return data
}
