/** View model for product cards and detail (includes UI-only fields). */
export type Product = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  image: string
  category: string
}
