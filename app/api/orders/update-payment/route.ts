import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { orderNumber, paymentReference, paymentStatus, transactionId } = body

    if (!orderNumber || !paymentReference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update order payment status
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        payment_reference: paymentReference,
        payment_status: paymentStatus || "completed",
        transaction_id: transactionId,
        status: paymentStatus === "completed" ? "processing" : "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber)
      .select()
      .single()

    if (error) {
      console.error("Error updating order payment:", error)
      return NextResponse.json({ error: "Failed to update order payment" }, { status: 500 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error in update payment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
