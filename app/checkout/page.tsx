"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Truck, Shield, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { initializePayment, generatePaymentReference } from "@/lib/paystack"
import Link from "next/link"
import Image from "next/image"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Nigeria",
    postalCode: "",
  })

  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Nigeria",
    postalCode: "",
  })

  const [notes, setNotes] = useState("")

  // Calculate totals
  const subtotal = total
  const taxAmount = subtotal * 0.075
  const shippingAmount = subtotal >= 50000 ? 0 : 2500
  const totalAmount = subtotal + taxAmount + shippingAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (items.length === 0) {
        throw new Error("Your cart is empty")
      }

      const finalBillingInfo = sameAsBilling ? shippingInfo : billingInfo

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingInfo,
          billingInfo: finalBillingInfo,
          paymentMethod: "paystack",
          notes: notes || undefined,
        }),
      })

      const result = await response.json()

      if (!result.success || !result.orderNumber) {
        throw new Error(result.error || "Failed to create order")
      }

      // Initialize Paystack payment
      const paymentReference = generatePaymentReference()
      const paymentResponse = await initializePayment({
        email: shippingInfo.email,
        amount: totalAmount,
        reference: paymentReference,
        metadata: {
          order_number: result.orderNumber,
          customer_name: shippingInfo.name,
          customer_phone: shippingInfo.phone,
        },
        callback_url: `${window.location.origin}/payment/callback?order=${result.orderNumber}`,
      })

      if (paymentResponse.status && paymentResponse.data?.authorization_url) {
        // Clear cart before redirecting to payment
        clearCart()
        // Redirect to Paystack payment page
        window.location.href = paymentResponse.data.authorization_url
      } else {
        throw new Error(paymentResponse.message || "Failed to initialize payment")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-luxury-navy mb-2">Your cart is empty</h1>
          <p className="text-luxury-charcoal mb-6">Add some products before checking out</p>
          <Link href="/">
            <Button className="btn-luxury">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-luxury-charcoal hover:text-luxury-gold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-luxury-navy">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
              )}

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-luxury-gold" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-name">Full Name *</Label>
                      <Input
                        id="shipping-name"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-email">Email Address *</Label>
                      <Input
                        id="shipping-email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping-phone">Phone Number</Label>
                    <Input
                      id="shipping-phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping-address">Address *</Label>
                    <Input
                      id="shipping-address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo((prev) => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-city">City *</Label>
                      <Input
                        id="shipping-city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo((prev) => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-country">Country *</Label>
                      <Input
                        id="shipping-country"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo((prev) => ({ ...prev, country: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-postal">Postal Code</Label>
                      <Input
                        id="shipping-postal"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo((prev) => ({ ...prev, postalCode: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-luxury-gold" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="same-as-shipping"
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => setSameAsBilling(!!checked)}
                    />
                    <Label htmlFor="same-as-shipping">Same as shipping address</Label>
                  </div>

                  {!sameAsBilling && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-name">Full Name *</Label>
                          <Input
                            id="billing-name"
                            value={billingInfo.name}
                            onChange={(e) => setBillingInfo((prev) => ({ ...prev, name: e.target.value }))}
                            required={!sameAsBilling}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-email">Email Address *</Label>
                          <Input
                            id="billing-email"
                            type="email"
                            value={billingInfo.email}
                            onChange={(e) => setBillingInfo((prev) => ({ ...prev, email: e.target.value }))}
                            required={!sameAsBilling}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billing-address">Address *</Label>
                        <Input
                          id="billing-address"
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo((prev) => ({ ...prev, address: e.target.value }))}
                          required={!sameAsBilling}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-city">City *</Label>
                          <Input
                            id="billing-city"
                            value={billingInfo.city}
                            onChange={(e) => setBillingInfo((prev) => ({ ...prev, city: e.target.value }))}
                            required={!sameAsBilling}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-country">Country *</Label>
                          <Input
                            id="billing-country"
                            value={billingInfo.country}
                            onChange={(e) => setBillingInfo((prev) => ({ ...prev, country: e.target.value }))}
                            required={!sameAsBilling}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-postal">Postal Code</Label>
                          <Input
                            id="billing-postal"
                            value={billingInfo.postalCode}
                            onChange={(e) => setBillingInfo((prev) => ({ ...prev, postalCode: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for your order?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.products?.images?.[0] || "/placeholder.svg?height=48&width=48"}
                            alt={item.products?.name || "Product"}
                            fill
                            className="object-cover rounded"
                          />
                          <Badge className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-navy text-xs px-1 min-w-[1.25rem] h-5">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-luxury-navy line-clamp-2">
                            {item.products?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-luxury-charcoal">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shippingAmount === 0 ? "Free" : formatCurrency(shippingAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (7.5%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Guarantees */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-luxury-charcoal">
                      <Shield className="h-4 w-4 text-luxury-gold" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-luxury-charcoal">
                      <Truck className="h-4 w-4 text-luxury-gold" />
                      <span>Free shipping over ₦50,000</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button type="submit" disabled={isSubmitting} className="w-full btn-luxury text-lg py-6 mt-6">
                    {isSubmitting ? "Processing..." : `Pay with Paystack - ${formatCurrency(totalAmount)}`}
                  </Button>

                  <p className="text-xs text-luxury-charcoal text-center">
                    By placing your order, you agree to our terms and conditions. Payment processed securely by
                    Paystack.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
