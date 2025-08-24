import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/database"
import type { Order } from "@/lib/cart"
import type { RealEstateBooking } from "@/lib/types/real-estate"

export interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalBookings: number
  totalRevenue: number
  pendingOrders: number
  pendingBookings: number
  lowStockProducts: number
  recentOrders: Order[]
  recentBookings: RealEstateBooking[]
  topProducts: (Product & { order_count: number })[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient()

  try {
    // Get total counts
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalBookings },
      { data: orders },
      { data: bookings },
      { data: lowStockProducts },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("real_estate_bookings").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(5),
      supabase.from("real_estate_bookings").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("products").select("*").lte("stock_quantity", 5).eq("is_active", true).limit(10),
    ])

    // Calculate revenue and pending counts
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
    const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
    const pendingBookings = bookings?.filter((booking) => booking.status === "pending").length || 0

    // Get top products (this would need a more complex query in production)
    const topProducts: (Product & { order_count: number })[] = []

    return {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalBookings: totalBookings || 0,
      totalRevenue,
      pendingOrders,
      pendingBookings,
      lowStockProducts: lowStockProducts?.length || 0,
      recentOrders: orders || [],
      recentBookings: bookings || [],
      topProducts,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalBookings: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      pendingBookings: 0,
      lowStockProducts: 0,
      recentOrders: [],
      recentBookings: [],
      topProducts: [],
    }
  }
}

export async function getAllOrders(
  options: {
    limit?: number
    offset?: number
    status?: string
  } = {},
): Promise<Order[]> {
  const supabase = createClient()

  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *
      )
    `)
    .order("created_at", { ascending: false })

  if (options.status) {
    query = query.eq("status", options.status)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data || []
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  trackingNumber?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "shipped" && trackingNumber) {
    updateData.tracking_number = trackingNumber
    updateData.shipped_at = new Date().toISOString()
  }

  if (status === "delivered") {
    updateData.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getAllBookings(
  options: {
    limit?: number
    offset?: number
    status?: string
  } = {},
): Promise<RealEstateBooking[]> {
  const supabase = createClient()

  let query = supabase
    .from("real_estate_bookings")
    .select(`
      *,
      real_estate_properties (
        *,
        products (
          name,
          slug
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (options.status) {
    query = query.eq("status", options.status)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

export async function updateBookingStatus(
  bookingId: string,
  status: RealEstateBooking["status"],
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from("real_estate_bookings")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function createProduct(productData: {
  categoryId: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  sku?: string
  stockQuantity: number
  images: string[]
  features: string[]
  isFeatured: boolean
}): Promise<{ success: boolean; productId?: string; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: productData.categoryId,
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      short_description: productData.shortDescription,
      price: productData.price,
      compare_at_price: productData.compareAtPrice,
      sku: productData.sku,
      stock_quantity: productData.stockQuantity,
      images: productData.images,
      features: productData.features,
      is_featured: productData.isFeatured,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, productId: data.id }
}

export async function updateProduct(
  productId: string,
  productData: Partial<{
    categoryId: string
    name: string
    slug: string
    description: string
    shortDescription: string
    price: number
    compareAtPrice: number
    sku: string
    stockQuantity: number
    images: string[]
    features: string[]
    isFeatured: boolean
    isActive: boolean
  }>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId
  if (productData.name !== undefined) updateData.name = productData.name
  if (productData.slug !== undefined) updateData.slug = productData.slug
  if (productData.description !== undefined) updateData.description = productData.description
  if (productData.shortDescription !== undefined) updateData.short_description = productData.shortDescription
  if (productData.price !== undefined) updateData.price = productData.price
  if (productData.compareAtPrice !== undefined) updateData.compare_at_price = productData.compareAtPrice
  if (productData.sku !== undefined) updateData.sku = productData.sku
  if (productData.stockQuantity !== undefined) updateData.stock_quantity = productData.stockQuantity
  if (productData.images !== undefined) updateData.images = productData.images
  if (productData.features !== undefined) updateData.features = productData.features
  if (productData.isFeatured !== undefined) updateData.is_featured = productData.isFeatured
  if (productData.isActive !== undefined) updateData.is_active = productData.isActive

  const { error } = await supabase.from("products").update(updateData).eq("id", productId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // Soft delete by setting is_active to false
  const { error } = await supabase
    .from("products")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}
