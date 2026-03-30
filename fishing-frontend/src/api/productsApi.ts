import axios from 'axios'
import { http } from './http'
import type { ProductDTO } from './types'

export async function fetchProducts(): Promise<ProductDTO[]> {
  const { data } = await http.get<ProductDTO[]>('/api/Products')
  return data
}

export async function fetchProductById(id: number): Promise<ProductDTO | null> {
  try {
    const { data } = await http.get<ProductDTO>(`/api/Products/${id}`)
    return data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) return null
    throw e
  }
}

export type UpsertProductInput = {
  name: string
  category: string
  description: string | null
  imageUrl: string | null
  price: number
  stockQuantity: number
}

export async function createProduct(input: UpsertProductInput): Promise<ProductDTO> {
  const { data } = await http.post<ProductDTO>('/api/Products', input)
  return data
}

export async function updateProduct(id: number, input: UpsertProductInput): Promise<ProductDTO> {
  const { data } = await http.put<ProductDTO>(`/api/Products/${id}`, input)
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  await http.delete(`/api/Products/${id}`)
}
