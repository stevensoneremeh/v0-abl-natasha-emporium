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
    href: "/dashboard",
    icon: User,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const isMobile = useIsMobile()

  // Only show on mobile devices and hide on admin pages
  if (!isMobile || pathname.startsWith("/admin")) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-slate-200/50 backdrop-blur-xl md:hidden shadow-2xl"
    >
      <div className="safe-area-inset-bottom">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link key={item.name} href={item.href} className="flex-1 max-w-[20%]">
                <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.02 }} className="relative">
                  <Button
                    variant="ghost"
                    className={`w-full flex flex-col items-center gap-1 h-auto py-3 px-2 transition-all duration-300 rounded-xl ${
                      isActive
                        ? "text-primary bg-gradient-to-t from-primary/10 to-primary/5 shadow-lg border border-primary/20"
                        : "text-slate-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <div className="relative">
                      <IconComponent
                        className={`h-5 w-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                      />
                      {item.showBadge && itemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 min-w-[1.25rem] h-5 animate-pulse shadow-lg">
                          {itemCount > 99 ? "99+" : itemCount}
                        </Badge>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium transition-all duration-200 ${isActive ? "font-semibold" : ""}`}
                    >
                      {item.name}
                    </span>
                  </Button>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full shadow-sm"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
