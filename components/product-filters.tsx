"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { useState } from "react"

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  priceRange: [number, number]
  availableFeatures: string[]
}

export interface FilterState {
  priceRange: [number, number]
  features: string[]
  sortBy: "name" | "price" | "created_at"
  sortOrder: "asc" | "desc"
  inStock: boolean
  featured: boolean
}

export function ProductFilters({ onFiltersChange, priceRange, availableFeatures }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: priceRange,
    features: [],
    sortBy: "created_at",
    sortOrder: "desc",
    inStock: false,
    featured: false,
  })

  const [isOpen, setIsOpen] = useState(false)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: priceRange,
      features: [],
      sortBy: "created_at",
      sortOrder: "desc",
      inStock: false,
      featured: false,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const activeFiltersCount =
    (filters.features.length > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`space-y-4 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Sort Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sort By</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split("-") as [FilterState["sortBy"], FilterState["sortOrder"]]
                updateFilters({ sortBy, sortOrder })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="price-asc">Price Low to High</SelectItem>
                <SelectItem value="price-desc">Price High to Low</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Price Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={priceRange[1]}
              min={priceRange[0]}
              step={10000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-luxury-charcoal">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured}
                onCheckedChange={(checked) => updateFilters({ featured: !!checked })}
              />
              <Label htmlFor="featured" className="text-sm">
                Featured Products
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
              />
              <Label htmlFor="inStock" className="text-sm">
                In Stock
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        {availableFeatures.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableFeatures.slice(0, 8).map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({ features: [...filters.features, feature] })
                      } else {
                        updateFilters({ features: filters.features.filter((f) => f !== feature) })
                      }
                    }}
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  )
}
