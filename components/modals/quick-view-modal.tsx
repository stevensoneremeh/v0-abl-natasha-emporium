"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import type { Product } from "@/lib/database"
import { useCart } from "@/contexts/cart-context"

interface QuickViewModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>Quick View - {product.name}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <motion.div
                    className="relative aspect-square overflow-hidden rounded-lg bg-luxury-pearl"
                    layoutId={`product-image-${product.id}`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={
                            product.product_images?.[selectedImageIndex]?.image_url ||
                            "/placeholder.svg?height=400&width=400"
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Image Navigation */}
                    {product.product_images && product.product_images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {product.product_images.map((_, index) => (
                          <motion.button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === selectedImageIndex
                                ? "bg-luxury-gold scale-125"
                                : "bg-white/60 hover:bg-white/80"
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Thumbnail Images */}
                  {product.product_images && product.product_images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.product_images.map((image, index) => (
                        <motion.button
                          key={index}
                          className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex
                              ? "border-luxury-gold"
                              : "border-transparent hover:border-luxury-gold/50"
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Image
                            src={image.image_url || "/placeholder.svg"}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.featured && <Badge className="bg-luxury-gold text-luxury-black">Featured</Badge>}
                      {discountPercentage > 0 && (
                        <Badge className="bg-red-500 text-white">-{discountPercentage}%</Badge>
                      )}
                    </div>

                    <h1 className="text-2xl font-luxury-bold text-luxury-emerald mb-2">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                        ))}
                      </div>
                      <span className="text-sm text-luxury-charcoal">(4.8) • 24 reviews</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold text-luxury-emerald">{formatPrice(product.price)}</span>
                      {product.compare_at_price && (
                        <span className="text-xl text-luxury-charcoal line-through">
                          {formatPrice(product.compare_at_price)}
                        </span>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Description */}
                    {product.short_description && (
                      <p className="text-luxury-charcoal mb-6 leading-relaxed">{product.short_description}</p>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-medium text-luxury-emerald">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0 bg-transparent"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0 bg-transparent"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold py-3"
                          onClick={handleAddToCart}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="lg"
                          className="px-4 bg-transparent"
                          onClick={() => setIsWishlisted(!isWishlisted)}
                        >
                          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-medium text-luxury-emerald">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <Badge variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
