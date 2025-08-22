import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/cart"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await createOrder(body)

    if (result.success) {
      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
