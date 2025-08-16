import { createClient } from "@/lib/supabase/server"

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  sku: string | null
  inventory_quantity: number
  low_stock_threshold: number
  weight: number | null
  dimensions: string | null
  product_images: Array<{ id: string; image_url: string; alt_text?: string; sort_order: number }>
  tags: string[]
  specifications: Record<string, any>
  featured: boolean
  status: string
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  categories?: Category
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data
}

export async function getProductsByCategory(
  categoryId: string,
  options: {
    limit?: number
    offset?: number
    sortBy?: "name" | "price" | "created_at"
    sortOrder?: "asc" | "desc"
    featured?: boolean
  } = {},
): Promise<Product[]> {
  const supabase = createClient()

  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      )
    `)
    .eq("category_id", categoryId)
    .eq("status", "active")

  if (options.featured !== undefined) {
    query = query.eq("featured", options.featured)
  }

  if (options.sortBy) {
    query = query.order(options.sortBy, {
      ascending: options.sortOrder === "asc",
    })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      )
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      )
    `)
    .eq("featured", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return data || []
}

export async function searchProducts(
  query: string,
  options: {
    categoryId?: string
    limit?: number
    offset?: number
  } = {},
): Promise<Product[]> {
  const supabase = createClient()

  let dbQuery = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      )
    `)
    .eq("status", "active")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)

  if (options.categoryId) {
    dbQuery = dbQuery.eq("category_id", options.categoryId)
  }

  if (options.limit) {
    dbQuery = dbQuery.limit(options.limit)
  }

  if (options.offset) {
    dbQuery = dbQuery.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error("Error searching products:", error)
    return []
  }

  return data || []
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}
