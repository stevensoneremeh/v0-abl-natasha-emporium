import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, Filter, Download, RefreshCw, CreditCard } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils/currency"
import { redirect } from "next/navigation"
import Link from "next/link"

interface TransactionsPageProps {
  searchParams: {
    page?: string
    status?: string
    search?: string
    payment_method?: string
  }
}

async function getTransactions(params: any) {
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

  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      payment_reference,
      payment_status,
      payment_method,
      total_amount,
      shipping_name,
      shipping_email,
      created_at,
      updated_at
    `)
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.status && params.status !== "all") {
    query = query.eq("payment_status", params.status)
  }

  if (params.payment_method && params.payment_method !== "all") {
    query = query.eq("payment_method", params.payment_method)
  }

  if (params.search) {
    query = query.or(
      `order_number.ilike.%${params.search}%,payment_reference.ilike.%${params.search}%,shipping_email.ilike.%${params.search}%`,
    )
  }

  const { data: transactions, error } = await query.limit(50)

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return transactions || []
}

async function getTransactionStats() {
  const supabase = createServerClient()

  const [
    { data: totalTransactions },
    { data: completedTransactions },
    { data: pendingTransactions },
    { data: failedTransactions },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "completed"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "failed"),
    supabase.from("orders").select("total_amount").eq("payment_status", "completed"),
  ])

  const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  return {
    total: totalTransactions || 0,
    completed: completedTransactions || 0,
    pending: pendingTransactions || 0,
    failed: failedTransactions || 0,
    revenue: totalRevenue,
  }
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const transactions = await getTransactions(searchParams)
  const stats = await getTransactionStats()

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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "paystack":
        return <CreditCard className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Transactions</h1>
          <p className="text-luxury-charcoal mt-2">Monitor payments and transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-luxury-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-navy">{stats.total}</div>
            <p className="text-xs text-luxury-charcoal">All time</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Completed</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-luxury-charcoal">Successful payments</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Pending</CardTitle>
            <div className="h-4 w-4 bg-orange-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-luxury-charcoal">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Failed</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-luxury-charcoal">Failed payments</p>
          </CardContent>
        </Card>

        <Card className="card-luxury">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-luxury-charcoal">Revenue</CardTitle>
            <div className="h-4 w-4 bg-luxury-gold rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-navy">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-luxury-charcoal">Total collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal h-4 w-4" />
                <Input
                  placeholder="Search by order number, reference, or email..."
                  className="pl-10"
                  defaultValue={searchParams.search}
                />
              </div>
            </div>
            <Select defaultValue={searchParams.status || "all"}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue={searchParams.payment_method || "all"}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="paystack">Paystack</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>Recent Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Transaction</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-luxury-cream/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-luxury-navy">#{transaction.order_number}</p>
                          {transaction.payment_reference && (
                            <p className="text-sm text-luxury-charcoal font-mono">
                              {transaction.payment_reference.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-luxury-navy">{transaction.shipping_name}</p>
                          <p className="text-sm text-luxury-charcoal">{transaction.shipping_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-luxury-navy">{formatCurrency(transaction.total_amount)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(transaction.payment_method || "paystack")}
                          <span className="text-sm text-luxury-charcoal capitalize">
                            {transaction.payment_method || "Paystack"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getPaymentStatusColor(transaction.payment_status)}>
                          {transaction.payment_status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-luxury-charcoal">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-luxury-charcoal">
                            {new Date(transaction.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${transaction.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          {transaction.payment_status === "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 bg-transparent"
                            >
                              Refund
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-luxury-charcoal mx-auto mb-4" />
              <p className="text-luxury-charcoal">No transactions found</p>
              <p className="text-sm text-luxury-charcoal mt-2">
                Transactions will appear here once customers make payments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
