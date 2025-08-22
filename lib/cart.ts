import type { Product } from "@/lib/database"

export interface CartItem {
  id: string
  user_id: string | null
  product_id: string
  quantity: number
  price: number
  created_at: string
  updated_at: string
  products?: Product
}

export interface Order {
  id: string
  user_id: string | null
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string | null
  payment_reference: string | null
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  currency: string
  shipping_name: string
  shipping_email: string
  shipping_phone: string | null
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal_code: string | null
  billing_name: string
  billing_email: string
  billing_phone: string | null
  billing_address: string
  billing_city: string
  billing_country: string
  billing_postal_code: string | null
  notes: string | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export async function createOrder(orderData: {
  userId?: string
  items: CartItem[]
  shippingInfo: {
    name: string
    email: string
    phone?: string
    address: string
    city: string
    country: string
    postalCode?: string
  }
  billingInfo: {
    name: string
    email: string
    phone?: string
    address: string
    city: string
    country: string
    postalCode?: string
  }
  paymentMethod?: string
  notes?: string
}): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
  try {
    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error("Failed to create order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  paymentReference?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/orders/update-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        paymentStatus,
        paymentReference,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update payment status")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating payment status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Cart operations (for guest users, we'll use localStorage)
export class CartManager {
  private static STORAGE_KEY = "abl_cart"

  static getGuestCart(): CartItem[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static setGuestCart(items: CartItem[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }

  static addToGuestCart(product: Product, quantity = 1): void {
    const cart = this.getGuestCart()
    const existingItem = cart.find((item) => item.product_id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.updated_at = new Date().toISOString()
    } else {
      const newItem: CartItem = {
        id: `guest_${Date.now()}_${product.id}`,
        user_id: null,
        product_id: product.id,
        quantity,
        price: product.price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        products: product,
      }
      cart.push(newItem)
    }

    this.setGuestCart(cart)
  }

  static updateGuestCartItem(productId: string, quantity: number): void {
    const cart = this.getGuestCart()
    const item = cart.find((item) => item.product_id === productId)

    if (item) {
      if (quantity <= 0) {
        this.removeFromGuestCart(productId)
      } else {
        item.quantity = quantity
        item.updated_at = new Date().toISOString()
        this.setGuestCart(cart)
      }
    }
  }

  static removeFromGuestCart(productId: string): void {
    const cart = this.getGuestCart()
    const filteredCart = cart.filter((item) => item.product_id !== productId)
    this.setGuestCart(filteredCart)
  }

  static clearGuestCart(): void {
    this.setGuestCart([])
  }

  static getCartTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  static getCartItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0)
  }
}
