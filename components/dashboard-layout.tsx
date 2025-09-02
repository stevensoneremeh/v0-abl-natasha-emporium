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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 md:pb-0">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Image src="/images/abl-logo.png" alt="ABL" width={20} height={20} className="object-contain" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">Dashboard</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{user?.email?.[0].toUpperCase() || "U"}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">Welcome back,</p>
                    <p className="text-slate-600 truncate text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                {navigation.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={() => {
                    setSidebarOpen(false)
                    signOut()
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
          <Card className="flex flex-col flex-1 m-4 overflow-hidden shadow-xl border-2 border-slate-200/50">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <Image
                    src="/images/abl-logo.png"
                    alt="ABL NATASHA ENTERPRISES"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="text-slate-900 font-serif font-bold text-lg">ABL NATASHA</span>
              </Link>
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
                <p className="text-sm font-medium text-slate-900">Welcome back,</p>
                <p className="text-slate-600 truncate">{user?.email}</p>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                onClick={signOut}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:pl-80 flex-1">
          {/* Mobile Header */}
          <div className="sticky top-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Image
                    src="/images/abl-logo.png"
                    alt="ABL NATASHA ENTERPRISES"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <span className="text-slate-900 font-serif font-bold text-sm">ABL NATASHA</span>
              </Link>
              <div className="w-10" />
            </div>
          </div>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
