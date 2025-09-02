import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingCart, DollarSign, Plus, AlertTriangle, TrendingUp, Calendar, Bell } from "lucide-react"
import Link from "next/link"

async function getAdminStats() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || ["talktostevenson@gmail.com"]
  if (!adminEmails.includes(user.email!)) {
    redirect("/unauthorized")
  }

  const [
    { count: totalUsers },
    { count: totalProducts },
    { count: totalOrders },
    { data: recentOrders },
    { data: lowStockProducts },
    { data: pendingOrders },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("name, stock_quantity, low_stock_threshold").lte("stock_quantity", 5).limit(5),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total_amount, created_at").eq("payment_status", "completed"),
  ])

  // Calculate total revenue
  const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  return {
    totalUsers: totalUsers || 0,
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
    lowStockProducts: lowStockProducts || [],
    pendingOrdersCount: pendingOrders || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury-navy font-playfair">Admin Dashboard</h1>
          <p className="text-luxury-charcoal">Welcome to ABL NATASHA ENTERPRISES admin panel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {(stats.lowStockProducts.length > 0 || stats.pendingOrdersCount > 0) && (
              <Badge className="ml-2 bg-red-500 text-white">
                {stats.lowStockProducts.length + stats.pendingOrdersCount}
              </Badge>
            )}
          </Button>
          <Button asChild className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {(stats.lowStockProducts.length > 0 || stats.pendingOrdersCount > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.lowStockProducts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700 mb-3">
                  {stats.lowStockProducts.length} products are running low on stock
                </p>
                <div className="space-y-2">
                  {stats.lowStockProducts.slice(0, 3).map((product: any) => (
                    <div key={product.name} className="flex justify-between text-sm">
                      <span className="text-orange-800">{product.name}</span>
                      <span className="text-orange-600">{product.stock_quantity} left</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent" asChild>
                  <Link href="/admin/products?filter=low-stock">View All</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {stats.pendingOrdersCount > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <ShoppingCart className="h-5 w-5" />
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 mb-3">
                  {stats.pendingOrdersCount} orders are waiting for processing
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/orders?status=pending">Process Orders</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Total Users</CardTitle>
            <Users className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-navy">{stats.totalUsers}</div>
            <p className="text-xs text-luxury-charcoal">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Total Products</CardTitle>
            <Package className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-navy">{stats.totalProducts}</div>
            <p className="text-xs text-luxury-charcoal">Active products</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-navy">{stats.totalOrders}</div>
            <p className="text-xs text-luxury-charcoal">All time orders</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-navy">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-luxury-charcoal flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle className="text-luxury-navy">Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-luxury-cream rounded-lg hover:bg-luxury-cream/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-luxury-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-luxury-navy">Order #{order.order_number}</p>
                      <p className="text-sm text-luxury-charcoal flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-luxury-navy">₦{order.total_amount?.toLocaleString()}</p>
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-luxury-charcoal text-center py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-luxury hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/products">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-luxury-navy">
                <Package className="h-5 w-5 text-luxury-gold" />
                Manage Products
              </CardTitle>
              <CardDescription>Add, edit, and organize your product catalog</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="card-luxury hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/orders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-luxury-navy">
                <ShoppingCart className="h-5 w-5 text-luxury-gold" />
                View Orders
              </CardTitle>
              <CardDescription>Process and manage customer orders</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="card-luxury hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/users">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-luxury-navy">
                <Users className="h-5 w-5 text-luxury-gold" />
                Manage Users
              </CardTitle>
              <CardDescription>View and manage customer accounts</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="card-luxury hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/analytics">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-luxury-navy">
                <TrendingUp className="h-5 w-5 text-luxury-gold" />
                Analytics
              </CardTitle>
              <CardDescription>View business performance and insights</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}
