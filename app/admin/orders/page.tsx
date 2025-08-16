import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, Filter, Download } from "lucide-react"
import { getAllOrders, formatCurrency } from "@/lib/admin"
import Link from "next/link"

interface OrdersPageProps {
  searchParams: {
    page?: string
    status?: string
    search?: string
  }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 20
  const offset = (page - 1) * limit

  const orders = await getAllOrders({
    limit,
    offset,
    status: searchParams.status,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Orders</h1>
          <p className="text-luxury-charcoal mt-2">Manage and track customer orders</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal h-4 w-4" />
                <Input placeholder="Search orders..." className="pl-10" defaultValue={searchParams.search} />
              </div>
            </div>
            <Select defaultValue={searchParams.status || "all"}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-luxury-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-luxury-cream/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-luxury-navy">#{order.order_number}</p>
                          <p className="text-sm text-luxury-charcoal">{order.order_items?.length || 0} items</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-luxury-navy">{order.shipping_name}</p>
                          <p className="text-sm text-luxury-charcoal">{order.shipping_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-luxury-charcoal">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-luxury-navy">{formatCurrency(order.total_amount)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-luxury-charcoal">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {orders.length >= limit && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={page <= 1}>
              Previous
            </Button>
            <span className="px-4 py-2 text-luxury-charcoal">Page {page}</span>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
