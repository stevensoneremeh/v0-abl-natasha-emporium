"use client"

import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Grid, List } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

interface CategoryClientPageProps {
  category: {
    id: string
    name: string
    description?: string
  }
  allProducts: any[]
  searchParams: {
    page?: string
    sort?: string
    view?: "grid" | "list"
  }
}

export default function CategoryClientPage({ category, allProducts, searchParams }: CategoryClientPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    selectedFeatures: [],
    inStock: false,
    featured: false,
  })

  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      if (filters.selectedFeatures.length > 0) {
        const productTags = product.tags || []
        const hasSelectedFeature = filters.selectedFeatures.some((feature) => productTags.includes(feature))
        if (!hasSelectedFeature) return false
      }

      if (filters.inStock && product.stock_quantity <= 0) {
        return false
      }

      if (filters.featured && !product.featured) {
        return false
      }

      return true
    })
  }, [allProducts, filters])

  const paginatedProducts = filteredProducts.slice(offset, offset + limit)

  const priceRange: [number, number] =
    allProducts.length > 0
      ? [Math.min(...allProducts.map((p) => p.price)), Math.max(...allProducts.map((p) => p.price))]
      : [0, 1000000]

  const availableFeatures = Array.from(new Set(allProducts.flatMap((p) => p.tags || []))).sort()

  const viewMode = searchParams.view || "grid"

  return (
    <div className="min-h-screen bg-luxury-cream">
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
            <Badge className="bg-luxury-gold text-luxury-navy">{filteredProducts.length} Products</Badge>
            {allProducts.some((p) => p.featured) && (
              <Badge variant="outline" className="border-luxury-cream text-luxury-cream">
                Featured Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              onFiltersChange={(newFilters: FilterState) => {
                setFilters(newFilters)
              }}
              priceRange={priceRange}
              availableFeatures={availableFeatures}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-luxury-charcoal">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
                {filteredProducts.length !== allProducts.length && (
                  <span className="text-luxury-gold ml-1">(filtered from {allProducts.length} total)</span>
                )}
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

            {paginatedProducts.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-luxury-navy mb-2">No products found</h3>
                <p className="text-luxury-charcoal mb-6">
                  {filteredProducts.length === 0 && allProducts.length > 0
                    ? "Try adjusting your filters to see more products."
                    : "We couldn't find any products in this category."}
                </p>
                {filteredProducts.length === 0 && allProducts.length > 0 ? (
                  <Button
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 1000000],
                        selectedFeatures: [],
                        inStock: false,
                        featured: false,
                      })
                    }
                    className="btn-luxury"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Link href="/">
                    <Button className="btn-luxury">Browse All Categories</Button>
                  </Link>
                )}
              </div>
            )}

            {filteredProducts.length > limit && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link href={`?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() })}`}>
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}

                  <span className="px-4 py-2 text-luxury-charcoal">
                    Page {page} of {Math.ceil(filteredProducts.length / limit)}
                  </span>

                  {page < Math.ceil(filteredProducts.length / limit) && (
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
