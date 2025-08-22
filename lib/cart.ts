import type { Product } from "@/lib/database"
import { createClient } from "@/lib/supabase/server"

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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export async function createOrder(orderData: {
  user_id?: string | null
  shipping_name: string
  shipping_email: string
  shipping_phone?: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal_code?: string
  billing_name: string
  billing_email: string
  billing_phone?: string
  billing_address: string
  billing_city: string
  billing_country: string
  billing_postal_code?: string
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
  }>
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  total_amount: number
  notes?: string
}): Promise<{ order: Order; error?: string }> {
  try {
    const supabase = createClient()

    // Generate order number
    const orderNumber = `ABL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id || null,
        order_number: orderNumber,
        status: "pending",
        payment_status: "pending",
        subtotal: orderData.subtotal,
        tax_amount: orderData.tax_amount || 0,
        shipping_amount: orderData.shipping_amount || 0,
        total_amount: orderData.total_amount,
        currency: "NGN",
        shipping_name: orderData.shipping_name,
        shipping_email: orderData.shipping_email,
        shipping_phone: orderData.shipping_phone,
        shipping_address: orderData.shipping_address,
        shipping_city: orderData.shipping_city,
        shipping_country: orderData.shipping_country,
        shipping_postal_code: orderData.shipping_postal_code,
        billing_name: orderData.billing_name,
        billing_email: orderData.billing_email,
        billing_phone: orderData.billing_phone,
        billing_address: orderData.billing_address,
        billing_city: orderData.billing_city,
        billing_country: orderData.billing_country,
        billing_postal_code: orderData.billing_postal_code,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      return { order: {} as Order, error: orderError.message }
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      return { order: {} as Order, error: itemsError.message }
    }

    return { order }
  } catch (error) {
    return { order: {} as Order, error: "Failed to create order" }
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  paymentReference?: string,
  paymentMethod?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const updateData: any = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    }

    if (paymentReference) {
      updateData.payment_reference = paymentReference
    }

    if (paymentMethod) {
      updateData.payment_method = paymentMethod
    }

    // Update order status based on payment status
    if (paymentStatus === "paid") {
      updateData.status = "processing"
    } else if (paymentStatus === "failed") {
      updateData.status = "cancelled"
    }

    const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update payment status" }
  }
}
