"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, CreditCard, Download } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import Link from "next/link"
import Image from "next/image"

interface OrderDetails {
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  shipping_info: any
  created_at: string
  order_items: Array<{
    id: string
    quantity: number
    price: number
    products: {
      name: string
      images: string[]
    }
  }>
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderNumber) {
      setError("Order number not found")
      setLoading(false)
      return
    }

    // Fetch order details
    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order)
        } else {
          setError(data.error || "Order not found")
        }
      })
      .catch((err) => {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-luxury-gold mx-auto mb-4 animate-pulse" />
          <p className="text-luxury-charcoal">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-luxury-navy mb-2">Order Not Found</h1>
          <p className="text-luxury-charcoal mb-6">{error}</p>
          <Link href="/">
            <Button className="btn-luxury">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-luxury-navy mb-2">Order Confirmed!</h1>
          <p className="text-luxury-charcoal">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <Badge
                    variant={order.payment_status === "completed" ? "default" : "secondary"}
                    className={order.payment_status === "completed" ? "bg-green-100 text-green-800" : ""}
                  >
                    {order.payment_status === "completed" ? "Paid" : "Pending"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-luxury-charcoal">Order Number</p>
                    <p className="font-semibold text-luxury-navy">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-luxury-charcoal">Order Date</p>
                    <p className="font-semibold text-luxury-navy">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-luxury-charcoal">Status</p>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <div>
                    <p className="text-luxury-charcoal">Total Amount</p>
                    <p className="font-semibold text-luxury-navy">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.products?.images?.[0] || "/placeholder.svg?height=64&width=64"}
                          alt={item.products?.name || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-luxury-navy">{item.products?.name}</h4>
                        <p className="text-sm text-luxury-charcoal">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-luxury-navy">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-luxury-gold mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Payment Confirmed</p>
                    <p className="text-xs text-luxury-charcoal">Your payment has been processed successfully</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-luxury-gold mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Processing Order</p>
                    <p className="text-xs text-luxury-charcoal">We're preparing your items for shipment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-luxury-charcoal/50 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-luxury-charcoal/70">Shipping</p>
                    <p className="text-xs text-luxury-charcoal">You'll receive tracking info soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Link href="/" className="block">
                  <Button className="w-full btn-luxury">Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
