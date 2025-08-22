import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          images,
          stock_quantity
        )
      `)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }

    return NextResponse.json({ items: cartItems || [] })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)

      if (updateError) {
        console.error("Error updating cart item:", updateError)
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        price: product.price,
      })

      if (insertError) {
        console.error("Error adding to cart:", insertError)
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
      }
    }

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          images,
          stock_quantity
        )
      `)
      .eq("user_id", user.id)

    return NextResponse.json({ items: cartItems || [] })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    if (!productId || quantity < 0) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 })
    }

    if (quantity === 0) {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId)

      if (error) {
        console.error("Error removing cart item:", error)
        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("product_id", productId)

      if (error) {
        console.error("Error updating cart item:", error)
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
      }
    }

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          images,
          stock_quantity
        )
      `)
      .eq("user_id", user.id)

    return NextResponse.json({ items: cartItems || [] })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.text()

    if (body) {
      const { productId } = JSON.parse(body)
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId)

      if (error) {
        console.error("Error removing cart item:", error)
        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
      }
    } else {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) {
        console.error("Error clearing cart:", error)
        return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
      }
    }

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          images,
          stock_quantity
        )
      `)
      .eq("user_id", user.id)

    return NextResponse.json({ items: cartItems || [] })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
