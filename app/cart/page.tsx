"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X, ArrowRight, ArrowLeft, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/cart"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, itemCount, total, updateItem, removeItem } = useCart()

  // Calculate totals
  const subtotal = total
  const taxAmount = subtotal * 0.075
  const shippingAmount = subtotal >= 50000 ? 0 : 2500
  const totalAmount = subtotal + taxAmount + shippingAmount

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-cream">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card className="card-luxury">
            <CardContent className="text-center py-16">
              <ShoppingCart className="h-20 w-20 text-luxury-charcoal/50 mx-auto mb-6" />
              <h1 className="font-playfair text-3xl font-bold text-luxury-navy mb-4">Your Cart is Empty</h1>
              <p className="text-luxury-charcoal mb-8 text-lg">
                Discover our luxury collection and add some items to your cart
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-luxury" asChild>
                  <Link href="/">
                    <Package className="mr-2 h-5 w-5" />
                    Browse Products
                  </Link>
                </Button>
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link href="/categories/real-estate">View Real Estate</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-luxury-navy">Shopping Cart</h1>
              <p className="text-luxury-charcoal mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 p-6 bg-luxury-cream rounded-lg"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.products?.images?.[0] || "/placeholder.svg?height=96&width=96"}
                        alt={item.products?.name || "Product"}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-luxury-navy text-lg mb-2">
                        {item.products?.name || "Unknown Product"}
                      </h3>
                      <p className="text-luxury-charcoal mb-4">{formatCurrency(item.price)} each</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 bg-white"
                            onClick={() => updateItem(item.product_id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 bg-white"
                            onClick={() => updateItem(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.product_id)}
                        >
                          <X className="h-5 w-5 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-luxury-navy text-xl">{formatCurrency(item.price * item.quantity)}</p>
                      {item.products?.stock_quantity && item.products.stock_quantity < 10 && (
                        <Badge variant="secondary" className="mt-2">
                          {item.products.stock_quantity} left in stock
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="card-luxury sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingAmount === 0 ? "Free" : formatCurrency(shippingAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7.5%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {subtotal >= 50000 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">🎉 You qualify for free shipping!</p>
                  </div>
                ) : (
                  <div className="bg-luxury-cream border border-luxury-gold/20 rounded-lg p-4">
                    <p className="text-luxury-charcoal">
                      Add <span className="font-semibold">{formatCurrency(50000 - subtotal)}</span> more for free
                      shipping
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button className="w-full btn-luxury text-lg py-6" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="text-center text-sm text-luxury-charcoal">
                  <p>Secure checkout powered by Paystack</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
