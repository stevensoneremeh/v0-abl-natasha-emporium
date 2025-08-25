"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, X } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/types/database"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useState } from "react"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()

  if (!product) return null

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

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View: {product.name}</DialogTitle>
          <Button variant="ghost" size="sm" className="absolute right-4 top-4 z-10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg?height=400&width=400"}
                alt={product.name}
                fill
                className="object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-luxury-gold text-luxury-navy font-semibold">Featured</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white font-semibold">-{discountPercentage}%</Badge>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                      selectedImageIndex === index ? "border-luxury-gold" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                ))}
                <span className="text-sm text-luxury-charcoal ml-2">(4.8)</span>
              </div>

              <h2 className="text-2xl font-bold text-luxury-navy mb-2">{product.name}</h2>

              {product.categories && <p className="text-sm text-luxury-charcoal mb-3">{product.categories.name}</p>}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-luxury-navy">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-lg text-luxury-charcoal line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-luxury-charcoal">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-luxury-navy mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock_quantity > product.low_stock_threshold
                    ? "bg-green-500"
                    : product.stock_quantity > 0
                      ? "bg-orange-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-sm text-luxury-charcoal">
                {product.stock_quantity > product.low_stock_threshold
                  ? "In Stock"
                  : product.stock_quantity > 0
                    ? `Only ${product.stock_quantity} left`
                    : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-navy font-semibold"
                onClick={() => {
                  addItem(product)
                  onClose()
                }}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistToggle}
                className={`border-luxury-gold ${
                  isInWishlist(product.id)
                    ? "bg-luxury-gold text-luxury-navy"
                    : "text-luxury-gold hover:bg-luxury-gold hover:text-luxury-navy"
                }`}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
