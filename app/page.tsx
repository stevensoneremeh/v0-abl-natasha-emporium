"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Home, Wine, Car, Scissors, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { VideoCarouselHero } from "@/components/video-carousel-hero"
import { StructuredData } from "@/components/structured-data"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"

const heroVideos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Using your uploaded video
    poster: "/luxury-real-estate-exterior.png",
    title: "Luxury Real Estate",
    subtitle: "Discover premium properties and exclusive investment opportunities in prime locations",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Reusing the same video until you provide Video 3
    poster: "/modern-interior.png",
    title: "Modern Interiors",
    subtitle: "Experience sophisticated design and contemporary luxury living spaces",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Reusing the same video until you provide Video 4
    poster: "/luxury-amenities-pool.png",
    title: "Premium Amenities",
    subtitle: "Indulge in world-class facilities and exclusive luxury amenities",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Reusing the same video until you provide Video 5
    poster: "/business-office-space.png",
    title: "Executive Spaces",
    subtitle: "Professional environments designed for success and productivity",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Reusing the same video until you provide Video 6
    poster: "/luxury-resort-suite.png",
    title: "Resort Living",
    subtitle: "Experience the ultimate in luxury hospitality and comfort",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Reusing the same video until you provide Video 7
    poster: "/investment-opportunity.png",
    title: "Investment Opportunities",
    subtitle: "Secure your future with premium real estate investments",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-JD0X7MilUmknGqgTkMt9xBhmQ89oUF.mp4", // Reusing the same video until you provide Video 8
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
  },
  {
    name: "Wines",
    slug: "wines",
    icon: Wine,
    description: "Premium wines & vintage collections",
    image: "/premium-wine-collection.png",
    featured: true,
  },
  {
    name: "Cars",
    slug: "cars",
    icon: Car,
    description: "Luxury & exotic automobiles",
    image: "/luxury-exotic-cars.png",
    featured: true,
  },
  {
    name: "Hair & Wigs",
    slug: "hair-wigs",
    icon: Scissors,
    description: "Premium hair products & luxury wigs",
    image: "/luxury-hair-wigs.png",
    featured: false,
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    icon: Sparkles,
    description: "Exclusive fragrances & luxury perfumes",
    image: "/luxury-perfumes.png",
    featured: false,
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
    <div className="min-h-screen bg-background pb-16 md:pb-0">
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
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4 text-center relative overflow-hidden z-50"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="whitespace-nowrap font-semibold"
            >
              🎉 New Year Sale: Up to 30% off on luxury wines and perfumes | Free shipping on orders over ₦500,000 |
              Limited time offer!
            </motion.div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-primary-foreground/10 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
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

      <LazyLoadWrapper>
        <section id="featured-categories" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Premium Categories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our curated selection of luxury products across multiple categories
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
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <Link href={`/categories/${category.slug}`}>
                      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors duration-300"></div>
                          <motion.div
                            className="absolute top-4 left-4"
                            whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                          >
                            <div className="bg-primary/90 p-2 rounded-full">
                              <IconComponent className="h-5 w-5 text-primary-foreground" />
                            </div>
                          </motion.div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-2">{category.name}</h3>
                          <p className="text-muted-foreground mb-4">{category.description}</p>
                          <Button
                            variant="ghost"
                            className="text-primary hover:text-primary-foreground hover:bg-primary p-0 h-auto font-semibold group-hover:translate-x-2 transition-transform duration-300"
                          >
                            Explore {category.name}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
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
        <section className="py-16 lg:py-24 bg-card">
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked luxury items from our exclusive collection
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
                <motion.div key={product.id} variants={fadeInUp} whileHover={{ y: -12, transition: { duration: 0.3 } }}>
                  <Link href={`/products/${product.id}`}>
                    <Card className="bg-background border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-semibold">
                            {product.badge}
                          </Badge>
                        </motion.div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(product.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.7 + i * 0.1 }}
                            >
                              <Star className="h-4 w-4 fill-accent text-accent" />
                            </motion.div>
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-foreground">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div {...scaleOnHover}>
                <Link href="/products">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-lg px-8 py-4">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </LazyLoadWrapper>

      <LazyLoadWrapper>
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
              whileInView="animate"
              initial="initial"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from our satisfied customers about their luxury experiences
              </p>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card rounded-2xl p-8 shadow-lg border border-border"
                >
                  <div className="flex items-center gap-1 mb-4 justify-center">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-muted-foreground mb-6 text-center italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <Image
                      src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/80 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/80 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </LazyLoadWrapper>

      <motion.section
        className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Experience Luxury Like Never Before
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-primary-foreground/90"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our exclusive community and get access to premium products, early releases, and personalized luxury
            experiences.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div {...scaleOnHover}>
              <Link href="/auth/sign-up">
                <Button className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-4 font-semibold">
                  Join Our Community
                </Button>
              </Link>
            </motion.div>
            <motion.div {...scaleOnHover}>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-4 bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer
        className="bg-foreground text-background py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/abl-logo.png"
                  alt="ABL NATASHA ENTERPRISES"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-primary font-serif font-bold text-xl">ABL NATASHA ENTERPRISES</span>
              </div>
              <p className="text-background/80 mb-4 max-w-md">
                Your premier destination for luxury real estate, premium wines, exotic cars, luxury hair products, and
                exclusive fragrances.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-background/80 hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-primary mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-background/80 hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-background/80 hover:text-primary transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-background/80 hover:text-primary transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-background/80 hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted-foreground mt-8 pt-8 text-center">
            <p className="text-background/60">© 2024 ABL Natasha Enterprises. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>

      <MobileBottomNav />
    </div>
  )
}
