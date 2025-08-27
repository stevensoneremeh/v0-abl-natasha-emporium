import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: inventory, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        sku,
        stock_quantity,
        low_stock_threshold,
        price,
        categories(name),
        updated_at
      `)
      .order("name")

    if (error) throw error

    const formattedInventory = inventory?.map((item) => ({
      ...item,
      category: item.categories?.name || "Uncategorized",
      last_updated: item.updated_at,
    }))

    return NextResponse.json({ inventory: formattedInventory })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { productId, adjustment } = await request.json()
    const supabase = createServerClient()

    // Get current stock
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", productId)
      .single()

    if (fetchError) throw fetchError

    const newStock = Math.max(0, (product.stock_quantity || 0) + adjustment)

    // Update stock
    const { error: updateError } = await supabase
      .from("products")
      .update({
        stock_quantity: newStock,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)

    if (updateError) throw updateError

    // Log inventory adjustment
    await supabase.from("inventory_adjustments").insert({
      product_id: productId,
      adjustment,
      previous_stock: product.stock_quantity,
      new_stock: newStock,
      reason: "Manual adjustment",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
