import type { Product, Category } from "@/lib/database"

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${slug}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Failed to fetch product")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
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
  try {
    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())
    if (options.sortBy) params.append("sortBy", options.sortBy)
    if (options.sortOrder) params.append("sortOrder", options.sortOrder)
    if (options.featured !== undefined) params.append("featured", options.featured.toString())

    const response = await fetch(`/api/categories/${categoryId}/products?${params}`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories")
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories/slug/${slug}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Failed to fetch category")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products/featured?limit=${limit}`)
    if (!response.ok) {
      throw new Error("Failed to fetch featured products")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function searchProducts(
  query: string,
  options: {
    categoryId?: string
    limit?: number
    offset?: number
  } = {},
): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ query })
    if (options.categoryId) params.append("categoryId", options.categoryId)
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())

    const response = await fetch(`/api/products/search?${params}`)
    if (!response.ok) {
      throw new Error("Failed to search products")
    }
    return await response.json()
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}
