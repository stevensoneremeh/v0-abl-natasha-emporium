import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { CartItem } from "@/lib/cart"

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

export async function addToCartServer(userId: string, productId: string, quantity = 1) {
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
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)
      .select()
      .single()

    return { data, error }
  } else {
    // Add new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
      })
      .select()
      .single()

    return { data, error }
  }
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
  const { userId, items, shippingInfo, billingInfo, paymentMethod, notes } = orderData

  // Assuming order creation logic is handled here
  const { data: order, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        items: items,
        shipping_info: shippingInfo,
        billing_info: billingInfo,
        payment_method: paymentMethod,
        notes: notes,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating order:", error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
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

  const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

  if (error) {
    console.error("Error updating order payment status:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
