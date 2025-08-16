import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const supabase = createClient()
    const { orderNumber } = params

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            images
          )
        )
      `)
      .eq("order_number", orderNumber)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
