import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Calendar, DollarSign, TrendingUp, AlertTriangle, Eye } from "lucide-react"
import { getAdminStats, formatCurrency } from "@/lib/admin"
import Link from "next/link"

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
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
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/bookings?status=pending",
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/admin/products?filter=low-stock",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Dashboard</h1>
        <p className="text-luxury-charcoal mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title} className="card-luxury">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-luxury-charcoal">{stat.title}</p>
                    <p className="text-2xl font-bold text-luxury-navy">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alertCards.map((alert) => {
          const IconComponent = alert.icon
          return (
            <Card key={alert.title} className="card-luxury">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-luxury-charcoal">{alert.title}</p>
                    <p className="text-2xl font-bold text-luxury-navy">{alert.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${alert.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${alert.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={alert.href}>
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-luxury-gold" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-luxury-cream/50 rounded-lg">
                    <div>
                      <p className="font-medium text-luxury-navy">#{order.order_number}</p>
                      <p className="text-sm text-luxury-charcoal">{order.shipping_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-luxury-navy">{formatCurrency(order.total_amount)}</p>
                      <Badge
                        className={
                          order.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <p className="text-luxury-charcoal text-center py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-luxury-gold" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-luxury-cream/50 rounded-lg">
                    <div>
                      <p className="font-medium text-luxury-navy">#{booking.booking_reference}</p>
                      <p className="text-sm text-luxury-charcoal">{booking.guest_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-luxury-navy">{formatCurrency(booking.total_amount)}</p>
                      <Badge
                        className={
                          booking.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/admin/bookings">View All Bookings</Link>
                </Button>
              </div>
            ) : (
              <p className="text-luxury-charcoal text-center py-8">No recent bookings</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="btn-luxury" asChild>
              <Link href="/admin/products/new">
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Manage Orders
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Bookings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
