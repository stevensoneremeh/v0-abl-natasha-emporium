"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/database"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: Product
  showCategory?: boolean
}

export function ProductCard({ product, showCategory = true }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const { addItem } = useCart()

  return (
    <Card className="card-luxury group cursor-pointer overflow-hidden h-full">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg?height=300&width=400"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && <Badge className="bg-luxury-gold text-luxury-navy font-semibold">Featured</Badge>}
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white font-semibold">-{discountPercentage}%</Badge>
            )}
            {product.stock_quantity <= product.low_stock_threshold && (
              <Badge className="bg-orange-500 text-white font-semibold">Low Stock</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-luxury-navy opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add to wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
          ))}
          <span className="text-sm text-luxury-charcoal ml-2">(4.8)</span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-luxury-navy mb-2 line-clamp-2 hover:text-luxury-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {showCategory && product.categories && (
          <p className="text-sm text-luxury-charcoal mb-3">{product.categories.name}</p>
        )}

        {product.short_description && (
          <p className="text-sm text-luxury-charcoal/80 mb-3 line-clamp-2">{product.short_description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-luxury-navy">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-luxury-charcoal line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>

          <Button
            size="sm"
            className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-navy"
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {product.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{product.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
