import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

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

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        total_amount,
        created_at,
        order_items(count)
      `)
      .eq("user_id", params.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error

    // Transform the data to include items count
    const transformedOrders = orders.map((order) => ({
      ...order,
      items_count: order.order_items?.[0]?.count || 0,
    }))

    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
