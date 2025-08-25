"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, Calendar, Loader2, Edit } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils/currency"

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  shipping_amount: number
  tax_amount: number
  subtotal: number
  payment_status: string
  payment_method: string
  created_at: string
  updated_at: string
  shipping_name: string
  shipping_email: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_country: string
  billing_name: string
  billing_email: string
  billing_phone: string
  billing_address: string
  billing_city: string
  billing_state: string
  billing_postal_code: string
  billing_country: string
  notes: string
  tracking_number: string
  shipped_at: string
  delivered_at: string
  items: OrderItem[]
}

const orderStatuses = [
  { value: "pending", label: "Pending", color: "bg-orange-100 text-orange-800" },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
]

const paymentStatuses = [
  { value: "pending", label: "Pending", color: "bg-orange-100 text-orange-800" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
]

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`)
        if (!response.ok) throw new Error("Failed to fetch order")

        const orderData = await response.json()
        setOrder(orderData)
      } catch (error) {
        toast.error("Failed to load order")
        router.push("/admin/orders")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, router])

  const updateOrderStatus = async (status: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update order")

      const updatedOrder = await response.json()
      setOrder(updatedOrder)
      toast.success("Order status updated successfully")
    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setUpdating(false)
    }
  }

  const updatePaymentStatus = async (paymentStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: paymentStatus }),
      })

      if (!response.ok) throw new Error("Failed to update payment status")

      const updatedOrder = await response.json()
      setOrder(updatedOrder)
      toast.success("Payment status updated successfully")
    } catch (error) {
      toast.error("Failed to update payment status")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-luxury-gold mx-auto mb-4 animate-spin" />
          <p className="text-luxury-charcoal">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-charcoal">Order not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statuses = type === "order" ? orderStatuses : paymentStatuses
    const statusConfig = statuses.find((s) => s.value === status)
    return <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>{statusConfig?.label || status}</Badge>
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Order #{order.order_number}</h1>
          <p className="text-luxury-charcoal">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(order.status, "order")}
          {getStatusBadge(order.payment_status, "payment")}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-luxury-gold" />
                  Order Items ({order.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-luxury-cream/30 rounded-lg"
                    >
                      <img
                        src={item.product_image || "/placeholder.svg?height=60&width=60"}
                        alt={item.product_name}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-luxury-navy">{item.product_name}</h4>
                        <p className="text-sm text-luxury-charcoal">
                          Quantity: {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-luxury-navy">{formatCurrency(item.total_price)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-charcoal">Subtotal:</span>
                    <span className="text-luxury-navy">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-charcoal">Shipping:</span>
                    <span className="text-luxury-navy">{formatCurrency(order.shipping_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-charcoal">Tax:</span>
                    <span className="text-luxury-navy">{formatCurrency(order.tax_amount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-luxury-navy">Total:</span>
                    <span className="text-luxury-navy">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Shipping Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-luxury-gold" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-luxury-navy mb-2">Shipping Address</h4>
                    <div className="text-sm text-luxury-charcoal space-y-1">
                      <p className="font-medium">{order.shipping_name}</p>
                      <p>{order.shipping_address}</p>
                      <p>
                        {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                      </p>
                      <p>{order.shipping_country}</p>
                      <p>{order.shipping_phone}</p>
                      <p>{order.shipping_email}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-navy mb-2">Billing Address</h4>
                    <div className="text-sm text-luxury-charcoal space-y-1">
                      <p className="font-medium">{order.billing_name}</p>
                      <p>{order.billing_address}</p>
                      <p>
                        {order.billing_city}, {order.billing_state} {order.billing_postal_code}
                      </p>
                      <p>{order.billing_country}</p>
                      <p>{order.billing_phone}</p>
                      <p>{order.billing_email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status Management */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-luxury-gold" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-luxury-navy">Order Status</label>
                  <Select value={order.status} onValueChange={updateOrderStatus} disabled={updating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-luxury-navy">Payment Status</label>
                  <Select value={order.payment_status} onValueChange={updatePaymentStatus} disabled={updating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Information */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-luxury-gold" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Method:</span>
                  <span className="text-sm font-medium text-luxury-navy">{order.payment_method || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Status:</span>
                  {getStatusBadge(order.payment_status, "payment")}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Total:</span>
                  <span className="text-sm font-semibold text-luxury-navy">{formatCurrency(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Shipping Tracking */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-luxury-gold" />
                  Shipping Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Tracking Number:</span>
                  <span className="text-sm font-medium text-luxury-navy">{order.tracking_number || "N/A"}</span>
                </div>
                {order.shipped_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-luxury-charcoal">Shipped:</span>
                    <span className="text-sm text-luxury-navy">{new Date(order.shipped_at).toLocaleDateString()}</span>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-luxury-charcoal">Delivered:</span>
                    <span className="text-sm text-luxury-navy">
                      {new Date(order.delivered_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Timeline */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-luxury-gold" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Created:</span>
                  <span className="text-sm text-luxury-navy">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-luxury-charcoal">Last Updated:</span>
                  <span className="text-sm text-luxury-navy">{new Date(order.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Information */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-luxury-gold" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-luxury-navy">{order.shipping_name}</p>
                  <p className="text-sm text-luxury-charcoal">{order.shipping_email}</p>
                  <p className="text-sm text-luxury-charcoal">{order.shipping_phone}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href={`/admin/users?search=${order.shipping_email}`}>View Customer</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
