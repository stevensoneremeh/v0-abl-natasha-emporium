"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Real Estate", href: "/admin/real-estate", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="bg-white shadow-md">
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-luxury-navy transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-luxury-charcoal">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                <span className="text-luxury-navy font-bold text-sm">AN</span>
              </div>
              <div>
                <span className="text-luxury-gold font-playfair font-bold text-lg">ABL NATASHA</span>
                <p className="text-luxury-cream/60 text-xs">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-luxury-gold text-luxury-navy"
                      : "text-luxury-cream hover:bg-luxury-charcoal hover:text-luxury-gold"
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.name === "Orders" && <Badge className="ml-auto bg-red-500 text-white text-xs">3</Badge>}
                  {item.name === "Bookings" && <Badge className="ml-auto bg-blue-500 text-white text-xs">2</Badge>}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-luxury-charcoal">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                <span className="text-luxury-navy font-bold text-sm">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-luxury-cream">Admin User</p>
                <p className="text-xs text-luxury-cream/60">admin@ablnatasha.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
