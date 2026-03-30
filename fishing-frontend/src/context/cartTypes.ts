export type CartLine = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export type CartContextValue = {
  items: CartLine[]
  addItem: (item: Omit<CartLine, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: number) => void
  setQuantity: (id: number, quantity: number) => void
  clear: () => void
  totalItems: number
  subtotal: number
}
