"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ArrowRight,
  Home,
  Wine,
  Car,
  Scissors,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Award,
  Users2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { VideoCarouselHero } from "@/components/video-carousel-hero"
import { StructuredData } from "@/components/structured-data"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"
import { Heart } from "lucide-react"

const heroVideos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/uSlp-xr3zBP8lXR1SMwW6h/public/video2.mp4",
    poster: "/luxury-real-estate-exterior.png",
    title: "Luxury Real Estate",
    subtitle: "Discover premium properties and exclusive investment opportunities in prime locations",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/9ZegVuzzfVAextXiyyFx2w/public/video3.mp4",
    poster: "/modern-interior.png",
    title: "Modern Interiors",
    subtitle: "Experience sophisticated design and contemporary luxury living spaces",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/tKGZJFOS96klOq8lOmq4Uo/public/video4.mp4",
    poster: "/luxury-amenities-pool.png",
    title: "Premium Amenities",
    subtitle: "Indulge in world-class facilities and exclusive luxury amenities",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/ItXhS5i8c4HH1Qg67JVrEy/public/video5.mp4",
    poster: "/business-office-space.png",
    title: "Executive Spaces",
    subtitle: "Professional environments designed for success and productivity",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/A9TGfgDzmNJeLHdjY9YBK_/public/video6.mp4",
    poster: "/luxury-resort-suite.png",
    title: "Resort Living",
    subtitle: "Experience the ultimate in luxury hospitality and comfort",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/PnAbaYvNZkxh5ZPXHTrYao/public/video7.mp4",
    poster: "/investment-opportunity.png",
    title: "Investment Opportunities",
    subtitle: "Secure your future with premium real estate investments",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_sFe0MjZow9r7oWcqzsmKEOLgrrVb/7Lc-Lh0f0H__2NeVCpJlZ-/public/video8.mp4",
    poster: "/luxury-lifestyle.png",
    title: "Luxury Lifestyle",
    subtitle: "Embrace the finest things in life with our exclusive collection",
  },
]

const categories = [
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: Home,
    description: "Luxury properties & investments",
    image: "/luxury-real-estate.png",
    featured: true,
    gradient: "from-emerald-500 to-teal-600",
    count: "150+ Properties",
  },
  {
    name: "Wines",
    slug: "wines",
    icon: Wine,
    description: "Premium wines & vintage collections",
    image: "/premium-wine-collection.png",
    featured: true,
    gradient: "from-purple-500 to-pink-600",
    count: "500+ Bottles",
  },
  {
    name: "Cars",
    slug: "cars",
    icon: Car,
    description: "Luxury & exotic automobiles",
    image: "/luxury-exotic-cars.png",
    featured: true,
    gradient: "from-blue-500 to-cyan-600",
    count: "75+ Vehicles",
  },
  {
    name: "Hair & Wigs",
    slug: "hair-wigs",
    icon: Scissors,
    description: "Premium hair products & luxury wigs",
    image: "/luxury-hair-wigs.png",
    featured: false,
    gradient: "from-rose-500 to-orange-600",
    count: "200+ Products",
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    icon: Sparkles,
    description: "Exclusive fragrances & luxury perfumes",
    image: "/luxury-perfumes.png",
    featured: false,
    gradient: "from-amber-500 to-yellow-600",
    count: "300+ Fragrances",
  },
]

const featuredProducts = [
  {
    id: 1,
    name: "Luxury Penthouse - Victoria Island",
    price: "₦850,000,000",
    originalPrice: null,
    image: "/luxury-penthouse-victoria-island.png",
    category: "Real Estate",
    rating: 5,
    reviews: 12,
    badge: "Featured",
    badgeColor: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    savings: null,
  },
  {
    id: 2,
    name: "Dom Pérignon Vintage 2013",
    price: "₦450,000",
    originalPrice: "₦520,000",
    image: "/dom-perignon-vintage.png",
    category: "Wines",
    rating: 5,
    reviews: 28,
    badge: "Limited Edition",
    badgeColor: "bg-gradient-to-r from-purple-500 to-purple-600",
    savings: "₦70,000",
  },
  {
    id: 3,
    name: "Mercedes-Benz S-Class 2024",
    price: "₦95,000,000",
    originalPrice: null,
    image: "/mercedes-s-class.png",
    category: "Cars",
    rating: 5,
    reviews: 8,
    badge: "New Arrival",
    badgeColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    savings: null,
  },
  {
    id: 4,
    name: "Tom Ford Black Orchid",
    price: "₦185,000",
    originalPrice: "₦210,000",
    image: "/black-orchid-perfume.png",
    category: "Perfumes",
    rating: 5,
    reviews: 45,
    badge: "Best Seller",
    badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600",
    savings: "₦25,000",
  },
]

