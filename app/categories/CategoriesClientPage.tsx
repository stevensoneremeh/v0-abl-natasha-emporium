"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Luxury Fashion",
    slug: "luxury-fashion",
    description: "Premium clothing and accessories from top designers",
    image: "/luxury-fashion-category.jpg",
    productCount: 45,
    featured: true,
  },
  {
    id: 2,
    name: "Beauty & Cosmetics",
    slug: "beauty-cosmetics",
    description: "High-end beauty products and skincare essentials",
    image: "/beauty-cosmetics-category.jpg",
    productCount: 32,
    featured: true,
  },
  {
    id: 3,
    name: "Fine Jewelry",
    slug: "fine-jewelry",
    description: "Exquisite jewelry pieces and luxury watches",
    image: "/fine-jewelry-category.jpg",
    productCount: 28,
    featured: false,
  },
  {
    id: 4,
    name: "Real Estate",
    slug: "real-estate",
    description: "Premium properties and luxury real estate",
    image: "/real-estate-category.jpg",
    productCount: 15,
    featured: true,
  },
  {
    id: 5,
    name: "Luxury Services",
    slug: "luxury-services",
    description: "Exclusive services and premium experiences",
    image: "/luxury-services-category.jpg",
    productCount: 12,
    featured: false,
  },
  {
    id: 6,
    name: "Home & Living",
    slug: "home-living",
    description: "Premium home decor and luxury furnishings",
    image: "/home-living-category.jpg",
    productCount: 38,
    featured: false,
  },
]

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/categories/${category.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {category.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
              <p className="text-white/90 text-sm">{category.description}</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{category.productCount} products</span>
              <motion.div className="text-primary" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                →
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function CategoriesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CategoriesClientPage() {
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
            Luxury Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium products and services across multiple luxury categories
          </p>
        </motion.div>

        <Suspense fallback={<CategoriesLoading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
