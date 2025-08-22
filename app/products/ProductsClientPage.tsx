"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Hermès Birkin Bag",
    slug: "hermes-birkin-bag",
    price: 12000,
    originalPrice: 15000,
    image: "/hermes-birkin.jpg",
    category: "Luxury Fashion",
    featured: true,
    inStock: true,
    rating: 5.0,
    reviews: 24,
  },
  {
    id: 2,
    name: "Chanel No. 5 Parfum",
    slug: "chanel-no-5-parfum",
    price: 350,
    originalPrice: null,
    image: "/chanel-perfume.jpg",
    category: "Beauty & Cosmetics",
    featured: false,
    inStock: true,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 3,
    name: "Rolex Submariner",
    slug: "rolex-submariner",
    price: 8500,
    originalPrice: null,
    image: "/rolex-submariner.jpg",
    category: "Fine Jewelry",
    featured: true,
    inStock: false,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 4,
    name: "Luxury Penthouse - Victoria Island",
    slug: "luxury-penthouse-victoria-island",
    price: 2500000,
    originalPrice: null,
    image: "/penthouse-victoria-island.jpg",
    category: "Real Estate",
    featured: true,
    inStock: true,
    rating: 4.7,
    reviews: 12,
  },
]

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
            {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
            {product.originalPrice && <Badge variant="secondary">Sale</Badge>}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick add to cart */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button className="w-full" disabled={!product.inStock}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-6 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ProductsClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Luxury Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our exclusive collection of premium products curated for the discerning customer
          </p>
        </motion.div>

        <Suspense fallback={<ProductsLoading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