const testimonials = [
  {
    id: 1,
    name: "Adebayo Johnson",
    role: "Real Estate Investor",
    content:
      "ABL Natasha Enterprises helped me find the perfect luxury penthouse. Their attention to detail and premium service is unmatched.",
    rating: 5,
    image: "/professional-man-headshot.png",
  },
  {
    id: 2,
    name: "Chioma Okafor",
    role: "Wine Collector",
    content:
      "The vintage wine collection here is extraordinary. I've found rare bottles that I couldn't locate anywhere else.",
    rating: 5,
    image: "/professional-woman-headshot.png",
  },
  {
    id: 3,
    name: "Michael Adeyemi",
    role: "Luxury Car Enthusiast",
    content: "Purchased my dream Mercedes-Benz through them. The entire process was seamless and professional.",
    rating: 5,
    image: "/luxury-man-headshot.png",
  },
]

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-level security for all payments",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest luxury products",
  },
  {
    icon: Users2,
    title: "Expert Service",
    description: "Dedicated luxury consultants",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Express shipping worldwide",
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95 },
}

export default function HomePage() {
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-16 md:pb-0">
      <StructuredData
        type="WebSite"
        data={{
          name: "ABL NATASHA ENTERPRISES",
          url: typeof window !== "undefined" ? window.location.origin : "https://abl-natasha-emporium.vercel.app",
          description: "Luxury lifestyle collection featuring real estate, wines, cars, hair products, and fragrances.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${typeof window !== "undefined" ? window.location.origin : "https://abl-natasha-emporium.vercel.app"}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            {
              name: "Home",
              url: typeof window !== "undefined" ? window.location.origin : "https://abl-natasha-emporium.vercel.app",
            },
          ],
        }}
      />

      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-primary via-accent to-primary text-white py-3 px-4 text-center relative overflow-hidden z-50 shadow-lg"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="whitespace-nowrap font-semibold flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              New Year Sale: Up to 30% off on luxury wines and perfumes | Free shipping on orders over ₦500,000 |
              Limited time offer!
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-white/20 rounded-full p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <EnhancedNavigation />

      <VideoCarouselHero
        videos={heroVideos}
        primaryCTA={{
          text: "Explore Collection",
          href: "#featured-categories",
        }}
        secondaryCTA={{
          text: "View Real Estate",
          href: "/categories/real-estate",
        }}
      />

      {/* Trust Features Section */}
      <LazyLoadWrapper>
        <section className="py-12 bg-white/80 backdrop-blur-sm border-y border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {trustFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      </LazyLoadWrapper>

      <LazyLoadWrapper>
        <section id="featured-categories" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-20"
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Categories</span>
              </motion.div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6">
                Curated Luxury Collections
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover our handpicked selection of premium products across multiple luxury categories, each carefully
                curated for the discerning connoisseur.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={category.slug}
                    variants={fadeInUp}
                    whileHover={{ y: -12, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <Link href={`/categories/${category.slug}`}>
                      <Card className="relative overflow-hidden border-2 border-slate-200/50 hover:border-primary/30 transition-all duration-500 group cursor-pointer bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl">
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>

                          {/* Floating Icon */}
                          <motion.div
                            className="absolute top-6 left-6"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <div
                              className={`bg-gradient-to-r ${category.gradient} p-3 rounded-xl shadow-lg backdrop-blur-sm`}
                            >
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                          </motion.div>

                          {/* Category Count */}
                          <div className="absolute top-6 right-6">
                            <Badge className="bg-white/90 text-slate-800 font-medium">{category.count}</Badge>
                          </div>

                          {/* Gradient Overlay */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                          ></div>
                        </div>

                        <CardContent className="p-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">
                              {category.name}
                            </h3>
                            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                          </div>
                          <p className="text-slate-600 mb-6 leading-relaxed">{category.description}</p>
                          <div className="flex items-center justify-between">
                            <Button
                              variant="ghost"
                              className="text-primary hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent p-0 h-auto font-semibold group-hover:translate-x-2 transition-all duration-300"
                            >
                              Explore Collection
                            </Button>
                            {category.featured && (
                              <Badge className={`bg-gradient-to-r ${category.gradient} text-white border-0`}>
                                Featured
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      </LazyLoadWrapper>

      <LazyLoadWrapper>
        <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          {featuredProducts.map((product) => (
            <StructuredData
              key={product.id}
              type="Product"
              data={{
                name: product.name,
                description: `${product.category} - ${product.name}`,
                image: product.image,
                brand: "ABL NATASHA ENTERPRISES",
                price: product.price.replace(/[₦,]/g, ""),
                priceCurrency: "NGN",
                inStock: true,
                rating: product.rating,
                reviewCount: product.reviews,
              }}
            />
          ))}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              className="text-center mb-20"
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 px-4 py-2 rounded-full mb-6"
              >
                <Award className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Featured Products</span>
              </motion.div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6">
                Handpicked Excellence
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover our most coveted luxury items, each representing the pinnacle of craftsmanship and exclusivity.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  whileHover={{ y: -16, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="relative overflow-hidden border-2 border-slate-200/50 hover:border-primary/30 transition-all duration-500 group cursor-pointer bg-white shadow-xl hover:shadow-2xl">
                      <div className="relative h-72 overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500"></div>

                        {/* Product Badge */}
                        <motion.div
                          initial={{ scale: 0, rotate: -12 }}
                          animate={{ scale: 1, rotate: -12 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="absolute top-4 left-4"
                        >
                          <Badge className={`${product.badgeColor} text-white font-semibold px-3 py-1 shadow-lg`}>
                            {product.badge}
                          </Badge>
                        </motion.div>

                        {/* Savings Badge */}
                        {product.savings && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.7 }}
                            className="absolute top-4 right-4"
                          >
                            <Badge className="bg-red-500 text-white font-semibold">Save {product.savings}</Badge>
                          </motion.div>
                        )}

                        {/* Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Heart className="h-4 w-4 text-slate-600 hover:text-red-500" />
                        </motion.button>
                      </div>

                      <CardContent className="p-6">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(product.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: index * 0.1 + 0.8 + i * 0.1 }}
                            >
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            </motion.div>
                          ))}
                          <span className="text-sm text-slate-500 ml-2 font-medium">({product.reviews} reviews)</span>
                        </div>

                        {/* Product Info */}
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4 font-medium">{product.category}</p>

                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl text-slate-900">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-slate-500 line-through">{product.originalPrice}</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div {...scaleOnHover}>
                <Link href="/products">
                  <Button className="bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                    Explore All Products
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </LazyLoadWrapper>

      {/* ... existing testimonials section with enhanced styling ... */}
      <LazyLoadWrapper>
        <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-100 via-white to-slate-50 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-20"
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full mb-6"
              >
                <Users2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Client Testimonials</span>
              </motion.div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6">
                Stories of Excellence
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Hear from our distinguished clientele about their exceptional luxury experiences with ABL Natasha
                Enterprises.
              </p>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-slate-200/50 relative overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full -translate-y-16 translate-x-16"></div>

                  <div className="flex items-center gap-2 mb-8 justify-center">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-2xl text-slate-700 mb-8 text-center italic font-light leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative">
                      <Image
                        src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full border-2 border-white"></div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-xl text-slate-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-slate-600 font-medium">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-6 mt-12">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-gradient-to-r from-primary to-accent scale-125"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </LazyLoadWrapper>

      {/* Enhanced CTA Section */}
      <motion.section
        className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Experience Luxury Like Never Before
          </motion.h2>
          <motion.p
            className="text-xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our exclusive community of discerning clients and gain access to premium products, early releases, and
            personalized luxury experiences tailored just for you.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div {...scaleOnHover}>
              <Link href="/auth/sign-up">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-lg px-12 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                  Join Our Community
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div {...scaleOnHover}>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-900 text-lg px-12 py-4 rounded-full bg-transparent font-semibold transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Footer */}
      <motion.footer
        className="bg-slate-900 text-white py-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Image
                    src="/images/abl-logo.png"
                    alt="ABL NATASHA ENTERPRISES"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ABL NATASHA ENTERPRISES
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Your premier destination for luxury real estate, premium wines, exotic cars, luxury hair products, and
                exclusive fragrances. Experience excellence in every detail.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-primary hover:to-accent rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <span className="sr-only">Facebook</span>
                  <div className="w-5 h-5 bg-current"></div>
                </motion.a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-primary">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                    >
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-primary">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-primary transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-slate-400 hover:text-primary transition-colors duration-200">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-slate-400 hover:text-primary transition-colors duration-200">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-slate-400 hover:text-primary transition-colors duration-200">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-500">
              © 2024 ABL Natasha Enterprises. All rights reserved. Crafted with excellence.
            </p>
          </div>
        </div>
      </motion.footer>

      <MobileBottomNav />
    </div>
  )
}
