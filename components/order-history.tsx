"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Calendar, MapPin, CreditCard, Eye } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface OrderHistoryProps {
  orders: any[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (orders.length === 0) {
    return (
      <Card className="card-luxury">
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
          <h3 className="font-playfair text-xl font-semibold text-luxury-navy mb-2">No Orders Yet</h3>
          <p className="text-luxury-charcoal mb-6">Start shopping to see your order history here</p>
          <Button asChild>
            <a href="/">Browse Products</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="card-luxury">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="font-playfair text-xl text-luxury-navy">Order #{order.order_number}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-luxury-charcoal mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {order.payment_method || "Card"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  <div className="text-right">
                    <p className="font-bold text-luxury-navy text-lg">₦{order.total_amount?.toLocaleString()}</p>
                    <p className="text-sm text-luxury-charcoal">{order.order_items?.length || 0} items</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.order_items?.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-luxury-cream rounded-lg">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white">
                      {item.products?.images?.[0] ? (
                        <Image
                          src={item.products.images[0] || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-luxury-charcoal/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-luxury-charcoal/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-luxury-navy text-sm truncate">{item.product_name}</p>
                      <p className="text-xs text-luxury-charcoal">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-luxury-navy">₦{item.unit_price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(order.order_items?.length || 0) > 3 && (
                  <div className="flex items-center justify-center p-3 bg-luxury-cream rounded-lg">
                    <p className="text-sm text-luxury-charcoal">+{(order.order_items?.length || 0) - 3} more items</p>
                  </div>
                )}
              </div>

              {order.shipping_address && (
                <div className="flex items-start gap-2 p-4 bg-luxury-cream rounded-lg">
                  <MapPin className="h-4 w-4 text-luxury-charcoal mt-0.5" />
                  <div>
                    <p className="font-medium text-luxury-navy text-sm">Shipping Address</p>
                    <p className="text-sm text-luxury-charcoal">
                      {order.shipping_name}
                      <br />
                      {order.shipping_address}
                      <br />
                      {order.shipping_city}, {order.shipping_country} {order.shipping_postal_code}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                {order.status === "delivered" && (
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Reorder Items
                  </Button>
                )}
                {order.tracking_number && (
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Track Package
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
