"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, ShoppingBag, Heart, Settings, LogOut, Menu, X, Home } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-luxury-cream">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-playfair text-xl font-bold text-luxury-navy">Dashboard</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="p-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-luxury-gold text-luxury-navy font-semibold"
                          : "text-luxury-charcoal hover:bg-luxury-cream hover:text-luxury-navy"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:flex">
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
          <Card className="flex flex-col flex-1 m-4 overflow-hidden">
            <div className="p-6 border-b">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/abl-logo.png"
                  alt="ABL NATASHA ENTERPRISES"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-luxury-gold font-playfair font-bold text-lg">ABL NATASHA ENTERPRISES</span>
              </Link>
              <div className="mt-4 p-4 bg-luxury-cream rounded-lg">
                <p className="text-sm font-medium text-luxury-navy">Welcome back,</p>
                <p className="text-luxury-charcoal truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-luxury-gold text-luxury-navy font-semibold"
                        : "text-luxury-charcoal hover:bg-luxury-cream hover:text-luxury-navy"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="p-6 border-t">
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={signOut}>
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:pl-80 flex-1">
          <div className="sticky top-0 z-40 lg:hidden bg-white border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/abl-logo.png"
                  alt="ABL NATASHA ENTERPRISES"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="text-luxury-gold font-playfair font-bold">ABL NATASHA ENTERPRISES</span>
              </Link>
              <div className="w-10" />
            </div>
          </div>

          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
