import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, User, Menu, Star, ArrowRight, Home, Wine, Car, Scissors, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CartDrawer } from "@/components/cart-drawer"

const categories = [
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: Home,
    description: "Luxury properties & investments",
    image: "/placeholder.svg?height=300&width=400",
    featured: true,
  },
  {
    name: "Wines",
    slug: "wines",
    icon: Wine,
    description: "Premium wines & vintage collections",
    image: "/placeholder.svg?height=300&width=400",
    featured: true,
  },
  {
    name: "Cars",
    slug: "cars",
    icon: Car,
    description: "Luxury & exotic automobiles",
    image: "/placeholder.svg?height=300&width=400",
    featured: true,
  },
  {
    name: "Hair & Wigs",
    slug: "hair-wigs",
    icon: Scissors,
    description: "Premium hair products & luxury wigs",
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    icon: Sparkles,
    description: "Exclusive fragrances & luxury perfumes",
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
  },
]

const featuredProducts = [
  {
    id: 1,
    name: "Luxury Penthouse - Victoria Island",
    price: "₦850,000,000",
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=400",
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
    image: "/placeholder.svg?height=300&width=400",
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
    image: "/placeholder.svg?height=300&width=400",
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
    image: "/placeholder.svg?height=300&width=400",
    category: "Perfumes",
    rating: 5,
    reviews: 45,
    badge: "Best Seller",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Navigation Header */}
      <header className="bg-luxury-navy shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                  <span className="text-luxury-navy font-bold text-sm">AN</span>
                </div>
                <span className="text-luxury-gold font-playfair font-bold text-xl hidden sm:block">
                  ABL NATASHA EMPORIUM
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="text-luxury-cream hover:text-luxury-gold transition-colors duration-200 font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal"
              >
                <User className="h-4 w-4" />
              </Button>
              <CartDrawer />
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-luxury-navy text-luxury-cream py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy via-luxury-charcoal to-luxury-navy opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Luxury
            <span className="text-luxury-gold block">Redefined</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-luxury-cream/90">
            Discover an exclusive collection of premium real estate, vintage wines, exotic automobiles, luxury hair
            products, and exquisite fragrances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-luxury text-lg px-8 py-4">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="btn-luxury-outline text-lg px-8 py-4 bg-transparent">
              View Real Estate
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-luxury-navy mb-4">
              Premium Categories
            </h2>
            <p className="text-lg text-luxury-charcoal max-w-2xl mx-auto">
              Explore our curated selection of luxury products across multiple categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.slug} className="card-luxury group cursor-pointer overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-luxury-navy/20 group-hover:bg-luxury-navy/10 transition-colors duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <div className="bg-luxury-gold/90 p-2 rounded-full">
                        <IconComponent className="h-5 w-5 text-luxury-navy" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-playfair text-xl font-bold text-luxury-navy mb-2">{category.name}</h3>
                    <p className="text-luxury-charcoal mb-4">{category.description}</p>
                    <Button
                      variant="ghost"
                      className="text-luxury-gold hover:text-luxury-navy hover:bg-luxury-gold p-0 h-auto font-semibold"
                    >
                      Explore {category.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-luxury-navy mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-luxury-charcoal max-w-2xl mx-auto">
              Handpicked luxury items from our exclusive collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="card-luxury group cursor-pointer overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-luxury-gold text-luxury-navy font-semibold">
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
                  <h3 className="font-semibold text-luxury-navy mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-luxury-charcoal mb-3">{product.category}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-luxury-navy">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-luxury-charcoal line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="btn-luxury text-lg px-8 py-4">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 luxury-gradient text-luxury-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Experience Luxury Like Never Before
          </h2>
          <p className="text-xl mb-8 text-luxury-cream/90">
            Join our exclusive community and get access to premium products, early releases, and personalized luxury
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90 text-lg px-8 py-4 font-semibold">
              Join Our Community
            </Button>
            <Button
              variant="outline"
              className="border-luxury-cream text-luxury-cream hover:bg-luxury-cream hover:text-luxury-navy text-lg px-8 py-4 bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-navy text-luxury-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                  <span className="text-luxury-navy font-bold text-sm">AN</span>
                </div>
                <span className="text-luxury-gold font-playfair font-bold text-xl">ABL NATASHA EMPORIUM</span>
              </div>
              <p className="text-luxury-cream/80 mb-4 max-w-md">
                Your premier destination for luxury real estate, premium wines, exotic cars, luxury hair products, and
                exclusive fragrances.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-gold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-luxury-cream/80 hover:text-luxury-gold transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-luxury-gold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-luxury-cream/80 hover:text-luxury-gold transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-luxury-cream/80 hover:text-luxury-gold transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-luxury-cream/80 hover:text-luxury-gold transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-luxury-cream/80 hover:text-luxury-gold transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-luxury-charcoal mt-8 pt-8 text-center">
            <p className="text-luxury-cream/60">© 2024 ABL Natasha Emporium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
