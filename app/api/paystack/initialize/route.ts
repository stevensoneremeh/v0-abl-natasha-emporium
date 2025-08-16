import { type NextRequest, NextResponse } from "next/server"
import { generatePaymentReference } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, metadata, callback_url } = body

    // Validate required fields
    if (!email || !amount) {
      return NextResponse.json({ status: false, message: "Email and amount are required" }, { status: 400 })
    }

    // Generate reference if not provided
    const reference = body.reference || generatePaymentReference()

    const paystackData = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      currency: "NGN",
      reference,
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/callback`,
      metadata: {
        ...metadata,
        cancel_action: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
      },
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackData),
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: result.message || "Payment initialization failed" },
        { status: response.status },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Paystack initialization error:", error)
    return NextResponse.json({ status: false, message: "Internal server error" }, { status: 500 })
  }
}
