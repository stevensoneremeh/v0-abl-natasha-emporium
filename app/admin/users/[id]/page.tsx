"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShoppingCart, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils/currency"

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  created_at: string
  updated_at: string
  is_active: boolean
  last_login: string
}

interface UserOrder {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  items_count: number
}

interface UserStats {
  total_orders: number
  total_spent: number
  average_order_value: number
  last_order_date: string
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, ordersResponse, statsResponse] = await Promise.all([
          fetch(`/api/admin/users/${userId}`),
          fetch(`/api/admin/users/${userId}/orders`),
          fetch(`/api/admin/users/${userId}/stats`),
        ])

        if (!userResponse.ok) throw new Error("Failed to fetch user")

        const [userData, ordersData, statsData] = await Promise.all([
          userResponse.json(),
          ordersResponse.ok ? ordersResponse.json() : [],
          statsResponse.ok ? statsResponse.json() : null,
        ])

        setUser(userData)
        setOrders(ordersData)
        setStats(statsData)
      } catch (error) {
        toast.error("Failed to load user data")
        router.push("/admin/users")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-luxury-gold mx-auto mb-4 animate-spin" />
          <p className="text-luxury-charcoal">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-charcoal">User not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">{user.full_name || "User Profile"}</h1>
          <p className="text-luxury-charcoal">
            Member since{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="card-luxury">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-charcoal">Total Orders</p>
                      <p className="text-xl font-bold text-luxury-navy">{stats?.total_orders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-charcoal">Total Spent</p>
                      <p className="text-xl font-bold text-luxury-navy">{formatCurrency(stats?.total_spent || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-charcoal">Avg Order Value</p>
                      <p className="text-xl font-bold text-luxury-navy">
                        {formatCurrency(stats?.average_order_value || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-luxury-charcoal">Last Login</p>
                      <p className="text-sm font-medium text-luxury-navy">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="flex items-center justify-between p-4 bg-luxury-cream/30 rounded-lg hover:bg-luxury-cream/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-luxury-navy">#{order.order_number}</p>
                              <p className="text-sm text-luxury-charcoal">
                                {new Date(order.created_at).toLocaleDateString()} • {order.items_count} items
                              </p>
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
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>View</Link>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-luxury-charcoal text-center py-8">No orders found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-luxury-charcoal text-center py-8">Activity log feature coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-luxury-gold" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-luxury-charcoal" />
                  <span className="text-sm text-luxury-navy">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-luxury-charcoal" />
                    <span className="text-sm text-luxury-navy">{user.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Address Information */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-luxury-gold" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.address ? (
                  <div className="text-sm text-luxury-charcoal space-y-1">
                    <p>{user.address}</p>
                    <p>
                      {user.city}, {user.state} {user.postal_code}
                    </p>
                    <p>{user.country}</p>
                  </div>
                ) : (
                  <p className="text-sm text-luxury-charcoal">No address provided</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-luxury-gold" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Joined:</span>
                  <span className="text-sm text-luxury-navy">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Last Updated:</span>
                  <span className="text-sm text-luxury-navy">{new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Status:</span>
                  <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
