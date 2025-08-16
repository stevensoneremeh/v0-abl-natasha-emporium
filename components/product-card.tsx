"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/database"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { QuickViewModal } from "@/components/modals/quick-view-modal"

interface ProductCardProps {
  product: Product
  showCategory?: boolean
  index?: number
}

export function ProductCard({ product, showCategory = true, index = 0 }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -8 }}
        className="group"
      >
        <Card className="card-luxury cursor-pointer overflow-hidden h-full relative">
          <Link href={`/products/${product.slug}`}>
            <div className="relative h-64 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  src={product.product_images?.[0]?.image_url || "/placeholder.svg?height=300&width=400"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="bg-luxury-gold text-luxury-black font-semibold">Featured</Badge>
                  </motion.div>
                )}
                {discountPercentage > 0 && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Badge className="bg-red-500 text-white font-semibold">-{discountPercentage}%</Badge>
                  </motion.div>
                )}
                {product.inventory_quantity <= 5 && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge className="bg-orange-500 text-white font-semibold">Low Stock</Badge>
                  </motion.div>
                )}
              </div>

              <motion.div
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-luxury-emerald backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsWishlisted(!isWishlisted)
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-luxury-emerald backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsQuickViewOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold"
                    onClick={(e) => {
                      e.preventDefault()
                      addItem(product)
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </Link>

          <CardContent className="p-6">
            <motion.div
              className="flex items-center gap-1 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                  <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                </motion.div>
              ))}
              <span className="text-sm text-luxury-charcoal ml-2">(4.8)</span>
            </motion.div>

            <Link href={`/products/${product.slug}`}>
              <motion.h3
                className="font-semibold text-luxury-emerald mb-2 line-clamp-2 hover:text-luxury-gold transition-colors"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {product.name}
              </motion.h3>
            </Link>

            {showCategory && product.categories && (
              <motion.p
                className="text-sm text-luxury-charcoal mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {product.categories.name}
              </motion.p>
            )}

            {product.short_description && (
              <motion.p
                className="text-sm text-luxury-charcoal/80 mb-3 line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {product.short_description}
              </motion.p>
            )}

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-luxury-emerald">{formatPrice(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-sm text-luxury-charcoal line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black"
                  onClick={(e) => {
                    e.preventDefault()
                    addItem(product)
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {product.tags && product.tags.length > 0 && (
              <motion.div
                className="mt-4 flex flex-wrap gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {product.tags.slice(0, 3).map((tag, tagIndex) => (
                  <motion.div
                    key={tagIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + tagIndex * 0.1 }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
                {product.tags.length > 3 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}>
                    <Badge variant="secondary" className="text-xs">
                      +{product.tags.length - 3} more
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  )
}
