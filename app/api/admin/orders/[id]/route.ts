import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  tracking_number: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    if (!adminEmails.includes(user.email!)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          id,
          product_id,
          product_name,
          product_image,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    // Transform the data to match expected structure
    const transformedOrder = {
      ...order,
      items: order.order_items || [],
    }

    return NextResponse.json(transformedOrder)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    if (!adminEmails.includes(user.email!)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = orderUpdateSchema.parse(body)

    // Add timestamp fields based on status changes
    const updateData: any = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    }

    if (validatedData.status === "shipped" && !updateData.shipped_at) {
      updateData.shipped_at = new Date().toISOString()
    }

    if (validatedData.status === "delivered" && !updateData.delivered_at) {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", params.id)
      .select(`
        *,
        order_items(
          id,
          product_id,
          product_name,
          product_image,
          quantity,
          unit_price,
          total_price
        )
      `)
      .single()

    if (error) throw error

    // Transform the data to match expected structure
    const transformedOrder = {
      ...order,
      items: order.order_items || [],
    }

    return NextResponse.json(transformedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
