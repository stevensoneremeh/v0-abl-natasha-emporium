"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Menu, Home, Wine, Car, Scissors, Sparkles, Search, User, ShoppingCart, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const categories = [
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: Home,
    description: "Luxury properties & investments",
  },
  {
    name: "Wines",
    slug: "wines",
    icon: Wine,
    description: "Premium wines & vintage collections",
  },
  {
    name: "Cars",
    slug: "cars",
    icon: Car,
    description: "Luxury & exotic automobiles",
  },
  {
    name: "Hair & Wigs",
    slug: "hair-wigs",
    icon: Scissors,
    description: "Premium hair products & luxury wigs",
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    icon: Sparkles,
    description: "Exclusive fragrances & luxury perfumes",
  },
]

interface MobileNavigationProps {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:max-w-sm bg-luxury-navy text-luxury-cream p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-3 text-luxury-gold">
              <Image
                src="/images/abl-logo.png"
                alt="ABL NATASHA ENTERPRISES"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-playfair font-bold text-lg">ABL NATASHA ENTERPRISES</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Quick Actions */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto py-3 text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal/50"
                onClick={() => setIsOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span className="text-xs">Search</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto py-3 text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal/50"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Account</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto py-3 text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal/50 relative"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs">Cart</span>
                <Badge className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-navy text-xs px-1 min-w-[1.25rem] h-5">
                  3
                </Badge>
              </Button>
            </div>
          </div>

          <Separator className="bg-luxury-charcoal" />

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <h3 className="text-luxury-gold font-semibold mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category, index) => {
                  const IconComponent = category.icon
                  return (
                    <motion.div
                      key={category.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-luxury-charcoal/50 transition-colors group"
                      >
                        <div className="bg-luxury-gold/10 p-2 rounded-lg group-hover:bg-luxury-gold/20 transition-colors">
                          <IconComponent className="h-5 w-5 text-luxury-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-luxury-cream group-hover:text-luxury-gold transition-colors">
                            {category.name}
                          </div>
                          <div className="text-sm text-luxury-cream/70">{category.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-luxury-cream/50 group-hover:text-luxury-gold transition-colors" />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            <Separator className="bg-luxury-charcoal" />

            {/* Additional Links */}
            <div className="px-6 py-4">
              <h3 className="text-luxury-gold font-semibold mb-4">More</h3>
              <nav className="space-y-2">
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block p-3 rounded-lg hover:bg-luxury-charcoal/50 transition-colors text-luxury-cream hover:text-luxury-gold"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block p-3 rounded-lg hover:bg-luxury-charcoal/50 transition-colors text-luxury-cream hover:text-luxury-gold"
                >
                  Contact
                </Link>
                <Link
                  href="/support"
                  onClick={() => setIsOpen(false)}
                  className="block p-3 rounded-lg hover:bg-luxury-charcoal/50 transition-colors text-luxury-cream hover:text-luxury-gold"
                >
                  Support
                </Link>
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-luxury-charcoal">
            <p className="text-luxury-cream/60 text-sm text-center">© 2024 ABL Natasha Enterprises</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
