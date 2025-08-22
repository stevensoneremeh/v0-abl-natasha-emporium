"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface WishlistGridProps {
  items: any[]
}

export function WishlistGrid({ items }: WishlistGridProps) {
  const [wishlistItems, setWishlistItems] = useState(items)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const removeFromWishlist = async (itemId: string) => {
    setLoading(itemId)
    try {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

      if (error) throw error

      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
      toast.success("Removed from wishlist")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
    } finally {
      setLoading(null)
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <Card className="card-luxury">
        <CardContent className="text-center py-12">
          <Heart className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
          <h3 className="font-playfair text-xl font-semibold text-luxury-navy mb-2">Your Wishlist is Empty</h3>
          <p className="text-luxury-charcoal mb-6">Save items you love to your wishlist</p>
          <Button asChild>
            <a href="/">Browse Products</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlistItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="card-luxury group cursor-pointer overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={item.products?.images?.[0] || "/placeholder.svg"}
                alt={item.products?.name || "Product"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-luxury-navy/20 group-hover:bg-luxury-navy/10 transition-colors duration-300" />

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={loading === item.id}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                  <ShoppingCart className="h-4 w-4 text-luxury-navy" />
                </Button>
              </div>

              {item.products?.is_featured && (
                <Badge className="absolute top-4 left-4 bg-luxury-gold text-luxury-navy font-semibold">Featured</Badge>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                ))}
                <span className="text-sm text-luxury-charcoal ml-2">(4.8)</span>
              </div>

              <h3 className="font-semibold text-luxury-navy mb-2 line-clamp-2">
                {item.products?.name || "Product Name"}
              </h3>

              <p className="text-sm text-luxury-charcoal mb-3">{item.products?.categories?.name || "Category"}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-luxury-navy">
                    ₦{item.products?.price?.toLocaleString() || "0"}
                  </span>
                  {item.products?.compare_at_price && (
                    <span className="text-sm text-luxury-charcoal line-through">
                      ₦{item.products.compare_at_price.toLocaleString()}
                    </span>
                  )}
                </div>
                {item.products?.stock_quantity && item.products.stock_quantity < 10 && (
                  <Badge variant="secondary" className="text-xs">
                    {item.products.stock_quantity} left
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={loading === item.id}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>

              <p className="text-xs text-luxury-charcoal mt-3">
                Added {new Date(item.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
