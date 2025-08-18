"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    trend: number
  }
  orders: {
    current: number
    previous: number
    trend: number
  }
  customers: {
    current: number
    previous: number
    trend: number
  }
  products: {
    current: number
    previous: number
    trend: number
  }
  revenueChart: Array<{ month: string; revenue: number; orders: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  recentActivity: Array<{ type: string; description: string; time: string; amount?: number }>
}

// Mock data - in real app, this would come from API
const mockAnalyticsData: AnalyticsData = {
  revenue: { current: 2450000, previous: 2100000, trend: 16.7 },
  orders: { current: 156, previous: 142, trend: 9.9 },
  customers: { current: 89, previous: 76, trend: 17.1 },
  products: { current: 234, previous: 228, trend: 2.6 },
  revenueChart: [
    { month: "Jan", revenue: 1800000, orders: 120 },
    { month: "Feb", revenue: 2100000, orders: 135 },
    { month: "Mar", revenue: 2450000, orders: 156 },
    { month: "Apr", revenue: 2200000, orders: 148 },
    { month: "May", revenue: 2800000, orders: 172 },
    { month: "Jun", revenue: 3100000, orders: 189 },
  ],
  topProducts: [
    { name: "Luxury Penthouse - Victoria Island", sales: 2, revenue: 1700000000 },
    { name: "Dom Pérignon Vintage 2013", sales: 12, revenue: 5400000 },
    { name: "Mercedes-Benz S-Class 2024", sales: 1, revenue: 95000000 },
    { name: "Tom Ford Black Orchid", sales: 28, revenue: 5180000 },
  ],
  recentActivity: [
    { type: "order", description: "New order #ORD-2024-001", time: "2 minutes ago", amount: 450000 },
    { type: "booking", description: "Property booking confirmed", time: "15 minutes ago", amount: 2500000 },
    { type: "product", description: "New product added: Hermès Birkin", time: "1 hour ago" },
    { type: "user", description: "New customer registration", time: "2 hours ago" },
  ],
}

export function AdminAnalyticsCharts() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const MetricCard = ({
    title,
    current,
    previous,
    trend,
    icon: Icon,
    color,
  }: {
    title: string
    current: number | string
    previous: number
    trend: number
    icon: any
    color: string
  }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-luxury-charcoal">{title}</p>
              <p className="text-2xl font-bold text-luxury-navy">
                {typeof current === "number" ? formatCurrency(current) : current}
              </p>
              <div className="flex items-center mt-2">
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(trend)}%
                </span>
                <span className="text-sm text-luxury-charcoal ml-1">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-luxury">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          current={data.revenue.current}
          previous={data.revenue.previous}
          trend={data.revenue.trend}
          icon={DollarSign}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Orders"
          current={data.orders.current.toString()}
          previous={data.orders.previous}
          trend={data.orders.trend}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <MetricCard
          title="New Customers"
          current={data.customers.current.toString()}
          previous={data.customers.previous}
          trend={data.customers.trend}
          icon={Users}
          color="bg-purple-500"
        />
        <MetricCard
          title="Active Products"
          current={data.products.current.toString()}
          previous={data.products.previous}
          trend={data.products.trend}
          icon={Package}
          color="bg-orange-500"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-luxury-gold" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.revenueChart.map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium text-luxury-charcoal">{item.month}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                        <motion.div
                          className="bg-luxury-gold h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.revenue / 3100000) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-luxury-navy">{formatCurrency(item.revenue)}</div>
                      <div className="text-xs text-luxury-charcoal">{item.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-luxury-gold" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-luxury-cream/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-luxury-navy line-clamp-1">{product.name}</p>
                      <p className="text-sm text-luxury-charcoal">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-luxury-navy">{formatCurrency(product.revenue)}</p>
                      <Badge className="bg-luxury-gold text-luxury-navy text-xs">#{index + 1}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border-l-4 border-luxury-gold bg-luxury-cream/20 rounded-r-lg"
                >
                  <div>
                    <p className="font-medium text-luxury-navy">{activity.description}</p>
                    <p className="text-sm text-luxury-charcoal">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="font-semibold text-luxury-navy">{formatCurrency(activity.amount)}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
