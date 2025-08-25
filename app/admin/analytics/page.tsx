"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from "lucide-react"

const COLORS = ["#C9A96E", "#2C3E50", "#E74C3C", "#3498DB", "#9B59B6", "#1ABC9C"]

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    productsGrowth: 0,
  })

  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Mock data for demonstration
      setStats({
        totalRevenue: 125430.5,
        totalOrders: 1247,
        totalUsers: 3456,
        totalProducts: 89,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        usersGrowth: 15.7,
        productsGrowth: 5.2,
      })

      setSalesData([
        { month: "Jan", revenue: 12000, orders: 120 },
        { month: "Feb", revenue: 15000, orders: 150 },
        { month: "Mar", revenue: 18000, orders: 180 },
        { month: "Apr", revenue: 22000, orders: 220 },
        { month: "May", revenue: 25000, orders: 250 },
        { month: "Jun", revenue: 28000, orders: 280 },
      ])

      setCategoryData([
        { name: "Real Estate", value: 45, color: "#C9A96E" },
        { name: "Luxury Goods", value: 25, color: "#2C3E50" },
        { name: "Electronics", value: 15, color: "#E74C3C" },
        { name: "Fashion", value: 10, color: "#3498DB" },
        { name: "Other", value: 5, color: "#9B59B6" },
      ])

      setTopProducts([
        { name: "Luxury Villa in Miami", sales: 45, revenue: 2500000 },
        { name: "Premium Watch Collection", sales: 123, revenue: 125000 },
        { name: "Designer Handbag", sales: 89, revenue: 45000 },
        { name: "Smart Home System", sales: 67, revenue: 35000 },
        { name: "Luxury Car", sales: 12, revenue: 850000 },
      ])
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BarChart className="h-8 w-8 text-luxury-gold" />
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Analytics</h1>
          <p className="text-luxury-charcoal mt-2">Track your business performance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-charcoal">Total Revenue</p>
                <p className="text-2xl font-bold text-luxury-navy">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-luxury-gold" />
            </div>
            <div className="flex items-center mt-2">
              {stats.revenueGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.revenueGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-charcoal">Total Orders</p>
                <p className="text-2xl font-bold text-luxury-navy">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-luxury-gold" />
            </div>
            <div className="flex items-center mt-2">
              {stats.ordersGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats.ordersGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.ordersGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-charcoal">Total Users</p>
                <p className="text-2xl font-bold text-luxury-navy">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-luxury-gold" />
            </div>
            <div className="flex items-center mt-2">
              {stats.usersGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats.usersGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.usersGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-charcoal">Total Products</p>
                <p className="text-2xl font-bold text-luxury-navy">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-luxury-gold" />
            </div>
            <div className="flex items-center mt-2">
              {stats.productsGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats.productsGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.productsGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-luxury-cream rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <h4 className="font-semibold text-luxury-navy">{product.name}</h4>
                    <p className="text-sm text-luxury-charcoal">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-luxury-navy">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-luxury-charcoal">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
