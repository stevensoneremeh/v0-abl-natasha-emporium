"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/types/database"
import { toast } from "sonner"

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("abl-wishlist")
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist))
        } catch (error) {
          console.error("Error loading wishlist:", error)
          localStorage.removeItem("abl-wishlist")
        }
      }
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("abl-wishlist", JSON.stringify(items))
    }
  }, [items])

  const addItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        toast.info("Item already in wishlist")
        return prev
      }
      toast.success("Added to wishlist")
      return [...prev, product]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== productId)
      toast.success("Removed from wishlist")
      return filtered
    })
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setItems([])
    toast.success("Wishlist cleared")
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
