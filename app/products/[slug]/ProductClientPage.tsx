"use client"

import { getProductBySlug, getProductsByCategory } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { InteractiveProductGallery } from "@/components/interactive-product-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { motion } from "framer-motion"

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function ProductContent({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await getProductsByCategory(product.category_id, {
    limit: 4,
  })
  const filteredRelatedProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)

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

  // <CHANGE> Prepare badges for interactive gallery
  const badges = []
  if (product.is_featured) {
    badges.push({ text: "Featured", variant: "featured" as const })
  }
  if (discountPercentage > 0) {
    badges.push({ text: `-${discountPercentage}% OFF`, variant: "discount" as const })
  }
  if (product.stock_quantity <= product.low_stock_threshold) {
    badges.push({ text: "Low Stock", variant: "lowStock" as const })
  }

  return (
    <div className="min-h-screen bg-luxury-cream pb-16 md:pb-0">
      {/* <CHANGE> Replace simple breadcrumb with Breadcrumbs component */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs />
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href={product.categories ? `/categories/${product.categories.slug}` : "/"}>
            <Button variant="ghost" size="sm" className="text-luxury-charcoal hover:text-luxury-gold">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {product.categories?.name || "Home"}
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* <CHANGE> Replace static images with InteractiveProductGallery */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <InteractiveProductGallery images={product.images} productName={product.name} badges={badges} />
          </motion.div>

          {/* <CHANGE> Add animations to product info section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1 mb-2"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-luxury-gold text-luxury-gold" />
                ))}
                <span className="text-sm text-luxury-charcoal ml-2">4.8 (24 reviews)</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-playfair text-3xl md:text-4xl font-bold text-luxury-navy mb-4"
              >
                {product.name}
              </motion.h1>

              {product.short_description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-luxury-charcoal mb-4"
                >
                  {product.short_description}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="font-bold text-3xl text-luxury-navy">{formatPrice(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-xl text-luxury-charcoal line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </motion.div>

              {product.sku && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-luxury-charcoal mb-4"
                >
                  SKU: {product.sku}
                </motion.p>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <h3 className="font-semibold text-luxury-navy mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Badge variant="secondary" className="text-sm">
                        {feature}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* <CHANGE> Add quantity selector and enhanced actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-luxury-navy">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button variant="ghost" size="sm" className="px-3">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">1</span>
                  <Button variant="ghost" size="sm" className="px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button className="btn-luxury w-full text-lg py-6">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="outline" size="lg" className="px-6 bg-transparent">
                    <Heart className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="outline" size="lg" className="px-6 bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full text-lg py-6 bg-transparent">
                  Buy Now
                </Button>
              </motion.div>
            </motion.div>

            {/* Guarantees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t"
            >
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders over ₦50,000" },
                { icon: Shield, title: "Secure Payment", desc: "100% protected" },
                { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <item.icon className="h-5 w-5 text-luxury-gold" />
                  <div>
                    <p className="font-medium text-luxury-navy">{item.title}</p>
                    <p className="text-sm text-luxury-charcoal">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Product Description */}
        {product.description && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-6">Product Description</h2>
                <div className="prose prose-lg max-w-none text-luxury-charcoal">
                  <p>{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="font-playfair text-2xl font-bold text-luxury-navy mb-6">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between py-2 border-b border-gray-200"
                    >
                      <span className="font-medium text-luxury-navy">{key}</span>
                      <span className="text-luxury-charcoal">{String(value)}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* <CHANGE> Add ProductReviews component */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Card>
            <CardContent className="p-8">
              <ProductReviews reviews={[]} averageRating={4.8} totalReviews={24} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="font-playfair text-3xl font-bold text-luxury-navy mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} showCategory={false} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default function ProductClientPage(props: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <p className="text-luxury-charcoal">Loading product...</p>
          </div>
        </div>
      }
    >
      <ProductContent {...props} />
    </Suspense>
  )
}
