"use client"

import { motion } from "framer-motion"
import { AnnouncementBar } from "@/components/home/announcement-bar"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { TestimonialCarousel } from "@/components/home/testimonial-carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, TrendingUp, Award, Shield } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

const featuredProducts = [
  {
    id: 1,
    name: "Hermès Birkin 35 Togo Leather",
    price: "₦18,500,000",
    originalPrice: "₦21,000,000",
    image: "/placeholder.svg?key=wjrsn",
    category: "Luxury Fashion",
    rating: 5,
    reviews: 24,
    badge: "Investment Piece",
  },
  {
    id: 2,
    name: "Manhattan Penthouse - Central Park Views",
    price: "₦5,200,000,000",
    originalPrice: null,
    image: "/placeholder.svg?key=4zjo6",
    category: "Real Estate",
    rating: 5,
    reviews: 8,
    badge: "Exclusive",
  },
  {
    id: 3,
    name: "Patek Philippe Calatrava Rose Gold",
    price: "₦13,500,000",
    originalPrice: null,
    image: "/placeholder.svg?key=maguy",
    category: "Luxury Watches",
    rating: 5,
    reviews: 12,
    badge: "Limited Edition",
  },
  {
    id: 4,
    name: "Tiffany & Co. Diamond Solitaire Ring",
    price: "₦7,650,000",
    originalPrice: "₦9,100,000",
    image: "/placeholder.svg?key=3mfo9",
    category: "Fine Jewelry",
    rating: 5,
    reviews: 18,
    badge: "Best Seller",
  },
]

const stats = [
  { icon: TrendingUp, value: "500+", label: "Luxury Properties" },
  { icon: Award, value: "10K+", label: "Satisfied Clients" },
  { icon: Shield, value: "25+", label: "Years Experience" },
]

export default function HomePage() {
  return (
    <motion.div 
      className="min-h-screen bg-luxury-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnnouncementBar />
      <HeroSection />
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="py-20 bg-luxury-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-luxury-bold text-4xl md:text-5xl text-luxury-emerald mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-luxury-charcoal max-w-2xl mx-auto">
              Handpicked luxury items from our exclusive collection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="card-luxury overflow-hidden h-full">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <Badge className="absolute top-4 left-4 bg-luxury-gold text-luxury-black font-semibold">
                      {product.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                      ))}
                      <span className="text-sm text-luxury-charcoal ml-2">({product.reviews})</span>
                    </div>
                    <h3 className="font-semibold text-luxury-emerald mb-2 line-clamp-2 group-hover:text-luxury-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-luxury-charcoal mb-3">{product.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-luxury-emerald">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-luxury-charcoal line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <Button className="btn-luxury text-lg px-10 py-6 hover-lift">
                View All Products
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <TestimonialCarousel />

      {/* Stats Section */}
      <section className="py-20 luxury-gradient text-luxury-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-luxury-bold text-4xl md:text-5xl mb-6">
              Experience Luxury Like Never Before
            </h2>
            <p className="text-xl text-luxury-cream/90 max-w-3xl mx-auto">
              Join our exclusive community and get access to premium products, early releases, 
              and personalized luxury experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/20 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-luxury-gold" />
                  </div>
                  <div className="text-4xl font-bold text-luxury-gold mb-2">{stat.value}</div>
                  <div className="text-luxury-cream/80">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 text-lg px-10 py-6 font-semibold hover-lift">
              Join Our Community
            </Button>
            <Button
              variant="outline"
              className="border-luxury-cream text-luxury-cream hover:bg-luxury-cream hover:text-luxury-emerald text-lg px-10 py-6 bg-transparent hover-lift"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
