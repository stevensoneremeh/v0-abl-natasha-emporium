"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Heart, Package, TrendingUp, ArrowRight, Calendar, UserIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    [key: string]: any
  }
  [key: string]: any
}

interface DashboardOverviewProps {
  user: User
  profile: any
  recentOrders: any[]
  wishlistCount: number
}

export function DashboardOverview({ user, profile, recentOrders, wishlistCount }: DashboardOverviewProps) {
  const totalSpent = recentOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

  const stats = [
    {
      title: "Total Orders",
      value: recentOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Wishlist Items",
      value: wishlistCount.toString(),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Spent",
      value: `₦${totalSpent.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Orders",
      value: recentOrders.filter((order) => order.status === "processing").length.toString(),
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-luxury-navy to-luxury-charcoal rounded-2xl p-8 text-white"
      >
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold mb-2">
          Welcome back, {profile?.full_name || user.email?.split("@")[0]}!
        </h1>
        <p className="text-luxury-cream/80 text-lg">
          Manage your luxury shopping experience from your personal dashboard
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-luxury">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-luxury-charcoal">{stat.title}</p>
                      <p className="text-2xl font-bold text-luxury-navy mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-playfair text-xl text-luxury-navy">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/orders">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-luxury-cream rounded-lg">
                    <div>
                      <p className="font-semibold text-luxury-navy">Order #{order.order_number}</p>
                      <p className="text-sm text-luxury-charcoal flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-luxury-navy">₦{order.total_amount?.toLocaleString()}</p>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-luxury-charcoal/50 mx-auto mb-4" />
                  <p className="text-luxury-charcoal">No orders yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-luxury-navy">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start gap-3 bg-transparent" variant="outline" asChild>
                <Link href="/dashboard/profile">
                  <UserIcon className="h-5 w-5" />
                  Update Profile
                </Link>
              </Button>
              <Button className="w-full justify-start gap-3 bg-transparent" variant="outline" asChild>
                <Link href="/dashboard/wishlist">
                  <Heart className="h-5 w-5" />
                  View Wishlist ({wishlistCount})
                </Link>
              </Button>
              <Button className="w-full justify-start gap-3 bg-transparent" variant="outline" asChild>
                <Link href="/categories/real-estate">
                  <Package className="h-5 w-5" />
                  Browse Real Estate
                </Link>
              </Button>
              <Button className="w-full justify-start gap-3" asChild>
                <Link href="/">
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
