import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { WishlistContext } from './wishlistContext'
import type { WishlistItem } from './wishlistTypes'

const STORAGE_KEY = 'sd:wishlist:v1'

function loadInitial(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as WishlistItem[]
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const has = useCallback((id: number) => items.some((x) => x.id === id), [items])

  const add = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((x) => x.id === product.id)) return prev
      return [...prev, product]
    })
  }, [])

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const toggle = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((x) => x.id === product.id)
      if (exists) return prev.filter((x) => x.id !== product.id)
      return [...prev, product]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItems = useMemo(() => items.length, [items])

  const value = useMemo(
    () => ({
      items,
      totalItems,
      has,
      add,
      remove,
      toggle,
      clear,
    }),
    [items, totalItems, has, add, remove, toggle, clear],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
