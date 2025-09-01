"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Home, Wine, Car, Sparkles, Shield, Award, Users2, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

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
    name: "Hair Products",
    slug: "hair-products",
    icon: Zap,
    description: "Luxury hair care & styling products",
    image: "/luxury-hair-products.png",
    featured: true,
    gradient: "from-pink-500 to-purple-600",
    count: "100+ Products",
  },
  {
    name: "Fragrances",
    slug: "fragrances",
    icon: Sparkles,
    description: "Exclusive fragrances & perfumes",
    image: "/exclusive-fragrances.png",
    featured: true,
    gradient: "from-yellow-500 to-orange-600",
    count: "50+ Bottles",
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ABL NATASHA ENTERPRISES
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/categories" className="text-slate-700 hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-primary transition-colors">
                Contact
              </Link>
              <Button className="bg-gradient-to-r from-primary to-accent text-white">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6">
              Luxury Lifestyle Collection
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Discover premium real estate, vintage wines, exotic cars, luxury hair products, exclusive fragrances, and
              more. Your gateway to the finest things in life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="bg-gradient-to-r from-primary to-accent text-white text-lg px-12 py-4 rounded-full">
                Explore Collection
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button variant="outline" className="text-lg px-12 py-4 rounded-full bg-transparent">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={feature.title} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6">
              Premium Categories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated collection of luxury products across multiple categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.slug}
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
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(category.name)}`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>

                        <div className="absolute top-6 left-6">
                          <div
                            className={`bg-gradient-to-r ${category.gradient} p-3 rounded-xl shadow-lg backdrop-blur-sm`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="absolute top-6 right-6">
                          <Badge className="bg-white/90 text-slate-800 font-medium">{category.count}</Badge>
                        </div>
                      </div>

                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">
                            {category.name}
                          </h3>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed">{category.description}</p>
                        <Button
                          variant="ghost"
                          className="text-primary hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent p-0 h-auto font-semibold group-hover:translate-x-2 transition-all duration-300"
                        >
                          Explore Collection
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Experience Luxury Like Never Before
          </h2>
          <p className="text-xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join our exclusive community and gain access to premium products, early releases, and personalized luxury
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-gradient-to-r from-primary to-accent text-white text-lg px-12 py-4 rounded-full">
              Join Our Community
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 text-lg px-12 py-4 rounded-full bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ABL NATASHA ENTERPRISES
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Your premier destination for luxury real estate, premium wines, exotic cars, luxury hair products,
                exclusive fragrances, and more.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-primary">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-slate-400 hover:text-primary transition-colors duration-200"
                    >
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
                  <Link href="/about" className="text-slate-400 hover:text-primary transition-colors duration-200">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-500">© 2024 ABL Natasha Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
