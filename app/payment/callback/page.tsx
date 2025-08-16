"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { verifyPayment } from "@/lib/paystack"
import Link from "next/link"

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    const reference = searchParams.get("reference")
    const trxref = searchParams.get("trxref")
    const order = searchParams.get("order")

    const paymentReference = reference || trxref

    if (!paymentReference) {
      setStatus("failed")
      setMessage("Payment reference not found")
      return
    }

    if (order) {
      setOrderNumber(order)
    }

    // Verify payment with Paystack
    verifyPayment(paymentReference)
      .then((response) => {
        if (response.status && response.data?.status === "success") {
          setStatus("success")
          setMessage("Payment successful! Your order has been confirmed.")

          // Redirect to order confirmation after 3 seconds
          setTimeout(() => {
            if (order) {
              router.push(`/order-confirmation?order=${order}`)
            } else {
              router.push("/")
            }
          }, 3000)
        } else {
          setStatus("failed")
          setMessage(response.message || "Payment verification failed")
        }
      })
      .catch((error) => {
        console.error("Payment verification error:", error)
        setStatus("failed")
        setMessage("Failed to verify payment. Please contact support.")
      })
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {status === "loading" && <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />}
              {status === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
              {status === "failed" && <XCircle className="h-6 w-6 text-red-600" />}

              {status === "loading" && "Verifying Payment..."}
              {status === "success" && "Payment Successful!"}
              {status === "failed" && "Payment Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-luxury-charcoal">{message}</p>

            {status === "success" && orderNumber && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">
                  Order Number: <span className="font-semibold">{orderNumber}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Redirecting to order confirmation...</p>
              </div>
            )}

            {status === "failed" && (
              <div className="space-y-3">
                <Link href="/checkout">
                  <Button className="w-full btn-luxury">Try Again</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}

            {status === "loading" && (
              <div className="text-sm text-luxury-charcoal">Please wait while we verify your payment...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
