"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { CartManager, type CartItem } from "@/lib/cart"
import type { Product } from "@/lib/database"
import { useAuth } from "@/lib/auth-context"

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
  const { user, guestId, isAuthenticated } = useAuth()

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isAuthenticated && user) {
          // Load authenticated user cart from database
          const response = await fetch("/api/cart")
          if (response.ok) {
            const data = await response.json()
            setItems(data.items || [])
          }
        } else if (guestId) {
          // Load guest cart from localStorage
          const cartItems = CartManager.getGuestCart()
          setItems(cartItems)
        }
      } catch (error) {
        console.error("Failed to load cart:", error)
        // Fallback to guest cart
        const cartItems = CartManager.getGuestCart()
        setItems(cartItems)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [isAuthenticated, user, guestId])

  // Calculate derived values
  const itemCount = CartManager.getCartItemCount(items)
  const total = CartManager.getCartTotal(items)

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      try {
        if (isAuthenticated && user) {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id, quantity }),
          })
          if (response.ok) {
            const data = await response.json()
            setItems(data.items)
          }
        } else {
          CartManager.addToGuestCart(product, quantity)
          setItems(CartManager.getGuestCart())
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error)
        // Fallback to guest cart
        CartManager.addToGuestCart(product, quantity)
        setItems(CartManager.getGuestCart())
      }
    },
    [isAuthenticated, user],
  )

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        if (isAuthenticated && user) {
          const response = await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          })
          if (response.ok) {
            const data = await response.json()
            setItems(data.items)
          }
        } else {
          CartManager.updateGuestCartItem(productId, quantity)
          setItems(CartManager.getGuestCart())
        }
      } catch (error) {
        console.error("Failed to update cart item:", error)
        // Fallback to guest cart
        CartManager.updateGuestCartItem(productId, quantity)
        setItems(CartManager.getGuestCart())
      }
    },
    [isAuthenticated, user],
  )

  const removeItem = useCallback(
    async (productId: string) => {
      try {
        if (isAuthenticated && user) {
          const response = await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          })
          if (response.ok) {
            const data = await response.json()
            setItems(data.items)
          }
        } else {
          CartManager.removeFromGuestCart(productId)
          setItems(CartManager.getGuestCart())
        }
      } catch (error) {
        console.error("Failed to remove cart item:", error)
        // Fallback to guest cart
        CartManager.removeFromGuestCart(productId)
        setItems(CartManager.getGuestCart())
      }
    },
    [isAuthenticated, user],
  )

  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated && user) {
        await fetch("/api/cart", { method: "DELETE" })
      }
      CartManager.clearGuestCart()
      setItems([])
    } catch (error) {
      console.error("Failed to clear cart:", error)
      // Fallback to clearing guest cart
      CartManager.clearGuestCart()
      setItems([])
    }
  }, [isAuthenticated, user])

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
