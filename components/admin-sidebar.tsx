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
  Upload,
  CreditCard,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: 3 },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar, badge: 2 },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Real Estate", href: "/admin/real-estate", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Media", href: "/admin/media", icon: Upload },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(5)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    checkScreenSize()

    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 30000)

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
            className="bg-white/95 backdrop-blur-sm shadow-lg border-primary/20 hover:bg-primary/5 relative"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5 animate-pulse">
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
          animate={{ x: isOpen || isLargeScreen ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Image src="/images/abl-logo.png" alt="ABL" width={24} height={24} className="object-contain" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                <div>
                  <span className="text-white font-serif font-bold text-lg">ABL NATASHA</span>
                  <p className="text-slate-400 text-xs font-medium">Admin Dashboard</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-primary hover:bg-slate-800/50 relative"
                >
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-[1rem] h-4 animate-bounce">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <div className="relative flex items-center w-full">
                        <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 animate-pulse">
                                {item.badge}
                              </Badge>
                            </motion.div>
                          )}
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                            }`}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="px-4 py-4 border-t border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{user?.email?.[0].toUpperCase() || "A"}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">Admin User</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || "admin@ablnatasha.com"}</p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
