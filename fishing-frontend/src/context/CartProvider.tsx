import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CartContext } from './cartContext'
import type { CartLine } from './cartTypes'

const STORAGE_KEY = 'fishing-cart'

function loadInitial(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback(
    (item: Omit<CartLine, 'quantity'> & { quantity?: number }) => {
      const qty = item.quantity ?? 1
      setItems((prev) => {
        const i = prev.findIndex((x) => x.id === item.id)
        if (i === -1) {
          return [...prev, { ...item, quantity: qty }]
        }
        const next = [...prev]
        next[i] = { ...next[i], quantity: next[i].quantity + qty }
        return next
      })
    },
    [],
  )

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const setQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((x) => x.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity } : x)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((s, x) => s + x.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.price * x.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalItems,
      subtotal,
    }),
    [items, addItem, removeItem, setQuantity, clear, totalItems, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
