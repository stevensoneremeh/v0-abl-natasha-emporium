"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { CartManager, type CartItem } from "@/lib/cart"
import type { Product } from "@/lib/database"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  isLoading: boolean
  addItem: (product: Product, quantity?: number) => void
  updateItem: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Load cart on mount
  useEffect(() => {
    const loadCart = () => {
      const cartItems = CartManager.getGuestCart()
      setItems(cartItems)
      setIsLoading(false)
    }

    loadCart()
  }, [])

  // Calculate derived values
  const itemCount = CartManager.getCartItemCount(items)
  const total = CartManager.getCartTotal(items)

  const addItem = useCallback((product: Product, quantity = 1) => {
    CartManager.addToGuestCart(product, quantity)
    setItems(CartManager.getGuestCart())
  }, [])

  const updateItem = useCallback((productId: string, quantity: number) => {
    CartManager.updateGuestCartItem(productId, quantity)
    setItems(CartManager.getGuestCart())
  }, [])

  const removeItem = useCallback((productId: string) => {
    CartManager.removeFromGuestCart(productId)
    setItems(CartManager.getGuestCart())
  }, [])

  const clearCart = useCallback(() => {
    CartManager.clearGuestCart()
    setItems([])
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value: CartContextType = {
    items,
    itemCount,
    total,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
