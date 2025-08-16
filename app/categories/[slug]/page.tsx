import { getCategoryBySlug, getProductsByCategory } from "@/lib/database"
import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Grid, List } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    sort?: string
    view?: "grid" | "list"
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - ABL NATASHA EMPORIUM`,
    description: category.description || `Browse our collection of ${category.name.toLowerCase()} products`,
  }
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  // Parse sort parameters
  const sortParam = searchParams.sort || "created_at-desc"
  const [sortBy, sortOrder] = sortParam.split("-") as ["name" | "price" | "created_at", "asc" | "desc"]

  const products = await getProductsByCategory(category.id, {
    limit,
    offset,
    sortBy,
    sortOrder,
  })

  // Get all products for filter options (in a real app, you'd want to optimize this)
  const allProducts = await getProductsByCategory(category.id)
  const priceRange: [number, number] =
    allProducts.length > 0
      ? [Math.min(...allProducts.map((p) => p.price)), Math.max(...allProducts.map((p) => p.price))]
      : [0, 1000000]

  const availableFeatures = Array.from(new Set(allProducts.flatMap((p) => p.features || []))).sort()

  const viewMode = searchParams.view || "grid"

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-luxury-charcoal hover:text-luxury-gold">
              Home
            </Link>
            <span className="text-luxury-charcoal">/</span>
            <Link href="/categories" className="text-luxury-charcoal hover:text-luxury-gold">
              Categories
            </Link>
            <span className="text-luxury-charcoal">/</span>
            <span className="text-luxury-navy font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-luxury-navy text-luxury-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>

          {category.description && <p className="text-xl text-luxury-cream/90 max-w-3xl">{category.description}</p>}

          <div className="flex items-center gap-4 mt-6">
            <Badge className="bg-luxury-gold text-luxury-navy">{products.length} Products</Badge>
            {allProducts.some((p) => p.is_featured) && (
              <Badge variant="outline" className="border-luxury-cream text-luxury-cream">
                Featured Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              onFiltersChange={(filters: FilterState) => {
                // TODO: Implement client-side filtering
                console.log("Filters changed:", filters)
              }}
              priceRange={priceRange}
              availableFeatures={availableFeatures}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-luxury-charcoal">
                Showing {products.length} of {allProducts.length} products
              </p>

              <div className="flex items-center gap-2">
                <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" asChild>
                  <Link href={`?${new URLSearchParams({ ...searchParams, view: "grid" })}`}>
                    <Grid className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" asChild>
                  <Link href={`?${new URLSearchParams({ ...searchParams, view: "list" })}`}>
                    <List className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-luxury-navy mb-2">No products found</h3>
                <p className="text-luxury-charcoal mb-6">We couldn't find any products in this category.</p>
                <Link href="/">
                  <Button className="btn-luxury">Browse All Categories</Button>
                </Link>
              </div>
            )}

            {/* Pagination */}
            {allProducts.length > limit && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link href={`?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() })}`}>
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}

                  <span className="px-4 py-2 text-luxury-charcoal">
                    Page {page} of {Math.ceil(allProducts.length / limit)}
                  </span>

                  {page < Math.ceil(allProducts.length / limit) && (
                    <Link href={`?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() })}`}>
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-luxury-charcoal">Loading products...</p>
          </div>
        </div>
      }
    >
      <CategoryContent {...props} />
    </Suspense>
  )
}
