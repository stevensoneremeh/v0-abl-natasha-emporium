"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Grid3X3,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    showBadge: true,
  },
  {
    name: "Account",
    href: "/account",
    icon: User,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const isMobile = useIsMobile()

  // Only show on mobile devices
  if (!isMobile) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-luxury-navy border-t border-luxury-charcoal/50 backdrop-blur-lg bg-luxury-navy/95 md:hidden"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <motion.div whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  variant="ghost"
                  className={`w-full flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                    isActive
                      ? "text-luxury-gold bg-luxury-gold/10"
                      : "text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal/50"
                  }`}
                >
                  <div className="relative">
                    <IconComponent className="h-5 w-5" />
                    {item.showBadge && itemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-navy text-xs px-1 min-w-[1.25rem] h-5">
                        {itemCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-luxury-gold rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
