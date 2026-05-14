"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type CartItem = {
  slug: string
  name: string
  image: string
  price: number
  quantity: number
  variants: Record<string, string>
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (item: CartItem) => void
  remove: (slug: string, variants: Record<string, string>) => void
  updateQuantity: (slug: string, variants: Record<string, string>, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "atelier-nori:cart"

function sameVariants(a: Record<string, string>, b: Record<string, string>) {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  return ak.every((k) => a[k] === b[k])
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = items.reduce((acc, i) => acc + i.quantity * i.price, 0)
    return {
      items,
      count,
      subtotal,
      add: (item) =>
        setItems((prev) => {
          const existing = prev.findIndex(
            (p) => p.slug === item.slug && sameVariants(p.variants, item.variants),
          )
          if (existing >= 0) {
            const next = [...prev]
            next[existing] = { ...next[existing], quantity: next[existing].quantity + item.quantity }
            return next
          }
          return [...prev, item]
        }),
      remove: (slug, variants) =>
        setItems((prev) => prev.filter((p) => !(p.slug === slug && sameVariants(p.variants, variants)))),
      updateQuantity: (slug, variants, quantity) =>
        setItems((prev) =>
          prev
            .map((p) =>
              p.slug === slug && sameVariants(p.variants, variants) ? { ...p, quantity } : p,
            )
            .filter((p) => p.quantity > 0),
        ),
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
