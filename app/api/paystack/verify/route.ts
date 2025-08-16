import { type NextRequest, NextResponse } from "next/server"
import { updateOrderPaymentStatus } from "@/lib/cart"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ status: false, message: "Payment reference is required" }, { status: 400 })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: result.message || "Payment verification failed" },
        { status: response.status },
      )
    }

    // If payment was successful, update the order status
    if (result.status && result.data?.status === "success") {
      const orderNumber = result.data.metadata?.order_number
      if (orderNumber) {
        await updateOrderPaymentStatus(orderNumber, "completed", reference)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Paystack verification error:", error)
    return NextResponse.json({ status: false, message: "Internal server error" }, { status: 500 })
  }
}
