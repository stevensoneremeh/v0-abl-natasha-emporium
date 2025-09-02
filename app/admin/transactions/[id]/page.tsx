import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, RefreshCw, AlertTriangle } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils/currency"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

interface TransactionDetailPageProps {
  params: {
    id: string
  }
}

async function getTransactionDetails(id: string) {
  const supabase = createServerClient()

  // Check admin authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || ["talktostevenson@gmail.com"]
  if (!adminEmails.includes(user.email!)) {
    redirect("/unauthorized")
  }

  const { data: transaction, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        product_id,
        product_name,
        product_image,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq("id", id)
    .single()

  if (error || !transaction) {
    return null
  }

  return transaction
}

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const transaction = await getTransactionDetails(params.id)

  if (!transaction) {
    notFound()
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/transactions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-luxury-navy font-playfair">
              Transaction #{transaction.order_number}
            </h1>
            <p className="text-luxury-charcoal">Payment details and transaction history</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          {transaction.payment_status === "completed" && (
            <Button variant="outline" className="text-purple-600 hover:text-purple-700 bg-transparent">
              Process Refund
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Transaction Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Order Number</label>
                  <p className="text-luxury-navy font-medium">#{transaction.order_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Payment Reference</label>
                  <p className="text-luxury-navy font-mono text-sm">
                    {transaction.payment_reference || "Not available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Payment Method</label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-luxury-gold" />
                    <span className="text-luxury-navy capitalize">{transaction.payment_method || "Paystack"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Payment Status</label>
                  <Badge className={getPaymentStatusColor(transaction.payment_status)}>
                    {transaction.payment_status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Transaction Date</label>
                  <p className="text-luxury-navy">
                    {new Date(transaction.created_at).toLocaleDateString()} at{" "}
                    {new Date(transaction.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Last Updated</label>
                  <p className="text-luxury-navy">
                    {new Date(transaction.updated_at).toLocaleDateString()} at{" "}
                    {new Date(transaction.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Customer Name</label>
                  <p className="text-luxury-navy font-medium">{transaction.shipping_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Email Address</label>
                  <p className="text-luxury-navy">{transaction.shipping_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Phone Number</label>
                  <p className="text-luxury-navy">{transaction.shipping_phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-luxury-charcoal">Shipping Address</label>
                  <p className="text-luxury-navy">
                    {transaction.shipping_address}, {transaction.shipping_city}, {transaction.shipping_state}{" "}
                    {transaction.shipping_postal_code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transaction.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-luxury-cream rounded-lg">
                    <div className="w-16 h-16 bg-luxury-cream rounded-lg flex items-center justify-center">
                      {item.product_image ? (
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-luxury-cream rounded-lg" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-luxury-navy">{item.product_name}</h4>
                      <p className="text-sm text-luxury-charcoal">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-luxury-navy">{formatCurrency(item.total_price)}</p>
                      <p className="text-sm text-luxury-charcoal">{formatCurrency(item.unit_price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-luxury-charcoal">Subtotal</span>
                <span className="text-luxury-navy">{formatCurrency(transaction.subtotal_amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-luxury-charcoal">Tax</span>
                <span className="text-luxury-navy">{formatCurrency(transaction.tax_amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-luxury-charcoal">Shipping</span>
                <span className="text-luxury-navy">{formatCurrency(transaction.shipping_amount || 0)}</span>
              </div>
              <div className="border-t border-luxury-cream pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-luxury-navy">Total Amount</span>
                  <span className="font-bold text-luxury-navy text-lg">{formatCurrency(transaction.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Status */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Transaction Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-luxury-charcoal">Payment Status</span>
                <Badge className={getPaymentStatusColor(transaction.payment_status)}>
                  {transaction.payment_status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-luxury-charcoal">Order Status</span>
                <Badge variant="outline">{transaction.status}</Badge>
              </div>

              {transaction.payment_status === "failed" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">Payment Failed</p>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    This transaction failed to process. Customer may need to retry payment.
                  </p>
                </div>
              )}

              {transaction.payment_status === "pending" && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800 font-medium">Payment Pending</p>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    Waiting for payment confirmation from payment provider.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href={`/admin/orders/${transaction.id}`}>View Full Order</Link>
              </Button>
              {transaction.payment_status === "completed" && (
                <Button className="w-full bg-transparent text-purple-600 hover:text-purple-700" variant="outline">
                  Process Refund
                </Button>
              )}
              <Button className="w-full bg-transparent" variant="outline">
                Download Receipt
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
