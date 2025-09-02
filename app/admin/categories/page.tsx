import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { getCategories } from "@/lib/database-client"
import Link from "next/link"
import Image from "next/image"

interface CategoriesPageProps {
  searchParams: {
    search?: string
  }
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const categories = await getCategories()

  const filteredCategories = categories.filter((category) => {
    if (searchParams.search) {
      return (
        category.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchParams.search.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Categories</h1>
          <p className="text-luxury-charcoal mt-2">Manage your product categories</p>
        </div>
        <Button className="btn-luxury" asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal h-4 w-4" />
            <Input placeholder="Search categories..." className="pl-10" defaultValue={searchParams.search} />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="card-luxury">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={category.image_url || "/placeholder.svg?height=200&width=300"}
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                {category.is_featured && <Badge className="bg-luxury-gold text-luxury-navy text-xs">Featured</Badge>}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-luxury-navy">{category.name}</h3>
                <p className="text-sm text-luxury-charcoal line-clamp-2">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-luxury-charcoal">Slug: {category.slug}</span>
                  <Badge variant="outline">{category.product_count || 0} products</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/categories/${category.slug}`}>
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/categories/edit/${category.id}`}>
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

      {filteredCategories.length === 0 && (
        <Card className="card-luxury">
          <CardContent className="p-12 text-center">
            <p className="text-luxury-charcoal">No categories found</p>
            <Button className="btn-luxury mt-4" asChild>
              <Link href="/admin/categories/new">Add Your First Category</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
