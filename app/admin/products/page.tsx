import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"
import { getProductsByCategory, getCategories, formatCurrency } from "@/lib/database"
import Link from "next/link"
import Image from "next/image"

interface ProductsPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
    filter?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categories = await getCategories()

  // Get all products for now (in production, you'd want proper pagination)
  const allProducts = []
  for (const category of categories) {
    const products = await getProductsByCategory(category.id, { limit: 100 })
    allProducts.push(...products)
  }

  const filteredProducts = allProducts.filter((product) => {
    if (searchParams.filter === "low-stock") {
      return product.stock_quantity <= product.low_stock_threshold
    }
    if (searchParams.category && searchParams.category !== "all") {
      return product.category_id === searchParams.category
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Products</h1>
          <p className="text-luxury-charcoal mt-2">Manage your product catalog</p>
        </div>
        <Button className="btn-luxury" asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal h-4 w-4" />
                <Input placeholder="Search products..." className="pl-10" defaultValue={searchParams.search} />
              </div>
            </div>
            <Select defaultValue={searchParams.category || "all"}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={searchParams.filter || "all"}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="card-luxury">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={product.images?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.is_featured && <Badge className="bg-luxury-gold text-luxury-navy text-xs">Featured</Badge>}
                {product.stock_quantity <= product.low_stock_threshold && (
                  <Badge className="bg-red-500 text-white text-xs">Low Stock</Badge>
                )}
                {!product.is_active && <Badge className="bg-gray-500 text-white text-xs">Inactive</Badge>}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-luxury-navy line-clamp-2">{product.name}</h3>
                <p className="text-sm text-luxury-charcoal">{product.categories?.name}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-luxury-navy">{formatCurrency(product.price)}</span>
                  <span className="text-sm text-luxury-charcoal">Stock: {product.stock_quantity}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit className="h-3 w-3" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="card-luxury">
          <CardContent className="p-12 text-center">
            <p className="text-luxury-charcoal">No products found</p>
            <Button className="btn-luxury mt-4" asChild>
              <Link href="/admin/products/new">Add Your First Product</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
