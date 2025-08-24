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
  stock_quantity: number
  low_stock_threshold: number
  weight: number | null
  dimensions: string | null
  images: string[]
  features: string[]
  specifications: Record<string, any>
  is_featured: boolean
  status: string
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  categories?: Category
}
