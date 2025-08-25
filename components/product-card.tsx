"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types/database"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { QuickViewModal } from "@/components/quick-view-modal"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  showCategory?: boolean
}

export function ProductCard({ product, showCategory = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

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
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="card-luxury group cursor-pointer overflow-hidden h-full">
          <Link href={`/products/${product.slug}`}>
            <div className="relative h-64 overflow-hidden">
              <Image
                src={product.images[0] || "/placeholder.svg?height=300&width=400"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <motion.div
                className="absolute inset-0 bg-luxury-navy/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Badge className="bg-luxury-gold text-luxury-navy font-semibold">Featured</Badge>
                  </motion.div>
                )}
                {discountPercentage > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="bg-red-500 text-white font-semibold">-{discountPercentage}%</Badge>
                  </motion.div>
                )}
                {product.stock_quantity <= product.low_stock_threshold && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Badge className="bg-orange-500 text-white font-semibold">Low Stock</Badge>
                  </motion.div>
                )}
              </div>

              <motion.div
                className="absolute top-4 right-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`backdrop-blur-sm ${
                    isInWishlist(product.id)
                      ? "bg-luxury-gold/90 hover:bg-luxury-gold text-luxury-navy"
                      : "bg-white/90 hover:bg-white text-luxury-navy"
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </Button>
              </motion.div>

              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  size="sm"
                  className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-navy font-semibold"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowQuickView(true)
                  }}
                >
                  Quick View
                </Button>
              </motion.div>
            </div>
          </Link>

          <CardContent className="p-6">
            <motion.div
              className="flex items-center gap-1 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                </motion.div>
              ))}
              <span className="text-sm text-luxury-charcoal ml-2">(4.8)</span>
            </motion.div>

            <Link href={`/products/${product.slug}`}>
              <motion.h3
                className="font-semibold text-luxury-navy mb-2 line-clamp-2 hover:text-luxury-gold transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.name}
              </motion.h3>
            </Link>

            {showCategory && product.categories && (
              <motion.p
                className="text-sm text-luxury-charcoal mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.categories.name}
              </motion.p>
            )}

            {product.short_description && (
              <motion.p
                className="text-sm text-luxury-charcoal/80 mb-3 line-clamp-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {product.short_description}
              </motion.p>
            )}

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-luxury-navy">{formatPrice(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-sm text-luxury-charcoal line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
              </motion.div>
            </motion.div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <motion.div
                className="mt-4 flex flex-wrap gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {product.features.slice(0, 3).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  </motion.div>
                ))}
                {product.features.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      +{product.features.length - 3} more
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <QuickViewModal product={product} isOpen={showQuickView} onClose={() => setShowQuickView(false)} />
    </>
  )
}
