"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  ShoppingCart,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Users,
  BarChart3,
  Plus,
  ArrowUpRight,
  Activity,
} from "lucide-react"
import { AdminAnalyticsCharts } from "@/components/admin-analytics-charts"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalBookings: number
  totalRevenue: number
  pendingOrders: number
  pendingBookings: number
  lowStockProducts: number
  recentOrders: any[]
  recentBookings: any[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    pendingBookings: 0,
    lowStockProducts: 0,
    recentOrders: [],
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-luxury-gold mx-auto mb-4 animate-pulse" />
            <p className="text-luxury-charcoal">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      change: "+23%",
      changeType: "positive" as const,
    },
  ]

  const alertCards = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/orders?status=pending",
      priority: "high" as const,
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/bookings?status=pending",
      priority: "medium" as const,
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/admin/products?filter=low-stock",
      priority: "high" as const,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-serif mb-2">Dashboard</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            Welcome back! Here's what's happening with your luxury emporium today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:items-end gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="h-4 w-4" />
            <span>Live Updates</span>
          </div>
          <p className="text-sm font-medium text-slate-700">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card
                className={`relative overflow-hidden border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 bg-white`}
              >
                <div className={`absolute inset-0 ${stat.bgColor} opacity-50`}></div>
                <CardContent className="p-4 sm:p-6 relative">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                      <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <TrendIcon
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"}`}
                      />
                      <span
                        className={`font-semibold ${stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">vs last month</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-2 border-slate-200 shadow-lg bg-white">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Analytics Overview
                </CardTitle>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Real-time business insights and performance metrics
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="hover:bg-primary hover:text-white transition-colors w-full sm:w-auto bg-transparent"
              >
                <Link href="/admin/analytics">
                  <span className="sm:hidden">Analytics</span>
                  <span className="hidden sm:inline">View Full Analytics</span>
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <AdminAnalyticsCharts />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
            Action Required
          </h2>
          <Badge className="bg-red-100 text-red-800 px-3 py-1 w-fit">
            {alertCards.reduce((sum, card) => sum + card.value, 0)} Items
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {alertCards.map((alert, index) => {
            const IconComponent = alert.icon
            return (
              <motion.div
                key={alert.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card
                  className={`relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 bg-white ${
                    alert.priority === "high" ? "border-red-200 ring-2 ring-red-100" : "border-slate-200"
                  }`}
                >
                  <div className={`absolute inset-0 ${alert.bgColor} opacity-30`}></div>
                  <CardContent className="p-4 sm:p-6 relative">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-xl ${alert.bgColor} border-2 border-white shadow-sm`}>
                        <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${alert.color}`} />
                      </div>
                      {alert.priority === "high" && (
                        <Badge className="bg-red-500 text-white text-xs animate-pulse">Urgent</Badge>
                      )}
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">{alert.title}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900">{alert.value}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full hover:bg-primary hover:text-white transition-colors bg-transparent"
                    >
                      <Link href={alert.href}>
                        <Eye className="h-4 w-4 mr-2" />
                        View All
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card className="border-2 border-slate-200 shadow-lg bg-white">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-slate-900 text-lg sm:text-xl">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {stats.recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-200 border border-slate-200"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">#{order.order_number}</p>
                        <p className="text-xs sm:text-sm text-slate-600 truncate">{order.shipping_name}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-slate-900 text-sm sm:text-base">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <Badge
                          className={`text-xs ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primary hover:text-white transition-colors bg-transparent"
                    asChild
                  >
                    <Link href="/admin/orders">View All Orders</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No recent orders</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card className="border-2 border-slate-200 shadow-lg bg-white">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-slate-900 text-lg sm:text-xl">
                <Calendar className="h-5 w-5 text-purple-600" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {stats.recentBookings.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {stats.recentBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-200 border border-slate-200"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">
                          #{booking.booking_reference}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 truncate">{booking.guest_name}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-slate-900 text-sm sm:text-base">
                          {formatCurrency(booking.total_amount)}
                        </p>
                        <Badge
                          className={`text-xs ${
                            booking.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : booking.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primary hover:text-white transition-colors bg-transparent"
                    asChild
                  >
                    <Link href="/admin/bookings">View All Bookings</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No recent bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
        <Card className="border-2 border-slate-200 shadow-lg bg-white">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 p-4 sm:p-6">
            <CardTitle className="text-slate-900 font-serif text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                asChild
              >
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors bg-transparent"
                asChild
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Manage Orders</span>
                  <span className="sm:hidden">Orders</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors bg-transparent"
                asChild
              >
                <Link href="/admin/bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Manage Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors bg-transparent"
                asChild
              >
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Manage Users</span>
                  <span className="sm:hidden">Users</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
