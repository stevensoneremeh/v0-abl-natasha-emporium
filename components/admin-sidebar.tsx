"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Home,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Calendar,
  Tag,
  Bell,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: 3 },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar, badge: 2 },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Real Estate", href: "/admin/real-estate", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(5)
  const pathname = usePathname()

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setNotifications((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white shadow-md relative"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5">
                {notifications}
              </Badge>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-luxury-navy transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-charcoal">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                  <span className="text-luxury-navy font-bold text-sm">AN</span>
                </div>
                <div>
                  <span className="text-luxury-gold font-playfair font-bold text-lg">ABL NATASHA</span>
                  <p className="text-luxury-cream/60 text-xs">Admin Panel</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="text-luxury-cream hover:text-luxury-gold relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-[1rem] h-4">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-luxury-gold text-luxury-navy shadow-lg"
                          : "text-luxury-cream hover:bg-luxury-charcoal hover:text-luxury-gold"
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mr-3" />
                      {item.name}
                      {item.badge && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                          <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="px-4 py-4 border-t border-luxury-charcoal">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                    <span className="text-luxury-navy font-bold text-sm">A</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-luxury-cream">Admin User</p>
                    <p className="text-xs text-luxury-cream/60">admin@ablnatasha.com</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-luxury-cream hover:text-luxury-gold"
                    onClick={() => {
                      // TODO: Implement logout functionality
                      console.log("Logout clicked")
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
