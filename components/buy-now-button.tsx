"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { initializePayment, generatePaymentReference } from "@/lib/paystack"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types/database"

interface BuyNowButtonProps {
  product: Product
  quantity?: number
  className?: string
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "default" | "lg"
}

export function BuyNowButton({
  product,
  quantity = 1,
  className = "",
  variant = "default",
  size = "default",
}: BuyNowButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, guestId } = useAuth()
  const router = useRouter()

  const handleBuyNow = async () => {
    setIsProcessing(true)

    try {
      // Create a quick order for immediate purchase
      const orderData = {
        items: [
          {
            id: `quick_${Date.now()}`,
            user_id: user?.id || null,
            product_id: product.id,
            quantity,
            price: product.price,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            products: product,
          },
        ],
        paymentMethod: "paystack",
        quickPurchase: true,
      }

      const response = await fetch("/api/orders/quick-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!result.success || !result.orderNumber) {
        throw new Error(result.error || "Failed to create order")
      }

      // Initialize Paystack payment
      const paymentReference = generatePaymentReference()
      const totalAmount = product.price * quantity
      const taxAmount = totalAmount * 0.075
      const shippingAmount = totalAmount >= 50000 ? 0 : 2500
      const finalAmount = totalAmount + taxAmount + shippingAmount

      const paymentResponse = await initializePayment({
        email: user?.email || `guest_${guestId}@ablnatasha.com`,
        amount: finalAmount,
        reference: paymentReference,
        metadata: {
          order_number: result.orderNumber,
          product_name: product.name,
          quantity,
          quick_purchase: true,
        },
        callback_url: `${window.location.origin}/payment/callback?order=${result.orderNumber}`,
      })

      if (paymentResponse.status && paymentResponse.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = paymentResponse.data.authorization_url
      } else {
        throw new Error(paymentResponse.message || "Failed to initialize payment")
      }
    } catch (error) {
      console.error("Buy now error:", error)
      // Fallback to regular checkout
      router.push(`/checkout?product=${product.id}&quantity=${quantity}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button onClick={handleBuyNow} disabled={isProcessing} variant={variant} size={size} className={className}>
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Buy Now
        </>
      )}
    </Button>
  )
}
