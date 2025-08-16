import { createClient } from "@/lib/supabase/server"
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
  delivered_at: string | null
  created_at: string
  updated_at: string
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

// Server-side cart operations (for authenticated users)
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (
        id,
        name,
        slug,
        price,
        images,
        stock_quantity,
        is_active
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cart items:", error)
    return []
  }

  return data || []
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1,
  price: number,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    // Add new item
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity,
      price,
    })

    if (error) {
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function updateCartItem(
  cartItemId: string,
  quantity: number,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  if (quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartItemId)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function removeFromCart(cartItemId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function clearCart(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
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
  const supabase = createClient()

  // Calculate totals
  const subtotal = CartManager.getCartTotal(orderData.items)
  const taxAmount = subtotal * 0.075 // 7.5% VAT
  const shippingAmount = subtotal >= 50000 ? 0 : 2500 // Free shipping over ₦50,000
  const totalAmount = subtotal + taxAmount + shippingAmount

  // Generate order number
  const orderNumber = `ABL${Date.now().toString().slice(-8)}`

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.userId || null,
        order_number: orderNumber,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        currency: "NGN",
        payment_method: orderData.paymentMethod,
        shipping_name: orderData.shippingInfo.name,
        shipping_email: orderData.shippingInfo.email,
        shipping_phone: orderData.shippingInfo.phone,
        shipping_address: orderData.shippingInfo.address,
        shipping_city: orderData.shippingInfo.city,
        shipping_country: orderData.shippingInfo.country,
        shipping_postal_code: orderData.shippingInfo.postalCode,
        billing_name: orderData.billingInfo.name,
        billing_email: orderData.billingInfo.email,
        billing_phone: orderData.billingInfo.phone,
        billing_address: orderData.billingInfo.address,
        billing_city: orderData.billingInfo.city,
        billing_country: orderData.billingInfo.country,
        billing_postal_code: orderData.billingInfo.postalCode,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(orderError.message)
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products?.name || "Unknown Product",
      product_sku: item.products?.sku,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw new Error(itemsError.message)
    }

    // Clear cart for authenticated users
    if (orderData.userId) {
      await clearCart(orderData.userId)
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    }
  }
}

export async function updateOrderPaymentStatus(
  orderNumber: string,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  paymentReference?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const updateData: any = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  }

  if (paymentReference) {
    updateData.payment_reference = paymentReference
  }

  if (paymentStatus === "paid") {
    updateData.status = "processing"
  }

  const { error } = await supabase.from("orders").update(updateData).eq("order_number", orderNumber)

  if (error) {
    console.error("Error updating order payment status:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}
