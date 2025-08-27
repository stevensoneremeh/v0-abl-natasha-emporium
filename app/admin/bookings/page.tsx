"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Search, Filter, Eye, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Booking {
  id: string
  booking_reference: string
  property_name: string
  guest_name: string
  guest_email: string
  check_in: string
  check_out: string
  guests: number
  total_amount: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  created_at: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { className: "bg-orange-100 text-orange-800", icon: Clock },
      confirmed: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { className: "bg-red-100 text-red-800", icon: XCircle },
      completed: { className: "bg-blue-100 text-blue-800", icon: CheckCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config?.icon || Clock

    return (
      <Badge className={config?.className || "bg-gray-100 text-gray-800"}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-luxury-gold mx-auto mb-4 animate-pulse" />
          <p className="text-luxury-charcoal">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Bookings Management</h1>
          <p className="text-luxury-charcoal mt-2">Manage all property bookings and reservations</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Bookings", value: stats.total, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Pending", value: stats.pending, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "Confirmed", value: stats.confirmed, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Cancelled", value: stats.cancelled, color: "text-red-600", bgColor: "bg-red-50" },
          { title: "Completed", value: stats.completed, color: "text-purple-600", bgColor: "bg-purple-50" },
          {
            title: "Revenue",
            value: formatCurrency(stats.totalRevenue),
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-luxury">
              <CardContent className="p-4">
                <div className={`p-2 rounded-full ${stat.bgColor} w-fit mb-2`}>
                  <DollarSign className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-luxury-charcoal">{stat.title}</p>
                <p className="text-xl font-bold text-luxury-navy">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Reference</TableHead>
                  <TableHead className="min-w-[150px]">Property</TableHead>
                  <TableHead className="min-w-[150px]">Guest</TableHead>
                  <TableHead className="min-w-[100px]">Check-in</TableHead>
                  <TableHead className="min-w-[100px]">Check-out</TableHead>
                  <TableHead className="min-w-[80px]">Guests</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.booking_reference}</TableCell>
                    <TableCell>{booking.property_name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.guest_name}</p>
                        <p className="text-sm text-luxury-charcoal hidden sm:block">{booking.guest_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(booking.total_amount)}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Eye className="h-4 w-4 sm:mr-0 mr-2" />
                            <span className="sm:hidden">View</span>
                          </Link>
                        </Button>
                        {booking.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-xs"
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs"
                              onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-luxury-charcoal mx-auto mb-4" />
              <p className="text-luxury-charcoal">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
