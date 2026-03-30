import type { Product } from '../types/product'

export type WishlistItem = Product

export type WishlistContextValue = {
  items: WishlistItem[]
  totalItems: number
  has: (id: number) => boolean
  add: (product: WishlistItem) => void
  remove: (id: number) => void
  toggle: (product: WishlistItem) => void
  clear: () => void
}
