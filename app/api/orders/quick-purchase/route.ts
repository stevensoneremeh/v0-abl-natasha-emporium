import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { items, paymentMethod = "paystack", quickPurchase = false } = body

    // Get user if authenticated, otherwise create guest order
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items provided" }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const taxAmount = subtotal * 0.075
    const shippingAmount = subtotal >= 50000 ? 0 : 2500
    const totalAmount = subtotal + taxAmount + shippingAmount

    // Generate order number
    const orderNumber = `ABL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order with minimal info for quick purchase
    const orderData = {
      user_id: user?.id || null,
      order_number: orderNumber,
      status: "pending",
      payment_status: "pending",
      payment_method: paymentMethod,
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      currency: "NGN",
      // Use placeholder data for quick purchase - will be updated after payment
      shipping_name: user?.user_metadata?.full_name || "Quick Purchase Customer",
      shipping_email: user?.email || `guest_${Date.now()}@ablnatasha.com`,
      shipping_phone: null,
      shipping_address: "To be provided",
      shipping_city: "Lagos",
      shipping_country: "Nigeria",
      shipping_postal_code: null,
      billing_name: user?.user_metadata?.full_name || "Quick Purchase Customer",
      billing_email: user?.email || `guest_${Date.now()}@ablnatasha.com`,
      billing_phone: null,
      billing_address: "To be provided",
      billing_city: "Lagos",
      billing_country: "Nigeria",
      billing_postal_code: null,
      notes: quickPurchase ? "Quick purchase - customer details to be collected" : null,
    }

    const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products?.name || "Unknown Product",
      product_sku: item.products?.sku || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to clean up the order
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ success: false, error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      totalAmount,
    })
  } catch (error) {
    console.error("Quick purchase API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
